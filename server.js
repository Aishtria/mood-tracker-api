import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from "groq-sdk";
import db from './db.js'; // Ensure this matches your db file name

const app = express();

// Middleware - Fixes CORS and 400 Bad Request errors
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 10000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * 🏠 ROUTE 0: Home/Base URL
 * Prevents "Cannot GET /" and shows available endpoints
 */
app.get('/', (req, res) => {
    res.send("<h1>🧍 Mental Health API is online and healthy.</h1><p>Endpoints: /health, /mood, /mood-history</p>");
});

/**
 * ✅ ROUTE 1: Health Check
 */
app.get('/health', (req, res) => res.json({ status: "OK", timestamp: new Date() }));

/**
 * 🔍 ROUTE 2: GET /mood-history
 * Fetches data from Railway to show in your Vue history list
 */
app.get('/mood-history', async (req, res) => {
    try {
        console.log("📥 Fetching history from database...");
        // Updated to match your database column names
        const [rows] = await db.query(
            'SELECT full_name, mood_text, ai_response, created_at FROM mood_entries ORDER BY created_at DESC'
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("❌ DB Fetch Error:", err.message);
        res.status(500).json({ error: "Database fetch failed", details: err.message });
    }
});

/**
 * 🚀 ROUTE 3: POST /mood
 * Receives data from Vue, gets AI response, and saves to Railway
 */
app.post('/mood', async (req, res) => {
    // 1. Capture whatever comes in
    const name = req.body.name || req.body.full_name;
    const mood = req.body.mood || req.body.mood_text;

    // 2. Log it so we can see it in Render
    console.log("📨 Payload Received:", req.body);

    if (!name || !mood) {
        return res.status(400).json({ 
            error: "Name and Mood are required.",
            received: req.body 
        });
    }

    try {
        // AI Logic...
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: mood }],
            model: "llama-3.3-70b-versatile",
        });
        const aiReply = chatCompletion.choices[0].message.content;

        // 3. Map to your Database Columns (full_name, mood_text)
        const sql = `INSERT INTO mood_entries (full_name, mood_text, ai_response) VALUES (?, ?, ?)`;
        await db.query(sql, [name, mood, aiReply]); 

        res.json({ success: true, ai_reply: aiReply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
    


app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});