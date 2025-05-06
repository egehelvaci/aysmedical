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
  FaChevronRight,
  FaHospital,
  FaXRay,
  FaFemale
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 7000); // 7 saniyede bir
      
      return () => clearInterval(interval);
    }
  }, [products]);

  // Veritabanından ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?lang=${language}`);
        if (!response.ok) {
          throw new Error('Ürünler yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          // Eğer henüz veritabanında ürün yoksa, statik verilerle devam et
          setProducts(getProductsForLanguage(language));
        }
      } catch (err) {
        console.error('Ürünleri getirme hatası:', err);
        setError(language === 'tr' ? 'Ürünler yüklenirken bir hata oluştu' : 'An error occurred while loading products');
        // Hata durumunda statik verilerle devam et
        setProducts(getProductsForLanguage(language));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [language]);

  // Hizmet verileri
  const services = [
    {
      id: 'mr',
      title: language === 'tr' ? 'Manyetik Rezonans (MR)' : 'Magnetic Resonance (MR)',
      description: language === 'tr' 
        ? 'Modern MR cihazları ile donatılmış merkezlerin işletmeciliğini ve sağlık kurumlarına yönelik hizmet alımı süreçlerini profesyonel bir şekilde yürütüyoruz.' 
        : 'We professionally manage centers equipped with modern MR devices and service procurement processes for healthcare institutions.',
      icon: <FaHospital className="w-10 h-10 text-slate-600" />,
      subServices: language === 'tr' 
        ? ['Merkez İşletmeciliği', 'Hizmet Alımı Danışmanlığı', 'Profesyonel İşletme Yönetimi', 'Teknik Destek'] 
        : ['Center Management', 'Service Procurement Consulting', 'Professional Operational Management', 'Technical Support']
    },
    {
      id: 'ct',
      title: language === 'tr' ? 'Bilgisayarlı Tomografi (BT)' : 'Computed Tomography (CT)',
      description: language === 'tr' 
        ? 'Yüksek hızlı ve kaliteli görüntüleme sağlayan BT sistemleri için hizmet alımı ve işletme çözümleri sunarak tanı süreçlerini kolaylaştırıyoruz.' 
        : 'We facilitate diagnostic processes by providing service procurement and operational solutions for high-speed and quality imaging CT systems.',
      icon: <FaXRay className="w-10 h-10 text-slate-600" />,
      subServices: language === 'tr' 
        ? ['Hızlı Tarama Hizmeti', 'Yüksek Çözünürlüklü Görüntüleme', 'Tanı Süreçleri Optimizasyonu', 'Kurumsal Çözümler'] 
        : ['Fast Scanning Service', 'High Resolution Imaging', 'Diagnostic Process Optimization', 'Institutional Solutions']
    },
    {
      id: 'mammography',
      title: language === 'tr' ? 'Mamografi' : 'Mammography',
      description: language === 'tr' 
        ? 'Kadın sağlığı açısından hayati önem taşıyan mamografi hizmetlerinde, hem cihaz temini hem de işletme ve hizmet alımı modelleriyle sağlık kurumlarına destek oluyoruz.' 
        : 'We support healthcare institutions with both device procurement and operation and service procurement models in mammography services, which are vital for women\'s health.',
      icon: <FaFemale className="w-10 h-10 text-slate-600" />,
      subServices: language === 'tr' 
        ? ['Cihaz Temini', 'Hizmet Alımı Modelleri', 'Kalite Kontrol Süreçleri', 'Tarama Programları'] 
        : ['Device Procurement', 'Service Procurement Models', 'Quality Control Processes', 'Screening Programs']
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
      value: 25,
      title: language === 'tr' ? 'Yıllık Deneyim' : 'Years of Experience',
      icon: <FaMedal className="w-8 h-8" />
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
        {/* WhatsApp butonu layout.tsx'e taşındı */}

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
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                  {error}
                </div>
              ) : (
                /* Ana Slider */
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
                              src={product.image_url || '/images/placeholder-product.jpg'} 
                              alt={product.name}
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
                              <p className="text-sm font-light opacity-90 tracking-wider">{product.code}</p>
                            </div>
                          </div>
                          
                          {/* Alt Bölüm - İçerik */}
                          <div className="p-8 md:p-10">
                            <div className="max-w-3xl mx-auto">
                              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                                <div>
                                  <h3 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">{product.name}</h3>
                                  <div className="w-20 h-1 bg-slate-600 rounded-full"></div>
                                </div>
                                <Link 
                                  href={`/${language}/products/${product.slug}`}
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
              )}
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
                <source src="https://s3.tebi.io/aysmedical/numbers.mp4" type="video/mp4" />
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
              {language === 'tr' ? (
                <>
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.1} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaMedal className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Köklü Tecrübe</h3>
                      <p className="text-gray-600">25 yıllık deneyimimiz, sektördeki güçlü konumumuzu ve güvenilirliğimizi pekiştiriyor.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.2} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaCog className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Teknolojiye Yatırım</h3>
                      <p className="text-gray-600">En son teknolojiye sahip MR, BT, mamografi ve röntgen sistemlerini kullanıyor; projelere özel çözümler geliştiriyoruz.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.3} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaUserMd className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Uzman Kadro</h3>
                      <p className="text-gray-600">Alanında uzman mühendislerimiz, teknikerlerimiz ve yönetim ekibimizle her adımda profesyonel destek sunuyoruz.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.4} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaHeartbeat className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Güvenilir ve Hızlı Hizmet</h3>
                      <p className="text-gray-600">Tanı süreçlerinde zamanın ne kadar kıymetli olduğunu biliyor, yüksek kaliteli görüntüleri hızlı ve güvenli biçimde sunuyoruz.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.5} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaHandshake className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Kurumsal İş Ortaklığı</h3>
                      <p className="text-gray-600">Sunduğumuz hizmetin ötesinde, iş birliği yaptığımız sağlık kurumlarının çözüm ortağı oluyor; ihtiyaca özel, esnek ve sürdürülebilir projeler geliştiriyoruz.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.6} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaTools className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Hasta ve Hekim Odaklılık</h3>
                      <p className="text-gray-600">Hizmetlerimizin her aşamasında hasta konforunu ve hekimin doğru teşhis için ihtiyaç duyduğu kaliteyi ön planda tutuyoruz.</p>
                    </div>
                  </ScrollAnimationWrapper>
                </>
              ) : (
                <>
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.1} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaMedal className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Deep-rooted Experience</h3>
                      <p className="text-gray-600">Our 25 years of experience reinforces our strong position and reliability in the sector.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.2} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaCog className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Investment in Technology</h3>
                      <p className="text-gray-600">We use MRI, CT, mammography and X-ray systems with the latest technology; we develop project-specific solutions.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.3} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaUserMd className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Expert Staff</h3>
                      <p className="text-gray-600">We provide professional support at every step with our expert engineers, technicians and management team.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.4} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaHeartbeat className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Reliable and Fast Service</h3>
                      <p className="text-gray-600">We know how valuable time is in diagnostic processes, and we provide high-quality images quickly and safely.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.5} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaHandshake className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Corporate Partnership</h3>
                      <p className="text-gray-600">Beyond the service we provide, we are a solution partner for healthcare institutions we collaborate with; we develop customized, flexible and sustainable projects.</p>
                    </div>
                  </ScrollAnimationWrapper>
                  
                  <ScrollAnimationWrapper animation="zoomIn" delay={0.6} once={true}>
                    <div className="neu-box p-8">
                      <div className="w-16 h-16 neu-box-pressed flex items-center justify-center mx-auto mb-6">
                        <FaTools className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">Patient and Physician Focus</h3>
                      <p className="text-gray-600">We prioritize patient comfort and the quality needed by physicians for accurate diagnosis at every stage of our services.</p>
                    </div>
                  </ScrollAnimationWrapper>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <ScrollAnimationWrapper animation="fadeInUp" delay={0.1} once={true}>
          <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0">
              <video 
                className="absolute w-full h-full object-cover opacity-80"
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