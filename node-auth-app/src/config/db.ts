import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Pool instead of createConnection — automatically reconnects dropped connections.
// A single createConnection() goes stale in Kubernetes (EC2 idle timeouts, pod
// restarts) and hangs for ~45 seconds before the TCP socket times out.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
