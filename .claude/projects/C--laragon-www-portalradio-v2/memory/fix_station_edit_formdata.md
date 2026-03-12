---
name: Station Edit FormData Fix (2026-03-12)
description: Fixed Edit modal not saving any fields due to FormData + PUT request issue
type: feedback
---

## Issue
Edit modal wasn't saving ANY fields (title, description, URLs, etc.), while Create modal worked fine.

## Root Cause
FormData with file uploads requires POST method + `_method` override for Laravel to properly handle PUT/PATCH requests.

## Solution
In `backend/src/pages/Administration/Stations/modals/Edit.js`:
1. Added `formData.append('_method', 'PUT')` at start of form data construction
2. Changed axios method from `put` to `post`
3. This allows Laravel to receive FormData with proper method override

## Code Pattern
```javascript
const formData = new FormData()
formData.append('_method', 'PUT')  // Add this first
// ... append other fields ...
axios({ method: 'post', url: `${apiBase}/stations/${id}`, data: formData })
```

## Reference
This is standard Laravel FormData handling when:
- Using file uploads (multipart/form-data)
- Need to support PUT/PATCH methods
- Cannot send native PUT with FormData directly

Apply same pattern to any other modals that update with file uploads.
