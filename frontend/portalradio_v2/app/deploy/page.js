'use client';

import { useState, useRef, useCallback } from 'react';

const ACTIONS = [
    { id: 'git-pull', label: 'Git Pull', variant: 'primary', icon: '↓' },
    { id: 'build-frontend', label: 'Build Frontend', variant: 'warning', icon: '⚡' },
    { id: 'build-backend', label: 'Build Backend', variant: 'warning', icon: '⚡' },
    { id: 'restart-pm2', label: 'Restart PM2', variant: 'danger', icon: '🔄' },
    { id: 'migrate-db', label: 'Migrate DB', variant: 'info', icon: '🗃' },
];

export default function DeployPage() {
    const [token, setToken] = useState(null);
    const [secret, setSecret] = useState('');
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [error, setError] = useState('');
    const preRef = useRef(null);

    const scrollToBottom = () => {
        if (preRef.current) {
            preRef.current.scrollTop = preRef.current.scrollHeight;
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/deploy/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Authentication failed');
                return;
            }
            setToken(data.token);
            setSecret('');
        } catch {
            setError('Connection failed');
        }
    };

    const handleRun = useCallback(async (actionId) => {
        if (running) return;
        setRunning(true);
        setOutput('');
        setError('');

        const isRestart = actionId === 'restart-pm2';

        try {
            const res = await fetch('/api/deploy/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, action: actionId }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (res.status === 401) {
                    setToken(null);
                    setError('Session expired. Please re-authenticate.');
                } else {
                    setError(data.error || 'Request failed');
                }
                setRunning(false);
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                setOutput((prev) => prev + text);
                setTimeout(scrollToBottom, 0);
            }
        } catch {
            if (isRestart) {
                setOutput((prev) => prev + '\n--- Connection lost (expected during PM2 restart) ---\n');
                setOutput((prev) => prev + 'Reloading page in 5 seconds...\n');
                setTimeout(() => window.location.reload(), 5000);
                return;
            }
            setError('Connection lost');
        } finally {
            setRunning(false);
        }
    }, [running, token]);

    const btnStyle = (variant) => {
        const colors = {
            primary: '#0d6efd',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#0dcaf0',
        };
        return {
            backgroundColor: running ? '#6c757d' : colors[variant],
            color: variant === 'warning' || variant === 'info' ? '#000' : '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            opacity: running ? 0.65 : 1,
        };
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '24px', color: '#fff' }}>
                Deploy Dashboard
            </h1>

            {!token ? (
                <form onSubmit={handleAuth} style={{ display: 'flex', gap: '10px', maxWidth: '400px' }}>
                    <input
                        type="password"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter deploy secret"
                        autoFocus
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '6px',
                            border: '1px solid #444',
                            backgroundColor: '#16213e',
                            color: '#e0e0e0',
                            fontSize: '14px',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#0d6efd',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Unlock
                    </button>
                </form>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {ACTIONS.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleRun(action.id)}
                                disabled={running}
                                style={btnStyle(action.variant)}
                            >
                                {action.icon} {action.label}
                            </button>
                        ))}
                    </div>

                    <pre
                        ref={preRef}
                        style={{
                            backgroundColor: '#0f0f23',
                            color: '#00ff41',
                            padding: '16px',
                            borderRadius: '8px',
                            height: 'calc(100vh - 200px)',
                            overflow: 'auto',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            border: '1px solid #333',
                        }}
                    >
                        {output || 'Ready. Click an action to begin.\n'}
                    </pre>
                </>
            )}

            {error && (
                <div style={{
                    marginTop: '16px',
                    padding: '10px 16px',
                    backgroundColor: '#dc354522',
                    border: '1px solid #dc3545',
                    borderRadius: '6px',
                    color: '#ff6b6b',
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}
