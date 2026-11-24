"""Internal encrypted erasure journal + safe operational checks. No public endpoint."""
import base64
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
import hashlib
import hmac
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import re
import socket
import threading
import time
import urllib.request
import uuid

JOURNAL_PREFIX = "erasure-journal/v1/"
JOURNAL_MAGIC = b"CONTINUUM-ERASURE-1\n"
UUID = re.compile(r"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$")
RECIPIENT = "continuum.language@gmail.com"
STATE_KEY = "operations-monitor/v1/state.json"


def stamp():
    return datetime.now(timezone.utc).isoformat()


def validate_record(record):
    fields = {"format", "phase", "requestId", "userId", "receiptId", "policyVersion", "createdAt"}
    if set(record) != fields or record["format"] != 1 or record["phase"] not in ("prepared", "committed"):
        raise ValueError("INVALID_JOURNAL")
    if any(not isinstance(record[k], str) or not UUID.fullmatch(record[k]) for k in ("requestId", "userId", "receiptId")):
        raise ValueError("INVALID_JOURNAL")
    if not isinstance(record["policyVersion"], str) or not re.fullmatch(r"[A-Za-z0-9._-]{1,80}", record["policyVersion"]):
        raise ValueError("INVALID_JOURNAL")
    created = datetime.fromisoformat(record["createdAt"])
    if created.tzinfo is None or created > datetime.now(timezone.utc) + timedelta(minutes=5):
        raise ValueError("INVALID_JOURNAL_TIME")
    return record


def envelope(record, key):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    nonce = os.urandom(12)
    return JOURNAL_MAGIC + nonce + AESGCM(key).encrypt(nonce, json.dumps(validate_record(record)).encode(), JOURNAL_MAGIC)


def decode(data, key):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    if not data.startswith(JOURNAL_MAGIC):
        raise ValueError("INVALID_JOURNAL_ENVELOPE")
    offset = len(JOURNAL_MAGIC)
    return validate_record(json.loads(AESGCM(key).decrypt(data[offset:offset+12], data[offset+12:], JOURNAL_MAGIC)))


def request_json(url, *, data=None, headers=None):
    # Fixed destinations only; never forward credentials through redirects.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *args, **kwargs):
            return None
    body = data.encode() if isinstance(data, str) else data
    req = urllib.request.Request(url, data=body, headers=headers or {})
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=15) as response:
        return json.loads(response.read(65536))


def gmail_token():
    import urllib.parse
    form = urllib.parse.urlencode({"client_id": os.environ["AUTH_GMAIL_CLIENT_ID"],
        "client_secret": os.environ["AUTH_GMAIL_CLIENT_SECRET"],
        "refresh_token": os.environ["AUTH_GMAIL_REFRESH_TOKEN"], "grant_type": "refresh_token"})
    value = request_json("https://oauth2.googleapis.com/token", data=form,
                         headers={"Content-Type": "application/x-www-form-urlencoded"})
    token = value.get("access_token")
    if not isinstance(token, str) or not re.fullmatch(r"[A-Za-z0-9._~+/=-]{1,4096}", token):
        raise ValueError("INVALID_AUTH_RESPONSE")
    return token


def send_notice(codes, recovered=False, test=False):
    token = gmail_token()
    message = EmailMessage()
    message["From"] = RECIPIENT
    message["To"] = RECIPIENT
    kind = "monitor test" if test else "recovered" if recovered else "action required"
    message["Subject"] = "Continuum operations: " + kind
    message.set_content("Continuum operational monitor\nTime: " + stamp() +
        "\nStatus: " + kind + "\nChecks: " + ", ".join(sorted(codes)) +
        "\nReview Railway > Continuum Language > continuum-operations / continuum-db-backup logs."
        "\nThis notice contains no learner data or credentials. A monitor test does not indicate an outage.")
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    request_json("https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        data=json.dumps({"raw": raw}).encode(),
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})


class Monitor:
    def __init__(self):
        import boto3
        from botocore.config import Config
        self.bucket = os.environ["BACKUP_S3_BUCKET"]
        key = os.environ["BACKUP_ENCRYPTION_KEY"]
        if not re.fullmatch(r"[a-fA-F0-9]{64}", key):
            raise ValueError("INVALID_JOURNAL_KEY")
        self.key = bytes.fromhex(key)
        self.s3 = boto3.client("s3", endpoint_url=os.environ["BACKUP_S3_ENDPOINT"],
            region_name=os.environ.get("AWS_DEFAULT_REGION", "auto"),
            config=Config(connect_timeout=10, read_timeout=20, retries={"max_attempts": 2}, s3={"addressing_style": "virtual"}))

    def put_journal(self, record):
        record = validate_record(record)
        key = JOURNAL_PREFIX + record["requestId"] + "/" + record["phase"] + ".aes"
        self.s3.put_object(Bucket=self.bucket, Key=key, Body=envelope(record, self.key), ContentType="application/octet-stream")

    def journal_self_test(self):
        record = {"format": 1, "phase": "prepared", "requestId": str(uuid.uuid4()),
                  "userId": str(uuid.uuid4()), "receiptId": str(uuid.uuid4()),
                  "policyVersion": "operations-self-test", "createdAt": stamp()}
        keys = []
        try:
            for phase in ("prepared", "committed"):
                item = {**record, "phase": phase}
                name = "operations-self-test/v1/" + item["requestId"] + "/" + phase + ".aes"
                keys.append(name)
                self.s3.put_object(Bucket=self.bucket, Key=name, Body=envelope(item, self.key), ContentType="application/octet-stream")
                raw = self.s3.get_object(Bucket=self.bucket, Key=name)["Body"].read(8192)
                if decode(raw, self.key) != item:
                    raise ValueError("JOURNAL_SELF_TEST_FAILED")
            print("ERASURE_JOURNAL_STORAGE_VERIFIED", flush=True)
        finally:
            for name in keys:
                self.s3.delete_object(Bucket=self.bucket, Key=name)

    def expire_backups(self):
        pattern = re.compile(r"^continuum-postgres/v1/\d{8}T\d{6}Z-[0-9a-f]{32}\.tar\.aes$")
        cutoff = datetime.now(timezone.utc) - timedelta(days=6)
        for page in self.s3.get_paginator("list_objects_v2").paginate(Bucket=self.bucket, Prefix="continuum-postgres/v1/"):
            for obj in page.get("Contents", []):
                if pattern.fullmatch(obj["Key"]) and obj["LastModified"] < cutoff:
                    self.s3.delete_object(Bucket=self.bucket, Key=obj["Key"])

    def read_json(self, key):
        return json.loads(self.s3.get_object(Bucket=self.bucket, Key=key)["Body"].read(65536))

    def reconcile_journal(self, conn):
        codes = []
        items = {}
        for page in self.s3.get_paginator("list_objects_v2").paginate(Bucket=self.bucket, Prefix=JOURNAL_PREFIX):
            for obj in page.get("Contents", []):
                if obj["Key"].endswith(("/prepared.aes", "/committed.aes")):
                    record = decode(self.s3.get_object(Bucket=self.bucket, Key=obj["Key"])["Body"].read(8192), self.key)
                    items.setdefault(record["requestId"], {})[record["phase"]] = (record, obj["Key"])
        with conn.cursor() as cur:
            for group in items.values():
                prepared = group.get("prepared")
                committed = group.get("committed")
                if not prepared:
                    codes.append("ERASURE_JOURNAL_INCOMPLETE")
                    continue
                record = prepared[0]
                if not committed:
                    cur.execute("SELECT receipt_id FROM account_deletion_requests WHERE id=%s AND status='completed'", (record["requestId"],))
                    row = cur.fetchone()
                    if row and str(row[0]) == record["receiptId"]:
                        cur.execute("SELECT 1 FROM users WHERE id=%s", (record["userId"],))
                        if not cur.fetchone():
                            updated = {**record, "phase": "committed"}
                            self.put_journal(updated)
                            committed = (updated, JOURNAL_PREFIX + record["requestId"] + "/committed.aes")
                    if not committed and datetime.fromisoformat(record["createdAt"]) < datetime.now(timezone.utc) - timedelta(minutes=15):
                        codes.append("ERASURE_JOURNAL_RECONCILIATION_REQUIRED")
                # Six-day DB retention plus two days for clock/recovery margin.
                if committed and datetime.fromisoformat(committed[0]["createdAt"]) < datetime.now(timezone.utc) - timedelta(days=8):
                    for entry in (prepared, committed):
                        self.s3.delete_object(Bucket=self.bucket, Key=entry[1])
        return codes

    def scan(self):
        codes = []
        try:
            if request_json("https://continuum-language-production.up.railway.app/api/health").get("ok") is not True:
                codes.append("APP_HEALTH_FAILED")
        except Exception:
            codes.append("APP_HEALTH_FAILED")
        try:
            latest = self.read_json("continuum-postgres/v1/latest.json")
            if latest.get("status") != "verified" or datetime.fromisoformat(latest["createdAt"]) < datetime.now(timezone.utc) - timedelta(hours=26):
                codes.append("BACKUP_MISSING_OR_STALE")
        except Exception:
            codes.append("BACKUP_MISSING_OR_STALE")
        try:
            attempt = self.read_json("continuum-postgres/v1/last-attempt.json")
            if attempt["status"] == "failed":
                codes.append("BACKUP_LAST_ATTEMPT_FAILED")
            elif attempt["status"] == "running" and datetime.fromisoformat(attempt["checkedAt"]) < datetime.now(timezone.utc) - timedelta(minutes=30):
                codes.append("BACKUP_STALLED")
        except Exception as error:
            if getattr(error, "response", {}).get("Error", {}).get("Code") not in ("NoSuchKey", "404"):
                codes.append("BACKUP_ATTEMPT_CHECK_FAILED")
        try:
            import psycopg2
            with psycopg2.connect(host=os.environ["PGHOST"], port=os.environ["PGPORT"], user=os.environ["PGUSER"],
                    password=os.environ["PGPASSWORD"], dbname=os.environ["PGDATABASE"], connect_timeout=10,
                    options="-c default_transaction_read_only=on -c statement_timeout=10000") as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT count(*) FROM transactional_mail_outbox WHERE status='pending' AND expires_at>now() AND created_at<now()-interval '15 minutes'")
                    if cur.fetchone()[0]:
                        codes.append("TRANSACTIONAL_MAIL_DELAYED")
                codes.extend(self.reconcile_journal(conn))
        except Exception:
            codes.append("DATABASE_OR_JOURNAL_CHECK_FAILED")
        try:
            gmail_token()
        except Exception:
            codes.append("GMAIL_AUTHORIZATION_FAILED")
        return sorted(set(codes))

    def tick(self):
        codes = self.scan()
        self.expire_backups()
        state = {}
        try:
            state = self.read_json(STATE_KEY)
        except Exception as error:
            # Missing state is only expected on the first run; other errors fail closed.
            if getattr(error, "response", {}).get("Error", {}).get("Code") not in ("NoSuchKey", "404"):
                raise
        previous = state.get("codes", [])
        due = not state.get("lastNoticeAt") or datetime.fromisoformat(state["lastNoticeAt"]) < datetime.now(timezone.utc) - timedelta(hours=6)
        test = not state.get("testAcceptedAt")
        if test or (codes and (codes != previous or due)) or (previous and not codes):
            try:
                send_notice(codes or ["ALL_CHECKS_OK"], recovered=bool(previous and not codes), test=test)
                state["lastNoticeAt"] = stamp()
                if test:
                    state["testAcceptedAt"] = stamp()
                print("OPS_NOTICE_PROVIDER_ACCEPTED " + ("TEST" if test else "RECOVERY" if not codes else "ALERT"), flush=True)
            except Exception:
                print("OPS_NOTICE_FAILED", flush=True)
                # Preserve previous state so an undelivered recovery notice retries.
                return
        state.update({"checkedAt": stamp(), "codes": codes})
        self.s3.put_object(Bucket=self.bucket, Key=STATE_KEY, Body=json.dumps(state).encode(), ContentType="application/json")
        print("OPS_CHECK " + json.dumps({"checkedAt": state["checkedAt"], "codes": codes}), flush=True)


def main():
    monitor = Monitor()
    token = os.environ["ERASURE_JOURNAL_TOKEN"]
    if not re.fullmatch(r"[a-f0-9]{64}", token):
        raise ValueError("INVALID_INTERNAL_TOKEN")
    monitor.journal_self_test()

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_GET(self):
            if self.path == "/status":
                if not hmac.compare_digest(self.headers.get("Authorization", ""), "Bearer " + token):
                    self.send_error(403)
                    return
                try:
                    state = monitor.read_json(STATE_KEY)
                    checked = datetime.fromisoformat(state["checkedAt"])
                    ok = not state["codes"] and checked > datetime.now(timezone.utc) - timedelta(minutes=45)
                    body = json.dumps({"ok": ok, "checkedAt": state["checkedAt"]}).encode()
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                except Exception:
                    self.send_error(503)
                return
            self.send_response(200 if self.path == "/health" else 404)
            self.end_headers()

        def do_POST(self):
            if self.path != "/journal" or not hmac.compare_digest(self.headers.get("Authorization", ""), "Bearer " + token):
                self.send_error(403)
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if not 0 < length <= 4096:
                    raise ValueError("INVALID_BODY")
                monitor.put_journal(json.loads(self.rfile.read(length)))
                self.send_response(204)
                self.end_headers()
            except Exception:
                self.send_error(503)

    def loop():
        while True:
            try:
                monitor.tick()
            except Exception:
                print("OPS_CHECK_FAILED", flush=True)
            time.sleep(900)

    threading.Thread(target=loop, daemon=True).start()
    class IPv6Server(ThreadingHTTPServer):
        address_family = socket.AF_INET6
    IPv6Server(("::", 8080), Handler).serve_forever()


if __name__ == "__main__":
    try:
        main()
    except Exception:
        print("OPS_START_FAILED", flush=True)
        raise SystemExit(1)
