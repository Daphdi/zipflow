# 🚀 Deploy ZipFlow ke Vercel - Langkah demi Langkah

## 📋 Prerequisites
- Akun GitHub/GitLab (untuk repository)
- Akun Vercel (gratis)
- Node.js terinstall di komputer

## 🔧 Langkah 1: Persiapan Repository

### 1.1 Push ke GitHub
```bash
# Jika belum ada repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/zipflow.git
git push -u origin main
```

### 1.2 Atau gunakan repository yang sudah ada
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## 🚀 Langkah 2: Deploy ke Vercel

### 2.1 Via Vercel Dashboard (Recommended)
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub/GitLab
3. Klik "New Project"
4. Import repository ZipFlow
5. Vercel akan otomatis detect Next.js
6. Klik "Deploy"

### 2.2 Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy (akan ada beberapa pertanyaan)
vercel

# Deploy ke production
vercel --prod
```

### 2.3 Via Script Otomatis
```bash
# Buat script executable
chmod +x deploy-vercel.sh

# Deploy preview
./deploy-vercel.sh

# Deploy production
./deploy-vercel.sh --prod
```

## ⚙️ Langkah 3: Setup Environment Variables

### 3.1 Di Vercel Dashboard
1. Buka proyek di dashboard Vercel
2. Settings > Environment Variables
3. Tambahkan variables berikut:

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-minimum-32-chars
DATABASE_URL=your-database-connection-string
```

### 3.2 Generate Secret Key
```bash
# Generate random secret
openssl rand -base64 32
```

## 🌐 Langkah 4: Setup Custom Domain

### 4.1 Di Vercel Dashboard
1. Settings > Domains
2. Add domain: your-domain.com
3. Update DNS records sesuai instruksi Vercel

### 4.2 Update Environment Variables
```
NEXTAUTH_URL=https://your-domain.com
```

## 🗄️ Langkah 5: Setup Database

### 5.1 Vercel Postgres (Recommended)
1. Di dashboard Vercel > Storage
2. Create Postgres database
3. Vercel akan otomatis set DATABASE_URL

### 5.2 External Database
- PlanetScale (MySQL)
- Supabase (PostgreSQL)
- MongoDB Atlas
- Update DATABASE_URL di environment variables

## 🔍 Langkah 6: Testing

### 6.1 Test Aplikasi
1. Buka URL Vercel
2. Test semua fitur utama
3. Check console untuk error
4. Test di mobile device

### 6.2 Check Logs
1. Di dashboard Vercel > Functions
2. Check function logs
3. Monitor performance

## 📊 Langkah 7: Monitoring

### 7.1 Vercel Analytics
1. Settings > Analytics
2. Enable Vercel Analytics
3. Monitor performance

### 7.2 Error Tracking
1. Check Function logs
2. Monitor 404 errors
3. Setup alerts jika perlu

## 🔄 Langkah 8: Continuous Deployment

### 8.1 Auto Deploy
- Setiap push ke main branch akan auto deploy
- Preview deployments untuk pull requests

### 8.2 Manual Deploy
```bash
# Deploy dari local
vercel --prod

# Atau via script
npm run deploy:vercel
```

## 🎉 Selesai!
Aplikasi ZipFlow Anda sekarang live di Vercel dengan:
- ✅ Auto-deployment dari Git
- ✅ SSL certificate gratis
- ✅ CDN global
- ✅ Analytics built-in
- ✅ Custom domain support 