require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Gemini AI initialize
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple route to test
app.get('/', (req, res) => res.send('AI Backend Running'));

// AI Advisory Route
app.get('/advice', async (req, res) => {
    const { city, country, aqi } = req.query;

    if(!city || !country || !aqi) {
        return res.status(400).json({ advice: "Missing parameters" });
    }

    // Prompt create karo
    const prompt = `
You are an expert environmental advisor.
City: ${city}, Country: ${country}, AQI: ${aqi}.
Provide a short health advisory in simple Hindi for locals based on AQI.
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ advice: text });
    } catch (err) {
        console.error("AI Error:", err.message);
        res.status(500).json({ advice: "AI service failed" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));