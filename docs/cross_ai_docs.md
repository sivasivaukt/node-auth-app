# Cross AI Docs — node-auth-app
**Project:** node-auth-app (Node.js Auth API)
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

**Type:** Node.js REST API (Backend only)
**Port:** 3000
**Language:** TypeScript

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/` | GET | — | Health check |
| `/auth/signup` | POST | `{ name, email, password }` | `{ message }` |
| `/auth/login` | POST | `{ email, password }` | `{ message, token }` |
| `/api-docs` | GET | — | Swagger UI |

**Run commands:**
```bash
npm run dev    # Run with ts-node (development)
npm run build  # Compile TypeScript → dist/
npm start      # Run compiled dist/index.js (production)
```

**Frontend apps that connect to this API:**

| App | Port |
|-----|------|
| next-auth-app / apps/app | 3001 |
| next-auth-app / apps/bo | 3002 |
