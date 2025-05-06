import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { TEBI_API_KEY, TEBI_SECRET_KEY, TEBI_BUCKET_NAME } from '@/config/env';

// S3 protokolü için endpoint
const S3_ENDPOINT = "https://s3.tebi.io";
const BUCKET_NAME = TEBI_BUCKET_NAME;

// S3 istemcisi oluştur
const getS3Client = () => {
  // Kimlik bilgilerini kontrol et
  if (!TEBI_API_KEY || !TEBI_SECRET_KEY || !BUCKET_NAME) {
    console.error("Tebi.io yapılandırma hatası: Eksik kimlik bilgileri");
    throw new Error("Tebi.io kimlik bilgileri eksik. Lütfen çevre değişkenlerini kontrol edin.");
  }
  
  console.log("Tebi.io S3 bağlantısı hazırlanıyor");
  
  try {
    // Kimlik bilgilerini log için maskele
    console.log("Tebi.io kimlik bilgilerini kullanıyor:", {
      accessKeyLength: TEBI_API_KEY.length,
      secretKeyLength: TEBI_SECRET_KEY.length,
      accessKeyStart: TEBI_API_KEY.substring(0, 5) + "...",
      secretKeyStart: TEBI_SECRET_KEY.substring(0, 3) + "...",
      bucketName: BUCKET_NAME
    });
    
    return new S3Client({
      region: "auto", // GeoDNS otomatik olarak yönlendirir
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: TEBI_API_KEY, 
        secretAccessKey: TEBI_SECRET_KEY
      },
      forcePathStyle: true, // S3 uyumlu API için gerekli
      maxAttempts: 3 // Başarısızlık durumunda en fazla 3 deneme yap
    });
  } catch (error) {
    console.error("Tebi.io S3 istemcisi oluşturma hatası:", error);
    throw new Error("S3 istemcisi oluşturulamadı: " + 
      (error instanceof Error ? error.message : "Bilinmeyen hata"));
  }
};

// POST işleyicisi - base64 görsel yükleme
export async function POST(request: NextRequest) {
  console.log('📤 Tebi.io Base64 görsel yükleme başlatıldı');
  
  try {
    // JSON verisini al
    const data = await request.json();
    
    // Gerekli alanları kontrol et
    if (!data.fileName || !data.fileType || !data.fileData) {
      console.error('❌ Gerekli veriler eksik');
      return NextResponse.json({ 
        success: false, 
        error: 'fileName, fileType ve fileData alanları gereklidir'
      }, { status: 400 });
    }

    // Base64 verisi doğru formatta mı kontrol et
    const base64Data = data.fileData;
    if (!base64Data.startsWith('data:') && !base64Data.includes(';base64,')) {
      // Eğer veri raw base64 ise, doğrudan kullan
      // Aksi halde, veriyi kontrol et
      if (!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(base64Data)) {
        console.error('❌ Geçersiz base64 veri formatı');
        return NextResponse.json({ 
          success: false, 
          error: 'Geçersiz base64 veri formatı'
        }, { status: 400 });
      }
    }

    // Base64 veriyi buffer'a dönüştür
    let buffer: Buffer;
    
    if (base64Data.startsWith('data:')) {
      // data:image/jpeg;base64,/9j/4AAQ... formatı
      const base64String = base64Data.split(';base64,').pop() || '';
      buffer = Buffer.from(base64String, 'base64');
    } else {
      // Raw base64 verisi
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Dosya adını temizle ve hazırla
    const fileName = data.fileName.replace(/\s+/g, '-').toLowerCase();
    const path = data.path || 'uploads';
    const timestamp = Date.now();
    const fullPath = `${path}/upload-${timestamp}-${fileName}`;
    
    // Dosya bilgilerini logla
    console.log('📝 Tebi Base64 Yükleme: Dosya bilgileri', { 
      fileName, 
      fileType: data.fileType, 
      fileSize: `${(buffer.length / 1024).toFixed(2)} KB`, 
      uploadPath: fullPath 
    });

    try {
      // S3 istemcisini oluştur
      const s3Client = getS3Client();
      
      // S3 komutunu oluştur
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fullPath,
        Body: buffer,
        ContentType: data.fileType,
        ACL: 'public-read'
      });

      // Dosyayı yükle
      console.log('⏳ Tebi Base64 Yükleme: S3 komutu çalıştırılıyor...');
      const response = await s3Client.send(command);
      console.log('✅ Tebi Base64 Yükleme: S3 yanıtı alındı', response);

      // Dosya URL'lerini oluştur
      const mainUrl = `https://s3.tebi.io/${BUCKET_NAME}/${fullPath}`;
      
      // Alternatif URL'ler
      const alternativeUrls = [
        `https://${BUCKET_NAME}.storage.tebi.io/${fullPath}`,
        `https://${BUCKET_NAME}.s3.tebi.io/${fullPath}`,
        `https://storage.tebi.io/${BUCKET_NAME}/${fullPath}`
      ];

      console.log(`🔗 Tebi Base64 Yükleme: Başarılı! Ana URL: ${mainUrl}`);

      // Başarılı yanıt
      return NextResponse.json({
        success: true,
        url: mainUrl,
        alternativeUrls,
        bucket: BUCKET_NAME,
        path: fullPath,
        fileName,
        fileSize: buffer.length,
        fileType: data.fileType,
        uploadedAt: new Date().toISOString()
      });
    } catch (s3Error) {
      console.error('❌ S3 hatası:', s3Error);
      
      // Detaylı hata mesajını logla
      if (s3Error instanceof Error) {
        console.error('Hata detayları:', {
          name: s3Error.name,
          message: s3Error.message,
          stack: s3Error.stack
        });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Dosya yüklenirken hata oluştu',
        details: s3Error instanceof Error ? s3Error.message : 'Bilinmeyen hata',
        code: s3Error instanceof Error ? s3Error.name : 'UnknownError'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Genel hata:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'İşlem sırasında beklenmeyen bir hata oluştu'
    }, { status: 500 });
  }
} 