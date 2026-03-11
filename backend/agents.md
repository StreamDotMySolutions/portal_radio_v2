# Backend Admin Panel — Architecture & Style Guide

## Overview

React 18 admin panel (SPA) served at `/backend`. Communicates exclusively with the Laravel API at `/api`.
All data flows through Axios. Auth via Bearer token stored in localStorage.

---

## Directory Structure

```
backend/src/
├── index.js                          — Router setup, FontAwesome library init
├── pages/
│   ├── store.js                      — Global Zustand store (form data, errors, refresh flag)
│   ├── Home/                         — Dashboard (role-based rendering)
│   ├── Account/                      — Logged-in user profile (tabbed)
│   │   ├── stores/AccountStore.js
│   │   └── components/
│   ├── Auth/
│   │   ├── stores/AuthStore.js       — Zustand persist store (isAuthenticated, user)
│   │   └── components/
│   │       ├── SignIn/
│   │       └── SignOut/
│   └── Administration/
│       ├── Roles/
│       ├── Users/
│       ├── Articles/                 — Nested set tree, parent navigation
│       ├── ArticlesData/             — Rich content editor (WYSIWYG, HTML, Gallery)
│       ├── Banners/
│       ├── Programmes/
│       ├── Videos/
│       ├── Directories/              — Staff directory (nested set)
│       ├── Assets/                   — File management (nested set)
│       └── Vods/                     — Video-on-Demand (nested set)
├── layouts/
│   ├── Layout.js                     — Role-based layout switcher
│   └── components/
│       ├── AdminLayout/              — TopNavBar + Outlet + Footer
│       └── UserLayout/
├── components/
│   ├── BreadCrumb.js
│   ├── Pagination.js
│   └── DisplayMessage/               — Toast-like success/error messages
└── libs/
    ├── axios.js                      — Axios instance with interceptors
    ├── ProtectedRoute.js             — Auth guard
    ├── FormInput.js                  — Reusable form input components
    ├── Logout.js
    ├── BreadCrumb.js
    ├── CreateButton.js
    ├── PaginatorLink.js
    └── TipTap.js                     — Rich text editor
```

---

## Routing

**Entry point**: `src/index.js`
- `BrowserRouter` with `basename="/backend"`
- All admin routes wrapped in `<ProtectedRoute>`

```
/sign-in                              — Login (public)
/sign-out                             — Logout (public)
/unauthorized                         — 403 page (public)
/                                     — Home dashboard (protected)
/home                                 — Home dashboard (protected)
/account                              — Account settings (protected)
/administration/roles                 — Role management
/administration/users                 — User management
/administration/articles/:parentId    — Article tree (0 = root)
/administration/articles-data/:parentId
/administration/banners
/administration/programmes
/administration/videos
/administration/directories/:parentId
/administration/assets/:parentId
/administration/vods/:parentId
*                                     — 404 error page
```

**Protected Route**:
```javascript
// Checks useAuthStore().isAuthenticated
// Redirects to /sign-in if false
```

**Layout selection** (Layout.js):
```javascript
switch (store.user.role) {
    case 'admin': return <AdminLayout />;
    case 'user':  return <UserLayout />;
}
```

---

## Auth Flow

### Sign In
1. POST `/login` with email + password
2. Store `token` in `localStorage.setItem('token', token)`
3. `useAuthStore.setState({ isAuthenticated: true, user: response.data.user })`
4. Redirect to `/`

### Sign Out
1. Navigate to `/sign-out`
2. POST `/logout`
3. `localStorage.removeItem('token')`
4. `useAuthStore.logout()` → sets `isAuthenticated: false`
5. Redirect to `/sign-in`

### AuthStore (Zustand, persisted to localStorage)
```javascript
{
    isAuthenticated: false,
    user: {},
    login(),   // sets isAuthenticated: true
    logout(),  // sets isAuthenticated: false
}
```

### 401/403 Handling
Axios response interceptor auto-redirects to `/backend/sign-in`.
No manual handling needed in page components.

---

## Axios Configuration

**Always import from `src/libs/axios.js` — never create a new instance.**

```javascript
// Request interceptor: injects Bearer token
config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
config.headers['Accept'] = 'application/json';

// Response interceptor: handles 401/403/419
if (error.response.status === 401 || 403 || 419) {
    window.location.href = '/backend/sign-in';
}
```

### Standard GET (DataTable)
```javascript
useEffect(() => {
    axios({
        method: 'get',
        url: store.getValue('url') ?? url
    })
    .then(response => {
        setItems(response.data.roles); // .banners, .articles, etc.
        store.setValue('refresh', false);
    })
    .catch(error => console.warn(error))
}, [store.getValue('url'), store.getValue('refresh')])
```

### Standard POST/PUT (Create/Edit Modal)
```javascript
const formData = new FormData();
appendFormData(formData, [
    { key: 'name', value: store.getValue('name') },
    { key: '_method', value: 'put' }, // for updates
]);

axios({ method: 'post', url: `${store.url}/roles`, data: formData })
    .then(() => {
        store.setValue('refresh', true); // triggers DataTable refetch
        handleClose();
    })
    .catch(error => {
        if (error.response?.status == 422) {
            store.setValue('errors', error.response.data.errors);
        }
    });
```

**`_method` override values**: `post`, `put`, `patch`, `delete`

---

## State Management (Zustand)

### Global Store (`src/pages/store.js`)

Used for **all form data and UI flags** across CRUD modals.

```javascript
{
    url: process.env.REACT_APP_BACKEND_URL,   // API base
    server: process.env.REACT_APP_SERVER_URL, // File server base
    refresh: false,        // Set true after CUD → triggers DataTable useEffect
    errors: null,          // Laravel 422 validation errors
    data: {},              // { fieldName: { value: ... } }

    setValue(fieldName, value),
    getValue(fieldName),    // returns null if not set (safe)
    setError(fieldName, error),
    emptyData(),           // clears all data + errors
}
```

### Data Flow

```
User input
  → store.setValue(fieldName, value)
  → FormInput reads store.getValue(fieldName)
  → On submit: collect values → FormData → API call
  → On success: store.setValue('refresh', true)
  → DataTable useEffect re-runs → fresh data
```

### Rule: Always call `store.emptyData()` before opening a modal.

---

## Component Patterns

### CRUD Feature Structure

Every CRUD section follows this exact structure:

```
Administration/Roles/
├── index.js              — BreadCrumb + DataTable
├── components/
│   ├── DataTable.js      — List table + Create/Edit/Delete buttons
│   └── HtmlForm.js       — Form fields only (no logic)
└── modals/
    ├── Create.js         — Modal with store.emptyData() + POST
    ├── Edit.js           — Modal with GET (populate store) + PUT
    └── Delete.js         — Modal with confirmation checkbox + DELETE
```

### Index Page
```javascript
const Index = () => {
    const items = [
        { url: '/', label: <Badge>Home</Badge> },
        { url: '', label: 'Role Management' }
    ];
    return (
        <>
            <BreadCrumb items={items} />
            <DataTable />
        </>
    );
};
```

### DataTable
```javascript
const DataTable = () => {
    const store = useStore();
    const [items, setItems] = useState([]);
    const url = `${store.url}/roles`;

    useEffect(() => {
        axios.get(store.getValue('url') ?? url)
            .then(response => {
                setItems(response.data.roles);
                store.setValue('refresh', false);
            });
    }, [store.getValue('url'), store.getValue('refresh')]);

    return (
        <>
            <CreateModal />
            <Table>
                {items?.data?.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                            <EditModal id={item.id} />
                            <DeleteModal id={item.id} />
                        </td>
                    </tr>
                ))}
            </Table>
            <PaginatorLink store={store} items={items} />
        </>
    );
};
```

### Create Modal
```javascript
const CreateModal = () => {
    const store = useStore();
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleShowClick = () => { store.emptyData(); setShow(true); };
    const handleClose = () => setShow(false);

    const handleSubmitClick = () => {
        setIsLoading(true);
        const formData = new FormData();
        appendFormData(formData, [
            { key: 'name', value: store.getValue('name') },
        ]);
        axios({ method: 'post', url: `${store.url}/roles`, data: formData })
            .then(() => { store.setValue('refresh', true); handleClose(); })
            .catch(error => {
                setIsLoading(false);
                if (error.response?.status == 422)
                    store.setValue('errors', error.response.data.errors);
            });
    };

    return (
        <>
            <Button onClick={handleShowClick}>Create</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body><HtmlForm isLoading={isLoading} /></Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmitClick} disabled={isLoading}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
```

### Edit Modal
- On open: `axios.get(url/id)` → `store.setValue(field, value)` for each field
- On submit: same as Create but with `_method: 'put'`

### Delete Modal
- Requires acknowledgment checkbox before enabling submit
- Uses `_method: 'delete'`

---

## HtmlForm UI Standard

Every `HtmlForm.js` **must** use Bootstrap `Card` components to group related fields into labelled sections. This is the project-wide standard, applied consistently across all CRUD features.

### Structure

```jsx
import { Card, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HtmlForm = ({ form, onChange, errors, isLoading }) => (
    <div className='d-flex flex-column gap-3'>

        <Card>
            <Card.Header className='fw-semibold'>
                <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2 text-secondary' />
                Section Title
            </Card.Header>
            <Card.Body className='d-flex flex-column gap-2'>
                <InputGroup>
                    <InputGroup.Text style={{ width: '80px' }}>Label</InputGroup.Text>
                    <Form.Control
                        placeholder='...'
                        value={form.field}
                        readOnly={isLoading}
                        isInvalid={!!errors?.field}
                        onChange={(e) => onChange('field')(e.target.value)}
                    />
                    {errors?.field && (
                        <Form.Control.Feedback type='invalid'>{errors.field[0]}</Form.Control.Feedback>
                    )}
                </InputGroup>
            </Card.Body>
        </Card>

    </div>
)
```

### Rules

- **Outer wrapper**: `<div className='d-flex flex-column gap-3'>` — provides consistent vertical spacing between cards
- **Card header**: always `fw-semibold` + a FontAwesome icon with `text-secondary` + a short section label
- **Card body with multiple inputs**: use `className='d-flex flex-column gap-2'` on `Card.Body` instead of `<br>` or margin utilities
- **Card body with one input or image**: use plain `Card.Body` (no flex gap needed)
- **InputGroup label width**: `style={{ width: '80px' }}` for short labels, `style={{ width: '110px' }}` for longer ones — keep consistent within a card
- **File inputs**: use `fa-upload` icon on `InputGroup.Text`, not `fa-image`
- **Descriptive text**: when a field needs explanation, add `<p className='text-muted small mb-2'>...</p>` at the top of `Card.Body`
- **Empty/warning states**: render an `<Alert variant='warning' className='mt-2 py-2 mb-0 small'>` inside the relevant card body, not as a standalone block

### Grouping guidelines

| Content | Card |
|---|---|
| Text inputs (name, title, email) | Group related fields in one **Basic Info** card |
| Role / dropdown select | Include in the same card as the identity fields |
| Password + confirmation | Separate **Password** card |
| Schedule / date pickers / active toggle | **Publishing** card |
| File / image upload | Dedicated image card (**Poster Image**, **Banner Image**, etc.) |
| HLS video select from VOD Library | **HLS Video** card with empty-state `Alert` + link to VOD |

### Empty-state link pattern (VOD / nested-set selects)

When a `<Form.Select>` depends on data from another section (e.g. VOD Library), disable it when empty and show a contextual warning with a React Router `Link`:

```jsx
import { Link } from 'react-router-dom'

<Form.Select disabled={isLoading || !videos?.length} ...>
    ...
</Form.Select>
{!isLoading && videos?.length === 0 && (
    <Alert variant='warning' className='mt-2 py-2 mb-0 small'>
        <FontAwesomeIcon icon={['fas', 'triangle-exclamation']} className='me-1' />
        No videos found in the VOD Library.{' '}
        <Link to='/administration/vods/0'>Go to VOD Management</Link> and add a video first.
    </Alert>
)}
```

### Image replace pattern

When editing an existing record that has an image, show the current image with a **Replace** button. Only show the file input when replacing:

```jsx
{filename && !replacing ? (
    <>
        <Figure className='w-100 mb-2'>
            <Figure.Image className='w-100 rounded' src={`${serverUrl}/storage/{folder}/${filename}`} alt='...' />
        </Figure>
        <Button size='sm' variant='outline-secondary' onClick={() => setReplacing(true)}>
            <FontAwesomeIcon icon={['fas', 'arrows-rotate']} className='me-1' />
            Replace image
        </Button>
    </>
) : (
    <>
        <InputGroup>
            <InputGroup.Text><FontAwesomeIcon icon={['fas', 'upload']} /></InputGroup.Text>
            <Form.Control type='file' accept='image/*' onChange={(e) => onFileChange(e.target.files[0])} />
        </InputGroup>
        {filename && (
            <Button size='sm' variant='link' className='ps-0 mt-1 text-secondary' onClick={handleCancelReplace}>
                Cancel replace
            </Button>
        )}
    </>
)}
```

### Reference implementations

| Feature | File |
|---|---|
| Videos | `src/pages/Administration/Videos/components/HtmlForm.js` |
| Users | `src/pages/Administration/Users/components/HtmlForm.js` |
| Banners | `src/pages/Administration/Banners/components/HtmlForm.js` |
| Programmes | `src/pages/Administration/Programmes/components/HtmlForm.js` |

---

## Form Input Components (`src/libs/FormInput.js`)

All inputs are connected directly to the global Zustand store.
**Never use raw `<input>` or `<Form.Control>` in modals — always use these components.**

| Component | Usage |
|-----------|-------|
| `InputText` | Text, email, password, number fields |
| `InputTextarea` | Multi-line text |
| `InputSelect` | Dropdown (options: `[{ id, name }]`) |
| `InputFile` | File picker with MIME type filter |
| `InputRadio` | Radio group (options: `[{ label, value }]`) |
| `InputCheckbox` | Single checkbox |
| `InputRadioBoolean` | Yes/No pair |
| `InputDate` | Date picker |
| `TextEditor` | React-Quill WYSIWYG |
| `TextEditorWithEdit` | Quill + HTML mode toggle |

**Standard Props**: `fieldName`, `placeholder`, `icon`, `isLoading`

```javascript
<InputText
    fieldName='name'
    placeholder='Role name'
    icon={<FontAwesomeIcon icon={['fas', 'pencil']} />}
    isLoading={isLoading}
/>
```

### appendFormData Helper
```javascript
appendFormData(formData, [
    { key: 'name', value: store.getValue('name') },
    { key: 'email', value: store.getValue('email') },
]);
// Skips null/undefined values automatically
```

---

## Validation Error Handling

Laravel returns `422` with:
```json
{ "errors": { "name": ["The name field is required."] } }
```

**In catch block:**
```javascript
if (error.response?.status == 422) {
    store.setValue('errors', error.response.data.errors);
}
```

**FormInput components display errors automatically** next to each field via `store.getValue('errors')`.

---

## Pagination

```javascript
<PaginatorLink store={store} items={items} />
```

Clicking a page link sets `store.setValue('url', pageUrl)` → triggers DataTable `useEffect`.

Expected API response shape:
```json
{
    "data": [...],
    "links": [
        { "label": "Previous", "url": null, "active": false },
        { "label": "1", "url": "http://...", "active": true },
        { "label": "Next", "url": "http://...", "active": false }
    ]
}
```

---

## Hierarchical (NestedSet) Pages

Used for: **Articles, Directories, Assets, Vods**

- Root level: `parentId = 0`
- Children level: `parentId = {id}`
- Navigation: clicking a folder navigates to `/administration/articles/{id}`

**Fetching children:**
```javascript
const url = `${store.url}/articles/node/${parentId}`;
```

**Breadcrumb construction:**
```javascript
const items = [
    { url: '/', label: <Badge>Home</Badge> },
    { url: '/administration/articles/0', label: 'Articles' },
];
ancestors.forEach(a => items.push({ url: `/administration/articles/${a.id}`, label: a.title }));
```

**Folder vs File icon:**
```javascript
{item.descendants?.length > 0
    ? <FontAwesomeIcon icon={['fas', 'folder']} className='text-warning' />
    : <FontAwesomeIcon icon={['fas', 'file']} className='text-secondary' />
}
```

---

## Ordering Pattern

Used for: Banners, Articles, Programmes, etc.

```javascript
const Ordering = ({ id, direction, disabled = false }) => {
    const store = useStore();
    const handleClick = () => {
        axios(`${store.url}/banners/ordering/${id}?direction=${direction}`)
            .then(() => store.setValue('refresh', true));
    };
    return <Button onClick={handleClick} disabled={disabled}>
        <FontAwesomeIcon icon={['fas', `caret-${direction}`]} />
    </Button>;
};

// In DataTable:
<Ordering id={item.id} direction='up'   disabled={index === 0} />
<Ordering id={item.id} direction='down' disabled={index === items.data.length - 1} />
```

---

## File/Image Display Pattern

```javascript
// Display stored image
<Figure.Image src={`${store.server}/storage/banners/${store.getValue('filename')}`} />

// Conditional display
{store.getValue('filename') && (
    <Figure>
        <Figure.Image src={`${store.server}/storage/${folder}/${store.getValue('filename')}`} />
    </Figure>
)}
```

---

## Active Status Display Pattern

```javascript
{item.active == 1
    ? <FontAwesomeIcon icon={['fas', 'check']} className='text-success' />
    : <FontAwesomeIcon icon={['fas', 'stop']}  className='text-danger' />
}
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Feature folders | PascalCase | `Roles/`, `Articles/` |
| Component files | PascalCase | `DataTable.js`, `HtmlForm.js` |
| Modal files | PascalCase | `Create.js`, `Edit.js`, `Delete.js` |
| Entry files | lowercase | `index.js`, `store.js` |
| Store files | PascalCase + Store | `AuthStore.js`, `AccountStore.js` |
| Event handlers | `handle*` prefix | `handleShowClick`, `handleSubmitClick` |
| State setters | `set*` prefix | `setShow`, `setIsLoading` |
| Modal visibility | `show` / `setShow` | `const [show, setShow] = useState(false)` |
| Loading flag | `isLoading` | `const [isLoading, setIsLoading] = useState(false)` |
| API base | `store.url` | `${store.url}/roles` |
| File server | `store.server` | `${store.server}/storage/banners/...` |

---

## Environment Variables

```
REACT_APP_BACKEND_URL=http://localhost:8000/api   — API base URL (→ store.url)
REACT_APP_SERVER_URL=http://localhost:8000         — File server URL (→ store.server)
REACT_APP_MODE=production                          — Controls maintenance mode
```

---

## Key Rules (Do / Don't)

### Do
- Import axios from `src/libs/axios.js`
- Call `store.emptyData()` before opening any modal
- Use `store.setValue('refresh', true)` after every successful CUD operation
- Use FormInput components for all form fields
- Use `appendFormData()` helper for building FormData
- Handle 422 errors by calling `store.setValue('errors', ...)`
- Follow the Index → DataTable → Modals → HtmlForm structure for every CRUD feature

### Don't
- Don't put business logic in components — keep them as thin as possible
- Don't create new Axios instances — always use the configured one from libs
- Don't use raw `<input>` elements — use FormInput components
- Don't fetch data outside of `useEffect` with proper dependency arrays
- Don't forget `store.emptyData()` before opening Create modal

---

## Packages

| Package | Purpose |
|---------|---------|
| `react` ^18.2.0 | UI framework |
| `react-router-dom` ^6.12.1 | Client-side routing |
| `zustand` ^4.3.8 | State management |
| `axios` ^1.4.0 | HTTP client |
| `bootstrap` ^5.3.0 | CSS framework |
| `react-bootstrap` ^2.9.0 | Bootstrap React components |
| `react-quill` ^2.0.0 | WYSIWYG editor |
| `video.js` ^8.21.0 | HLS video player |
| `@fortawesome/react-fontawesome` ^0.2.0 | Icons |
| `js-cookie` ^3.0.5 | Cookie management |

---

## Creating a New CRUD Feature (Step-by-Step)

This guide assumes the Laravel API is already built. Focus on React admin panel only.

### Step 1: Create Store

**File**: `src/pages/Administration/Features/store.js`

```javascript
import { create } from 'zustand'

const useFeaturesStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),

    search: '',
    setSearch: (search) => set({ search, paginatorUrl: null }),

    // Optional: for category/type filtering
    // filter: '',
    // setFilter: (filter) => set({ filter, paginatorUrl: null }),
}))

export default useFeaturesStore
```

**What it does:**
- `refreshKey`: Incremented after CREATE/UPDATE/DELETE to refetch data
- `paginatorUrl`: Set when user clicks pagination links
- `search`: User's search input (debounced in DataTable)

---

### Step 2: Create Index Page

**File**: `src/pages/Administration/Features/index.js`

```javascript
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BreadCrumb from '../../../libs/BreadCrumb'
import DataTable from './components/DataTable'

const Index = () => {
    const items = [
        {
            url: '/',
            label: <Badge><FontAwesomeIcon icon={['fas', 'home']} /></Badge>
        },
        {
            url: '/administration/features',
            label: 'Feature Management'
        },
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

**Key points:**
- Always include home link in breadcrumb
- Wrap navigation link in Badge if icon-only
- Single component: render BreadCrumb + DataTable

---

### Step 3: Create DataTable Component

**File**: `src/pages/Administration/Features/components/DataTable.js`

```javascript
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

    // Debounce search input (400ms idle)
    useEffect(() => {
        const timer = setTimeout(() => setSearch(query), 400)
        return () => clearTimeout(timer)
    }, [query, setSearch])

    // Build effective URL with search/filter
    const effectiveUrl = paginatorUrl
        ?? (search ? `${baseUrl}?search=${encodeURIComponent(search)}` : baseUrl)

    // Fetch data
    useEffect(() => {
        axios({ method: 'get', url: effectiveUrl })
            .then((response) => setItems(response.data.features))
            .catch((error) => console.warn(error))
    }, [refreshKey, paginatorUrl, search, effectiveUrl])

    // Handle toggle active
    const handleToggleActive = (itemId) => {
        setItems(prev => ({
            ...prev,
            data: prev.data.map(item =>
                item.id === itemId ? { ...item, active: item.active == 1 ? 0 : 1 } : item
            )
        }))

        axios({ method: 'patch', url: `${apiBase}/features/${itemId}/toggle` })
            .catch(() => {
                setItems(prev => ({
                    ...prev,
                    data: prev.data.map(item =>
                        item.id === itemId ? { ...item, active: item.active == 1 ? 0 : 1 } : item
                    )
                }))
            })
    }

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

            {/* Table */}
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
                                    onChange={() => handleToggleActive(item.id)}
                                />
                            </td>
                            <td className='text-end text-nowrap'>
                                <ShowModal id={item.id} />
                                <EditModal id={item.id} />
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

            {/* Pagination */}
            <PaginatorLink
                store={{ setValue: (k, v) => k === 'url' && setPaginatorUrl(v) }}
                items={items}
            />
        </div>
    )
}

export default DataTable
```

---

### Step 4: Create Modals

#### Create Modal

**File**: `src/pages/Administration/Features/modals/Create.js`

```javascript
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFeaturesStore from '../store'
import HtmlForm from '../components/HtmlForm'
import { appendFormData } from '../../../../libs/FormInput'

const Create = () => {
    const store = useStore()
    const setRefresh = useFeaturesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleShowClick = () => {
        store.emptyData() // CRITICAL: always clear store before opening modal
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)

        const formData = new FormData()
        appendFormData(formData, [
            { key: 'title', value: store.getValue('title') },
            { key: 'description', value: store.getValue('description') },
            { key: 'active', value: store.getValue('active') || false },
        ])

        axios({ method: 'post', url: `${store.url}/features`, data: formData })
            .then(() => {
                setRefresh() // Trigger DataTable refetch
                handleClose()
            })
            .catch((error) => {
                setIsLoading(false)
                if (error.response?.status == 422) {
                    store.setValue('errors', error.response.data.errors)
                }
            })
    }

    return (
        <>
            <Button
                onClick={handleShowClick}
                className='ms-auto'
            >
                <FontAwesomeIcon icon={['fas', 'plus']} className='me-1' />
                Create
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Feature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HtmlForm isLoading={isLoading} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose} disabled={isLoading}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={handleSubmitClick} disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Create
```

#### Edit Modal

**File**: `src/pages/Administration/Features/modals/Edit.js`

```javascript
import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFeaturesStore from '../store'
import HtmlForm from '../components/HtmlForm'
import { appendFormData } from '../../../../libs/FormInput'

const Edit = ({ id }) => {
    const store = useStore()
    const setRefresh = useFeaturesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleShowClick = () => {
        setIsLoading(true)

        // GET to populate form
        axios({ method: 'get', url: `${store.url}/features/${id}` })
            .then((response) => {
                const { feature } = response.data
                store.setValue('title', feature.title)
                store.setValue('description', feature.description)
                store.setValue('active', feature.active == 1)
                setShow(true)
            })
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)

        const formData = new FormData()
        appendFormData(formData, [
            { key: '_method', value: 'put' },
            { key: 'title', value: store.getValue('title') },
            { key: 'description', value: store.getValue('description') },
            { key: 'active', value: store.getValue('active') || false },
        ])

        axios({ method: 'post', url: `${store.url}/features/${id}`, data: formData })
            .then(() => {
                setRefresh()
                handleClose()
            })
            .catch((error) => {
                setIsLoading(false)
                if (error.response?.status == 422) {
                    store.setValue('errors', error.response.data.errors)
                }
            })
    }

    return (
        <>
            <Button
                size='sm'
                variant='outline-primary'
                onClick={handleShowClick}
            >
                <FontAwesomeIcon icon={['fas', 'pencil']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Feature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HtmlForm isLoading={isLoading} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose} disabled={isLoading}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={handleSubmitClick} disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Edit
```

#### Delete Modal

**File**: `src/pages/Administration/Features/modals/Delete.js`

```javascript
import React, { useState } from 'react'
import { Button, Modal, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useFeaturesStore from '../store'

const Delete = ({ id, title }) => {
    const store = useStore()
    const setRefresh = useFeaturesStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleShowClick = () => {
        setConfirmed(false)
        setShow(true)
    }

    const handleClose = () => setShow(false)

    const handleDeleteClick = () => {
        setIsLoading(true)

        axios({ method: 'delete', url: `${store.url}/features/${id}` })
            .then(() => {
                setRefresh()
                handleClose()
            })
            .catch(() => setIsLoading(false))
    }

    return (
        <>
            <Button
                size='sm'
                variant='outline-danger'
                onClick={handleShowClick}
            >
                <FontAwesomeIcon icon={['fas', 'trash']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Feature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant='danger' className='mb-3'>
                        <FontAwesomeIcon icon={['fas', 'exclamation-triangle']} className='me-2' />
                        This action cannot be undone.
                    </Alert>
                    <p>Are you sure you want to delete <strong>{title}</strong>?</p>
                    <Form.Check
                        type='checkbox'
                        label='Yes, delete this feature'
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant='danger'
                        onClick={handleDeleteClick}
                        disabled={!confirmed || isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Delete
```

#### Show Modal

**File**: `src/pages/Administration/Features/modals/Show.js`

```javascript
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'

const Show = ({ id }) => {
    const store = useStore()

    const [show, setShow] = useState(false)
    const [feature, setFeature] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleShowClick = () => {
        setIsLoading(true)

        axios({ method: 'get', url: `${store.url}/features/${id}` })
            .then((response) => {
                setFeature(response.data.feature)
                setShow(true)
            })
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    return (
        <>
            <Button
                size='sm'
                variant='outline-info'
                onClick={handleShowClick}
            >
                <FontAwesomeIcon icon={['fas', 'eye']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>View Feature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {feature && (
                        <>
                            <p><strong>Title:</strong> {feature.title}</p>
                            <p><strong>Description:</strong> {feature.description || '—'}</p>
                            <p><strong>Status:</strong> {feature.active == 1 ? 'Active' : 'Inactive'}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Show
```

---

### Step 5: Create HtmlForm Component

**File**: `src/pages/Administration/Features/components/HtmlForm.js`

Use the Card-based layout pattern with FormInput components:

```javascript
import { Card, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useStore from '../../../store'

const HtmlForm = ({ isLoading }) => {
    const store = useStore()

    const handleInputChange = (fieldName) => (value) => {
        store.setValue(fieldName, value)
    }

    return (
        <div className='d-flex flex-column gap-3'>
            <Card>
                <Card.Header className='fw-semibold'>
                    <FontAwesomeIcon icon={['fas', 'pencil']} className='me-2 text-secondary' />
                    Basic Info
                </Card.Header>
                <Card.Body className='d-flex flex-column gap-2'>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '80px' }}>Title</InputGroup.Text>
                        <Form.Control
                            placeholder='Feature title'
                            value={store.getValue('title') || ''}
                            readOnly={isLoading}
                            isInvalid={!!store.getValue('errors')?.title}
                            onChange={(e) => handleInputChange('title')(e.target.value)}
                        />
                        {store.getValue('errors')?.title && (
                            <Form.Control.Feedback type='invalid'>
                                {store.getValue('errors').title[0]}
                            </Form.Control.Feedback>
                        )}
                    </InputGroup>

                    <InputGroup>
                        <InputGroup.Text style={{ width: '80px' }}>Description</InputGroup.Text>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Feature description'
                            value={store.getValue('description') || ''}
                            readOnly={isLoading}
                            onChange={(e) => handleInputChange('description')(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Check
                        type='switch'
                        label='Active'
                        checked={store.getValue('active') || false}
                        disabled={isLoading}
                        onChange={(e) => handleInputChange('active')(e.target.checked)}
                    />
                </Card.Body>
            </Card>
        </div>
    )
}

export default HtmlForm
```

---

### Step 6: Add Route to Backend Router

**File**: `src/index.js`

```javascript
import Features from './pages/Administration/Features'

// Inside BrowserRouter routes:
{
    path: '/administration/features',
    element: <ProtectedRoute><Features.default /></ProtectedRoute>
}
```

---

### Step 7: Add to Navigation (Optional)

If you have a navigation menu/sidebar, add:

```javascript
<NavLink to='/administration/features'>
    <FontAwesomeIcon icon={['fas', 'gears']} className='me-2' />
    Features
</NavLink>
```

---

### Complete File Structure

```
backend/src/pages/Administration/Features/
├── index.js                    (Index page with BreadCrumb + DataTable)
├── store.js                    (Zustand store)
├── components/
│   ├── DataTable.js            (Main list table)
│   └── HtmlForm.js             (Reusable form with Card sections)
└── modals/
    ├── Create.js               (Create modal)
    ├── Edit.js                 (Edit modal)
    ├── Delete.js               (Delete with confirmation)
    └── Show.js                 (Read-only view)
```

---

### Testing Checklist

- [ ] Navigate to `/administration/features` — DataTable loads
- [ ] Click "Create" — Modal opens with empty form
- [ ] Fill form, submit — Feature created, DataTable refreshes
- [ ] Click Edit on a row — Modal opens with populated data
- [ ] Modify, submit — Feature updated
- [ ] Click Delete on a row — Confirmation modal appears
- [ ] Check confirmation, submit — Feature deleted
- [ ] Click Show on a row — Read-only modal displays data
- [ ] Search by title — Results filter correctly
- [ ] Click pagination links — DataTable refetches correct page
- [ ] Toggle active switch — Optimistic update + API call
- [ ] Test validation errors from API (422)

---

### Advanced: Add Ordering (Optional)

If API supports `GET /features/ordering/{id}?direction=up|down`:

1. Create `src/pages/Administration/Features/components/Ordering.js` (see backend/agents.md ordering pattern)
2. Add Order column to DataTable
3. Import and use Ordering component with up/down disabled at boundaries
