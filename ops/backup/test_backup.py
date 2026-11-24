import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import sys
import types
from datetime import datetime, timedelta, timezone

spec = importlib.util.spec_from_file_location("backup", Path(__file__).with_name("backup.py"))
backup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)
sys.path.insert(0, str(Path(__file__).parent))
import drive_mirror


class BackupSafetyTests(unittest.TestCase):
    def test_drive_retention_is_scoped_and_preserves_unresolved_intents(self):
        now = datetime(2026, 11, 24, tzinfo=timezone.utc)
        item = {"parents": ["own-folder"], "appProperties": {"continuumKind": "archive", "continuumCreatedAt": (now-timedelta(days=7)).isoformat()}}
        self.assertTrue(drive_mirror.owned_expired(item, "own-folder", now, 6))
        self.assertFalse(drive_mirror.owned_expired(item, "unrelated-folder", now, 6))
        item["appProperties"]["continuumKind"] = "journal"
        item["appProperties"]["continuumCreatedAt"] = (now-timedelta(days=30)).isoformat()
        self.assertFalse(drive_mirror.owned_expired(item, "own-folder", now, 6))
        item["appProperties"]["continuumCommitted"] = "yes"
        self.assertTrue(drive_mirror.owned_expired(item, "own-folder", now, 6))

    def test_drive_upload_download_checksum_rejects_corrupted_remote_bytes(self):
        class Response:
            def execute(self): return {"files": []}
            def next_chunk(self, **kwargs): return None, {"id": "synthetic-id"}
        class API:
            remote = b"encrypted-synthetic-archive"
            def files(self): return self
            def list(self, **kwargs): return Response()
            def create(self, **kwargs): return Response()
            def get_media(self, **kwargs): return self.remote
        class Download:
            def __init__(self, stream, request, **kwargs): self.stream, self.data = stream, request
            def next_chunk(self, **kwargs): self.stream.write(self.data); return None, True
        fake = types.ModuleType("googleapiclient.http")
        fake.MediaFileUpload = lambda *args, **kwargs: None
        fake.MediaIoBaseDownload = Download
        job = object.__new__(drive_mirror.DriveMirror)
        job.drive, job.folder = API(), "synthetic-folder"
        with tempfile.TemporaryDirectory() as temp, patch.dict(sys.modules, {"googleapiclient.http": fake}):
            path = Path(temp) / "archive.aes"
            path.write_bytes(API.remote)
            job.upload_verified(path, "continuum-postgres/v1/test.tar.aes", "archive", datetime.now(timezone.utc).isoformat())
            job.drive.remote = b"corrupt"
            with self.assertRaisesRegex(ValueError, "DRIVE_CHECKSUM_MISMATCH"):
                job.upload_verified(path, "continuum-postgres/v1/test.tar.aes", "archive", datetime.now(timezone.utc).isoformat())
            self.assertFalse(Path(str(path)+".drive-check").exists())

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
