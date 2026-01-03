import { useState } from 'react';
import './index.css';
import ProductInput from './components/ProductInput';
import VerdictCard from './components/VerdictCard';
import ChatPanel from './components/ChatPanel';
import { analyzeImage } from './services/api';

function App() {
  const [view, setView] = useState('home'); // 'home', 'analyzing', 'results'
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file) => {
    setView('analyzing');
    setError(null);
    try {
      const data = await analyzeImage(file);
      setResult(data);
      setSessionId(data.sessionId);
      setView('results');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze product. Please try again.");
      setView('home');
    }
  };

  const handleReset = () => {
    setView('home');
    setResult(null);
    setSessionId(null);
    setError(null);
  };

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={handleReset}>
          <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>NUTRITION AI</span>
        </div>
      </header>

      <main className="animate-fade-in">
        {view === 'home' || view === 'analyzing' ? (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
              What are you<br />eating today?
            </h1>

            <ProductInput onAnalyze={handleAnalyze} isAnalyzing={view === 'analyzing'} />

            {error && (
              <div style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--status-avoid)',
                borderRadius: '8px',
                color: '#ef4444',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </>
        ) : (

          <div style={{ maxWidth: '100%', width: '100%' }}>
            <VerdictCard result={result} />

            <ChatPanel sessionId={sessionId} />

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button className="btn-primary" onClick={handleReset} style={{ background: 'var(--bg-input)' }}>
                Scan Another Product
              </button>
            </div>
          </div>
        )}
      </main >
    </>
  );
}

export default App;
