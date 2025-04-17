'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaTools, FaCogs, FaRegLightbulb, FaRegChartBar } from 'react-icons/fa';

type ServicesPageProps = {
  lang: string;
};

export default function ServicesPage({ lang }: ServicesPageProps) {
  const language = lang;

  // Hizmet verileri
  const services = [
    {
      id: 'installation',
      title: language === 'tr' ? 'Kurulum ve Montaj' : 'Installation & Assembly',
      description: language === 'tr' 
        ? 'Tüm tıbbi görüntüleme sistemleriniz için profesyonel kurulum ve montaj hizmeti. Uzman ekibimiz, cihazlarınızın en verimli şekilde çalışması için gerekli tüm ayarları yapar ve sistemlerin sorunsuz bir şekilde entegrasyonunu sağlar.' 
        : 'Professional installation and assembly service for all your medical imaging systems. Our expert team makes all the necessary adjustments for your devices to work most efficiently and ensures seamless integration of the systems.',
      image: 'https://img.freepik.com/free-photo/medical-equipment-installation-hospital-room-technician_31965-7226.jpg',
      icon: <FaTools className="text-5xl text-blue-600" />
    },
    {
      id: 'maintenance',
      title: language === 'tr' ? 'Bakım ve Onarım' : 'Maintenance & Repair',
      description: language === 'tr' 
        ? 'Düzenli bakım ve hızlı onarım hizmetleri ile cihazlarınızın kesintisiz çalışmasını sağlıyoruz. Önleyici bakım programlarımız, olası arızaları önlerken, acil durumlarda 24 saat teknik destek sunuyoruz.' 
        : 'We ensure uninterrupted operation of your devices with regular maintenance and quick repair services. While our preventive maintenance programs prevent possible failures, we provide 24-hour technical support in emergencies.',
      image: 'https://img.freepik.com/free-photo/technician-repairing-medical-equipment-hospital_107420-74031.jpg',
      icon: <FaCogs className="text-5xl text-blue-600" />
    },
    {
      id: 'consulting',
      title: language === 'tr' ? 'Danışmanlık' : 'Consulting',
      description: language === 'tr' 
        ? 'Tıbbi görüntüleme sistemleri konusunda uzman danışmanlık hizmetleri. İhtiyaçlarınıza en uygun cihazların seçiminden, kurulum planlamasına ve personel eğitimine kadar kapsamlı destek sunuyoruz.' 
        : 'Expert consulting services on medical imaging systems. We provide comprehensive support from selecting the most suitable devices for your needs to installation planning and staff training.',
      image: 'https://img.freepik.com/free-photo/healthcare-professionals-meeting-hospital-conference-room_107420-84790.jpg',
      icon: <FaRegLightbulb className="text-5xl text-blue-600" />
    },
    {
      id: 'analysis',
      title: language === 'tr' ? 'Performans Analizi' : 'Performance Analysis',
      description: language === 'tr' 
        ? 'Cihazlarınızın performansını düzenli olarak analiz ederek, verimliliği artıracak öneriler sunuyoruz. Detaylı raporlar ile sistem kullanımınızı optimize etmenize yardımcı oluyoruz.' 
        : 'By regularly analyzing the performance of your devices, we offer suggestions to increase efficiency. We help you optimize your system usage with detailed reports.',
      image: 'https://img.freepik.com/free-photo/medical-technology-data-analysis-concept-doctor-working-with-modern-computer_107420-84791.jpg',
      icon: <FaRegChartBar className="text-5xl text-blue-600" />
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
            <source src="/images/services/services.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-sm">
            {language === 'tr' 
              ? 'Tıbbi görüntüleme sistemleri alanında geniş kapsamlı profesyonel hizmetlerimiz.' 
              : 'Our comprehensive professional services in the field of medical imaging systems.'}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-20">
            {services.map((service, index) => (
              <div key={service.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <div className="lg:w-1/2">
                  <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <div className="mb-6">{service.icon}</div>
                  <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <Link 
                    href={`/${language}/contact`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  >
                    {language === 'tr' ? 'Detaylı Bilgi' : 'More Information'} 
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
            {language === 'tr' ? 'Hizmet Sürecimiz' : 'Our Service Process'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'tr' ? 'İhtiyaç Analizi' : 'Needs Analysis'}
              </h3>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'İhtiyaçlarınızı detaylı bir şekilde analiz ederek, size en uygun çözümleri sunuyoruz.' 
                  : 'By analyzing your needs in detail, we offer the most suitable solutions for you.'}
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'tr' ? 'Planlama' : 'Planning'}
              </h3>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'Detaylı bir planlama ile hizmet sürecinin her aşamasını organize ediyoruz.' 
                  : 'We organize every stage of the service process with detailed planning.'}
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'tr' ? 'Uygulama' : 'Implementation'}
              </h3>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'Uzman ekibimiz, planlanan hizmeti en yüksek kalitede ve zamanında gerçekleştirir.' 
                  : 'Our expert team performs the planned service at the highest quality and on time.'}
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">4</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'tr' ? 'Takip & Destek' : 'Follow-up & Support'}
              </h3>
              <p className="text-gray-700">
                {language === 'tr' 
                  ? 'Hizmet sonrası düzenli takip ve sürekli teknik destek ile yanınızdayız.' 
                  : 'We are by your side with regular follow-up and continuous technical support after service.'}
              </p>
            </div>
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