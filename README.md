# Nutrition AI Native System

An intelligent, AI-Native Consumer Health Co-Pilot that helps you understand food products instantly with calm, expert guidance.

## 🚀 Core Features

-   **Instant Analysis**: Upload labels to get a "Good", "Caution", or "Avoid" verdict immediately.
-   **Persistent Product Memory**: The AI remembers the product ingredients and nutrition throughout your entire chat session.
-   **Calm Expert Persona**: Receive objective, decision-oriented advice without alarmism or fluff.
-   **Strict Reliability**: Advanced JSON contracts and auto-retry logic ensure the AI always responds correctly.
-   **Interactive Chat**: Ask follow-up questions (e.g., "Why is this bad?") and get context-aware answers.

## 🏗 Architecture

-   **Frontend**: React + Vite (Premium Dark Mode Design, Glassmorphism)
-   **Backend**: Node.js + Express
-   **AI Engine**: Google Gemini 2.5 Flash (Vision + Reasoning)
-   **Memory**: In-Memory Product Context (Session-based)

## 🛠️ Setup & Run

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

### 3. Start Development Servers
You can see the system running by starting both terminals:

**Backend (Port 5000)**
```bash
cd server
npm start
```

**Frontend (Port 5173)**
```bash
cd client
npm run dev
```

## 📂 Project Structure

-   `server/`: Backend API, AI Service, Prompts (`server/prompts.js`), and Context Logic.
-   `client/`: Modern React frontend with Tailwind-like custom CSS.
-   `server/tests/`: Automated verification scripts for AI reliability.

### 🐍 Python Utilities
The project includes optional Python scripts (e.g., for PDF processing). To use them:

1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
2.  Run the script:
    ```bash
    python read_pdf.py
    ```
