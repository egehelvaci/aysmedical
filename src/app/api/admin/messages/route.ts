import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// Tüm mesajları getir
export async function GET(request: NextRequest) {
  try {
    // Admin yetki kontrolü
    const authResult = await isAuthenticated(request);
    
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz bulunmamaktadır' },
        { status: 401 }
      );
    }
    
    // Mesajları, en yeni en üstte olacak şekilde getir
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
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
