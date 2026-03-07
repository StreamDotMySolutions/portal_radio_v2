const BASE_URL = process.env.REACT_APP_API_URL; // http://localhost:8000/api/frontend

function getVisitorId() {
    let id = localStorage.getItem('rtm_uid');
    if (!id) {
        // Simple UUID v4 generation
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
        localStorage.setItem('rtm_uid', id);
    }
    return id;
}

function getDeviceType() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
}

/**
 * Fire-and-forget analytics event.
 * Never throws — tracking must never break the user experience.
 *
 * @param {string} eventType  - 'pageview' | 'search'
 * @param {string|null} pageType  - 'home' | 'article' | 'listing' | 'directory'
 * @param {number|null} referenceId   - article/directory ID
 * @param {string|null} referenceTitle - article title or search query
 */
export function trackEvent(eventType, pageType = null, referenceId = null, referenceTitle = null) {
    try {
        fetch(`${BASE_URL}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id:      getVisitorId(),
                event_type:      eventType,
                page_type:       pageType,
                reference_id:    referenceId ? Number(referenceId) : null,
                reference_title: referenceTitle || null,
                device_type:     getDeviceType(),
                referrer:        document.referrer || null,
            }),
        }).catch(() => {}); // fire and forget
    } catch (_) {
        // never surface tracking errors
    }
}
