---
name: Footer Admin Management System
description: Complete implementation of database-driven footer content management with admin panel
type: project
---

# Footer Admin Management System Implementation

## Overview
Fully implemented a database-driven footer content management system that replaces hardcoded footer content. Admins can now edit all footer text and links from `/administration/footer` admin panel. Frontend fetches content from `GET /api/frontend/home-footer` with fallback to hardcoded defaults.

## Database Layer

### Migration
**File**: `api/database/migrations/2026_03_13_200000_create_footer_links_table.php`
- Creates `footer_links` table with columns:
  - `id`, `user_id` (FK to users)
  - `section` (string 20: 'quick' or 'network')
  - `title`, `url` (string 100, 500)
  - `is_external` (boolean), `active` (boolean), `ordering` (int)
  - timestamps

### Model
**File**: `api/app/Models/FooterLink.php`
- Uses LogsActivity trait for audit trail
- Casts: `is_external`, `active` → boolean; dates → `datetime:d/m/Y H:i`
- Relationship: `belongsTo(User::class)`

## Seeders

### SettingSeeder (Updated)
**File**: `api/database/seeders/SettingSeeder.php`
- Added 5 new settings (footer_*):
  - `footer_description` - About RTM text
  - `footer_phone` - Contact phone
  - `footer_email` - Contact email
  - `footer_address` - Physical address
  - `footer_copyright` - Copyright notice

### FooterLinkSeeder (New)
**File**: `api/database/seeders/FooterLinkSeeder.php`
- Seeds 6 footer links:
  - 3 Quick Links (Utama, Senarai Radio, Chat) - internal
  - 3 Network Links (Portal RTM, Berita RTM, RTM Klik) - external
- Each link has ordering and active status

## API Layer

### Backend Controllers

**FooterLinkController** (`api/app/Http/Controllers/Backend/FooterLinkController.php`)
- `index()` - List with section, search, active filters; ordered by section+ordering
- `show()` - Show single link
- `store()` - Create link; auto-set user_id, ordering = max+1 within section
- `update()` - Update link
- `delete()` - Delete link
- `toggle()` - Flip active status
- `ordering()` - Swap with adjacent sibling in same section (direction: up/down)
- All methods invalidate `frontend.footer` cache on write

### Frontend Controller (Rewritten)
**File**: `api/app/Http/Controllers/Frontend/FooterController.php`
- Replaced legacy Article lookup with:
  - Fetches 5 footer_* settings from Setting::get()
  - Fetches active quick_links and network_links from FooterLink
  - Orders by section, then ordering
  - Caches as `frontend.footer` for 3600 seconds

### API Routes
**File**: `api/routes/api.php` (added to auth:sanctum role:admin group)
```php
Route::get('/footer-links', [FooterLinkController::class, 'index']);
Route::get('/footer-links/{footerLink}', [FooterLinkController::class, 'show']);
Route::post('/footer-links', [FooterLinkController::class, 'store']);
Route::put('/footer-links/{footerLink}', [FooterLinkController::class, 'update']);
Route::delete('/footer-links/{footerLink}', [FooterLinkController::class, 'delete']);
Route::patch('/footer-links/{footerLink}/toggle', [FooterLinkController::class, 'toggle']);
Route::get('/footer-links/ordering/{footerLink}', [FooterLinkController::class, 'ordering']);
```

## React Admin Panel

### Store (Zustand)
**File**: `backend/src/pages/Administration/Footer/store.js`
- `refreshKey` - Trigger refetch
- `paginatorUrl` - Paginator navigation
- `search` - Search query (debounced 400ms)
- `sectionFilter` - Filter by 'quick'/'network'/''
- `activeFilter` - Filter by active status

### Components

**HtmlForm** (`components/HtmlForm.js`)
- Form fields: section (select), title, url, is_external (checkbox), active (checkbox)
- Reusable for Create and Edit modals

**DataTable** (`components/DataTable.js`)
- Toolbar: section filter + search + create button
- Table: title, url, section badge, type icon, active toggle, actions
- Actions: ordering buttons (up/down), show, edit, delete
- Pagination support

**Ordering** (`components/Ordering.js`)
- Up/down buttons to swap with adjacent sibling in same section
- Calls `GET /api/footer-links/ordering/{id}?direction=up|down`

### Modals

**Create** (`modals/Create.js`)
- JSON POST to `/api/footer-links`
- Auto-calculates ordering within section
- Form validation: section, title, url required

**Edit** (`modals/Edit.js`)
- GET to load, PUT to update
- Same form structure as Create

**Show** (`modals/Show.js`)
- Read-only view of all link details
- Shows section, type (internal/external), active status

**Delete** (`modals/Delete.js`)
- Confirm dialog before DELETE
- Removes link from database

### Main Page
**File**: `backend/src/pages/Administration/Footer/index.js`
- Two-section layout:
  1. **Footer Text Settings**: inline-edit table for footer_* keys (same pattern as Settings page)
  2. **Footer Links**: DataTable with full CRUD
- Breadcrumb navigation
- Error handling and loading states

## Frontend Integration

### Footer Component (Updated)
**File**: `frontend/portalradio_v2/components/Footer.js`
- `useEffect` fetches from `GET {NEXT_PUBLIC_API_URL}/home-footer`
- Renders dynamic `quick_links` and `network_links` arrays
- Internal links (is_external=false): no target/rel
- External links (is_external=true): `target="_blank" rel="noopener noreferrer"`
- Falls back to hardcoded `defaultFooter` if API unavailable
- Active link highlight: `isActive(link.url)` unchanged

## Router Registration

**File**: `backend/src/index.js`
- Import: `import FooterManagement from './pages/Administration/Footer'`
- Route: `<Route path="/administration/footer" element={<FooterManagement />} />`

## NavBar Integration

**File**: `backend/src/layouts/components/AdminLayout/TopNavBar.js`
- Added Footer link to Homepage dropdown:
  ```jsx
  <NavDropdown.Item as={NavLink} to="/administration/footer">
    <FontAwesomeIcon icon={['fas', 'link']} /> Footer
  </NavDropdown.Item>
  ```

## Data Flow

```
Database (footer_links table + settings table)
       ↓
Backend FooterLinkController + FooterController
       ↓
API Routes (/api/footer-links, /api/home-footer)
       ↓
React Admin Panel (edit/create/delete/reorder links)  OR  Frontend Footer Component (fetch + render)
```

## Testing Checklist

✓ Migration creates footer_links table
✓ Seeders populate settings and links
✓ `GET /api/footer-links` returns paginated list with filters
✓ `POST /api/footer-links` creates link
✓ `PUT /api/footer-links/{id}` updates link
✓ `DELETE /api/footer-links/{id}` removes link
✓ `PATCH /api/footer-links/{id}/toggle` toggles active
✓ `GET /api/footer-links/ordering/{id}?direction=up|down` reorders within section
✓ `GET /api/frontend/home-footer` returns all footer data
✓ Admin page loads at `/administration/footer`
✓ Text settings: view, edit inline
✓ Links DataTable: section filter, search, sort by section
✓ Links CRUD: create, show, edit, delete modals work
✓ Links ordering: up/down buttons reorder within section
✓ Links toggle: active switch works
✓ Frontend Footer: fetches dynamic data on load
✓ Frontend Footer: falls back to defaults if API unavailable
✓ Cache: invalidated on every write (`Cache::forget('frontend.footer')`)
✓ Footer NavBar: link visible in Homepage dropdown

## Cache Invalidation

Cache key: `frontend.footer`
TTL: 3600 seconds (1 hour)
Invalidated on:
- `FooterLinkController::store()` - after create
- `FooterLinkController::update()` - after update
- `FooterLinkController::delete()` - after delete
- `FooterLinkController::toggle()` - after toggle
- `FooterLinkController::ordering()` - after reorder
- Settings saved via PUT `/api/settings/{key}` (footer_* keys)

Note: Settings PUT is handled by SettingController, not FooterLinkController. If needed, add cache invalidation to SettingController::update() for footer_* keys.

## Future Enhancements

- Add ordering/reordering to Settings page as well
- Bulk actions (enable/disable multiple links)
- Link grouping/categorization
- Scheduled publication dates for links
- Link tracking/analytics
