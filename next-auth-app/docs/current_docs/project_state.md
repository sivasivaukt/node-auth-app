# Current Project State
**Last updated by:** Claude  
**Date:** 2026-05-23  
**Status:** ✅ Initial setup complete

---

## What Is Built

### apps/app (port 3001) — COMPLETE ✅
- `/login` — Login form → calls `POST /auth/login` → saves JWT in localStorage
- `/signup` — Signup form → calls `POST /auth/signup` → redirects to login
- `/dashboard` — Protected page → checks localStorage for token → logout button
- `/` — Redirects to `/login`
- `src/lib/api.ts` — All fetch calls to backend (port 3000)
- `.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:3000`

### apps/bo (port 3002) — PLACEHOLDER ⏳
- `/` — Placeholder home page only
- No features built yet — waiting for admin features

### packages/ — EMPTY ⏳
- No shared packages yet
- Add here when same code is needed in both `app` and `bo`

---

## What Is NOT Built Yet

- [ ] `apps/bo` admin features
- [ ] JWT refresh token logic
- [ ] Shared UI components in `packages/ui`
- [ ] Shared TypeScript types in `packages/types`
- [ ] Production deployment setup

---

## Known Decisions Made

| Decision | Reason |
|----------|--------|
| JWT stored in localStorage | Simple for learning — upgrade to httpOnly cookie for production |
| Client-side route protection in dashboard | Simple check for learning |
| Next.js 15.5.18 (not latest 16.x) | Stable LTS version, avoids major breaking changes |
| Tailwind v4 | Latest version, simpler config (no tailwind.config.js needed) |
| `packageManager` field added to root package.json | Required by Turborepo 2.9.14+ |

---

## How to Update This File

After each AI session, update:
1. **What Is Built** — mark completed items ✅
2. **What Is NOT Built Yet** — check off done items, add new ones
3. **Known Decisions Made** — add any new architectural decisions
4. **Last updated by** and **Date** fields at the top
