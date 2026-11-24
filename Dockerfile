FROM postgres:18-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-boto3 python3-psycopg2 python3-cryptography python3-googleapi python3-google-auth-httplib2 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /backup
COPY backup.py /backup/backup.py
COPY recovery.py /backup/recovery.py
COPY drive_mirror.py /backup/drive_mirror.py
ENTRYPOINT ["python3", "/backup/backup.py"]
