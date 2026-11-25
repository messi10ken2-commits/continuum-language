"""Optional Google Drive mirror; scope is drive.file, separate from Gmail refresh token."""
from datetime import datetime, timedelta, timezone
import hashlib
import io
import os
from pathlib import Path
import re

ROOT_QUERY = "trashed=false and mimeType='application/vnd.google-apps.folder' and appProperties has {key='continuumRole' and value='backup-root-v1'}"


def checksum(path):
    h = hashlib.sha256()
    with open(path, "rb") as src:
        for chunk in iter(lambda: src.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def owned_expired(item, folder, now, days):
    props = item.get("appProperties", {})
    if folder not in item.get("parents", []) or props.get("continuumKind") not in ("archive", "journal"):
        return False
    created = datetime.fromisoformat(props["continuumCreatedAt"])
    if created.tzinfo is None:
        raise ValueError("INVALID_MIRROR_TIME")
    retention = days if props["continuumKind"] == "archive" else 8
    # Uncommitted intents must not be dropped while reconciliation is outstanding.
    if props["continuumKind"] == "journal" and props.get("continuumCommitted") != "yes":
        return False
    return created < now - timedelta(days=retention)


class DriveMirror:
    def __init__(self):
        from google.oauth2.credentials import Credentials
        from google_auth_httplib2 import AuthorizedHttp
        from googleapiclient.discovery import build
        import httplib2
        credentials = Credentials(None, refresh_token=os.environ["DRIVE_REFRESH_TOKEN"],
            token_uri="https://oauth2.googleapis.com/token", client_id=os.environ["DRIVE_CLIENT_ID"],
            client_secret=os.environ["DRIVE_CLIENT_SECRET"])
        http = httplib2.Http(timeout=120)
        # Drive uses 308 to acknowledge incomplete resumable uploads.
        http.redirect_codes = http.redirect_codes - {308}
        self.drive = build("drive", "v3", http=AuthorizedHttp(credentials, http=http), cache_discovery=False)
        folders = self.drive.files().list(q=ROOT_QUERY, fields="files(id)", pageSize=100).execute()["files"]
        if len(folders) > 1:
            raise ValueError("AMBIGUOUS_BACKUP_FOLDER")
        self.folder = folders[0]["id"] if folders else self.drive.files().create(body={
            "name": "Continuum encrypted backups", "mimeType": "application/vnd.google-apps.folder",
            "appProperties": {"continuumRole": "backup-root-v1"}}, fields="id").execute()["id"]

    def upload_verified(self, path, key, kind, created_at, *, committed=False):
        from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
        if not re.fullmatch(r"[A-Za-z0-9/._-]{1,120}", key):
            raise ValueError("INVALID_MIRROR_KEY")
        query = "trashed=false and '" + self.folder + "' in parents and appProperties has {key='continuumKey' and value='" + key + "'}"
        matches = self.drive.files().list(q=query, fields="files(id)", pageSize=100).execute()["files"]
        if len(matches) > 1:
            raise ValueError("DUPLICATE_MIRROR_OBJECT")
        props = {"continuumKey": key, "continuumKind": kind, "continuumCreatedAt": created_at,
                 "continuumCommitted": "yes" if committed else "no"}
        media = MediaFileUpload(str(path), mimetype="application/octet-stream", chunksize=8*1024*1024, resumable=True)
        body = {"name": key.replace("/", "__"), "appProperties": props}
        if matches:
            request = self.drive.files().update(fileId=matches[0]["id"], body=body, media_body=media, fields="id")
        else:
            request = self.drive.files().create(body={**body, "parents": [self.folder]}, media_body=media, fields="id")
        response = None
        while response is None:
            _, response = request.next_chunk(num_retries=3)
        target = Path(str(path) + ".drive-check")
        try:
            with open(target, "wb") as stream:
                download = MediaIoBaseDownload(stream, self.drive.files().get_media(fileId=response["id"]), chunksize=8*1024*1024)
                done = False
                while not done:
                    _, done = download.next_chunk(num_retries=3)
            if checksum(target) != checksum(path):
                raise ValueError("DRIVE_CHECKSUM_MISMATCH")
        finally:
            target.unlink(missing_ok=True)

    def expire(self, retention_days):
        page = None
        while True:
            result = self.drive.files().list(q="trashed=false and '" + self.folder + "' in parents",
                fields="nextPageToken,files(id,parents,appProperties)", pageSize=1000, pageToken=page).execute()
            for item in result.get("files", []):
                if owned_expired(item, self.folder, datetime.now(timezone.utc), retention_days):
                    self.drive.files().delete(fileId=item["id"]).execute()
            page = result.get("nextPageToken")
            if not page:
                break


def mirror_to_drive(archive, object_key, created_at, root, s3, bucket, encryption_key, retention_days):
    from recovery import read_journal, PREFIX
    mirror = DriveMirror()
    mirror.upload_verified(archive, object_key, "archive", created_at)
    records = read_journal(s3, bucket, encryption_key)
    committed = {r["requestId"] for r in records if r["phase"] == "committed"}
    for record in records:
        key = PREFIX + record["requestId"] + "/" + record["phase"] + ".aes"
        path = root / "journal-mirror.aes"
        path.write_bytes(s3.get_object(Bucket=bucket, Key=key)["Body"].read(8192))
        mirror.upload_verified(path, key, "journal", record["createdAt"], committed=record["requestId"] in committed)
    mirror.expire(retention_days)
