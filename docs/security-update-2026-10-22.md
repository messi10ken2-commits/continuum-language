# Security update prepared for deployment

Status: source changes on a security branch only. Do not merge/deploy until Railway is available and the owner resumes rollout. Production has not been patched by this change. Kotoba's separate source/runtime has not been inspected.

## Runtime

The last successful Continuum build logged Node.js 22.11.0. Node's 2026-10-21 security release fixes issues including Brotli memory corruption and certificate validation. This change standardizes on patched LTS Node.js 24.22.1:

- `.node-version` and GitHub Actions select the same version.
- `package.json` declares `>=24.22.1 <25`.
- Both the npm start command and server initialization reject earlier or unvalidated major versions. Startup reports the actual runtime version.
- The Dockerfile selects the official `node:24.22.1-bookworm-slim` image pinned to its verified registry digest for build and runtime, and runs the application as the unprivileged `node` user.
- `railway.json` selects this Dockerfile instead of the old Nixpacks Node package. The Dockerfile builds from the lockfile with optional native packages included. Credentials and local logs are excluded from its context.
- CI runs on security branches as well as main and builds the image and verifies its runtime and unprivileged user. No image is pushed and no Railway deployment is requested.

Sources:
- https://nodejs.org/en/blog/vulnerability/october-2026-security-releases
- https://nodejs.org/en/blog/release/v24.22.1/
- https://docs.railway.com/builds/dockerfiles
- https://docs.railway.com/config-as-code/reference

The runtime guard deliberately fails closed on an obsolete image. Future security patches still require a version/image update; this is not an automatic permanent fix.

## Authentication

Login and registration use atomic PostgreSQL counters, shared across replicas and process restarts. Existing limits remain 12 login requests and 6 registrations per client address per 15 minutes. A normalized email additionally has a 30-request login budget per 15 minutes, including successful requests. The additional account budget bounds attempts from rotating IPs; users can temporarily hit it if an attacker targets their email.

The additive migration creates `auth_rate_limits` and an expiry index. Keys contain SHA-256 hashes of scope + identifier, not raw IP addresses or email addresses. Counters stop growing after the limit. Each process periodically removes up to 500 expired rows; an expired entry also resets atomically when reused. Database failures return 503 rather than allowing unlimited attempts. A blocked request includes `Retry-After`.

In Railway environments, authentication identifies clients with a validated `X-Real-IP`, as documented for its HTTP ingress. The app must stay behind that ingress; exposing its origin directly would invalidate this trust assumption. Outside Railway, the socket address is used and caller-supplied forwarding headers are ignored. No new platform variable is required on Railway. Other feature-specific limiters retain their existing behavior and are outside this authentication change.

Password hashing/verification uses asynchronous scrypt and preserves the existing stored hash format. At most four expensive operations run and sixteen wait in each process; excess work receives 503. Missing accounts perform dummy verification for valid password lengths. Login password input is bounded to 128 characters.

## Validation and later rollout

Local checks run under the SHA-256-verified official Node.js 24.22.1 binary. Targeted tests cover legacy hashes, event-loop responsiveness, bounded password work, concurrent shared budgets, persistence, expiry, cleanup, database failure, forwarding-header handling and the HTTP 429 response.

After review and Railway recovery:
1. Confirm the chosen deployment source contains this change and the earlier video-playback update; merge only when rollout is intended.
2. Build the Dockerfile from the latest source. Confirm Railway uses DOCKERFILE rather than reusing the previous image or Nixpacks runtime.
3. Confirm startup reports `Verified Node.js runtime: 24.22.1` (or a later deliberately validated 24.x patch), the deployment reaches SUCCESS, and `/api/health` succeeds.
4. Smoke-test sign-in with an existing account, sign-out, lesson progress and a synthetic rate-limit boundary. Do not stress-test production accounts.
5. Verify the proxy client-IP boundary, database backup/restore procedure and monitoring before wider rollout. No penetration test or compromise assessment is claimed here.
