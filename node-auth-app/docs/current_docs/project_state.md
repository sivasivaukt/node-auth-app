# Current Project State
**Last updated by:** Claude
**Date:** 2026-05-24
**Status:** ✅ API working + Kubernetes deployment + logout bug fixed

---

## What Is Built

### Auth API — COMPLETE ✅

| Endpoint | Status | Notes |
|----------|--------|-------|
| GET `/` | ✅ | Health check — returns API status + swagger link |
| POST `/auth/signup` | ✅ | Validates email uniqueness, hashes password, inserts user |
| POST `/auth/login` | ✅ | Verifies password with bcrypt, returns JWT (expires 1d) |
| POST `/auth/logout` | ✅ | Returns 200 — client removes token from localStorage (stateless JWT) |
| GET `/api-docs` | ✅ | Swagger UI with try-it-out |

### Database — COMPLETE ✅
- MySQL running on EC2 at `13.204.38.60:3306` (Docker container, ap-south-1)
- Database: `nodeauthdb`
- Table: `users` (id, name, email, password, created_at)
- **No `token_blacklist` table** — removed; JWT auth is stateless

### Kubernetes Deployment — IN PROGRESS ⏳
- App running in local Kubernetes
- Env vars injected via:
  - `kubectl create secret generic node-auth-app-secret` — DB_PASSWORD, JWT_SECRET
  - `kubectl create configmap node-auth-app-config` — DB_HOST, DB_USER, DB_NAME, PORT
  - `kubectl set env deployment/node-auth-app --from=secret/... --from=configmap/...`
- K8s manifest YAML files not yet created (using imperative kubectl for now)

---

## What Is NOT Built Yet

- [ ] Get user profile endpoint (`GET /auth/me`)
- [ ] Refresh token logic
- [ ] Password reset flow
- [ ] Admin/role-based access control (for BO app)
- [ ] Kubernetes manifest YAML (Deployment, Service)
- [ ] CI/CD pipeline (GitHub Actions → build → push → deploy to EKS)

---

## Known Decisions Made

| Decision | Reason |
|----------|--------|
| `cors()` with no options | Allows all origins — fine for local dev, restrict in production |
| JWT expires in `1d` | Simple for now — add refresh token later |
| `mysql2` (not `mysql`) | mysql2 supports promises and is actively maintained |
| `path.resolve(process.cwd(), ".env")` | Ensures .env loads correctly regardless of where command is run |
| TypeScript `strict: false` | Easier for learning — enable strict mode gradually |
| `mysql.createPool()` not `createConnection()` | Single connection goes stale in K8s (EC2 idle timeout kills TCP socket → 45s hang). Pool auto-reconnects. |
| No token blacklist — stateless JWT logout | `token_blacklist` table didn't exist → caused "Server error" + 45s timeout on every logout. JWT validity is enforced by signature + expiry only. Client removes token from localStorage. |
| `verifyToken` middleware does zero DB calls | Previously queried `token_blacklist` on every protected request — removed; JWT verified inline with `jwt.verify()` only |

---

## How to Update This File

After each AI session, update:
1. **What Is Built** — mark completed items ✅
2. **What Is NOT Built Yet** — check off done items, add new ones
3. **Known Decisions Made** — add any new architectural decisions
4. **Last updated by** and **Date** fields at the top
