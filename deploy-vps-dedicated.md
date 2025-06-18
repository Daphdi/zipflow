# 🚀 Deploy ZipFlow ke VPS/Dedicated Server

## Langkah-langkah:

### 1. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y

# Install MySQL (jika belum ada)
sudo apt install mysql-server -y
```

### 2. Upload Project
```bash
# Buat direktori untuk aplikasi
sudo mkdir -p /var/www/zipflow
sudo chown $USER:$USER /var/www/zipflow

# Upload project (via SCP, Git, atau File Manager)
cd /var/www/zipflow
```

### 3. Setup Aplikasi
```bash
# Install dependencies
npm install

# Build aplikasi
npm run build

# Setup environment variables
cp env.example .env
nano .env  # Edit sesuai konfigurasi Anda
```

### 4. Setup Database
```bash
# Login ke MySQL
sudo mysql

# Buat database dan user
CREATE DATABASE zipflow;
CREATE USER 'zipflow_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON zipflow.* TO 'zipflow_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Setup Nginx
```bash
# Buat konfigurasi nginx
sudo nano /etc/nginx/sites-available/zipflow
```

Isi dengan konfigurasi:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Start Aplikasi
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/zipflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start aplikasi dengan PM2
pm2 start npm --name "zipflow" -- start
pm2 save
pm2 startup
```

### 7. Setup SSL (Opsional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Setup SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
``` 