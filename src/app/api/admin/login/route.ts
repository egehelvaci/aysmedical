import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/typeorm'; // prisma yerine typeorm kullanılacak
import { Admin } from '@/entities/Admin';
import bcrypt from 'bcrypt';
import { corsMiddleware } from '@/app/api/cors-middleware';

// Node.js runtime kullan - Edge desteklenmiyor
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log('Login isteği alındı:', { username });

    // Kullanıcı adı ve şifre kontrolü
    if (!username || !password) {
      console.log('Eksik bilgi: Kullanıcı adı veya şifre eksik');
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    try {
      // TypeORM DataSource'a bağlan
      const dataSource = await getDataSource();
      const adminRepository = dataSource.getRepository(Admin);
      
      // Kullanıcının veritabanında aranması
      const admin = await adminRepository.findOne({
        where: { username }
      });

      // Kullanıcı bulunamadıysa
      if (!admin) {
        console.log('Kullanıcı bulunamadı:', username);
        return NextResponse.json(
          { error: 'Geçersiz kullanıcı adı veya şifre' },
          { status: 401 }
        );
      }

      // Şifre kontrolü - eğer hash kullanılmıyorsa direkt karşılaştır
      let passwordMatch = false;
      
      if (admin.password.startsWith('$2')) {
        // Şifre bcrypt ile hashlenmişse
        passwordMatch = await bcrypt.compare(password, admin.password);
      } else {
        // Şifre düz metin olarak saklanmışsa (güvenlik açısından önerilmez)
        passwordMatch = (password === admin.password);
      }
      
      if (!passwordMatch) {
        console.log('Şifre eşleşmedi:', username);
        return NextResponse.json(
          { error: 'Geçersiz kullanıcı adı veya şifre' },
          { status: 401 }
        );
      }

      console.log('Giriş başarılı:', username);

      // Response oluştur
      const response = NextResponse.json({
        success: true,
        message: 'Giriş başarılı',
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName || '',
        },
      });

      // Güvenli cookie ayarları
      response.cookies.set('admin_logged_in', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 6, // 6 saat
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Üretim ortamında secure kullanın
      });

      console.log('Session cookie ayarlandı: admin_logged_in');
      
      // CORS başlıklarını ekle
      return corsMiddleware(request, response);
    } catch (dbError) {
      console.error('Veritabanı hatası:', dbError);
      return NextResponse.json(
        { 
          error: 'Veritabanı hatası oluştu',
          details: dbError instanceof Error ? dbError.message : 'Bilinmeyen hata'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'Bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

// OPTIONS isteği için CORS desteği
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 saat
    }
  });
}