'use client';

import { useEffect, useRef, useState } from 'react';

export default function DirectEmbedPlayer({ src, height = 220 }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !src) return;

    let cancelled = false;

    fetch(`/api/proxy-player?url=${encodeURIComponent(src)}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(html => {
        if (cancelled) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Set base href so relative asset paths resolve correctly
        const existingBase = doc.querySelector('base');
        if (!existingBase) {
          const base = doc.createElement('base');
          const srcUrl = new URL(src);
          base.href = srcUrl.origin + srcUrl.pathname.replace(/\/[^/]*$/, '/');
          doc.head.prepend(base);
        }

        // Collect script data before removing from doc
        const scriptData = [];
        doc.querySelectorAll('script').forEach(s => {
          scriptData.push({ src: s.getAttribute('src'), text: s.textContent, type: s.type });
          s.remove();
        });

        // Inject <style> and <link rel="stylesheet"> into document head
        doc.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
          document.head.appendChild(node.cloneNode(true));
        });

        // Inject body HTML
        container.innerHTML = doc.body.innerHTML;

        // Re-create and append scripts so they execute
        scriptData.forEach(({ src: scriptSrc, text, type }) => {
          const el = document.createElement('script');
          if (type) el.type = type;
          if (scriptSrc) {
            // Resolve relative script src against the player base URL
            try {
              const base = new URL(src);
              el.src = new URL(scriptSrc, base.origin + base.pathname.replace(/\/[^/]*$/, '/')).href;
            } catch {
              el.src = scriptSrc;
            }
          } else if (text) {
            el.textContent = text;
          }
          container.appendChild(el);
        });
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [src]);

  if (error) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', borderRadius: '8px', color: '#888', fontSize: '0.85rem' }}>
        Gagal memuatkan pemain — {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ minHeight: height, borderRadius: '8px', overflow: 'hidden' }}
    />
  );
}
