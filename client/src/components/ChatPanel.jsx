import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { sendQuestion } from '../services/api';

export default function ChatPanel({ initialContext, sessionId }) {
    // Initial context is the initial analysis result which serves as the "System memory" or context
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Send history so far
            // Note: We might want to include the initial analysis in the history context if possible, 
            // but typical chat history refers to the conversation turns.
            // The backend 'ai' service might need to be stateful or we pass the context manually. 
            // For this MVP, we proceed with conversation turns only.

            const response = await sendQuestion(messages, userMsg.text, sessionId);
            const aiMsg = { role: 'ai', text: response.answer };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            const errorMsg = { role: 'ai', text: "Sorry, I couldn't answer that. Please try again." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', height: '400px' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={18} color="var(--accent-primary)" />
                    Nutrition Assistant
                </h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '40px' }}>
                        <p>Do you have a question about this analysis?</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ask about ingredients, alternatives, or health impact.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                        color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                        padding: '10px 14px',
                        borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        fontSize: '0.95rem',
                        lineHeight: '1.4'
                    }}>
                        {msg.text}
                    </div>
                ))}

                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '12px 12px 12px 2px' }}>
                        <Loader2 className="spin" size={16} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    style={{
                        flex: 1,
                        background: 'var(--bg-input)',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '10px 16px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="btn-icon"
                    style={{ width: '40px', height: '40px', opacity: !input.trim() ? 0.5 : 1 }}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
