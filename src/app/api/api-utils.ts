import { NextRequest, NextResponse } from 'next/server';
import { corsMiddleware } from './cors-middleware';

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
    headers: options?.headers || {},
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
    }
  );
  
  // CORS başlıklarını ekle
  return corsMiddleware(request, response);
}

/**
 * OPTIONS isteklerini işlemek için standart yanıt
 */
export function handleOptionsRequest() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400', // 24 saat
    }
  });
}
