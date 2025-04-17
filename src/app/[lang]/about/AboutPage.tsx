'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaUsers, FaLightbulb, FaCertificate, FaHandshake } from 'react-icons/fa';

type AboutPageProps = {
  lang: string;
};

export default function AboutPage({ lang }: AboutPageProps) {
  const language = lang;

  // Neden biz verileri
  const whyUs = [
    {
      title: language === 'tr' ? 'Kalite ve Güvenilirlik' : 'Quality and Reliability',
      description: language === 'tr' 
        ? 'En yüksek kalite standartlarında üretilmiş ürünler ve güvenilir hizmet anlayışı.'
        : 'Products manufactured to the highest quality standards and a reliable service approach.',
      icon: <FaCertificate className="text-4xl text-blue-600" />
    },
    {
      title: language === 'tr' ? 'Uzman Ekip' : 'Expert Team',
      description: language === 'tr' 
        ? 'Alanında uzman, deneyimli ve profesyonel ekip ile kaliteli hizmet.'
        : 'Quality service with an expert, experienced and professional team.',
      icon: <FaUsers className="text-4xl text-blue-600" />
    },
    {
      title: language === 'tr' ? 'Yenilikçi Yaklaşım' : 'Innovative Approach',
      description: language === 'tr' 
        ? 'Sürekli gelişen teknolojiyi takip eden yenilikçi bir yaklaşım.'
        : 'An innovative approach that follows constantly evolving technology.',
      icon: <FaLightbulb className="text-4xl text-blue-600" />
    },
    {
      title: language === 'tr' ? 'Müşteri Memnuniyeti' : 'Customer Satisfaction',
      description: language === 'tr' 
        ? 'Her zaman müşteri memnuniyetini ön planda tutan bir hizmet anlayışı.'
        : 'A service approach that always prioritizes customer satisfaction.',
      icon: <FaHandshake className="text-4xl text-blue-600" />
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gray-800 py-24" style={{paddingTop: "7rem"}}>
        <div className="absolute inset-0 overflow-hidden z-0">
          <video 
            className="absolute w-full h-full object-cover opacity-40"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/images/aboutus/aboutus.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            {language === 'tr' ? 'Hakkımızda' : 'About Us'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-sm">
            {language === 'tr' 
              ? 'Tıbbi görüntüleme sistemleri alanında 15 yılı aşkın deneyimimizle sağlık sektörüne hizmet veriyoruz.' 
              : 'We have been serving the healthcare sector with more than 15 years of experience in medical imaging systems.'}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                {language === 'tr' ? 'Şirket Hikayemiz' : 'Our Company Story'}
              </h2>
              <p className="text-gray-700 mb-4">
                {language === 'tr' 
                  ? 'AYSMED, 2009 yılında Dr. Ahmet Yılmaz tarafından tıbbi görüntüleme sistemleri alanında yenilikçi çözümler sunmak amacıyla kurulmuştur. Kuruluşundan bu yana, en yüksek kalitede tıbbi cihazları sağlamak ve üstün müşteri hizmeti sunmak için çalışmaktayız.'
                  : 'AYSMED was founded in 2009 by Dr. Ahmet Yılmaz to provide innovative solutions in the field of medical imaging systems. Since its establishment, we have been working to provide medical devices of the highest quality and superior customer service.'}
              </p>
              <p className="text-gray-700 mb-4">
                {language === 'tr' 
                  ? 'Yıllar içinde sektördeki en son teknolojik gelişmeleri takip ederek ve müşteri ihtiyaçlarına odaklanarak, Türkiye\'nin önde gelen tıbbi görüntüleme sistemleri tedarikçilerinden biri haline geldik.'
                  : 'Over the years, by following the latest technological developments in the industry and focusing on customer needs, we have become one of Turkey\'s leading medical imaging systems suppliers.'}
              </p>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'Bugün, 200\'den fazla hastane ve klinik ile çalışmakta ve tıbbi görüntüleme sistemleri, teknik servis ve danışmanlık hizmetleri sunmaktayız.'
                  : 'Today, we work with more than 200 hospitals and clinics, providing medical imaging systems, technical service and consulting services.'}
              </p>
            </div>
            <div className="lg:w-1/2 relative h-96">
              <Image 
                src="https://img.freepik.com/free-photo/modern-equipped-office-doctor_23-2147943719.jpg" 
                alt={language === 'tr' ? 'AYSMED Ofis' : 'AYSMED Office'}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                {language === 'tr' ? 'Misyonumuz' : 'Our Mission'}
              </h2>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'En son teknolojiye sahip tıbbi görüntüleme sistemleri sunarak, sağlık hizmetlerinin kalitesini artırmak, hastalar için daha iyi sonuçlar elde edilmesine katkıda bulunmak ve sağlık profesyonellerinin işlerini daha iyi yapmalarına yardımcı olmak.'
                  : 'To improve the quality of healthcare by providing medical imaging systems with the latest technology, to contribute to better outcomes for patients, and to help healthcare professionals do their jobs better.'}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                {language === 'tr' ? 'Vizyonumuz' : 'Our Vision'}
              </h2>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'Tıbbi görüntüleme sistemleri alanında yenilikçi çözümler ve üstün müşteri hizmeti ile tanınan, sağlık sektöründe lider bir teknoloji ortağı olmak.'
                  : 'To be a leading technology partner in the healthcare sector, recognized for innovative solutions and superior customer service in the field of medical imaging systems.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center">
            {language === 'tr' ? 'Neden Biz?' : 'Why Choose Us?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
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
            {language === 'tr' ? 'Bizimle Çalışmak İster misiniz?' : 'Would You Like to Work With Us?'}
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md">
            {language === 'tr' 
              ? 'Ürünlerimiz, hizmetlerimiz veya iş birliği fırsatları hakkında daha fazla bilgi almak için bizimle iletişime geçin.' 
              : 'Contact us to learn more about our products, services or collaboration opportunities.'}
          </p>
          <div className="flex justify-center">
            <Link 
              href={`/${language}/contact`}
              className="glass-button relative inline-flex items-center px-8 py-3 group hover:bg-white/20 transition-all duration-300"
            >
              <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                {language === 'tr' ? 'İletişime Geçin' : 'Contact Us'} <FaArrowRight className="inline ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
} 