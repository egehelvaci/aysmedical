import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/typeorm';
import { Product } from '@/entities/Product';
import { ProductLocalization } from '@/entities/ProductLocalization';
import { ProductDetail } from '@/entities/ProductDetail';
import { ProductFeature } from '@/entities/ProductFeature';
import { ProductUsageArea } from '@/entities/ProductUsageArea';
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

    // TypeORM DataSource oluştur
    const dataSource = await getDataSource();
    const productRepository = dataSource.getRepository(Product);

    // Ürünleri getir
    const products = await productRepository.find({
      relations: {
        localizations: true,
        features: true,
        usageAreas: true,
        details: true
      },
      order: {
        updatedAt: 'DESC'
      }
    });

    // Ürünleri formatla
    const formattedProducts = products.map(product => {
      // Türkçe lokalizasyonu bul
      const trLocalization = product.localizations.find(loc => loc.languageCode === 'tr');
      const trDetails = product.details.find(detail => detail.languageCode === 'tr');
      
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
      // TypeORM DataSource oluştur
      const dataSource = await getDataSource();
      const productRepository = dataSource.getRepository(Product);
      const localizationRepository = dataSource.getRepository(ProductLocalization);

      // Ürün kodunun benzersiz olduğunu kontrol et
      const existingProduct = await productRepository.findOne({
        where: { code: data.code }
      });

      if (existingProduct) {
        return createApiErrorResponse(
          request,
          `"${data.code}" kodlu ürün zaten mevcut`,
          { status: 400 }
        );
      }

      // Ürünü oluştur
      const product = new Product();
      product.code = data.code;
      product.image_url = data.image_url;
      
      const savedProduct = await productRepository.save(product);

      // Dil bilgilerini ekle
      const localizations = [];
      
      // Türkçe
      if (data.localizations.tr) {
        const trLocalization = new ProductLocalization();
        trLocalization.productId = savedProduct.id;
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
        enLocalization.productId = savedProduct.id;
        enLocalization.languageCode = 'en';
        enLocalization.name = data.localizations.en.name;
        enLocalization.description = data.localizations.en.description || '';
        enLocalization.slug = data.localizations.en.slug || data.localizations.en.name.toLowerCase().replace(/\s+/g, '-');
        
        const savedEnLoc = await localizationRepository.save(enLocalization);
        localizations.push(savedEnLoc);
      }

      // Ürün detaylarını ekle
      if (data.details) {
        const detailRepository = dataSource.getRepository(ProductDetail);
        const detail = new ProductDetail();
        detail.productId = savedProduct.id;
        detail.languageCode = 'tr'; // Varsayılan dil
        detail.title = data.details.title || '';
        detail.content = data.details.content || '';
        await detailRepository.save(detail);

        // İngilizce detay (opsiyonel)
        if (data.details.en) {
          const enDetail = new ProductDetail();
          enDetail.productId = savedProduct.id;
          enDetail.languageCode = 'en';
          enDetail.title = data.details.en.title || '';
          enDetail.content = data.details.en.content || '';
          await detailRepository.save(enDetail);
        }
      }

      // Özellikleri ekle
      if (data.features && Array.isArray(data.features)) {
        const featureRepository = dataSource.getRepository(ProductFeature);
        const features = data.features.map(feature => {
          const productFeature = new ProductFeature();
          productFeature.productId = savedProduct.id;
          productFeature.languageCode = feature.languageCode || 'tr';
          productFeature.title = feature.title;
          productFeature.description = feature.description || '';
          productFeature.icon = feature.icon || null;
          return productFeature;
        });
        await featureRepository.save(features);
      }

      // Kullanım alanlarını ekle
      if (data.usageAreas && Array.isArray(data.usageAreas)) {
        const usageAreaRepository = dataSource.getRepository(ProductUsageArea);
        const usageAreas = data.usageAreas.map(area => {
          const productUsageArea = new ProductUsageArea();
          productUsageArea.productId = savedProduct.id;
          productUsageArea.languageCode = area.languageCode || 'tr';
          productUsageArea.title = area.title;
          productUsageArea.description = area.description || '';
          productUsageArea.icon = area.icon || null;
          return productUsageArea;
        });
        await usageAreaRepository.save(usageAreas);
      }

      // Yanıt döndür
      return createApiResponse(
        request,
        {
          message: 'Ürün başarıyla oluşturuldu',
          product: {
            ...savedProduct,
            localizations,
            details: data.details,
            features: data.features,
            usageAreas: data.usageAreas
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