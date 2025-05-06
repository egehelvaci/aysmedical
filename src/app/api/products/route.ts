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

    // Ürünleri ve ilişkili verileri getir
    const productsQuery = await dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.localizations',
        'localization',
        'localization.languageCode = :lang',
        { lang }
      )
      .leftJoinAndSelect(
        'product.features',
        'feature',
        'feature.languageCode = :lang',
        { lang }
      )
      .leftJoinAndSelect(
        'product.usageAreas',
        'usageArea',
        'usageArea.languageCode = :lang',
        { lang }
      )
      .getMany();

    // Verileri düzenle
    const products = productsQuery.map(product => ({
      id: product.id,
      code: product.code,
      image_url: product.image_url,
      name: product.localizations?.[0]?.name || '',
      description: product.localizations?.[0]?.description || '',
      slug: product.localizations?.[0]?.slug || '',
      features: product.features?.map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon
      })) || [],
      usageAreas: product.usageAreas?.map(area => ({
        id: area.id,
        title: area.title,
        description: area.description,
        icon: area.icon
      })) || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 