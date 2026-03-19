import express from "express";
import cors from "cors";
import moodRoutes from "./routes/moods.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// CORS: allow GitHub Pages + local dev
app.use(cors({
  origin: ["https://aishtria.github.io", "http://localhost:5173"],
  methods: ["GET","POST"],
  credentials: true
}));

app.use(express.json());

// Routes: final endpoint = /api/moods
app.use("/api", moodRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));