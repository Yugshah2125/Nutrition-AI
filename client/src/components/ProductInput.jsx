import { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';

export default function ProductInput({ onAnalyze, isAnalyzing }) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onAnalyze(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onAnalyze(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div
            className={`glass-panel input-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
                padding: '40px 20px',
                textAlign: 'center',
                border: dragActive ? '2px solid var(--accent-primary)' : '1px dashed var(--text-muted)',
                transition: 'all 0.2s ease',
                cursor: isAnalyzing ? 'wait' : 'default'
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
            />

            {isAnalyzing ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <Loader2 className="spin" size={48} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite' }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Analyzing Product...</p>
                    <p style={{ fontSize: '0.9rem' }}>Reading ingredients & checking health facts</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'var(--bg-input)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '10px'
                        }}
                    >
                        <Camera size={40} color="var(--text-secondary)" />
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '8px' }}>Scan Nutrition Label</h3>
                        <p style={{ fontSize: '0.9rem' }}>Upload or take a photo of the ingredients list</p>
                    </div>

                    <button className="btn-primary" onClick={onButtonClick}>
                        Select Image
                    </button>

                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>or drag and drop file here</p>
                </div>
            )}

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
