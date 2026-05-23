import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { swaggerUi, specs } from "./swagger";
import authRoutes from "./routes/auth";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Node Auth API is running!",
    swagger: "/api-docs",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs → http://localhost:${PORT}/api-docs`);
});
