import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
//dotenv.config();
const envPath = path.resolve(process.cwd(), ".env");
console.log("envPath :>", envPath);
const result = dotenv.config({ path: envPath });
//console.log("result :>", result.parsed?.DB_HOST);

//console.log("process.env.DB_HOST :>", process.env);

const db = mysql.createConnection({
  host: result.parsed?.DB_HOST || process.env.DB_HOST,
  user: result.parsed?.DB_USER || process.env.DB_USER,
  password: result.parsed?.DB_PASSWORD || process.env.DB_PASSWORD,
  database: result.parsed?.DB_NAME || process.env.DB_NAME,
});
//console.log("db :>", db);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

export default db;
