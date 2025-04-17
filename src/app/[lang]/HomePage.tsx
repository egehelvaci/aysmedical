'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowRight, 
  FaUserMd, 
  FaCog, 
  FaTools, 
  FaHandshake, 
  FaMedal, 
  FaHeartbeat, 
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';
import StatsChart from '../components/StatsChart';
import ScrollAnimationWrapper from '../components/ScrollAnimationWrapper';
import { AnimatedCounter, AnimatedText } from '../../components/micro-interactions/MicroInteractions';
import { getProductsForLanguage } from '../data/products';

type HomePageProps = {
  lang: string;
};

export default function HomePage({ lang }: HomePageProps) {
  const language = lang;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Ürünler için otomatik slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 7000); // 7 saniyede bir
    
    return () => clearInterval(interval);
  }, []);

  // Ürün verilerini merkezi kaynaktan al
  const products = getProductsForLanguage(language);

  // Hizmet verileri
  const services = [
    {
      id: 'service',
      title: language === 'tr' ? 'Servis' : 'Service',
      description: language === 'tr' 
        ? 'Tıbbi görüntüleme cihazlarınız için profesyonel bakım ve servis hizmetleri.' 
        : 'Professional maintenance and service for your medical imaging devices.',
      icon: <FaCog className="w-10 h-10 text-slate-600" />,
      subServices: language === 'tr' 
        ? ['Periyodik Bakımlar', 'Arıza Tespit', 'Sistem Denetleme', 'Sistem Devreye Alma'] 
        : ['Periodic Maintenance', 'Fault Detection', 'System Monitoring', 'System Commissioning']
    },
    {
      id: 'repair',
      title: language === 'tr' ? 'Onarım' : 'Repair',
      description: language === 'tr' 
        ? 'Uzman ekibimiz ile hızlı ve kaliteli onarım çözümleri sunuyoruz.' 
        : 'We offer fast and quality repair solutions with our expert team.',
      icon: <FaTools className="w-10 h-10 text-slate-600" />,
      subServices: language === 'tr' 
        ? ['Koil Onarımı', 'Elektronik Parça Onarımı', 'X-Işını Tüpü Onarımı', 'Yüksek Gerilim Tankı Onarımı'] 
        : ['Coil Repair', 'Electronic Part Repair', 'X-Ray Tube Repair', 'High Voltage Tank Repair']
    },
    {
      id: 'sales',
      title: language === 'tr' ? 'Satış' : 'Sales',
      description: language === 'tr' 
        ? 'Yeni ve ikinci el tıbbi görüntüleme sistemleri ve yedek parça satışı.' 
        : 'New and used medical imaging systems and spare parts sales.',
      icon: <FaHandshake className="w-10 h-10 text-slate-600" />,
      subServices: language === 'tr' 
        ? ['Anahtar Teslim Proje', 'Yenilenmiş Sistemler', 'Yedek Parça Satışı', 'RF Odası Kurulumu'] 
        : ['Turnkey Project', 'Refurbished Systems', 'Spare Parts Sales', 'RF Room Installation']
    }
  ];

  // İstatistik verileri
  const statsData = [
    {
      value: 500,
      title: language === 'tr' ? 'Cihaz Onarımı' : 'Device Repairs',
      icon: <FaTools className="w-8 h-8" />
    },
    {
      value: 300,
      title: language === 'tr' ? 'Mutlu Müşteri' : 'Happy Clients',
      icon: <FaUserMd className="w-8 h-8" />
    },
    {
      value: 120,
      title: language === 'tr' ? 'Helyum Dolumu' : 'Helium Refills',
      icon: <FaHeartbeat className="w-8 h-8" />
    },
    {
      value: 250,
      title: language === 'tr' ? 'Cihaz Montajı' : 'Device Installations',
      icon: <FaCog className="w-8 h-8" />
    }
  ];

  // Özellik verileri
  const features = [
    {
      id: 1,
      title: language === 'tr' ? 'Yüksek Kalite' : 'High Quality',
      description: language === 'tr' 
        ? 'En son teknoloji ile üretilmiş, uzun ömürlü ve yüksek kaliteli cihazlar.' 
        : 'Long-lasting and high-quality devices manufactured with the latest technology.',
      icon: <FaMedal className="w-6 h-6" />,
      delay: 0.1
    },
    {
      id: 2,
      title: language === 'tr' ? 'Teknik Destek' : 'Technical Support',
      description: language === 'tr' 
        ? '7/24 teknik destek ve servis hizmeti ile sürekli yanınızdayız.' 
        : 'We are always by your side with 24/7 technical support and service.',
      icon: <FaUserMd className="w-6 h-6" />,
      delay: 0.2
    },
    {
      id: 3,
      title: language === 'tr' ? 'Kolay Kullanım' : 'Ease of Use',
      description: language === 'tr' 
        ? 'Kullanıcı dostu arayüzler ve kapsamlı eğitimler ile kolay kullanım.' 
        : 'Easy to use with user-friendly interfaces and comprehensive training.',
      icon: <FaHandshake className="w-6 h-6" />,
      delay: 0.3
    }
  ];

  // Animasyon varyantları
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      {/* Hero Slider Section */}
      <div className="h-screen" style={{marginTop: "0", position: "relative"}}>
        <HeroSlider language={language} />
      </div>

      {/* Diğer bölümler scrolldown olduğunda görünecek */}
      <div className="relative">
        {/* Whatsapp Float Button */}
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Link 
            href="https://wa.me/905555555555" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-16 h-16 bg-slate-600 rounded-full shadow-lg hover:bg-slate-700 transition-colors duration-300"
            aria-label="Whatsapp ile iletişime geç"
          >
            <FaWhatsapp className="text-white w-8 h-8" />
            <span className="absolute -top-10 right-0 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {language === 'tr' ? 'Whatsapp ile Yazın' : 'Message via Whatsapp'}
            </span>
          </Link>
        </motion.div>

        {/* 25+ Yıllık Tecrübe Banner */}
        <motion.section 
          className="py-8 bg-slate-700 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-slate-600 opacity-20 rounded-full"></div>
            <div className="absolute left-10 bottom-5 w-40 h-40 bg-slate-600 opacity-20 rounded-full"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <span className="text-amber-300">25+</span> {language === 'tr' ? 'Yıllık Tecrübe' : 'Years of Experience'}
                </h2>
                <p className="text-white text-xl max-w-xl">
                  {language === 'tr' 
                    ? 'Sağlık sektöründe çeyrek asırlık deneyim ve güvenle hizmet veriyoruz.' 
                    : 'Serving with a quarter century of experience and trust in the healthcare sector.'}
                </p>
              </div>
              <Link 
                href={`/${language}/about`}
                className="glass-button relative inline-flex items-center px-8 py-3 overflow-hidden group"
              >
                <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                  {language === 'tr' ? 'Hakkımızda' : 'About Us'} <FaArrowRight className="inline ml-2" />
                </span>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Products Section - Enhanced with Glassmorphism */}
        <section className="py-20 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimationWrapper animation="fadeIn" delay={0.1} once={true}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'tr' ? 'Ürünlerimiz' : 'Our Products'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {language === 'tr' 
                    ? 'En son teknoloji ile üretilmiş, yüksek kaliteli tıbbi görüntüleme sistemlerimiz.' 
                    : 'Our high-quality medical imaging systems manufactured with the latest technology.'}
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            {/* Ürün Slider */}
            <div className="relative mx-auto max-w-6xl">
              {/* Ana Slider */}
              <div className="overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="relative w-full">
                  {products.map((product, index) => (
                    <div 
                      key={product.id}
                      className={`transition-all duration-1500 ease-out transform ${
                        index === currentProductIndex 
                          ? "opacity-100 translate-x-0 scale-100" 
                          : "opacity-0 absolute top-0 left-0 -translate-x-8 scale-95"
                      }`}
                      style={{ zIndex: index === currentProductIndex ? 10 : 0 }}
                    >
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 overflow-hidden rounded-2xl">
                        {/* Üst Bölüm - Resim */}
                        <div className="relative h-96 md:h-[450px] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 to-slate-900/0 z-10"></div>
                          <Image 
                            src={product.image} 
                            alt={product.title}
                            fill
                            priority
                            className="transition-transform duration-7000 hover:scale-110 object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                          
                          {/* Sağ üst köşede slide göstergeleri */}
                          <div className="absolute top-4 right-4 flex gap-2 z-20">
                            {products.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentProductIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                                  idx === currentProductIndex 
                                    ? "bg-white w-8" 
                                    : "bg-white/50 hover:bg-white/70"
                                }`}
                                aria-label={`Ürün ${idx + 1}`}
                              />
                            ))}
                          </div>
                          
                          {/* Sol ve sağ navigasyon okları - orta kısımlarda */}
                          <button 
                            onClick={() => setCurrentProductIndex(prevIndex => (prevIndex - 1 + products.length) % products.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 transition-all duration-300 z-20"
                            aria-label="Önceki ürün"
                          >
                            <FaChevronLeft className="text-white" />
                          </button>
                          
                          <button 
                            onClick={() => setCurrentProductIndex(prevIndex => (prevIndex + 1) % products.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/40 transition-all duration-300 z-20"
                            aria-label="Sonraki ürün"
                          >
                            <FaChevronRight className="text-white" />
                          </button>
                          
                          {/* Alt bilgi bandı */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                            <p className="text-sm font-light opacity-90 tracking-wider">{product.brands}</p>
                          </div>
                        </div>
                        
                        {/* Alt Bölüm - İçerik */}
                        <div className="p-8 md:p-10">
                          <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                              <div>
                                <h3 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">{product.title}</h3>
                                <div className="w-20 h-1 bg-slate-600 rounded-full"></div>
                              </div>
                              <Link 
                                href={`/${language}/products/${product.id}`}
                                className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-slate-300/30 group"
                              >
                                <span>{language === 'tr' ? 'Detayları Gör' : 'View Details'}</span> 
                                <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                              </Link>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimationWrapper animation="fadeIn" delay={0.1} once={true}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {language === 'tr' 
                    ? 'Tıbbi görüntüleme sistemleri alanında sunduğumuz kapsamlı hizmetler.' 
                    : 'Comprehensive services we offer in the field of medical imaging systems.'}
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ScrollAnimationWrapper 
                  key={service.id} 
                  animation="fadeInUp" 
                  delay={0.1 + index * 0.1} 
                  once={true}
                >
                  <div className="neu-card h-full flex flex-col">
                    <div className="flex justify-center mb-6">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center">{service.title}</h3>
                    <p className="text-gray-600 mb-6 text-center">{service.description}</p>
                    
                    <div className="mt-auto">
                      <h4 className="font-medium text-slate-600 mb-3 text-center">
                        {language === 'tr' ? 'Sunduğumuz Hizmetler' : 'Services We Offer'}
                      </h4>
                      <ul className="space-y-2">
                        {service.subServices.map((subService, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span>
                            {subService}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Counter */}
        <ScrollAnimationWrapper animation="fadeIn" delay={0.1} once={true}>
          <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0">
              <video 
                className="absolute w-full h-full object-cover opacity-65"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="/images/numbers/numbers.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 to-slate-700/50"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <AnimatedText 
                  text={language === 'tr' ? 'Rakamlarla Biz' : 'Our Stats'} 
                  className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg"
                />
                <p className="text-white/90 max-w-2xl mx-auto drop-shadow-md">
                  {language === 'tr' 
                    ? 'Başarılarımızı rakamlarla ifade ediyoruz.' 
                    : 'We express our achievements with numbers.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {statsData.map((stat, index) => (
                  <div 
                    key={index} 
                    className="glass p-6 rounded-lg text-center backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-4">
                      {React.cloneElement(stat.icon, { className: "text-white w-8 h-8" })}
                    </div>
                    <div className="text-4xl font-bold mb-2 drop-shadow-md">
                      <AnimatedCounter value={stat.value} />
                      <span>+</span>
                    </div>
                    <p className="text-white/90">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimationWrapper>

        {/* Features Section - With Neumorphism */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <ScrollAnimationWrapper animation="fadeIn" delay={0.1} once={true}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'tr' ? 'Neden Biz?' : 'Why Choose Us?'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {language === 'tr' 
                    ? 'Sektördeki 25 yıllık tecrübemiz ile fark yaratıyoruz.' 
                    : 'We make a difference with our 25 years of experience in the industry.'}
                </p>
              </div>
            </ScrollAnimationWrapper>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <ScrollAnimationWrapper 
                  key={feature.id} 
                  animation="zoomIn" 
                  delay={feature.delay} 
                  once={true}
                >
                  <div className="neu-box p-8 text-center">
                    <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <ScrollAnimationWrapper animation="fadeInUp" delay={0.1} once={true}>
          <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0">
              <video 
                className="absolute w-full h-full object-cover opacity-65"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="/images/contact/contactus.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 to-slate-700/50"></div>
            </div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
                {language === 'tr' ? 'Hemen İletişime Geçin' : 'Contact Us Now'}
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md">
                {language === 'tr' 
                  ? 'Ürünlerimiz hakkında detaylı bilgi almak için bizimle iletişime geçin.' 
                  : 'Contact us for detailed information about our products.'}
              </p>
              <div className="flex justify-center">
                <Link 
                  href={`/${language}/contact`}
                  className="glass-button relative inline-flex items-center px-8 py-3 group hover:bg-white/20 transition-all duration-300"
                >
                  <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                    {language === 'tr' ? 'İletişim' : 'Contact'} <FaArrowRight className="inline ml-2" />
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </ScrollAnimationWrapper>
      </div>
    </>
  );
} 