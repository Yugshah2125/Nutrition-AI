const API_URL = 'http://localhost:5000/api';

/**
 * Analyzes a product image.
 * @param {File} imageFile - The image file to analyze.
 * @returns {Promise<Object>} - The analysis result.
 */
export async function analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze product');
    }

    return response.json();
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
