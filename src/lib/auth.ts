import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDataSource } from './typeorm'; // prisma yerine typeorm kullanılacak
import { Admin } from '@/entities/Admin';

// Admin kimlik doğrulama middleware
export async function isAuthenticated(req: NextRequest) {
  try {
    // Önce request'ten cookie'yi kontrol et (daha güvenilir)
    const adminLoggedIn = req.cookies.get('admin_logged_in')?.value === 'true';
    
    // Log bilgisi
    console.log('Kimlik doğrulama kontrolü (request cookies):', { adminLoggedIn });
    
    if (!adminLoggedIn) {
      // Eğer request'te yoksa, cookies() API'sini dene
      try {
        const cookieStore = await cookies();
        const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true';
        
        console.log('Kimlik doğrulama kontrolü (cookies API):', { isLoggedIn });
        
        if (!isLoggedIn) {
          console.log('admin_logged_in cookie bulunamadı veya değeri true değil');
          return { authenticated: false, admin: null };
        }
      } catch (cookieError) {
        console.error('Cookie API hatası:', cookieError);
        return { authenticated: false, admin: null };
      }
    }
    
    // Cookie yeterli, veritabanı doğrulamasını atlıyoruz
    return { 
      authenticated: true, 
      admin: { id: 1, username: 'admin', email: 'admin@example.com', fullName: 'Admin' }
    };
  } catch (error) {
    console.error('Kimlik doğrulama hatası:', error);
    return { authenticated: false, admin: null };
  }
}

// Admin API route koruması
export async function adminAuthMiddleware(req: NextRequest) {
  const { authenticated } = await isAuthenticated(req);

  if (!authenticated) {
    return NextResponse.json(
      { error: 'Kimlik doğrulama başarısız' },
      { status: 401 }
    );
  }

  return null; // Devam etmesine izin ver
}

// Çıkış yapma fonksiyonu - API route içinde kullanılmalıdır
export function createLogoutResponse() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_logged_in', '', { 
    expires: new Date(0),
    path: '/'
  });
  return response;
}