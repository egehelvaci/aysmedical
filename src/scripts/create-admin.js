// Admin oluşturma betiği - NODE_PATH=. ile çalıştırılmalıdır
require('dotenv').config();
const bcrypt = require('bcrypt');
const { DataSource } = require('typeorm');
const { Admin } = require('../entities/Admin');
const { DATABASE_URL } = require('../config/env');

async function main() {
  console.log('Admin kullanıcısı oluşturucu başlatılıyor...');
  console.log('Veritabanı URL:', DATABASE_URL);
  
  // DataSource oluştur
  const dataSource = new DataSource({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [Admin],
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Bağlantıyı başlat
    console.log('Veritabanına bağlanılıyor...');
    await dataSource.initialize();
    console.log('Veritabanı bağlantısı başarılı!');
    
    const adminRepo = dataSource.getRepository(Admin);
    
    // Admin bilgileri
    const adminData = {
      username: 'admin',
      email: 'info@ayshealth.com.tr',
      password: 'AysMedical.951',
      fullName: 'AYS Medical Admin'
    };
    
    // Kullanıcı var mı kontrol et
    const existingAdmin = await adminRepo.findOne({ 
      where: { username: adminData.username } 
    });
    
    if (existingAdmin) {
      console.log(`"${adminData.username}" kullanıcısı zaten mevcut!`);
      console.log(`E-posta: ${existingAdmin.email}`);
    } else {
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      
      // Admin nesnesini oluştur
      const admin = new Admin();
      admin.username = adminData.username;
      admin.email = adminData.email;
      admin.password = hashedPassword;
      admin.fullName = adminData.fullName;
      
      // Kaydet
      const savedAdmin = await adminRepo.save(admin);
      console.log(`Yeni admin kullanıcısı oluşturuldu! ID: ${savedAdmin.id}`);
      console.log(`Kullanıcı adı: ${savedAdmin.username}`);
      console.log(`E-posta: ${savedAdmin.email}`);
      console.log(`Şifre: ${adminData.password} (bu ekranda sadece gösterilir)`);
    }
  } catch (error) {
    console.error('HATA:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Veritabanı bağlantısı kapatıldı.');
    }
  }
}

// Scripti çalıştır
main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Kritik hata:', err);
    process.exit(1);
  }); 