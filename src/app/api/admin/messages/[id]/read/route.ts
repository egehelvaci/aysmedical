import { NextRequest } from 'next/server';
import { getDataSource } from '@/lib/typeorm';
import { ContactMessage } from '@/entities/ContactMessage';
import { isAuthenticated } from '@/lib/auth';
import { createApiResponse, createApiErrorResponse } from '@/app/api/api-utils';

// PUT - Mesajı okundu olarak işaretle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kimlik doğrulama
    const authResult = await isAuthenticated(request);
    if (!authResult.authenticated) {
      return createApiErrorResponse(request, 'Yetkisiz erişim', { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createApiErrorResponse(request, 'Geçersiz mesaj ID', { status: 400 });
    }

    // Veritabanı bağlantısını al
    const dataSource = await getDataSource();
    const messageRepository = dataSource.getRepository(ContactMessage);
    
    // Mesajın varlığını kontrol et
    const existingMessage = await messageRepository.findOne({ 
      where: { id } 
    });

    if (!existingMessage) {
      return createApiErrorResponse(request, 'Mesaj bulunamadı', { status: 404 });
    }

    // Mesajı okundu olarak işaretle
    existingMessage.isRead = true;
    const updatedMessage = await messageRepository.save(existingMessage);

    // Başarılı yanıt döndür
    return createApiResponse(
      request,
      {
        success: true,
        message: 'Mesaj okundu olarak işaretlendi',
        data: updatedMessage
      }
    );
  } catch (error) {
    console.error('Mesaj güncelleme hatası:', error);
    return createApiErrorResponse(
      request,
      'Mesaj durumu güncellenirken bir hata oluştu',
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}

// OPTIONS isteği için CORS desteği
export async function OPTIONS(request: NextRequest) {
  return createApiResponse(request, {}, { status: 200 });
}
