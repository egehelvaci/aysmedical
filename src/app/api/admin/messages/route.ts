import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/typeorm';
import { ContactMessage } from '@/entities/ContactMessage';
import { isAuthenticated } from '@/lib/auth';

// Tüm mesajları getir
export async function GET(request: NextRequest) {
  try {
    // Admin yetki kontrolü
    const isAdmin = await isAuthenticated(request);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır' },
        { status: 401 }
      );
    }
    
    // Veritabanı bağlantısını al
    const dataSource = await getDataSource();
    
    // Mesajları, en yeni en üstte olacak şekilde getir
    const messages = await dataSource
      .getRepository(ContactMessage)
      .createQueryBuilder('message')
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Mesajlar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// OPTIONS isteği için CORS desteği
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
