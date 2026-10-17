"""Read-only credential checks plus one optional low-cost API request.

Safe for a public repository: NEVER print API keys, account IDs, emails, names,
raw API responses or request headers. No Buffer/SNS publishing code is invoked.
"""
import json
import os
import sys
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

API_BASE = "https://api.openai.com"
KEY = os.environ.get("OPENAI_API_KEY", "").strip()
ORG = os.environ.get("EXPECTED_OPENAI_ORG_ID", "").strip()
PROJECT = os.environ.get("EXPECTED_OPENAI_PROJECT_ID", "").strip()
MODEL = os.environ.get("OPENAI_MODEL", "").strip() or "gpt-4.1-mini"
TEST = os.environ.get("RUN_BILLABLE_TEST", "false").lower() == "true"

def call(label, method, route, payload=None, scoped=False):
    headers = {
        "Authorization": "Bearer " + KEY,
        "Content-Type": "application/json",
        "User-Agent": "Continuum-Kotoba-Billing-Diagnostic/1.0",
    }
    if scoped:
        if ORG:
            headers["OpenAI-Organization"] = ORG
        if PROJECT:
            headers["OpenAI-Project"] = PROJECT
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    request = Request(API_BASE + route, data=body, headers=headers, method=method)
    response_headers = {}
    try:
        with urlopen(request, timeout=30) as response:
            status = response.status
            response_headers = response.headers
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        status = error.code
        response_headers = error.headers
        try:
            data = json.loads(error.read().decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            data = {}
    except (URLError, TimeoutError, OSError) as error:
        print(label + ": connection problem (" + type(error).__name__ + ")", flush=True)
        return False, {}
    print(label + ": HTTP " + str(status), flush=True)
    if response_headers:
        request_id = response_headers.get("x-request-id", "")
        if request_id:
            print("  Request ID (for support): " + request_id, flush=True)
        actual_org = response_headers.get("openai-organization")
        if ORG and actual_org:
            print("  Response organization matches expected: " + str(actual_org == ORG), flush=True)
    if status >= 400:
        error = data.get("error") if isinstance(data, dict) else {}
        if not isinstance(error, dict):
            error = {}
        print("  Error type: " + str(error.get("type") or "unknown")[:90], flush=True)
        print("  Error code: " + str(error.get("code") or "unknown")[:90], flush=True)
    return 200 <= status < 300, data if isinstance(data, dict) else {}

def main():
    print("Diagnostic timestamp UTC:", datetime.now(timezone.utc).isoformat(timespec="seconds"), flush=True)
    print("Expected organization configured:", bool(ORG), flush=True)
    print("Expected project configured:", bool(PROJECT), flush=True)
    print("Billable request opted in:", TEST, flush=True)
    if not KEY:
        print("STOP: OPENAI_API_KEY GitHub secret is missing.", flush=True)
        return 1

    ok_me, info = call("Credential identity", "GET", "/v1/me")
    if ok_me:
        orgs = info.get("orgs") or {}
        items = orgs.get("data", []) if isinstance(orgs, dict) else []
        ids = [entry.get("id") for entry in items if isinstance(entry, dict)]
        print("  Organizations returned by /v1/me:", len(ids), flush=True)
        if ORG:
            print("  Expected organization is associated with key:", ORG in ids, flush=True)
        else:
            print("  To check account match, set GitHub variable OPENAI_ORG_ID.", flush=True)
    ok_models, _ = call("Models access", "GET", "/v1/models", scoped=True)
    if not TEST:
        print("No billable test requested; SNS posts were not touched.", flush=True)
        return 0 if ok_me and ok_models else 1
    ok_generate, _ = call("Minimal text generation", "POST", "/v1/responses", {
        "model": MODEL,
        "input": "Reply with OK only.",
        "max_output_tokens": 12,
    }, scoped=True)
    if ok_generate:
        print("SUCCESS: OpenAI accepted the low-cost request. No social posts were created.", flush=True)
        return 0
    print("FAILURE: See the error CODE above. No social posts were created.", flush=True)
    return 1

if __name__ == "__main__":
    sys.exit(main())
