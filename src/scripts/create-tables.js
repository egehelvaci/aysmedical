// ESM formatında import ifadeleri
import { createConnection } from 'typeorm';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config({ path: '.env.local' });

// Veritabanı bağlantı URL'i
const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_hOxe9KmY0cVW@ep-broad-star-a2qtdnoe-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// Örneğin Node.js 18 ve sonrası için ESM formatında __dirname eşdeğeri
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tüm entity sınıflarını içe aktar
const entitiesPath = [
  `${__dirname}/../../dist/entities/**/*.js`
];

async function createTables() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    
    // URL'i parse et
    const url = new URL(DATABASE_URL);
    
    // TypeORM bağlantısını oluştur
    const connection = await createConnection({
      type: "postgres",
      host: url.hostname,
      port: parseInt(url.port || "5432"),
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1), // başındaki '/' karakterini kaldır
      synchronize: true, // Tabloları otomatik oluştur
      logging: true,
      entities: entitiesPath,
      ssl: {
        rejectUnauthorized: false // Neon.tech gibi SSL gerektiren veritabanları için
      }
    });
    
    console.log('Veritabanı bağlantısı başarılı! Tablolar oluşturuldu.');
    
    // Bağlantıyı kapat
    await connection.close();
    console.log('Bağlantı kapatıldı.');
    
  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    process.exit(0);
  }
}

createTables(); 