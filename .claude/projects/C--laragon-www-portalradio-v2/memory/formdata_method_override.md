---
name: FormData _method Override Pattern (2026-03-12)
description: Correct pattern for sending file uploads with PUT/PATCH requests in Laravel
type: feedback
---

## Problem
FormData (multipart/form-data) cannot directly use PUT or PATCH HTTP methods. Trying to send `axios({ method: 'put', data: formData })` results in routing issues.

## Solution
Use **POST method with `_method` hidden field override**:

### Frontend (React)
```javascript
const formData = new FormData()
formData.append('_method', 'PUT')  // Add this first!
formData.append('username', form.username)
formData.append('email', form.email)
if (form.password) formData.append('password', form.password)
if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
if (bannerFile) formData.append('banner', bannerFile)

// Send as POST (not PUT!)
axios({ method: 'post', url: `${apiBase}/resource/{id}`, data: formData })
```

### Backend (Laravel)
```php
// Route definition uses PUT (not POST!)
Route::put('/resource/{resource}', [ResourceController::class, 'update']);

// Laravel automatically converts _method=PUT to proper routing
// Controller update method receives the request normally
```

## How It Works
1. Frontend sends: **POST request** with FormData
2. FormData includes: `_method=PUT` field
3. Laravel middleware intercepts `_method` field
4. Route matches: **PUT** endpoint
5. Works with file uploads! ✓

## Applied To
- Station updates: `/api/stations/{id}`
- ChatUser updates: `/api/chat-users/{id}`
- Any update with file uploads

## Key Points
- ✓ Add `_method` field **first** in FormData
- ✓ Use `method: 'post'` in axios call
- ✓ Keep route definition as `PUT` or `PATCH`
- ✓ Works with file uploads (multipart)
- ✓ Standard Laravel pattern for form method spoofing

## Don't Do This
❌ `axios({ method: 'put', data: formData })` — causes 405 errors
❌ `Route::post('/resource/{id}')` — breaks the pattern
❌ Forget to add `_method` field — request routes incorrectly
