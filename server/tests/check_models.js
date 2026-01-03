const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API KEY found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // The SDK doesn't have a direct 'listModels' on the instance in older versions, 
        // but typically it's specific to the raw API. 
        // Actually, the new SDK might not expose listModels easily without a specific call.
        // Let's try to just run a simple prompt with 'gemini-pro' as a fallback to see if *that* works.
        // But better: try to use the model that works.

        console.log("Testing gemini-1.5-flash-001...");
        const modelFlash001 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        try {
            await modelFlash001.generateContent("Hello");
            console.log("SUCCESS: gemini-1.5-flash-001 works!");
            return;
        } catch (e) {
            console.log("gemini-1.5-flash-001 failed: " + e.message);
        }

        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        try {
            await modelPro.generateContent("Hello");
            console.log("SUCCESS: gemini-pro works!");
            return;
        } catch (e) {
            console.log("gemini-pro failed: " + e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
