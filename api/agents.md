# API — Architecture & Style Guide for Refactoring

## Overview

Laravel 10 REST API serving both admin (backend) and public (rtm.gov.my) frontends.
All data flows through this API. No server-side rendering — pure JSON responses.

---

## Directory Structure

```
api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Backend/        — Admin-facing controllers (21 files)
│   │   │   ├── Frontend/       — Public-facing controllers (7 files)
│   │   │   └── Controller.php  — Base controller
│   │   ├── Middleware/         — 8 custom middleware files
│   │   ├── Requests/           — Form request validation, grouped by feature
│   │   │   ├── Account/
│   │   │   ├── ArticleContents/
│   │   │   ├── ArticleData/
│   │   │   ├── ArticlePosters/
│   │   │   ├── Articles/
│   │   │   ├── Auth/
│   │   │   ├── Roles/
│   │   │   └── Users/
│   │   └── Kernel.php
│   ├── Jobs/                   — VodJob.php (async HLS processing)
│   ├── Models/                 — 16 model files
│   ├── Services/               — 10 service files (business logic lives here)
│   └── Providers/
├── routes/
│   ├── api.php                 — Admin routes (/api prefix, auth:sanctum + role:admin)
│   └── frontend.php            — Public routes (/api/frontend prefix, no auth)
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
└── composer.json
```

---

## Routes

### `routes/api.php` — Admin (protected)

```
Middleware: auth:sanctum + role:admin (all except auth group)

Guest group:
  POST   /register
  POST   /login
  POST   /password/email
  POST   /password/reset
  POST   /logout

Account (sanctum only):
  GET    /account
  PUT    /account

Admin CRUD resources:
  /users, /users/{user}              — UserController
  /roles, /roles/{role}              — RoleController
  /articles, /articles/{article}     — ArticleController
  /articles/node/{parentId}          — index by parent
  /articles/ordering/{article}       — reorder (NestedSet)
  /article-contents, /article-contents/{content}
  /article-assets, /article-assets/{asset}
  /article-galleries, /article-galleries/{gallery}
  /article-data, /article-data/{data}
  /article-settings/{article}        — show + update (upsert)
  /article-posters                   — store + delete
  /banners, /banners/{banner}
  /programmes, /programmes/{programme}
  /videos, /videos/{video}
  /assets, /assets/{asset}
  /vods, /vods/{vod}
  /directories, /directories/{directory}
```

### `routes/frontend.php` — Public (no auth)

```
Prefix: /api/frontend

Navigation:
  GET  /home-menu
  GET  /home-menu-1
  GET  /home-menu-2
  GET  /sitemap

Content:
  GET  /articles/{id}
  GET  /listings/{id}
  GET  /show/{id}
  GET  /article-galleries/{articleDataId}

Homepage:
  GET  /home-footer
  GET  /home-banners
  GET  /home-programmes
  GET  /home-videos

Directory:
  GET   /directories
  GET   /directories/{id}
  GET   /directories/{id}/show
  POST  /directories/search
```

---

## Controller Patterns

### Thin Controllers — Logic Delegates to Services

Controllers only handle:
- Accepting the request
- Calling a service method
- Returning a JSON response

```php
// Standard CRUD pattern
public function index($parentId) {
    $articles = ArticleService::index($parentId);
    return response()->json(['articles' => $articles]);
}

public function store(StoreRequest $request) {
    ArticleService::store($request);
    return response()->json(['message' => 'Article successfully created']);
}

public function update(UpdateRequest $request, Article $article) {
    ArticleService::update($request, $article);
    return response()->json(['message' => 'Article successfully updated']);
}

public function delete(Article $article) {
    ArticleService::delete($article);
    return response()->json(['message' => 'Article successfully deleted']);
}
```

### Method Naming

| Method | Purpose |
|--------|---------|
| `index()` | List resources (optionally filtered by parent) |
| `store()` | Create a resource |
| `show()` | Get a single resource |
| `update()` | Update a resource |
| `delete()` | Delete a resource |
| `ordering()` | Reorder via NestedSet up()/down() |

### Namespacing

- `App\Http\Controllers\Backend\` — Admin controllers
- `App\Http\Controllers\Frontend\` — Public controllers

---

## Service Layer Patterns

All business logic lives in `app/Services/`. Controllers must not contain business logic.

### Rules

- All service methods are **static**
- Method signatures follow the same shape across all services
- Services own file operations, DB queries, cascading deletes

```php
class ArticleService
{
    public static function index($parentId) { ... }
    public static function store(Request $request) { ... }
    public static function show($article) { ... }
    public static function update(Request $request, $article) { ... }
    public static function delete($article) { ... }
}
```

### Services

| Service | Responsibility |
|---------|---------------|
| `ArticleService` | Main content CRUD, auto-creates ArticleSetting on store |
| `ArticleContentService` | Rich-text body management |
| `ArticleDataService` | Sub-article CRUD, cascades to galleries + files |
| `ArticlePosterService` | Featured image upload/replace/delete |
| `ArticleAssetService` | Document attachment management |
| `ArticleGalleryService` | Image gallery management per ArticleData |
| `ArticleSettingService` | Per-article flags upsert |
| `UserService` | User CRUD, role assignment, approve/disable |
| `RoleService` | Spatie Permission role CRUD |
| `AccountService` | Authenticated user profile management |
| `CommonService` | Shared file handling (handleStoreFile, handleDeleteFile) |

### File Handling (via CommonService)

```php
// Naming pattern
$filename = time() . '-' . Str::slug($nameWithoutExt) . '.' . $ext;

// Store
Storage::disk('public')->putFileAs($directory, $request->file, $filename);

// Delete
Storage::disk('public')->delete("{$directory}/{$filename}");
```

File naming: `{timestamp}-{slug}.{ext}` — e.g., `1699564800-article-title.jpg`
Only the filename is stored in DB — path is derived on the frontend.

---

## Model Patterns

### Traits Used

| Trait | Models |
|-------|--------|
| `NodeTrait` (NestedSet) | Article, ArticleData, Banner, Programme, Video, Asset, Vod, Directory |
| `HasApiTokens` (Sanctum) | User |
| `HasRoles` (Spatie) | User |

### Key Relationships

**Article** (core content model):
```php
hasOne  → ArticleSetting, ArticlePoster, ArticleContent
hasMany → ArticleData
belongsTo → User
```

**ArticleData**:
```php
belongsTo → Article, User
hasMany → ArticleGallery
```

**User**:
```php
hasOne → UserProfile
HasRoles, HasApiTokens
```

### Nested Tree Queries

```php
// Get tree
Article::defaultOrder()->get()->toTree()

// With relations
Article::with(['descendants.articleSetting'])->defaultOrder()->get()->toTree()

// Ancestors (breadcrumb)
$article->ancestors
```

### Full-Text Search (Directory)

```php
Directory::where('type', 'spreadsheet')->fullTextSearch($query)->get()
// Uses MySQL MATCH/AGAINST BOOLEAN MODE on: name, occupation, email, phone, address
```

---

## Response Format

### Standard Patterns

```php
// Data response
return response()->json(['articles' => $articles]);
return response()->json(['article' => $article]);

// Success message
return response()->json(['message' => 'Resource successfully created']);

// Mixed data + meta
return response()->json([
    'title'    => $parent->title,
    'settings' => $parent->articleSetting,
    'articles' => $articles,
]);

// Error
return response()->json(['message' => 'Unauthorized'], 401);
return response()->json(['error' => 'Not found'], 404);
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Default success |
| 201 | Created (explicit in some controllers) |
| 401 | Auth failure / not approved |
| 404 | Not found |
| 422 | Validation error (handled by FormRequest) |

### Pagination

```php
->paginate(10)->withQueryString()
// Returns Laravel paginator with data + links + meta
```

---

## Request Validation

Form Requests live in `app/Http/Requests/{Feature}/StoreRequest.php`.

```php
class StoreRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
        ];
    }
}
```

### File Validation Example

```php
'article_poster' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
```

---

## Auth & Middleware

### Sanctum Flow

```
POST /login → creates token → returns plainTextToken
Frontend stores in localStorage
All requests: Authorization: Bearer {token}
```

### Middleware Aliases (Kernel.php)

```php
'auth'               → Authenticate (sanctum guard)
'guest'              → RedirectIfAuthenticated
'role'               → Spatie RoleMiddleware
'permission'         → Spatie PermissionMiddleware
'role_or_permission' → Spatie combined
```

### Route Group Pattern

```php
// Admin routes
Route::group(['middleware' => ['auth:sanctum', 'role:admin']], function () { ... });

// Auth only (no role check)
Route::group(['middleware' => ['auth:sanctum']], function () { ... });

// Guest only
Route::group(['middleware' => ['guest']], function () { ... });
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Controllers | Singular PascalCase | `ArticleController` |
| Services | Singular PascalCase | `ArticleService` |
| Models | Singular PascalCase | `Article`, `ArticleSetting` |
| Form Requests | Action + Request | `StoreRequest`, `UpdateRequest` |
| Route params | camelCase | `{parentId}`, `{article}` |
| DB columns | snake_case | `article_id`, `show_children` |
| DB foreign keys | `{model}_id` | `article_id`, `user_id` |
| Methods | camelCase | `handleStoreFile()`, `fullTextSearch()` |
| Uploaded files | `{timestamp}-{slug}.{ext}` | `1699564800-my-title.jpg` |

---

## Key Architectural Decisions

### 1. Service-Oriented Architecture
Business logic in Services, never in Controllers. One service per primary model.

### 2. NestedSet for Hierarchies
All tree structures (menus, assets, directories) use `kalnoy/nestedset`. Always call `->defaultOrder()` before querying.

### 3. ArticleSetting as Feature Flags
Settings are decoupled from Article. Created automatically on Article store with defaults (`active=false`, `show_children=true`).

### 4. Cascading Deletes in Services
Services own cascade logic. Do not rely on DB-level cascade. Example:
```php
// ArticleService::delete()
$article->articlePoster && ArticlePosterService::delete($article->articlePoster);
$article->articleContent && $article->articleContent->delete();
$article->delete();
```

### 5. Upsert Pattern for Settings
```php
ArticleSetting::updateOrCreate(
    ['article_id' => $article->id],
    $data
);
```

### 6. Async Job for Heavy Processing
VodController dispatches `VodJob` for HLS video processing instead of blocking the request.

### 7. Google Sheets Bulk Import
DirectoryController accepts structured JSON from a spreadsheet and recursively creates Directory nodes.

---

## Artisan Commands

### `articles:fix-types`

Backfill the `type` column on the `articles` table for existing data that was created before the `type` field existed.

**Logic:**
- Article has children → `folder`
- Article has no children (leaf node) → `file`

```bash
# Preview changes without saving
php artisan articles:fix-types --dry-run

# Apply
php artisan articles:fix-types
```

The dry-run prints a table showing every article's current type vs the computed new type, so you can verify before committing.

---

## Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `laravel/framework` | ^10.10 | Core |
| `laravel/sanctum` | ^3.2 | Bearer token auth |
| `kalnoy/nestedset` | ^6.0 | Hierarchical trees |
| `spatie/laravel-permission` | ^6.4 | RBAC |
| `spatie/laravel-activitylog` | ^4.7 | Audit trail |
| `spatie/laravel-backup` | ^8.5 | Automated backups |
| `guzzlehttp/guzzle` | ^7.2 | HTTP client |
