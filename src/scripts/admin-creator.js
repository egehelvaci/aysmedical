// Admin kullanıcısı oluşturma betiği
require('dotenv').config();
const bcrypt = require('bcrypt');
const { getDataSource } = require('../lib/typeorm');
const { Admin } = require('../entities/Admin');

async function createAdminUser() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    const dataSource = await getDataSource();
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
      return;
    }
    
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
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    process.exit();
  }
}

// Scripti çalıştır
createAdminUser(); 