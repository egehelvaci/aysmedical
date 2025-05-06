import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/typeorm';
import { ContactMessage } from '@/entities/ContactMessage';
import { isAuthenticated } from '@/lib/auth';

// PUT - Mesajı okundu/okunmadı olarak işaretle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin yetki kontrolü
    const isAdmin = await isAuthenticated(request);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır' },
        { status: 401 }
      );
    }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz mesaj ID' },
        { status: 400 }
      );
    }
    
    // İsteğin URL'inden hangi duruma güncelleyeceğimizi belirleyelim
    // Örnek: /api/admin/messages/123/status/read veya /api/admin/messages/123/status/unread
    // Bu örnekte pathname'in son kısmı önemli
    const pathname = request.nextUrl.pathname;
    const isRead = pathname.endsWith('/read');
    
    // Veritabanı bağlantısını al
    const dataSource = await getDataSource();
    
    // Mesajı getir
    const messageRepository = dataSource.getRepository(ContactMessage);
    const message = await messageRepository.findOne({ where: { id } });
    
    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }
    
    // Mesajı güncelle
    message.isRead = isRead;
    await messageRepository.save(message);
    
    return NextResponse.json({ 
      success: true,
      message: `Mesaj ${isRead ? 'okundu' : 'okunmadı'} olarak işaretlendi`,
      isRead 
    });
  } catch (error) {
    console.error('Mesaj durumu güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Mesaj durumu güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 