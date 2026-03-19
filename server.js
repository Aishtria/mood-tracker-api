import express from "express";
import cors from "cors"; // Add this
import moodRoutes from "./routes/moods.js";

const app = express();
app.use(cors()); // Allow your frontend to talk to this server
app.use(express.json());

app.use("/api/moods", moodRoutes); 

app.listen(5000, () => console.log("Server running on port 5000"));