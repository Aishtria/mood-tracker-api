import express from "express";
import { getAIResponse } from "../aiServices.js"; 

const router = express.Router();

// This endpoint combines with the "/api" in server.js to match your frontend exactly
router.post("/moods", async (req, res) => {
  try {
    const { mood_text } = req.body;
    
    // Get the response from your Gemini AI service
    const aiMessage = await getAIResponse(mood_text);
    
    // Send back the response Vue is expecting
    res.status(201).json({
      message: "Mood recorded",
      aiMessage: aiMessage
    });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;