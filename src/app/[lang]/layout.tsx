import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import AnimatedLayout from "./AnimatedLayout";
import Footer from "../components/Footer";
import { metadata as baseMetadata } from "./i18n-metadata";
import { ScrollProgressBar } from "../../components/micro-interactions/MicroInteractions";
import { FaWhatsapp } from 'react-icons/fa';

const inter = Inter({ subsets: ["latin"] });

export const runtime = 'nodejs';

// Geçerli dil parametreleri
export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  // params objesini await etmemiz gerekiyor
  const lang = params.lang || 'tr';
  
  const langMetadata = baseMetadata[lang as keyof typeof baseMetadata] || baseMetadata.tr;
  
  return {
    ...langMetadata,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Dil bilgisini params'tan alıyoruz
  const lang = params.lang || 'tr';

  return (
    <>
      <div className={inter.className}>
        <main className="min-h-screen">
          <ScrollProgressBar />
          <AnimatedLayout>
            {children}
          </AnimatedLayout>
        </main>
        <Footer lang={lang} />
        
        {/* Whatsapp Float Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <a 
            href="https://wa.me/905068860105" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-16 h-16 bg-slate-600 rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-300 group"
            aria-label="Whatsapp ile iletişime geç"
          >
            <FaWhatsapp className="text-white w-8 h-8" />
            <span className="absolute -top-10 right-0 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {lang === 'tr' ? 'Whatsapp ile Yazın' : 'Message via Whatsapp'}
            </span>
          </a>
        </div>
      </div>
    </>
  );
}