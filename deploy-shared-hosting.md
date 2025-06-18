# 🚀 Deploy ZipFlow ke Shared Hosting

## Langkah-langkah:

### 1. Build Aplikasi Secara Lokal
```bash
# Install dependencies
npm install

# Build untuk production
npm run build

# Jalankan script build
node build-script.js
```

### 2. Upload ke Hosting
- Upload semua isi folder `dist/` ke folder `public_html` di hosting
- Upload file `.htaccess` ke root folder `public_html`

### 3. Konfigurasi di cPanel
1. **Node.js App Manager**:
   - Buat aplikasi Node.js baru
   - Set Node.js version: 18.x
   - Set startup file: `server.js`

2. **Database**:
   - Buat database MySQL baru
   - Update `DATABASE_URL` di environment variables

3. **Domain**:
   - Point domain ke folder aplikasi
   - Enable SSL certificate

### 4. Environment Variables
Set di cPanel > Environment Variables:
```
NODE_ENV=production
DATABASE_URL=mysql://username:password@localhost:3306/zipflow
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
```

### 5. Restart Aplikasi
- Restart Node.js app di cPanel
- Test aplikasi di domain Anda 