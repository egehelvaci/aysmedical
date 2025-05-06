import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYSMED - Tıbbi Görüntüleme Sistemleri",
  description: "AYSMED - Modern tıbbi görüntüleme sistemleri, MR, BT, Mamografi ve Röntgen cihazları",
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { lang?: string };
}>) {
  // Varsayılan dil olarak 'tr' kullanılır
  const lang = params?.lang || 'tr';
  
  return (
    <html 
      lang={lang} 
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`} 
        suppressHydrationWarning
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
