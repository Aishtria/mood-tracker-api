import express from "express";
import { db } from "../db.js"; 
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

// 1. THIS FIXES THE "CANNOT GET" ERROR
// It lets you see your database entries in the browser
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM mood_entries ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ DB Fetch Error:", error);
    res.status(500).json({ error: "Database error: " + error.message });
  }
});

// 2. THIS HANDLES YOUR VUE APP SUBMISSIONS
router.post("/", async (req, res) => {
  const { user_id, mood_text } = req.body;

  if (!mood_text) {
    return res.status(400).json({ error: "Mood text is required" });
  }

  try {
    // Get AI feedback
    const aiMessage = await getAIResponse(mood_text);

    // Save to Railway
    const [result] = await db.execute(
      "INSERT INTO mood_entries (user_id, mood_text, ai_response) VALUES (?, ?, ?)",
      [user_id || 1, mood_text, aiMessage]
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      aiMessage: aiMessage
    });
  } catch (error) {
    console.error("❌ POST Error:", error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
});

export default router;