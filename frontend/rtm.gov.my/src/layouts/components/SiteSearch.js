import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import useStore from '../../pages/store';
import { trackEvent } from '../../libs/analytics';

const url = process.env.REACT_APP_API_URL;

const SiteSearch = () => {
    const { searchOpen, closeSearch } = useStore();
    const [query, setQuery]         = useState('');
    const [results, setResults]     = useState([]);
    const [searching, setSearching] = useState(false);
    const debounceRef = useRef(null);
    const inputRef    = useRef(null);

    // Auto-focus when opened; clear when closed
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => inputRef.current?.focus(), 320);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [searchOpen]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closeSearch(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [closeSearch]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.trim().length < 2) { setResults([]); return; }

        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res  = await fetch(`${url}/sitemap/search?q=${encodeURIComponent(query)}`);
                const json = await res.json();
                setResults(json.results || []);
                trackEvent('search', null, null, query);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 400);
    }, [query]);

    const resolveLink = (result) => {
        const setting = result.article_setting;
        return setting?.listing_type === 'single_article'
            ? `/contents/${result.id}`
            : `/listings/${result.id}`;
    };

    return (
        <div
            style={{
                maxHeight: searchOpen ? '600px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#1a2744',
                borderBottom: searchOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
        >
            <div className="container py-3">
                <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#0f1b33', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <i className="bi bi-search" style={{ color: '#7b9cc7' }} />
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        placeholder="Cari tajuk atau kandungan..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{
                            backgroundColor: '#0f1b33',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#e8edf3',
                        }}
                    />
                    {query && (
                        <button
                            className="btn d-flex align-items-center"
                            style={{ backgroundColor: '#0f1b33', border: '1px solid rgba(255,255,255,0.15)', color: '#7b9cc7' }}
                            onClick={() => { setQuery(''); setResults([]); }}
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    )}
                </div>

                {query.trim().length >= 2 && (
                    <div className="mt-2">
                        {searching && (
                            <p className="small mb-0" style={{ color: '#7b9cc7' }}>Mencari...</p>
                        )}
                        {!searching && results.length === 0 && (
                            <p className="small mb-0" style={{ color: '#7b9cc7' }}>
                                Tiada hasil ditemui untuk "<strong className="text-light">{query}</strong>".
                            </p>
                        )}
                        {!searching && results.length > 0 && (
                            <>
                                <p className="small mb-2" style={{ color: '#7b9cc7' }}>{results.length} hasil ditemui</p>
                                <div style={{ maxHeight: '350px', overflowY: 'auto', borderRadius: '6px', backgroundColor: '#0f1b33' }}>
                                    {results.map((r, idx) => (
                                        <NavLink
                                            key={r.id}
                                            to={resolveLink(r)}
                                            className="d-flex align-items-center text-decoration-none px-3 py-2"
                                            style={{
                                                color: '#c9d6e5',
                                                borderBottom: idx < results.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                                transition: 'background-color 0.15s',
                                            }}
                                            onClick={closeSearch}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <i className="bi bi-file-earmark me-2" style={{ color: '#4a6fa5' }} />
                                            {r.title}
                                        </NavLink>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiteSearch;
