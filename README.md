# Nutrition AI Native System

An AI-powered Consumer Health Co-Pilot that helps you understand food products instantly.

## Architecture

- **Frontend**: React + Vite (Premium Dark Mode Design)
- **Backend**: Node.js + Express
- **AI**: Google Gemini 1.5 Flash (Vision + Reasoning)

## Features

- **Scan**: Upload or drag-and-drop food labels.
- **Analyze**: AI infers context, identifies health signals, and provides a clear verdict (Good/Caution/Avoid).
- **Explain**: Key reasons and trade-offs are displayed clearly.
- **Chat**: Ask follow-up questions to the "Nutrition Assistant".

## Setup

1.  **Install Dependencies**
    ```bash
    cd server
    npm install
    
    cd ../client
    npm install
    ```

2.  **Environment Variables**
    Ensure a `.env` file exists in the root directory with:
    ```
    GEMINI_API_KEY=your_key_here
    ```

3.  **Run Development**
    - **Server**: `cd server && npm start` (Runs on port 5000)
    - **Client**: `cd client && npm run dev` (Runs on port 5173)

## Project Structure

- `server/`: Backend logic, AI service, and Prompts.
- `client/`: Frontend application, components, and styling.
