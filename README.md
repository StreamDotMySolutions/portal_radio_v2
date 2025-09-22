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

## Development Workflow

1. Start the API server: `cd api && php artisan serve`
2. Start the backend: `cd backend && npm start`
3. Start the frontend: `cd frontend && npm start`
4. Start the RTM website: `cd rtm.gov.my && npm start`

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

## API Endpoints

The API provides RESTful endpoints for:
- Authentication (`/api/auth/*`)
- User management (`/api/users/*`)
- Directory management (`/api/directories/*`)
- File uploads (`/api/uploads/*`)

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
