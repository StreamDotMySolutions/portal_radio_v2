# Boilerplate Project

A full-stack web application boilerplate with Laravel API backend and multiple React frontends.

## Project Structure

This project consists of multiple components:

- **API** (`api/`) - Laravel 10 REST API backend
- **Backend** (`backend/`) - React admin dashboard
- **Frontend** (`frontend/`) - React public frontend
- **RTM Website** (`rtm.gov.my/`) - React-based RTM government website
- **Nginx** (`nginx/`) - Web server configuration
- **Scripts** (`scripts/`) - Database and utility scripts

## Prerequisites

Before installing this project, ensure you have the following installed on your system:

- **PHP** >= 8.1
- **Composer** (PHP dependency manager)
- **Node.js** >= 16.x
- **npm** or **yarn**
- **MySQL** or **MariaDB**
- **Nginx** (optional, for production)

## Installation Guide

### 1. Clone the Repository

```bash
git clone git@github.com:StreamDotMySolutions/boilerplate.git
cd boilerplate
```

### 2. API Setup (Laravel Backend)

Navigate to the API directory and install dependencies:

```bash
cd api
composer install
```

#### Environment Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Generate application key:
```bash
php artisan key:generate
```

3. Configure your database settings in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. Run database migrations:
```bash
php artisan migrate
```

5. Seed the database (optional):
```bash
php artisan db:seed
```

6. Create storage symlink:
```bash
php artisan storage:link
```

7. Set proper permissions:
```bash
chmod -R 775 storage bootstrap/cache
```

#### Start the API Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### 3. Backend Setup (Admin Dashboard)

Navigate to the backend directory:

```bash
cd ../backend
npm install
```

#### Environment Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Configure the API URL in `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Start the Backend Server

```bash
npm start
```

The admin dashboard will be available at `http://localhost:3000`

### 4. Frontend Setup (Public Website)

Navigate to the frontend directory:

```bash
cd ../frontend
npm install
```

#### Environment Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Configure the API URL in `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Start the Frontend Server

```bash
npm start
```

The public website will be available at `http://localhost:3001`

### 5. RTM Website Setup

Navigate to the RTM website directory:

```bash
cd ../rtm.gov.my
npm install
```

#### Environment Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Configure the API URL in `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Start the RTM Website Server

```bash
npm start
```

The RTM website will be available at `http://localhost:3002`

## Production Deployment

### Building for Production

#### API (Laravel)
```bash
cd api
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### React Applications
```bash
# Backend
cd backend
npm run build

# Frontend
cd ../frontend
npm run build

# RTM Website
cd ../rtm.gov.my
npm run build
```

### Nginx Configuration

Use the provided Nginx configuration files in the `nginx/` directory:

- `nginx.conf` - Main Nginx configuration
- `default` - Default server configuration
- `server.conf` - Server-specific settings
- `www.rtm.gov.my.conf` - RTM website configuration

### SSL Certificates

SSL certificates and keys are stored in:
- `nginx/certs/` - Certificate files
- `nginx/keys/` - Private key files

## Database

### Import Database

If you have a database dump, you can import it using:

```bash
mysql -u username -p database_name < scripts/your_database_file.sql
```

### Available Scripts

- `scripts/directory.bat` - Directory management script
- `scripts/rtm.bat` - RTM-specific script
- `scripts/data.sql` - Sample data
- `scripts/rtm_portal_2024-12-12.sql` - RTM portal database dump

## Application Routes & Paths

### Backend Admin Dashboard (`/backend`)

The admin dashboard uses a base path of `/backend` and includes the following routes:

#### Authentication Routes
- `/backend/sign-in` - Admin login page
- `/backend/sign-out` - Logout page
- `/backend/unauthorized` - Unauthorized access page

#### Protected Admin Routes (Requires Authentication)
- `/backend/` or `/backend/home` - Dashboard home
- `/backend/account` - User account management
- `/backend/dashboard` - Main dashboard

#### Administration Routes (Admin Role Required)
- `/backend/administration/roles` - Role management
- `/backend/administration/users` - User management
- `/backend/administration/articles/{parentId}` - Article management by parent
- `/backend/administration/articles-data/{parentId}` - Article data management
- `/backend/administration/banners` - Banner management
- `/backend/administration/programmes` - Programme management
- `/backend/administration/videos` - Video management
- `/backend/administration/directories/{parentId}` - Directory management
- `/backend/administration/assets/{parentId}` - Asset management
- `/backend/administration/vods/{parentId}` - VOD management

### Frontend Public Website (`/frontend`)

The public frontend application includes:

#### Public Routes
- `/` - Home page (HomeLayout)
- `/contents/{id}` - Content display page

### RTM Government Website (`/`)

The RTM website uses the root path and includes:

#### Public Routes
- `/` - RTM home page
- `/contents/{id}` - Content pages
- `/listings/{id}` - Content listing pages

#### Directory & Staff Routes
- `/directories` - Directory listing
- `/directories/{id}` - Specific directory view
- `/directories/{id}/show` - Staff profile display
- `/directories/search/{query}` - Directory search results

#### Error Handling
- `*` - 404 error page for all unmatched routes

## Development Workflow

1. Start the API server: `cd api && php artisan serve`
2. Start the backend: `cd backend && npm start`
3. Start the frontend: `cd frontend && npm start`
4. Start the RTM website: `cd rtm.gov.my && npm start`

## Application Access URLs

When running in development mode:

- **API Server**: `http://localhost:8000`
- **Backend Admin**: `http://localhost:3000/backend`
- **Frontend Public**: `http://localhost:3001`
- **RTM Website**: `http://localhost:3002`

### Important Notes on Routing

1. **Backend Admin Dashboard**: Uses `/backend` basename, so all routes are prefixed with `/backend`
2. **Frontend Public**: Uses root basename `/` for public access
3. **RTM Website**: Uses root basename `/` and includes comprehensive directory/staff management
4. **Protected Routes**: Backend admin routes require authentication and appropriate role permissions
5. **Dynamic Routes**: Many routes include dynamic parameters (`:id`, `:parentId`, `:query`) for content management

## Key Features

- **Laravel 10** with Sanctum authentication
- **React 18** with modern hooks and state management
- **Bootstrap 5** for responsive design
- **FontAwesome** icons
- **Zustand** for state management
- **Axios** for API communication
- **Spatie packages** for permissions and activity logging
- **Video.js** for media playback
- **React Quill** for rich text editing

## API Documentation

The API provides comprehensive RESTful endpoints organized into different functional areas. All backend API endpoints require authentication via Laravel Sanctum tokens (except for public endpoints).

### Base URL
- **Development**: `http://localhost:8000/api`
- **Production**: `https://yourdomain.com/api`

### Authentication

#### Public Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/register` | Register a new user | `name`, `email`, `password` |
| `POST` | `/login` | Authenticate user and get token | `email`, `password` |
| `POST` | `/password/email` | Send password reset email | `email` |
| `POST` | `/password/reset` | Reset password with token | `email`, `password`, `password_confirmation`, `token` |

#### Protected Authentication Endpoints

| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| `GET` | `/account` | Get current user account info | `Authorization: Bearer {token}` |
| `PUT` | `/account` | Update current user account | `Authorization: Bearer {token}` |
| `POST` | `/logout` | Logout and revoke token | `Authorization: Bearer {token}` |

### User Management (Admin Only)

All user management endpoints require `admin` role.

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/users` | List all users | - |
| `GET` | `/users/roles` | Get available roles | - |
| `POST` | `/users` | Create new user | `name`, `email`, `password`, `role` |
| `GET` | `/users/{id}` | Get specific user | - |
| `PUT` | `/users/{id}` | Update user | `name`, `email`, `role` |
| `DELETE` | `/users/{id}` | Delete user | - |

### Role Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/roles` | List all roles | - |
| `POST` | `/roles` | Create new role | `name`, `permissions` |
| `GET` | `/roles/{id}` | Get specific role | - |
| `PUT` | `/roles/{id}` | Update role | `name`, `permissions` |
| `DELETE` | `/roles/{id}` | Delete role | - |

### Article Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/articles/node/{parentId}` | Get articles by parent node | - |
| `POST` | `/articles` | Create new article | `title`, `content`, `parent_id` |
| `GET` | `/articles/{id}` | Get specific article | - |
| `PUT` | `/articles/{id}` | Update article | `title`, `content` |
| `DELETE` | `/articles/{id}` | Delete article | - |
| `GET` | `/articles/ordering/{id}` | Get article ordering options | - |

#### Article Content Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/article-contents/{id}` | Get article content | - |
| `POST` | `/article-contents` | Create article content | `article_id`, `content` |
| `PUT` | `/article-contents/{id}` | Update article content | `content` |
| `DELETE` | `/article-contents/{id}` | Delete article content | - |

#### Article Assets Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/article-assets/{articleId}` | Get article assets | - |
| `POST` | `/article-assets` | Upload article asset | `article_id`, `file` |
| `DELETE` | `/article-assets/{id}` | Delete article asset | - |

#### Article Gallery Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/article-galleries/{id}` | Get article gallery | - |
| `POST` | `/article-galleries` | Create gallery item | `article_id`, `image` |
| `DELETE` | `/article-galleries/{id}` | Delete gallery item | - |

#### Article Data Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/article-data/node/{parentId}` | Get article data by parent | - |
| `GET` | `/article-data/ordering/{id}` | Get data ordering options | - |
| `POST` | `/article-data` | Create article data | `article_id`, `data` |
| `GET` | `/article-data/{id}` | Get specific article data | - |
| `PUT` | `/article-data/{id}` | Update article data | `data` |
| `DELETE` | `/article-data/{id}` | Delete article data | - |

#### Article Settings

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/article-settings/{articleId}` | Get article settings | - |
| `PUT` | `/article-settings/{articleId}` | Update article settings | `settings` |

### Banner Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/banners` | List all banners | - |
| `GET` | `/banners/{id}` | Get specific banner | - |
| `POST` | `/banners` | Create new banner | `title`, `image`, `link` |
| `PUT` | `/banners/{id}` | Update banner | `title`, `image`, `link` |
| `DELETE` | `/banners/{id}` | Delete banner | - |
| `GET` | `/banners/ordering/{id}` | Get banner ordering options | - |

### Programme Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/programmes` | List all programmes | - |
| `GET` | `/programmes/{id}` | Get specific programme | - |
| `POST` | `/programmes` | Create new programme | `title`, `description`, `schedule` |
| `PUT` | `/programmes/{id}` | Update programme | `title`, `description`, `schedule` |
| `DELETE` | `/programmes/{id}` | Delete programme | - |
| `GET` | `/programmes/ordering/{id}` | Get programme ordering options | - |

### Video Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/videos` | List all videos | - |
| `GET` | `/videos/{id}` | Get specific video | - |
| `POST` | `/videos` | Create new video | `title`, `url`, `thumbnail` |
| `PUT` | `/videos/{id}` | Update video | `title`, `url`, `thumbnail` |
| `DELETE` | `/videos/{id}` | Delete video | - |
| `GET` | `/videos/ordering/{id}` | Get video ordering options | - |

### Asset Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/assets/node/{parentId}` | Get assets by parent node | - |
| `GET` | `/assets` | List all assets | - |
| `GET` | `/assets/{id}` | Get specific asset | - |
| `POST` | `/assets` | Upload new asset | `file`, `parent_id` |
| `PUT` | `/assets/{id}` | Update asset | `name`, `description` |
| `DELETE` | `/assets/{id}` | Delete asset | - |
| `GET` | `/assets/ordering/{id}` | Get asset ordering options | - |

### VOD (Video on Demand) Management (Admin Only)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/vods/node/{parentId}` | Get VODs by parent node | - |
| `GET` | `/vods` | List all VODs | - |
| `GET` | `/vods/list-videos` | List available videos for VOD | - |
| `GET` | `/vods/{id}` | Get specific VOD | - |
| `POST` | `/vods` | Create new VOD | `title`, `video_url`, `description` |
| `PUT` | `/vods/{id}` | Update VOD | `title`, `video_url`, `description` |
| `DELETE` | `/vods/{id}` | Delete VOD | - |
| `GET` | `/vods/ordering/{id}` | Get VOD ordering options | - |

### Directory Management (Public)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/directories` | Get directory structure | - |
| `GET` | `/directories/{id}` | Get directory contents | - |
| `GET` | `/directories/{id}/show` | Show directory details | - |
| `POST` | `/directories/{id}/create` | Create subdirectory | `name` |
| `PUT` | `/directories/{id}/update` | Update directory | `name` |
| `DELETE` | `/directories/{id}/delete` | Delete directory | - |
| `POST` | `/directories/{root}` | Create root directory | `name` |
| `GET` | `/directories/ordering/{id}` | Get directory ordering options | - |

### Frontend API Endpoints (Public)

These endpoints are prefixed with `/frontend/` and are used by the public-facing applications.

#### Content Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/frontend/articles/{id}` | Get article content |
| `GET` | `/frontend/listings/{id}` | Get article listings |
| `GET` | `/frontend/show/{id}` | Show article details |
| `GET` | `/frontend/article-galleries/{dataId}` | Get article gallery |

#### Home Page Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/frontend/home-footer` | Get footer content |
| `GET` | `/frontend/home-menu` | Get main menu |
| `GET` | `/frontend/home-menu-1` | Get menu level 1 |
| `GET` | `/frontend/home-menu-2` | Get menu level 2 |
| `GET` | `/frontend/home-banners` | Get home page banners |
| `GET` | `/frontend/home-programmes` | Get home page programmes |
| `GET` | `/frontend/home-videos` | Get home page videos |

#### Directory Search

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/frontend/directories/search` | Search directories | `query`, `filters` |
| `GET` | `/frontend/directories/{id}` | Get directory by ID | - |
| `GET` | `/frontend/directories/{id}/show` | Show directory details | - |

### Response Format

All API responses follow a consistent JSON format:

#### Success Response
```json
{
  "message": "success",
  "data": {
    // Response data here
  }
}
```

#### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### Authentication

The API uses Laravel Sanctum for authentication. Include the bearer token in the Authorization header:

```
Authorization: Bearer {your-token-here}
```

### Rate Limiting

API endpoints are rate-limited to prevent abuse. Default limits:
- Authenticated requests: 60 per minute
- Guest requests: 30 per minute

### CORS

Cross-Origin Resource Sharing (CORS) is configured to allow requests from the frontend applications. Check `config/cors.php` for current settings.

## Troubleshooting

### Common Issues

1. **Permission denied errors**: Ensure proper file permissions on `storage/` and `bootstrap/cache/`
2. **Database connection errors**: Verify database credentials in `.env`
3. **CORS issues**: Check API CORS configuration in `config/cors.php`
4. **Node modules issues**: Delete `node_modules/` and run `npm install` again

### Logs

- Laravel logs: `api/storage/logs/laravel.log`
- Backend logs: `backend/storage/logs/`
- Nginx logs: Check your system's Nginx log directory

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This boilerplate includes fixes for whitespace carousel issues and ensures all links are working properly.
