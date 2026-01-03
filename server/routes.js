const express = require('express');
const multer = require('multer');
const { analyzeProduct, chatFollowUp } = require('./ai-service');

const router = express.Router();

// Configure Multer for memory storage (direct to API)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * POST /analyze
 * Accepts 'image' file and/or 'text' body
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file ? req.file.buffer : null;
        const mimeType = req.file ? req.file.mimetype : null;
        const textContext = req.body.text || "";

        if (!imageBuffer && !textContext) {
            return res.status(400).json({ error: "Please provide an image or text description." });
        }

        console.log("Processing Analysis Request...");
        const analysisResult = await analyzeProduct(imageBuffer, mimeType, textContext);

        res.json(analysisResult);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /followup
 * Accepts: { history: [], question: "" }
 */
router.post('/followup', upload.none(), async (req, res) => {
    try {
        const { history, question, sessionId } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        // Validate or default history
        const safeHistory = Array.isArray(history) ? history : [];

        const result = await chatFollowUp(safeHistory, question, sessionId);
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
