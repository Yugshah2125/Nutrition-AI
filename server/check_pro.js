const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    try {
        // The SDK doesn't have a listModels method on the top level class easily accessible in all versions.
        // We will try a different approach: forcing a request to 'models/gemini-1.5-flash' explicitly via REST if needed,
        // but let's try to just test 'gemini-pro-vision' which is the older vision model.

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log("Testing gemini-pro-vision...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        // gemini-pro-vision requires image usually, or at least it used to. 
        // Let's try gemini-pro for text just to verify key works for *some* model.

        const textModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await textModel.generateContent("Hello");
        console.log("gemini-pro works:", result.response.text());

    } catch (e) {
        console.error("Error:", e.message);
    }
}

listModels();
