const TTL = 2 * 60 * 60 * 1000; // 2 hours

// Use globalThis to persist sessions across module re-evaluations in Next.js
if (!globalThis.__deploySessions) {
    globalThis.__deploySessions = new Map();
}
const sessions = globalThis.__deploySessions;

export function createSession() {
    const token = crypto.randomUUID();
    sessions.set(token, Date.now() + TTL);
    return token;
}

export function validateSession(token) {
    if (!token || !sessions.has(token)) return false;
    const expiry = sessions.get(token);
    if (Date.now() > expiry) {
        sessions.delete(token);
        return false;
    }
    return true;
}
