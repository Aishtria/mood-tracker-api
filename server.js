import express from "express";
import cors from "cors";
import moodRoutes from "./routes/moods.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// This sets the base path to /api/moods
app.use("/api/moods", moodRoutes); 

// Use Render's port or default to 5000 for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));