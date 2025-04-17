'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaGlobeAmericas } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('tr');
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState('/');
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  // URL'yi kontrol edip ana sayfa mı değil mi belirle
  useEffect(() => {
    if (!pathname) return;
    setCurrentPath(pathname);
    
    // Daha doğrudan ana sayfa tespiti - sadece pathname'i kontrol et
    const isRootPath = pathname === '/tr' || pathname === '/en';
    console.log("Current pathname:", pathname, "isRootPath:", isRootPath);
    setIsHomePage(isRootPath);
    
    // Dil tespiti
    if (pathname.startsWith('/tr')) {
      setLanguage('tr');
    } else if (pathname.startsWith('/en')) {
      setLanguage('en');
    }
  }, [pathname]);

  // Scroll olduğunda header'ın görünümünü değiştir
  useEffect(() => {
    // Browser tarafında çalıştığına emin ol
    if (typeof window === 'undefined') return;
    
    // İlk yüklemede scroll durumunu kontrol et
    const initialPosition = window.scrollY;
    const initialScrolled = initialPosition > 10;
    setScrolled(initialScrolled);
    console.log("📌 Scroll başlangıç durumu:", initialPosition > 10 ? "Scrolled" : "Top");
    
    // Scroll durumunu kontrol eden fonksiyon
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      const shouldBeScrolled = currentPosition > 10;
      
      if (scrolled !== shouldBeScrolled) {
        console.log("📜 Scroll değişimi:", shouldBeScrolled ? "Scrolled" : "Top", "Position:", currentPosition);
        setScrolled(shouldBeScrolled);
      }
    };
    
    // Scroll event listener ekle
    window.addEventListener('scroll', handleScroll);
    
    // Component unmount olduğunda listener'ı kaldır
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Header'ın saydam olup olmayacağını belirle
  const isTransparent = false;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
    
    // Dil değiştiğinde, aynı sayfanın yeni dildeki versiyonuna yönlendir
    if (!pathname) return;
    
    const pathParts = pathname.split('/');
    if (pathParts.length > 1) {
      // İlk eleman boş string (çünkü / ile başlıyor), ikinci eleman dil kodu
      pathParts[1] = newLang;
      window.location.href = pathParts.join('/');
    }
  };

  // Her dilin menü öğelerini URL'leri ile birlikte oluştur
  const menuItems = [
    { name: language === 'tr' ? 'Ana Sayfa' : 'Home', path: `/${language}` },
    { name: language === 'tr' ? 'Hakkımızda' : 'About Us', path: `/${language}/about` },
    { name: language === 'tr' ? 'Ürünler' : 'Products', path: `/${language}/products` },
    { name: language === 'tr' ? 'Hizmetler' : 'Services', path: `/${language}/services` },
    { name: language === 'tr' ? 'İletişim' : 'Contact', path: `/${language}/contact` },
  ];

  console.log("Header state:", { isHomePage, scrolled, isTransparent: false, path: pathname });

  return (
    <header 
      className="fixed w-full z-50 top-0 transition-all duration-300 bg-slate-900/85 backdrop-blur-md shadow-xl py-3"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          className="absolute w-full h-full object-cover opacity-20"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/images/header/7088517-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95"></div>
      </div>

      <div className="container mx-auto px-4 flex justify-between items-center relative z-10">
        <Link href={`/${language}`} className="flex items-center transition-all duration-500">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-wide drop-shadow-md">
              {language === 'tr' ? 'AYS Medikal' : 'AYS Medical'}
            </span>
            <span className="text-sm font-medium text-gray-200 tracking-wider drop-shadow-sm">
              {language === 'tr' 
                ? 'Görüntüleme ve Sağlık Hizmetleri' 
                : 'Imaging and Healthcare Services'}
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.path}
              className={`font-medium transition-colors hover:text-white ${
                currentPath === item.path 
                  ? 'text-white font-semibold' 
                  : 'text-gray-200'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button 
            onClick={toggleLanguage}
            className="flex items-center transition-colors text-gray-200 hover:text-white"
          >
            <FaGlobeAmericas className="mr-1" />
            <span>{language === 'tr' ? 'EN' : 'TR'}</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none transition-colors text-white"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-lg shadow-lg relative z-10">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.path}
                className={`font-medium py-2 transition-colors hover:text-white ${
                  currentPath === item.path ? 'text-white font-semibold' : 'text-gray-200'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={toggleLanguage}
              className="flex items-center py-2 text-gray-200 hover:text-white transition-colors"
            >
              <FaGlobeAmericas className="mr-1" />
              <span>{language === 'tr' ? 'EN' : 'TR'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 