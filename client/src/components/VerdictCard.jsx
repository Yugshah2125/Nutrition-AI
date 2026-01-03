import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function VerdictCard({ result }) {
    const { verdict, productName, headline, keyFactors, tradeOffs } = result;

    const getStatusColor = (v) => {
        switch (v?.toLowerCase()) {
            case 'good': return 'var(--status-good)';
            case 'caution': return 'var(--status-caution)';
            case 'avoid': return 'var(--status-avoid)';
            default: return 'var(--text-secondary)';
        }
    };

    const getStatusBg = (v) => {
        switch (v?.toLowerCase()) {
            case 'good': return 'var(--status-good-bg)';
            case 'caution': return 'var(--status-caution-bg)';
            case 'avoid': return 'var(--status-avoid-bg)';
            default: return 'rgba(255,255,255,0.05)';
        }
    };

    const getIcon = (v) => {
        switch (v?.toLowerCase()) {
            case 'good': return <CheckCircle size={32} color={getStatusColor(v)} />;
            case 'caution': return <AlertTriangle size={32} color={getStatusColor(v)} />;
            case 'avoid': return <XCircle size={32} color={getStatusColor(v)} />;
            default: return <Info size={32} color={getStatusColor(v)} />;
        }
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header Section */}
            <div style={{
                padding: '24px',
                background: `linear-gradient(to bottom, ${getStatusBg(verdict)}, transparent)`,
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    {getIcon(verdict)}
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: getStatusColor(verdict) }}>
                            {verdict}
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{productName}</p>
                    </div>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: '1.4' }}>
                    {headline}
                </div>
            </div>

            {/* Key Factors */}
            <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Why?
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {keyFactors.map((factor, index) => (
                        <div key={index} style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ minWidth: '4px', background: 'var(--glass-border)', borderRadius: '2px' }}></div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>{factor.signal}</strong>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{factor.explanation}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trade-offs */}
                {tradeOffs && (
                    <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                            <Info size={16} color="var(--accent-primary)" />
                            <strong style={{ fontSize: '0.9rem' }}>Trade-off</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{tradeOffs}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
