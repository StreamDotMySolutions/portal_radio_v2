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

## Ubuntu Server Setup (Production Installation)

This section provides a complete guide for setting up the boilerplate project on a fresh Ubuntu server from scratch.

### System Requirements

- **Ubuntu Server**: 20.04 LTS or 22.04 LTS
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB
- **Network**: Internet connection for package downloads

### Step 1: Update System Packages

```bash
# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### Step 2: Install Nginx Web Server

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx

# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
```

### Step 3: Install MySQL Database Server

```bash
# Install MySQL Server
sudo apt install -y mysql-server

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

**MySQL Secure Installation Steps:**
1. Set root password (choose a strong password)
2. Remove anonymous users: **Y**
3. Disallow root login remotely: **Y**
4. Remove test database: **Y**
5. Reload privilege tables: **Y**

```bash
# Create database and user for the application
sudo mysql -u root -p

# In MySQL console, run:
CREATE DATABASE rtm_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'rtm_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON rtm_portal.* TO 'rtm_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Install PHP 8.2 and Required Extensions

```bash
# Add PHP repository
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP 8.2 and essential extensions
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath php8.2-json php8.2-tokenizer php8.2-fileinfo php8.2-intl php8.2-dom php8.2-simplexml php8.2-xmlwriter php8.2-xmlreader

# Start and enable PHP-FPM
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm

# Check PHP version
php -v

# Check installed PHP extensions
php -m
```

**Required PHP Extensions for Laravel:**
- `php8.2-mysql` - MySQL database support
- `php8.2-zip` - ZIP archive support
- `php8.2-gd` - Image processing
- `php8.2-mbstring` - Multibyte string support
- `php8.2-curl` - HTTP client support
- `php8.2-xml` - XML processing
- `php8.2-bcmath` - Arbitrary precision mathematics
- `php8.2-json` - JSON support
- `php8.2-tokenizer` - Tokenizer support
- `php8.2-fileinfo` - File information
- `php8.2-intl` - Internationalization
- `php8.2-dom` - DOM manipulation
- `php8.2-simplexml` - Simple XML support

### Step 5: Install Composer (PHP Dependency Manager)

```bash
# Download and install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Make Composer executable
sudo chmod +x /usr/local/bin/composer

# Verify Composer installation
composer --version
```

### Step 6: Install Node.js and npm

```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install Yarn (optional, alternative to npm)
sudo npm install -g yarn
```

### Step 7: Configure PHP for Production

```bash
# Edit PHP-FPM configuration
sudo nano /etc/php/8.2/fpm/php.ini
```

**Important PHP Configuration Changes:**
```ini
# Memory and execution limits
memory_limit = 512M
max_execution_time = 300
max_input_time = 300

# File upload settings
upload_max_filesize = 256M
post_max_size = 256M
max_file_uploads = 20

# Session settings
session.gc_maxlifetime = 1440
session.cookie_httponly = 1
session.cookie_secure = 1

# Security settings
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

# Error reporting (disable in production)
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

# Timezone
date.timezone = Asia/Kuala_Lumpur
```

```bash
# Edit PHP-FPM pool configuration
sudo nano /etc/php/8.2/fpm/pool.d/www.conf
```

**PHP-FPM Pool Configuration:**
```ini
# Process management
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500

# Security
security.limit_extensions = .php
```

```bash
# Restart PHP-FPM to apply changes
sudo systemctl restart php8.2-fpm
```

### Step 8: Create Application Directory Structure

```bash
# Create web directory
sudo mkdir -p /var/www/rtm_portal_v2

# Set ownership to www-data
sudo chown -R www-data:www-data /var/www/rtm_portal_v2

# Set proper permissions
sudo chmod -R 755 /var/www/rtm_portal_v2

# Create SSL certificate directories
sudo mkdir -p /etc/nginx/certs
sudo mkdir -p /etc/nginx/keys
```

### Step 9: Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow MySQL (only if needed for remote connections)
# sudo ufw allow 3306/tcp

# Check firewall status
sudo ufw status
```

### Step 10: Install Additional Security Tools

```bash
# Install Fail2Ban for intrusion prevention
sudo apt install -y fail2ban

# Create Fail2Ban configuration for Nginx
sudo nano /etc/fail2ban/jail.local
```

**Fail2Ban Configuration:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
# Start and enable Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### Step 11: SSL Certificate Setup

#### Option A: Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d www.rtm.gov.my -d rtm.gov.my

# Test automatic renewal
sudo certbot renew --dry-run
```

#### Option B: Custom SSL Certificate

```bash
# If you have custom SSL certificates, copy them to:
sudo cp your-certificate.pem /etc/nginx/certs/FullChain.pem
sudo cp your-private-key.key /etc/nginx/keys/private.key

# Set proper permissions
sudo chmod 644 /etc/nginx/certs/FullChain.pem
sudo chmod 600 /etc/nginx/keys/private.key
sudo chown root:root /etc/nginx/certs/FullChain.pem
sudo chown root:root /etc/nginx/keys/private.key
```

### Step 12: System Optimization

```bash
# Increase file descriptor limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Configure kernel parameters for better performance
sudo nano /etc/sysctl.conf
```

**Add to sysctl.conf:**
```ini
# Network performance
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 65536 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# File system
fs.file-max = 2097152
```

```bash
# Apply sysctl changes
sudo sysctl -p
```

### Step 13: Create Deployment User

```bash
# Create deployment user
sudo adduser deploy

# Add deploy user to www-data group
sudo usermod -a -G www-data deploy

# Add deploy user to sudoers (optional, for deployment scripts)
sudo usermod -a -G sudo deploy

# Set up SSH key authentication for deploy user
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh

# Copy your public key to authorized_keys
# sudo -u deploy nano /home/deploy/.ssh/authorized_keys
# sudo -u deploy chmod 600 /home/deploy/.ssh/authorized_keys
```

### Step 14: Install Process Manager (PM2 for Node.js - Optional)

```bash
# Install PM2 globally (if you need to run Node.js processes)
sudo npm install -g pm2

# Configure PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### Step 15: System Monitoring Setup

```bash
# Install system monitoring tools
sudo apt install -y htop iotop nethogs

# Install log rotation for application logs
sudo nano /etc/logrotate.d/laravel
```

**Laravel Log Rotation Configuration:**
```
/var/www/rtm_portal_v2/api/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        sudo systemctl reload php8.2-fpm
    endscript
}
```

### Step 16: Final System Verification

```bash
# Check all services are running
sudo systemctl status nginx
sudo systemctl status mysql
sudo systemctl status php8.2-fpm

# Check PHP configuration
php -i | grep -E "(memory_limit|upload_max_filesize|post_max_size)"

# Check MySQL connection
mysql -u rtm_user -p -e "SELECT VERSION();"

# Check disk space
df -h

# Check memory usage
free -h

# Check network connectivity
curl -I http://localhost
```

### Post-Installation Security Checklist

- [ ] Change default SSH port (optional but recommended)
- [ ] Disable root SSH login
- [ ] Configure automatic security updates
- [ ] Set up regular backups
- [ ] Configure log monitoring
- [ ] Test SSL certificate
- [ ] Verify firewall rules
- [ ] Test application deployment

### Maintenance Commands

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart web services
sudo systemctl restart nginx php8.2-fpm mysql

# Check service logs
sudo journalctl -u nginx -f
sudo journalctl -u php8.2-fpm -f
sudo journalctl -u mysql -f

# Monitor system resources
htop
iotop
nethogs

# Check SSL certificate expiration
sudo certbot certificates
```

This completes the Ubuntu server setup. You can now proceed with the application installation steps in the main installation guide.

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

## Environment Configuration

### Development vs Production Setup

The application uses a two-tier environment configuration system:

#### `.env` File (Committed to Repository)
Contains **production configuration** and serves as the source of truth for defaults:
```env
# Production URLs (actual domain)
NEXT_PUBLIC_SITE_URL=https://radio.rtm.gov.my
NEXT_PUBLIC_SERVER_URL=https://radio.rtm.gov.my
NEXT_PUBLIC_API_URL=https://radio.rtm.gov.my/api/frontend
```

**Important:** This file is committed to git and should contain production values. All developers use this as the template.

#### `.env.local` File (Ignored by Git)
**Development override** file for local testing. Create this file in your local development environment:
```env
# Development URLs (local testing)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/frontend
```

**Important:** This file is in `.gitignore` and must NOT be committed. Each developer maintains their own copy with their preferred settings.

#### `.env.example` File (Committed to Repository)
Template file for new developers. Copy this to `.env.local` to get started:
```bash
cp .env.example .env.local
# Then edit .env.local with your local values
```

### Environment Configuration Best Practices

1. **Never commit `.env.local`** - It should be in `.gitignore`
2. **Keep `.env` with production values** - It's the default/fallback
3. **Use `.env.local` for development** - Override production values for local testing
4. **Production servers** - If `.env.local` exists on production, it will override `.env` (be aware of this when deploying)
5. **All files use NEXT_PUBLIC_ prefix** - These variables are safe to expose to the browser

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

# Frontend (Next.js)
cd ../frontend/portalradio_v2
npm run build
```

### Automated Deployment Script

The project includes a comprehensive deployment script (`api/deploy.sh`) that handles the complete deployment pipeline:

#### Deploy Script Features

The `deploy.sh` script automates the following steps:

1. **Git Pull** - Fetch latest changes from main branch
2. **Backend Build** - Build React admin dashboard (`backend/npm run build`)
3. **Frontend Build** - Build Next.js public site (`frontend/portalradio_v2/npm run build`)
4. **Database Migration** - Run Laravel migrations (`php artisan migrate`)
5. **Process Restart** - Restart PM2 process (`pm2 restart portalradio_v2`)
6. **Comprehensive Logging** - All output saved to `deploy.log`

#### Running the Deploy Script

```bash
# From project root
cd api
bash deploy.sh
```

#### Deploy Script Output

The script provides:
- **Timestamped logging** - Start and end times for each deployment
- **Success checkmarks** - ✓ indicators for completed steps
- **Error handling** - Exits immediately on any step failure with error message
- **Detailed logging** - All output appended to `deploy.log` for history and debugging
- **Clear formatting** - Section headers and status messages for easy reading

#### Example Deploy Log Output
```
=== Deploy started at Wed Mar 12 14:30:45 UTC 2026 ===
Project root: /var/www/portalradio_v2

--- Git pull ---
✓ Git pull completed

--- Backend: npm run build ---
✓ Backend build completed

--- Frontend: npm run build ---
✓ Frontend build completed

--- API: php artisan migrate ---
✓ Database migration completed

--- Restart PM2: portalradio_v2 ---
✓ PM2 restart completed

=== Deploy finished at Wed Mar 12 14:35:20 UTC 2026 ===
```

#### Checking Deploy Status

View recent deployment logs:
```bash
# View last deployment
tail deploy.log

# View last N lines
tail -20 deploy.log

# Follow live deployment (if running)
tail -f deploy.log

# View full deployment history
cat deploy.log
```

#### PM2 Configuration

Before using the deploy script, ensure PM2 is configured:

```bash
# Start the application with PM2
cd frontend/portalradio_v2
pm2 start npm --name portalradio_v2 -- start

# Or if using a PM2 ecosystem file
pm2 start ecosystem.config.js

# Check PM2 status
pm2 status

# View logs
pm2 logs portalradio_v2
```

## Nginx Configuration & Production Setup

The project includes comprehensive Nginx configuration for production deployment with multiple server configurations to handle different environments and security requirements.

### Configuration Files Overview

The `nginx/` directory contains the following configuration files:

#### 1. `nginx.conf` - Main Nginx Configuration
- **Security Headers**: Comprehensive security headers including HSTS, CSP, X-Frame-Options
- **SSL/TLS Settings**: Modern TLS protocols (TLSv1.2, TLSv1.3) with secure ciphers
- **Performance**: Gzip compression, optimized worker processes
- **Content Security Policy**: Strict CSP for enhanced security

#### 2. `default` - Development/Local Server Configuration
```nginx
server_name: rtm.gov.my
Port: 80 (HTTP)
Root: /var/www/rtm.gov.my/rtm.gov.my/build
```

**Location Blocks:**
- `/` - RTM website (React build)
- `/backend` - Admin dashboard (React build)
- `/storage` - Laravel storage files with directory listing
- `/api` - Laravel API with PHP-FPM processing

#### 3. `server.conf` - Alternative Development Configuration
```nginx
server_name: localhost
Port: 8080
Root: /var/www/localhost/boilerplate/api/public
```

**Features:**
- Dedicated API server configuration
- PHP 8.2-FPM integration
- Custom logging paths

#### 4. `www.rtm.gov.my.conf` - Production HTTPS Configuration

**Multi-Server Setup:**
1. **HTTP to HTTPS Redirect** (Port 80)
2. **Non-www to www Redirect** (Port 443)
3. **Main Production Server** (Port 443 with SSL)

**Production Server Features:**
- **SSL/TLS**: Full SSL configuration with custom certificates
- **Security Headers**: Enhanced security headers for production
- **Content Security Policy**: Comprehensive CSP for media and scripts
- **PHP-FPM**: PHP 8.2-FPM integration
- **File Upload**: 256MB max body size for large file uploads

### Server Location Mapping

#### Production Server (`www.rtm.gov.my.conf`)

| Path | Purpose | Physical Location |
|------|---------|-------------------|
| `/` | RTM Website Frontend | `/var/www/rtm_portal_v2/rtm.gov.my/build` |
| `/images` | FTP Uploaded Images | `/var/www/rtm_portal/images/` |
| `/storage` | Laravel Storage | `/var/www/rtm_portal_v2/api/storage/app/public/` |
| `/api` | Laravel API | `/var/www/rtm_portal_v2/api/public` |

#### Development Server (`default`)

| Path | Purpose | Physical Location |
|------|---------|-------------------|
| `/` | RTM Website Frontend | `/var/www/rtm.gov.my/rtm.gov.my/build` |
| `/backend` | Admin Dashboard | `/var/www/rtm.gov.my/backend/build` |
| `/storage` | Laravel Storage | `/var/www/rtm.gov.my/api/storage/app/public/` |
| `/api` | Laravel API | `/var/www/rtm.gov.my/api/public` |

### SSL/TLS Configuration

#### Certificate Files
- **Certificate**: `nginx/certs/FullChain.pem`
- **Private Key**: `nginx/keys/private.key`

#### SSL Settings
- **Protocols**: TLSv1.2, TLSv1.3
- **Session Cache**: Shared SSL cache (1MB, 5min timeout)
- **Ciphers**: HIGH security ciphers, no aNULL or MD5

### Security Features

#### HTTP Security Headers
```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: Comprehensive CSP policy
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: Restricted permissions for geolocation, camera, etc.
```

#### Content Security Policy (CSP)
- **Scripts**: Self, unsafe-inline, Google Tag Manager, CDN
- **Styles**: Self, unsafe-inline, Google Fonts, CDN
- **Images**: Self, data URIs
- **Media**: Self, RTM domain, blob URIs
- **Connections**: Self, Google Analytics, RTM domain

### PHP-FPM Integration

#### Configuration Details
- **Socket**: `/run/php/php8.2-fpm.sock` (Production)
- **Socket**: `/run/php/php8.1-fpm.sock` (Development)
- **Read Timeout**: 600 seconds for long-running processes
- **Max Body Size**: 256MB for file uploads

#### Laravel API Routing
```nginx
location @laravelapi {
    rewrite /api/(.*)?$ /api/index.php?$is_args$args last;
}
```

### Deployment Instructions

#### 1. Copy Configuration Files
```bash
# Copy nginx configurations to nginx sites-available
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/www.rtm.gov.my.conf /etc/nginx/sites-available/
sudo cp nginx/default /etc/nginx/sites-available/

# Enable sites
sudo ln -s /etc/nginx/sites-available/www.rtm.gov.my.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

#### 2. SSL Certificate Setup
```bash
# Copy SSL certificates
sudo cp nginx/certs/FullChain.pem /etc/nginx/certs/
sudo cp nginx/keys/private.key /etc/nginx/keys/

# Set proper permissions
sudo chmod 600 /etc/nginx/keys/private.key
sudo chmod 644 /etc/nginx/certs/FullChain.pem
```

#### 3. Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Environment-Specific Configurations

#### Development Environment
- **HTTP Only**: Port 80 configuration
- **Local Domains**: localhost, rtm.gov.my
- **Debug Features**: Directory listing enabled for storage
- **Relaxed Security**: Basic security headers

#### Production Environment
- **HTTPS Only**: Automatic HTTP to HTTPS redirect
- **Domain Redirects**: Non-www to www redirection
- **Enhanced Security**: Full security header suite
- **Performance Optimized**: Gzip, caching, optimized workers

### Monitoring and Logging

#### Log Files
- **Access Logs**: `/var/log/nginx/access.log`
- **Error Logs**: `/var/log/nginx/error.log`
- **Custom Logs**: `/var/log/nginx/localhost_access.log` (server.conf)

#### Health Checks
- Monitor SSL certificate expiration
- Check PHP-FPM socket connectivity
- Verify file upload functionality
- Test API endpoint responses

### Troubleshooting

#### Common Issues
1. **SSL Certificate Errors**: Verify certificate paths and permissions
2. **PHP-FPM Connection**: Check socket path and PHP-FPM service status
3. **File Upload Failures**: Verify `client_max_body_size` setting
4. **API Routing Issues**: Check Laravel API rewrite rules
5. **Static File 404s**: Verify build file paths and permissions

#### Debug Commands
```bash
# Check nginx configuration
sudo nginx -t

# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Test SSL certificate
openssl x509 -in /etc/nginx/certs/FullChain.pem -text -noout

# Check file permissions
ls -la /var/www/rtm_portal_v2/
```

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
- **Chat User Profiles** with modal views and tabbed interfaces
- **Real-time Analytics** tracking with session persistence
- **HLS Streaming** support with audio player controls

## Chat Features

### User Profile Modals

The application includes two types of profile viewing experiences:

#### 1. Own Profile Modal (`ChatProfileModal.js`)
Registered users can click a profile icon to view and edit their own profile in a beautiful modal:
- **Maklumat Tab**: Personal information (full name, gender, location, hobby, about me)
- **Sosial Tab**: Social media links (Facebook, Instagram, Twitter/X, TikTok, YouTube)
- **Foto Tab**: Avatar upload and image management
- Form validation and success/error toast notifications
- Session-based authentication via bearer token

**Features:**
- Edit and save profile changes
- Upload/replace avatar image
- Add or remove social media links
- Toast notifications for success/failure feedback
- Responsive design for mobile and desktop

#### 2. Public Profile Modal (`ChatPublicProfile.js`)
Click any username in the chat to view another user's public profile:
- **Profil Tab**: View public profile information (always visible)
  - About me, location, hobby, gender, member since date
  - User avatar and color-coded username
- **Media Sosial Tab**: Social media links (only shown if user has any)
- **Foto Tab**: Display user avatar (only shown if avatar exists)
- Read-only view (no editing)
- Automatic tab hiding when data is unavailable

**Features:**
- Modal overlay with backdrop on chat widget
- Non-modal display in video player area (fullscreen replacement for HLS player)
- Color-coded user indicators
- Conditional tab rendering based on available data
- Proper loading and error states

**Implementation Details:**
- Props: `userId`, `onClose`, `fullHeight` (optional), `isModal` (optional)
- Fetches data via `chatGetPublicProfile(userId)` from utils/chatApi.js
- API endpoint: `GET /api/frontend/chat/profile/{userId}`
- Returns public-only data (no email shown)

### Chat Integration
Both profile components integrate seamlessly with the existing chat widget:
- Usernames become clickable buttons to open profile modals
- Profile viewing doesn't interrupt chat flow
- Modal closes with ← back button or × close button
- Supports both desktop and mobile layouts

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
