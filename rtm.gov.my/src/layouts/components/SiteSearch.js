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
                maxHeight: searchOpen ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#f8f9fa',
                borderBottom: searchOpen ? '1px solid #dee2e6' : 'none',
            }}
        >
            <div className="container py-3">
                <div className="input-group">
                    <span className="input-group-text bg-white">
                        <i className="bi bi-search text-muted" />
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        placeholder="Cari tajuk atau kandungan..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="btn btn-outline-secondary" onClick={() => { setQuery(''); setResults([]); }}>
                            <i className="bi bi-x-lg" />
                        </button>
                    )}
                </div>

                {query.trim().length >= 2 && (
                    <div className="mt-2">
                        {searching && (
                            <p className="text-muted small mb-0">Mencari...</p>
                        )}
                        {!searching && results.length === 0 && (
                            <p className="text-muted small mb-0">Tiada hasil ditemui untuk "<strong>{query}</strong>".</p>
                        )}
                        {!searching && results.length > 0 && (
                            <>
                                <p className="text-muted small mb-1">{results.length} hasil ditemui</p>
                                <ul className="list-group list-group-flush border rounded">
                                    {results.map(r => (
                                        <li key={r.id} className="list-group-item">
                                            <i className="bi bi-file-earmark me-2 text-muted" />
                                            <NavLink
                                                to={resolveLink(r)}
                                                className="text-decoration-none text-dark"
                                                onClick={closeSearch}
                                            >
                                                {r.title}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiteSearch;
