"""Fail-closed review, only on the backup job's disposable local cluster."""
import json
import re
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

MAGIC = b"CONTINUUM-ERASURE-1\n"
PREFIX = "erasure-journal/v1/"
UUID = r"[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}"


def read_journal(s3, bucket, key):
    records = []
    pattern = re.compile(re.escape(PREFIX) + UUID + r"/(prepared|committed)\.aes$")
    for page in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket, Prefix=PREFIX):
        for obj in page.get("Contents", []):
            name = obj["Key"]
            if not pattern.fullmatch(name):
                raise ValueError("UNKNOWN_JOURNAL_OBJECT")
            raw = s3.get_object(Bucket=bucket, Key=name)["Body"].read(8192)
            if not raw.startswith(MAGIC):
                raise ValueError("INVALID_JOURNAL")
            offset = len(MAGIC)
            data = json.loads(AESGCM(key).decrypt(raw[offset:offset+12], raw[offset+12:], MAGIC))
            if data.get("format") != 1 or not re.fullmatch(UUID, data.get("userId", "")) or data.get("phase") not in ("prepared", "committed"):
                raise ValueError("INVALID_JOURNAL")
            if name != PREFIX + data["requestId"] + "/" + data["phase"] + ".aes":
                raise ValueError("JOURNAL_PATH_MISMATCH")
            records.append(data)
    return records


def review_restored(conn, s3, bucket, key):
    # Never accept an arbitrary production connection as a cleanup target.
    if not conn.info.host.startswith("/tmp/continuum-backup-") or not conn.info.host.endswith("/socket") or conn.info.port != 55432:
        raise ValueError("ISOLATED_RESTORE_REQUIRED")
    records = read_journal(s3, bucket, key)
    ids = sorted({r["userId"] for r in records})
    with conn.cursor() as cur:
        cur.execute("SELECT count(*) FROM users WHERE id=ANY(%s::uuid[])", (ids,))
        found = cur.fetchone()[0]
        cur.execute("DELETE FROM sessions")
        cur.execute("DELETE FROM account_recovery_tokens")
        cur.execute("UPDATE transactional_mail_outbox SET status='expired',payload=NULL,lease_until=NULL WHERE status='pending'")
    return {"journalRecordsChecked": len(records), "accountsRequiringReplay": found,
            "promotionBlocked": bool(found), "restoredSessionsAndResetLinksCleared": True,
            "restoredPendingMailExpired": True}
