// Prisma yerine TypeORM için güncellenmiş veritabanı bağlantı yöneticisi
import { getDataSource, closeConnection } from './typeorm';
import { Admin } from '@/entities/Admin';

// Re-export işlemleri
export { getDataSource, closeConnection };

// Vercel'in soğuk başlatmaları için bağlantıyı ısıt
export const warmupDatabaseConnection = async () => {
  try {
    // Basit bir sorgu ile bağlantıyı test et
    const dataSource = await getDataSource();
    
    // Önce dataSource'un hazır olduğundan emin ol
    if (dataSource && dataSource.isInitialized) {
      // Admin bilgisi sorgulama - performans için count kullan
      const adminRepo = dataSource.getRepository(Admin);
      const count = await adminRepo.count();
      console.log(`Veritabanı bağlantısı başarıyla ısıtıldı: ${count} admin bulundu`);
    } else {
      console.log('Veritabanı dataSource başlatılamadı');
    }
  } catch (error) {
    console.error('Veritabanı bağlantı ısıtma hatası:', error);
  }
};

// Vercel ortamında bağlantı kapatma işlemini yönet
// Edge Runtime ile uyumlu olması için process.on kullanımı kaldırıldı

// Default export olarak getDataSource fonksiyonunu kullan
export default getDataSource;