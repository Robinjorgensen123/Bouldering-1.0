import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/api/auth/register", (_req, res) => {
  res.status(201).json({
    success: true,
    data: { token: "fejk token" },
  });
});

export { app };
