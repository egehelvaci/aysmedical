# Ürün Yönetim Paneli (Admin Panel) Gereksinim Belgesi (PRD)

## 1. Genel Bakış

Bu PRD, mevcut web sitesi için bir yönetici paneli oluşturulmasına ilişkin gereksinimleri tanımlamaktadır. Panel, site içeriğinin dinamik olarak yönetilmesini sağlayacak ve kullanıcı arayüzünde görünen verilerin gerçek zamanlı olarak güncellenmesine olanak tanıyacaktır.

## 2. Teknik Gereksinimler

- **Veritabanı**: NeonDB PostgreSQL veritabanı kullanılacak
- **Görsel Yükleme**: tebi.io ile entegre edilecek
- **Deployment**: Vercel ile uyumlu olacak
- **Arayüz**: Responsive tasarıma sahip olacak (Mobil ve masaüstü)
- **Oturum Yönetimi**: JWT tabanlı kimlik doğrulama sistemi

## 3. Veri Modeli

Mevcut veritabanı şeması şu tabloları içermektedir:
- Products
- Product_localizations
- Product_features
- Product_details
- Product_gallery
- Admins

## 4. Özellikler

### Kullanıcı Yönetimi
- Admin kullanıcıları için giriş/çıkış sistemi
- Şifre sıfırlama mekanizması
- Oturum yönetimi ve güvenlik

### İçerik Yönetimi
- Ürün ekleme, düzenleme ve silme
- Ürünler için dil bazlı içerik yönetimi (Türkçe ve İngilizce)
- Ürün özelliklerinin yönetimi
- Ürün görselleri yükleme ve yönetme

### Medya Yönetimi
- tebi.io ile görsel yükleme entegrasyonu
- Görsel önizleme ve kırpma
- Yüklenen görsellerin veritabanında URL olarak saklanması

### Raporlama
- Basit dashboard ile genel içerik istatistikleri
- İçerik değişiklik geçmişi

## 5. Kullanıcı Arayüzü

### Sayfa Yapısı
- Giriş sayfası
- Ana kontrol paneli
- Ürün listeleme ve yönetim sayfaları
- Görsel yönetim sayfası
- Ayarlar sayfası

### Bileşenler
- Responsive sidebar navigasyon
- Yeni içerik oluşturma formları
- İçerik listeleme ve filtreleme tabloları
- Görsel yükleme ve yönetim arayüzü
- Form validasyonu ve hata mesajları

## 6. API Yapısı

- `/api/admin/login`: Kimlik doğrulama
- `/api/admin/logout`: Oturum sonlandırma
- `/api/admin/products`: Ürün CRUD işlemleri
- `/api/admin/upload`: Görsel yükleme

## 7. Yapılacaklar

1. **Veritabanı Entegrasyonu**
   - NeonDB bağlantısı kurulumu
   - Mevcut statik verilerin veritabanına aktarılması

2. **Kimlik Doğrulama Sistemi**
   - JWT tabanlı auth sistemi oluşturma
   - Middleware ve koruma katmanı oluşturma

3. **Görsel Yükleme Sistemi**
   - tebi.io API entegrasyonu
   - Görsel yükleme, önizleme ve kırpma komponentleri

4. **Admin Arayüzü**
   - Dashboard oluşturma
   - İçerik yönetim formları
   - Responsive tasarım

5. **Veri Entegrasyonu**
   - API endpoint'leri oluşturma
   - Veri doğrulama ve işleme
   - Son kullanıcı sayfalarıyla entegrasyon

6. **Test ve Deploy**
   - Vercel ile deploy etme
   - Performans ve güvenlik testleri

## 8. Tamamlananlar

Henüz projeye başlanmadığından tamamlanan herhangi bir bileşen bulunmamaktadır. Mevcut proje verileri şunları içermektedir:

- Temel web sitesi yapısı
- Ürünler için statik veri yapısı (şimdilik dosya tabanlı)
- SQL veritabanı şeması tanımları
- Admin kullanıcıları için tablo yapısı

## 9. Önceliklendirme

1. Veritabanı entegrasyonu ve NeonDB kurulumu
2. Kimlik doğrulama sistemi
3. Temel admin arayüzü
4. Ürün yönetim arayüzü
5. Görsel yükleme entegrasyonu
6. Kullanıcı arayüzüyle entegrasyon

## 10. Zaman Çizelgesi

- **1. Faz (1-2 Hafta)**: Veritabanı kurulumu ve kimlik doğrulama sistemi
- **2. Faz (2-3 Hafta)**: Admin arayüzü geliştirme ve temel CRUD işlemleri
- **3. Faz (1-2 Hafta)**: Görsel yükleme ve yönetim sistemi
- **4. Faz (1 Hafta)**: Test, entegrasyon ve deployment

## 11. Teknik Notlar

- Tüm statik içerikler dinamik hale getirilecek
- Next.js API Routes kullanılarak backend işlemleri yapılacak
- Kullanıcı deneyimi açısından form validasyonları client-side yapılacak
- Güvenlik için tüm API endpoint'leri server-side validasyon içerecek
- İçerik değişiklikleri gerçek zamanlı olarak son kullanıcı arayüzünde görünecek
