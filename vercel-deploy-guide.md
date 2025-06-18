# 🚀 Deploy ZipFlow ke Vercel

## Langkah-langkah Deployment:

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy dari Local
```bash
# Di folder proyek ZipFlow
vercel
```

### 4. Deploy ke Production
```bash
vercel --prod
```

## Konfigurasi Environment Variables di Vercel:

1. Buka dashboard Vercel
2. Pilih proyek ZipFlow
3. Settings > Environment Variables
4. Tambahkan variables berikut:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-database-connection-string
```

## Custom Domain Setup:

1. Di dashboard Vercel > Domains
2. Add domain: your-domain.com
3. Update DNS records sesuai instruksi Vercel
4. Set NEXTAUTH_URL ke domain baru

## Database Setup:

### Option 1: Vercel Postgres
- Integrasi langsung di dashboard Vercel
- Otomatis setup environment variables

### Option 2: External Database
- Gunakan PlanetScale, Supabase, atau database lain
- Update DATABASE_URL di environment variables

## Monitoring & Analytics:
- Vercel Analytics (gratis)
- Performance monitoring
- Error tracking 