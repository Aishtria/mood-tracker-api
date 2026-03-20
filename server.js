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

// ✅ GET Route: Fetch all history
app.get('/mood-history', async (req, res) => {
    try {
        // Fetching history for user_id = 1 (Trishia)
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

// ✅ POST Route: Saves to mood_entries
app.post('/mood', async (req, res) => {
    // 1. Get data from Vue (MoodForm.vue sends 'name' and 'mood')
    const { name, mood } = req.body;

    // 2. Validation
    if (!mood) {
        return res.status(400).json({ error: "Mood content is required." });
    }

    try {
        console.log(`🤖 Processing mood for ${name || 'User'}: "${mood}"`);

        // 3. Generate AI Response using Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a supportive mental health companion. Provide a one-sentence, empathetic response."
                },
                { role: "user", content: mood } // FIXED: Changed mood_text to mood
            ],
            model: "llama-3.3-70b-versatile",
        });

        const aiReply = chatCompletion.choices[0].message.content;

        // 4. Insert into Database
        // We use user_id = 1 and the 'mood' variable for mood_text column
        const sql = `INSERT INTO mood_entries (user_id, mood_text, ai_response) VALUES (?, ?, ?)`;
        
        await db.query(sql, [1, mood, aiReply]); // FIXED: Changed mood_text to mood

        console.log("✅ Data successfully saved to Railway!");

        // 5. Send response back to Vue
        res.json({ 
            success: true, 
            ai_reply: aiReply 
        });

    } catch (err) {
        console.error("❌ BACKEND ERROR:", err.message);
        res.status(500).json({ 
            error: "Sync Failed", 
            details: err.message 
        });
    }
});

// ✅ Health Check Route (Part 4 of Lab 7)
app.get('/health', (req, res) => {
    res.json({ status: "OK", message: "API is running" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server Version 5.1 online at port ${PORT}`);
});