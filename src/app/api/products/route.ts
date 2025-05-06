import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/typeorm';
import { Product } from '@/entities/Product';

// Node.js runtime kullan - Edge desteklenmiyor
export const runtime = 'nodejs';

// Ürünleri getiren GET API endpoint'i
export async function GET(request: Request) {
  try {
    // Veritabanı bağlantısını al
    const dataSource = await getDataSource();

    // Dil parametresini al
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'tr';

    // Ürünleri getir
    const productRepository = dataSource.getRepository(Product);
    const products = await productRepository.find();
    
    // Dönüştürülmüş ürün listesi
    const transformedProducts = [];
    
    // Her ürün için ilgili ilişkili verileri manuel olarak getir
    for (const product of products) {
      // İlişkileri yükle - lazy loading
      const localizations = await product.localizations;
      const features = await product.features;
      const usageAreas = await product.usageAreas;
      
      // İlgili dile göre filtrele
      const filteredLocalizations = localizations.filter(loc => loc.languageCode === lang);
      const filteredFeatures = features.filter(feat => feat.languageCode === lang);
      const filteredUsageAreas = usageAreas.filter(area => area.languageCode === lang);
      
      // Verileri düzenle
      transformedProducts.push({
        id: product.id,
        code: product.code,
        image_url: product.image_url,
        name: filteredLocalizations[0]?.name || '',
        description: filteredLocalizations[0]?.description || '',
        slug: filteredLocalizations[0]?.slug || '',
        features: filteredFeatures?.map(feature => ({
          id: feature.id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon
        })) || [],
        usageAreas: filteredUsageAreas?.map(area => ({
          id: area.id,
          title: area.title,
          description: area.description,
          icon: area.icon
        })) || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      });
    }

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 