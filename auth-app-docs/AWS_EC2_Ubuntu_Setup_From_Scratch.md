# AWS EC2 Ubuntu Server — Complete Setup from Scratch
**Prepared for:** Siva Panneerselvam  
**Date:** May 22, 2026  
**Purpose:** Step by step guide — exactly what we did today!

---

## PART 1 — Create AWS Account

### Step 1 — Go to AWS Signup Page
```
Open browser
Go to → aws.amazon.com/free
Click → "Create a Free Account" (orange button)
```

### Step 2 — Fill Email & Account Name
```
Root user email → sivasivaukt@gmail.com
AWS account name → siva-practice
Click → "Verify email address"
Check Gmail → Enter OTP received
```

### Step 3 — Contact Information
```
Account type → Personal
Full name → Siva Panneerselvam
Mobile number → 9176347983
Address → Your address
Click → Continue
```

### Step 4 — Card Verification
```
Payment method → Credit/Debit card
Enter card details
AWS charges → ₹2 temporarily (refunded in 3-5 days)
Click → Verify and Continue
```

### Step 5 — PAN Details
```
Do you have PAN? → Yes
Enter PAN number
Click → Continue (Step 3 of 5)
```

### Step 6 — Identity Verification via DigiLocker
```
Primary purpose → Personal use
Ownership type → Individual
Click → Get DigiLocker URL
Sign in with mobile → 9176347983 + PIN
Select → Aadhaar Card (XX6549)
Click → Allow
Back on AWS → Select name "siva eswaran"
Check consent checkbox
Click → Continue (Step 4 of 5)
```

### Step 7 — Choose Account Plan
```
Click → "Choose free plan" (left side white button)
DO NOT click "Choose paid plan"!
```

### Step 8 — Sign In to AWS Console
```
Go to → signin.aws.amazon.com
Click → "Sign in using root user email"
Enter → sivasivaukt@gmail.com
Enter → Your password
You are IN! ✅
```

---

## PART 2 — AWS Console Setup

### Step 9 — Change Region to Mumbai
```
Top right corner → Click "Europe (Stockholm)"
Search → "Mumbai"
Select → "Asia Pacific (Mumbai) ap-south-1"
```
> ✅ Why Mumbai? Faster performance, data stays in India, cheaper!

### Step 10 — Create Billing Alert
```
Search bar → Type "Budgets"
Click → "Billing and Cost Management"
Click → "AWS Budgets"
Click → "Create a budget" (orange button)

Settings:
Budget type → Use a template (simplified) ✅
Template → Zero spend budget ✅
Budget name → My Zero-Spend Budget
Email → sivasivaukt@gmail.com

Click → "Create budget"
```
> ✅ This sends email alert if AWS charges even $0.01!

---

## PART 3 — Launch EC2 Server

### Step 11 — Go to EC2
```
Search bar → Type "EC2"
Click → "EC2 — Virtual Servers in the Cloud"
Click → "Instances" (in top features)
Click → "Launch instances" (orange button)
```

### Step 12 — Configure Server Settings

**Name:**
```
Type → siva-practice-server
```

**Operating System (AMI):**
```
Click → Ubuntu (third option)
AMI selected → Ubuntu Server 26.04 LTS ✅
Free tier eligible ✅
```

**Instance Type:**
```
Selected → t2.micro ✅
1 vCPU, 1 GiB Memory
Free tier eligible ✅
```

### Step 13 — Create Key Pair
```
Click → "Create new key pair" (blue link)

Key pair name → siva-practice-key
Key pair type → RSA ✅
File format → .pem ✅ (for Mac)

Click → "Create key pair" (orange button)
```
> ✅ File downloaded → siva-practice-key.pem
> ✅ Saved to → Documents/aws/siva-practice-key.pem

> ⚠️ NEVER delete this file! It's your server password!

### Step 14 — Network Settings
```
Network → Default VPC ✅
Subnet → No preference ✅
Auto-assign public IP → Enable ✅
Firewall → Create new security group ✅
Allow SSH → ✅
Allow HTTP → ✅
Allow HTTPS → ✅
```

### Step 15 — Storage
```
Size → 8 GiB ✅
Type → gp3 ✅
Free tier eligible ✅
```

### Step 16 — Launch!
```
Right side summary check:
✅ AMI → Ubuntu 26.04 LTS
✅ Instance type → t2.micro
✅ Key pair → siva-practice-key
✅ Storage → 8 GiB

Click → "Launch instance" (orange button)
```

---

## PART 4 — Server Details

### Your Running Server! 🎉
```
Name          → siva-practice-server
Instance ID   → i-0c3cbbd46b91f5bc7
Instance Type → t2.micro
OS            → Ubuntu 26.04 LTS
Status        → 🟢 Running
Zone          → ap-south-1b (Mumbai)
Public DNS    → ec2-13-201-132-80.ap-south-1.compute.amazonaws.com
```

---

## PART 5 — Connect to Server via SSH

### Understanding the SSH Command

```
ssh -i "siva-practice-key.pem" ubuntu@ec2-13-201-132-80.ap-south-1.compute.amazonaws.com
```

This command has 3 important parts:

---

#### Part 1 — Private Key (.pem file)
```
-i "siva-practice-key.pem"

-i means "identity file" (your key file)
This is YOUR private key stored on Mac
Location → Documents/aws/siva-practice-key.pem

When we created key pair — AWS created TWO keys:
Private Key (.pem) → Stays on YOUR Mac 💻
Public Key         → Stored on AWS Server automatically 🖥️

How it works:
Your .pem tries to connect
Server checks its public key
Keys MATCH → You are IN! ✅
Keys DON'T MATCH → Access DENIED! ❌

Think of it like:
Your .pem file = Your house key 🔑
EC2 Server     = The house 🏠
Only YOUR key opens THAT lock!
Nobody else can enter without your .pem file!
```

---

#### Part 2 — Username (ubuntu)
```
ubuntu@...

"ubuntu" is the USERNAME of your server!
When we selected Ubuntu OS →
AWS automatically creates a user called "ubuntu"

It's like logging into your Mac
with username "sivaeswaran"!

@ means "at" — just like email
ubuntu AT this server address
```

---

#### Part 3 — Server Address
```
ec2-13-201-132-80.ap-south-1.compute.amazonaws.com

Breaking it down:
ec2              → EC2 service
13-201-132-80    → Your server IP (13.201.132.80)
ap-south-1       → Mumbai region
compute.amazonaws.com → Amazon's domain

Simple meaning → This is your server's address on internet!
```

---

#### Simple Real Life Example:
```
Connecting to server is like going to office:

sivaeswaran @ digient-office-chennai
   (who)           (where)

ubuntu @ ec2-mumbai-server
 (who)       (where)
```

---

### Now Connect — Open Terminal on Mac:
```bash
# Step 1 — Go to .pem file folder
cd ~/Documents/aws/

# Step 2 — Set correct permissions for .pem file (MUST do!)
chmod 400 siva-practice-key.pem

# Step 3 — Connect to server
ssh -i "siva-practice-key.pem" ubuntu@ec2-13-201-132-80.ap-south-1.compute.amazonaws.com

# When asked:
# "Are you sure you want to continue connecting?"
# Type → yes
# Press → Enter
```

> ✅ You will see: ubuntu@ip-xxx-xxx-xxx:~$
> That means you are INSIDE your server! 🎉

---

### What is chmod 400?
```
chmod = Change file permissions
400   = Only YOU can read this file
        Nobody else can read or modify it

AWS requires this for security!
If .pem file has wrong permissions →
SSH will refuse to connect and show error!
```

---

### Successful Connection Output! 🎉

```
Warning: Permanently added 'ec2-13-201-132-80...' to known hosts
Welcome to Ubuntu 26.04 LTS (GNU/Linux 7.0.0-1004-aws x86_64)

System information as of Fri May 22 07:06:03 UTC 2026

System load:  0.08              Processes:       111
Usage of /:   30.4% of 6.61GB  Users logged in: 0
Memory usage: 23%               IPv4 address:    172.31.12.195
Swap usage:   0%

ubuntu@ip-172-31-12-195:~$
```

### What This Means:
```
✅ Welcome to Ubuntu 26.04 LTS  → Server OS confirmed
✅ System load: 0.08            → Server is healthy
✅ Memory usage: 23%            → Plenty of memory free
✅ ubuntu@ip-172-31-12-195:~$   → YOU ARE INSIDE THE SERVER!
```

> 🎉 You are now inside Amazon's server running in Mumbai data center!
> This is YOUR server — fully under your control!

---

## PART 6 — Install Node.js on Server

### Understanding APT and SUDO

#### What is APT?
```
APT = Advanced Package Tool
APT is Ubuntu's App Store + Installer combined!

Ubuntu has a huge online library
of 50,000+ free software packages
APT connects to that library and installs what you need!
```

#### APT vs Mac App Store:
```
Your Mac          Ubuntu Server
App Store      →  APT
Click "Get"    →  apt install
Click "Update" →  apt update
Update All     →  apt upgrade
Uninstall app  →  apt remove
```

#### What is SUDO?
```
sudo = Super User Do
Like "Run as Administrator" on Windows!

Without sudo → Permission denied ❌
With sudo    → Full permission ✅
```

#### Simple Story:
```
You are a new employee (ubuntu user)
You want to install software
You need Admin permission → sudo
Then you open App Store   → apt
Then install the software → install nodejs

sudo    apt    install   nodejs
Admin  Store   Action    App
```

#### Common APT Commands:
```bash
sudo apt update          # Refresh package list
sudo apt upgrade         # Update all packages
sudo apt install nodejs  # Install Node.js
sudo apt install git     # Install Git
sudo apt install mysql   # Install MySQL
sudo apt remove nodejs   # Uninstall Node.js
```

#### What packages does Ubuntu have by default?
```
✅ Basic Linux commands (ls, cd, mkdir)
✅ Basic networking tools
✅ Basic system tools

❌ Node.js   → Need to install
❌ Git       → Need to install
❌ MySQL     → Need to install
❌ Docker    → Need to install
❌ Nginx     → Need to install
```

---

### Step by Step Installation:

#### Step 1 — Update & Upgrade Server
```bash
sudo apt update && sudo apt upgrade -y
```

**Actual Output:**
```
✅ 33 packages upgraded
✅ 28 security updates applied
✅ Server is fully up to date!
✅ Prompt back → ubuntu@ip-172-31-12-195:~$
```

**What happened:**
```
sudo apt update   → Refreshed package list from Ubuntu servers
sudo apt upgrade  → Downloaded and installed 33 package updates
-y                → Auto answered "yes" to all prompts
&&                → Run second command only if first succeeded
```

---

#### Step 2 — Install Node.js 20

##### What is curl?
```
CURL = Client URL

curl is a download tool for Terminal!
Like a browser — but in command line!

Normal way → Open Chrome → Go to website → Download file
curl way   → Type command → File downloads instantly!
```

##### curl flags explained:
```
-f  → Fail silently if error occurs
-s  → Silent mode (no progress bar shown)
-S  → Show error if -s fails
-L  → Follow redirects (if URL changes)
```

##### What is PIPE ( | )?
```
| = Send output of first command to second command

curl downloads script
       ↓  (pipe sends it)
bash runs the script
```

##### Simple Story:
```
curl is like a delivery boy 🛵
You give him an address (URL)
He brings the package (script)
You run the package (bash)
```

##### Full command breakdown:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```
```
curl          → Download tool
-fsSL         → Download flags (fail safe, silent, follow redirects)
https://...   → NodeSource official Node.js setup URL
|             → Pipe — send downloaded content to next command
sudo -E bash  → Run downloaded script as Admin
-             → Read from pipe input
```

##### What actually happens:
```
Step 1 → curl downloads setup script from NodeSource
Step 2 → Script is sent to bash via pipe (|)
Step 3 → bash runs the script as admin (sudo)
Step 4 → Script adds NodeSource to Ubuntu's package list
Step 5 → Now Ubuntu knows where to find Node.js! ✅
```

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

**Actual Output:**
```
2026-05-22 07:17:27 - Installing pre-requisites
2026-05-22 07:17:35 - Repository configured successfully ✅
2026-05-22 07:17:35 - To install Node.js, run: apt install nodejs -y
```

> ⚠️ Note: Connection may close after this step because
> SSH service restarts as part of openssh-server upgrade.
> This is normal! Just reconnect and continue! 😊

**Reconnect to server:**
```bash
ssh -i "siva-practice-key.pem" ubuntu@ec2-13-201-132-80.ap-south-1.compute.amazonaws.com
```

**Then install Node.js:**
```bash
sudo apt install nodejs -y
```

**Actual Output:**
```
Installing: nodejs
Download size: 32.2 MB
nodejs 20.20.2-1nodesource1 installed successfully ✅
```

**Verify installation:**
```bash
node -v    # v20.20.2 ✅
npm -v     # 10.8.2 ✅
```

**Actual Output:**
```
ubuntu@ip-172-31-12-195:~$ node -v
v20.20.2
ubuntu@ip-172-31-12-195:~$ npm -v
10.8.2
```

```bash
# Then install Node.js
sudo apt-get install -y nodejs
```

#### Step 3 — Verify Installation
```bash
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x
```

---

## PART 7 — Install NestJS

### Install NestJS CLI Globally

```bash
# Install NestJS CLI globally (-g means global)
sudo npm install -g @nestjs/cli
```

**What is -g flag?**
```
-g = Global install
Without -g → installed in current folder only
With -g    → available everywhere on server ✅
```

**Actual Output:**
```
added 210 packages in 8s
38 packages are looking for funding ✅
```

### Verify NestJS Installation

```bash
nest --version
```

**Actual Output:**
```
ubuntu@ip-172-31-12-195:~$ nest --version
11.0.21 ✅
```

### Full Server Status After Setup! 🎉

```
ubuntu@ip-172-31-12-195:~$ node -v
v20.20.2 ✅

ubuntu@ip-172-31-12-195:~$ npm -v
10.8.2 ✅

ubuntu@ip-172-31-12-195:~$ nest --version
11.0.21 ✅
```

> 🎉 Your AWS EC2 server is now fully ready!
> Node.js + npm + NestJS all installed and running
> in Mumbai data center!

---

## PART 8 — Important Tips

### Stop Server When Not Using (Save Free Tier!)
```
AWS Console → EC2 → Instances
Tick your instance
Click → Instance State → Stop
```

### Start Server Again
```
AWS Console → EC2 → Instances
Tick your instance
Click → Instance State → Start
```

> ⚠️ Public IP changes when you stop/start!
> Note new IP each time before connecting.

---

## PART 9 — Stop and Start Server (Detailed Steps)

### How to STOP EC2 Server:
```
Step 1  → Go to AWS Console → ap-south-1.console.aws.amazon.com
Step 2  → Click EC2
Step 3  → Click Instances
Step 4  → Tick checkbox next to "siva-practice-server" ✅
Step 5  → Click "Instance state" button (top)
Step 6  → Click "Stop instance"
Step 7  → Confirmation popup appears
Step 8  → Click orange "Stop" button
Step 9  → Instance state changes to "Stopping"
Step 10 → Wait 1-2 mins → Changes to "Stopped" ✅
```

### How to START EC2 Server:
```
Step 1  → Go to AWS Console
Step 2  → Click EC2
Step 3  → Click Instances
Step 4  → Tick checkbox next to "siva-practice-server" ✅
Step 5  → Click "Instance state" button (top)
Step 6  → Click "Start instance"
Step 7  → Instance state changes to "Pending"
Step 8  → Wait 1-2 mins → Changes to "Running" ✅
Step 9  → Get NEW Public IP from instance details!
Step 10 → Connect via SSH using new IP!
```

### ⚠️ NEVER Click This!
```
❌ "Terminate (delete) instance"
   Deletes your server FOREVER!
   All data gone! Cannot recover!

Stop      = Safe ✅ Can start again anytime!
Terminate = Gone forever ❌ Never click!
```

### Charges When Stopped:
```
EC2 compute  → No charge ✅
EBS storage  → Very minimal charge (8GB ≈ free!) ✅
Public IP    → No charge when stopped ✅
```

### ⚠️ IP Changes Every Time You Start!
```
Every time you START your server →
Public IP changes automatically!

Example:
Before stop → 13.201.132.80
After start → 13.201.XXX.XX (different!)

Always check new IP in AWS Console before connecting!

To get permanent IP → Use Elastic IP (covered later!)
```

### Reconnect After Starting:
```bash
# Step 1 — Check new IP in AWS Console first!
# Step 2 — Connect with new IP:
ssh -i "siva-practice-key.pem" ubuntu@NEW-IP.ap-south-1.compute.amazonaws.com
```

---

## Key Concepts Learned Today

| Concept | Meaning |
|---|---|
| **EC2** | Rent a server from Amazon |
| **AMI** | Ready-made OS image (like Ubuntu) |
| **t2.micro** | Small free server (1 CPU, 1GB RAM) |
| **Key Pair (.pem)** | Your server login password file |
| **Security Group** | Firewall — controls who can access server |
| **SSH** | Secure way to connect to server via Terminal |
| **Region** | Location of Amazon's data center |
| **Free Tier** | 750 hours/month free for 12 months |

---

## What You Can Say in Interview 🎯

> *"I set up an AWS EC2 instance from scratch. I created an Ubuntu 26.04 t2.micro instance in the Mumbai region, configured security groups to allow SSH, HTTP, and HTTPS traffic, generated RSA key pairs for secure access, and successfully launched the server. I also set up AWS Budgets with zero-spend alerts to monitor costs. I use EC2 for always-on Node.js backend services and Lambda for serverless event-driven tasks."*

---

*AWS Setup completed on May 22, 2026 — by Siva Panneerselvam 💪🚀*
---

## PART 10 — Elastic IP Setup (Fixed Permanent IP)

**Date:** 2026-05-23
**Why:** Public IP changes every time EC2 stops/starts. Elastic IP fixes it permanently.

### What is Elastic IP?
```
Normal EC2 IP  → Changes every time you stop/start server ❌
Elastic IP     → Fixed permanent IP — never changes ✅

Think of it like:
Normal IP   = Renting a phone number (changes every contract)
Elastic IP  = Owning your phone number (yours forever!)
```

### Cost Warning ⚠️
```
Elastic IP is FREE when EC2 is RUNNING ✅
Elastic IP costs money when EC2 is STOPPED ❌

So:
If you stop EC2 for long time → Release Elastic IP too!
If you stop EC2 temporarily   → Elastic IP is fine to keep!
```

### Step 1 — Go to Elastic IPs
```
AWS Console → Search "EC2" → Click EC2
Left sidebar → scroll down to "Network & Security"
Click → "Elastic IPs"
```

### Step 2 — Allocate New IP
```
Click → "Allocate Elastic IP address" (orange button)
Network border group → ap-south-1 (already selected ✅)
Click → "Allocate" (orange button)
```
> ✅ You get a permanent IP — note it down immediately!

### Step 3 — Associate to Your Server
```
Tick the new Elastic IP checkbox
Click → "Actions" button (top right)
Click → "Associate Elastic IP address"

Resource type → Instance ✅
Instance → select "siva-practice-server"
Private IP → select the one shown (auto-filled)
Click → "Associate" (orange button)
```

### Result
```
✅ EC2 now has permanent fixed IP
✅ IP will NOT change on stop/start anymore
✅ Use this new Elastic IP for all SSH connections
✅ Use this IP in GitHub Secrets for CI/CD
```

### New SSH Command (after Elastic IP)
```bash
# Replace OLD-IP with your new Elastic IP
ssh -i "siva-practice-key.pem" ubuntu@YOUR-ELASTIC-IP
```

---

## PART 11 — Open Port 3000 in Security Group

**Why:** Your Node.js app runs on port 3000. AWS firewall blocks it by default.

### Step 1 — Go to Security Groups
```
AWS Console → EC2
Left sidebar → Network & Security → Security Groups
Click on the security group linked to "siva-practice-server"
```

### Step 2 — Edit Inbound Rules
```
Click → "Inbound rules" tab
Click → "Edit inbound rules" (button)
Click → "Add rule" (bottom)

New rule:
Type       → Custom TCP
Port range → 3000
Source     → Anywhere-IPv4 (0.0.0.0/0)

Click → "Save rules" (orange button)
```

### Result
```
✅ Port 3000 now open
✅ Your API will be accessible at:
   http://YOUR-ELASTIC-IP:3000
   http://YOUR-ELASTIC-IP:3000/api-docs
```

---

## PART 12 — Install Docker on EC2

**Why:** We will run the Node.js app + MySQL inside Docker containers.

### SSH into your server first
```bash
cd ~/Documents/aws/
ssh -i "siva-practice-key.pem" ubuntu@YOUR-ELASTIC-IP
```

### Step 1 — Update server
```bash
sudo apt update
```

### Step 2 — Install Docker
```bash
sudo apt install docker.io -y
```

**Actual expected output:**
```
Reading package lists... Done
...
docker.io installed successfully ✅
```

### Step 3 — Start Docker & enable on boot
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 4 — Add ubuntu user to docker group
```bash
sudo usermod -aG docker ubuntu
```
> ⚠️ Log out and log back in for this to take effect!

```bash
exit
ssh -i "siva-practice-key.pem" ubuntu@YOUR-ELASTIC-IP
```

### Step 5 — Install Docker Compose
```bash
sudo apt install docker-compose -y
```

### Step 6 — Verify installations
```bash
docker --version
docker-compose --version
```

**Expected output:**
```
Docker version 24.x.x ✅
docker-compose version 1.x.x ✅
```

---

## PART 13 — Dockerize node-auth-app (On Your Mac)

**Do these steps on your Mac in VS Code / Terminal**

### Step 1 — Create Dockerfile
```
File location: node-auth-app/Dockerfile
```

```dockerfile
# Use Node.js 20 official image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

### Step 2 — Create docker-compose.yml
```
File location: node-auth-app/docker-compose.yml
```

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: nodeauth-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: nodeauthdb
      MYSQL_USER: nodeuser
      MYSQL_PASSWORD: NodePass@123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  # Node.js API
  app:
    build: .
    container_name: nodeauth-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      DB_HOST: mysql
      DB_USER: nodeuser
      DB_PASSWORD: NodePass@123
      DB_NAME: nodeauthdb
      JWT_SECRET: siva_secret_key_2026
    depends_on:
      - mysql

volumes:
  mysql_data:
```

### Step 3 — Create .dockerignore
```
File location: node-auth-app/.dockerignore
```

```
node_modules
dist
.env
.git
*.md
```

### Step 4 — Update .env for Docker
```
DB_HOST should be "mysql" (not "localhost") when running in Docker!
Docker containers talk to each other by service name.
```

### Step 5 — Test locally (optional)
```bash
cd /Users/sivaeswaran/Documents/work/node-auth-app
docker-compose up --build
```

---

## PART 14 — GitHub Actions CI/CD Setup

**What happens:**
```
You push code to GitHub (main branch)
         ↓
GitHub Actions triggers automatically
         ↓
SSHs into your EC2 server
         ↓
Pulls latest code + rebuilds Docker containers
         ↓
App is live on EC2 ✅
```

### Step 1 — Generate SSH Key Pair for GitHub Actions (On Your Mac)

```bash
# Run this on your Mac Terminal
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_key -N ""
```

**This creates two files:**
```
~/.ssh/github_actions_key      ← Private key (goes to GitHub Secrets)
~/.ssh/github_actions_key.pub  ← Public key (goes to EC2 server)
```

### Step 2 — Add Public Key to EC2 Server

```bash
# Copy public key content
cat ~/.ssh/github_actions_key.pub

# SSH into your EC2 server
ssh -i "siva-practice-key.pem" ubuntu@YOUR-ELASTIC-IP

# Add to authorized keys
echo "PASTE-YOUR-PUBLIC-KEY-HERE" >> ~/.ssh/authorized_keys

# Exit server
exit
```

### Step 3 — Add Secrets to GitHub

```
Go to → github.com/sivasivaukt/node-auth-app
Click → Settings tab
Left sidebar → Secrets and variables → Actions
Click → "New repository secret"

Add these 3 secrets:

Secret 1:
Name  → EC2_HOST
Value → YOUR-ELASTIC-IP

Secret 2:
Name  → EC2_USER
Value → ubuntu

Secret 3:
Name  → EC2_SSH_KEY
Value → paste entire content of ~/.ssh/github_actions_key
        (include -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----)
```

### Step 4 — Create GitHub Actions Workflow File

```
File location: node-auth-app/.github/workflows/deploy.yml
```

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/node-auth-app
            git pull origin main
            docker-compose down
            docker-compose up --build -d
            echo "✅ Deployment complete!"
```

### Step 5 — First Time: Clone Repo on EC2

```bash
# SSH into EC2
ssh -i "siva-practice-key.pem" ubuntu@YOUR-ELASTIC-IP

# Clone your repo
git clone https://github.com/sivasivaukt/node-auth-app.git

# Go into folder
cd node-auth-app

# Create .env file on server
nano .env
```

**.env content on EC2:**
```env
PORT=3000
DB_HOST=mysql
DB_USER=nodeuser
DB_PASSWORD=NodePass@123
DB_NAME=nodeauthdb
JWT_SECRET=siva_secret_key_2026
```

```bash
# First time: build and start
docker-compose up --build -d
```

---

## PART 15 — Test the Full CI/CD Pipeline

### Trigger a deployment
```bash
# On your Mac — make any small change
# Example: update a comment in src/index.ts

# Then push to GitHub
git add .
git commit -m "test: trigger CI/CD deployment"
git push origin main
```

### Watch it deploy
```
Go to → github.com/sivasivaukt/node-auth-app
Click → "Actions" tab
You will see the workflow running! ✅
Green tick = deployed successfully ✅
Red cross  = check the logs for errors ❌
```

### Verify API is live
```
Open browser:
http://YOUR-ELASTIC-IP:3000          → Health check
http://YOUR-ELASTIC-IP:3000/api-docs → Swagger UI
```

---

## CI/CD Key Concepts Learned

| Concept | Meaning |
|---|---|
| **Docker** | Package app + all dependencies into a container |
| **Docker Compose** | Run multiple containers together (app + mysql) |
| **GitHub Actions** | Auto-run tasks when you push code |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **Elastic IP** | Fixed permanent IP for your EC2 server |
| **SSH Key for CI/CD** | Separate key pair for GitHub to access EC2 |
| **Secrets** | Sensitive values stored safely in GitHub |

---

## What You Can Say in Interview 🎯

> *"I set up a full CI/CD pipeline using GitHub Actions and Docker on AWS EC2. When I push code to the main branch, GitHub Actions automatically SSHs into my EC2 server, pulls the latest code, rebuilds the Docker containers, and restarts the app. The backend Node.js API and MySQL database both run as Docker containers managed by Docker Compose. I also assigned an Elastic IP to keep the server address permanent."*

---

*CI/CD Setup added on 2026-05-23 — by Siva Panneerselvam 💪🚀*

---

## PART 10 — Actual Results (2026-05-23)

### Elastic IP Allocated & Associated ✅
```
Elastic IP    → 13.204.38.60 (PERMANENT — never changes!)
Associated to → siva-practice-server (i-0c3cbbd46b91f5bc7)
Private IP    → 172.31.12.195
Region        → ap-south-1 (Mumbai)

Old IP (before) → 3.108.219.106 (was changing every stop/start)
New IP (now)    → 13.204.38.60 (permanent forever!) ✅
```

### New SSH Command (use this from now on!)
```bash
cd ~/Documents/aws/
ssh -i "siva-practice-key.pem" ubuntu@13.204.38.60
```

> ✅ Never need to check for new IP again!
> ✅ GitHub Actions will always use 13.204.38.60

---

## PART 16 — Docker Installation on EC2 (2026-05-23)

### Step 1 — Install Docker
```bash
sudo apt update
sudo apt install docker.io -y
```

**Output:**
```
✅ Docker installed successfully
```

### Step 2 — Start & Enable Docker
```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

```
✅ Docker started
✅ Docker enabled on boot
✅ ubuntu user added to docker group
```

### Step 3 — Install Docker Compose
```bash
sudo apt install docker-compose -y
```

> Note: Ubuntu installed docker-compose-v2
> Command is now → docker compose (no hyphen!)

### Step 4 — Verify
```bash
docker --version
docker compose version
```

**Actual Output:**
```
Docker version 29.1.3 ✅
Docker Compose version 2.40.3 ✅
```

---

## PART 17 — SSH Key for GitHub Actions (2026-05-23)

### What & Why
```
We need GitHub Actions to SSH into EC2 automatically
So we create a separate SSH key pair just for GitHub Actions

Private key → Goes to GitHub Secrets (GitHub uses this to connect)
Public key  → Goes to EC2 server (EC2 uses this to verify)
```

### Step 1 — Generate SSH Key Pair (on Mac)
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_key -N ""
```

**Files created:**
```
~/.ssh/github_actions_key      ← Private key (goes to GitHub Secrets)
~/.ssh/github_actions_key.pub  ← Public key (goes to EC2 server)
```

### Step 2 — Add Public Key to EC2
```bash
# On EC2 server:
echo "PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys

# Verify 2 keys are present:
cat ~/.ssh/authorized_keys
```

**Result:**
```
✅ Key 1 → siva-practice-key (personal SSH access)
✅ Key 2 → github-actions-deploy (GitHub Actions access)
```

---

## PART 18 — Docker Files Created (2026-05-23)

### Files added to node-auth-app:

**1. Dockerfile**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**2. docker-compose.yml**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: nodeauth-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: nodeauthdb
      MYSQL_USER: nodeuser
      MYSQL_PASSWORD: NodePass@123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
  app:
    build: .
    container_name: nodeauth-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      DB_HOST: mysql
      DB_USER: nodeuser
      DB_PASSWORD: NodePass@123
      DB_NAME: nodeauthdb
      JWT_SECRET: siva_secret_key_2026
    depends_on:
      - mysql
volumes:
  mysql_data:
```

**3. .dockerignore**
```
node_modules
dist
.env
.git
*.md
```

**4. .github/workflows/deploy.yml**
```yaml
name: Deploy to EC2
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/node-auth-app
            git pull origin main
            docker compose down
            docker compose up --build -d
            echo "✅ Deployment complete!"
```

---

## PART 19 — GitHub Secrets to Add

```
Go to → github.com/sivasivaukt/node-auth-app
Click → Settings → Secrets and variables → Actions
Click → New repository secret
```

| Secret Name | Value |
|-------------|-------|
| EC2_HOST | 13.204.38.60 |
| EC2_USER | ubuntu |
| EC2_SSH_KEY | contents of ~/.ssh/github_actions_key (private key) |

### Get Private Key content (run on Mac):
```bash
cat ~/.ssh/github_actions_key
```
Copy everything including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

---

## PART 20 — First Docker Deployment Results (2026-05-23)

### Issue Found & Fixed
```
Problem → Dockerfile was pushed inside subfolder (node-auth-app/Dockerfile)
          instead of root folder

Fix → Copied files to correct location on EC2:
cp node-auth-app/Dockerfile .
cp node-auth-app/.dockerignore .
cp -r node-auth-app/.github .
```

### First Build & Run
```bash
git pull origin main
docker compose up --build -d
```

**Build Output:**
```
✅ MySQL image pulled successfully
✅ Node.js app built successfully (32.7s)
✅ npm install completed
✅ TypeScript compiled (npm run build)
✅ Docker image created → node-auth-app-app:latest
```

**Containers Started:**
```
✅ Network  → node-auth-app_default   (Created)
✅ Volume   → node-auth-app_mysql_data (Created)
✅ MySQL    → nodeauth-mysql (Started)
✅ App      → nodeauth-app (Started)
```

### Verify Running Containers
```bash
docker ps
```

**Output:**
```
CONTAINER ID   IMAGE               PORTS                    NAMES
e3b645c80a34   node-auth-app-app   0.0.0.0:3000->3000/tcp   nodeauth-app
0f31befaed78   mysql:8.0           0.0.0.0:3306->3306/tcp   nodeauth-mysql
```

### API URLs (Live on AWS!)
```
Health check → http://13.204.38.60:3000
Swagger UI   → http://13.204.38.60:3000/api-docs
```

---

## PART 21 — Fix File Structure (Important!)

### Problem
```
Files were committed from wrong folder in SourceTree
Resulted in nested path: node-auth-app/Dockerfile
Should be: Dockerfile (in root)
```

### Permanent Fix
Move files to correct location in VS Code:
```
node-auth-app/          ← ROOT
├── Dockerfile          ← should be HERE ✅
├── .dockerignore       ← should be HERE ✅
├── docker-compose.yml  ← already here ✅
├── .github/
│   └── workflows/
│       └── deploy.yml  ← should be HERE ✅
└── src/
```

---

## PART 22 — CI/CD Pipeline Complete! 🎉

### Full Flow Working:
```
Push code to GitHub (main branch)
         ↓
GitHub Actions triggers automatically
         ↓
SSH into EC2 (13.204.38.60)
         ↓
git pull origin main
         ↓
docker compose down
docker compose up --build -d
         ↓
✅ App live at http://13.204.38.60:3000
```

### Useful Docker Commands
```bash
docker ps                    # See running containers
docker compose up --build -d # Build and start in background
docker compose down          # Stop all containers
docker compose logs -f       # See live logs
docker compose restart       # Restart containers
```

### What You Achieved Today 🏆
```
✅ AWS EC2 server with permanent Elastic IP (13.204.38.60)
✅ Port 3000 open in Security Group
✅ Docker + Docker Compose installed on EC2
✅ Dockerfile created for Node.js app
✅ docker-compose.yml with app + MySQL
✅ GitHub Actions CI/CD pipeline
✅ Auto-deploy on every git push to main
✅ API live on AWS! 🚀
```

### Interview Answer 🎯
> "I set up a complete CI/CD pipeline using GitHub Actions and Docker on AWS EC2. 
> When I push code to the main branch, GitHub Actions automatically SSHs into my 
> EC2 server, pulls the latest code, rebuilds the Docker containers, and restarts 
> the app. The Node.js API and MySQL both run as Docker containers managed by 
> Docker Compose. The server has a permanent Elastic IP (13.204.38.60) and port 
> 3000 is open via Security Group rules."

---

*CI/CD Deployment completed on 2026-05-23 — by Siva Panneerselvam 💪🚀*

---

## PART 23 — Today's Complete Summary (2026-05-23)

### What Was Accomplished Today 🏆

#### Morning Session
```
✅ GitHub SourceTree PAT fix
   → Added Personal Access Token
   → Fixed push authentication error

✅ AWS Console Login
   → Logged in with root user email
   → Skipped MFA (34 day grace period)
```

#### AWS Setup
```
✅ Elastic IP allocated → 13.204.38.60
   → Permanent IP (never changes on stop/start)
   → Associated to siva-practice-server

✅ Security Group updated
   → Port 22  (SSH) → already open
   → Port 3000 (API) → opened today ✅
```

#### EC2 Server Setup
```
✅ SSH connected using new Elastic IP
   ssh -i "siva-practice-key.pem" ubuntu@13.204.38.60

✅ Docker installed → version 29.1.3
✅ Docker Compose installed → version 2.40.3
✅ ubuntu user added to docker group
```

#### Docker Files Created
```
✅ Dockerfile
✅ docker-compose.yml (app + MySQL)
✅ .dockerignore
✅ .github/workflows/deploy.yml
```

#### GitHub Actions CI/CD
```
✅ SSH key pair generated for GitHub Actions
✅ Public key added to EC2 authorized_keys
✅ 3 GitHub Secrets added:
   → EC2_HOST     = 13.204.38.60
   → EC2_USER     = ubuntu
   → EC2_SSH_KEY  = private key

✅ CI/CD Pipeline working!
   Push to main → Auto deploy to EC2! 🎉
```

#### First Deployment
```
✅ Repo cloned on EC2
✅ .env file created on EC2
✅ docker compose up --build -d

Running containers:
→ nodeauth-app   (port 3000) ✅
→ nodeauth-mysql (port 3306) ✅

Live API URLs:
→ http://13.204.38.60:3000
→ http://13.204.38.60:3000/api-docs
```

---

## PART 24 — Tomorrow's Plan (2026-05-24)

### Morning — Interview Practice (10 Mock Rounds!)
```
Round 1  → Basic HR + Intro
Round 2  → Junior Node.js Developer
Round 3  → Junior Frontend (Next.js)
Round 4  → Junior DevOps (Docker + CI/CD)
Round 5  → Full Stack Junior
-- Break --
Round 6  → Mid-level Full Stack
Round 7  → AWS + Cloud focused
Round 8  → System Design (basic)
Round 9  → Strict Technical
Round 10 → Final Boss Round 🔥
```

### Afternoon — Frontend Deployment
```
→ S3 bucket for apps/app
→ S3 bucket for apps/bo
→ CloudFront CDN for both
→ Frontend live on AWS!
```

---

## PART 25 — Tonight's Learning (2026-05-23)

### Topics Covered:
```
→ Kubernetes concepts
→ Microservices concepts
→ S3 + CloudFront (practical)
```

### Key Concepts Learned:

#### Docker (Completed Today ✅)
```
Docker     = Package app in a container
Dockerfile = Recipe to build image
Image      = Packaged app ready to run
Container  = Running instance of image
Docker Compose = Run multiple containers together
Volume     = Persistent data storage
```

---

## Server Quick Reference 📋

### SSH Command
```bash
cd ~/Documents/aws/
ssh -i "siva-practice-key.pem" ubuntu@13.204.38.60
```

### Docker Commands
```bash
docker ps                      # See running containers
docker compose up --build -d   # Build and start
docker compose down            # Stop all containers
docker compose logs -f         # Live logs
docker compose restart         # Restart containers
```

### GitHub Actions Trigger
```bash
# On Mac — push to main branch:
git add .
git commit -m "your message"
git push origin main
# → Auto deploys to EC2! ✅
```

### API Endpoints (Live)
```
GET  http://13.204.38.60:3000           → Health check
POST http://13.204.38.60:3000/auth/signup → Register
POST http://13.204.38.60:3000/auth/login  → Login
GET  http://13.204.38.60:3000/api-docs    → Swagger UI
```

---

*Session completed: 2026-05-23 — Siva Panneerselvam 💪🚀*
*"Most freshers only know theory. You have a REAL deployed project on AWS!"*
