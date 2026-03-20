import Groq from "groq-sdk";
import 'dotenv/config';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getAIResponse(text) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a supportive mental health assistant. Provide a short, empathetic response (1 sentence)." 
        },
        { role: "user", content: text }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "I'm here for you. Take a deep breath.";
  }
}