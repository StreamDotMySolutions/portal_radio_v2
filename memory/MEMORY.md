# Project Memory: RTM Portal Boilerplate

## Project Overview
Full-stack CMS and public portal for RTM (Radio Televisyen Malaysia).
Root: `C:/laragon/www/boilerplate`

## Architecture (3 main apps)

```
MySQL (portalrtm DB)
       ↓
Laravel API (port 8000)
  /api          → admin routes (auth required)
  /api/frontend → public routes (no auth)
       ↓
Backend (React admin)   RTM.GOV.MY (React public)
  /backend path           / root path
```

## 1. API — Laravel 10 (PHP 8.1)
- Path: `/api`
- Port: `8000`
- DB: MySQL `portalrtm`
- Auth: Laravel Sanctum (bearer tokens)
- RBAC: Spatie Permission (`role:admin`)
- Notable packages: `kalnoy/nestedset` (hierarchical content), `spatie/laravel-activitylog`
- Services layer: `/app/Services/` (ArticleService, UserService, etc.)
- Key models: Article (nested set), ArticleData, ArticleContent, Banner, Programme, Video, Asset, Directory, Vod, User, Role

## 2. Backend — React 18 (Admin Panel)
- Path: `/backend`
- Serves at: `/backend`
- API base: `http://localhost:8000/api`
- Auth: Bearer token from localStorage, Axios interceptors auto-attach
- 401/403 → redirect to `/backend/sign-in`
- State: Zustand
- UI: Bootstrap 5.3, FontAwesome, Quill editor, Video.js (HLS)
- Protected routes via `<ProtectedRoute>`
- Key pages: Articles (hierarchy), Banners, Programmes, Videos, Directories, Assets, VODs, Roles, Users

## 3. RTM.GOV.MY — React 18 (Public Site)
- Path: `/rtm.gov.my`
- Serves at: `/` (root)
- API base: `http://localhost:8000/api/frontend`
- Server URL: `http://localhost:8000` (asset serving)
- No auth required
- Features: HLS video, YouTube, SEO (React Helmet Async), multi-level menus, sitemap
- Key layouts: HomeLayout, ContentLayout, ListingLayout, DirectoryLayout, SitemapLayout

## Key API Endpoints (Frontend)
- `/frontend/home-menu`, `/home-menu-1`, `/home-menu-2`, `/sitemap`
- `/frontend/home-banners`, `/home-programmes`, `/home-videos`, `/home-footer`
- `/frontend/articles/:id`, `/listings/:id`, `/article-galleries/:id`
- `/frontend/directories`, `/directories/:id`, `/directories/:id/show`, `/directories/search`

## Content Model
- Articles use nested set (hierarchical tree) via `kalnoy/nestedset`
- ArticleSetting: active, show_children, listing_type
- ArticleData: sub-articles with ordering
- Menus are driven by article hierarchy

## Detailed Notes
See `architecture.md` for more details.
