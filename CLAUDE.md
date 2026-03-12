# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

Full-stack radio portal for RTM (Radio Televisyen Malaysia).
Three applications: a Next.js public frontend, a React admin panel, and a Laravel REST API.

```
MySQL (portalrtm)
       ↓
api/                     Laravel 10 — REST API server (port 8000)
       ↓
backend/                 React 18   — Admin panel (port 3000, served at /backend)
frontend/portalradio_v2/ Next.js 15 — Public radio portal (port 3000, served at /)
```

---

## Environment Configuration

### api/.env
```env
APP_URL=http://localhost
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portalrtm
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000
```

### backend/.env
```env
REACT_APP_BACKEND_URL=http://localhost:8000/api
REACT_APP_FRONTEND_URL=http://localhost:3000/backend
REACT_APP_SERVER_URL=http://localhost:8000
REACT_APP_MODE=production
```

### frontend/portalradio_v2/.env
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/frontend
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://radio.rtm.gov.my
```

---

## Applications

### 1. `api/` — Laravel 10 (PHP 8.1)

**Purpose:** Central REST API. All data flows through here.

**Run:** `php artisan serve` (port 8000)

**Database:** MySQL — `portalrtm`

**Auth:** Laravel Sanctum (bearer tokens) + Spatie Permission (`role:admin`)

**Route files:**
- `routes/api.php` — Admin routes, prefixed `/api`, protected by `auth:sanctum` + `role:admin`
- `routes/frontend.php` — Public routes, prefixed `/api/frontend`, no auth required

**Controllers:**
- `app/Http/Controllers/Backend/` — Admin-facing controllers
- `app/Http/Controllers/Frontend/` — Public-facing controllers

**Services:** `app/Services/` — Business logic lives here, controllers stay thin
- `ArticleService`, `ArticleContentService`, `ArticleDataService`
- `ArticleAssetService`, `ArticleGalleryService`, `ArticlePosterService`, `ArticlePdfService`
- `UserService`, `RoleService`, `AccountService`, `CommonService`
- `AnalyticsService`, `ChatService`, `ChatUserService`, `ComplaintService`

**Models:** `app/Models/`
- `Article` — Hierarchical nested set (`kalnoy/nestedset`), core content model
- `ArticleData`, `ArticleContent`, `ArticlePoster`, `ArticleAsset`, `ArticleGallery`, `ArticlePdf` — Article sub-models
- `ArticleSetting` — Per-article flags: `active`, `show_children`, `listing_type`
- `Banner`, `Programme`, `Video` — Homepage content
- `Station` — Radio station; route model binding uses `slug` field
- `Asset` — File/document management (nested)
- `Vod` — Video-on-Demand (nested)
- `Directory` — Staff directory (nested)
- `Setting` — Global key-value settings (e.g. livestream URL)
- `ChatUser`, `ChatMessage` — Public chat (separate from admin `User`)
- `Complaint` — Public complaint submissions (protected by reCAPTCHA)
- `AnalyticsEvent` — Tracks pageview, search, station, and livestream hits
- `User`, `Role`, `UserProfile` — Auth and RBAC

**Key packages:**
- `kalnoy/nestedset` ^6.0 — Hierarchical tree for Articles, Assets, Vods, Directories
- `spatie/laravel-permission` ^6.4 — Role-based access control
- `spatie/laravel-activitylog` ^4.7 — Audit trail
- `spatie/laravel-backup` ^8.5 — Automated backups
- `laravel/sanctum` ^3.2 — API token auth

---

### 2. `backend/` — React 18 Admin Panel

**Purpose:** Dashboard for admins/content managers to create and manage all content.

**Auth:** Bearer token in `localStorage`, injected by Axios interceptor. 401/403 auto-redirects to `/backend/sign-in`.

**Key dependencies:** react-router-dom (ProtectedRoute), zustand, bootstrap, react-quill, video.js, FontAwesome icons

**Protected routes:** `/backend/administration/*` for all CRUD operations

**Conventions:**
- Axios instance is in `src/libs/axios.js` — always import from there
- All admin UI routes must be wrapped in `<ProtectedRoute>`
- Bootstrap classes for styling; Zustand for cross-component state

---

### 3. `frontend/portalradio_v2/` — Next.js 15 Public Radio Portal

**Purpose:** Public-facing radio portal. No authentication required.

**Run:** `npm run dev` (port 3000)

**Tech:** Next.js 15 App Router, React 19, Bootstrap 5, hls.js

**App routes** (`app/` directory):
- `/` — Home (hero, live stream, stations, news, programmes)
- `/station/[slug]` — Individual station detail page
- `/senarai-radio` — Full station listing
- `/search-result` — Station search results
- `/chat` — Public chat room
- `/chat/profile` — Chat user profile
- `/chat/reset-password` — Password reset
- `/hubungi` — Contact / complaint form
- `/mengenai-kami` — About page
- `/api/proxy-player` — Internal Next.js API route that proxies RTMKlik embed player HTML (injects `<base>` tag for asset resolution)

**Utility modules** (`utils/`):
- `stationsApi.js` — `fetchStations()`, `fetchStationBySlug()`, `fetchStationHits()`, `searchStations()`, `mapStation()` — all station data fetching; `mapStation()` normalises API response to frontend shape
- `chatApi.js` — All chat API calls; chat user token stored as JSON in `localStorage` under key `chat_user`; authenticated requests use `X-Chat-Token` header
- `analytics.js` — `trackPageview()`, `trackSearch()`, `trackDownload()` — fire-and-forget POSTs to `/api/frontend/track`

**Note:** Source files use `.js` extension (not `.jsx`). Desktop and mobile layouts are split into separate component files (e.g. `Navbar.js` / `Navbar.mobile.js`) and toggled via the `Responsive` component.

---

## Directory Structure

### API (api/)
```
api/
├── app/
│   ├── Http/Controllers/
│   │   ├── Backend/     — Admin-facing endpoints
│   │   └── Frontend/    — Public-facing endpoints
│   ├── Models/          — Eloquent models
│   ├── Services/        — Business logic
│   └── Traits/          — Shared functionality
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php          — Admin endpoints (/api, auth required)
│   └── frontend.php     — Public endpoints (/api/frontend, no auth)
├── tests/Feature/       — Integration tests
└── storage/             — Uploaded files and logs
```

### Backend Admin (backend/)
```
backend/src/
├── components/          — Reusable UI
├── layouts/             — AdminLayout, ProtectedRoute
├── pages/Administration/ — CRUD page components
├── libs/                — axios.js, constants
└── index.js             — Router entry point
```

### Public Frontend (frontend/portalradio_v2/)
```
frontend/portalradio_v2/
├── app/                 — Next.js App Router pages and API routes
├── components/          — Page-level components (split desktop/mobile)
├── context/             — AccessibilityContext
├── data/                — Static data (stations.js seed data)
├── hooks/               — useIsMobile.js
├── utils/               — stationsApi.js, chatApi.js, analytics.js
└── public/              — Static assets
```

---

## Testing

### API (Pest + PHPUnit)
```bash
cd api
./vendor/bin/pest                    # All tests
./vendor/bin/pest tests/Feature      # Only feature tests
./vendor/bin/pest --filter=LoginTest # Specific test
```

### React / Next.js
```bash
npm test                     # Run Jest tests
npm test -- --watch          # Watch mode
npm test -- --coverage       # Coverage report
```

---

## Database & Models

### Hierarchical Content (Nested Sets)
Several models use `kalnoy/nestedset` for tree structures:
- **Article** — Main content hierarchy
- **Asset** — File/document management
- **Vod** — Video-on-Demand categories
- **Directory** — Staff/organizational hierarchy

Key nested set methods: `->children()`, `->descendants()`, `->ancestors()`, `->createChild([...])`

### Date Formats
All models cast dates to `datetime:d/m/Y H:i` via `$casts`.

---

## Development Conventions

### API (Laravel)
- Business logic goes in `app/Services/`, controllers call services and return JSON
- Use `['auth:sanctum', 'role:admin']` middleware on all admin routes
- Public routes go in `routes/frontend.php` with no middleware
- File uploads stored via Laravel's default disk (`storage/`)

### DataTable Toolbar Layout (backend admin CRUD sections)

Every DataTable toolbar must follow this three-section layout on one row:

```
[Sort ButtonGroup]     [🔍 Search InputGroup]     [+ Create]
```

```jsx
<div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
    <ButtonGroup>
        <Button variant={sortBy === 'name' ? 'primary' : 'outline-secondary'} onClick={() => handleToggleSort('name')}>
            <FontAwesomeIcon icon={['fas', 'a']} className='me-1' />
            Name {sortBy === 'name' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
        </Button>
        <Button variant={sortBy === 'date' ? 'primary' : 'outline-secondary'} onClick={() => handleToggleSort('date')}>
            <FontAwesomeIcon icon={['fas', 'calendar']} className='me-1' />
            Date {sortBy === 'date' && <FontAwesomeIcon icon={['fas', sortDir === 'desc' ? 'arrow-down' : 'arrow-up']} className='ms-1' />}
        </Button>
    </ButtonGroup>

    <InputGroup style={{ maxWidth: '340px' }}>
        <InputGroup.Text><FontAwesomeIcon icon={['fas', 'magnifying-glass']} /></InputGroup.Text>
        <Form.Control placeholder='Search by name...' value={query} onChange={e => setQuery(e.target.value)} />
        {query && <Button variant='outline-secondary' onClick={() => setQuery('')}><FontAwesomeIcon icon={['fas', 'xmark']} /></Button>}
    </InputGroup>

    <CreateModal />
</div>
```

**Sort toggle logic** (`handleToggleSort(field)`):
- Same field: desc → asc → off (null); different field: activate at desc
- Active: `variant='primary'`; inactive: `variant='outline-secondary'`
- Show direction arrow only when that field is active

**API sort support:**
```php
if ($sortBy === 'name') {
    $query->orderBy('name', $sortDir);
} elseif ($sortBy === 'date') {
    $query->orderBy('created_at', $sortDir);
} else {
    $query->defaultOrder(); // nested set default, or omit for flat models
}
```

---

## Common Commands

### API (Laravel)
```bash
cd api
php artisan serve                    # Start dev server on :8000
php artisan migrate                  # Run pending migrations
php artisan migrate:fresh --seed     # Reset DB and seed
php artisan tinker                   # Interactive REPL
./vendor/bin/pest                    # Run all tests
php artisan pint                     # Fix code style
php artisan route:list               # List all routes
php artisan storage:link             # Create storage symlink
```

### Backend Admin (React 18)
```bash
cd backend
npm install
npm start        # Dev server on :3000
npm run build    # Production build
npm test
```

### Public Frontend (Next.js)
```bash
cd frontend/portalradio_v2
npm install
npm run dev      # Dev server on :3000
npm run build    # Production build
npm start        # Start production server
```
