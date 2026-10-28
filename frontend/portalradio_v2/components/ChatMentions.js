'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { searchChatUsers, getAvatarUrl } from '../utils/chatApi';

const MAX_SUGGESTIONS = 6;
const MAX_HIGHLIGHTS = 5;      // mentions highlighted per message; the rest stay plain text (spam guard)
const SEARCH_DELAY_MS = 200;

// "@name" being typed right before the caret: start of the text or after whitespace
const TYPING_RE = /(^|\s)@([a-zA-Z0-9_]{0,30})$/;
// "@name" inside a message, not part of an email address or another word
const MENTION_RE = /(^|[^a-zA-Z0-9_@])@([a-zA-Z0-9_]{2,30})/g;

export function mentionsUser(text, username) {
  if (!username || !text) return false;
  const lower = username.toLowerCase();
  for (const m of text.matchAll(MENTION_RE)) {
    if (m[2].toLowerCase() === lower) return true;
  }
  return false;
}

/**
 * Autocomplete state for an "@name" being typed in a text input.
 * Suggestions come first from people already in the loaded messages (newest first, no request),
 * then from the server when those run short.
 */
export function useMentionAutocomplete({ messages, currentUser, value, setValue, inputRef }) {
  const [mention, setMention] = useState(null);   // { start, query } while an @ is being typed
  const [remote, setRemote] = useState([]);
  const [index, setIndex] = useState(0);
  const cacheRef = useRef(new Map());

  // Authors of loaded messages, newest first, without the current user
  const recent = useMemo(() => {
    const seen = new Map();
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (!m.chat_user_id || seen.has(m.chat_user_id) || m.chat_user_id === currentUser?.id) continue;
      seen.set(m.chat_user_id, { id: m.chat_user_id, username: m.username, color: m.color, avatar_filename: m.avatar_filename });
    }
    return [...seen.values()];
  }, [messages, currentUser?.id]);

  const local = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return recent.filter(u => u.username.toLowerCase().startsWith(q)).slice(0, MAX_SUGGESTIONS);
  }, [recent, mention]);

  // Fill up from the server once at least one letter is typed and local people run short
  const query = mention ? mention.query.toLowerCase() : null;
  useEffect(() => {
    setRemote([]);
    if (!query || local.length >= MAX_SUGGESTIONS) return;
    const q = query;
    if (cacheRef.current.has(q)) {
      setRemote(cacheRef.current.get(q));
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const users = await searchChatUsers(q).catch(() => []);
      cacheRef.current.set(q, users);
      if (!cancelled) setRemote(users);
    }, SEARCH_DELAY_MS);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query, local.length]);

  const items = useMemo(() => {
    const out = [...local];
    for (const u of remote) {
      if (out.length >= MAX_SUGGESTIONS) break;
      if (u.id !== currentUser?.id && !out.some(o => o.id === u.id)) out.push(u);
    }
    return out;
  }, [local, remote, currentUser?.id]);

  useEffect(() => { setIndex(0); }, [mention?.query]);

  // Call from the input's onChange (after updating the value) and on caret moves
  const update = useCallback((text, caret) => {
    const match = TYPING_RE.exec(text.slice(0, caret));
    if (!match) {
      setMention(null);
      return;
    }
    const next = { start: caret - match[2].length - 1, query: match[2] };
    // onChange and onSelect both report each keystroke: keep the same object so effects do not restart
    setMention(prev => (prev && prev.start === next.start && prev.query === next.query ? prev : next));
  }, []);

  const close = useCallback(() => setMention(null), []);

  const select = useCallback((u) => {
    if (!mention) return;
    const input = inputRef.current;
    const caret = input ? input.selectionStart : value.length;
    const insert = `@${u.username} `;
    const next = value.slice(0, mention.start) + insert + value.slice(caret);
    setValue(next);
    setMention(null);
    const pos = mention.start + insert.length;
    requestAnimationFrame(() => {
      if (!inputRef.current) return;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(pos, pos);
    });
  }, [mention, value, setValue, inputRef]);

  // Returns true when the key was used by the suggestion list
  const onKeyDown = useCallback((e) => {
    if (!mention || !items.length) return false;
    if (e.key === 'ArrowDown') {
      setIndex(i => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      setIndex(i => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      select(items[Math.min(index, items.length - 1)]);
    } else if (e.key === 'Escape') {
      setMention(null);
    } else {
      return false;
    }
    e.preventDefault();
    return true;
  }, [mention, items, index, select]);

  return { open: !!mention && items.length > 0, items, index, setIndex, update, select, close, onKeyDown };
}

export function MentionList({ items, index, onHover, onSelect }) {
  return (
    <ul role="listbox" aria-label="Cadangan nama" className="chat-mention-list" style={{
      position: 'absolute', left: '16px', right: '16px', bottom: '100%', marginBottom: '4px',
      listStyle: 'none', padding: '4px', margin: 0, zIndex: 20,
      background: 'var(--color-surface)', border: '1px solid rgba(63, 63, 143, 0.4)',
      borderRadius: '10px', boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.35)',
    }}>
      {items.map((u, i) => (
        <li key={u.id} role="option" aria-selected={i === index}
          // mousedown, not click, so the input keeps focus and the caret position
          onMouseDown={(e) => { e.preventDefault(); onSelect(u); }}
          onMouseEnter={() => onHover(i)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px',
            cursor: 'pointer', background: i === index ? 'rgba(108, 99, 255, 0.18)' : 'transparent',
          }}>
          <span style={{
            width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            background: u.avatar_filename ? 'none' : u.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {u.avatar_filename ? (
              <img src={getAvatarUrl(u.avatar_filename)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#fff' }}>{u.username.charAt(0).toUpperCase()}</span>
            )}
          </span>
          <span style={{ color: u.color, fontWeight: 600, fontSize: '0.85rem' }}>@{u.username}</span>
        </li>
      ))}
    </ul>
  );
}

/** Message text with "@name" highlighted; a known name opens that user's profile */
export function MessageText({ text, currentUsername, resolveUser, onMentionClick }) {
  const parts = [];
  let last = 0;
  let count = 0;
  for (const m of text.matchAll(MENTION_RE)) {
    if (count >= MAX_HIGHLIGHTS) break;
    const at = m.index + m[1].length;
    if (at > last) parts.push(text.slice(last, at));
    const name = m[2];
    const isMe = currentUsername && name.toLowerCase() === currentUsername.toLowerCase();
    const known = resolveUser(name);
    parts.push(
      <button key={at} type="button" className="chat-mention"
        onClick={() => onMentionClick(name)}
        style={{
          background: isMe ? 'rgba(245, 158, 11, 0.22)' : 'rgba(108, 99, 255, 0.16)',
          border: 'none', borderRadius: '4px', padding: '0 3px', margin: 0, font: 'inherit',
          fontWeight: 600, cursor: 'pointer',
          color: isMe ? '#F59E0B' : (known?.color || 'var(--accent-color, #6C63FF)'),
        }}>@{name}</button>
    );
    last = at + name.length + 1;
    count++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
