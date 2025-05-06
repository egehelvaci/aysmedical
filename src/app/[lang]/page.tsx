import React from 'react';
import HomePage from './HomePage';

export const runtime = 'nodejs';

type PageProps = {
  params: {
    lang: string;
  };
};

// generateStaticParams fonksiyonu eklenecek
export async function generateStaticParams() {
  return [
    { lang: 'tr' },
    { lang: 'en' }
  ];
}

// Next.js 15'te, params'a erişim için önce params nesnesini await etmeliyiz
export default async function Page({ params }: PageProps) {
  // Önce tüm params nesnesini await et
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'tr';
  
  return <HomePage lang={lang} />;
} 