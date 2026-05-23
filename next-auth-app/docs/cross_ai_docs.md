# Cross AI Docs — next-auth-app
**Project:** next-auth-app (Turborepo Monorepo)
**Owner:** Siva Panneerselvam

---

## For Claude — Read This First

Hey Claude! Before you start working on this project:

1. Read `docs/current_docs/project_state.md` — this has the latest project state
2. Read `docs/cursor_docs/` — check if Cursor worked on this before you
3. Then start working

When your session is done:
1. Update `docs/current_docs/project_state.md` with what changed
2. Create a session file in `docs/claude_docs/session_YYYY_MM_DD.md`

---

## For Cursor — Read This First

Hey Cursor! Before you start working on this project:

1. Read `docs/current_docs/project_state.md` — this has the latest project state
2. Read `docs/claude_docs/` — check if Claude worked on this before you
3. Then start working

When your session is done:
1. Update `docs/current_docs/project_state.md` with what changed
2. Create a session file in `docs/cursor_docs/session_YYYY_MM_DD.md`

---

## Folder Purpose — Quick Reference

| Folder / File | Who writes | Who reads | Purpose |
|---|---|---|---|
| `docs/current_docs/project_state.md` | Both | Both | Always up-to-date project state |
| `docs/claude_docs/` | Claude | Cursor | Claude's session notes |
| `docs/cursor_docs/` | Cursor | Claude | Cursor's session notes |
| `CLAUDE.md` | — | Claude | Claude project rules |
| `.cursorrules` | — | Cursor | Cursor project rules |

---

## Project Overview (Common for Both)

**Type:** Turborepo + npm Workspaces monorepo
**Package manager:** npm 11.5.2

| App | Port | Status |
|-----|------|--------|
| `apps/app` | 3001 | Signup, Login, Dashboard — complete |
| `apps/bo` | 3002 | Back office — placeholder only |

**Backend:** node-auth-app running on port 3000
- POST `/auth/signup` — `{ name, email, password }`
- POST `/auth/login` — `{ email, password }` → returns JWT token

**Run commands:**
```bash
npm run dev        # Start all apps
npm run dev:app    # Start only apps/app (port 3001)
npm run dev:bo     # Start only apps/bo (port 3002)
```
