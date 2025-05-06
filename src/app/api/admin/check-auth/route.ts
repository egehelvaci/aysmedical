import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { authenticated, admin } = await isAuthenticated(req);

  if (!authenticated) {
    return NextResponse.json(
      { error: 'Kimlik doğrulama başarısız' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: admin?.id,
      username: admin?.username,
      email: admin?.email,
      fullName: admin?.fullName || '',
    },
  });
} 