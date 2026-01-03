const fs = require('fs');
const path = require('path');
const { analyzeProduct } = require('../ai-service');

async function runTest() {
    console.log("Running Analysis Test with Image Input...");
    try {
        const imagePath = path.join(__dirname, '../../imgae.png');
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image not found at ${imagePath}`);
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const mimeType = "image/png";

        console.log("Analyzing image...");
        const result = await analyzeProduct(imageBuffer, mimeType, null);
        console.log("Analysis Result:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

runTest();
