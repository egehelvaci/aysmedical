-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS "Admin" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "fullName" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS "Product" (
  "id" SERIAL PRIMARY KEY,
  "code" VARCHAR(255) UNIQUE NOT NULL,
  "image_url" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ürün dil bazlı içerikleri tablosu
CREATE TABLE IF NOT EXISTS "ProductLocalization" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "languageCode" VARCHAR(10) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "slug" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("productId", "languageCode"),
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- Ürün kullanım alanları tablosu
CREATE TABLE IF NOT EXISTS "ProductUsageArea" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "languageCode" VARCHAR(10) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "icon" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- Ürün özellikleri tablosu
CREATE TABLE IF NOT EXISTS "ProductFeature" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "languageCode" VARCHAR(10) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "icon" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- Ürün detayları tablosu
CREATE TABLE IF NOT EXISTS "ProductDetail" (
  "id" SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "languageCode" VARCHAR(10) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- İletişim formu mesajları tablosu
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(255),
  "subject" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "languageCode" VARCHAR(10) NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger fonksiyonu oluştur (updatedAt alanını güncellemek için)
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Her tablo için trigger oluştur
CREATE TRIGGER update_admin_timestamp
BEFORE UPDATE ON "Admin"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_timestamp
BEFORE UPDATE ON "Product"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_localization_timestamp
BEFORE UPDATE ON "ProductLocalization"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_usage_area_timestamp
BEFORE UPDATE ON "ProductUsageArea"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_feature_timestamp
BEFORE UPDATE ON "ProductFeature"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_detail_timestamp
BEFORE UPDATE ON "ProductDetail"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contact_message_timestamp
BEFORE UPDATE ON "ContactMessage"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
