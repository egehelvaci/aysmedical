import { DataSource, Table, TableForeignKey, TableIndex } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

// .env.local dosyasını yükle
dotenv.config({ path: '.env.local' });

// __dirname eşdeğeri
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanı URL'i
const DATABASE_URL = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_hOxe9KmY0cVW@ep-broad-star-a2qtdnoe-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

async function syncDB() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    
    // URL'i parse et
    const url = new URL(DATABASE_URL);
    
    // Entity tanımları
    const entities = [
      {
        name: "admin",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "username", type: "varchar", isUnique: true },
          { name: "password", type: "varchar" },
          { name: "email", type: "varchar", isUnique: true },
          { name: "fullName", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ]
      },
      {
        name: "product",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "code", type: "varchar", isUnique: true },
          { name: "image_url", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ]
      },
      {
        name: "product_localization",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "productId", type: "int" },
          { name: "languageCode", type: "varchar" },
          { name: "name", type: "varchar" },
          { name: "description", type: "text", isNullable: true },
          { name: "slug", type: "varchar" },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ],
        foreignKeys: [
          {
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
          }
        ],
        indices: [
          { columnNames: ["productId", "languageCode"], isUnique: true }
        ]
      },
      {
        name: "product_feature",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "productId", type: "int" },
          { name: "languageCode", type: "varchar" },
          { name: "title", type: "varchar" },
          { name: "description", type: "text", isNullable: true },
          { name: "icon", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ],
        foreignKeys: [
          {
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
          }
        ]
      },
      {
        name: "product_detail",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "productId", type: "int" },
          { name: "languageCode", type: "varchar" },
          { name: "title", type: "varchar" },
          { name: "content", type: "text" },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ],
        foreignKeys: [
          {
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
          }
        ]
      },
      {
        name: "product_usage_area",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "productId", type: "int" },
          { name: "languageCode", type: "varchar" },
          { name: "title", type: "varchar" },
          { name: "description", type: "text", isNullable: true },
          { name: "icon", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ],
        foreignKeys: [
          {
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
          }
        ]
      },
      {
        name: "contact_message",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar" },
          { name: "email", type: "varchar" },
          { name: "phone", type: "varchar", isNullable: true },
          { name: "subject", type: "varchar" },
          { name: "message", type: "text" },
          { name: "languageCode", type: "varchar" },
          { name: "isRead", type: "boolean", default: false },
          { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP" }
        ]
      }
    ];
    
    // DataSource oluştur
    const AppDataSource = new DataSource({
      type: "postgres",
      host: url.hostname,
      port: parseInt(url.port || "5432"),
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      logging: true,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Bağlantıyı başlat
    await AppDataSource.initialize();
    console.log("Veritabanı bağlantısı başarıyla kuruldu!");
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      // İlk önce tüm tabloları sil (bağımlılık sorunlarını önlemek için doğru sırada)
      console.log('\nMevcut tablolar siliniyor...');
      
      // Önce bağımlı olan tabloları sil (tersten git)
      const tableNames = entities.map(e => e.name).reverse();
      
      for (const tableName of tableNames) {
        const tableExists = await queryRunner.hasTable(tableName);
        if (tableExists) {
          console.log(`  ${tableName} tablosu siliniyor...`);
          try {
            // DROP CASCADE kullan
            await queryRunner.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
          } catch (error) {
            console.error(`  ${tableName} tablosu silinirken hata: ${error.message}`);
          }
        }
      }
      
      // Tabloları oluştur
      console.log('\nTabloları oluşturma işlemi başlatılıyor...');
      
      // Şimdi doğru sırada tabloları oluştur
      for (const entity of entities) {
        console.log(`- ${entity.name} tablosu oluşturuluyor...`);
        
        // Tablo oluştur
        const table = new Table({
          name: entity.name,
          columns: entity.columns
        });
        
        await queryRunner.createTable(table, true);
        console.log(`  ${entity.name} tablosu oluşturuldu.`);
        
        // Foreign key'leri ekle
        if (entity.foreignKeys) {
          for (const fkDef of entity.foreignKeys) {
            const foreignKey = new TableForeignKey({
              columnNames: fkDef.columnNames,
              referencedTableName: fkDef.referencedTableName,
              referencedColumnNames: fkDef.referencedColumnNames,
              onDelete: fkDef.onDelete
            });
            
            await queryRunner.createForeignKey(entity.name, foreignKey);
            console.log(`  Foreign key oluşturuldu: ${fkDef.columnNames} -> ${fkDef.referencedTableName}(${fkDef.referencedColumnNames})`);
          }
        }
        
        // İndeksleri ekle
        if (entity.indices) {
          for (const idxDef of entity.indices) {
            const index = new TableIndex({
              columnNames: idxDef.columnNames,
              isUnique: idxDef.isUnique
            });
            
            await queryRunner.createIndex(entity.name, index);
            console.log(`  Index oluşturuldu: ${idxDef.columnNames.join(', ')}`);
          }
        }
      }
      
      console.log('\nTabloları oluşturma işlemi tamamlandı!');
      
      // Admin kullanıcısı ekleme
      console.log('\nAdmin kullanıcısı ekleniyor...');
      
      // Önce eski admin kullanıcılarını kontrol et
      const adminCheck = await queryRunner.query(`
        SELECT * FROM "admin" WHERE "username" = 'egehelvaci'
      `);
      
      if (adminCheck && adminCheck.length > 0) {
        console.log('Admin kullanıcısı zaten var, siliniyor...');
        await queryRunner.query(`
          DELETE FROM "admin" WHERE "username" = 'egehelvaci'
        `);
      }
      
      // Yeni admin kullanıcısı ekle
      await queryRunner.query(`
        INSERT INTO "admin" ("username", "password", "email", "fullName")
        VALUES ('egehelvaci', 'ege2141486', 'egehelvaci@example.com', 'Ege Helvacı')
      `);
      
      console.log('Admin kullanıcısı eklendi: egehelvaci');
      
    } catch (error) {
      console.error('Hata oluştu:', error);
    } finally {
      await queryRunner.release();
    }
    
    // Bağlantıyı kapat
    await AppDataSource.destroy();
    console.log("Bağlantı kapatıldı!");
    
  } catch (error) {
    console.error('Bağlantı hatası:', error);
  } finally {
    process.exit(0);
  }
}

syncDB(); 