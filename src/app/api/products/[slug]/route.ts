import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request, 
  { params }: { params: { slug: string } }
) {
  try {
    // Dil parametresini al
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'tr';
    
    const slug = params.slug;
    console.log('API: Ürün detayı isteniyor, slug:', slug, 'dil:', lang);
    
    // Slug hem sayı hem de string olabilir (ID veya slug)
    const isNumeric = /^\d+$/.test(slug);
    
    let product;
    
    // ID veya slug ile sorgu yap
    if (isNumeric) {
      // ID ile sorgula
      const productId = parseInt(slug);
      product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          localizations: true,
          features: true,
          usageAreas: true,
          details: true
        }
      });
    } else {
      // Slug ile sorgula
      const localization = await prisma.productLocalization.findFirst({
        where: {
          slug: slug,
          languageCode: lang
        }
      });
      
      if (localization) {
        const productId = localization.productId;
        
        product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            localizations: true,
            features: true,
            usageAreas: true,
            details: true
          }
        });
      }
    }
    
    // Ürün bulunamadıysa 404
    if (!product) {
      console.log('API: Ürün bulunamadı:', slug);
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }
    
    // Dil filtresi
    const productLocalizations = product.localizations.filter(loc => loc.languageCode === lang);
    const productFeatures = product.features.filter(feature => feature.languageCode === lang);
    const productUsageAreas = product.usageAreas.filter(area => area.languageCode === lang);
    
    // Yanıtı hazırla
    const response = {
      id: product.id,
      code: product.code,
      image_url: product.image_url,
      name: productLocalizations[0]?.name || '',
      description: productLocalizations[0]?.description || '',
      slug: productLocalizations[0]?.slug || '',
      features: productFeatures.map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon
      })) || [],
      usageAreas: productUsageAreas.map(area => ({
        id: area.id,
        title: area.title,
        description: area.description,
        icon: area.icon
      })) || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
    
    console.log('API: Ürün bulundu:', response.name);
    return NextResponse.json({ product: response });
  } catch (error) {
    console.error('Ürün detayı getirme hatası:', error);
    return NextResponse.json(
      { error: 'Ürün detayı yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 