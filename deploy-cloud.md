# 🚀 Deploy ZipFlow ke Cloud Hosting

## AWS EC2
### 1. Launch EC2 Instance
- OS: Ubuntu 20.04 LTS
- Instance Type: t2.micro (free tier) atau t3.small
- Security Group: Buka port 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 2. Connect dan Setup
```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip

# Setup seperti VPS
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx mysql-server
sudo npm install -g pm2
```

### 3. Deploy Aplikasi
```bash
# Clone atau upload project
cd /var/www
sudo mkdir zipflow
sudo chown ubuntu:ubuntu zipflow
cd zipflow

# Setup aplikasi
npm install
npm run build
cp env.example .env
nano .env
```

### 4. Setup Domain
- Point domain ke EC2 IP address
- Setup Route 53 (jika menggunakan AWS DNS)

## Google Cloud Platform
### 1. Create VM Instance
- OS: Ubuntu 20.04 LTS
- Machine Type: e2-micro (free tier)
- Firewall: Allow HTTP, HTTPS traffic

### 2. Deploy
```bash
# Connect via SSH
gcloud compute ssh instance-name --zone=zone-name

# Setup seperti AWS EC2
```

## Azure
### 1. Create Virtual Machine
- OS: Ubuntu Server 20.04 LTS
- Size: B1s (free tier)
- Networking: Allow HTTP, HTTPS

### 2. Deploy
```bash
# Connect via SSH
ssh username@your-azure-ip

# Setup seperti platform lain
```

## Docker Deployment (Universal)
### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build dan Deploy
```bash
# Build image
docker build -t zipflow .

# Run container
docker run -d -p 3000:3000 --name zipflow-app zipflow
``` 