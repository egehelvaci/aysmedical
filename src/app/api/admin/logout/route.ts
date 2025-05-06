import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Response objesi oluştur
    const response = NextResponse.json({ success: true });
    
    // Session cookie'yi sil
    response.cookies.set('admin_logged_in', '', {
      expires: new Date(0),
      path: '/'
    });
    
    console.log('Session cookie silindi: admin_logged_in');

    // Başarılı çıkış yanıtı
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Çıkış yaparken bir hata oluştu' },
      { status: 500 }
    );
  }
}