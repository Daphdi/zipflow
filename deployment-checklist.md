# 📋 Checklist Deployment ZipFlow

## ✅ Pre-Deployment
- [ ] Backup database (jika ada)
- [ ] Test aplikasi secara lokal
- [ ] Update dependencies
- [ ] Set environment variables
- [ ] Build aplikasi: `npm run build`

## ✅ Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (jika menggunakan database)
- [ ] `NEXTAUTH_URL=https://your-domain.com`
- [ ] `NEXTAUTH_SECRET` (generate random string)
- [ ] API keys (jika ada)

## ✅ Database Setup
- [ ] Buat database baru
- [ ] Import schema (jika ada)
- [ ] Test koneksi database
- [ ] Set permissions user database

## ✅ File Upload
- [ ] Upload semua file ke hosting
- [ ] Set permissions file (755 untuk folder, 644 untuk file)
- [ ] Upload `.htaccess` (untuk Apache)
- [ ] Upload `nginx.conf` (untuk Nginx)

## ✅ Domain & SSL
- [ ] Point domain ke hosting
- [ ] Setup DNS records
- [ ] Install SSL certificate
- [ ] Test HTTPS redirect

## ✅ Application Start
- [ ] Start Node.js application
- [ ] Test aplikasi di domain
- [ ] Check error logs
- [ ] Test semua fitur utama

## ✅ Post-Deployment
- [ ] Setup monitoring (PM2, log rotation)
- [ ] Setup backup schedule
- [ ] Test performance
- [ ] Setup analytics (opsional)

## 🔧 Troubleshooting
### Error 500
- Check environment variables
- Check database connection
- Check file permissions
- Check application logs

### Database Connection Error
- Verify database credentials
- Check database server status
- Test connection manually
- Check firewall settings

### Static Files Not Loading
- Check file paths
- Check `.htaccess` configuration
- Check nginx configuration
- Verify file permissions

### Domain Not Working
- Check DNS propagation
- Verify domain pointing
- Check hosting configuration
- Test with different browser 