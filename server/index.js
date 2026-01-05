const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from the root .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const aiRoutes = require('./routes');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', aiRoutes);

// Initialize Google Gemini Client (Log check only, actual logic in ai-service)
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
    process.exit(1);
}
console.log(`Loaded API Key: Length=${apiKey.length}, StartsWith=${apiKey.substring(0, 4)}...`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using a default model, allows upgrade

// Basic health check
app.get('/', (req, res) => {
    res.send('Nutrition AI Native System Backend is running');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Gemini Client Initialized`);
});
