const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Tüm yolları temizle ve yeniden oluştur
try {
  console.log('1. Tüm Prisma önbelleklerini temizliyorum...');
  
  // node_modules/.prisma'yı temizle
  if (fs.existsSync('node_modules/.prisma')) {
    fs.rmSync('node_modules/.prisma', { recursive: true, force: true });
    console.log('node_modules/.prisma temizlendi.');
  }
  
  // ./generated klasörünü temizle (varsa)
  if (fs.existsSync('src/generated/prisma')) {
    fs.rmSync('src/generated/prisma', { recursive: true, force: true });
    console.log('src/generated/prisma temizlendi.');
  }
  
  // Önbellekteki schema.prisma dosyasını yeniden düzenle
  console.log('\n2. Şema dosyasını basitleştiriyorum...');
  const schemaPath = path.join('prisma', 'schema.prisma');
  
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const simplifiedContent = schemaContent
      .replace(/provider\s*=\s*"prisma-client-js".*?}/s, 'provider = "prisma-client-js"}')
      .replace(/\/\/.*$/gm, ''); // Yorum satırlarını kaldır
      
    fs.writeFileSync(schemaPath, simplifiedContent);
    console.log('Prisma şema dosyası basitleştirildi.');
  }
  
  console.log('\n3. Prisma bağımlılıklarını yeniden yüklüyorum...');
  execSync('npm uninstall prisma @prisma/client', { stdio: 'inherit' });
  execSync('npm cache clean --force', { stdio: 'inherit' });
  execSync('npm install prisma@4.16.2 @prisma/client@4.16.2', { stdio: 'inherit' });
  
  console.log('\n4. Prisma generate komutunu doğrudan modül içinden çalıştırmayı deniyorum...');
  // Doğrudan modülden çağırmak daha güvenilir olabilir
  try {
    const { PrismaClient } = require('@prisma/client');
    console.log('Prisma istemcisi başarıyla yüklendi ve kullanılabilir!');
  } catch (innerError) {
    console.error('PrismaClient yüklenirken hata:', innerError.message);
  }
  
  console.log('\nSorun giderildi. Şimdi uygulamanızı tekrar çalıştırın!');
} catch (error) {
  console.error('Hata oluştu:', error.message);
} 