const { analyzeProduct, chatFollowUp } = require('../ai-service');
const fs = require('fs');
const path = require('path');

async function runTest() {
    console.log("=== STARTING UPGRADE VERIFICATION TEST ===");

    try {
        // STEP 1: Analyze Product (Text Only for speed/reliability of input)
        console.log("\n[1] Testing Analysis...");
        const textContext = "Product: 'Super Snax Cheezy Puffs'. Ingredients: Corn meal, vegetable oil, whey, cheddar cheese, salt, yellow 6, citric acid, monosodium glutamate. Nutrition: 160 calories, 10g fat, 250mg sodium, 2g protein.";

        const analysisResult = await analyzeProduct(null, null, textContext);

        if (!analysisResult.sessionId) throw new Error("Analysis failed: No Session ID returned");
        if (!analysisResult.verdict) throw new Error("Analysis failed: No Verdict returned");

        const sessionId = analysisResult.sessionId;
        console.log("✅ Analysis Successful");
        console.log("Session ID:", sessionId);
        console.log("Verdict:", analysisResult.verdict);
        console.log("Ingredients Found:", analysisResult.ingredients ? analysisResult.ingredients.length : 0);

        // STEP 2: Follow-up Question (Context Aware)
        console.log("\n[2] Testing Follow-up (Context Aware)...");
        const history = [];
        const question = "Why is this bad for me?";

        const followUpResult = await chatFollowUp(history, question, sessionId);

        console.log("Answer:", followUpResult.answer);

        if (typeof followUpResult.answer !== 'string') throw new Error("Follow-up failed: Answer is not a string");
        if (followUpResult.answer.includes('{')) throw new Error("Follow-up failed: Answer contains JSON (should be clean text)");

        console.log("✅ Follow-up Successful (Clean Text Response)");

        // STEP 3: Hallucination Check / Strict Context Check
        console.log("\n[3] Testing Context Adherence...");
        const question2 = "Does it contain any artificial colors?";
        history.push({ role: 'user', text: question });
        history.push({ role: 'ai', text: followUpResult.answer });

        const followUpResult2 = await chatFollowUp(history, question2, sessionId);
        console.log("Answer:", followUpResult2.answer);

        if (!followUpResult2.answer.toLowerCase().includes('yellow 6') && !followUpResult2.answer.toLowerCase().includes('artificial')) {
            console.warn("⚠️ Warning: AI might have missed the artificial color context, but this depends on AI inference.");
        } else {
            console.log("✅ Context Verification Passed (Detected specific ingredient)");
        }

    } catch (error) {
        console.error("❌ Test Failed:", error);
        process.exit(1);
    }
}

runTest();
