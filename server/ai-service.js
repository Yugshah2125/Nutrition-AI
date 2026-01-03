const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SYSTEM_PROMPT, ANALYSIS_SCHEMA, FOLLOWUP_SYSTEM_PROMPT, FOLLOWUP_SCHEMA } = require('./prompts');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analysis Model (Strict JSON for Analysis)
const analysisModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
    }
});

// Follow-up Model (Strict JSON for Follow-up)
const followUpModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: FOLLOWUP_SYSTEM_PROMPT,
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: FOLLOWUP_SCHEMA,
    }
});

// In-memory session store
// Map<sessionId, ProductContext>
const sessionStore = new Map();

/**
 * Utility to convert file buffer to GenerativePart for Gemini
 */
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType,
        },
    };
}

/**
 * Analyzes a product image or text description
 */
async function analyzeProduct(imageBuffer, mimeType, textContext) {
    try {
        const promptParts = [
            "Analyze this product information based on the visual label or ingredients provided."
        ];

        if (textContext) {
            promptParts.push(`Additional User Context: ${textContext}`);
        }

        if (imageBuffer && mimeType) {
            promptParts.push(fileToGenerativePart(imageBuffer, mimeType));
        }

        const result = await analysisModel.generateContent(promptParts);
        const response = result.response;
        const text = response.text();

        // Parse JSON
        let analysisData;
        try {
            analysisData = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parsing failed for analysis:", e);
            throw new Error("Failed to parse AI analysis result.");
        }

        // Create Session
        const sessionId = crypto.randomUUID();

        // Extract ProductContext (Canonical Truth)
        const productContext = {
            product_name: analysisData.productName,
            ingredients: analysisData.ingredients || [],
            nutrition: analysisData.nutrition || {},
            risk_flags: analysisData.keyFactors ? analysisData.keyFactors.map(k => k.signal) : []
        };

        // Persist Context
        sessionStore.set(sessionId, productContext);
        console.log(`[Session Created] ID: ${sessionId} | Product: ${productContext.product_name}`);

        // Return result with sessionId
        return { ...analysisData, sessionId };

    } catch (error) {
        console.error("AI Analysis Error:", error);
        fs.appendFileSync('error_log.txt', `[${new Date().toISOString()}] Error: ${error.message}\n${error.stack}\n\n`);
        throw new Error("Failed to analyze product. Please try again.");
    }
}

/**
 * Handles follow-up chat conversations with Strict Context & JSON Enforcement
 */
async function chatFollowUp(history, question, sessionId) {
    try {
        console.log("Starting chat follow-up. SessionID:", sessionId);
        const productContext = sessionStore.get(sessionId);

        // history is [{role: 'user'|'ai', text: '...'}]
        // Convert to Gemini format
        const geminiHistory = history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // Construct the strict prompt injection
        let contextInjection = "";
        if (productContext) {
            contextInjection = `
PRODUCT CONTEXT (IMMUTABLE GROUND TRUTH):
Product Name: ${productContext.product_name}
Ingredients: ${JSON.stringify(productContext.ingredients)}
Nutrition: ${JSON.stringify(productContext.nutrition)}
Risk Flags: ${JSON.stringify(productContext.risk_flags)}
`;
        } else {
            console.warn("No context found for session:", sessionId);
        }

        const currentMessage = `${contextInjection}\n\nUSER QUESTION: ${question}`;

        // Uses a stateless chat approach or just generateContent with full history 
        // tailored for strict JSON response on the LAST turn.
        // To enforce JSON on follow-up, we use the `followUpModel` configured with JSON schema.
        // We pass the full history + new message as a multi-turn chat.

        const chat = followUpModel.startChat({
            history: geminiHistory
        });

        // RETRY LOGIC for JSON parsing
        const MAX_RETRIES = 1;
        let attempt = 0;
        let lastError = null;

        while (attempt <= MAX_RETRIES) {
            try {
                const result = await chat.sendMessage(currentMessage);
                const text = result.response.text();

                // Clean potential markdown blocks just in case model slips (rare with strict schema mode)
                const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const parsed = JSON.parse(cleanText);

                if (parsed.answer) {
                    return { answer: parsed.answer };
                } else {
                    throw new Error("Missing 'answer' field in JSON");
                }
            } catch (e) {
                console.warn(`Follow-up attempt ${attempt + 1} failed:`, e.message);
                lastError = e;
                attempt++;
                // If it was a JSON parse error, Gemini *might* fix it on retry if we just resend, 
                // but usually we need to prompt "Fix JSON". 
                // However, `sendMessage` mutates history. 
                // For simplicity in this stateless wrapper, we might just try again or return fallback. 
                // Since `startChat` maintains state, retrying the *same* `sendMessage` call isn't directly compatible 
                // without resetting history, unless we treat it as a fresh generation request.

                // For robustness: valid JSON mode usually doesn't fail syntax. 
                // If it fails, it's likely content safety or other issue.
            }
        }

        // Fallback after retries failed
        console.error("All follow-up attempts failed:", lastError);
        return { answer: "I’m having trouble formatting that response. Please try again." };

    } catch (error) {
        console.error("Chat Error:", error);
        return { answer: "I’m having trouble formatting that response. Please try again." };
    }
}

module.exports = {
    analyzeProduct,
    chatFollowUp
};
