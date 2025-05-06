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
            <source src="https://s3.tebi.io/aysmedical/aboutus.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            {language === 'tr' ? 'Hakkımızda' : 'About Us'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-sm">
            {language === 'tr' 
              ? 'Tıbbi görüntüleme sistemleri alanında 25 yılı aşkın deneyimimizle sağlık sektörüne hizmet veriyoruz.' 
              : 'We have been serving the healthcare sector with more than 25 years of experience in medical imaging systems.'}
          </p>
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
              <div className="text-gray-700 space-y-4">
                {language === 'tr' ? (
                  <>
                    <p>AYS Medikal Görüntüleme ve Sağlık Hizmetleri A.Ş. olarak, sağlık sektöründe 25 yılı aşkın süredir edindiğimiz tecrübeyle, tanı ve teşhisin en kritik aşaması olan görüntüleme hizmetlerinde yüksek kalite standartlarını hedefliyoruz.</p>
                    <p>Modern tıbbi cihazlarla donattığımız MR, mamografi, röntgen ve bilgisayarlı tomografi sistemlerimizi kurarak, sağlık kurumlarına değer katıyor; her hastanın zamanında, doğru ve güvenilir bir şekilde teşhis almasına katkıda bulunuyoruz.</p>
                    <p>Amacımız, teknolojiyi insan sağlığının hizmetine sunarak, toplumun yaşam kalitesini yükseltmek ve sağlık alanındaki profesyonellere en doğru veriyi ulaştırmaktır.</p>
                  </>
                ) : (
                  <>
                    <p>As AYS Medical Imaging and Healthcare Services Inc., with our experience of more than 25 years in the healthcare sector, we aim for high quality standards in imaging services, which is the most critical stage of diagnosis.</p>
                    <p>By establishing our MR, mammography, X-ray and computed tomography systems equipped with modern medical devices, we add value to healthcare institutions; we contribute to ensuring that each patient receives a timely, accurate and reliable diagnosis.</p>
                    <p>Our goal is to improve the quality of life of society by putting technology at the service of human health and to deliver the most accurate data to professionals in the field of health.</p>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">
                {language === 'tr' ? 'Vizyonumuz' : 'Our Vision'}
              </h2>
              <div className="text-gray-700 space-y-4">
                {language === 'tr' ? (
                  <>
                    <p>AYS Medikal olarak vizyonumuz; Türkiye'de ve uluslararası arenada, ileri düzey tıbbi görüntüleme çözümleri sunan lider bir kuruluş olmaktır.</p>
                    <p>Sürekli gelişen sağlık teknolojilerini yakından takip ederek, çağın gereksinimlerine uygun sistemlerle çözüm ortağı olduğumuz tüm sağlık kuruluşlarının yanında yer alıyoruz.</p>
                    <p>Yenilikçi yaklaşımımız, hasta güvenliği ve memnuniyetini esas alan hizmet anlayışımızla, sektörde kaliteyi ve sürdürülebilir başarıyı temsil eden bir marka olmayı hedefliyoruz.</p>
                  </>
                ) : (
                  <>
                    <p>As AYS Medical, our vision is to be a leading organization that provides advanced medical imaging solutions in Turkey and the international arena.</p>
                    <p>By closely following continuously developing healthcare technologies, we stand by all healthcare organizations with which we are solution partners with systems suitable for the requirements of the age.</p>
                    <p>With our innovative approach and service understanding based on patient safety and satisfaction, we aim to be a brand that represents quality and sustainable success in the sector.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            {language === 'tr' ? 'Neden Biz?' : 'Why Choose Us?'}
          </h2>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="space-y-4">
              {language === 'tr' ? (
                <>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Köklü Tecrübe:</span> 25 yıllık deneyimimiz, sektördeki güçlü konumumuzu ve güvenilirliğimizi pekiştiriyor.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Teknolojiye Yatırım:</span> En son teknolojiye sahip MR, BT, mamografi ve röntgen sistemlerini kullanıyor; projelere özel çözümler geliştiriyoruz.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Uzman Kadro:</span> Alanında uzman mühendislerimiz, teknikerlerimiz ve yönetim ekibimizle her adımda profesyonel destek sunuyoruz.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Güvenilir ve Hızlı Hizmet:</span> Tanı süreçlerinde zamanın ne kadar kıymetli olduğunu biliyor, yüksek kaliteli görüntüleri hızlı ve güvenli biçimde sunuyoruz.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Kurumsal İş Ortaklığı:</span> Sunduğumuz hizmetin ötesinde, iş birliği yaptığımız sağlık kurumlarının çözüm ortağı oluyor; ihtiyaca özel, esnek ve sürdürülebilir projeler geliştiriyoruz.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Hasta ve Hekim Odaklılık:</span> Hizmetlerimizin her aşamasında hasta konforunu ve hekimin doğru teşhis için ihtiyaç duyduğu kaliteyi ön planda tutuyoruz.</span></p>
                </>
              ) : (
                <>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Deep-rooted Experience:</span> Our 25 years of experience reinforces our strong position and reliability in the sector.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Investment in Technology:</span> We use MRI, CT, mammography and X-ray systems with the latest technology; we develop project-specific solutions.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Expert Staff:</span> We provide professional support at every step with our expert engineers, technicians and management team.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Reliable and Fast Service:</span> We know how valuable time is in diagnostic processes, and we provide high-quality images quickly and safely.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Corporate Partnership:</span> Beyond the service we provide, we are a solution partner for healthcare institutions we collaborate with; we develop customized, flexible and sustainable projects.</span></p>
                  <p className="flex items-start"><span className="text-blue-600 font-bold text-xl mr-2">✓</span> <span><span className="font-semibold">Patient and Physician Focus:</span> We prioritize patient comfort and the quality needed by physicians for accurate diagnosis at every stage of our services.</span></p>
                </>
              )}
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
            <source src="https://s3.tebi.io/aysmedical/contactus.mp4" type="video/mp4" />
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