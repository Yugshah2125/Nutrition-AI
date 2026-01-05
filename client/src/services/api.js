const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log("Using API URL:", API_URL);

/**
 * Analyzes a product image.
 * @param {File} imageFile - The image file to analyze.
 * @returns {Promise<Object>} - The analysis result.
 */
export async function analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("API Call Failed:", error);
        // Throw a visible error with the URL to help debugging
        throw new Error(`Connection Failed: ${error.message}. Trying to reach: ${API_URL}`);
    }
}

/**
 * Sends a follow-up question to the AI.
 * @param {Array} history - The chat history.
 * @param {string} question - The user's question.
 * @param {string} sessionId - The session ID for context.
 * @returns {Promise<Object>} - The AI's answer.
 */
export async function sendQuestion(history, question, sessionId) {
    const response = await fetch(`${API_URL}/followup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history, question, sessionId }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get answer');
    }

    return response.json();
}
