'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget';
import { fetchMessages, getChatUser } from '../utils/chatApi';

// Floating chat button shown on every public page. Opens the live chat as a panel above
// the button on desktop and full screen on phones; shows an unread count while closed.

const HIDDEN_ON = ['/chat', '/deploy'];          // pages with their own chat (or none)
const LAST_SEEN_KEY = 'chat_last_seen_id';
const UNREAD_POLL_MS = 30000;

function readLastSeen() {
  try {
    const v = localStorage.getItem(LAST_SEEN_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}

function writeLastSeen(id) {
  try {
    if (id) localStorage.setItem(LAST_SEEN_KEY, String(id));
  } catch {}
}

async function latestMessageId() {
  const { messages } = await fetchMessages({ limit: 1 });
  return messages.length ? messages[messages.length - 1].id : 0;
}

export default function ChatLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const buttonRef = useRef(null);
  const markSeenRef = useRef(Promise.resolve()); // pending "mark everything seen" from the last close

  const hidden = HIDDEN_ON.some(p => pathname === p || pathname?.startsWith(p + '/'));

  // Unread count while closed: messages after the last one seen, excluding the viewer's own
  const checkUnread = useCallback(async () => {
    try {
      await markSeenRef.current; // don't count messages the viewer just saw before closing
      const lastSeen = readLastSeen();
      if (lastSeen === null) {
        // First visit: start counting from now, not from the whole history
        writeLastSeen(await latestMessageId());
        setUnread(0);
        return;
      }
      const { messages } = await fetchMessages({ after: lastSeen });
      const me = getChatUser()?.id;
      setUnread(messages.filter(m => m.chat_user_id !== me).length);
    } catch {}
  }, []);

  useEffect(() => {
    if (hidden || open) return;
    let timer = null;
    const loop = async () => {
      if (!document.hidden) await checkUnread();
      timer = setTimeout(loop, UNREAD_POLL_MS);
    };
    const onVisible = () => { if (!document.hidden) checkUnread(); };
    loop();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [hidden, open, checkUnread]);

  const close = useCallback(() => {
    markSeenRef.current = latestMessageId().then(writeLastSeen).catch(() => {});
    setOpen(false);
    setUnread(0);
    buttonRef.current?.focus();
  }, []);

  // Escape closes the chat
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (hidden) return null;

  const badge = unread > 49 ? '50+' : unread;

  return (
    <>
      {open && (
        <div className="chat-launcher-panel card-dark" role="dialog" aria-label="Sembang Langsung">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid rgba(63, 63, 143, 0.3)', flexShrink: 0,
          }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Sembang Langsung</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="/chat" style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>Halaman penuh</a>
              <button onClick={close} aria-label="Tutup sembang" style={{
                background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '4px',
                display: 'flex', alignItems: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
              </button>
            </div>
          </div>
          <ChatWidget fullHeight flushInput />
        </div>
      )}

      <button
        ref={buttonRef}
        className="chat-launcher-btn btn-accent"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? 'Tutup sembang' : unread ? `Buka sembang, ${badge} mesej baru` : 'Buka sembang'}
        aria-expanded={open}
        title={open ? 'Tutup sembang' : 'Sembang Langsung'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 11.4a1 1 0 0 0-.8-.4H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a.5.5 0 0 1 .4.2l1.9 2.533a2 2 0 0 0 3.2.001l1.9-2.534a.5.5 0 0 1 .4-.2H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
        )}
        {!open && unread > 0 && <span className="chat-launcher-badge" aria-hidden="true">{badge}</span>}
      </button>
    </>
  );
}
