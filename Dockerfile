FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends python3-boto3 python3-psycopg2 python3-cryptography \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /operations
COPY monitor.py /operations/monitor.py
ENTRYPOINT ["/usr/bin/python3", "/operations/monitor.py"]
