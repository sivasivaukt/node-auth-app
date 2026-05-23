# Next.js Auth App — Monorepo Setup Guide (TypeScript)
**Prepared for:** Siva Panneerselvam  
**Date:** May 23, 2026  
**Purpose:** Build a Next.js frontend monorepo (app + bo) connected to the Node.js Auth API on port 3000

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework for frontend |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS v4** | Utility-first CSS styling |
| **Turborepo** | Monorepo build system with caching |
| **npm Workspaces** | Manage multiple apps in one repo |
| **React 19** | UI library |

---

## What This Project Has

| App | Port | Purpose |
|---|---|---|
| `apps/app` | 3001 | User-facing app — Signup, Login, Dashboard |
| `apps/bo` | 3002 | Back office (admin) — Placeholder, built later |

---

## PART 1 — What is a Monorepo?

### Simple Explanation:
```
Normal approach (separate repos):
📁 node-auth-app    → Backend API repo
📁 next-auth-app    → Frontend app repo (separate!)
📁 next-bo-app      → Back office repo (separate!)

Problems:
❌ 3 separate repos to manage
❌ Shared code must be copy-pasted
❌ 3 separate npm install commands
❌ Hard to keep everything in sync!
```

```
Monorepo approach (ONE repo, multiple apps):
📁 next-auth-app/         → ONE repo!
     apps/
       app/               → Frontend app
       bo/                → Back office
     packages/            → Shared code (used by both!)

Benefits:
✅ 1 repo — easy to manage!
✅ Shared code in packages/ — no copy-paste!
✅ One npm install — installs everything!
✅ Run all apps with ONE command!
```

### Real Life Example:
```
Like a company building:
One office building (monorepo)
  Floor 1 → Customer service (apps/app)
  Floor 2 → Admin office (apps/bo)
  Shared → Reception, Elevator, Cafeteria (packages/)

vs.

Three separate buildings (separate repos)
  Building 1 → Customer service
  Building 2 → Admin office
  Building 3 → Shared (but nobody uses it properly!)
```

---

## PART 2 — What is Turborepo?

### Simple Explanation:
```
Turborepo is a smart build system for monorepos!
It manages running commands across all your apps!

Without Turborepo:
  cd apps/app  && npm run dev  → Run manually each time!
  cd apps/bo   && npm run dev  → Another terminal!
  cd apps/admin && npm run dev → Yet another terminal!

With Turborepo (from root folder):
  npm run dev  → Starts ALL apps automatically! ✅
               → Runs them in PARALLEL! ✅
               → Smart caching — skips unchanged! ✅
```

### What Turborepo Does:
```
1. PARALLEL EXECUTION
   → Runs all apps at the same time
   → Faster than running one by one!

2. SMART CACHING
   → If code didn't change → skips rebuild!
   → Saves huge amounts of time!

3. TASK PIPELINE
   → Knows which tasks depend on others
   → Always builds in the correct order!
```

### Simple Timeline Without vs With Turborepo:
```
Without Turborepo:
  Build app  → 30 seconds
  Build bo   → 30 seconds
  Total      → 60 seconds ❌

With Turborepo (parallel):
  Build app  ─┐
              ├─ Both at same time! ✅
  Build bo   ─┘
  Total      → 30 seconds ✅ (2x faster!)

With Turborepo (cached — no changes):
  Build app  → 0.1 seconds (cache hit!) ✅
  Build bo   → 0.1 seconds (cache hit!) ✅
  Total      → 0.2 seconds ✅✅✅
```

---

## PART 3 — What is npm Workspaces?

### Simple Explanation:
```
npm Workspaces lets ONE package.json manage
multiple apps and packages!

Without workspaces:
  cd apps/app && npm install  → installs for app
  cd apps/bo  && npm install  → installs for bo

With workspaces (from root):
  npm install  → installs for ALL apps! ✅

Also shares node_modules:
  Without workspaces:
    apps/app/node_modules/  → 200MB
    apps/bo/node_modules/   → 200MB
    Total → 400MB ❌

  With workspaces:
    node_modules/  → 210MB (shared!) ✅
    Saves 190MB! 
```

### In package.json:
```json
{
  "workspaces": [
    "apps/*",    ← All folders inside apps/ are workspaces
    "packages/*" ← All folders inside packages/ are workspaces
  ]
}
```

```
apps/* means:
  apps/app → workspace ✅
  apps/bo  → workspace ✅
  (any future app added here) → automatically a workspace! ✅
```

---

## PART 4 — Project Structure

```
next-auth-app/
├── package.json          → Root config — workspaces + turbo scripts
├── turbo.json            → Turborepo task pipeline config
├── package-lock.json     → Lockfile (auto-generated)
├── .gitignore            → Files to ignore in git
├── node_modules/         → Shared packages (auto-generated)
│
├── apps/
│   ├── app/              → User-facing Next.js app (port 3001)
│   │   ├── package.json          → app's own dependencies
│   │   ├── next.config.ts        → Next.js configuration
│   │   ├── tsconfig.json         → TypeScript configuration
│   │   ├── postcss.config.mjs    → Tailwind CSS config
│   │   ├── .env.local            → Environment variables
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx            → Root layout (HTML wrapper)
│   │       │   ├── page.tsx              → Home → redirects to /login
│   │       │   ├── globals.css           → Global styles (Tailwind)
│   │       │   ├── (auth)/
│   │       │   │   ├── login/
│   │       │   │   │   └── page.tsx      → Login form
│   │       │   │   └── signup/
│   │       │   │       └── page.tsx      → Signup form
│   │       │   └── dashboard/
│   │       │       └── page.tsx          → Protected after login
│   │       └── lib/
│   │           └── api.ts                → API calls to backend (port 3000)
│   │
│   └── bo/               → Back office Next.js app (port 3002)
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── postcss.config.mjs
│       └── src/
│           └── app/
│               ├── layout.tsx    → Root layout
│               ├── page.tsx      → Placeholder home page
│               └── globals.css
│
└── packages/             → Shared code (empty — for future use)
```

---

## PART 5 — Root Config Files Explained

### package.json (root)
```json
{
  "name": "next-auth-app",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev":     "turbo run dev",
    "build":   "turbo run build",
    "dev:app": "turbo run dev --filter=app",
    "dev:bo":  "turbo run dev --filter=bo"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  }
}
```

```
Fields explained:

"private": true
→ This package is NOT published to npm
→ It's just for our own use!

"workspaces": ["apps/*", "packages/*"]
→ All subfolders of apps/ and packages/ are workspaces

"scripts"
→ "dev"      → Start ALL apps (both app and bo)
→ "build"    → Build ALL apps
→ "dev:app"  → Start ONLY apps/app (port 3001)
→ "dev:bo"   → Start ONLY apps/bo (port 3002)
→ --filter=app means "only run for the app workspace"
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

```
Fields explained:

"build": {
  "dependsOn": ["^build"]
  → ^ means "build dependencies FIRST"
  → If app depends on a package → build package first!

  "outputs": [".next/**"]
  → Cache these files → skip rebuild if unchanged! ✅
}

"dev": {
  "cache": false
  → Don't cache dev server (always fresh!)
  
  "persistent": true
  → Dev server stays running (doesn't exit)
}
```

---

## PART 6 — The (auth) Folder — What Does it Mean?

### Next.js Route Groups:
```
In Next.js App Router, a folder with () is called a Route Group!

(auth)/login/page.tsx  → URL is /login  ✅
(auth)/signup/page.tsx → URL is /signup ✅

The (auth) part is INVISIBLE in the URL!
It's just for folder organization!
```

```
Without Route Group:
src/app/
  login/page.tsx    → /login ✅
  signup/page.tsx   → /signup ✅
  dashboard/page.tsx

With Route Group (auth):
src/app/
  (auth)/
    login/page.tsx    → /login ✅ (same URL!)
    signup/page.tsx   → /signup ✅ (same URL!)
  dashboard/page.tsx

(auth) folder keeps login and signup organized together!
```

### Real Life Example:
```
Like naming files:
Without grouping:
  login_page.tsx
  signup_page.tsx
  dashboard_page.tsx

With grouping (route group):
  auth_group/
    login_page.tsx
    signup_page.tsx
  dashboard_page.tsx

Same result → just better organized! ✅
```

---

## PART 7 — Key Source Files Explained

### src/lib/api.ts (API calls to backend)
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Signup failed");
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Login failed");
  return data as { message: string; token: string };
}
```

```
Key parts explained:

NEXT_PUBLIC_API_URL
→ Environment variable from .env.local
→ Value: http://localhost:3000 (our Node backend!)
→ NEXT_PUBLIC_ prefix → available in browser ✅
   (without it → only available in server, not browser!)

fetch(...)
→ Built-in browser/Node function to make HTTP requests
→ Like axios but built-in — no extra package needed!

method: "POST"
→ POST = send data to server

headers: { "Content-Type": "application/json" }
→ Tell server "I'm sending JSON data"

body: JSON.stringify({...})
→ Convert JavaScript object → JSON string to send

if (!res.ok) throw new Error(...)
→ If status is 400, 500 etc → throw error
→ The form page will catch this and show error message!
```

### .env.local (Environment Variables)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```
Why .env.local?
→ .env.local is for LOCAL development only
→ Never committed to git (already in .gitignore!) ✅
→ Contains values specific to your machine

NEXT_PUBLIC_ prefix:
→ Variables WITHOUT this → server-side only (secure!)
→ Variables WITH this    → available in browser too ✅
→ Our API URL needs to be in browser (client component calls fetch!)
→ So we use NEXT_PUBLIC_API_URL ✅
```

### src/app/page.tsx (Home Page)
```typescript
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
```

```
Simple! When someone visits http://localhost:3001
→ Immediately redirects to /login
→ User never sees a blank home page ✅
```

---

## PART 8 — How the Login Flow Works

### Step by Step:
```
1. User visits → http://localhost:3001
               ↓ (redirect)
2. User sees  → /login page

3. User fills form:
   Email    → siva@example.com
   Password → password123
   Clicks   → "Log in" button

4. Login page calls → api.ts → login()
   fetch POST http://localhost:3000/auth/login
   body: { email, password }

5. Node.js backend (port 3000):
   → Finds user in MySQL database
   → Compares password with bcrypt
   → Creates JWT token
   → Returns { message: "Login successful!", token: "eyJ..." }

6. Login page receives token:
   localStorage.setItem("token", data.token)
   → Saves JWT in browser localStorage ✅

7. Redirects to → /dashboard
   Dashboard shows: "You are logged in!" ✅
```

### What is localStorage?
```
localStorage is browser's built-in storage!

Like a tiny notepad in the browser:
→ Survives page refresh ✅
→ Survives closing tab ✅ (stays until cleared)
→ Only accessible by same website ✅

Our app uses it to remember: "user is logged in"

localStorage.setItem("token", "eyJ...")  → Save JWT
localStorage.getItem("token")            → Read JWT
localStorage.removeItem("token")         → Delete JWT (logout)
```

---

## PART 9 — How the Signup Flow Works

```
1. User visits  → /signup page

2. User fills form:
   Full name → Siva Panneerselvam
   Email     → siva@example.com
   Password  → password123
   Clicks    → "Create account" button

3. Signup page calls → api.ts → signup()
   fetch POST http://localhost:3000/auth/signup
   body: { name, email, password }

4. Node.js backend (port 3000):
   → Checks if email already exists
   → Hashes password with bcrypt
   → Inserts into MySQL users table
   → Returns { message: "User registered successfully!" }

5. Signup page:
   → Redirects to /login?registered=1

6. Login page sees ?registered=1:
   → Shows green banner: "Account created! Please log in." ✅
```

---

## PART 10 — Dashboard & Logout

### Dashboard Page (Protected Route):
```typescript
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.replace("/login");  // No token? Go back to login!
  } else {
    setReady(true);  // Has token? Show dashboard!
  }
}, [router]);
```

```
How protection works:
→ Page loads → check localStorage for token
→ No token found → redirect to /login immediately!
→ Token found → show dashboard content ✅

This is called CLIENT-SIDE ROUTE PROTECTION
Simple and works for learning projects! ✅
```

### Logout:
```
Click "Logout" button
→ localStorage.removeItem("token")  ← Delete JWT
→ router.push("/login")             ← Go to login page

Token gone → user is logged out! ✅
```

---

## PART 11 — Run the Project

### Step 1 — Start Node.js Backend (port 3000):
```bash
# In terminal 1
cd /Users/sivaeswaran/Documents/work/node-auth-app
npm run dev

# You will see:
# Server running on port 3000 ✅
# Connected to the database ✅
# Swagger docs → http://localhost:3000/api-docs ✅
```

### Step 2 — Start All Next.js Apps (from monorepo root):
```bash
# In terminal 2
cd /Users/sivaeswaran/Documents/work/next-auth-app
npm run dev

# Turborepo starts BOTH apps:
# app → http://localhost:3001  ✅
# bo  → http://localhost:3002  ✅
```

### Or Start Just One App:
```bash
# Start only apps/app (port 3001)
npm run dev:app

# Start only apps/bo (port 3002)
npm run dev:bo
```

### Open in Browser:
```
http://localhost:3001          → User app (signup + login)
http://localhost:3001/signup   → Signup page directly
http://localhost:3001/login    → Login page directly
http://localhost:3001/dashboard → Dashboard (after login)

http://localhost:3002          → Back office (placeholder)
```

---

## PART 12 — Port Summary

| Service | Port | Command to start |
|---|---|---|
| **Node.js API** | 3000 | `npm run dev` in node-auth-app/ |
| **Next.js App** | 3001 | `npm run dev:app` in next-auth-app/ |
| **Next.js BO** | 3002 | `npm run dev:bo` in next-auth-app/ |

```
Why different ports?
→ Each app needs its OWN port
→ You can't have two apps on port 3000!
→ Browser connects to specific port to reach specific app

Like apartment numbers:
Port 3000 → Node.js API (Backend)
Port 3001 → Next.js App (User frontend)
Port 3002 → Next.js BO  (Admin frontend)
```

---

## PART 13 — Tailwind CSS v4 Explained

### What is Tailwind CSS?
```
Tailwind is a CSS framework where you style 
DIRECTLY in your HTML/JSX using class names!

Old way (custom CSS):
  // style.css
  .button {
    background-color: blue;
    padding: 8px 16px;
    border-radius: 8px;
  }
  // page.tsx
  <button className="button">Click me</button>

Tailwind way:
  // No CSS file needed!
  <button className="bg-blue-600 px-4 py-2 rounded-lg">
    Click me
  </button>
```

### Common Tailwind Classes Used:
```
Layout:
  min-h-screen      → Minimum height 100% of screen
  flex              → Display flex
  items-center      → Align center vertically
  justify-center    → Align center horizontally

Box/Card:
  w-full            → Width 100%
  max-w-md          → Maximum width medium (448px)
  bg-white          → White background
  rounded-2xl       → Rounded corners (extra large)
  shadow-lg         → Large drop shadow
  p-8               → Padding 32px all sides

Text:
  text-2xl          → Font size 2xl
  font-bold         → Bold text
  text-gray-800     → Dark gray color
  text-sm           → Small text

Input:
  border            → Show border
  border-gray-300   → Light gray border
  focus:ring-2      → Show blue ring on focus
  focus:ring-blue-500

Button:
  bg-blue-600       → Blue background
  hover:bg-blue-700 → Darker on hover
  disabled:opacity-60 → 60% opacity when disabled
  transition-colors → Smooth color change animation
```

### How Tailwind v4 is Configured:
```css
/* globals.css */
@import "tailwindcss";
```

```
That's it! Just ONE line! 🎉
Tailwind v4 is much simpler than v3.
No tailwind.config.js needed!
No content paths to configure!
Everything works automatically! ✅
```

---

## PART 14 — TypeScript Concepts Used

### "use client" directive:
```typescript
"use client";
```

```
In Next.js App Router, components are SERVER by default.
Server components:
→ Run on server
→ Can't use useState, useEffect, onClick
→ Can't use localStorage

"use client" makes it a CLIENT component:
→ Runs in browser
→ CAN use useState, useEffect, onClick ✅
→ CAN use localStorage ✅

Our login/signup/dashboard pages need:
→ useState (form data)
→ useEffect (check token)
→ onClick (form submit)
So they need "use client" ✅
```

### FormEvent Type:
```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault();  // Stop form from refreshing page!
}
```

```
FormEvent = TypeScript type for HTML form events
e.preventDefault() = Very important!
  Without it → Form submits → page refreshes → data lost!
  With it    → We handle submit ourselves → no refresh ✅
```

### useState with Object:
```typescript
const [form, setForm] = useState({ name: "", email: "", password: "" });

// Update one field:
setForm({ ...form, email: e.target.value });
```

```
...form = Spread operator — copies all existing values
{ ...form, email: "new@email.com" }
= { name: "", password: "", email: "new@email.com" }

Only email changes, name and password stay same! ✅
```

---

## PART 15 — Future: packages/ Folder

### What Goes in packages/?
```
packages/ is for code shared between apps/app AND apps/bo!

Example future packages:
packages/
  ui/              → Shared UI components (Button, Input, Card)
  types/           → Shared TypeScript types
  utils/           → Shared utility functions
  api-client/      → Shared API calls
```

### Why Shared Packages?
```
Without shared package:
  apps/app/src/components/Button.tsx  → same code!
  apps/bo/src/components/Button.tsx   → copy-pasted!

  When you update Button → update in 2 places! ❌
  Easy to forget → inconsistent UI! ❌

With shared package:
  packages/ui/components/Button.tsx   → one place! ✅

  Both apps import:
  import { Button } from "@repo/ui"

  Update once → both apps updated! ✅
```

### When to Add Shared Packages:
```
Rule of thumb:
If same code appears in BOTH apps → move to packages/! ✅
If code is only in ONE app → keep it there! ✅
```

---

## PART 16 — Connection Between Backend and Frontend

### Full Picture:
```
Browser (localhost:3001)
    │
    │ User fills form and clicks submit
    │
    ▼
Next.js App (apps/app — port 3001)
    │
    │ fetch("http://localhost:3000/auth/login", {...})
    │
    ▼
Node.js API (node-auth-app — port 3000)
    │
    │ Query MySQL database
    │
    ▼
MySQL Database (port 3306)
    │
    │ Returns user row
    │
    ▼
Node.js API
    │
    │ Creates JWT token
    │ Returns { message, token }
    │
    ▼
Next.js App
    │
    │ Saves token in localStorage
    │ Redirects to /dashboard
    │
    ▼
Browser shows Dashboard ✅
```

### CORS (Cross-Origin Resource Sharing):
```
The Node.js backend uses:
  app.use(cors());

Without CORS:
  Browser → "Port 3001 trying to call port 3000? BLOCKED!" ❌

With CORS enabled:
  Browser → "Server allows it! OK!" ✅

Why different ports are "different origins":
  http://localhost:3001 → Origin 1 (Next.js app)
  http://localhost:3000 → Origin 2 (Node.js API)
  Different port = different origin = needs CORS! ✅
```

---

## PART 17 — Build for Production

```bash
# Build all apps
cd /Users/sivaeswaran/Documents/work/next-auth-app
npm run build

# What happens:
# Turborepo builds apps/app  → .next/ folder (compiled!)
# Turborepo builds apps/bo   → .next/ folder (compiled!)
# Both built in parallel!    → Faster! ✅
```

### Start Production Build:
```bash
# From root (starts both)
npm start

# Or individually:
cd apps/app && npm start  # Port 3001
cd apps/bo  && npm start  # Port 3002
```

---

## Commands Quick Reference

| Command | What it does |
|---|---|
| `npm install` | Install all packages for all apps |
| `npm run dev` | Start ALL apps (app + bo) |
| `npm run dev:app` | Start only apps/app (port 3001) |
| `npm run dev:bo` | Start only apps/bo (port 3002) |
| `npm run build` | Build all apps for production |
| `npm run lint` | Lint all apps |

---

## Interview Answer 🎯

> *"I built a Turborepo monorepo with npm workspaces containing two Next.js 15 applications — a user-facing app and a back office. The frontend connects to a Node.js Express REST API for JWT-based authentication. I used Next.js App Router with TypeScript and Tailwind CSS v4 for styling. The monorepo structure lets me share code across both apps through a packages directory, while Turborepo handles parallel builds and caching for faster development."*

---

## File → Purpose Quick Reference

| File | Purpose |
|---|---|
| `package.json` (root) | Workspaces + Turbo scripts |
| `turbo.json` | Task pipeline (build, dev, lint) |
| `.gitignore` | Ignore node_modules, .next, .env |
| `apps/app/package.json` | app's own dependencies |
| `apps/app/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:3000` |
| `src/app/layout.tsx` | HTML `<html><body>` wrapper |
| `src/app/page.tsx` | `/` → redirects to `/login` |
| `src/app/(auth)/login/page.tsx` | Login form |
| `src/app/(auth)/signup/page.tsx` | Signup form |
| `src/app/dashboard/page.tsx` | Protected page after login |
| `src/lib/api.ts` | fetch calls to Node.js backend |
| `globals.css` | `@import "tailwindcss"` |
| `postcss.config.mjs` | Tailwind PostCSS plugin |
| `tsconfig.json` | TypeScript config + `@/*` path alias |

---

*Next.js Auth App Monorepo — Built by Siva Panneerselvam | May 23, 2026 💪🚀*
