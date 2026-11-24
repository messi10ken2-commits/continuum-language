import importlib.util
import io
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
from datetime import datetime, timezone

spec = importlib.util.spec_from_file_location("monitor", Path(__file__).with_name("monitor.py"))
monitor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(monitor)
sys.path.insert(0, str(Path(__file__).parents[1] / "backup"))
import recovery

RECORD = {"format": 1, "phase": "prepared", "requestId": "10000000-0000-0000-0000-000000000001",
          "userId": "20000000-0000-0000-0000-000000000002", "receiptId": "30000000-0000-0000-0000-000000000003",
          "policyVersion": "test-v1", "createdAt": datetime.now(timezone.utc).isoformat()}


class SafetyTests(unittest.TestCase):
    def test_journal_is_authenticated_and_rejects_extra_identity_fields(self):
        from cryptography.exceptions import InvalidTag
        key = bytes.fromhex("a" * 64)
        data = monitor.envelope(RECORD, key)
        self.assertNotIn(RECORD["userId"].encode(), data)
        self.assertEqual(RECORD, monitor.decode(data, key))
        with self.assertRaises(InvalidTag):
            monitor.decode(data, bytes.fromhex("b" * 64))
        with self.assertRaises(ValueError):
            monitor.envelope({**RECORD, "email": "not-allowed@example.test"}, key)
        class S3:
            def get_paginator(self, name): return self
            def paginate(self, **kwargs): return [{"Contents": [{"Key": recovery.PREFIX + RECORD["requestId"] + "/prepared.aes"}]}]
            def get_object(self, **kwargs): return {"Body": io.BytesIO(data)}
        self.assertEqual([RECORD], recovery.read_journal(S3(), "synthetic-bucket", key))

    def test_recovery_refuses_a_production_target(self):
        class Conn:
            class info:
                host = "postgres.railway.internal"
                port = 5432
        with self.assertRaisesRegex(ValueError, "ISOLATED_RESTORE_REQUIRED"):
            recovery.review_restored(Conn(), None, "bucket", b"k" * 32)

    def test_old_restore_blocks_promotion_and_invalidates_credentials_and_mail(self):
        class Conn:
            class info:
                host = "/tmp/continuum-backup-synthetic/socket"
                port = 55432
            statements = []
            def cursor(self): return self
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def execute(self, query, args=None): self.statements.append(query)
            def fetchone(self): return [1]
        conn = Conn()
        with patch.object(recovery, "read_journal", return_value=[RECORD]):
            report = recovery.review_restored(conn, None, "bucket", b"k" * 32)
        self.assertTrue(report["promotionBlocked"])
        self.assertEqual(report["accountsRequiringReplay"], 1)
        self.assertIn("DELETE FROM sessions", conn.statements)
        self.assertIn("DELETE FROM account_recovery_tokens", conn.statements)
        self.assertTrue(any("status='expired'" in q for q in conn.statements))

    def test_notice_cooldown_recovery_and_failed_delivery_retry(self):
        job = object.__new__(monitor.Monitor)
        state = {"testAcceptedAt": monitor.stamp(), "codes": [], "lastNoticeAt": monitor.stamp()}
        job.read_json = lambda _: dict(state)
        job.scan = lambda: ["BACKUP_MISSING_OR_STALE"]
        job.bucket = "synthetic-bucket"
        job.expire_backups = lambda: None
        class S3:
            def put_object(self, **kwargs):
                state.update(json.loads(kwargs["Body"]))
        job.s3 = S3()
        with patch.object(monitor, "send_notice") as send:
            job.tick(); self.assertEqual(send.call_count, 1)
            job.tick(); self.assertEqual(send.call_count, 1)
            job.scan = lambda: []
            send.side_effect = RuntimeError("synthetic delivery failure")
            job.tick(); self.assertEqual(state["codes"], ["BACKUP_MISSING_OR_STALE"])
            send.side_effect = None
            job.tick(); self.assertEqual(state["codes"], [])
            self.assertTrue(send.call_args.kwargs["recovered"])


if __name__ == "__main__":
    unittest.main()
