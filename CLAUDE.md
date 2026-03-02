# CLAUDE.md — RTM Portal Boilerplate

## Project Overview

Full-stack CMS and public portal for RTM (Radio Televisyen Malaysia).
Three applications communicate via a central Laravel REST API.

```
MySQL (portalrtm)
       ↓
api/          Laravel 10 — REST API server (port 8000)
       ↓
backend/      React 18   — Admin panel  (served at /backend)
rtm.gov.my/   React 18   — Public site  (served at /)
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

**ENV vars (api/.env):**
```
APP_URL=http://localhost
DB_DATABASE=portalrtm
DB_USERNAME=root
FRONTEND_URL=http://localhost:3000
```

---

### 2. `backend/` — React 18 Admin Panel

**Purpose:** Dashboard for admins/content managers to create and manage all content.

**Run:** `npm start` (port 3000, served at `/backend`)

**Build:** `react-scripts build` (homepage `/backend`)

**API base:** `http://localhost:8000/api` (env: `REACT_APP_BACKEND_URL`)

**Auth:** Bearer token stored in `localStorage`, injected by Axios interceptor.
401/403 → auto-redirect to `/backend/sign-in`.

**Key dependencies:**
- `react-router-dom` ^6.12.1 — All routes wrapped in `<ProtectedRoute>`
- `zustand` ^4.3.8 — Global state management
- `bootstrap` ^5.3.0 — UI framework
- `quill` / `react-quill` — Rich text editing
- `video.js` ^8.21.0 + `@videojs/http-streaming` — HLS video playback
- `@fortawesome/*` — Icons

**Route structure:**
```
/sign-in, /sign-out, /unauthorized      — Auth pages
/home                                    — Dashboard
/account                                 — Account settings
/administration/roles                    — Role management
/administration/users                    — User management
/administration/articles/:parentId       — Article tree management
/administration/articles-data/:parentId  — Sub-article management
/administration/banners                  — Homepage banners
/administration/programmes               — Programme listings
/administration/videos                   — Video content
/administration/directories/:parentId    — Staff directory
/administration/assets/:parentId         — File/asset management
/administration/vods/:parentId           — Video-on-Demand
```

**Directory layout:**
```
src/
├── components/   — Reusable UI (Pagination, DisplayMessage, BreadCrumb, forms)
├── layouts/      — Layout wrappers (AdminLayout, UserLayout)
├── libs/         — axios.js, ProtectedRoute.js, FormInput.js, Logout.js
├── pages/        — Page components grouped by feature
└── index.js      — Entry point with router
```

**ENV vars (backend/.env):**
```
REACT_APP_BACKEND_URL=http://localhost:8000/api
REACT_APP_FRONTEND_URL=http://localhost:3000/backend
REACT_APP_SERVER_URL=http://localhost:8000
REACT_APP_MODE=production
```

---

### 3. `rtm.gov.my/` — React 18 Public Site

**Purpose:** Public-facing portal for end users to browse content, watch videos, and search directory.

**Run:** `npm start` (port 3000, served at `/`)

**Build:** `GENERATE_SOURCEMAP=false react-scripts build`

**API base:** `http://localhost:8000/api/frontend` (env: `REACT_APP_API_URL`)

**Server URL:** `http://localhost:8000` (env: `REACT_APP_SERVER_URL`) — for serving stored assets

**No authentication required** — all endpoints are public.

**Key dependencies:**
- `react-router-dom` ^6.12.1
- `bootstrap` ^5.3.3 + `react-bootstrap`
- `hls.js` ^1.5.20 — HLS video streaming
- `react-helmet-async` ^2.0.5 — SEO meta tags
- `react-slick` + `slick-carousel` — Carousels/banners
- `react-youtube` ^10.1.0 — YouTube embed
- `react-icons` ^5.5.0 — Icon library
- `react-placeholder-loading` — Skeleton loaders
- `zustand` ^4.3.8

**Route structure:**
```
/                           — Home (banners, programmes, videos)
/contents/:id               — Single article/content page
/listings/:id               — Article listing/collection page
/directories                — Staff directory root
/directories/:id            — Directory category
/directories/:id/show       — Individual staff profile
/directories/search/:query  — Directory search results
/sitemap                    — Hierarchical site map
```

**Layouts:** `src/layouts/`
```
HomeLayout/       — Home page with BannerCarousel, BannerProgramme, HomeVideo
ContentLayout/    — Single article with PageContent, PageGallery
ListingLayout/    — Article listing with SingleArticle cards
DirectoryLayout/  — Directory tree, SearchResultLayout, ShowStaff
SitemapLayout/    — Recursive hierarchical tree display
components/       — Menu1, Menu2, Menu3, Footer, Footer2, HlsPlayer, MenuGenerator
```

**API endpoints consumed:**
```
/frontend/home-menu, /home-menu-1, /home-menu-2   — Navigation
/frontend/sitemap                                  — Sitemap tree
/frontend/home-banners                             — Carousel banners
/frontend/home-programmes                          — Programme listings
/frontend/home-videos                              — Video listings
/frontend/home-footer                              — Footer links
/frontend/articles/:id                             — Single article
/frontend/listings/:id                             — Article collection
/frontend/article-galleries/:articleDataId         — Image gallery
/frontend/directories                              — Directory root
/frontend/directories/:id                          — Directory by ID
/frontend/directories/:id/show                     — Staff member
/frontend/directories/search  (POST)               — Search
```

**ENV vars (rtm.gov.my/.env):**
```
REACT_APP_API_URL=http://localhost:8000/api/frontend
REACT_APP_SERVER_URL=http://localhost:8000
```

---

## Content Architecture

All content is built on the **Article** model using nested sets (hierarchical tree):

- Menus are driven by the article tree structure
- `ArticleSetting.show_children` controls whether children appear in menus
- `ArticleSetting.listing_type` determines how content renders (listing vs single page)
- `ArticleSetting.active` toggles visibility
- `ArticleData` holds ordered sub-content within an article
- Assets, Vods, and Directories are also nested set trees (independently)

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

---

## Common Commands

### API
```bash
cd api
php artisan serve          # Start dev server on :8000
php artisan migrate        # Run migrations
php artisan migrate:fresh --seed  # Reset and seed DB
php artisan tinker         # REPL
php artisan route:list     # List all routes
```

### Backend / RTM.GOV.MY
```bash
cd backend        # or cd rtm.gov.my
npm start         # Dev server
npm run build     # Production build
```
