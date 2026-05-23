import { Request, Response } from "express";
import db from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/auth";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Signup Controller
export const signup = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results: any) => {
      if (results.length > 0) {
        res.status(400).json({ message: "Email already exists!" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            res.status(500).json({ message: "Server error!" });
            return;
          }
          res.status(201).json({ message: "User registered successfully!" });
        },
      );
    },
  );
};

// Login Controller
export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results: any) => {
      if (results.length === 0) {
        res.status(400).json({ message: "User not found!" });
        return;
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid password!" });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" },
      );

      res.status(200).json({
        message: "Login successful!",
        token: token,
      });
    },
  );
};

// Logout Controller
export const logout = (req: AuthRequest, res: Response): void => {
  const token = req.headers.authorization!.split(" ")[1];

  db.query(
    "INSERT INTO token_blacklist (token) VALUES (?)",
    [token],
    (err) => {
      if (err) {
        res.status(500).json({ message: "Server error" });
        return;
      }
      res.status(200).json({ message: "Logged out successfully" });
    }
  );
};
