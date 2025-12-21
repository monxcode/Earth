import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health / AQI advice endpoint
app.post("/advice", async (req, res) => {
  try {
    const { city, country, aqi } = req.body;

    if (!city || !aqi) {
      return res.status(400).json({ error: "Missing data" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
City: ${city}, ${country}
AQI Level: ${aqi}

Give short air-pollution safety advice.
Language: Simple Hindi + English mix.
Tone: Helpful, calm, non-scary.
Max 2–3 lines.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ advice: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log("✅ Backend running on port", PORT)
);