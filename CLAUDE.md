# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

Full-stack CMS and public portal for RTM (Radio Televisyen Malaysia).
Two React applications communicate via a central Laravel REST API.

```
MySQL (portalrtm)
       ↓
api/          Laravel 10 — REST API server (port 8000)
       ↓
backend/      React 18   — Admin panel  (port 3000, served at /backend)
rtm.gov.my/   React 18   — Public site  (port 3000, served at /)
```

**Note:** The `frontend/` directory is legacy/unused; all public-facing content uses `rtm.gov.my/`.

---

## Environment Configuration

Each application needs its own `.env` file. Use `.env.example` as a template.

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

### rtm.gov.my/.env
```env
REACT_APP_API_URL=http://localhost:8000/api/frontend
REACT_APP_SERVER_URL=http://localhost:8000
```

---

## Applications

### 1. `api/` — Laravel 10 (PHP 8.1)

**Purpose:** Central REST API. All data flows through here.

**Run:** `php artisan serve` (port 8000)

**Database:** MySQL — database name `portalrtm`

**Auth:** Laravel Sanctum (bearer tokens) + Spatie Permission (`role:admin`)

**Route files:**
- `routes/api.php` — Admin routes, prefixed `/api`, protected by `auth:sanctum` + `role:admin`
- `routes/frontend.php` — Public routes, prefixed `/api/frontend`, no auth required

**Controllers:**
- `app/Http/Controllers/Backend/` — Admin-facing controllers
- `app/Http/Controllers/Frontend/` — Public-facing controllers

**Services:** `app/Services/` — Business logic lives here, controllers stay thin
- `ArticleService`, `ArticleContentService`, `ArticleDataService`
- `ArticleAssetService`, `ArticleGalleryService`, `ArticlePosterService`, `ArticleSettingService`
- `UserService`, `RoleService`, `AccountService`, `CommonService`

**Models:** `app/Models/`
- `Article` — Hierarchical nested set (`kalnoy/nestedset`), core content model
- `ArticleData` — Sub-articles with ordering
- `ArticleContent` — Rich text body
- `ArticlePoster` — Featured image
- `ArticleAsset` — Media file attachments
- `ArticleGallery` — Image galleries
- `ArticleSetting` — Per-article flags: `active`, `show_children`, `listing_type`
- `Banner`, `Programme`, `Video` — Homepage content
- `Asset` — File/document management (nested)
- `Vod` — Video-on-Demand (nested)
- `Directory` — Staff directory (nested)
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

**Protected routes:** `/backend/administration/*` for all CRUD operations (articles, users, roles, banners, programmes, videos, assets, directories, VODs)

---

### 3. `rtm.gov.my/` — React 18 Public Site

**Purpose:** Public-facing portal. No authentication required.

**Key dependencies:** react-router-dom, bootstrap, hls.js, react-helmet-async, react-slick, react-youtube, zustand

**Routes:** Home (`/`), Content pages (`/contents/:id`), Listings (`/listings/:id`), Directory search (`/directories/search/:query`), Sitemap (`/sitemap`)



## Directory Structure

### API (api/)
```
api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Backend/     — Admin-facing endpoints
│   │   │   └── Frontend/    — Public-facing endpoints
│   │   └── Requests/        — Form request validation
│   ├── Models/              — Eloquent models (Article, User, Banner, etc.)
│   ├── Services/            — Business logic (ArticleService, UserService, etc.)
│   └── Traits/              — Shared functionality
├── database/
│   ├── migrations/          — Schema changes
│   └── seeders/             — Database seeders
├── routes/
│   ├── api.php              — Admin endpoints (/api, requires auth + role:admin)
│   └── frontend.php         — Public endpoints (/api/frontend, no auth)
├── tests/
│   ├── Feature/             — Integration tests (HTTP requests)
│   └── Unit/                — Unit tests
└── storage/                 — Uploaded files and logs
```

### Backend Admin (backend/)
```
backend/src/
├── components/              — Reusable UI (buttons, forms, tables, modals)
├── layouts/                 — Page layout wrappers (AdminLayout, ProtectedRoute)
├── pages/                   — Page components organized by feature
│   ├── Administration/
│   ├── Account/
│   └── ...
├── libs/                    — Utilities (axios.js, constants)
└── index.js                 — Router and app entry point
```

### RTM Public Site (rtm.gov.my/)
```
rtm.gov.my/src/
├── components/              — Reusable UI (Menu, Footer, HlsPlayer, carousels)
├── layouts/                 — Page layout wrappers
│   ├── HomeLayout/
│   ├── ContentLayout/
│   ├── ListingLayout/
│   ├── DirectoryLayout/
│   └── SitemapLayout/
├── pages/                   — Page components (Home, Content, Listings, Directory)
├── libs/                    — Utilities and API client
└── index.js                 — Router and app entry point
```

---

## Testing

### API (Pest + PHPUnit)
- Test files live in `tests/Feature/` and `tests/Unit/`
- Uses **Pest** testing framework (newer, more expressive than PHPUnit)
- Check `api/Pest.php` for global test helpers and setup

Run tests:
```bash
cd api
./vendor/bin/pest                    # All tests
./vendor/bin/pest tests/Feature      # Only feature tests
./vendor/bin/pest --filter=LoginTest # Specific test
```

### React Apps (Jest)
- Tests run via `npm test` in each app
- Jest is configured through `react-scripts` (no need to configure manually)
- Can write unit tests for components, utils, hooks, etc.

---

## Database & Models

### Hierarchical Content (Nested Sets)
Several models use **nested sets** for hierarchical tree structures via `kalnoy/nestedset`:
- **Article** — Main content hierarchy (pages, sections, categories)
- **Asset** — File/document management
- **Vod** — Video-on-Demand categories
- **Directory** — Staff/organizational hierarchy

Key methods on nested set models:
- `->children()` — Get direct child nodes
- `->descendants()` — Get all descendants
- `->ancestor()` — Get parent
- `->ancestors()` — Get all parents up to root
- `->createChild([ 'name' => 'Child' ])` — Add child node
- Ordering via `getOrderedBy()` and `setOrderBy()` methods

### Core Models
- **Article** + **ArticleData** — Main content with sub-items
- **ArticleContent** — Rich text body for articles
- **ArticleSetting** — Per-article flags (`active`, `show_children`, `listing_type`)
- **ArticlePoster** — Featured image
- **ArticleAsset** — Media attachments
- **ArticleGallery** — Image galleries
- **Banner**, **Programme**, **Video** — Homepage content
- **User**, **Role** — Auth (uses Spatie Permission for RBAC)

### Date Formats
All models cast dates to `datetime:d/m/Y H:i` format via `$casts`:
```php
protected $casts = [
    'created_at' => 'datetime:d/m/Y H:i',
    'updated_at' => 'datetime:d/m/Y H:i',
];
```

---

## Development Conventions

### API (Laravel)
- Business logic goes in `app/Services/`, not controllers
- Controllers call services and return JSON responses
- Use Spatie Permission middleware on all admin routes: `['auth:sanctum', 'role:admin']`
- Frontend public routes require no middleware — add to `routes/frontend.php`
- File uploads stored in `storage/` (Laravel's default disk)

### Backend & RTM.GOV.MY (React)
- Axios instances are configured in `src/libs/axios.js` — always import from there, never create new instances
- All admin UI routes must be wrapped in `<ProtectedRoute>`
- Use Bootstrap classes for styling — avoid inline styles
- Zustand for cross-component state; local `useState` for form/UI state

### DataTable Toolbar Layout (all CRUD sections)

Every DataTable toolbar must follow this three-section layout on one row:

```
[Sort ButtonGroup]     [🔍 Search InputGroup]     [+ Create]
```

```jsx
<div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
    {/* Left: sort buttons */}
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

    {/* Middle: search */}
    <InputGroup style={{ maxWidth: '340px' }}>
        <InputGroup.Text><FontAwesomeIcon icon={['fas', 'magnifying-glass']} /></InputGroup.Text>
        <Form.Control placeholder='Search by name...' value={query} onChange={e => setQuery(e.target.value)} />
        {query && <Button variant='outline-secondary' onClick={() => setQuery('')}><FontAwesomeIcon icon={['fas', 'xmark']} /></Button>}
    </InputGroup>

    {/* Right: create */}
    <CreateModal />
</div>
```

**Sort toggle logic** (`handleToggleSort(field)`):
- Same field active: desc → asc → off (null); different field: switch to that field at desc
- Active button uses `variant='primary'`; inactive uses `variant='outline-secondary'`
- Show direction arrow icon only when that field is active

**API sort support** (Laravel controller):
```php
if ($sortBy === 'name') {
    $query->orderBy('name', $sortDir);
} elseif ($sortBy === 'date') {
    $query->orderBy('created_at', $sortDir);
} else {
    $query->defaultOrder(); // or no ordering for non-nested models
}
```

---

## Adding a New Feature (Typical Workflow)

### Example: Add a new "Press Release" management section to admin

**1. API Setup (Laravel)**
- Create model: `php artisan make:model PressRelease -m` (or add to migration manually)
- Create controller: `php artisan make:controller Backend/PressReleaseController --resource`
- Register routes in `routes/api.php` with `['auth:sanctum', 'role:admin']` middleware
- Add service logic to `app/Services/PressReleaseService.php` (business logic stays out of controller)
- Test with `./vendor/bin/pest tests/Feature/PressReleaseTest.php`

**2. Backend UI Setup (React)**
- Create page component: `backend/src/pages/Administration/PressReleases/`
- Create form component: `backend/src/pages/Administration/PressReleases/PressReleaseForm.jsx`
- Add route in `backend/src/index.js` wrapped in `<ProtectedRoute>`
- Use Axios from `src/libs/axios.js` to call API endpoints
- Add to navigation menu (if needed)

**3. Frontend (Public Site)**
- If press releases should be public, add endpoint to `routes/frontend.php`
- Create page/layout in `rtm.gov.my/src/pages/` to display content
- Add route to `rtm.gov.my/src/index.js`
- Fetch from `REACT_APP_API_URL/frontend/press-releases`

**4. Testing**
- API: Test the controller/service with `./vendor/bin/pest`
- React: Test UI with `npm test` in backend/ or rtm.gov.my/

---

## Common Commands

### API (Laravel)
```bash
cd api

# Development
php artisan serve                    # Start dev server on :8000

# Database
php artisan migrate                  # Run pending migrations
php artisan migrate:fresh --seed     # Reset DB and run seeders
php artisan db:seed                  # Run seeders only
php artisan tinker                   # Interactive REPL

# Testing & Quality
./vendor/bin/pest                    # Run all tests (Pest)
./vendor/bin/pest --filter=TestName  # Run specific test
php artisan test                     # Alternative: run tests with artisan
php artisan pint                     # Fix code style with Pint (Laravel's code formatter)

# Utilities
php artisan route:list               # List all routes
php artisan storage:link             # Create storage symlink for public files
```

### Backend Admin Panel (React 18)
```bash
cd backend

# Development
npm install      # Install dependencies
npm start        # Dev server on :3000 (served at /backend)

# Building & Testing
npm run build    # Production build (outputs to build/)
npm test         # Run Jest tests
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage report
```

### RTM Public Website (React 18)
```bash
cd rtm.gov.my

# Development
npm install      # Install dependencies
npm start        # Dev server on :3000 (served at /)

# Building & Testing
npm run build    # Production build without source maps (GENERATE_SOURCEMAP=false)
npm test         # Run Jest tests
npm test -- --watch  # Run tests in watch mode
```
