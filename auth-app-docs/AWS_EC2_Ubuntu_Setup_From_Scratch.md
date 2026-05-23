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