# Backend Administration System - User Manual

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [System Navigation](#system-navigation)
5. [Administration Modules](#administration-modules)
6. [Common Operations](#common-operations)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## 1. Introduction

### System Overview

The Backend Administration System is a comprehensive React-based web application designed to manage organizational content, users, and digital assets efficiently.

### Key Features

- **🔐 Role Management**: Control user permissions and access levels
- **👥 User Management**: Manage system users and their profiles  
- **📁 Directory System**: Organize departments and staff hierarchically
- **📝 Content Management**: Create and manage articles, banners, and media
- **🎨 Responsive UI**: Works on desktop, tablet, and mobile devices
- **⚡ Real-time Updates**: Instant data refresh and validation

### Technology Stack

- **Frontend**: React with React Router
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Framework**: React Bootstrap
- **Icons**: Font Awesome
- **Backend API**: Laravel

---

## 2. Getting Started

### System Requirements

| Component | Requirement |
|-----------|-------------|
| Web Browser | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Internet | Stable broadband (minimum 5 Mbps) |
| Screen Resolution | Minimum 1024x768px (1920x1080 recommended) |
| JavaScript | Must be enabled |

### Accessing the System

```
https://your-domain.com/backend
```

⚠️ **Important**: Always use HTTPS for secure access. Never share your login credentials.

### First Time Setup

1. Receive credentials from system administrator
2. Access the login page and enter credentials
3. Change your password on first login (recommended)
4. Update profile information in Account section
5. Explore available modules based on your role

---

## 3. Authentication

### 3.1 Sign In Process

1. Navigate to the login page
2. Enter your email address
3. Enter your password
4. Click **Sign In** button

### 3.2 Password Requirements

For security, passwords must meet these criteria:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### 3.3 Password Recovery

If you forget your password:

1. Click "Forgot Password?" on login page
2. Enter your registered email address
3. Check your email for reset link
4. Click link and create new password
5. Log in with new password

💡 **Tip**: Password reset links expire after 60 minutes.

### 3.4 Session Management

- **Auto-logout**: Sessions expire after 2 hours of inactivity
- **Token Refresh**: Active sessions automatically extended
- **Unauthorized Access**: Invalid tokens redirect to login

### 3.5 Sign Out

1. Click profile icon in top navigation
2. Select "Sign Out" from dropdown
3. Confirm logout if prompted

⚠️ **Security Best Practice**: Always sign out when using shared computers.

---

## 4. System Navigation

### 4.1 Layout Overview

| Area | Location | Purpose |
|------|----------|---------|
| Top Navigation Bar | Top of page | Logo, user account, sign out |
| Breadcrumb Menu | Below navigation | Current location path |
| Main Content Area | Center | Primary workspace |
| Footer | Bottom | Copyright and links |

### 4.2 Breadcrumb Navigation

Example: `🏠 Home > Administration > Directory Management > IT Department`

Click any breadcrumb link to navigate back to that level.

### 4.3 Dashboard Types

- **System Dashboard**: System health and statistics
- **Admin Dashboard**: User activities and content summaries
- **Manager Dashboard**: Department-specific metrics
- **User Dashboard**: Personal tasks and notifications

### 4.4 Maintenance Mode

During maintenance, you'll see a maintenance page. Contact IT department for estimated downtime.

---

## 5. Administration Modules

### 5.1 Role Management

**Access**: System Administrators Only

**Features**:
- Create custom roles with specific permissions
- Assign multiple permissions to each role
- Edit role names and permission sets
- Delete unused roles

**Creating a Role**:
1. Click `+ New` button
2. Enter role name
3. Select permissions
4. Click `Submit`

⚠️ **Warning**: Deleting a role affects all assigned users. Reassign users before deletion.

---

### 5.2 User Management

**Access**: Administrators and Managers

**User Information**:
- Full name and email address
- Department and position
- Assigned roles and permissions
- Account status (active/inactive)
- Last login information

**Creating a New User**:
1. Click `+ New` button
2. Fill in user details:
   - Name
   - Email address (used for login)
   - Department
   - Position/Title
3. Assign role(s)
4. Set initial password
5. Click `Submit`

**Editing User**:
1. Locate user in table
2. Click `✏ Edit` button
3. Update fields
4. Click `Update`

💡 **Best Practice**: Regularly review user accounts and deactivate unused accounts.

---

### 5.3 Directory Management

**Access**: Administrators and Department Managers

**Directory Types**:
- **📁 Folder**: Represents departments or organizational units
- **👤 Spreadsheet**: Represents individual staff members

**Hierarchical Structure**:
```
Root
├── IT Department (Folder)
│   ├── Development Team (Folder)
│   │   ├── John Doe (Staff)
│   │   └── Jane Smith (Staff)
│   └── Support Team (Folder)
└── HR Department (Folder)
```

**Creating a Department**:
1. Navigate to parent location
2. Click `+ New`
3. Select "Department" type
4. Enter department name
5. Click `Submit`

**Adding Staff Information**:
1. Navigate to department
2. Click `+ New`
3. Select "Staff" type
4. Fill in details:
   - Upload photo
   - Full name
   - Job title/Occupation
   - Email address
   - Phone number
   - Social media links (Facebook, Twitter, Instagram)
   - Office address
5. Click `Submit`

**Ordering Items**:
- Click **⬆ Up** to move item higher
- Click **⬇ Down** to move item lower

✓ **Tip**: Use breadcrumb navigation to quickly jump between department levels.

---

### 5.4 Article Management

**Access**: Content Managers and Administrators

**Features**:
- Article categories (hierarchical)
- Rich text editor
- Featured images
- Publication status
- Publication scheduling

**Creating an Article**:
1. Navigate to Articles section
2. Select parent category (if applicable)
3. Click `+ New`
4. Enter article information:
   - Title
   - Content (using rich text editor)
   - Upload featured image
   - Set publication status
   - Select publication date
5. Preview article (optional)
6. Click `Publish`

**Rich Text Editor Features**:
- **Bold, Italic, Underline**: Text formatting
- **Headers**: H1, H2, H3, etc.
- **Lists**: Bulleted and numbered
- **Links**: Insert hyperlinks
- **Images**: Embed images
- **Code**: Code blocks

📝 **Note**: Articles can be saved as drafts for work-in-progress content.

---

### 5.5 Banner Management

**Access**: Content Managers and Administrators

**Banner Properties**:
- Banner image (recommended: 1920x600px)
- Title and description
- Link URL
- Display order
- Active/inactive status

**Creating a Banner**:
1. Click `+ New`
2. Upload banner image
3. Enter banner details
4. Set link URL (optional)
5. Set display status
6. Click `Submit`

⚠️ **Image Guidelines**: Use optimized images under 500KB for best performance.

---

### 5.6 Programme Management

**Access**: Content Managers and Administrators

Manage TV and radio programme schedules and information.

---

### 5.7 Video Management

**Access**: Content Managers and Administrators

Upload and manage video content for the website.

---

### 5.8 Asset Management

**Access**: Administrators

Manage digital assets including images, documents, and files.

---

### 5.9 VOD Management

**Access**: Content Managers and Administrators

Manage Video On Demand content and categories.

---

## 6. Common Operations

### 6.1 CRUD Operations

All modules follow standard data management pattern:

| Operation | Button | Description |
|-----------|--------|-------------|
| **Create** | `+ New` | Add new item |
| **Read** | `👁 View` | View item details |
| **Update** | `✏ Edit` | Modify existing item |
| **Delete** | `🗑 Delete` | Remove item permanently |

### 6.2 Data Tables

Features:
- **Sorting**: Click column headers to sort
- **Search**: Use search box to filter
- **Pagination**: Navigate through pages
- **Actions**: Quick access buttons per row

### 6.3 Forms and Modals

Create and edit operations open in modal windows:

1. Fill in required fields (marked with *)
2. Upload files if needed
3. Review entered data
4. Click Submit or Cancel

💡 **Tip**: Form validation highlights errors before submission.

### 6.4 File Uploads

When uploading files:
- Click "Choose File" or drag-and-drop
- Check file size limits
- Supported formats: JPG, PNG, GIF, PDF, DOCX
- Wait for upload completion

### 6.5 Pagination

Navigation controls:
- **First**: Jump to first page
- **Previous**: Go back one page
- **Numbers**: Jump to specific page
- **Next**: Advance one page
- **Last**: Jump to last page

---

## 7. Troubleshooting

### 7.1 Login Problems

| Problem | Solution |
|---------|----------|
| Forgot password | Click "Forgot Password?" and follow reset instructions |
| Account locked | Contact system administrator |
| Invalid credentials | Verify email and password, check Caps Lock |

### 7.2 Session Issues

| Problem | Solution |
|---------|----------|
| Session expired | Sign in again |
| Logged out unexpectedly | Check internet connection, sign in again |
| Token invalid | Clear browser cache and sign in again |

### 7.3 Upload Issues

| Problem | Solution |
|---------|----------|
| File too large | Compress file or use smaller file |
| Upload fails | Check internet connection and try again |
| Invalid file type | Check supported formats |

### 7.4 Display Issues

| Problem | Solution |
|---------|----------|
| Page not loading | Refresh browser (F5 or Ctrl+R) |
| Layout broken | Clear browser cache |
| Images not showing | Check internet connection |

### 7.5 Permission Issues

| Problem | Solution |
|---------|----------|
| Cannot access module | Contact administrator for permissions |
| Cannot edit content | Verify your role has edit permissions |
| Cannot delete items | Check if you have delete permissions |

---

## 8. FAQ

### Q: How do I change my password?

A: Go to Account settings, select the password tab, enter current password and new password, then submit.

### Q: Can I access the system on mobile?

A: Yes, the system is responsive and works on tablets and smartphones.

### Q: How do I recover a deleted item?

A: Deleted items cannot be recovered. Contact your administrator if you accidentally deleted important content.

### Q: What if I encounter an error?

A: Take a screenshot of the error, note what you were doing, and contact your system administrator.

### Q: How often is data backed up?

A: Contact your IT department for backup schedules and procedures.

### Q: Can I export data?

A: Export functionality depends on your role and the specific module. Contact your administrator for export requests.

### Q: How do I request new features?

A: Submit feature requests through your department manager or directly to the IT department.

### Q: Is training available?

A: Contact your HR or IT department for training sessions and materials.

---

## Contact & Support

For technical support or questions:

- **System Administrator**: [admin@your-domain.com]
- **IT Support**: [support@your-domain.com]
- **Help Desk**: [Phone Number]

---

## Document Information

- **Version**: 1.0
- **Last Updated**: January 2025
- **Maintained By**: IT Department

---

© 2025 Your Organization. All rights reserved.
