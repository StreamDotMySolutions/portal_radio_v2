// Served at /robots.txt. Public pages are crawlable; admin, deploy, account and API paths are not.
// /api/frontend/ stays allowed so crawlers can load the station data that pages fetch in the browser.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radio.rtm.gov.my';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/frontend/'],
      disallow: [
        '/api/',
        '/backend/',
        '/deploy',
        '/chat/profile',
        '/chat/reset-password',
        '/search-result',
      ],
    },
    host: SITE_URL,
    sitemap: `${SITE_URL.replace(/\/$/, '')}/sitemap.xml`,
  };
}
