import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import slugify from 'slugify';
import { TEBI_API_KEY, TEBI_SECRET_KEY, TEBI_BUCKET_NAME, TEBI_MASTER_KEY } from '@/config/env';
import { v4 as uuidv4 } from 'uuid';

// Tebi.io için konfigürasyon
// Tebi, S3, FTP/FTPS ve DataStream protokollerini destekler
// GeoDNS ile otomatik olarak en yakın veri merkezine yönlendirilir

// S3 protokolü için endpoint - global erişim için s3.tebi.io
const S3_ENDPOINT = "https://s3.tebi.io";

// Bucket bilgileri - .env dosyasından alınır
const BUCKET_NAME = TEBI_BUCKET_NAME || 'aysmedical';

// Yeni S3 istemcisi oluştur - hardcoded kimlik bilgileriyle (çalışan örnek)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: 'https://s3.tebi.io',
  credentials: {
    accessKeyId: 'y5IciFqGjvL4lOri',
    secretAccessKey: 'TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv',
  },
  forcePathStyle: true
});

// Dosya uzantısına göre MIME türü belirle
function getMimeType(extension: string): string {
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

// POST işleyicisi - dosya yükleme
export async function POST(request: NextRequest) {
  console.log('📤 Tebi.io dosya yükleme başlatıldı');
  console.log('📋 API yapılandırması:', { 
    bucket: BUCKET_NAME,
    apiKey: 'y5IciFqGjvL4lOri',
    secretKeyLength: 'TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv'.length
  });
  
  try {
    // Gelen isteği formData olarak işle
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya bilgilerini logla
    console.log('📁 Dosya bilgileri:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Sadece resim dosyaları kabul edilir' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (10MB maksimum)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu maksimum 10MB olabilir' },
        { status: 400 }
      );
    }

    // Dosya adını benzersiz hale getir
    const fileExtension = file.name.split('.').pop() || '';
    const timestamp = Date.now();
    const safeFileName = slugify(file.name, {
      replacement: '-',
      lower: true,
      strict: true,
      trim: true
    });
    const uniqueFileName = `${path}/${timestamp}-${safeFileName}`;

    // Dosyayı Tebi.io'ya yükle
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      console.log('⬆️ Tebi.io\'ya yükleniyor:', uniqueFileName);
      
      // Tebi.io API'si ile dosya yükleme - çalışan örnek yapılandırmasıyla
      const uploadResult = await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: file.type || getMimeType(fileExtension),
        ACL: 'public-read' as ObjectCannedACL
      }));
      
      console.log('✅ Yükleme başarılı:', uploadResult.$metadata);
      
      // İstenen URL formatına göre URL oluştur
      const mainUrl = `https://s3.tebi.io/${BUCKET_NAME}/${uniqueFileName}`;
      
      // Alternatif URL'ler
      const alternativeUrls = [
        `https://${BUCKET_NAME}.storage.tebi.io/${uniqueFileName}`,
        `https://${BUCKET_NAME}.s3.tebi.io/${uniqueFileName}`,
        `https://storage.tebi.io/${BUCKET_NAME}/${uniqueFileName}`
      ];
      
      // Başarılı yanıt
      return NextResponse.json({
        success: true,
        url: mainUrl,
        alternativeUrls,
        fileName: uniqueFileName,
        fileSize: file.size,
        fileType: file.type,
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
        error: 'Görsel yüklenirken hata oluştu',
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

// DELETE işleyicisi - dosya silme
export async function DELETE(request: NextRequest) {
  console.log('🗑️ Tebi.io dosya silme başlatıldı');
  
  try {
    // URL'den dosya yolunu al
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dosya yolu belirtilmedi'
      }, { status: 400 });
    }

    // Sanitize edilen dosya yolu
    const sanitizedFilePath = filePath.replace(/[^a-zA-Z0-9-_/.]/g, '-');
    
    try {
      // S3 silme komutu oluştur
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME || '',
        Key: sanitizedFilePath
      });
      
      // Silme işlemini gerçekleştir
      console.log('Tebi.io: S3 silme isteği gönderiliyor');
      const response = await s3Client.send(command);
      
      console.log('Tebi.io: Silme başarılı', response);
      
      // Başarılı dönüş
      return NextResponse.json({
        success: true,
        path: sanitizedFilePath,
        deletedAt: new Date().toISOString()
      });
    } catch (s3Error) {
      console.error('❌ S3 silme hatası:', s3Error);
      
      return NextResponse.json({ 
        success: false, 
        error: 'Dosya silinirken hata oluştu',
        details: s3Error instanceof Error ? s3Error.message : 'Bilinmeyen hata'
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