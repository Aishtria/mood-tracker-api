import express from "express";
import moodRoutes from "./routes/moods.js"; // Check this import

const app = express();
app.use(express.json());

// This line defines the prefix
app.use("/api/moods", moodRoutes); 

// Change the 3000 to 5000
app.listen(5000, () => console.log("Server running on port 5000"));