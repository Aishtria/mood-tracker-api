import express from "express";
import cors from "cors";
import moodRoutes from "./routes/moods.js";

const app = express();

// Middleware
app.use(cors({
  origin: "https://aishtria.github.io", 
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// ROUTES - FIXED PATH
// This maps "/api" from here + "/moods" from the routes file to make "/api/moods"
app.use("/api", moodRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});