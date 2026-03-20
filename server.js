import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from "groq-sdk"; 
import db from './db.js';

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ✅ Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ GET Route: Fetch history
app.get('/mood-history', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT mood_text, ai_response, created_at FROM mood_entries WHERE user_id = 1 ORDER BY created_at DESC'
        );
        
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        res.status(500).json({ error: "Could not retrieve history", details: err.message });
    }
});

// ✅ POST Route: Process Mood & Save
app.post('/mood', async (req, res) => {
    const { name, mood } = req.body;

    if (!mood) {
        return res.status(400).json({ error: "Mood is required." });
    }

    try {
        console.log(`🤖 AI is thinking for: ${name || 'User'}...`);

        // 1. AI Logic (Groq)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a supportive mental health companion. Provide a one-sentence, empathetic response." },
                { role: "user", content: mood }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const aiReply = chatCompletion.choices[0].message.content;

        // 2. Database Logic
        try {
            const sql = `INSERT INTO mood_entries (user_id, mood_text, ai_response) VALUES (?, ?, ?)`;
            await db.query(sql, [1, mood, aiReply]);
            console.log("✅ Data successfully saved to Railway!");
        } catch (dbErr) {
            console.error("⚠️ Database Save Failed:", dbErr.message);
        }

        res.json({ 
            success: true, 
            ai_reply: aiReply 
        });

    } catch (err) {
        console.error("❌ GLOBAL BACKEND ERROR:", err.message);
        res.status(500).json({ 
            error: "Sync Failed", 
            details: err.message 
        });
    }
});

// ✅ Health Check Route
app.get('/health', (req, res) => {
    res.json({ status: "OK", message: "API is running" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server Version 6.0 online at port ${PORT}`);
});