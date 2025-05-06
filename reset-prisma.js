const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Prisma ve package-lock.json sıfırlama işlemi başlatılıyor...');

try {
  // 1. Tüm node_modules ve package-lock.json'ı temizle
  console.log('1. node_modules ve package-lock.json temizleniyor...');
  
  if (fs.existsSync('node_modules')) {
    console.log('node_modules klasörü siliniyor...');
    execSync('rd /s /q node_modules', { stdio: 'inherit' });
  }
  
  if (fs.existsSync('package-lock.json')) {
    console.log('package-lock.json dosyası siliniyor...');
    fs.unlinkSync('package-lock.json');
  }
  
  // 2. Prisma ve @prisma/client'ı package.json'dan kaldır
  console.log('\n2. Prisma paketleri geçici olarak kaldırılıyor...');
  execSync('npm uninstall prisma @prisma/client', { stdio: 'inherit' });
  
  // 3. Önbellek temizleme
  console.log('\n3. NPM önbelleği temizleniyor...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // 4. Bağımlılıkları yeniden yükle
  console.log('\n4. Tüm bağımlılıklar yeniden yükleniyor...');
  execSync('npm install', { stdio: 'inherit' });
  
  // 5. Prisma'yı yeniden yükle (belirli bir sürüm)
  console.log('\n5. Prisma yeniden yükleniyor...');
  execSync('npm install prisma@4.16.2 @prisma/client@4.16.2', { stdio: 'inherit' });
  
  console.log('\nİşlem tamamlandı! Lütfen uygulamayı yeniden başlatın.');
  
} catch (error) {
  console.error('Hata oluştu:', error.message);
} 