# TypeORM'dan Prisma'ya Geçiş Rehberi

Bu rehber, AYS Medical projesinde TypeORM'dan Prisma'ya geçiş sürecini anlatmaktadır. Bu geçiş, daha iyi tip güvenliği, daha iyi geliştirici deneyimi ve daha güvenilir veritabanı işlemleri için yapılmaktadır.

## Geçiş Hazırlığı

1. Gerekli paketleri yükleyin:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

2. Prisma'yı başlatın:

```bash
npx prisma init
```

3. `.env` dosyasında `DATABASE_URL` değişkeninin doğru veritabanı bağlantı bilgilerine sahip olduğunu kontrol edin:

```
DATABASE_URL="postgresql://username:password@localhost:5432/aysmedical?schema=public"
```

## Geçiş Adımları

1. TypeORM entity yapısını Prisma şemasına dönüştürün (`prisma/schema.prisma`):

```bash
# Prisma şemasını oluşturup düzenledik. Artık DB ile senkronize etmemiz gerekiyor.
npx prisma db push
# veya
npm run prisma:migrate:dev -- --name initial
```

2. Prisma istemcisini oluşturun:

```bash
npm run prisma:generate
```

3. TypeORM'dan verileri Prisma'ya aktarın:

```bash
npm run db:migrate-to-prisma
```

4. API rotalarını güncelleme:
   - Tüm API dosyalarında TypeORM yerine Prisma kullanacak şekilde güncellemeler yapın
   - Örnek olarak `src/app/api/products/route.ts` ve diğer dosyaları güncelledik

## Geçişin Tamamlanması

1. TypeORM bağımlılıklarını kaldırın (eski kodlar tamamen güncellendikten sonra):

```bash
npm uninstall typeorm reflect-metadata
```

2. Eski TypeORM entity dosyalarını silin veya arşivleyin (isteğe bağlı).

3. Uygulamayı yeniden başlatın ve tüm özelliklerin çalıştığını doğrulayın.

## Prisma Avantajları

- Daha iyi tip güvenliği ve otomatik tamamlama desteği
- Daha az hata yapma olasılığı
- Daha iyi sorgu performansı ve optimizasyon
- Daha güvenilir ilişki yönetimi
- Prisma Studio ile veritabanı yönetimi
- Daha kolay şema değişikliği yönetimi

## Sık Karşılaşılan Sorunlar ve Çözümleri

### 1. ID Alanları

Prisma'da ID alanlarını şu şekilde tanımlıyoruz:

```prisma
id Int @id @default(autoincrement())
```

### 2. İlişki Tanımlamaları

Prisma'da ilişkiler daha açık ve anlaşılır:

```prisma
// Bir-çok ilişki
model Product {
  id Int @id @default(autoincrement())
  localizations ProductLocalization[]
}

model ProductLocalization {
  id Int @id @default(autoincrement())
  productId Int
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### 3. Veritabanı Bağlantısı

TypeORM'daki `getDataSource()` yerine Prisma'da singleton client yapısı kullanılıyor:

```typescript
import { prisma } from '@/lib/prisma';

// Kullanım
const products = await prisma.product.findMany();
```

### 4. İlişkili Verileri Sorgulama

TypeORM'un `relations` özelliği yerine Prisma'nın `include` özelliğini kullanıyoruz:

```typescript
const products = await prisma.product.findMany({
  include: {
    localizations: true,
    features: true
  }
});
```

### 5. Transactions

Prisma'da transaction kullanımı daha kolay:

```typescript
const result = await prisma.$transaction(async (tx) => {
  const product = await tx.product.create({ data: {...} });
  await tx.productLocalization.create({ data: {...} });
  return product;
});
```

## Yararlı Bağlantılar

- [Prisma Dokümantasyonu](https://www.prisma.io/docs/)
- [Prisma Şema Referansı](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference) 