const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building ZipFlow for production...');

// Build aplikasi
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build berhasil!');
  
  // Buat folder dist jika belum ada
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Copy file yang diperlukan
  const filesToCopy = [
    '.next',
    'public',
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'tsconfig.json'
  ];
  
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.lstatSync(file).isDirectory()) {
        execSync(`cp -r ${file} dist/`, { stdio: 'inherit' });
      } else {
        execSync(`cp ${file} dist/`, { stdio: 'inherit' });
      }
    }
  });
  
  console.log('📁 File siap untuk diupload ke hosting!');
  console.log('📂 Upload semua isi folder "dist" ke public_html di hosting Anda');
  
} catch (error) {
  console.error('❌ Build gagal:', error.message);
  process.exit(1);
} 