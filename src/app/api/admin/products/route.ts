import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { createApiResponse, createApiErrorResponse, handleOptionsRequest } from '@/app/api/api-utils';

// GET - Tüm ürünleri listele
export async function GET(request: NextRequest) {
  try {
    // Kimlik doğrulama
    const authResult = await isAuthenticated(request);
    if (!authResult.authenticated) {
      return createApiErrorResponse(request, 'Yetkisiz erişim', { status: 401 });
    }

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

    // Ürünleri formatla
    const formattedProducts = products.map(product => {
      // Türkçe lokalizasyonu bul
      const trLocalization = product.localizations.find(loc => loc.languageCode === 'tr');
      
      return {
        id: product.id,
        code: product.code,
        image_url: product.image_url,
        name: trLocalization?.name || 'İsimsiz Ürün',
        description: trLocalization?.description || '',
        slug: trLocalization?.slug || '',
        features: product.features || [],
        usageAreas: product.usageAreas || [],
        details: product.details || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    // Başarılı yanıt döndür
    return createApiResponse(request, { products: formattedProducts });
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    return createApiErrorResponse(
      request, 
      'Ürünler alınırken bir hata oluştu', 
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}

// POST - Yeni ürün oluştur
export async function POST(request: NextRequest) {
  try {
    // Kimlik doğrulama
    const authResult = await isAuthenticated(request);
    if (!authResult.authenticated) {
      return createApiErrorResponse(request, 'Yetkisiz erişim', { status: 401 });
    }

    // Gelen veriyi al
    const data = await request.json();
    
    console.log('API request data (POST):', JSON.stringify(data, null, 2));
    
    // Zorunlu alanları kontrol et
    if (!data.code || !data.image_url) {
      return createApiErrorResponse(
        request,
        'Ürün kodu ve görsel URL\'si gereklidir',
        { status: 400 }
      );
    }
    
    // TR dil bilgilerini kontrol et (en zorunlu değil)
    if (!data.localizations?.tr?.name) {
      return createApiErrorResponse(
        request,
        'Türkçe ürün adı gereklidir',
        { status: 400 }
      );
    }

    try {
      // Ürün kodunun benzersiz olduğunu kontrol et
      const existingProduct = await prisma.product.findUnique({
        where: { code: data.code }
      });

      if (existingProduct) {
        return createApiErrorResponse(
          request,
          `"${data.code}" kodlu ürün zaten mevcut`,
          { status: 400 }
        );
      }

      // Prisma transaction ile ürün ve ilişkili verileri oluştur
      const result = await prisma.$transaction(async (tx) => {
        // Ürünü oluştur
        const product = await tx.product.create({
          data: {
            code: data.code,
            image_url: data.image_url
          }
        });

        // Dil bilgilerini ekle
        const localizations = [];
        
        // Türkçe
        if (data.localizations.tr) {
          const trLocalization = await tx.productLocalization.create({
            data: {
              productId: product.id,
              languageCode: 'tr',
              name: data.localizations.tr.name,
              description: data.localizations.tr.description || '',
              slug: data.localizations.tr.slug || data.localizations.tr.name.toLowerCase().replace(/\s+/g, '-')
            }
          });
          localizations.push(trLocalization);
        }
        
        // İngilizce (opsiyonel)
        if (data.localizations.en?.name) {
          const enLocalization = await tx.productLocalization.create({
            data: {
              productId: product.id,
              languageCode: 'en',
              name: data.localizations.en.name,
              description: data.localizations.en.description || '',
              slug: data.localizations.en.slug || data.localizations.en.name.toLowerCase().replace(/\s+/g, '-')
            }
          });
          localizations.push(enLocalization);
        }

        // Ürün detaylarını ekle
        if (data.details) {
          // Türkçe detay
          await tx.productDetail.create({
            data: {
              productId: product.id,
              languageCode: 'tr',
              title: data.details.title || '',
              content: data.details.content || ''
            }
          });

          // İngilizce detay (opsiyonel)
          if (data.details.en) {
            await tx.productDetail.create({
              data: {
                productId: product.id,
                languageCode: 'en',
                title: data.details.en.title || '',
                content: data.details.en.content || ''
              }
            });
          }
        }

        // Özellikleri ekle
        const features = [];
        if (data.features && Array.isArray(data.features)) {
          for (const feature of data.features) {
            const savedFeature = await tx.productFeature.create({
              data: {
                productId: product.id,
                languageCode: feature.languageCode || 'tr',
                title: feature.title,
                description: feature.description || '',
                icon: feature.icon || null
              }
            });
            features.push(savedFeature);
          }
        }

        // Kullanım alanlarını ekle
        const usageAreas = [];
        if (data.usageAreas && Array.isArray(data.usageAreas)) {
          for (const area of data.usageAreas) {
            const savedArea = await tx.productUsageArea.create({
              data: {
                productId: product.id,
                languageCode: area.languageCode || 'tr',
                title: area.title,
                description: area.description || '',
                icon: area.icon || null
              }
            });
            usageAreas.push(savedArea);
          }
        }

        return {
          product,
          localizations,
          features,
          usageAreas
        };
      });

      // Yanıt döndür
      return createApiResponse(
        request,
        {
          message: 'Ürün başarıyla oluşturuldu',
          product: {
            ...result.product,
            localizations: result.localizations,
            features: result.features,
            usageAreas: result.usageAreas
          }
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Veritabanı hatası:', dbError);
      return createApiErrorResponse(
        request,
        'Ürün kaydedilirken veritabanı hatası oluştu',
        { 
          status: 500,
          details: dbError instanceof Error ? dbError.message : 'Bilinmeyen hata'
        }
      );
    }
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    return createApiErrorResponse(
      request,
      'Ürün oluşturulurken bir hata oluştu',
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}

// OPTIONS isteği için destek
export function OPTIONS() {
  return handleOptionsRequest();
}