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

---

## Creating a New CRUD Feature (Step-by-Step)

### Phase 1: Database & Models

**1. Create Migration**
```bash
php artisan make:migration create_features_table
```

```php
// database/migrations/YYYY_MM_DD_create_features_table.php
Schema::create('features', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id');
    $table->string('title');
    $table->text('description')->nullable();
    $table->boolean('active')->default(false);
    $table->timestamps();

    // For nested set (optional, add in separate migration if needed)
    // $table->unsignedInteger('_lft')->default(0);
    // $table->unsignedInteger('_rgt')->default(0);
    // $table->unsignedBigInteger('parent_id')->nullable();

    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```

**2. Create Model**
```bash
php artisan make:model Feature
```

```php
// app/Models/Feature.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait; // Only if hierarchical
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Feature extends Model
{
    use LogsActivity;
    // use NodeTrait; // Only if using nested set ordering

    protected $guarded = ['id'];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logUnguarded()->logOnlyDirty();
    }
}
```

**3. Run Migration**
```bash
php artisan migrate
```

---

### Phase 2: API Controllers & Services

**1. Create Controller**
```bash
php artisan make:controller Backend/FeatureController
```

```php
// app/Http/Controllers/Backend/FeatureController.php
namespace App\Http\Controllers\Backend;

use Illuminate\Http\Request;
use App\Models\Feature;
use App\Services\FeatureService;

class FeatureController extends Controller
{
    public function index(Request $request)
    {
        $query = Feature::defaultOrder(); // for nested set: defaultOrder()
        // $query = Feature::query(); // for flat models

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->input('search')}%");
        }

        $features = $query->paginate(10)->withQueryString();
        return response()->json(['features' => $features]);
    }

    public function show(Feature $feature)
    {
        return response()->json(['feature' => $feature]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'sometimes|string',
            'active' => 'required|boolean',
        ]);

        FeatureService::store($request);
        return response()->json(['message' => 'Feature created successfully']);
    }

    public function update(Request $request, Feature $feature)
    {
        $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'active' => 'sometimes|boolean',
        ]);

        FeatureService::update($request, $feature);
        return response()->json(['message' => 'Feature updated successfully']);
    }

    public function delete(Feature $feature)
    {
        FeatureService::delete($feature);
        return response()->json(['message' => 'Feature deleted successfully']);
    }

    public function toggle(Feature $feature)
    {
        $feature->update(['active' => $feature->active == 1 ? 0 : 1]);
        return response()->json(['message' => 'Feature updated successfully']);
    }

    // Only if using nested set ordering
    public function ordering(Feature $feature, Request $request)
    {
        switch ($request->input('direction')) {
            case 'up':
                $feature->up();
                return response()->json(['message' => 'Feature moved up']);
                break;
            case 'down':
                $feature->down();
                return response()->json(['message' => 'Feature moved down']);
                break;
        }
    }
}
```

**2. Create Service**
```bash
mkdir -p app/Services
```

```php
// app/Services/FeatureService.php
namespace App\Services;

use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureService
{
    public static function index()
    {
        return Feature::defaultOrder()->get(); // or ->get() for flat
    }

    public static function store(Request $request)
    {
        Feature::create([
            'user_id' => auth('sanctum')->user()->id,
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'active' => $request->input('active'),
        ]);
    }

    public static function update(Request $request, Feature $feature)
    {
        $feature->update($request->only([
            'title', 'description', 'active'
        ]));
    }

    public static function delete(Feature $feature)
    {
        $feature->delete();
    }
}
```

**3. Create Form Request Validation (optional but recommended)**
```bash
mkdir -p app/Http/Requests/Features
php artisan make:request Features/StoreRequest
php artisan make:request Features/UpdateRequest
```

---

### Phase 3: Routes

**Add to `routes/api.php`** (inside the admin middleware group):

```php
// Features (flat model example)
Route::get('/features', [FeatureController::class, 'index']);
Route::get('/features/{feature}', [FeatureController::class, 'show']);
Route::post('/features', [FeatureController::class, 'store']);
Route::put('/features/{feature}', [FeatureController::class, 'update']);
Route::delete('/features/{feature}', [FeatureController::class, 'delete']);
Route::patch('/features/{feature}/toggle', [FeatureController::class, 'toggle']);

// Only if using nested set ordering
Route::get('/features/ordering/{feature}', [FeatureController::class, 'ordering']);

// Nested set example (hierarchical model)
// Route::get('/features/node/{parentId}', [FeatureController::class, 'index']);
// Route::get('/features/ordering/{feature}', [FeatureController::class, 'ordering']);
```

---

### Phase 4: React Admin Panel

**1. Create Feature Folder Structure**
```
backend/src/pages/Administration/Features/
├── index.js
├── store.js
├── components/
│   ├── DataTable.js
│   └── HtmlForm.js
└── modals/
    ├── Create.js
    ├── Edit.js
    ├── Show.js
    └── Delete.js
```

**2. Create Store**
```javascript
// backend/src/pages/Administration/Features/store.js
import { create } from 'zustand'

const useFeaturesStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),

    search: '',
    setSearch: (search) => set({ search, paginatorUrl: null }),
}))

export default useFeaturesStore
```

**3. Create Index Page**
```javascript
// backend/src/pages/Administration/Features/index.js
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import DataTable from './components/DataTable'

const Index = () => {
    const items = [
        { url: '/', label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge> },
        { url: '/administration/features', label: 'Feature Management' },
    ]

    return (
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    )
}
export default Index
```

**4. Create DataTable Component**
```javascript
// backend/src/pages/Administration/Features/components/DataTable.js
import React, { useState, useEffect } from 'react'
import { Button, Form, InputGroup, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'
import useFeaturesStore from '../store'
import axios from '../../../../libs/axios'
import PaginatorLink from '../../../../libs/PaginatorLink'
import CreateModal from '../modals/Create'
import ShowModal from '../modals/Show'
import EditModal from '../modals/Edit'
import DeleteModal from '../modals/Delete'

const DataTable = () => {
    const { url: apiBase } = useStore()
    const baseUrl = `${apiBase}/features`

    const refreshKey = useFeaturesStore((s) => s.refreshKey)
    const paginatorUrl = useFeaturesStore((s) => s.paginatorUrl)
    const setPaginatorUrl = useFeaturesStore((s) => s.setPaginatorUrl)
    const search = useFeaturesStore((s) => s.search)
    const setSearch = useFeaturesStore((s) => s.setSearch)

    const [query, setQuery] = useState(search)
    const [items, setItems] = useState([])

    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query])

    const effectiveUrl = paginatorUrl
        ?? (search ? `${baseUrl}?search=${encodeURIComponent(search)}` : baseUrl)

    useEffect(() => {
        axios({ method: 'get', url: effectiveUrl })
            .then((response) => setItems(response.data.features))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search])

    const handleClearSearch = () => setQuery('')

    return (
        <div>
            {/* Toolbar */}
            <div className='d-flex align-items-center justify-content-between mb-3 gap-2'>
                <InputGroup style={{ maxWidth: '340px' }}>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={['fas', 'magnifying-glass']} />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder='Search by title...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <Button variant='outline-secondary' onClick={handleClearSearch}>
                            <FontAwesomeIcon icon={['fas', 'xmark']} />
                        </Button>
                    )}
                </InputGroup>
                <CreateModal />
            </div>

            {/* Result count */}
            {items?.total !== undefined && (
                <p className='text-muted small mb-2'>
                    {items.total} feature{items.total !== 1 ? 's' : ''} found
                    {search && <> for <strong>"{search}"</strong></>}
                </p>
            )}

            <Table hover responsive style={{ '--bs-table-cell-padding-y': '0.85rem' }}>
                <thead className='table-light'>
                    <tr>
                        <th>Title</th>
                        <th style={{ width: '90px' }}>Active</th>
                        <th className='text-center' style={{ width: '160px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.data?.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>
                                <Form.Check
                                    type='switch'
                                    checked={item.active == 1}
                                    onChange={() => {/* toggle logic */}}
                                />
                            </td>
                            <td className='text-end text-nowrap'>
                                <ShowModal id={item.id} />{' '}
                                <EditModal id={item.id} />{' '}
                                <DeleteModal id={item.id} title={item.title} />
                            </td>
                        </tr>
                    ))}
                    {items?.data?.length === 0 && (
                        <tr>
                            <td colSpan='3' className='text-center text-muted py-4'>
                                No features found{search && <> matching <strong>"{search}"</strong></>}.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <PaginatorLink store={{ setValue: (k, v) => k === 'url' && setPaginatorUrl(v) }} items={items} />
        </div>
    )
}

export default DataTable
```

**5. Create Modals** (Create, Edit, Delete, Show)

Follow the modal patterns from existing CRUD sections (Programmes, Banners, Stations). Key points:
- Create: `store.emptyData()` on show, POST on submit
- Edit: GET to populate, **POST with `_method=PUT` override on submit** (for FormData compatibility)
  ```javascript
  const formData = new FormData()
  formData.append('_method', 'PUT')  // Add this first!
  formData.append('field1', form.field1)
  if (file) formData.append('file', file)
  axios({ method: 'post', url: `${apiBase}/resource/${id}`, data: formData })
  ```
- Delete: Confirmation checkbox required
- Show: Display-only view
- **Route definition**: Keep as `Route::put()` — Laravel converts `_method=PUT` internally

**6. Create HtmlForm Component**

Use the Card-based layout pattern with sections:
```javascript
// backend/src/pages/Administration/Features/components/HtmlForm.js
import { Card, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ isLoading }) => (
    <div className='d-flex flex-column gap-3'>
        <Card>
            <Card.Header className='fw-semibold'>
                <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2 text-secondary' />
                Basic Info
            </Card.Header>
            <Card.Body className='d-flex flex-column gap-2'>
                {/* FormInput components here */}
            </Card.Body>
        </Card>
    </div>
)

export default HtmlForm
```

**7. Add Route in Backend Router**
```javascript
// backend/src/index.js
import Features from './pages/Administration/Features'

const router = createBrowserRouter([
    // ... existing routes
    {
        path: '/administration/features',
        element: <ProtectedRoute><Features /></ProtectedRoute>
    }
])
```

**8. Add to Navigation Menu** (if needed)

---

### Optional: Add Features

#### A. Ordering (Nested Set)
1. Add NodeTrait to Model
2. Add ordering() method to Controller
3. Create Ordering.js component
4. Add Order column to DataTable
5. Add route: `GET /features/ordering/{feature}`

#### B. Image/File Upload
1. Add migration columns: `thumbnail_filename`, `banner_filename`, etc.
2. Use CommonService in Controller/Service for file handling
3. Add file input to HtmlForm with replace pattern
4. Display image in Show modal with Figure component

#### C. Public API Endpoint
1. Create Frontend Controller in `Frontend/FeatureController.php`
2. Add to `routes/frontend.php`
3. Return filtered (active only) data

---

### Checklist

- [ ] Migration created and migrated
- [ ] Model created with traits (LogsActivity, NodeTrait if needed)
- [ ] Controller created with all CRUD methods
- [ ] Service created with business logic
- [ ] Routes added to api.php
- [ ] React store created
- [ ] Index page created
- [ ] DataTable component created
- [ ] Create, Edit, Delete, Show modals created
- [ ] HtmlForm component created
- [ ] Route added to backend router
- [ ] Navigation menu updated (if needed)
- [ ] Test all CRUD operations
- [ ] Test validation errors
- [ ] Test pagination and search
