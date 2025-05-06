import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Node.js runtime kullan - Edge desteklenmiyor
export const runtime = 'nodejs';

// Ürünleri getiren GET API endpoint'i
export async function GET(request: Request) {
  try {
    // Dil parametresini al
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'tr';

    // Ürünleri getir
    const products = await prisma.product.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        localizations: true,
        features: true,
        usageAreas: true,
        details: true
      }
    });
    
    // Dönüştürülmüş ürün listesi
    const transformedProducts = products.map(product => {
      // Dil filtrelemesi
      const filteredLocalizations = product.localizations.filter(loc => loc.languageCode === lang);
      const filteredFeatures = product.features.filter(feat => feat.languageCode === lang);
      const filteredUsageAreas = product.usageAreas.filter(area => area.languageCode === lang);
      
      return {
        id: product.id,
        code: product.code,
        image_url: product.image_url,
        name: filteredLocalizations[0]?.name || '',
        description: filteredLocalizations[0]?.description || '',
        slug: filteredLocalizations[0]?.slug || '',
        features: filteredFeatures.map(feature => ({
          id: feature.id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon
        })) || [],
        usageAreas: filteredUsageAreas.map(area => ({
          id: area.id,
          title: area.title,
          description: area.description,
          icon: area.icon
        })) || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 