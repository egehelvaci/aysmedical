import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { TEBI_API_KEY, TEBI_SECRET_KEY, TEBI_BUCKET_NAME, TEBI_MASTER_KEY } from '@/config/env';

// Yeni S3 istemcisi oluştur
const s3Client = new S3Client({
  region: 'auto',
  endpoint: 'https://s3.tebi.io',
  credentials: {
    accessKeyId: 'y5IciFqGjvL4lOri',
    secretAccessKey: 'TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv',
  },
  forcePathStyle: true
});

export async function POST(request: NextRequest) {
  console.log('📤 Base64 yükleme işlemi başlatıldı');
  console.log('📝 API Bilgileri:', {
    accessKeyId: 'y5IciFqGjvL4lOri',
    secretKeyLength: 'TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv'.length,
    bucketName: TEBI_BUCKET_NAME
  });

  try {
    // JSON verilerini al
    const data = await request.json();
    
    // Gerekli alanları kontrol et
    const { fileName, fileType, fileSize, fileData } = data;
    
    if (!fileName || !fileType || !fileData) {
      return NextResponse.json({
        success: false,
        error: 'Eksik veya geçersiz veri'
      }, { status: 400 });
    }
    
    // Base64'ü buffer'a çevir
    const buffer = Buffer.from(fileData, 'base64');
    
    // Dosya adını formatla
    const timestamp = Date.now();
    const safeFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const finalFileName = `upload-${timestamp}-${safeFileName}`;
    
    // Bucket adı
    const bucketName = TEBI_BUCKET_NAME || 'aysmedical';

    console.log('📝 Yükleme bilgileri:', {
      dosyaAdı: finalFileName,
      boyut: `${Math.round(buffer.length / 1024)} KB`,
      tip: fileType
    });

    try {
      // S3'e yükle
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: finalFileName,
        Body: buffer,
        ContentType: fileType,
        ACL: 'public-read' as ObjectCannedACL
      }));
      
      console.log('✅ Base64 yükleme başarılı:', finalFileName);
      
      // İstenen URL formatına göre URL oluştur
      const url = `https://s3.tebi.io/${bucketName}/${finalFileName}`;
      
      // Alternatif URL'ler
      const alternativeUrls = [
        `https://${bucketName}.storage.tebi.io/${finalFileName}`,
        `https://${bucketName}.s3.tebi.io/${finalFileName}`,
        `https://storage.tebi.io/${bucketName}/${finalFileName}`
      ];

      // Başarılı yanıt
      return NextResponse.json({
        success: true,
        url,
        alternativeUrls,
        bucket: bucketName,
        fileName: finalFileName,
        originalName: fileName,
        fileSize: buffer.length,
        fileType,
        uploadedAt: new Date().toISOString()
      });
    } catch (s3Error) {
      console.error('❌ S3 hatası:', s3Error);
      
      return NextResponse.json({
        success: false,
        error: 'Dosya S3 deposuna yüklenirken hata oluştu',
        details: s3Error instanceof Error ? s3Error.message : 'Bilinmeyen hata'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ İşlem hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: 'İstek işlenirken hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 