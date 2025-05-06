import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Admin oluşturma api'si
export async function GET(request: NextRequest) {
  try {
    // ADMIN_SECRET değişkenini kontrol et
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get('secret');
    
    if (secretKey !== 'aysmed2024') {
      return NextResponse.json({ 
        success: false, 
        error: 'Yetkisiz erişim' 
      }, { status: 401 });
    }
    
    try {
      // Mevcut admin kullanıcılarını kontrol et
      const admins = await prisma.admin.findMany();
      
      if (admins.length > 0) {
        return NextResponse.json({ 
          success: true, 
          message: 'Sistemde zaten admin kullanıcısı mevcut',
          count: admins.length,
          admins: admins.map(admin => ({
            id: admin.id,
            username: admin.username
          }))
        });
      }
      
      // Admin kullanıcısı yoksa yeni oluştur
      // Şifreyi hashle
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('AysMedical.951', saltRounds);
      
      // Yeni admin oluştur ve veritabanına kaydet
      const savedAdmin = await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Yeni admin kullanıcısı oluşturuldu',
        admin: {
          username: savedAdmin.username
        }
      });
    } catch (error) {
      console.error('Admin oluşturma hatası:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı işlemi sırasında bir hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Genel hata:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'İstek işlenirken bir hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

// POST metodu ile kullanıcı oluşturma
export async function POST(request: NextRequest) {
  try {
    // ADMIN_SECRET değişkenini kontrol et
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get('secret');
    
    if (secretKey !== 'aysmed2024') {
      return NextResponse.json({ 
        success: false, 
        error: 'Yetkisiz erişim' 
      }, { status: 401 });
    }

    // İstekten kullanıcı bilgilerini al
    const requestData = await request.json();
    const { username = 'aysmedical', password = 'AysMedical.951' } = requestData;

    // Kullanıcı adını kontrol et, varsa işlemi atla
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin kullanıcısı zaten mevcut',
        admin: {
          username: existingAdmin.username
        }
      });
    }

    // Şifreyi hashle
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Yeni admin oluştur ve veritabanına kaydet
    const savedAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Yeni admin kullanıcısı oluşturuldu',
      admin: {
        username: savedAdmin.username
      }
    });
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Bir hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 