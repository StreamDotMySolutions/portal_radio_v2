const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';

export function mapStation(s) {
  return {
    id: s.id,
    slug: s.slug,
    name: s.title,
    // thumbnail: used for card grid images
    banner: s.thumbnail_filename && s.thumbnail_filename !== 'placeholder'
      ? `${SERVER_URL}/storage/stations/${s.thumbnail_filename}`
      : null,
    // heroBanner: used for detail page full-width hero
    heroBanner: s.banner_filename && s.banner_filename !== 'placeholder'
      ? `${SERVER_URL}/storage/stations/${s.banner_filename}`
      : null,
    accent: s.accent_color || '#444',
    streamUrl: null,
    embedPlayerUrl: s.rtmklik_player_url || null,
    frequency: s.frequency || '',
    description: s.description || '',
    category: s.category,
    social: {
      facebook: s.facebook_url || null,
      instagram: s.instagram_url || null,
      twitter: s.x_url || null,
      youtube: s.youtube_url || null,
    },
  };
}

export async function fetchStations(category = null) {
  const url = category
    ? `${API_URL}/stations?category=${category}`
    : `${API_URL}/stations`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.stations || []).map(mapStation);
}

export async function fetchStationBySlug(slug) {
  const res = await fetch(`${API_URL}/stations/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.station ? mapStation(data.station) : null;
}

export async function fetchStationHits() {
  try {
    const res = await fetch(`${API_URL}/station-hits`);
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function searchStations(query) {
  const url = `${API_URL}/stations?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.stations || []).map(mapStation);
}

export async function fetchStationCategories() {
  const res = await fetch(`${API_URL}/station-categories`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.categories || [];
}
