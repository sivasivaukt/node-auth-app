# Node.js Auth App — Complete Setup Guide (TypeScript)
**Prepared for:** Siva Panneerselvam  
**Date:** May 22, 2026  
**Purpose:** Build and deploy Node.js Auth API with TypeScript + MySQL + Swagger on AWS EC2

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **TypeScript** | Type-safe JavaScript |
| **MySQL** | Database |
| **Swagger** | API documentation + testing |
| **JWT** | Authentication token |
| **bcryptjs** | Password encryption |
| **dotenv** | Environment variables |
| **cors** | Cross origin requests |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | Health check |
| POST | /auth/signup | Register new user |
| POST | /auth/login | Login + get JWT token |

---

## PART 1 — Project Setup

### Step 1 — Create Project Folder
```bash
mkdir node-auth-app
cd node-auth-app
npm init -y
```

### Step 2 — Install Production Packages
```bash
npm install express mysql2 swagger-ui-express swagger-jsdoc jsonwebtoken bcryptjs dotenv cors
```

### Step 3 — Install TypeScript Dev Packages
```bash
npm install -D typescript ts-node @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/swagger-ui-express @types/swagger-jsdoc
```

**Packages explained:**
```
express              → Web server framework
mysql2               → MySQL database connection
swagger-ui-express   → Swagger UI in browser
swagger-jsdoc        → Generate swagger from comments
jsonwebtoken         → Create and verify JWT tokens
bcryptjs             → Hash passwords securely
dotenv               → Load .env variables
cors                 → Allow cross origin requests
typescript           → TypeScript compiler
ts-node              → Run TypeScript directly
@types/*             → Type definitions for packages
```

---

### What is the difference between npm install and npm install -D?

#### Production Packages (no -D flag):
```bash
npm install express mysql2 ...
```
```
Used in BOTH places:
✅ Your Mac (while coding)
✅ EC2 Server (while running)

App NEEDS these to run!
Without these → App crashes!

Goes into → "dependencies" in package.json
Uploaded to EC2 server!
```

#### Dev Packages (-D flag):
```bash
npm install -D typescript ts-node ...
```
```
Used ONLY on your Mac!
✅ Your Mac (while coding)
❌ NOT needed on EC2 server

Only helps you while coding!
On EC2 we run compiled .js files
So TypeScript not needed there!

Goes into → "devDependencies" in package.json
NOT uploaded to EC2 server!
```

#### Simple Real Life Example 🏠
```
Building a house:

Production packages (no -D):
→ Bricks, cement, windows
→ House NEEDS these to exist!
→ Used during building AND after!

Dev packages (-D):
→ Hammer, drill, measuring tape
→ Only needed WHILE building!
→ Once house is built → not needed!
```

#### Simple Timeline:
```
While coding on Mac →
  Use BOTH production + dev packages ✅

When deploying to EC2 →
  Use ONLY production packages ✅
  Skip dev packages! ❌
```

#### In package.json:
```json
{
  "dependencies": {
    "express": "^4.18.0",      ← Needed on server ✅
    "mysql2": "^3.0.0",        ← Needed on server ✅
    "jsonwebtoken": "^9.0.0"   ← Needed on server ✅
  },
  "devDependencies": {
    "typescript": "^5.0.0",    ← Only on Mac ✅
    "ts-node": "^10.0.0",      ← Only on Mac ✅
    "@types/express": "^4.0.0" ← Only on Mac ✅
  }
}
```

#### On EC2 Server — Install only production:
```bash
npm install --production
# Skips devDependencies → saves space on server!
```

#### Simple Rule:
```
No -D flag → App needs it to RUN   → dependencies
With -D    → Only needed to BUILD  → devDependencies

Production package = Travels everywhere 🌍 Mac + Server
Dev package        = Stays at home 🏠 Mac only!
```

### Step 4 — Initialize TypeScript Config
```bash
npx tsc --init
```

---

## PART 2 — Project Structure

```
node-auth-app/
├── src/
│   ├── index.ts                  → Main server file
│   ├── config/
│   │   └── db.ts                 → MySQL connection
│   ├── controllers/
│   │   └── authController.ts     → Signup + Login logic
│   ├── routes/
│   │   └── auth.ts               → API routes
│   └── swagger.ts                → Swagger configuration
├── tsconfig.json                 → TypeScript config
├── .env                          → Environment variables
└── package.json                  → Dependencies
```

---

## PART 3 — TypeScript Config (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": false,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## PART 4 — Package.json Scripts

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc"
  }
}
```

---

## PART 5 — Environment Variables (.env)

```env
PORT=3000
DB_HOST=localhost
DB_USER=nodeuser
DB_PASSWORD=NodePass@123
DB_NAME=nodeauthdb
JWT_SECRET=siva_secret_key_2026
```

---

## PART 6 — MySQL Setup (Local Mac)

### Step 1 — Install MySQL via Homebrew:
```bash
# Check Homebrew version first
brew --version
# Homebrew 4.6.16 ✅

# Install MySQL
brew install mysql
```

### Step 2 — Start MySQL Service:
```bash
brew services start mysql
# ==> Successfully started `mysql` ✅
```

### Step 3 — Check MySQL Version:
```bash
mysql --version
# mysql  Ver 9.6.0 for macos26.4 on arm64 (Homebrew) ✅
```

### Step 4 — Login to MySQL:
```bash
mysql -u root
```

**Flags explained:**
```
-u = username flag
-p = password flag (ask password)
-h = host flag
-P = port flag

mysql -u root = Login as root user (no password)
```

### Step 5 — Create Database:
```sql
CREATE DATABASE nodeauthdb;
```
```
Output → Query OK, 1 row affected ✅
```

### Step 6 — Select Database:
```sql
USE nodeauthdb;
```
```
Output → Database changed ✅
```

### Step 7 — Create Users Table:
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 8 — Create MySQL User:
```sql
CREATE USER 'nodeuser'@'localhost' IDENTIFIED BY 'NodePass@123';
GRANT ALL PRIVILEGES ON nodeauthdb.* TO 'nodeuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Understanding CREATE USER Command:
```sql
CREATE USER 'nodeuser'@'localhost' IDENTIFIED BY 'NodePass@123';
```

```
4 Parts explained:

1. CREATE USER
   → Creates a new MySQL login account

2. 'nodeuser'
   → The username
   → Our Node.js app logs in with this name

3. @'localhost'
   → @ means "at"
   → localhost means "this same computer only"
   → Security! Nobody from outside can login!

4. IDENTIFIED BY 'NodePass@123'
   → The password
   → Our Node.js app uses this to connect
```

### Understanding GRANT Command:
```sql
GRANT ALL PRIVILEGES ON nodeauthdb.* TO 'nodeuser'@'localhost';
```

```
4 Parts explained:

1. GRANT ALL PRIVILEGES
   → Give ALL permissions to user
   → SELECT, INSERT, UPDATE, DELETE, CREATE, DROP

2. ON nodeauthdb.*
   → ON = which database
   → nodeauthdb = our database
   → .* = all tables inside it

3. TO 'nodeuser'
   → Give to this user

4. @'localhost'
   → Only from this machine
   → Security protection!
```

### Simple Real Life Example:
```
Like giving office access card:

GRANT   ALL ACCESS    ON   3rd Floor   TO    'Siva'
(give) (all rooms)  (at) (location)  (who)  (person)

MySQL version:
GRANT ALL PRIVILEGES ON nodeauthdb.* TO 'nodeuser'@'localhost'
(give) (all actions)   (database)       (user)    (machine)
```

### Why Not Grant on All Databases?
```
❌ GRANT ALL PRIVILEGES ON *.*
   → Access to ALL databases → Dangerous!

✅ GRANT ALL PRIVILEGES ON nodeauthdb.*
   → Access to ONLY nodeauthdb → Safe! ✅
```

### SQL Case Sensitivity Rules:
```
SQL Keywords  → NOT case sensitive ✅
  GRANT = grant = Grant (all same!)

Database/Table names → Case sensitive ⚠️
  nodeauthdb ≠ NODEAUTHDB ≠ NodeAuthDb

Usernames → Case sensitive ⚠️
Passwords → Case sensitive ⚠️
```

### Best Practice:
```sql
-- SQL Keywords → UPPERCASE
-- Database/Table names → lowercase
SELECT * FROM users WHERE email = 'siva@gmail.com';
```

### Common Spelling Mistake:
```
previlages ← Wrong! ❌
privileges ← Correct! ✅

Remember: privilege (English word) + s = privileges
```

### Simple Real Life Example:
```
Like creating office email account:

CREATE USER  'siva'     @ 'digient.com' IDENTIFIED BY 'password'
              (name)      (company)                   (password)

MySQL version:
CREATE USER 'nodeuser'@'localhost' IDENTIFIED BY 'NodePass@123'
             (name)     (machine)                 (password)
```

### In Your .env File:
```env
DB_USER=nodeuser         ← This username
DB_PASSWORD=NodePass@123 ← This password
```

### Important MySQL Tips:
```
✅ Every SQL command ends with ; (semicolon)
✅ Without ; → MySQL waits for more input (shows ->)
✅ Just type ; and press Enter to execute!
✅ Always copy paste SQL → Don't type manually!
   One small typo → Error!
```

---

## PART 6B — DBeaver Setup (Visual Database Tool)

### What is DBeaver?
```
DBeaver is a FREE database GUI tool!
Like VS Code but for databases!

Instead of typing SQL commands →
You can SEE your database visually!

✅ See all tables visually
✅ Run SQL queries easily
✅ See data in table format
✅ Supports MySQL, PostgreSQL, Redis, 80+ databases!
```

### Install DBeaver:
```
Download → dbeaver.io/download
Select   → DBeaver Community (FREE)
Choose   → macOS Apple Silicon (M1/M2/M3)
Install  → Drag to Applications
Version  → DBeaver 26.0.5
```

### Connect MySQL to DBeaver:

#### Step 1 — New Connection:
```
Click → New Database Connection (plug icon)
Search → MySQL
Select → MySQL
Click  → Next
```

#### Step 2 — Fill Connection Details:
```
Server Host → localhost
Port        → 3306
Database    → nodeauthdb
Username    → nodeuser
Password    → NodePass@123
```

#### Step 3 — Driver Properties:
```
Click → "Driver properties" tab
Find  → allowPublicKeyRetrieval → set true ✅
Find  → useSSL → set false ✅
```

#### Step 4 — Test Connection:
```
Click → "Test Connection"
Output → Connected (51 ms) ✅
Server → MySQL 9.6.0 ✅
Click  → OK → OK
```

### What You Can See in DBeaver: ✅
```
nodeauthdb
  └── Tables
        └── users
              ├── id          → int (PRI, auto_increment)
              ├── name        → varchar(100)
              ├── email       → varchar(100) (UNI)
              ├── password    → varchar(255)
              └── created_at  → timestamp
```

### Common DBeaver Errors & Fixes:

#### Error 1: Public Key Retrieval not allowed
```
Fix → Driver properties tab
      allowPublicKeyRetrieval → true
```

#### Error 2: Access denied for root
```
Fix → Main tab
      Username → nodeuser (not root!)
      Password → NodePass@123
```

### Interview Answer for DBeaver:
> *"I currently use DBeaver for local database management. It helps me visualize table structures, run SQL queries, and manage MySQL and PostgreSQL databases efficiently."*

### src/config/db.ts
```typescript
import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database ✅");
  }
});

export default db;
```

**Important Notes:**
```
✅ Use path.resolve(process.cwd(), ".env")
   → This finds .env from ROOT folder always!

✅ dotenv.config({ path: envPath })
   → Load .env from specific path

✅ injected env (6) from .env
   → Means 6 variables loaded successfully!

❌ injected env (0) from .env
   → Means .env not found! Check file location!
```

**Debugging tip:**
```typescript
// Add these lines temporarily to debug:
const envPath = path.resolve(process.cwd(), ".env");
console.log('ENV PATH:', envPath);
const result = dotenv.config({ path: envPath });
console.log('DB_USER:', process.env.DB_USER);
// Remove after confirming connection works!
```

---

### src/controllers/authController.ts
```typescript
import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Signup Controller
export const signup = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results: any) => {
      if (results.length > 0) {
        res.status(400).json({ message: 'Email already exists!' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            res.status(500).json({ message: 'Server error!' });
            return;
          }
          res.status(201).json({ message: 'User registered successfully!' });
        }
      );
    }
  );
};

// Login Controller
export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results: any) => {
      if (results.length === 0) {
        res.status(400).json({ message: 'User not found!' });
        return;
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: 'Invalid password!' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        message: 'Login successful!',
        token: token,
      });
    }
  );
};
```

---

### src/routes/auth.ts
```typescript
import { Router } from 'express';
import { signup, login } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Siva Panneerselvam
 *               email:
 *                 type: string
 *                 example: siva@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 */
router.post('/signup', signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: siva@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);

export default router;
```

---

### src/swagger.ts
```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Auth API',
      version: '1.0.0',
      description: 'Simple Auth API with Signup and Login — Built with TypeScript',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
```

---

### src/index.ts
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { swaggerUi, specs } from './swagger';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Node Auth API is running!',
    swagger: '/api-docs'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs → http://localhost:${PORT}/api-docs`);
});
```

---

## PART 8 — Run Locally on Mac

```bash
# Run in development mode
npm run dev
```

**Open browser:**
```
http://localhost:3000          → Health check
http://localhost:3000/api-docs → Swagger UI 🎉
```

---

## PART 9 — Upload to EC2 via FileZilla

### Install FileZilla:
```
Download → filezilla-project.org
Install FileZilla Client (free)
```

### Connect to EC2 via FileZilla:
```
Protocol  → SFTP
Host      → ec2-13-201-132-80.ap-south-1.compute.amazonaws.com
Port      → 22
Logon     → Key file
User      → ubuntu
Key file  → Documents/job/aws/siva-practice-key.pem
Click     → Connect
```

### Upload files:
```
Local  → node-auth-app folder on Mac
Remote → /home/ubuntu/node-auth-app on EC2

Note: Do NOT upload node_modules folder!
      We will run npm install on server!
```

---

## PART 10 — Run on EC2

```bash
# Connect to EC2
ssh -i "siva-practice-key.pem" ubuntu@ec2-13-201-132-80.ap-south-1.compute.amazonaws.com

# Go to app folder
cd node-auth-app

# Install packages
npm install

# Build TypeScript
npm run build

# Run app
npm start
```

---

## PART 11 — Open Port 3000 on AWS Security Group

```
AWS Console → EC2 → Instances
Click → siva-practice-server
Scroll down → Security tab
Click → Security group link
Click → Edit inbound rules
Click → Add rule

Type     → Custom TCP
Port     → 3000
Source   → 0.0.0.0/0

Click → Save rules ✅
```

---

## PART 12 — Test in Browser

```
http://13.201.132.80:3000          → Health check ✅
http://13.201.132.80:3000/api-docs → Swagger UI 🎉
```

---

## TypeScript vs JavaScript — Key Differences

| Feature | JavaScript | TypeScript |
|---|---|---|
| Types | No types | Strict types ✅ |
| Errors | Runtime errors | Compile time errors ✅ |
| Code quality | Basic | Professional ✅ |
| NestJS | Not used | Built with TypeScript ✅ |
| Interview | Good | Better! ✅ |

---

## Interview Answer 🎯

> *"I built a Node.js REST API using TypeScript and Express for authentication. The API has signup and login endpoints with MySQL for data storage, bcryptjs for password hashing, and JWT for token-based authentication. I used Swagger UI for API documentation and testing. The app is deployed on AWS EC2 with proper security groups and TypeScript compiled to JavaScript for production."*

---

## PART 13 — Test Results (Actual!) ✅

### Signup Test via Swagger:
```json
Request:
{
  "name": "Siva Panneerselvam",
  "email": "siva@example.com",
  "password": "password123"
}

Response (201):
{
  "message": "User registered successfully!"
}
```

### Login Test via Swagger:
```json
Request:
{
  "email": "siva@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Data in DBeaver After Signup:
```
id         → 1
name       → Siva Panneerselvam
email      → siva@example.com
password   → $2b$10$c5t1... (bcrypt hashed!) 🔐
created_at → 2026-05-23 08:20:54 ✅
```

### Password Security Note: 🔐
```
Original password → "password123"
Stored in DB      → $2b$10$c5t1lOTlmLZQl...

bcryptjs hashes password automatically!
Even if database is hacked →
Original password CANNOT be recovered! ✅
```

---

*Node Auth App (TypeScript) — Built by Siva Panneerselvam | May 22-23, 2026 💪🚀*