import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" style={{margin: 0, padding: 0}}>
      <body style={{margin: 0, padding: 0}} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="pt-0 min-h-screen">
          {children}
        </main>
        {/* Footer artık [lang] layout'ında tanımlanıyor, dil bilgisi ile birlikte */}
      </body>
    </html>
  );
}
