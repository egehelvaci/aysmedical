import React from 'react';
import ProductsPage from './ProductsPage';

// Bu sayfayı nodejs runtime'ında çalıştır
export const runtime = 'nodejs';

type PageProps = {
  params: {
    lang: string;
  };
};

// Next.js 15'te, params'a erişim için önce params nesnesini await etmeliyiz
export default async function Page({ params }: PageProps) {
  // Basitleştirilmiş yapı - daha az await kullanımı
  const lang = params.lang || 'tr';
  
  return <ProductsPage lang={lang} />;
}

// Statik metadata ekleyerek sayfanın build edilmesini sağlayalım
export const metadata = {
  title: 'Ürünlerimiz | AYS Medical',
  description: 'AYS Medical tıbbi görüntüleme sistemleri ve ürünleri',
}; 