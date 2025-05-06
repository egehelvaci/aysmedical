'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

type Product = {
  id: number;
  code: string;
  image_url: string;
  name: string;
  description: string;
  slug: string;
  features: {
    id: number;
    title: string;
    description: string;
    icon: string | null;
  }[];
  usageAreas: {
    id: number;
    title: string;
    description: string;
    icon: string | null;
  }[];
};

type ProductDetailPageProps = {
  lang: string;
  slug: string;
};

export default function ProductDetailPage({ lang, slug }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Veritabanından ürün detaylarını çek
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        console.log(`Ürün detayları talep ediliyor: /api/products/${slug}?lang=${lang}`);
        
        const response = await fetch(`/api/products/${slug}?lang=${lang}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API yanıt kodu:', response.status, errorData);
          throw new Error(lang === 'tr' 
            ? `Ürün detayları yüklenirken bir hata oluştu: ${errorData.error || response.statusText}` 
            : `An error occurred while loading product details: ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Ürün API yanıtı:', data);
        
        if (!data.product) {
          throw new Error(lang === 'tr' ? 'Ürün bilgisi bulunamadı' : 'Product information not found');
        }
        
        setProduct(data.product);
      } catch (err) {
        console.error('Ürün detaylarını getirme hatası:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [lang, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">
          {lang === 'tr' ? 'Ürün Bulunamadı' : 'Product Not Found'}
        </h1>
        <p className="mb-8">
          {lang === 'tr' 
            ? 'İstediğiniz ürün bulunamadı veya kaldırılmış olabilir.' 
            : 'The product you requested could not be found or may have been removed.'}
        </p>
        <Link 
          href={`/${lang}/products`}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" />
          {lang === 'tr' ? 'Ürünlere Dön' : 'Back to Products'}
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-800 py-20" style={{paddingTop: "7rem"}}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
            <p className="text-xl text-gray-300 mb-6">{product.code}</p>
            <Link 
              href={`/${lang}/products`}
              className="flex items-center text-gray-300 hover:text-white transition-colors mt-4"
            >
              <FaArrowLeft className="mr-2" /> 
              {lang === 'tr' ? 'Tüm Ürünler' : 'All Products'}
            </Link>
          </div>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Main Image */}
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={product.image_url || '/images/placeholder-product.jpg'} 
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* Product Description */}
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {lang === 'tr' ? 'Ürün Açıklaması' : 'Product Description'}
              </h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                {product.description}
              </p>
              
              {product.features && product.features.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold mb-4">
                    {lang === 'tr' ? 'Özellikler' : 'Features'}
                  </h3>
                  <ul className="grid grid-cols-1 mb-8 gap-3">
                    {product.features.map((feature) => (
                      <li key={feature.id} className="flex items-start">
                        <FaCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{feature.title}</span>
                          {feature.description && (
                            <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      {product.usageAreas && product.usageAreas.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              {lang === 'tr' ? 'Kullanım Alanları' : 'Applications'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.usageAreas.map((application, index) => (
                <div key={application.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                      {index + 1}
                    </div>
                    <h3 className="font-bold">{application.title}</h3>
                  </div>
                  {application.description && (
                    <p className="text-gray-600 mt-2">{application.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            {lang === 'tr' ? 'Daha Fazla Bilgi Almak İster misiniz?' : 'Would You Like to Get More Information?'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {lang === 'tr' 
              ? `${product.name} ürünümüz hakkında daha detaylı bilgi ve fiyat teklifi için bizimle iletişime geçin.` 
              : `Contact us for more detailed information and price quotes about our ${product.name} product.`}
          </p>
          <Link 
            href={`/${lang}/contact`}
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors inline-flex items-center"
          >
            {lang === 'tr' ? 'İletişime Geçin' : 'Contact Us'} 
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
} 