FROM postgres:18-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-boto3 python3-psycopg2 python3-cryptography \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /backup
COPY ops/backup/backup.py /backup/backup.py
ENTRYPOINT ["python3", "/backup/backup.py"]
