#!/bin/bash

echo "🚀 Deploying ZipFlow to VPS..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js dan npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y

# Clone atau upload project
# cd /var/www/zipflow

# Install dependencies
npm install

# Build aplikasi
npm run build

# Start aplikasi dengan PM2
pm2 start npm --name "zipflow" -- start

# Save PM2 configuration
pm2 save
pm2 startup

# Configure nginx
sudo tee /etc/nginx/sites-available/zipflow << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/zipflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment selesai!"
echo "🌐 Aplikasi berjalan di: http://your-domain.com" 