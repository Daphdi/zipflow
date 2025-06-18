# 🔧 Vercel Troubleshooting Guide

## Error: Module not found: Can't resolve '@radix-ui/react-switch'

### Solusi:
1. **Install dependency yang hilang**:
   ```bash
   npm install @radix-ui/react-switch@^1.1.2
   ```

2. **Clean dan reinstall**:
   ```bash
   rm -rf node_modules
   rm -rf .next
   npm install
   ```

3. **Test build lokal**:
   ```bash
   npm run build
   ```

4. **Commit dan push**:
   ```bash
   git add .
   git commit -m "Fix: Add missing dependency"
   git push
   ```

## Error: Build failed because of webpack errors

### Solusi:
1. **Check semua dependencies**:
   ```bash
   npm ls
   ```

2. **Update dependencies**:
   ```bash
   npm update
   ```

3. **Clear cache**:
   ```bash
   npm cache clean --force
   ```

## Error: Vercel CLI issues

### Solusi:
1. **Reinstall Vercel CLI**:
   ```bash
   npm uninstall -g vercel
   npm install -g vercel
   ```

2. **Login ulang**:
   ```bash
   vercel logout
   vercel login
   ```

## Error: Environment variables not working

### Solusi:
1. **Check di Vercel Dashboard**:
   - Settings > Environment Variables
   - Pastikan semua variables sudah diset

2. **Restart deployment**:
   - Di dashboard Vercel
   - Redeploy project

## Error: Database connection issues

### Solusi:
1. **Check DATABASE_URL**:
   - Pastikan format benar
   - Test koneksi lokal

2. **Use Vercel Postgres**:
   - Integrasi langsung di dashboard
   - Auto-setup environment variables

## Error: Custom domain not working

### Solusi:
1. **Check DNS records**:
   - Pastikan sesuai instruksi Vercel
   - Tunggu propagasi DNS (24-48 jam)

2. **Update NEXTAUTH_URL**:
   - Set ke domain baru
   - Redeploy aplikasi

## Quick Fix Script

Jalankan script otomatis:
```bash
chmod +x fix-vercel-deploy.sh
./fix-vercel-deploy.sh
```

## Common Commands

```bash
# Check Vercel status
vercel whoami

# List projects
vercel ls

# Deploy preview
vercel

# Deploy production
vercel --prod

# Remove project
vercel remove

# Check logs
vercel logs
```

## Best Practices

1. **Always test build locally** sebelum deploy
2. **Use .env.local** untuk development
3. **Set environment variables** di Vercel dashboard
4. **Monitor deployment logs** untuk error
5. **Use Vercel Analytics** untuk monitoring 