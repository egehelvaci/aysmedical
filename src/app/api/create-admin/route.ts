import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Admin oluşturma api'si
export async function GET(request: NextRequest) {
  try {
    // Secret key kontrolünü atla

    try {
      // Varsayılan admin oluştur
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
        message: 'Yeni admin kullanıcısı başarıyla oluşturuldu',
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
    // Secret key kontrolünü atla

    try {
      // Varsayılan admin oluştur
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
        message: 'Yeni admin kullanıcısı başarıyla oluşturuldu',
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
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Bir hata oluştu',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 