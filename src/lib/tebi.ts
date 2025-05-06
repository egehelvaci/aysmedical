import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import slugify from 'slugify';
import { TEBI_API_KEY, TEBI_SECRET_KEY, TEBI_BUCKET_NAME, TEBI_MASTER_KEY, TEBI_BUCKET } from '@/config/env';

// Tebi.io için konfigürasyon
// Tebi, S3, FTP/FTPS ve DataStream protokollerini destekler
// GeoDNS ile otomatik olarak en yakın veri merkezine yönlendirilir

// S3 protokolü için endpoint - global erişim için s3.tebi.io
const S3_ENDPOINT = "https://s3.tebi.io";

// Bucket bilgileri - config/env.ts'den alınır
const BUCKET_NAME = TEBI_BUCKET || TEBI_BUCKET_NAME;

// Ortam değişkenlerini ayrıntılı olarak logla - sorun tespiti için
export function logTebiConfig() {
  console.log('Tebi.io Konfigürasyon Detayları:', {
    endpoint: S3_ENDPOINT,
    bucket: BUCKET_NAME,
    keyLength: TEBI_API_KEY?.length,
    secretLength: TEBI_SECRET_KEY?.length,
    keyProvided: !!TEBI_API_KEY,
    secretProvided: !!TEBI_SECRET_KEY,
    keyFirstChars: TEBI_API_KEY?.substring(0, 5) + '...',
    secretFirstChars: TEBI_SECRET_KEY?.substring(0, 3) + '...',
  });
}

// S3 istemcisi oluştur
export const getS3Client = () => {
  // Kimlik bilgilerini kontrol et
  if (!TEBI_API_KEY || !TEBI_SECRET_KEY || !BUCKET_NAME) {
    console.error("Tebi.io yapılandırma hatası: Eksik kimlik bilgileri");
    throw new Error("Tebi.io kimlik bilgileri eksik. Lütfen çevre değişkenlerini kontrol edin.");
  }
  
  // S3 istemcisi oluştur - kimlik bilgilerini loglamadan
  console.log("Tebi.io S3 bağlantısı hazırlanıyor");
  
  try {
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

// Dosyayı Tebi.io'ya yükleme - sadece sunucu tarafında çalışır
export async function uploadToTebi(params: {
  file: File;
  maxSizeInBytes?: number;
  checkFileType?: boolean;
  allowedFileTypes?: string[];
  path: string;
}): Promise<{ success: boolean; fileUrl: string; message?: string }> {
  const { file, maxSizeInBytes, checkFileType, allowedFileTypes, path } = params;

  // Kimlik bilgilerini kontrol et
  if (!TEBI_API_KEY || !TEBI_SECRET_KEY || !BUCKET_NAME) {
    console.error('Tebi Yükleme: Eksik kimlik bilgileri', { 
      apiKeyExists: !!TEBI_API_KEY, 
      secretKeyExists: !!TEBI_SECRET_KEY, 
      bucketExists: !!BUCKET_NAME 
    });
    return {
      success: false,
      fileUrl: '',
      message: 'Depolama servisi yapılandırması eksik. Lütfen yöneticinize başvurun.'
    };
  }

  // Dosya boyutunu kontrol et
  if (maxSizeInBytes && file.size > maxSizeInBytes) {
    const maxSizeMB = Math.round(maxSizeInBytes / (1024 * 1024));
    return {
      success: false,
      fileUrl: '',
      message: `Dosya boyutu çok büyük. Maksimum dosya boyutu: ${maxSizeMB}MB`
    };
  }

  // Dosya türünü kontrol et
  if (checkFileType && allowedFileTypes && allowedFileTypes.length > 0) {
    const fileType = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedFileTypes.includes(fileType)) {
      return {
        success: false,
        fileUrl: '',
        message: `Desteklenmeyen dosya türü. İzin verilen dosya türleri: ${allowedFileTypes.join(', ')}`
      };
    }
  }

  // Dosya adını temizle
  const fileName = slugify(file.name, {
    replacement: '_',
    lower: true,
    strict: true,
    trim: true
  });

  try {
    // Dosyanın içerik türünü belirle
    let contentType = file.type;
    if (!contentType || contentType === 'application/octet-stream') {
      const extension = fileName.split('.').pop()?.toLowerCase();
      contentType = extension ? getMimeType(extension) : 'application/octet-stream';
    }

    console.log('Tebi Yükleme: Dosya bilgileri', { 
      fileName, 
      contentType, 
      fileSize: file.size, 
      uploadPath: path 
    });

    // S3 istemcisini yapılandır
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: S3_ENDPOINT,
      credentials: {
        accessKeyId: TEBI_API_KEY,
        secretAccessKey: TEBI_SECRET_KEY
      },
      forcePathStyle: true
    });

    // Dosya yolunu zaman damgasıyla oluştur
    const timestamp = Date.now();
    const fullPath = `${path}/upload-${timestamp}-${fileName}`;
    console.log(`Tebi Yükleme: Dosya yükleniyor... Tam yol: ${fullPath}`);

    // Dosyayı ArrayBuffer'a dönüştür
    const arrayBuffer = await file.arrayBuffer();
    const bodyBuffer = Buffer.from(arrayBuffer);

    // S3 komutunu oluştur
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fullPath,
      Body: bodyBuffer,
      ContentType: contentType,
      ACL: 'public-read'
    });

    // Dosyayı yükle
    console.log('Tebi Yükleme: S3 komutu çalıştırılıyor...');
    console.log('Tebi Yükleme: Kullanılan Kimlik Bilgileri:', {
      bucket: BUCKET_NAME,
      apiKey: TEBI_API_KEY.substring(0, 5) + '...' + TEBI_API_KEY.substring(TEBI_API_KEY.length - 3),
      secretKeyLength: TEBI_SECRET_KEY.length,
      endpoint: S3_ENDPOINT
    });
    
    const response = await s3Client.send(command);
    console.log('Tebi Yükleme: S3 yanıtı alındı', response);

    // Başarılı yanıt oluştur
    const mainUrl = `https://s3.tebi.io/${BUCKET_NAME}/${fullPath}`;
    const alternativeUrls = [
      `https://${BUCKET_NAME}.storage.tebi.io/${fullPath}`,
      `https://${BUCKET_NAME}.s3.tebi.io/${fullPath}`,
      `https://storage.tebi.io/${BUCKET_NAME}/${fullPath}`
    ];
    
    console.log(`Tebi Yükleme: Başarılı! URL: ${mainUrl}`);

    return {
      success: true,
      fileUrl: mainUrl,
      alternativeUrls
    };
  } catch (error) {
    console.error('Tebi Yükleme: Hata oluştu', error);
    return {
      success: false,
      fileUrl: '',
      message: error instanceof Error ? error.message : 'Dosya yükleme sırasında beklenmeyen bir hata oluştu'
    };
  }
}

// Dosyayı Tebi.io'dan silme
export const deleteFromTebi = async (fileId: string) => {
  try {
    // Kimlik bilgilerini yeniden kontrol et
    if (!TEBI_API_KEY || !TEBI_SECRET_KEY || !BUCKET_NAME) {
      throw new Error('Tebi.io yapılandırması eksik. Lütfen çevre değişkenlerini kontrol edin.');
    }

    // FileId'yi güvenli hale getir
    const sanitizedFileId = fileId.replace(/[^a-zA-Z0-9-_/.]/g, '-');
    
    console.log('Tebi.io: Silme işlemi başlatılıyor', {
      dosyaYolu: sanitizedFileId
    });
    
    // S3 istemcisini oluştur
    const s3Client = getS3Client();
    
    // S3 silme komutu oluştur
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: sanitizedFileId
    });
    
    // Silme işlemini gerçekleştir
    console.log('Tebi.io: S3 silme isteği gönderiliyor');
    const response = await s3Client.send(command);
    
    console.log('Tebi.io: Silme başarılı');
    
    // Başarılı dönüş
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Tebi.io Silme Hatası:', error instanceof Error ? error.message : 'Bilinmeyen hata');
    
    // Hata dönüşü - hassas bilgiler olmadan
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Dosya uzantısına göre MIME türü belirle
export function getMimeType(extension: string): string {
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'ico': 'image/x-icon',
  };
  
  return contentTypes[extension] || 'application/octet-stream';
} 