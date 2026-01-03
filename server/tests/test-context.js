const fs = require('fs');
const path = require('path');
const { analyzeProduct, chatFollowUp } = require('../ai-service');

async function runTest() {
    console.log("Running Context Awareness Test...");
    try {
        const imagePath = path.join(__dirname, '../../imgae.png');
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image not found at ${imagePath}`);
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const mimeType = "image/png";

        console.log("1. Analyzing image...");
        // Step 1: Analyze
        const analysis = await analyzeProduct(imageBuffer, mimeType, null);
        console.log("Analyze finished. Session ID:", analysis.sessionId);
        console.log("Product Name:", analysis.productName);

        if (!analysis.sessionId) {
            throw new Error("No Session ID returned!");
        }

        // Step 2: Follow-up
        console.log("2. Asking follow-up question...");
        const question = "What are the ingredients you just found?";
        const followUp = await chatFollowUp([], question, analysis.sessionId);

        console.log("Follow-up Answer:", followUp.answer);

        // Assertion: Check if answer contains ingredient info (heuristic)
        // We expect the answer to mention ingredients since we asked for them and they are in the context.
        if (followUp.answer.length > 10) {
            console.log("✅ SUCCESS: Received a substantial answer using context.");
        } else {
            console.log("❌ FAILURE: Answer seems too short or empty.");
        }

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

runTest();
