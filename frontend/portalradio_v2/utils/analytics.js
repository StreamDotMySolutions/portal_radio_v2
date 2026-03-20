/**
 * Analytics tracking utility for Portal RTM
 * Tracks pageviews, searches, and other user interactions
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';

/**
 * Get or create a session ID stored in sessionStorage
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Detect device type from user agent
 */
function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  } else if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Track a pageview event
 * @param {string} pageType - Type of page (article, listing, station, etc.)
 * @param {number} referenceId - ID of the content being viewed
 * @param {string} referenceTitle - Title of the content
 */
export async function trackPageview(pageType, referenceId, referenceTitle) {
  try {
    const payload = {
      session_id: getSessionId(),
      event_type: 'pageview',
      page_type: pageType,
      reference_id: referenceId,
      reference_title: referenceTitle,
      device_type: getDeviceType(),
      referrer: document.referrer || null,
    };

    // Send analytics (fire-and-forget, don't block on this)
    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently fail - don't disrupt user experience if analytics fails
    });
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

/**
 * Track a search event
 * @param {string} pageType - Type of page where search occurred (directory, etc.)
 * @param {string} query - Search query/term
 */
export async function trackSearch(pageType, query) {
  try {
    const payload = {
      session_id: getSessionId(),
      event_type: 'search',
      page_type: pageType,
      reference_title: query,
      device_type: getDeviceType(),
      referrer: document.referrer || null,
    };

    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

/**
 * Track a download event
 * @param {string} pageType - Type of download (asset, article-pdf, etc.)
 * @param {string} filename - Name of the file being downloaded
 */
export async function trackDownload(pageType, filename) {
  try {
    const payload = {
      session_id: getSessionId(),
      event_type: 'download',
      page_type: pageType,
      reference_title: filename,
      device_type: getDeviceType(),
      referrer: document.referrer || null,
    };

    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

/**
 * Track a player play event (M3U8 or other stream players)
 * @param {number} stationId - Station ID being played
 * @param {string} stationName - Station name being played
 */
export async function trackPlayerPlay(stationId, stationName) {
  try {
    const payload = {
      session_id: getSessionId(),
      event_type: 'player_play',
      page_type: 'station',
      reference_id: stationId,
      reference_title: stationName,
      device_type: getDeviceType(),
      referrer: document.referrer || null,
    };

    fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}
