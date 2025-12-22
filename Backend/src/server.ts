import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import boulderRoutes from "./routes/boulderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/boulders", boulderRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export { app };
