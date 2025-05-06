import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/typeorm';
import { Product } from '@/entities/Product';
import { ProductLocalization } from '@/entities/ProductLocalization';
import { ProductDetail } from '@/entities/ProductDetail';
import { ProductFeature } from '@/entities/ProductFeature';
import { ProductUsageArea } from '@/entities/ProductUsageArea';
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

    // TypeORM DataSource oluştur
    const dataSource = await getDataSource();
    const productRepository = dataSource.getRepository(Product);

    // Ürünü getir
    const product = await productRepository.findOne({
      where: { id },
      relations: {
        localizations: true,
        features: true,
        usageAreas: true,
        details: true
      }
    });

    if (!product) {
      return createApiErrorResponse(request, 'Ürün bulunamadı', { status: 404 });
    }

    // Dil bazlı lokalizasyonları düzenle
    const localizations: Record<string, any> = {};
    product.localizations.forEach(loc => {
      localizations[loc.languageCode] = {
        name: loc.name,
        description: loc.description || '',
        slug: loc.slug || ''
      };
    });

    // Dil bazlı detayları düzenle
    const details: Record<string, any> = {};
    product.details.forEach(detail => {
      details[detail.languageCode] = {
        title: detail.title,
        content: detail.content
      };
    });

    // Yanıtı formatlayarak döndür
    return createApiResponse(request, {
      id: product.id,
      code: product.code,
      image_url: product.image_url,
      localizations,
      details,
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

    // TypeORM DataSource oluştur
    const dataSource = await getDataSource();
    const productRepository = dataSource.getRepository(Product);
    const localizationRepository = dataSource.getRepository(ProductLocalization);
    const detailRepository = dataSource.getRepository(ProductDetail);
    const featureRepository = dataSource.getRepository(ProductFeature);
    const usageAreaRepository = dataSource.getRepository(ProductUsageArea);

    // Ürünün varlığını kontrol et
    const existingProduct = await productRepository.findOne({
      where: { id },
      relations: {
        localizations: true,
        features: true,
        usageAreas: true,
        details: true
      }
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

    // Ürünü güncelle
    existingProduct.code = data.code;
    existingProduct.image_url = data.image_url;
    
    const updatedProduct = await productRepository.save(existingProduct);

    // Mevcut lokalizasyonları sil
    await localizationRepository.remove(existingProduct.localizations);

    // Yeni lokalizasyonları ekle
    const localizations = [];
    
    // Türkçe
    if (data.localizations.tr) {
      const trLocalization = new ProductLocalization();
      trLocalization.productId = updatedProduct.id;
      trLocalization.languageCode = 'tr';
      trLocalization.name = data.localizations.tr.name;
      trLocalization.description = data.localizations.tr.description || '';
      trLocalization.slug = data.localizations.tr.slug || data.localizations.tr.name.toLowerCase().replace(/\s+/g, '-');
      
      const savedTrLoc = await localizationRepository.save(trLocalization);
      localizations.push(savedTrLoc);
    }
    
    // İngilizce (opsiyonel)
    if (data.localizations.en?.name) {
      const enLocalization = new ProductLocalization();
      enLocalization.productId = updatedProduct.id;
      enLocalization.languageCode = 'en';
      enLocalization.name = data.localizations.en.name;
      enLocalization.description = data.localizations.en.description || '';
      enLocalization.slug = data.localizations.en.slug || data.localizations.en.name.toLowerCase().replace(/\s+/g, '-');
      
      const savedEnLoc = await localizationRepository.save(enLocalization);
      localizations.push(savedEnLoc);
    }

    // Mevcut detayları sil
    await detailRepository.remove(existingProduct.details);

    // Yeni detayları ekle
    if (data.details) {
      // Türkçe detay
      const trDetail = new ProductDetail();
      trDetail.productId = updatedProduct.id;
      trDetail.languageCode = 'tr';
      trDetail.title = data.details.title || '';
      trDetail.content = data.details.content || '';
      await detailRepository.save(trDetail);

      // İngilizce detay (opsiyonel)
      if (data.details.en) {
        const enDetail = new ProductDetail();
        enDetail.productId = updatedProduct.id;
        enDetail.languageCode = 'en';
        enDetail.title = data.details.en.title || '';
        enDetail.content = data.details.en.content || '';
        await detailRepository.save(enDetail);
      }
    }

    // Mevcut özellikleri sil
    await featureRepository.remove(existingProduct.features);

    // Yeni özellikleri ekle
    if (data.features && Array.isArray(data.features)) {
      const features = data.features.map(feature => {
        const productFeature = new ProductFeature();
        productFeature.productId = updatedProduct.id;
        productFeature.languageCode = feature.languageCode || 'tr';
        productFeature.title = feature.title;
        productFeature.description = feature.description || '';
        productFeature.icon = feature.icon || null;
        return productFeature;
      });
      await featureRepository.save(features);
    }

    // Mevcut kullanım alanlarını sil
    await usageAreaRepository.remove(existingProduct.usageAreas);

    // Yeni kullanım alanlarını ekle
    if (data.usageAreas && Array.isArray(data.usageAreas)) {
      const usageAreas = data.usageAreas.map(area => {
        const productUsageArea = new ProductUsageArea();
        productUsageArea.productId = updatedProduct.id;
        productUsageArea.languageCode = area.languageCode || 'tr';
        productUsageArea.title = area.title;
        productUsageArea.description = area.description || '';
        productUsageArea.icon = area.icon || null;
        return productUsageArea;
      });
      await usageAreaRepository.save(usageAreas);
    }

    // İşlem başarılı olduğunda yanıt döndür
    return createApiResponse(
      request,
      {
        message: 'Ürün başarıyla güncellendi',
        product: {
          ...updatedProduct,
          localizations,
          details: data.details,
          features: data.features,
          usageAreas: data.usageAreas
        }
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

    // TypeORM DataSource oluştur
    const dataSource = await getDataSource();
    const productRepository = dataSource.getRepository(Product);

    // Ürünün varlığını kontrol et
    const existingProduct = await productRepository.findOne({
      where: { id }
    });

    if (!existingProduct) {
      return createApiErrorResponse(request, 'Ürün bulunamadı', { status: 404 });
    }

    // Ürünü sil - cascade yapılandırması sayesinde ilişkili kayıtlar da silinecek
    await productRepository.remove(existingProduct);

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
