import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db";

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  db.query(
    "SELECT id FROM token_blacklist WHERE token = ?",
    [token],
    (err, results: any) => {
      if (err) {
        res.status(500).json({ message: "Server error" });
        return;
      }
      if (results.length > 0) {
        res.status(401).json({ message: "Token has been invalidated" });
        return;
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as { id: number; email: string };
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
      } catch {
        res.status(401).json({ message: "Invalid or expired token" });
      }
    }
  );
}
