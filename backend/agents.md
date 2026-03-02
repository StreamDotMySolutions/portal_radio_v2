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
