import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

// The path here MUST be "/" because server.js adds the "/api/moods" prefix
router.post("/", async (req, res) => {
  const { user_id, mood_text } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
      [user_id, mood_text]
    );

    const aiMessage = await getAIResponse(mood_text);

    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
      [result.insertId, aiMessage]
    );

    res.json({ message: "Mood saved", aiMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET route
router.get("/", async (req, res) => {
    const [rows] = await db.query(`
      SELECT u.full_name, m.mood_text, a.ai_message 
      FROM users u 
      JOIN mood_entries m ON u.id = m.user_id 
      JOIN ai_responses a ON m.id = a.mood_entry_id
    `);
    res.json(rows);
});

export default router;