# Frontend Deployment Guide — S3 + CloudFront + CI/CD
**Project:** next-auth-app (Turborepo Monorepo)
**Owner:** Siva Panneerselvam
**Date:** 2026-05-23

---

## Architecture Overview

```
User Browser
     ↓
CloudFront CDN (fast delivery worldwide + HTTPS)
     ↓
S3 Bucket (HTML, CSS, JS static files)
     ↓
EC2 + Docker (Node.js API on port 3000)
     ↓
MySQL Container (port 3306)
```

---

## Why S3 + CloudFront for Frontend?

### Frontend (Next.js) → Static Files
```
Next.js builds to STATIC FILES:
→ HTML files
→ CSS files
→ JavaScript files

S3 just hosts these files!
No server needed!
No Docker needed!
No EC2 needed!
Just files! 😊
```

### Why NOT Docker for Frontend?
```
Backend (Node.js) → Docker ✅ Needed!
Frontend (Next.js) → Docker ❌ Not needed!

Backend needs Docker because:
→ Runs as a SERVER (always on)
→ Needs Node.js runtime
→ Needs MySQL alongside
→ Complex environment

Frontend doesn't need Docker because:
→ Builds to static files
→ S3 hosts static files perfectly
→ No runtime needed
→ Simpler and cheaper! ✅
```

### Simple Analogy
```
Backend (Docker on EC2):
Like a RESTAURANT 🍳
→ Needs kitchen (Docker)
→ Needs chef (Node.js)
→ Needs ingredients (MySQL)
→ Always running!

Frontend (S3):
Like a MENU BOARD 📋
→ Just static content
→ No kitchen needed!
→ S3 hosts it perfectly!
```

---

## Why CI/CD for Frontend?

```
Without CI/CD:
Every code change →
→ npm run build manually ❌
→ Upload files to S3 manually ❌
→ Invalidate CloudFront cache manually ❌
→ Boring + Error prone ❌

With CI/CD (GitHub Actions):
Every push to main →
→ GitHub Actions builds automatically ✅
→ Uploads to S3 automatically ✅
→ Clears CloudFront cache automatically ✅
→ Frontend live in 2 mins! ✅
```

### Full CI/CD Picture
```
Backend (done ✅):
Push code → GitHub Actions → SSH to EC2 → Docker restart

Frontend (this guide):
Push code → GitHub Actions → Build Next.js → Upload S3 → Clear CDN
```

---

## What is S3?

```
S3 = Simple Storage Service

Amazon's file storage service!
Like Google Drive but for developers.

You can:
→ Store any files (HTML, CSS, JS, images)
→ Make files publicly accessible
→ Host static websites
→ Store unlimited files

Cost: Very cheap! (pay per GB stored + requests)
```

### S3 Key Concepts
```
Bucket  = A folder/container for your files
Object  = A file inside the bucket
Region  = Where bucket is stored (Mumbai = ap-south-1)
Policy  = Who can access the bucket
```

---

## What is CloudFront?

```
CloudFront = AWS CDN (Content Delivery Network)

Without CloudFront:
→ Files stored in Mumbai S3
→ User in USA requests file
→ Request travels all the way to Mumbai! ❌
→ SLOW! ❌

With CloudFront:
→ Files copied to 400+ locations worldwide
→ User in USA gets file from nearest location ✅
→ FAST! ✅
→ HTTPS automatically! ✅
→ Lower cost! ✅
```

### CloudFront Benefits
```
✅ Fast globally (CDN = files close to users)
✅ HTTPS automatically (free SSL!)
✅ DDoS protection built-in
✅ Reduces S3 costs (CloudFront serves, not S3)
✅ Custom domain support
```

---

## PART 1 — Update Next.js Config (Static Export)

### Why needed?
```
By default Next.js runs as a SERVER
S3 can only host STATIC files

So we tell Next.js:
"Build as static files!" → output: 'export'
```

### apps/app/next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### apps/bo/next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### What these settings mean:
```
output: "export"
→ Build to static HTML/CSS/JS files
→ Creates "out" folder with all files

trailingSlash: true
→ /login becomes /login/index.html
→ S3 handles URLs correctly ✅

images: { unoptimized: true }
→ Next.js image optimization needs a server
→ S3 has no server → disable optimization
→ Images still work, just not auto-optimized
```

---

## PART 2 — Update API URL for Production

### apps/app/.env.local (local dev)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### For Production (S3/CloudFront)
```
NEXT_PUBLIC_API_URL=http://13.204.38.60:3000
```

> ⚠️ This will be set as GitHub Secret!
> Never hardcode the production URL in code!

---

## PART 3 — Create S3 Buckets (AWS Console)

### Bucket 1 — User App
```
AWS Console → Search "S3" → Click S3
Click → "Create bucket" (orange button)

Settings:
Bucket name → siva-next-auth-app (must be unique globally!)
Region      → ap-south-1 (Mumbai)
Object Ownership → ACLs disabled ✅
Block Public Access → UNCHECK "Block all public access" ✅
Acknowledge checkbox → tick it ✅
Click → "Create bucket"
```

### Bucket 2 — Back Office
```
Same steps as above
Bucket name → siva-next-bo-app
```

### Enable Static Website Hosting (for each bucket)
```
Click on bucket → "Properties" tab
Scroll down → "Static website hosting"
Click → "Edit"

Settings:
Static website hosting → Enable ✅
Hosting type → Host a static website ✅
Index document → index.html
Error document → index.html (important for SPA!)

Click → "Save changes"
```

### Set Bucket Policy (Public Read Access)
```
Click on bucket → "Permissions" tab
Scroll down → "Bucket policy"
Click → "Edit"

Paste this policy (replace BUCKET-NAME):
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET-NAME/*"
    }
  ]
}

Click → "Save changes"
```

---

## PART 4 — Create CloudFront Distributions

### For each S3 bucket:
```
AWS Console → Search "CloudFront" → Click CloudFront
Click → "Create distribution" (orange button)

Origin Settings:
Origin domain → select your S3 bucket website endpoint
               (use the website endpoint, not the bucket URL!)

Default Cache Behavior:
Viewer protocol policy → Redirect HTTP to HTTPS ✅
Allowed HTTP methods  → GET, HEAD ✅

Settings:
Default root object → index.html

Click → "Create distribution"
```

> ⏳ Takes 5-15 minutes to deploy!
> Status changes from "Deploying" to "Enabled" ✅

### Your CloudFront URLs:
```
apps/app → https://XXXX.cloudfront.net
apps/bo  → https://YYYY.cloudfront.net
```

---

## PART 5 — GitHub Actions for Frontend CI/CD

### Add GitHub Secrets (next-auth-app repo)
```
Go to → github.com/sivasivaukt/next-auth-app (or your repo)
Settings → Secrets and variables → Actions

Add these secrets:

AWS_ACCESS_KEY_ID     → your AWS access key
AWS_SECRET_ACCESS_KEY → your AWS secret key
AWS_REGION            → ap-south-1
S3_BUCKET_APP         → siva-next-auth-app
S3_BUCKET_BO          → siva-next-bo-app
CLOUDFRONT_ID_APP     → your app distribution ID
CLOUDFRONT_ID_BO      → your bo distribution ID
NEXT_PUBLIC_API_URL   → http://13.204.38.60:3000
```

### Create AWS IAM User for GitHub Actions
```
AWS Console → Search "IAM" → Click IAM
Click → Users → Add users

Username → github-actions-s3
Access type → Programmatic access ✅

Permissions → Attach policies directly:
→ AmazonS3FullAccess
→ CloudFrontFullAccess

Download credentials CSV!
→ AWS_ACCESS_KEY_ID
→ AWS_SECRET_ACCESS_KEY
```

### .github/workflows/deploy-frontend.yml
```yaml
name: Deploy Frontend to S3

on:
  push:
    branches:
      - main

jobs:
  deploy-app:
    name: Deploy apps/app
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build apps/app
        run: npm run build:app
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

      - name: Deploy apps/app to S3
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload to S3
        run: |
          aws s3 sync apps/app/out/ s3://${{ secrets.S3_BUCKET_APP }} --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID_APP }} \
            --paths "/*"
          echo "✅ apps/app deployed!"

  deploy-bo:
    name: Deploy apps/bo
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build apps/bo
        run: npm run build:bo
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

      - name: Deploy apps/bo to S3
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload to S3
        run: |
          aws s3 sync apps/bo/out/ s3://${{ secrets.S3_BUCKET_BO }} --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID_BO }} \
            --paths "/*"
          echo "✅ apps/bo deployed!"
```

---

## PART 6 — Update turbo.json Build Scripts

### Add build scripts to root package.json
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build:app": "turbo run build --filter=app",
    "build:bo": "turbo run build --filter=bo",
    "dev:app": "turbo run dev --filter=app",
    "dev:bo": "turbo run dev --filter=bo"
  }
}
```

---

## PART 7 — Full Deployment Flow

### After setup, every deployment works like this:
```
1. You change code on Mac
2. git add . && git commit && git push origin main
3. GitHub Actions triggers automatically
4. Builds apps/app → uploads to S3 → clears CDN ✅
5. Builds apps/bo  → uploads to S3 → clears CDN ✅
6. Users see new version immediately! 🎉
```

---

## Quick Reference

### URLs After Deployment
```
User App  → https://XXXX.cloudfront.net
Back Office → https://YYYY.cloudfront.net
API       → http://13.204.38.60:3000
Swagger   → http://13.204.38.60:3000/api-docs
```

### Key Commands
```bash
# Build locally for testing
cd next-auth-app
npm run build:app   # builds apps/app → out/ folder
npm run build:bo    # builds apps/bo  → out/ folder

# Deploy manually (if needed)
aws s3 sync apps/app/out/ s3://siva-next-auth-app --delete
aws s3 sync apps/bo/out/  s3://siva-next-bo-app --delete
```

---

## Cost Estimate (Monthly)
```
S3 Storage    → ~$0.02/GB → nearly FREE for small app
S3 Requests   → ~$0.004/1000 requests → nearly FREE
CloudFront    → 1TB free/month → FREE for small app
EC2 t2.micro  → Free tier (12 months) → FREE

Total → ~$0 for learning/small projects! ✅
```

---

## Interview Answer 🎯

> *"For the frontend, I deployed two Next.js apps to AWS S3 as static exports
> and served them through CloudFront CDN for fast global delivery with automatic
> HTTPS. I set up a GitHub Actions CI/CD pipeline that automatically builds both
> apps and deploys to S3 whenever I push to the main branch. It also invalidates
> the CloudFront cache so users always get the latest version. This gives me
> a complete full-stack deployment — backend on EC2 with Docker, frontend on
> S3 with CloudFront."*

---

## Key Concepts Summary

| Concept | Meaning |
|---------|---------|
| **S3** | File storage — hosts static HTML/CSS/JS |
| **CloudFront** | CDN — delivers files fast from nearest location |
| **Static Export** | Next.js builds to plain HTML/CSS/JS files |
| **Cache Invalidation** | Tell CloudFront to fetch fresh files from S3 |
| **IAM User** | AWS user with specific permissions for GitHub |
| **ACL** | Access control — who can read/write S3 files |

---

*Frontend Deployment Guide — Siva Panneerselvam 💪🚀*
*Date: 2026-05-23*

---

## ACTUAL SETUP RESULTS (2026-05-23)

### IAM User Created
```
Username  → github-actions-s3
Policies  → AmazonS3FullAccess + CloudFrontFullAccess
Access Key → AKIAVRUVRUTYWPCZAQNV
Secret Key → (saved in CSV file)
```

### S3 Buckets Created ✅

| Bucket | Purpose | Region |
|--------|---------|--------|
| siva-next-auth-app | User App (apps/app) | ap-south-1 |
| siva-next-bo-app | Back Office (apps/bo) | ap-south-1 |

### Bucket 1 — siva-next-auth-app
```
✅ Created → May 23, 2026
✅ Static website hosting → Enabled
✅ Index document → index.html
✅ Error document → index.html
✅ Bucket policy → Public read access
✅ Website URL → http://siva-next-auth-app.s3-website.ap-south-1.amazonaws.com
```

### Bucket Policy (siva-next-auth-app)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::siva-next-auth-app/*"
    }
  ]
}
```

### Bucket 2 — siva-next-bo-app
```
✅ Created → May 23, 2026
✅ Static website hosting → Enabled
✅ Index document → index.html
✅ Error document → index.html
✅ Bucket policy → Public read access
```

### Bucket Policy (siva-next-bo-app)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::siva-next-bo-app/*"
    }
  ]
}
```

### Next Steps Pending
```
⏳ CloudFront distributions (app + bo)
⏳ Update Next.js config (output: export)
⏳ GitHub Actions CI/CD workflow
⏳ First deployment!
```

---

## CloudFront Distributions Created (2026-05-23)

### Distribution 1 — User App
```
Name            → siva-next-auth-app-cdn
Distribution ID → ES5VE0W5L88MQ
CDN URL         → https://d1yeweqrh7nmlc.cloudfront.net
S3 Origin       → siva-next-auth-app.s3-website.ap-south-1.amazonaws.com
Plan            → Free ($0/month)
Status          → Enabled ✅
```

### Distribution 2 — Back Office
```
Name            → siva-next-bo-app-cdn
Distribution ID → E2PYQ1E3LQRUHI
CDN URL         → https://d1qfecgfqgg6i4.cloudfront.net
S3 Origin       → siva-next-bo-app.s3-website.ap-south-1.amazonaws.com
Plan            → Free ($0/month)
Status          → Enabled ✅
```

### All URLs Summary
```
User App  → https://d1yeweqrh7nmlc.cloudfront.net
Back Office → https://d1qfecgfqgg6i4.cloudfront.net
API         → http://13.204.38.60:3000
Swagger     → http://13.204.38.60:3000/api-docs
```

### GitHub Secrets Needed (next-auth-app repo)
```
AWS_ACCESS_KEY_ID     → AKIAVRUVRUTYWPCZAQNV
AWS_SECRET_ACCESS_KEY → (from downloaded CSV)
AWS_REGION            → ap-south-1
S3_BUCKET_APP         → siva-next-auth-app
S3_BUCKET_BO          → siva-next-bo-app
CLOUDFRONT_ID_APP     → ES5VE0W5L88MQ
CLOUDFRONT_ID_BO      → E2PYQ1E3LQRUHI
NEXT_PUBLIC_API_URL   → http://13.204.38.60:3000
```

---

## DEPLOYMENT SUCCESS! (2026-05-23) 🎉

### GitHub Actions CI/CD — WORKING! ✅

```
Workflow → deploy-frontend.yml
Status   → SUCCESS ✅
Duration → 50 seconds total

✅ Deploy apps/app to S3 → 44s
✅ Deploy apps/bo to S3  → 46s
```

### Workflow Files Location
```
Root level (correct location):
next_node_auth_app/
└── .github/
    └── workflows/
        ├── deploy.yml           ← Backend EC2 deployment
        └── deploy-frontend.yml  ← Frontend S3 deployment
```

### What Happens on Every Push
```
You push code to main branch
         ↓
GitHub Actions triggers
         ↓
Builds apps/app  → uploads to siva-next-auth-app S3
Builds apps/bo   → uploads to siva-next-bo-app S3
         ↓
Invalidates CloudFront cache
         ↓
Frontend live in ~50 seconds! ✅
```

### All Live URLs 🚀
```
User App    → https://d1yeweqrh7nmlc.cloudfront.net
Back Office → https://d1qfecgfqgg6i4.cloudfront.net
API         → http://13.204.38.60:3000
Swagger     → http://13.204.38.60:3000/api-docs
```

---

## Complete Architecture Summary 🏆

```
User Browser
     ↓
CloudFront CDN (HTTPS, fast global delivery)
     ↓
S3 Bucket (HTML/CSS/JS static files)
     ↓
EC2 Server 13.204.38.60 (Docker containers)
     ↓
Node.js API Container (port 3000)
     ↓
MySQL Container (port 3306)
```

### Full CI/CD Pipeline
```
Backend:
git push → GitHub Actions → SSH to EC2 → docker compose up → API live ✅

Frontend:
git push → GitHub Actions → npm build → S3 upload → CloudFront invalidate → UI live ✅
```

### What Was Built Today 🏆
```
✅ Node.js REST API (TypeScript + Express)
✅ MySQL database (Docker container)
✅ JWT authentication (bcrypt + jsonwebtoken)
✅ Swagger API docs
✅ Docker + Docker Compose
✅ AWS EC2 (Ubuntu, t2.micro, Mumbai)
✅ Elastic IP (13.204.38.60 permanent)
✅ Security Groups (port 22, 3000)
✅ GitHub Actions CI/CD (backend)
✅ AWS S3 (static website hosting)
✅ AWS CloudFront (CDN + HTTPS)
✅ IAM user (least privilege access)
✅ GitHub Actions CI/CD (frontend)
✅ Next.js monorepo (Turborepo)
✅ Two apps deployed (app + bo)
✅ Full stack live on AWS! 🚀
```

### Interview Answer 🎯
> "I built and deployed a complete full-stack application on AWS.
> The backend is a Node.js TypeScript REST API running in Docker
> containers on EC2 with MySQL. The frontend is a Next.js Turborepo
> monorepo with two apps deployed to S3 and served via CloudFront CDN.
> Everything is automated with GitHub Actions CI/CD — pushing to main
> automatically deploys both backend and frontend within seconds."

---

*Deployment completed: 2026-05-23 — Siva Panneerselvam 💪🚀*
*"From zero to full-stack AWS deployment in ONE DAY!"*

---

## FULL STACK WORKING! 🎉 (2026-05-24)

### Issues Fixed & Solutions

#### Issue 1 — Mixed Content (HTTPS/HTTP)
```
Problem  → CloudFront forces HTTPS
           API was HTTP only
           Browser blocked mixed content!

Solution → Setup Nginx + SSL on EC2
```

#### Issue 2 — No Domain for SSL
```
Problem  → SSL certificate needs domain name
           Cannot create for IP address

Solution → Free subdomain from freedns.afraid.org
           sivaapi.mooo.com → 13.204.38.60
```

#### Issue 3 — Port 80 not open
```
Problem  → Certbot couldn't verify domain
           Port 80 was blocked by Security Group

Solution → Added HTTP (port 80) to Security Group
```

#### Issue 4 — MySQL table missing
```
Problem  → New Docker MySQL container was empty
           users table didn't exist
           App crashed with TypeError

Solution → Created users table manually:
           docker exec -it nodeauth-mysql mysql...
           CREATE TABLE users (...)
```

---

### Nginx + SSL Setup on EC2

#### Install Nginx
```bash
sudo apt install nginx -y
```

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/sivaapi
```

```nginx
server {
    listen 80;
    server_name sivaapi.mooo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Enable site
```bash
sudo ln -s /etc/nginx/sites-available/sivaapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Get SSL Certificate (Free!)
```bash
sudo certbot --nginx -d sivaapi.mooo.com
```

```
✅ Certificate saved at → /etc/letsencrypt/live/sivaapi.mooo.com/
✅ HTTPS enabled on → https://sivaapi.mooo.com
✅ Auto-renewal scheduled!
✅ Expires → 2026-08-21
```

---

### Free Domain Setup (freedns.afraid.org)

```
Website  → https://freedns.afraid.org
Username → sivasivaukt
Domain   → sivaapi.mooo.com
Points to → 13.204.38.60
Type     → A record
```

---

### Security Group Final Rules
```
Port 22   → SSH
Port 80   → HTTP (needed for Certbot)
Port 443  → HTTPS (Nginx SSL)
Port 3000 → Custom TCP (Direct API access)
```

---

### Final Working URLs 🚀
```
User App (Frontend) → https://d1yeweqrh7nmlc.cloudfront.net
Back Office         → https://d1qfecgfqgg6i4.cloudfront.net
API (HTTPS)         → https://sivaapi.mooo.com
Swagger UI          → https://sivaapi.mooo.com/api-docs
```

---

### Full Stack Test Results ✅
```
✅ Signup  → User created in MySQL Docker container
✅ Login   → JWT token returned
✅ Dashboard → "You are logged in!" showing
✅ HTTPS   → SSL certificate working
✅ CloudFront CDN → Fast delivery
✅ S3 hosting → Static files served
✅ Nginx   → Reverse proxy working
✅ Docker  → All containers running
✅ CI/CD   → Auto deploy on git push
```

---

## Complete Architecture (FINAL) 🏆

```
User Browser (HTTPS)
       ↓
CloudFront CDN (d1yeweqrh7nmlc.cloudfront.net)
       ↓
S3 Bucket (siva-next-auth-app) - HTML/CSS/JS
       ↓
Nginx (sivaapi.mooo.com:443) - SSL Termination
       ↓
Node.js Docker Container (port 3000)
       ↓
MySQL Docker Container (port 3306)
```

### Interview Answer 🎯
> "I built and deployed a complete full-stack application on AWS.
> The frontend is a Next.js Turborepo monorepo deployed to S3 with
> CloudFront CDN. The backend is a Node.js TypeScript API running
> in Docker on EC2, fronted by Nginx with a free SSL certificate
> from Let's Encrypt. The free domain sivaapi.mooo.com points to
> the EC2 server. Everything is automated with GitHub Actions CI/CD
> — pushing to main automatically deploys both frontend and backend."

---

*Full stack deployment completed: 2026-05-24 00:16 AM*
*"From zero to full production deployment in ONE DAY!" 💪🚀*
*— Siva Panneerselvam*
