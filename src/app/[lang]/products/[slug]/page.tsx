import React from 'react';
import ProductDetailPage from './ProductDetailPage';

export const runtime = 'nodejs';

type PageProps = {
  params: {
    lang: string;
    slug: string;
  };
};

// Next.js 15'te, params'a erişim için önce params nesnesini await etmeliyiz
export default async function Page({ params }: PageProps) {
  // Basitleştirilmiş yapı - daha az await kullanımı
  const lang = params.lang || 'tr';
  const slug = params.slug;
  
  return <ProductDetailPage lang={lang} slug={slug} />;
} 

export async function generateMetadata({ params }: PageProps) {
  const lang = params.lang || 'tr';
  const slug = params.slug;
  
  return {
    title: `${slug} | AYS Medical`,
    description: 'AYS Medical ürün detay sayfası',
  };
} 