import express from "express";
import { getAIResponse } from "../aiServices.js"; 

const router = express.Router();

// This MUST be "/moods" (not "/" and not "/api/moods")
router.post("/moods", async (req, res) => {
  try {
    const { mood_text } = req.body;
    const aiMessage = await getAIResponse(mood_text);
    
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