'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaHospital, FaXRay, FaFemale } from 'react-icons/fa';
import { motion } from 'framer-motion';

type ServicesPageProps = {
  lang: string;
};

export default function ServicesPage({ lang }: ServicesPageProps) {
  const language = lang;
  // Client tarafında render edilip edilmediğini kontrol etmek için
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hizmet verileri
  const services = [
    {
      id: 'mr',
      title: language === 'tr' ? 'Manyetik Rezonans (MR)' : 'Magnetic Resonance (MR)',
      description: language === 'tr' 
        ? 'Modern MR cihazları ile donatılmış merkezlerin işletmeciliğini ve sağlık kurumlarına yönelik hizmet alımı süreçlerini profesyonel bir şekilde yürütüyoruz.' 
        : 'We professionally manage centers equipped with modern MR devices and service procurement processes for healthcare institutions.',
      icon: <FaHospital className="text-6xl text-slate-700 group-hover:text-slate-800 transition-colors duration-300" />,
      features: language === 'tr' 
        ? ['Merkez İşletmeciliği', 'Hizmet Alımı Danışmanlığı', 'Profesyonel İşletme Yönetimi', 'Teknik Destek'] 
        : ['Center Management', 'Service Procurement Consulting', 'Professional Operational Management', 'Technical Support']
    },
    {
      id: 'ct',
      title: language === 'tr' ? 'Bilgisayarlı Tomografi (BT)' : 'Computed Tomography (CT)',
      description: language === 'tr' 
        ? 'Yüksek hızlı ve kaliteli görüntüleme sağlayan BT sistemleri için hizmet alımı ve işletme çözümleri sunarak tanı süreçlerini kolaylaştırıyoruz.' 
        : 'We facilitate diagnostic processes by providing service procurement and operational solutions for high-speed and quality imaging CT systems.',
      icon: <FaXRay className="text-6xl text-slate-700 group-hover:text-slate-800 transition-colors duration-300" />,
      features: language === 'tr' 
        ? ['Hızlı Tarama Hizmeti', 'Yüksek Çözünürlüklü Görüntüleme', 'Tanı Süreçleri Optimizasyonu', 'Kurumsal Çözümler'] 
        : ['Fast Scanning Service', 'High Resolution Imaging', 'Diagnostic Process Optimization', 'Institutional Solutions']
    },
    {
      id: 'mammography',
      title: language === 'tr' ? 'Mamografi' : 'Mammography',
      description: language === 'tr' 
        ? 'Kadın sağlığı açısından hayati önem taşıyan mamografi hizmetlerinde, hem cihaz temini hem de işletme ve hizmet alımı modelleriyle sağlık kurumlarına destek oluyoruz.' 
        : 'We support healthcare institutions with both device procurement and operation and service procurement models in mammography services, which are vital for women\'s health.',
      icon: <FaFemale className="text-6xl text-slate-700 group-hover:text-slate-800 transition-colors duration-300" />,
      features: language === 'tr' 
        ? ['Cihaz Temini', 'Hizmet Alımı Modelleri', 'Kalite Kontrol Süreçleri', 'Tarama Programları'] 
        : ['Device Procurement', 'Service Procurement Models', 'Quality Control Processes', 'Screening Programs']
    }
  ];

  // Animasyon varyantları
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-700 py-24" style={{paddingTop: "7rem"}}>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {isMounted ? (
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md"
            >
              {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
            </motion.h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
              {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
            </h1>
          )}
          
          {isMounted ? (
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-sm"
            >
              {language === 'tr' 
                ? 'Tıbbi görüntüleme sistemleri alanında geniş kapsamlı profesyonel hizmetlerimiz.' 
                : 'Our comprehensive professional services in the field of medical imaging systems.'}
            </motion.p>
          ) : (
            <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-sm">
              {language === 'tr' 
                ? 'Tıbbi görüntüleme sistemleri alanında geniş kapsamlı profesyonel hizmetlerimiz.' 
                : 'Our comprehensive professional services in the field of medical imaging systems.'}
            </p>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, index) => (
              isMounted ? (
                <motion.div 
                  key={service.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                    <div className="p-6 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                      {service.icon}
                    </div>
                    <div className="p-6 flex-grow">
                      <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                      <p className="text-gray-700 mb-6">{service.description}</p>
                      
                      <h3 className="font-medium text-slate-800 mb-3">
                        {language === 'tr' ? 'Sunduğumuz Hizmetler' : 'Services We Offer'}
                      </h3>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                      <Link 
                        href={`/${language}/contact`}
                        className="inline-flex items-center text-slate-700 font-medium hover:text-slate-900 transition-colors"
                      >
                        {language === 'tr' ? 'Detaylı Bilgi' : 'More Information'} 
                        <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div key={service.id} className="group">
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                    <div className="p-6 flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                      {service.icon}
                    </div>
                    <div className="p-6 flex-grow">
                      <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                      <p className="text-gray-700 mb-6">{service.description}</p>
                      
                      <h3 className="font-medium text-slate-800 mb-3">
                        {language === 'tr' ? 'Sunduğumuz Hizmetler' : 'Services We Offer'}
                      </h3>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                      <Link 
                        href={`/${language}/contact`}
                        className="inline-flex items-center text-slate-700 font-medium hover:text-slate-900 transition-colors"
                      >
                        {language === 'tr' ? 'Detaylı Bilgi' : 'More Information'} 
                        <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {isMounted ? (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center"
            >
              {language === 'tr' ? 'Hizmet Sürecimiz' : 'Our Service Process'}
            </motion.h2>
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              {language === 'tr' ? 'Hizmet Sürecimiz' : 'Our Service Process'}
            </h2>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: language === 'tr' ? 'İhtiyaç Analizi' : 'Needs Analysis',
                description: language === 'tr' 
                  ? 'İhtiyaçlarınızı detaylı bir şekilde analiz ederek, size en uygun çözümleri sunuyoruz.' 
                  : 'By analyzing your needs in detail, we offer the most suitable solutions for you.'
              },
              {
                step: 2,
                title: language === 'tr' ? 'Planlama' : 'Planning',
                description: language === 'tr' 
                  ? 'Detaylı bir planlama ile hizmet sürecinin her aşamasını organize ediyoruz.' 
                  : 'We organize every stage of the service process with detailed planning.'
              },
              {
                step: 3,
                title: language === 'tr' ? 'Uygulama' : 'Implementation',
                description: language === 'tr' 
                  ? 'Uzman ekibimiz, planlanan hizmeti en yüksek kalitede ve zamanında gerçekleştirir.' 
                  : 'Our expert team performs the planned service at the highest quality and on time.'
              },
              {
                step: 4,
                title: language === 'tr' ? 'Takip & Destek' : 'Follow-up & Support',
                description: language === 'tr' 
                  ? 'Hizmet sonrası düzenli takip ve sürekli teknik destek ile yanınızdayız.' 
                  : 'We are by your side with regular follow-up and continuous technical support after service.'
              }
            ].map((process, index) => (
              isMounted ? (
                <motion.div 
                  key={process.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gray-50 rounded-lg p-6 h-full hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <div className="bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                      {process.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center">{process.title}</h3>
                    <p className="text-gray-700 text-center">{process.description}</p>
                  </div>
                  
                  {/* Bağlayıcı oklar - sadece mobil dışındaki ekranlarda ve son öğe dışında */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.293 5.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L16.586 13H5a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div key={process.step} className="relative">
                  <div className="bg-gray-50 rounded-lg p-6 h-full hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <div className="bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                      {process.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center">{process.title}</h3>
                    <p className="text-gray-700 text-center">{process.description}</p>
                  </div>
                  
                  {/* Bağlayıcı oklar - sadece mobil dışındaki ekranlarda ve son öğe dışında */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.293 5.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L16.586 13H5a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 to-slate-700/50"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {isMounted ? (
            <>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg"
              >
                {language === 'tr' ? 'Hizmetlerimiz Hakkında Bilgi Almak İçin' : 'For Information About Our Services'}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md"
              >
                {language === 'tr' 
                  ? 'Tıbbi görüntüleme sistemleriniz için en iyi hizmeti almak için bizimle iletişime geçin.' 
                  : 'Contact us to get the best service for your medical imaging systems.'}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center"
              >
                <Link 
                  href={`/${language}/contact`}
                  className="inline-flex items-center px-8 py-3 bg-white text-slate-800 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  <span className="relative z-10 font-medium">
                    {language === 'tr' ? 'İletişime Geçin' : 'Contact Us'} <FaArrowRight className="inline ml-2" />
                  </span>
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
                {language === 'tr' ? 'Hizmetlerimiz Hakkında Bilgi Almak İçin' : 'For Information About Our Services'}
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md">
                {language === 'tr' 
                  ? 'Tıbbi görüntüleme sistemleriniz için en iyi hizmeti almak için bizimle iletişime geçin.' 
                  : 'Contact us to get the best service for your medical imaging systems.'}
              </p>
              <div className="flex justify-center">
                <Link 
                  href={`/${language}/contact`}
                  className="inline-flex items-center px-8 py-3 bg-white text-slate-800 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  <span className="relative z-10 font-medium">
                    {language === 'tr' ? 'İletişime Geçin' : 'Contact Us'} <FaArrowRight className="inline ml-2" />
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
} 