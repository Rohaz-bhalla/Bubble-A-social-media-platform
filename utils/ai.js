const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generatePrompt = async (text) => {
    try {
        if (!text || typeof text !== 'string') {
            throw new Error("Invalid input: Text must be a non-empty string.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(`Analyze: ${text}`);

        if (!result || !result.response || !result.response.text) {
            throw new Error("Invalid AI response format.");
        }

        return result.response.text();
    } catch (err) {
        console.error("AI Error:", err.message);
        return "AI response unavailable due to an error.";
    }
};
