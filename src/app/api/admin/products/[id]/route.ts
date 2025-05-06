import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import { createApiResponse, createApiErrorResponse } from '@/app/api/api-utils';

// GET - Belirli bir ürünün detaylarını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kimlik doğrulama
    const authResult = await isAuthenticated(request);
    if (!authResult.authenticated) {
      return createApiErrorResponse(request, 'Yetkisiz erişim', { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createApiErrorResponse(request, 'Geçersiz ürün ID', { status: 400 });
    }

    // Prisma ile ürünü tüm ilişkileriyle birlikte getir
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        localizations: true,
        features: true,
        details: true,
        usageAreas: true
      }
    });

    if (!product) {
      return createApiErrorResponse(request, 'Ürün bulunamadı', { status: 404 });
    }

    // Dil bazlı lokalizasyonları düzenle
    const localizationsByLang: Record<string, any> = {};
    product.localizations.forEach(loc => {
      localizationsByLang[loc.languageCode] = {
        name: loc.name,
        description: loc.description || '',
        slug: loc.slug || ''
      };
    });

    // Dil bazlı detayları düzenle
    const detailsByLang: Record<string, any> = {};
    product.details.forEach(detail => {
      detailsByLang[detail.languageCode] = {
        title: detail.title,
        content: detail.content
      };
    });

    // Yanıtı formatlayarak döndür
    return createApiResponse(request, {
      id: product.id,
      code: product.code,
      image_url: product.image_url,
      localizations: localizationsByLang,
      details: detailsByLang,
      features: product.features || [],
      usageAreas: product.usageAreas || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    console.error('Ürün detayı getirme hatası:', error);
    return createApiErrorResponse(
      request, 
      'Ürün detayları alınırken bir hata oluştu',
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}

// PUT - Ürünü güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kimlik doğrulama
    const authResult = await isAuthenticated(request);
    if (!authResult.authenticated) {
      return createApiErrorResponse(request, 'Yetkisiz erişim', { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createApiErrorResponse(request, 'Geçersiz ürün ID', { status: 400 });
    }

    // Prisma ile ürünün varlığını kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return createApiErrorResponse(request, 'Ürün bulunamadı', { status: 404 });
    }

    // Gelen veriyi al
    const data = await request.json();
    
    console.log('API request data (PUT):', JSON.stringify(data, null, 2));
    
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

    // Prisma transaction ile tüm işlemleri gerçekleştir
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Ürünü güncelle
      const product = await tx.product.update({
        where: { id },
        data: {
          code: data.code,
          image_url: data.image_url
        }
      });

      // Mevcut lokalizasyonları sil
      await tx.productLocalization.deleteMany({
        where: { productId: id }
      });

      // Yeni lokalizasyonları ekle
      const newLocalizations = [];
      
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
        newLocalizations.push(trLocalization);
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
        newLocalizations.push(enLocalization);
      }

      // Mevcut detayları sil
      await tx.productDetail.deleteMany({
        where: { productId: id }
      });

      // Yeni detayları ekle
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

      // Mevcut özellikleri sil
      await tx.productFeature.deleteMany({
        where: { productId: id }
      });

      // Yeni özellikleri ekle
      if (data.features && Array.isArray(data.features)) {
        for (const feature of data.features) {
          await tx.productFeature.create({
            data: {
              productId: product.id,
              languageCode: feature.languageCode || 'tr',
              title: feature.title,
              description: feature.description || '',
              icon: feature.icon || null
            }
          });
        }
      }

      // Mevcut kullanım alanlarını sil
      await tx.productUsageArea.deleteMany({
        where: { productId: id }
      });

      // Yeni kullanım alanlarını ekle
      if (data.usageAreas && Array.isArray(data.usageAreas)) {
        for (const area of data.usageAreas) {
          await tx.productUsageArea.create({
            data: {
              productId: product.id,
              languageCode: area.languageCode || 'tr',
              title: area.title,
              description: area.description || '',
              icon: area.icon || null
            }
          });
        }
      }

      return product;
    });

    // Güncellenmiş ürünü tüm ilişkileriyle birlikte getir
    const updatedProductWithRelations = await prisma.product.findUnique({
      where: { id: updatedProduct.id },
      include: {
        localizations: true,
        features: true,
        details: true,
        usageAreas: true
      }
    });

    // İşlem başarılı olduğunda yanıt döndür
    return createApiResponse(
      request,
      {
        message: 'Ürün başarıyla güncellendi',
        product: updatedProductWithRelations
      }
    );
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    return createApiErrorResponse(
      request,
      'Ürün güncellenirken bir hata oluştu',
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}

// DELETE - Ürünü sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kimlik doğrulama
    const authResult = await isAuthenticated(request);
    if (!authResult.authenticated) {
      return createApiErrorResponse(request, 'Yetkisiz erişim', { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createApiErrorResponse(request, 'Geçersiz ürün ID', { status: 400 });
    }

    // Prisma ile ürünün varlığını kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return createApiErrorResponse(request, 'Ürün bulunamadı', { status: 404 });
    }

    // Prisma transaction ile silme işlemini gerçekleştir
    // Not: Prisma şemasında onDelete: Cascade tanımlandığı için
    // ilişkili kayıtlar otomatik olarak silinecektir
    await prisma.product.delete({
      where: { id }
    });

    // İşlem başarılı
    return createApiResponse(request, {
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    return createApiErrorResponse(
      request,
      'Ürün silinirken bir hata oluştu',
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}
