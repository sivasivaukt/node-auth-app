# Current Project State
**Last updated by:** Claude  
**Date:** 2026-05-24  
**Status:** ✅ Initial setup + Docker + nginx fix + env split for local K8s vs EKS

---

## What Is Built

### apps/app (port 3001 dev / port 3000 Docker) — COMPLETE ✅
- `/login` — Login form → calls `POST /auth/login` → saves JWT in localStorage
- `/signup` — Signup form → calls `POST /auth/signup` → redirects to login
- `/dashboard` — Protected page → checks localStorage for token → logout button
- `/` — Client-side redirect to `/login` (uses `useRouter().replace()` in `useEffect`)
- `src/lib/api.ts` — All fetch calls to backend (port 3000)
- `.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:3000` (local `npm run dev`)
- `.env.development` — `NEXT_PUBLIC_API_URL=http://localhost:3000` (local K8s — browser uses port-forward)
- `.env.production` — `NEXT_PUBLIC_API_URL=http://node-auth-app-service:3000` (AWS EKS — pod-to-pod internal)

### Docker Setup — COMPLETE ✅
- `Dockerfile` — Multi-stage build (node:20-alpine builder + nginx:1.27-alpine runner)
  - Platform-agnostic (pass `--platform linux/amd64` at build time for Kubernetes cross-build)
  - Turborepo `--filter=app` builds only the `app` workspace
  - Copies `.env.development` → `.env.production` before build to bake `http://localhost:3000` for local K8s
  - For EKS: swap that line to use `.env.production` directly (bakes internal service URL)
  - `RUN ls -la /app/apps/app/out/` verification step after build (visible in docker build logs)
  - nginx serves the Next.js static export (`output: "export"`) on port 3000
- `nginx.conf` — Listens on port 3000, handles `trailingSlash: true` routing
- `.dockerignore` — Excludes node_modules, .next, out, .env.local, .turbo, .git, docs

### node-auth-app Kubernetes Config — IN PROGRESS ⏳
- MySQL running on EC2 at `13.204.38.60:3306` (Docker container)
- kubectl commands ready to inject env vars into the deployment:
  - `kubectl create secret generic node-auth-app-secret` — DB_PASSWORD, JWT_SECRET
  - `kubectl create configmap node-auth-app-config` — DB_HOST, DB_USER, DB_NAME, PORT
  - `kubectl set env deployment/node-auth-app --from=secret/... --from=configmap/...`
- Kubernetes manifests (YAML) not yet created — using imperative kubectl commands for now

### apps/bo (port 3002) — PLACEHOLDER ⏳
- `/` — Placeholder home page only
- No features built yet — waiting for admin features

### packages/ — EMPTY ⏳
- No shared packages yet

---

## What Is NOT Built Yet

- [ ] `apps/bo` admin features
- [ ] JWT refresh token logic
- [ ] Shared UI components in `packages/ui`
- [ ] Shared TypeScript types in `packages/types`
- [ ] Kubernetes manifests YAML for next-auth-app (Deployment, Service, Ingress)
- [ ] Kubernetes manifests YAML for node-auth-app (Deployment, Service)
- [ ] CI/CD pipeline wired to Docker build + push

---

## Known Decisions Made

| Decision | Reason |
|----------|--------|
| JWT stored in localStorage | Simple for learning — upgrade to httpOnly cookie for production |
| Client-side route protection in dashboard | Simple check for learning |
| Next.js 15.5.18 (not latest 16.x) | Stable LTS version, avoids major breaking changes |
| Tailwind v4 | Latest version, simpler config (no tailwind.config.js needed) |
| `packageManager` field added to root package.json | Required by Turborepo 2.9.14+ |
| `output: "export"` in next.config.ts | Generates static HTML — enables nginx serving; `next start` does NOT work with this |
| nginx instead of `next start` in Docker | `next start` is incompatible with `output: "export"` static export mode |
| Root page uses `useRouter().replace()` not `redirect()` | `redirect()` is server-side and incompatible with static export — caused nginx default page bug |
| Platform flags removed from Dockerfile | Pass `--platform linux/amd64` at `docker build` time for cross-builds; omit for native ARM64 |
| nginx listens on port 3000 | Matches Kubernetes Service expectations for this app |
| Two env files: `.env.development` and `.env.production` | `.env.development` = localhost:3000 for local K8s (browser uses port-forward); `.env.production` = node-auth-app-service:3000 for EKS (pod DNS) |
| Dockerfile uses `.env.development` for local builds | Browser outside K8s can't resolve service names — needs localhost via port-forward |
| Secret for DB_PASSWORD + JWT_SECRET, ConfigMap for the rest | Sensitive values never stored in plain text in K8s object specs |
| MySQL on EC2 (`13.204.38.60:3306`) not in-cluster | External DB for now; K8s pods connect via public IP |

---

## How to Update This File

After each AI session, update:
1. **What Is Built** — mark completed items ✅
2. **What Is NOT Built Yet** — check off done items, add new ones
3. **Known Decisions Made** — add any new architectural decisions
4. **Last updated by** and **Date** fields at the top
