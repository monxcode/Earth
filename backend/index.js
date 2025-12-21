require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API key initialize karein
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runAI() {
  // Model select karein (Gemini 1.5 Flash fast aur efficient hai)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Node.js aur AI ke baare mein ek chhota sa intro do.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI Response:", text);
  } catch (error) {
    console.error("Error occur hua:", error.message);
  }
}

runAI();
