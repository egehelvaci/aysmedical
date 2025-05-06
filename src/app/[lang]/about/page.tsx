import React from 'react';
import AboutPage from './AboutPage';

type PageProps = {
  params: {
    lang: string;
  };
};

export default function Page({ params }: PageProps) {
  // React.use() ile params değerlerini çöz
  const resolvedParams = React.use(Promise.resolve(params));
  const lang = resolvedParams.lang || 'tr';
  
  return <AboutPage lang={lang} />;
} 