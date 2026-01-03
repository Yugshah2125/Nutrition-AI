const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: listModels is not directly exposed on the client instance in some versions, 
        // we might need to access the model manager if available, or just try a standard request.
        // Actually, the SDK has a way.

        // For debugging, we can't easily list models with the high-level SDK in one line without making a request.
        // But let's try to update the model name to 'gemini-1.5-flash-001' which is the specific version.

        console.log("Trying gemini-1.5-flash-001...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash-001:", result.response.text());

    } catch (e) {
        console.error("Error with gemini-1.5-flash-001:", e.message);

        try {
            console.log("Trying gemini-pro..."); // No vision, but check validation
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello");
            console.log("Success with gemini-pro:", result.response.text());
        } catch (e2) {
            console.error("Error with gemini-pro:", e2.message);
        }
    }
}

listModels();
