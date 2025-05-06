import "reflect-metadata";
import { getDataSource } from '../lib/typeorm';
import { Admin } from '../entities/Admin';
import { Product } from '../entities/Product';
import { ProductLocalization } from '../entities/ProductLocalization';
import { ProductFeature } from '../entities/ProductFeature';
import { ProductDetail } from '../entities/ProductDetail';
import { ProductUsageArea } from '../entities/ProductUsageArea';
import { ContactMessage } from '../entities/ContactMessage';

async function createTables() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    const dataSource = await getDataSource();
    
    console.log('Tüm entityler yüklendi:');
    const entities = dataSource.entityMetadatas;
    entities.forEach(entity => {
      console.log(`- ${entity.name} (tablo: ${entity.tableName})`);
    });
    
    // Test verisi oluşturalım
    console.log('\nTest verisi oluşturuluyor...');
    
    // Admin oluşturma
    const adminRepository = dataSource.getRepository(Admin);
    const adminExists = await adminRepository.findOne({ where: { username: 'admin' } });
    
    if (!adminExists) {
      const admin = new Admin();
      admin.username = 'admin';
      admin.password = 'admin123'; // Gerçek uygulamada hash'lenmiş şifre kullanılmalıdır
      admin.email = 'admin@example.com';
      admin.fullName = 'Admin User';
      
      await adminRepository.save(admin);
      console.log('- Admin kullanıcısı oluşturuldu.');
    } else {
      console.log('- Admin kullanıcısı zaten var.');
    }
    
    // Örnek ürün oluşturma
    const productRepository = dataSource.getRepository(Product);
    const productExists = await productRepository.findOne({ where: { code: 'PROD-001' } });
    
    if (!productExists) {
      // Ürün oluştur
      const product = new Product();
      product.code = 'PROD-001';
      product.image_url = 'https://example.com/product.jpg';
      
      // Ürünü kaydet
      const savedProduct = await productRepository.save(product);
      console.log('- Örnek ürün oluşturuldu.');
      
      // Ürün lokalizasyonu ekle
      const localizationRepository = dataSource.getRepository(ProductLocalization);
      
      const localizationTR = new ProductLocalization();
      localizationTR.productId = savedProduct.id;
      localizationTR.languageCode = 'tr';
      localizationTR.name = 'Örnek Ürün';
      localizationTR.description = 'Bu bir örnek ürün açıklamasıdır.';
      localizationTR.slug = 'ornek-urun';
      localizationTR.product = savedProduct;
      
      const localizationEN = new ProductLocalization();
      localizationEN.productId = savedProduct.id;
      localizationEN.languageCode = 'en';
      localizationEN.name = 'Sample Product';
      localizationEN.description = 'This is a sample product description.';
      localizationEN.slug = 'sample-product';
      localizationEN.product = savedProduct;
      
      await localizationRepository.save([localizationTR, localizationEN]);
      console.log('- Ürün lokalizasyonları oluşturuldu.');
      
      // Ürün özelliği ekle
      const featureRepository = dataSource.getRepository(ProductFeature);
      
      const featureTR = new ProductFeature();
      featureTR.productId = savedProduct.id;
      featureTR.languageCode = 'tr';
      featureTR.title = 'Yüksek Kalite';
      featureTR.description = 'Bu ürün yüksek kalite malzemelerden üretilmiştir.';
      featureTR.icon = 'quality-icon';
      featureTR.product = savedProduct;
      
      const featureEN = new ProductFeature();
      featureEN.productId = savedProduct.id;
      featureEN.languageCode = 'en';
      featureEN.title = 'High Quality';
      featureEN.description = 'This product is made from high quality materials.';
      featureEN.icon = 'quality-icon';
      featureEN.product = savedProduct;
      
      await featureRepository.save([featureTR, featureEN]);
      console.log('- Ürün özellikleri oluşturuldu.');
    } else {
      console.log('- Örnek ürün zaten var.');
    }
    
    console.log('\nTablo oluşturma işlemi başarıyla tamamlandı!');
    
  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    process.exit(0);
  }
}

createTables(); 