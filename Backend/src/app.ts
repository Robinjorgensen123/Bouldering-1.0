import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/register", (req, res) => {
  res.status(201).json({
    success: true,
    data: { token: "fejk token" },
  });
});

export default { app };
