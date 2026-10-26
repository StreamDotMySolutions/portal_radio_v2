import { allStations } from '@/data/stations';

// Next.js App Router serves this at /sitemap.xml.
// Base URL comes from NEXT_PUBLIC_SITE_URL (same source as metadataBase in layout.js).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://radio.rtm.gov.my';

// Public, indexable pages. Deliberately excludes /deploy (admin dashboard),
// /search-result (dynamic search output) and the user-specific /chat/* subpages.
const staticRoutes = [
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: 'senarai-radio', changeFrequency: 'weekly', priority: 0.9 },
  { path: 'chat', changeFrequency: 'weekly', priority: 0.6 },
  { path: 'mengenai-kami', changeFrequency: 'monthly', priority: 0.5 },
  { path: 'hubungi', changeFrequency: 'monthly', priority: 0.5 },
  { path: 'dasar-privasi', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap() {
  const base = SITE_URL.replace(/\/$/, '');
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: route.path ? `${base}/${route.path}` : `${base}/`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const stationEntries = allStations
    .filter((station) => station && station.slug)
    .map((station) => ({
      url: `${base}/station/${station.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [...staticEntries, ...stationEntries];
}
