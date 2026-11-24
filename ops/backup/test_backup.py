import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from datetime import datetime, timedelta, timezone

spec = importlib.util.spec_from_file_location("backup", Path(__file__).with_name("backup.py"))
backup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)


class BackupSafetyTests(unittest.TestCase):
    def test_encryption_roundtrip_rejects_tampering_and_wrong_key(self):
        from cryptography.exceptions import InvalidTag
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            original, encrypted, decoded = [root / name for name in ("original", "encrypted", "decoded")]
            data = b"synthetic-account-progress\n" + os.urandom(2 * backup.CHUNK + 37)
            original.write_bytes(data)
            key = os.urandom(32)
            backup.crypt_file(original, encrypted, key)
            self.assertNotIn(b"synthetic-account-progress", encrypted.read_bytes())
            backup.crypt_file(encrypted, decoded, key, decrypt=True)
            self.assertEqual(data, decoded.read_bytes())
            with self.assertRaises(InvalidTag):
                backup.crypt_file(encrypted, decoded, os.urandom(32), decrypt=True)
            corrupt = bytearray(encrypted.read_bytes())
            corrupt[len(backup.MAGIC) + 20] ^= 1
            encrypted.write_bytes(corrupt)
            with self.assertRaises(InvalidTag):
                backup.crypt_file(encrypted, decoded, key, decrypt=True)

    def test_retention_deletes_only_expired_managed_archives(self):
        now = datetime(2026, 11, 24, tzinfo=timezone.utc)
        managed = backup.PREFIX + "20261110T010000Z-" + "a" * 32 + ".tar.aes"
        objects = [
            {"Key": managed, "LastModified": now - timedelta(days=7)},
            {"Key": managed.replace("a" * 32, "b" * 32), "LastModified": now - timedelta(days=6)},
            {"Key": backup.PREFIX + "latest.json", "LastModified": now - timedelta(days=100)},
            {"Key": "other-project/" + managed, "LastModified": now - timedelta(days=100)},
            {"Key": backup.PREFIX + "manual-keep.tar.aes", "LastModified": now - timedelta(days=100)},
        ]
        self.assertEqual([managed], backup.expired_keys(objects, now, 6))


if __name__ == "__main__":
    unittest.main()
