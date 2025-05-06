import "reflect-metadata";
import { DataSource } from "typeorm";
import { DATABASE_URL } from "@/config/env";
import { Admin } from "@/entities/Admin";
import { Product } from "@/entities/Product";
import { ProductLocalization } from "@/entities/ProductLocalization";
import { ProductFeature } from "@/entities/ProductFeature";
import { ProductDetail } from "@/entities/ProductDetail";
import { ProductUsageArea } from "@/entities/ProductUsageArea";
import { ContactMessage } from "@/entities/ContactMessage";

// TypeORM veri kaynağı singletons oluşturmaktan kaçınma
let dataSource: DataSource | null = null;

/**
 * TypeORM DataSource'u singleton olarak oluşturur
 */
export const getDataSource = async (): Promise<DataSource> => {
  if (dataSource === null) {
    try {
      // URL'i TypeORM'a uygun formata dönüştür
      const url = new URL(DATABASE_URL);
      
      console.log("Veritabanı bağlantısı oluşturuluyor...");
      
      // DataSource oluştur
      dataSource = new DataSource({
        type: "postgres",
        host: url.hostname,
        port: parseInt(url.port || "5432"),
        username: url.username,
        password: url.password,
        database: url.pathname.substring(1), // başındaki '/' karakterini kaldır
        synchronize: true, // Tabloları otomatik oluştur
        logging: process.env.NODE_ENV === "development",
        entities: [
          Admin, 
          Product, 
          ProductLocalization, 
          ProductFeature, 
          ProductDetail, 
          ProductUsageArea, 
          ContactMessage
        ],
        ssl: {
          rejectUnauthorized: false // Neon.tech gibi SSL gerektiren veritabanları için
        }
      });

      // Bağlantıyı başlat
      await dataSource.initialize();
      console.log("TypeORM veritabanı bağlantısı başarıyla kuruldu");
    } catch (error) {
      console.error("Veritabanı bağlantı hatası:", error);
      throw error;
    }
  }

  return dataSource;
};

/**
 * Varsa mevcut bağlantıyı kapatır
 */
export const closeConnection = async (): Promise<void> => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
    console.log("TypeORM bağlantısı kapatıldı");
  }
};

// Uygulama kapatılırken bağlantıyı kapat - Edge Runtime ile uyumlu olması için kaldırıldı
// Edge'de çalışmayan process.on kullanımını kaldırdık

export { dataSource }; 