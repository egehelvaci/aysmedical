import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { TEBI_API_KEY, TEBI_SECRET_KEY, TEBI_BUCKET_NAME, TEBI_MASTER_KEY } from '@/config/env';

// Yeni S3 istemcisi oluştur - hardcoded kimlik bilgileriyle
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
  console.log('📤 Yükleme işlemi başlatıldı');
  console.log('📋 API yapılandırması:', { 
    bucket: TEBI_BUCKET_NAME,
    apiKey: 'y5IciFqGjvL4lOri',
    secretKeyLength: 'TPEJjwXpzfkARHhMjfbIfL52xxMowpLwSFZAbEpv'.length
  });

  try {
    // Form verilerini al
    const formData = await request.formData();
    
    // Dosya kontrolü
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      console.error('❌ Geçerli dosya bulunamadı');
      return NextResponse.json({ 
        success: false, 
        error: 'Lütfen bir dosya seçin'
      }, { status: 400 });
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      console.error('❌ Desteklenmeyen dosya tipi:', file.type);
      return NextResponse.json({ 
        success: false, 
        error: 'Lütfen bir resim dosyası seçin (.jpg, .png, .gif, vb.)'
      }, { status: 400 });
    }

    // Dosya bilgilerini logla
    console.log('📁 Dosya bilgileri:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    // Dosyayı buffer'a dönüştür
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Dosya adı formatla (upload-timestamp-filename.ext)
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `upload-${timestamp}-${safeFileName}`;
    
    // Bucket adını kontrol et
    const bucketName = TEBI_BUCKET_NAME || 'aysmedical';

    try {
      console.log('⬆️ Tebi.io\'ya yükleniyor:', fileName);
      // Tebi.io API'si ile dosya yükleme
      const uploadResult = await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read' as ObjectCannedACL
      }));
      
      console.log('✅ Yükleme başarılı:', uploadResult.$metadata);
      
      // İstenen URL formatına göre URL oluştur
      const mainUrl = `https://s3.tebi.io/${bucketName}/${fileName}`;
      
      // Alternatif URL'ler
      const alternativeUrls = [
        `https://${bucketName}.storage.tebi.io/${fileName}`,
        `https://${bucketName}.s3.tebi.io/${fileName}`,
        `https://storage.tebi.io/${bucketName}/${fileName}`
      ];

      // Başarılı yanıt
      return NextResponse.json({
        success: true,
        url: mainUrl, // Ana URL
        alternativeUrls, // Alternatif URL'ler
        bucket: bucketName,
        fileName,
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