// Admin kullanıcısı oluşturma betiği
import "reflect-metadata";
import { getDataSource } from '../lib/typeorm';
import { Admin } from '../entities/Admin';
import bcrypt from 'bcrypt';

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
      console.log('Mevcut kullanıcı bilgileri:');
      console.log(`- Kullanıcı adı: ${existingAdmin.username}`);
      console.log(`- E-posta: ${existingAdmin.email}`);
      console.log(`- Şifre: Mevcut şifre (orijinal:  ${password})`);
      process.exit(0);
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