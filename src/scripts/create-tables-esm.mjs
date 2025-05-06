import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

// .env.local dosyasını yükle
dotenv.config({ path: '.env.local' });

// __dirname eşdeğeri
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanı URL'i
const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_hOxe9KmY0cVW@ep-broad-star-a2qtdnoe-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// Entity dosyaları yolu
const entitiesDir = join(__dirname, '..', '..', 'dist', 'entities', '**', '*.js');

async function createTables() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    console.log(`URL: ${DATABASE_URL}`);
    
    // URL'i parse et
    const url = new URL(DATABASE_URL);
    
    // DataSource oluştur
    const AppDataSource = new DataSource({
      type: "postgres",
      host: url.hostname,
      port: parseInt(url.port || "5432"),
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1), 
      synchronize: true,
      logging: true,
      entities: [entitiesDir],
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Bağlantıyı başlat
    await AppDataSource.initialize();
    console.log("Veritabanı bağlantısı başarıyla kuruldu!");
    
    console.log('Tüm entityler yüklendi:');
    AppDataSource.entityMetadatas.forEach(entity => {
      console.log(`- ${entity.name} (tablo: ${entity.tableName})`);
    });
    
    // Bağlantıyı kapat
    await AppDataSource.destroy();
    console.log("Bağlantı kapatıldı!");
    
  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    process.exit(0);
  }
}

createTables(); 