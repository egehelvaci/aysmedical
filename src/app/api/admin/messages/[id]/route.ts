import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET - Belirli bir mesaj detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin yetki kontrolü
    const authResult = await isAuthenticated(request);
    
    if (!authResult.authenticated) {
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
    
    // Mesaj detayını getir
    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });
    
    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Mesaj detayı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Mesaj detayı yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Belirli bir mesajı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Admin yetki kontrolü
    const authResult = await isAuthenticated(request);
    
    if (!authResult.authenticated) {
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
    
    // Mesajı silmeden önce kontrol et
    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });
    
    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj bulunamadı' },
        { status: 404 }
      );
    }
    
    // Mesajı sil
    await prisma.contactMessage.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Mesaj başarıyla silindi' 
    });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    return NextResponse.json(
      { error: 'Mesaj silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// OPTIONS isteği için CORS desteği
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}
