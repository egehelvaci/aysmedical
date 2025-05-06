import { NextRequest, NextResponse } from 'next/server';
import { corsMiddleware } from './cors-middleware';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

/**
 * API yanıtlarını standartlaştırmak ve CORS başlıklarını eklemek için yardımcı fonksiyon
 * Tüm API rotalarında bu fonksiyonu kullanarak tutarlı yanıtlar oluşturabilirsiniz
 */
export function createApiResponse<T>(
  request: NextRequest,
  data: T,
  options?: {
    status?: number;
    headers?: Record<string, string>;
  }
) {
  const response = NextResponse.json(data, {
    status: options?.status || 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      ...(options?.headers || {})
    }
  });
  
  // CORS başlıklarını ekle
  return corsMiddleware(request, response);
}

/**
 * API hata yanıtlarını standartlaştırmak için yardımcı fonksiyon
 */
export function createApiErrorResponse(
  request: NextRequest,
  error: string | Error,
  options?: {
    status?: number;
    details?: any;
    headers?: Record<string, string>;
  }
) {
  const errorMessage = error instanceof Error ? error.message : error;
  const response = NextResponse.json(
    {
      error: errorMessage,
      details: options?.details || null,
    },
    {
      status: options?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        ...(options?.headers || {})
      }
    }
  );
  
  // CORS başlıklarını ekle
  return corsMiddleware(request, response);
}

/**
 * OPTIONS isteklerini işlemek için standart yanıt
 */
export function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400' // 24 saat
    }
  });
}

// Uygulama başlatıldığında admin kullanıcısı oluştur
export const ensureAdminExists = async () => {
  try {
    // Admin varsa işlemi atla
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) return;
    
    // Admin yoksa yeni oluştur
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('AysMedical.951', saltRounds);
    
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });
    
    console.log('Varsayılan admin kullanıcısı oluşturuldu');
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
  }
};
