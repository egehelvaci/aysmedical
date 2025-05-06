/**
 * Environment değişkenleri yönetim dosyası
 * .env dosyasının engelli olması durumunda kullanılır
 */

// Veritabanı bağlantı bilgileri
export const DATABASE_URL = 
  process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_hOxe9KmY0cVW@ep-broad-star-a2qtdnoe-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// JWT kimlik doğrulama anahtarı
export const JWT_SECRET = 
  process.env.JWT_SECRET || 
  "your-secret-key-here";

// E-posta/SMTP ayarları
export const SMTP_HOST = process.env.SMTP_HOST || "mail.kurumsaleposta.com";
export const SMTP_PORT = process.env.SMTP_PORT || "587";
export const SMTP_SECURE = process.env.SMTP_SECURE || "false";
export const SMTP_USER = process.env.SMTP_USER || "info@ayshealth.com.tr";
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "AysMedical.951"; 
export const SMTP_FROM = process.env.SMTP_FROM || "info@ayshealth.com.tr";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@ayshealth.com.tr";

// Site URL ve API ayarları
export const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aysmedical.com";
export const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aysmedical.com";

// Tebi.io görsel depolama servisi bilgileri
// ÖNEMLİ: Gerçek projelerde bu değerleri .env dosyasından okuyun veya güvenli bir şekilde yönetin
// ÖNEMLİ: Tebi.io hesabından alınan API anahtarları

// Access Key ID (Bucket Key)
export const TEBI_API_KEY = 
  process.env.TEBI_API_KEY || 
  "y5IciFqGjvL4lOri";

// Secret Access Key (Bucket Secret)
export const TEBI_SECRET_KEY =
  process.env.TEBI_SECRET_KEY ||
  "TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv";

// Master Key - varsayılan olarak Secret Key ile aynı
export const TEBI_MASTER_KEY =
  process.env.TEBI_MASTER_KEY ||
  "TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv";

// Storage bucket adı
export const TEBI_BUCKET_NAME = 
  process.env.TEBI_BUCKET_NAME || 
  "aysmedical";

// Bucket değişken adı alternatifi (döngü oluşturmadan)
export const TEBI_BUCKET = 
  process.env.TEBI_BUCKET || 
  "aysmedical";

// Ortam bilgisi
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

// Döngü oluşturmadan tek bir obje olarak tüm değişkenleri dışa aktarma
export const ENV = {
  DATABASE_URL,
  JWT_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  ADMIN_EMAIL,
  NEXT_PUBLIC_SITE_URL,
  API_BASE_URL,
  TEBI_API_KEY,
  TEBI_SECRET_KEY,
  TEBI_MASTER_KEY,
  TEBI_BUCKET_NAME,
  TEBI_BUCKET,
  IS_PRODUCTION,
  IS_DEVELOPMENT
};

export default ENV; 