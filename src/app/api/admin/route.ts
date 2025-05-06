import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Varsayılan admin oluşturma endpoint'i
export async function GET(request: NextRequest) {
  try {
    // Mevcut admin kontrolü
    const existingAdmin = await prisma.admin.findFirst();
    
    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: 'Admin zaten mevcut',
        admin: { username: existingAdmin.username }
      });
    }
    
    // Admin yoksa oluştur
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('AysMedical.951', saltRounds);
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin başarıyla oluşturuldu',
      admin: { username: admin.username }
    });
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Admin oluşturulurken bir hata meydana geldi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 