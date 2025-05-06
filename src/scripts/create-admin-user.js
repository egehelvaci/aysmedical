// Admin kullanıcısı oluşturma betiği
require("reflect-metadata");
const { getDataSource } = require('@/lib/typeorm');
const { Admin } = require('@/entities/Admin');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    
    // TypeORM veri kaynaklarını manuel olarak oluştur
    const { default: ENV } = require('@/config/env');
    const { DataSource } = require('typeorm');
    const { Admin } = require('@/entities/Admin');
    
    // Doğrudan DataSource oluştur
    const dataSource = new DataSource({
      type: "postgres",
      url: ENV.DATABASE_URL,
      synchronize: true,
      logging: true,
      entities: [Admin],
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await dataSource.initialize();
    console.log("Veritabanı bağlantısı başarılı");
    
    const adminRepository = dataSource.getRepository(Admin);
    
    // Kullanıcı adı ve şifre
    const username = 'admin';
    const email = 'info@ayshealth.com.tr';
    const password = 'AysMedical.951';
    
    // Kullanıcının var olup olmadığını kontrol et
    const existingAdmin = await adminRepository.findOne({
      where: { username }
    });
    
    if (existingAdmin) {
      console.log(`"${username}" kullanıcısı zaten var.`);
      console.log('Mevcut kullanıcı bilgileri:');
      console.log(`- Kullanıcı adı: ${existingAdmin.username}`);
      console.log(`- E-posta: ${existingAdmin.email}`);
      console.log(`- Şifre: Mevcut şifre (orijinal: ${password})`);
    } else {
      // Şifreyi hashle
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Yeni admin oluştur
      const newAdmin = new Admin();
      newAdmin.username = username;
      newAdmin.password = hashedPassword;
      newAdmin.email = email;
      newAdmin.fullName = 'AYS Medical Admin';
      
      // Veritabanına kaydet
      const savedAdmin = await adminRepository.save(newAdmin);
      
      console.log(`"${savedAdmin.username}" kullanıcısı başarıyla oluşturuldu!`);
      console.log('Giriş bilgileri:');
      console.log(`- Kullanıcı adı: ${username}`);
      console.log(`- E-posta: ${email}`);
      console.log(`- Şifre: ${password}`);
    }
    
    // Bağlantıyı kapat
    await dataSource.destroy();
    console.log("Veritabanı bağlantısı kapatıldı");
    
  } catch (error) {
    console.error('Hata:', error);
  }
}

// Scripti çalıştır
createAdminUser().then(() => {
  console.log("İşlem tamamlandı");
  process.exit(0);
}).catch(error => {
  console.error("Kritik hata:", error);
  process.exit(1);
}); 