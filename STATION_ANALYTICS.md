# Station Pageview Analytics Implementation

## Overview
Implemented pageview tracking for radio stations using the existing analytics engine. All station detail page visits are now tracked and available in the admin analytics dashboard.

---

## What Was Implemented

### 1. Frontend Tracking (`frontend/portalradio_v2/utils/analytics.js`)
- **New file** created with analytics tracking utilities
- `trackPageview(pageType, referenceId, referenceTitle)` — Main tracking function
- `trackSearch(pageType, query)` — For search events (reusable)
- `trackDownload(pageType, filename)` — For download events (reusable)
- Session ID management via `sessionStorage`
- Device type detection (mobile/tablet/desktop)
- Fire-and-forget API calls to avoid blocking user experience

**Key Features:**
- Uses `navigator.userAgent` to detect device type
- Captures `document.referrer` for traffic source analysis
- Silent failure (analytics errors don't disrupt UX)
- Session persistence across page views

### 2. Station Detail Components Updated

#### `frontend/portalradio_v2/components/StationDetail.js` (Desktop)
- Added `useEffect` hook that calls `trackPageview('station', station.slug, station.name)` on mount
- Reference ID: station slug (unique identifier)
- Reference title: station name

#### `frontend/portalradio_v2/components/StationDetail.mobile.js` (Mobile)
- Identical tracking implementation for consistency
- Ensures both desktop and mobile views are counted

### 3. Backend Analytics Service (`api/app/Services/AnalyticsService.php`)

**New Methods:**

#### `topStations(int $limit = 10)`
Returns top 10 most-viewed stations with view counts.

**Query:**
```php
SELECT reference_id, reference_title, COUNT(*) as views
FROM analytics_events
WHERE event_type = 'pageview' AND page_type = 'station'
GROUP BY reference_id, reference_title
ORDER BY views DESC
LIMIT 10
```

#### `stationViews(string $stationSlug)`
Get total pageview count for a specific station.

```php
$views = AnalyticsService::stationViews('nasional-fm');
// Returns: 1234 (integer)
```

#### `totalStationViews()`
Get total pageviews across all stations.

```php
$totalViews = AnalyticsService::totalStationViews();
// Returns: 5678 (integer)
```

#### `stationViewsByDateRange(string $stationSlug, $startDate, $endDate)`
Get pageviews for a station within a date range.

```php
$views = AnalyticsService::stationViewsByDateRange(
    'nasional-fm',
    now()->subDays(7),
    now()
);
// Returns: 123 (views in last 7 days)
```

### 4. Backend Analytics Controller (`api/app/Http/Controllers/Backend/AnalyticsController.php`)

**Updated Response:**
```json
{
  "summary": { ... },
  "top_articles": [ ... ],
  "top_stations": [
    {
      "reference_id": "nasional-fm",
      "reference_title": "NASIONALfm",
      "views": 542
    },
    ...
  ],
  "top_searches": [ ... ],
  ...
}
```

---

## How It Works

### Flow Diagram
```
1. User visits /station/[slug]
   ↓
2. StationDetail component mounts
   ↓
3. useEffect triggers trackPageview()
   ↓
4. POST /api/frontend/track with payload:
   {
     "session_id": "1710168000000-abc123xyz",
     "event_type": "pageview",
     "page_type": "station",
     "reference_id": "nasional-fm",
     "reference_title": "NASIONALfm",
     "device_type": "desktop",
     "referrer": "https://google.com"
   }
   ↓
5. Frontend AnalyticsController stores in analytics_events table
   ↓
6. Admin can view stats at /administration/analytics
```

### Database Schema
Uses existing `analytics_events` table:

| Column | Value |
|--------|-------|
| `session_id` | Unique browser session ID |
| `event_type` | `"pageview"` |
| `page_type` | `"station"` |
| `reference_id` | Station slug (e.g., `"nasional-fm"`) |
| `reference_title` | Station name (e.g., `"NASIONALfm"`) |
| `device_type` | `"mobile"` / `"tablet"` / `"desktop"` |
| `referrer` | Previous page URL |
| `created_at` | Timestamp of event |

---

## API Endpoints

### Track a Pageview (Frontend)
**POST** `/api/frontend/track`

```javascript
// Example
fetch('http://localhost:8000/api/frontend/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: "1710168000000-abc123xyz",
    event_type: "pageview",
    page_type: "station",
    reference_id: "nasional-fm",
    reference_title: "NASIONALfm",
    device_type: "desktop",
    referrer: "https://google.com"
  })
})
```

### Get Analytics Data (Admin)
**GET** `/api/analytics`

Response includes `top_stations` array with most-viewed stations.

---

## Testing

### Manual Testing
1. Navigate to a station detail page (e.g., `/station/nasional-fm`)
2. Check browser `sessionStorage` for `analytics_session_id`
3. Check Network tab for POST to `/api/frontend/track` (should show 200 OK)
4. Refresh page → new pageview should be logged
5. In admin dashboard → `/administration/analytics` → "Top Stations" should show the station with increased view count

### Verification
```bash
# Check analytics in database
mysql> SELECT * FROM analytics_events WHERE page_type = 'station' LIMIT 5;

# Get top stations via API
curl http://localhost:8000/api/analytics \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" | jq '.top_stations'
```

---

## Reusable Analytics Functions

The `utils/analytics.js` utility is designed to be reusable for tracking other content types:

### Track Article Views
```javascript
import { trackPageview } from '@/utils/analytics';

// In article component
useEffect(() => {
  trackPageview('article', article.id, article.title);
}, [article.id, article.title]);
```

### Track Searches
```javascript
import { trackSearch } from '@/utils/analytics';

// In search form submit handler
const handleSearch = (query) => {
  trackSearch('directory', query);
  // ... perform search
};
```

### Track Downloads
```javascript
import { trackDownload } from '@/utils/analytics';

// On download link click
const handleDownload = (filename) => {
  trackDownload('asset', filename);
  // ... trigger download
};
```

---

## Admin Dashboard Updates

The analytics dashboard (`GET /api/analytics`) now includes station metrics alongside articles and other content.

### Available Metrics

**Summary (all content types):**
- Today's pageviews
- Week's pageviews
- Month's pageviews
- 30-day unique visitors

**Top Content:**
- Top articles
- **Top stations** ← NEW
- Top searches
- Top downloads

---

## Performance Considerations

- ✅ **Fire-and-forget:** Analytics don't block page rendering
- ✅ **Session persistence:** Uses `sessionStorage` (client-side, no server load)
- ✅ **Device detection:** Client-side via user agent (no extra requests)
- ✅ **Silent failures:** Analytics errors are caught and logged to console only
- ✅ **Minimal payload:** ~400 bytes per tracking request

---

## Future Enhancements

1. **Real-time dashboard:** Add live pageview counter to admin analytics
2. **Station metrics card:** Show pageviews in station management DataTable
3. **Export reports:** Generate CSV/PDF analytics reports by station
4. **Time-based filters:** Filter top stations by date range
5. **Referrer analysis:** Track which sources drive station views
6. **Revenue attribution:** Link pageviews to monetization (if applicable)

---

## Files Modified

| File | Change |
|------|--------|
| `frontend/portalradio_v2/utils/analytics.js` | **NEW** — Analytics tracking utility |
| `frontend/portalradio_v2/components/StationDetail.js` | Added `useEffect` + `trackPageview()` |
| `frontend/portalradio_v2/components/StationDetail.mobile.js` | Added `useEffect` + `trackPageview()` |
| `api/app/Services/AnalyticsService.php` | Added 4 station-specific methods |
| `api/app/Http/Controllers/Backend/AnalyticsController.php` | Added `top_stations` to response |

---

## Troubleshooting

### Pageviews not being recorded?
1. Check browser console for errors
2. Verify Network tab shows successful POST to `/api/frontend/track`
3. Check `analytics_events` table in MySQL for records with `page_type = 'station'`
4. Ensure `NEXT_PUBLIC_API_URL` env var is set correctly in frontend

### Analytics dashboard not showing stations?
1. Verify admin has at least one pageview recorded for a station
2. Check AnalyticsController response: `GET /api/analytics` should include `top_stations`
3. Ensure Admin AnalyticsController was updated with `topStations()` call

---

## Dependencies

- **Frontend:** Existing React/Next.js setup (uses native `fetch` and `sessionStorage`)
- **Backend:** Existing Laravel + AnalyticsEvent model and routes
- **Database:** Existing `analytics_events` table

No new packages or dependencies required.
