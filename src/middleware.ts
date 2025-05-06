import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit middleware - API isteklerini işleyecek
export async function middleware(request: NextRequest) {
  // Normal response ile devam et
  return NextResponse.next();
}

// Hangi path'lerde middleware'in çalışacağını belirt
export const config = {
  // Sadece API rotalarında çalıştır
  matcher: '/api/:path*',
};
