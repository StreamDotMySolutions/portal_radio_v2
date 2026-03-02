import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AccessibilityWidget.css';

const AccessibilityWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [smallText, setSmallText] = useState(false);
    const [highlightLinks, setHighlightLinks] = useState(false);
    const [highlightHeadings, setHighlightHeadings] = useState(false);

    useEffect(() => {
        document.body.classList.toggle('acc-large-text', largeText);
    }, [largeText]);

    useEffect(() => {
        document.body.classList.toggle('acc-small-text', smallText);
    }, [smallText]);

    useEffect(() => {
        document.body.classList.toggle('acc-highlight-links', highlightLinks);
    }, [highlightLinks]);

    useEffect(() => {
        document.body.classList.toggle('acc-highlight-headings', highlightHeadings);
    }, [highlightHeadings]);

    const handleLargeText = () => {
        const next = !largeText;
        setLargeText(next);
        if (next) setSmallText(false);
    };

    const handleSmallText = () => {
        const next = !smallText;
        setSmallText(next);
        if (next) setLargeText(false);
    };

    const items = [
        {
            icon: ['fas', 'expand'],
            label: 'Tambah Saiz',
            checked: largeText,
            onChange: handleLargeText,
            id: 'acc-large',
        },
        {
            icon: ['fas', 'compress'],
            label: 'Kurangkan Saiz',
            checked: smallText,
            onChange: handleSmallText,
            id: 'acc-small',
        },
        {
            icon: ['fas', 'link'],
            label: 'Tandakan Pautan',
            checked: highlightLinks,
            onChange: () => setHighlightLinks(p => !p),
            id: 'acc-links',
        },
        {
            icon: ['fas', 'heading'],
            label: 'Tandakan Tajuk',
            checked: highlightHeadings,
            onChange: () => setHighlightHeadings(p => !p),
            id: 'acc-headings',
        },
    ];

    return (
        <div className="acc-widget">
            {isOpen && (
                <div className="acc-panel">
                    <div className="acc-panel-title">Kandungan</div>
                    {items.map(item => (
                        <div key={item.id} className="acc-item">
                            <FontAwesomeIcon icon={item.icon} className="acc-icon" fixedWidth />
                            <label htmlFor={item.id} className="acc-label">{item.label}</label>
                            <div className="form-check form-switch ms-auto mb-0">
                                <input
                                    id={item.id}
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={item.checked}
                                    onChange={item.onChange}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button
                className="acc-btn"
                onClick={() => setIsOpen(p => !p)}
                aria-label="Tetapan Kebolehcapaian"
                aria-expanded={isOpen}
            >
                <FontAwesomeIcon icon={['fas', 'universal-access']} />
            </button>
        </div>
    );
};

export default AccessibilityWidget;
