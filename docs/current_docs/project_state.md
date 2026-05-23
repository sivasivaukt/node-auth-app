# Current Project State
**Last updated by:** Claude
**Date:** 2026-05-23
**Status:** ✅ Initial setup complete — API working

---

## What Is Built

### Auth API — COMPLETE ✅

| Endpoint | Status | Notes |
|----------|--------|-------|
| GET `/` | ✅ | Health check — returns API status + swagger link |
| POST `/auth/signup` | ✅ | Validates email uniqueness, hashes password, inserts user |
| POST `/auth/login` | ✅ | Verifies password with bcrypt, returns JWT (expires 1d) |
| GET `/api-docs` | ✅ | Swagger UI with try-it-out |

### Database — COMPLETE ✅
- MySQL running locally (Homebrew, port 3306)
- Database: `nodeauthdb`
- Table: `users` (id, name, email, password, created_at)
- Tested with DBeaver ✅

### Tested Results ✅
- Signup: `siva@example.com` registered successfully
- Login: JWT token returned and verified
- Password stored as bcrypt hash in DB

---

## What Is NOT Built Yet

- [ ] Protected routes (middleware to verify JWT on incoming requests)
- [ ] Get user profile endpoint (`GET /auth/me`)
- [ ] Refresh token logic
- [ ] Password reset flow
- [ ] Admin/role-based access control (for BO app)
- [ ] EC2 deployment (guide exists in docs but not yet deployed)

---

## Known Decisions Made

| Decision | Reason |
|----------|--------|
| `cors()` with no options | Allows all origins — fine for local dev, restrict in production |
| JWT expires in `1d` | Simple for now — add refresh token later |
| `mysql2` (not `mysql`) | mysql2 supports promises and is actively maintained |
| `path.resolve(process.cwd(), ".env")` | Ensures .env loads correctly regardless of where command is run |
| TypeScript `strict: false` | Easier for learning — enable strict mode gradually |

---

## How to Update This File

After each AI session, update:
1. **What Is Built** — mark completed items ✅
2. **What Is NOT Built Yet** — check off done items, add new ones
3. **Known Decisions Made** — add any new architectural decisions
4. **Last updated by** and **Date** fields at the top
