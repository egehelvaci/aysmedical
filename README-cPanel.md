# AYS Medical Next.js Sitesinin cPanel'e Kurulumu

Bu doküman, Next.js ile geliştirilen AYS Medical web sitesinin cPanel'e kurulumu için adım adım talimatları içerir.

## Ön Hazırlık

Bu site, cPanel hosting'de çalışacak şekilde statik HTML/CSS/JS dosyalarına dönüştürülmüştür. Herhangi bir Node.js çalışma ortamına ihtiyaç duymamaktadır.

## Kurulum Adımları

### 1. Statik Dosyaları Oluştur

Geliştirme ortamınızda aşağıdaki komutu çalıştırarak statik dosyaları oluşturun:

```bash
npm run build
```

Bu komut, `out` klasöründe statik HTML/CSS/JS dosyalarını oluşturacaktır.

### 2. FTP ile Dosyaları Yükle

1. FTP istemcisini kullanarak (FileZilla, Cyberduck vb.) cPanel hesabınıza bağlanın.
2. `out` klasöründeki TÜM dosyaları ve klasörleri cPanel'deki `public_html` klasörüne (veya alt klasöre) yükleyin.
3. `.htaccess` dosyasının düzgün şekilde yüklendiğinden emin olun. Bu dosya genellikle gizlidir, bu yüzden FTP istemcinizin gizli dosyaları gösterme seçeneğini etkinleştirin.

### 3. Temel URL Yapılandırması

Sitenizi bir alt dizine yüklüyorsanız (örn. `public_html/aysmed`), `.htaccess` dosyasındaki `RewriteBase` değerini değiştirmeniz gerekebilir:

```
RewriteBase /aysmed/
```

### 4. Sorun Giderme

#### 404 Hatası Alıyorsanız

1. cPanel > File Manager'a gidin.
2. `.htaccess` dosyasını açın ve içeriğinin bu dokümanda belirtilen içerikle aynı olduğundan emin olun.
3. cPanel'de "MultiPHP INI Editor" veya ".htaccess Editor" aracını kullanarak mod_rewrite modülünün etkin olduğundan emin olun.

#### Resimler/Videolar Yüklenmiyorsa

Medya dosyalarının doğru klasörlere yüklendiğinden emin olun. Dosya yolları `/images/...` şeklinde başlar.

#### Sayfalar Arası Geçişlerde Sorun Varsa

Sayfalar arası geçişlerde sorun yaşıyorsanız, tarayıcı konsolunda hataları kontrol edin ve `.htaccess` dosyasının doğru şekilde yapılandırıldığından emin olun.

## Güncellemeler

Site içeriğinde değişiklik yapmak istediğinizde:

1. Geliştirme ortamında değişiklikleri yapın.
2. `npm run build` komutunu çalıştırın.
3. Oluşturulan yeni dosyaları FTP ile cPanel'e yükleyin.

## Önemli Notlar

- Site, API rotaları veya sunucu tarafı fonksiyonları kullanmak üzere tasarlanmamıştır. Tüm içerik statiktir.
- Form gönderimi gibi işlemler için harici servisler (örn. Formspree) kullanılmalıdır.
- SEO için sayfa metadata'ları önceden oluşturulmuştur.

## Teknik Katkılar

Bu kurulum yapılandırması hakkında sorularınız veya sorunlarınız varsa, lütfen site geliştiricisi ile iletişime geçin. 