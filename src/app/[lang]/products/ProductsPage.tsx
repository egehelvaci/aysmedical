'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

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

type ProductsPageProps = {
  lang: string;
};

export default function ProductsPage({ lang }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Veritabanından ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?lang=${lang}`);
        
        if (!response.ok) {
          throw new Error(lang === 'tr' 
            ? 'Ürünler yüklenirken bir hata oluştu' 
            : 'An error occurred while loading products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Ürünleri getirme hatası:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 w-full max-w-2xl">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-800 py-24" style={{paddingTop: "7rem"}}>
        <div className="absolute inset-0 overflow-hidden z-0">
          <video 
            className="absolute w-full h-full object-cover opacity-40"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/images/products/products.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            {lang === 'tr' ? 'Ürünlerimiz' : 'Our Products'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-sm">
            {lang === 'tr'
              ? 'En son teknoloji tıbbi görüntüleme sistemlerimiz hakkında detaylı bilgi alın.'
              : 'Get detailed information about our latest technology medical imaging systems.'}
          </p>
        </div>
      </section>

      {/* Products List Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl text-gray-600">
                {lang === 'tr' ? 'Henüz ürün bulunmuyor' : 'No products available yet'}
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-16">
              {products.map((product, index) => (
                <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8`}>
                  {/* Main Image Column */}
                  <div className="lg:w-1/2">
                    <div className="relative h-72 lg:h-96 rounded-lg overflow-hidden shadow-md">
                      <Image 
                        src={product.image_url || '/images/placeholder-product.jpg'} 
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={index === 0}
                      />
                    </div>
                  </div>
                  
                  {/* Content Column */}
                  <div className="lg:w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    
                    {product.features && product.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3">
                          {lang === 'tr' ? 'Özellikler' : 'Features'}
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {product.features.map((feature) => (
                            <li key={feature.id} className="flex items-center">
                              <span className="mr-2 text-blue-600">✓</span>
                              {feature.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Link 
                      href={`/${lang}/products/${product.id}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors w-fit"
                    >
                      {lang === 'tr' ? 'Detaylı Bilgi' : 'More Details'} 
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0">
          <video 
            className="absolute w-full h-full object-cover opacity-65"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="https://s3.tebi.io/aysmedical/contactus.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 to-slate-700/50"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            {lang === 'tr' ? 'Ürünlerimiz Hakkında Bilgi Almak İçin' : 'For Information About Our Products'}
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md">
            {lang === 'tr' 
              ? 'Ürünlerimiz ve hizmetlerimiz hakkında detaylı bilgi için bizimle iletişime geçin.' 
              : 'Contact us for detailed information about our products and services.'}
          </p>
          <div className="flex justify-center">
            <Link 
              href={`/${lang}/contact`}
              className="glass-button relative inline-flex items-center px-8 py-3 group hover:bg-white/20 transition-all duration-300"
            >
              <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                {lang === 'tr' ? 'İletişime Geçin' : 'Contact Us'} <FaArrowRight className="inline ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 