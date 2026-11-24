"""One-shot encrypted backup and isolated restore drill. No app worker runs here."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
import uuid
from datetime import datetime, timedelta, timezone

MAGIC = b"CONTINUUM-BACKUP-1\n"
PREFIX = "continuum-postgres/v1/"
CHUNK = 1024 * 1024
ATTEMPT = None


def report_attempt(status, code=None):
    if ATTEMPT:
        s3, bucket = ATTEMPT
        s3.put_object(Bucket=bucket, Key=PREFIX + "last-attempt.json",
            Body=json.dumps({"status": status, "checkedAt": datetime.now(timezone.utc).isoformat(), "code": code}).encode(),
            ContentType="application/json")


def digest(path):
    h = hashlib.sha256()
    with open(path, "rb") as source:
        for block in iter(lambda: source.read(CHUNK), b""):
            h.update(block)
    return h.hexdigest()


def crypt_file(source, target, key, decrypt=False):
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    with open(source, "rb") as src, open(target, "wb") as dst:
        if decrypt:
            if src.read(len(MAGIC)) != MAGIC:
                raise RuntimeError("INVALID_ARCHIVE")
            nonce = src.read(12)
            remaining = os.path.getsize(source) - len(MAGIC) - 12 - 16
            if remaining < 0:
                raise RuntimeError("INVALID_ARCHIVE")
            src.seek(-16, 2)
            tag = src.read(16)
            src.seek(len(MAGIC) + 12)
            cipher = Cipher(algorithms.AES(key), modes.GCM(nonce, tag)).decryptor()
            cipher.authenticate_additional_data(MAGIC)
            while remaining:
                block = src.read(min(CHUNK, remaining))
                if not block:
                    raise RuntimeError("TRUNCATED_ARCHIVE")
                remaining -= len(block)
                dst.write(cipher.update(block))
            dst.write(cipher.finalize())
        else:
            nonce = os.urandom(12)
            cipher = Cipher(algorithms.AES(key), modes.GCM(nonce)).encryptor()
            cipher.authenticate_additional_data(MAGIC)
            dst.write(MAGIC + nonce)
            for block in iter(lambda: src.read(CHUNK), b""):
                dst.write(cipher.update(block))
            dst.write(cipher.finalize())
            dst.write(cipher.tag)


def expired_keys(objects, now, retention_days):
    cutoff = now - timedelta(days=retention_days)
    pattern = re.compile(r"^" + re.escape(PREFIX) + r"\d{8}T\d{6}Z-[0-9a-f]{32}\.tar\.aes$")
    return [obj["Key"] for obj in objects
            if pattern.fullmatch(obj["Key"]) and obj["LastModified"] < cutoff]


def run(args, env=None, timeout=1200):
    # Never echo stderr: libpq/provider errors can contain credentials or row data.
    result = subprocess.run(args, env=env, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, timeout=timeout)
    if result.returncode:
        raise RuntimeError("COMMAND_FAILED:" + Path(args[0]).name.upper())
    return result.stdout


def counts(conn):
    from psycopg2 import sql
    with conn.cursor() as cur:
        cur.execute("""SELECT n.nspname,c.relname FROM pg_class c
            JOIN pg_namespace n ON n.oid=c.relnamespace
            WHERE c.relkind IN ('r','p','m') AND n.nspname <> 'information_schema'
            AND n.nspname !~ '^pg_' ORDER BY 1,2""")
        tables = cur.fetchall()
        result = []
        for schema, table in tables:
            cur.execute(sql.SQL("SELECT count(*) FROM {}.{}").format(
                sql.Identifier(schema), sql.Identifier(table)))
            result.append([schema, table, cur.fetchone()[0]])
        return result


def isolated_restore(dump, expected, root, review=None):
    import psycopg2
    # Always create a new local cluster; there is no restore-target URL input.
    cluster = root / "restore-cluster"
    socket = root / "socket"
    socket.mkdir()
    shutil.chown(root, user="postgres", group="postgres")
    shutil.chown(socket, user="postgres", group="postgres")
    os.chmod(root, 0o700)
    local = {"PATH": os.environ["PATH"], "HOME": "/var/lib/postgresql",
             "PGHOST": str(socket), "PGPORT": "55432", "PGUSER": "postgres",
             "PGDATABASE": "postgres", "LC_ALL": "C.UTF-8"}
    run(["gosu", "postgres", "initdb", "-D", str(cluster), "--auth-local=trust",
         "--auth-host=reject", "--encoding=UTF8", "--locale=C.UTF-8"], env=local)
    started = False
    try:
        run(["gosu", "postgres", "pg_ctl", "-D", str(cluster), "-l", str(root / "restore.log"),
             "-o", f"-k {socket} -p 55432 -c listen_addresses='' -c max_connections=10 -c shared_buffers=32MB",
             "-w", "start"], env=local)
        started = True
        run(["pg_restore", "--exit-on-error", "--no-owner", "--no-privileges",
             "--dbname=postgres", str(dump)], env=local)
        with psycopg2.connect(host=str(socket), port=55432, user="postgres", dbname="postgres") as conn:
            if counts(conn) != expected:
                raise RuntimeError("RESTORE_ROW_COUNTS_MISMATCH")
            return review(conn) if review else {}
    finally:
        if started:
            run(["gosu", "postgres", "pg_ctl", "-D", str(cluster), "-m", "immediate", "-w", "stop"], env=local)


def main():
    global ATTEMPT
    import boto3
    from botocore.config import Config
    import psycopg2
    os.umask(0o077)
    required = ["PGHOST", "PGPORT", "PGUSER", "PGPASSWORD", "PGDATABASE",
                "BACKUP_S3_ENDPOINT", "BACKUP_S3_BUCKET", "AWS_ACCESS_KEY_ID",
                "AWS_SECRET_ACCESS_KEY", "BACKUP_ENCRYPTION_KEY"]
    if any(not os.environ.get(name) or "${{" in os.environ[name] for name in required):
        raise RuntimeError("BACKUP_CONFIGURATION_MISSING")
    raw_key = os.environ["BACKUP_ENCRYPTION_KEY"]
    if not re.fullmatch(r"[0-9a-fA-F]{64}", raw_key):
        raise RuntimeError("BACKUP_KEY_INVALID")
    key = bytes.fromhex(raw_key)
    retention = int(os.environ.get("BACKUP_RETENTION_DAYS", "6"))
    if not 1 <= retention <= 89:
        raise RuntimeError("BACKUP_RETENTION_INVALID")
    endpoint = os.environ["BACKUP_S3_ENDPOINT"]
    if not endpoint.startswith("https://"):
        raise RuntimeError("BACKUP_ENDPOINT_REQUIRES_HTTPS")
    s3 = boto3.client("s3", endpoint_url=endpoint,
        region_name=os.environ.get("AWS_DEFAULT_REGION", "auto"),
        config=Config(connect_timeout=15, read_timeout=120, retries={"max_attempts": 3},
                      s3={"addressing_style": os.environ.get("BACKUP_S3_STYLE", "virtual")}))
    bucket = os.environ["BACKUP_S3_BUCKET"]
    ATTEMPT = (s3, bucket)
    report_attempt("running")
    started = time.monotonic()
    now = datetime.now(timezone.utc)
    object_key = PREFIX + now.strftime("%Y%m%dT%H%M%SZ") + "-" + uuid.uuid4().hex + ".tar.aes"
    # Source credentials are never put in command-line arguments or logs.
    pg_env = {k: v for k, v in os.environ.items() if k.startswith("PG") or k in ("PATH", "HOME", "LANG")}
    pg_env["PGCONNECT_TIMEOUT"] = "15"
    pg_env["PGOPTIONS"] = "-c default_transaction_read_only=on -c lock_timeout=10000"
    with tempfile.TemporaryDirectory(prefix="continuum-backup-") as temp:
        root = Path(temp)
        dump = root / "database.dump"
        with psycopg2.connect(host=pg_env["PGHOST"], port=pg_env["PGPORT"],
                user=pg_env["PGUSER"], password=pg_env["PGPASSWORD"],
                dbname=pg_env["PGDATABASE"], connect_timeout=15,
                options="-c statement_timeout=600000 -c lock_timeout=10000") as source:
            source.set_session(isolation_level="REPEATABLE READ", readonly=True)
            with source.cursor() as cur:
                # Advisory lock is session-local and does not change source rows.
                cur.execute("SELECT pg_try_advisory_lock(1129270868, 1111573323)")
                if not cur.fetchone()[0]:
                    raise RuntimeError("BACKUP_ALREADY_RUNNING")
                cur.execute("SELECT pg_export_snapshot()")
                snapshot = cur.fetchone()[0]
                cur.execute("SHOW server_version_num")
                version = int(cur.fetchone()[0])
                if version // 10000 != 18:
                    raise RuntimeError("SOURCE_MAJOR_VERSION_MISMATCH")
            expected = counts(source)
            if not expected:
                raise RuntimeError("SOURCE_DATABASE_EMPTY")
            run(["pg_dump", "--format=custom", "--no-owner", "--no-privileges",
                 "--lock-wait-timeout=10s", "--snapshot=" + snapshot, "--file=" + str(dump)], env=pg_env)
        manifest = {"format": 1, "createdAt": now.isoformat(), "serverVersion": version,
                    "dumpSha256": digest(dump), "tables": expected}
        (root / "manifest.json").write_text(json.dumps(manifest))
        archive = root / "backup.tar"
        with tarfile.open(archive, "w") as tar:
            tar.add(dump, arcname="database.dump")
            tar.add(root / "manifest.json", arcname="manifest.json")
        encrypted = root / "backup.aes"
        crypt_file(archive, encrypted, key)
        s3.upload_file(str(encrypted), bucket, object_key,
                       ExtraArgs={"ContentType": "application/octet-stream"})
        # Verify the actual stored bytes, not just the local dump.
        downloaded = root / "download.aes"
        s3.download_file(bucket, object_key, str(downloaded))
        if digest(downloaded) != digest(encrypted):
            raise RuntimeError("STORED_CHECKSUM_MISMATCH")
        decoded = root / "download.tar"
        crypt_file(downloaded, decoded, key, decrypt=True)
        restored_dump = root / "download.dump"
        with tarfile.open(decoded, "r") as tar:
            members = tar.getmembers()
            if sorted(m.name for m in members) != ["database.dump", "manifest.json"] or not all(m.isfile() for m in members):
                raise RuntimeError("INVALID_ARCHIVE_MEMBERS")
            stored_manifest = json.load(tar.extractfile("manifest.json"))
            with tar.extractfile("database.dump") as src, open(restored_dump, "wb") as dst:
                shutil.copyfileobj(src, dst)
        if stored_manifest != manifest or digest(restored_dump) != manifest["dumpSha256"]:
            raise RuntimeError("DUMP_CHECKSUM_MISMATCH")
        from recovery import review_restored
        recovery_review = isolated_restore(restored_dump, expected, root,
            review=lambda conn: review_restored(conn, s3, bucket, key))
        receipt = {"status": "verified", "createdAt": now.isoformat(),
                   "verifiedAt": datetime.now(timezone.utc).isoformat(),
                   "objectKey": object_key, "sha256": digest(encrypted),
                   "bytes": encrypted.stat().st_size, "tableCount": len(expected),
                   "rowCount": sum(row[2] for row in expected), "retentionDays": retention,
                   "durationSeconds": round(time.monotonic() - started, 2),
                   "recoveryReview": recovery_review}
        offsite_names = ["OFFSITE_S3_ENDPOINT", "OFFSITE_S3_BUCKET", "OFFSITE_ACCESS_KEY_ID", "OFFSITE_SECRET_ACCESS_KEY"]
        configured = [bool(os.environ.get(name)) for name in offsite_names]
        if any(configured) and not all(configured):
            raise RuntimeError("OFFSITE_CONFIGURATION_INCOMPLETE")
        receipt["offsite"] = "not_configured"
        if all(configured):
            if not os.environ["OFFSITE_S3_ENDPOINT"].startswith("https://") or os.environ["OFFSITE_S3_ENDPOINT"] == endpoint:
                raise RuntimeError("OFFSITE_REQUIRES_INDEPENDENT_HTTPS_ENDPOINT")
            secondary = boto3.client("s3", endpoint_url=os.environ["OFFSITE_S3_ENDPOINT"],
                region_name=os.environ.get("OFFSITE_S3_REGION", "auto"),
                aws_access_key_id=os.environ["OFFSITE_ACCESS_KEY_ID"],
                aws_secret_access_key=os.environ["OFFSITE_SECRET_ACCESS_KEY"],
                config=Config(connect_timeout=15, read_timeout=120, retries={"max_attempts": 3},
                    s3={"addressing_style": os.environ.get("OFFSITE_S3_STYLE", "virtual")}))
            offsite_bucket = os.environ["OFFSITE_S3_BUCKET"]
            secondary.upload_file(str(encrypted), offsite_bucket, object_key)
            check = root / "offsite.aes"
            secondary.download_file(offsite_bucket, object_key, str(check))
            if digest(check) != digest(encrypted):
                raise RuntimeError("OFFSITE_CHECKSUM_MISMATCH")
            # Mirror independently held erasure records as well as the DB archive.
            for page in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket, Prefix="erasure-journal/v1/"):
                for item in page.get("Contents", []):
                    raw = s3.get_object(Bucket=bucket, Key=item["Key"])["Body"].read(8192)
                    secondary.put_object(Bucket=offsite_bucket, Key=item["Key"], Body=raw)
                    echoed = secondary.get_object(Bucket=offsite_bucket, Key=item["Key"])["Body"].read(8192)
                    if raw != echoed:
                        raise RuntimeError("OFFSITE_JOURNAL_CHECKSUM_MISMATCH")
            for page in secondary.get_paginator("list_objects_v2").paginate(Bucket=offsite_bucket, Prefix=PREFIX):
                for old_key in expired_keys(page.get("Contents", []), datetime.now(timezone.utc), retention):
                    secondary.delete_object(Bucket=offsite_bucket, Key=old_key)
            from recovery import read_journal
            records = read_journal(secondary, offsite_bucket, key)
            expired_requests = {r["requestId"] for r in records if r["phase"] == "committed"
                and datetime.fromisoformat(r["createdAt"]) < datetime.now(timezone.utc) - timedelta(days=8)}
            for record in records:
                if record["requestId"] in expired_requests:
                    secondary.delete_object(Bucket=offsite_bucket,
                        Key="erasure-journal/v1/" + record["requestId"] + "/" + record["phase"] + ".aes")
            receipt["offsite"] = "verified"
        if os.environ.get("DRIVE_BACKUP_ENABLED") == "true":
            if not all(os.environ.get(name) for name in ("DRIVE_CLIENT_ID", "DRIVE_CLIENT_SECRET", "DRIVE_REFRESH_TOKEN")):
                raise RuntimeError("DRIVE_CONFIGURATION_INCOMPLETE")
            from drive_mirror import mirror_to_drive
            mirror_to_drive(encrypted, object_key, now.isoformat(), root, s3, bucket, key, retention)
            receipt["offsite"] = "google-drive-verified"
        # Expiry runs even for an old unverified upload; never delete other prefixes.
        deleted = 0
        pages = s3.get_paginator("list_objects_v2").paginate(Bucket=bucket, Prefix=PREFIX)
        for page in pages:
            for old_key in expired_keys(page.get("Contents", []), datetime.now(timezone.utc), retention):
                s3.delete_object(Bucket=bucket, Key=old_key)
                deleted += 1
        receipt["expiredObjectsRemoved"] = deleted
        s3.put_object(Bucket=bucket, Key=PREFIX + "latest.json",
                      Body=json.dumps(receipt).encode(), ContentType="application/json")
        print("BACKUP_VERIFIED " + json.dumps(receipt), flush=True)
        report_attempt("verified")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        # Fixed category only: no secrets, SQL contents, identities or raw exceptions.
        category = str(error) if type(error) is RuntimeError and re.fullmatch(r"[A-Z_:]+", str(error)) else type(error).__name__
        print("BACKUP_FAILED " + category, file=sys.stderr, flush=True)
        try:
            report_attempt("failed", category)
        except Exception:
            pass
        sys.exit(1)
