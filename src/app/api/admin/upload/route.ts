import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/auth';
import { TEBI_API_KEY, TEBI_BUCKET_NAME } from '@/config/env';

export async function POST(request: NextRequest) {
  // Admin kimlik doğrulama kontrolü
  const authError = await adminAuthMiddleware(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (örn. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece görseller yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya içeriğini buffer olarak al
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${timestamp}-${originalName}`;
    
    // tebi.io'ya yükleme yapma
    const tebiApiKey = TEBI_API_KEY;
    const bucketName = TEBI_BUCKET_NAME;
    
    if (!tebiApiKey || !bucketName) {
      return NextResponse.json(
        { error: 'Tebi konfigürasyonu eksik' },
        { status: 500 }
      );
    }

    // tebi.io API endpoint
    const endpoint = `https://api.tebi.io/objects/${bucketName}/${fileName}`;

    // Görsel yükleme
    const uploadResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tebiApiKey}`,
        'Content-Type': fileType,
      },
      body: buffer
    });

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { error: 'Görsel yükleme hatası' },
        { status: 500 }
      );
    }

    // Görsel URL'sini oluştur
    const imageUrl = `https://${bucketName}.storage.tebi.io/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Görsel yükleme sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 