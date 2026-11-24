# Hobby PostgreSQL backup operations

24 November follow-up: see `docs/ios/OPERATIONS_CLOSEOUT_JA.md` for the deployed
15-minute monitor, independent hourly condition watch, encrypted erasure journal,
isolated restore credential cleanup and optional Google Drive mirror. The Drive
mirror requires separate `drive.file` authorization; it is not activated without
DRIVE_BACKUP_ENABLED=true plus DRIVE_CLIENT_ID/SECRET/REFRESH_TOKEN.
The monitor expires old primary archives even when the backup job fails. The source
deployment now also needs `recovery.py` and `drive_mirror.py` from this directory.

Dedicated Railway cron service, PostgreSQL 18 client and temporary local PostgreSQL 18
cluster. No web server, public domain, persistent restore volume, application worker,
mail credential or payment credential. The web service and production DB are not
redeployed by this service. A private Railway bucket is the initial storage destination;
this is a separate copy from the DB volume, **not an independent provider/account**.
Deleting the whole project can lose both. Independent offsite storage remains future work.

## Run and evidence

Dockerfile: `ops/backup/Dockerfile` (build context is `ops/backup`).
The deployed `deploy/hobby-database-backup` branch contains only the files from this
directory at its root. It is an intentional service projection, pinned by commit;
it excludes the web app's root railway.json so the app config cannot override the job.
Set Dockerfile path `Dockerfile` directly on the backup service. Do not merge that
deployment branch into main; review the source changes under ops/backup instead.
Entrypoint: `python3 /backup/backup.py`. One shot, restart policy NEVER.
Cron: `0 18 * * *` UTC = 03:00 Japan / 02:00 Malaysia, daily.
No subscription upgrade; execution, storage and service upload traffic incur usage charges.

Required variables on the **backup service only**:

| Variable | Value source |
| --- | --- |
| PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE | Matching `${{Postgres.PGHOST}}` etc. |
| BACKUP_S3_ENDPOINT | `${{continuum-db-backups.ENDPOINT}}` |
| BACKUP_S3_BUCKET | `${{continuum-db-backups.BUCKET}}` |
| AWS_DEFAULT_REGION | `${{continuum-db-backups.REGION}}` |
| AWS_ACCESS_KEY_ID | `${{continuum-db-backups.ACCESS_KEY_ID}}` |
| AWS_SECRET_ACCESS_KEY | `${{continuum-db-backups.SECRET_ACCESS_KEY}}` |
| BACKUP_ENCRYPTION_KEY | Dedicated random 32-byte key, 64 hexadecimal characters |
| BACKUP_RETENTION_DAYS | `6` initially (daily tier; no weekly/monthly tier yet) |

Keep an independent secure copy of the encryption key and bucket recovery information
in the operator's password manager. Do not post these in chat, commit them or rotate
the key while existing backups still need it. This key is separate from MAIL_OUTBOX_KEY.
Application secrets (especially MAIL_OUTBOX_KEY) also need secure independent recovery:
the DB dump does not include Railway variables, roles/passwords or repository files.

Each run:

1. Open a read-only repeatable-read source transaction and export its snapshot.
2. Count user tables/materialized views and run pg_dump using that same snapshot.
3. Bundle dump and internal manifest; encrypt with AES-256-GCM, upload privately.
4. Download stored object; compare checksum, authenticate/decrypt, validate manifest.
5. Restore **only into a freshly initialized local Unix-socket PostgreSQL cluster**.
   Source PG variables are not passed to restore commands. No configurable target URL.
6. Require pg_restore success and all table row counts to match the original snapshot.
7. Remove expired archives under the dedicated managed prefix, update latest.json,
   log `BACKUP_VERIFIED` with timestamps/count totals/checksum and exit 0.

`BACKUP_FAILED` and nonzero exit indicate failure. No raw exceptions, SQL errors,
credentials, personal records or dump content are logged. Retention cleanup happens
on successful runs: persistent failures require incident response so old archives do
not exceed the published retention policy. `latest.json` is evidence for its timestamp,
not proof that subsequent scheduled runs completed. Check the Railway cron execution
history and require latest verified age under 26 hours. Proactive alert delivery is
not set up by this change; configure Railway's deployment/cron notifications separately.

## Recovery drill and incident recovery

Every successful daily run already tests restoring the **downloaded** stored object.
It verifies archive integrity, schema/constraints accepted by pg_restore and all table
row counts, not every UI workflow, individual cell hash or cross-system transaction.
There is no automatic production promotion or restore-over-production command.

For an incident, recover the encrypted `.tar.aes` and independent key in an isolated
trusted environment. `crypt_file(..., decrypt=True)` authenticates the envelope; extract
only database.dump and manifest.json, verify dumpSha256, and restore with PostgreSQL 18
into a newly created isolated database. Restore application code and secrets separately.
Review independent account-erasure records and apply deletions before opening traffic.
Invalidate restored sessions/reset links and expire old queued mail before enabling any
worker. The app must remain disconnected during this review. Only then prepare an
explicit production connection switch and rollback plan. Do not use production as the
target of an experimental restore.

Deletion requests fulfilled after the selected backup can be resurrected by recovery.
The independent deletion journal remains an operator responsibility; a receipt stored
inside the same historical backup cannot prove later deletions. Uploaded/media files
outside PostgreSQL are not included. Normal RPO is up to 24 hours plus job duration;
RTO is not promised until application-level recovery is rehearsed.

Local unit checks: `python3 -m unittest discover -s ops/backup -p 'test_*.py'`.
Live evidence is `BACKUP_VERIFIED` from the deployed cron run, not a unit test pass.
