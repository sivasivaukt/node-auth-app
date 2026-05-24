# syntax=docker/dockerfile:1

# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests first — changes to source won't bust this cache layer
COPY package.json package-lock.json turbo.json ./
COPY apps/app/package.json ./apps/app/package.json
# npm workspaces needs all workspace package.json files to resolve the dependency graph
COPY apps/bo/package.json ./apps/bo/package.json

# Install all workspace dependencies with exact lockfile versions
RUN npm ci

# Copy only the app source (bo source is not needed for this build)
COPY apps/app ./apps/app
COPY packages ./packages

# LOCAL K8S BUILD: bake .env.development (http://localhost:3000) into the bundle.
# Browser reaches the backend via `kubectl port-forward`, so localhost:3000 is correct.
# For production EKS: swap this line to use .env.production (http://node-auth-app-service:3000),
# which works because pods resolve Kubernetes service names internally.
# NEXT_PUBLIC_* vars are baked into the JS bundle at build time — this must run before the build.
COPY apps/app/.env.development ./apps/app/.env.production

# Build only the app workspace via Turborepo
RUN npx turbo run build --filter=app

# Verify the static export was produced — output visible in `docker build` logs
RUN ls -la /app/apps/app/out/

# ============================================================
# Stage 2: Runner (nginx serves the static export)
# ============================================================
# next.config.ts uses output: "export", which produces static HTML/CSS/JS in apps/app/out/.
# next start does NOT work with static export — nginx is the correct server here.
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/app/out /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
