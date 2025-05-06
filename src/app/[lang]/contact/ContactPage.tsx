'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane,
  FaCheckCircle,
  FaWhatsapp,
  FaExclamationTriangle
} from 'react-icons/fa';

type ContactPageProps = {
  lang: string;
};

export default function ContactPage({ lang }: ContactPageProps) {
  const language = lang;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  
  // Animasyon için referanslar
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Intersection Observer kurulumu
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Gözlemlenecek elementleri kaydet
    const elements = [
      firstSectionRef.current,
      infoSectionRef.current,
      formSectionRef.current,
      mapSectionRef.current
    ];
    
    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFocus = (name: string) => {
    setActiveInput(name);
  };
  
  const handleBlur = () => {
    setActiveInput(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormError(language === 'tr' ? 'Lütfen tüm zorunlu alanları doldurun.' : 'Please fill in all required fields.');
      return;
    }
    
    // E-posta doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError(language === 'tr' ? 'Lütfen geçerli bir e-posta adresi girin.' : 'Please enter a valid email address.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          languageCode: language
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || (language === 'tr' ? 'Bir hata oluştu' : 'An error occurred'));
      }
      
      // Başarılı
      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // 5 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      setFormError(
        error instanceof Error 
          ? error.message 
          : (language === 'tr' ? 'Mesajınız gönderilirken bir hata oluştu.' : 'An error occurred while sending your message.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // İletişim bilgileri
  const contactInfo = {
    address: language === 'tr' 
      ? 'MERKEZ MAH. SEÇKİN SK. Z OFİS NO: 2 -4A İÇ KAPI NO: 239 KAĞITHANE/ İSTANBUL'
      : 'MERKEZ DISTRICT, SECKIN ST. Z OFFICE NO: 2 -4A INTERIOR DOOR NO: 239 KAGITHANE/ISTANBUL',
    phone: '+90 506 886 01 05',
    email: 'info@ayshealth.com.tr',
    hours: language === 'tr'
      ? 'Pazartesi - Cuma: 09:00 - 18:00'
      : 'Monday - Friday: 09:00 - 18:00'
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-32 overflow-hidden" style={{paddingTop: "7rem"}}>
        {/* Video Arka Plan */}
        <div className="absolute inset-0 z-0">
          <video 
            className="absolute w-full h-full object-cover opacity-70"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="https://s3.tebi.io/aysmedical/contactus.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-700/50"></div>
        </div>
        
        {/* Dekoratif elemanlar - Opaklığı azaltıyorum */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-200 opacity-5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        {/* Animasyonlu background dekorları - Opaklığı azaltıyorum */}
        <motion.div 
          className="absolute left-10 top-10 w-20 h-20 bg-slate-300 rounded-full opacity-10 blur-xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute right-20 bottom-20 w-32 h-32 bg-slate-400 rounded-full opacity-10 blur-xl"
          animate={{ 
            x: [0, -70, 0],
            y: [0, -40, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
          >
            {language === 'tr' ? 'İletişime Geçin' : 'Get in Touch'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-50 max-w-3xl mx-auto mb-8 drop-shadow-md"
          >
            {language === 'tr' 
              ? 'Soru, görüş ve talepleriniz için bizimle iletişime geçin.' 
              : 'Contact us for your questions, comments, and requests.'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <a 
              href="https://wa.me/905068860105" 
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button relative inline-flex items-center px-8 py-3 group hover:bg-green-600/30 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                {language === 'tr' ? 'WhatsApp ile Yazın' : 'Chat on WhatsApp'} <FaWhatsapp className="inline ml-2" />
              </span>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Form and Info Section */}
      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4">
          <div 
            className="flex flex-col lg:flex-row gap-12"
            ref={firstSectionRef}
          >
            {/* Contact Form */}
            <div className="lg:w-2/3" id="contact-form">
              <div className="bg-white backdrop-blur-lg bg-opacity-70 rounded-xl shadow-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-slate-600 to-slate-500 text-transparent bg-clip-text">
                  {language === 'tr' ? 'Bize Mesaj Gönderin' : 'Send Us a Message'}
                </h2>
                
                {formSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 text-xl" />
                    <p className="text-green-700">
                      {language === 'tr' 
                        ? 'Mesajınız başarıyla alınmıştır. E-posta adresinize bir onay mesajı gönderildi. En kısa sürede size dönüş yapacağız.' 
                        : 'Your message has been successfully received. A confirmation email has been sent to your address. We will get back to you as soon as possible.'}
                    </p>
                  </div>
                )}
                
                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
                    <p className="text-red-700">{formError}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="relative">
                      <label 
                        htmlFor="name" 
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        {language === 'tr' ? 'Adınız Soyadınız *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        {language === 'tr' ? 'E-posta Adresiniz *' : 'Your Email *'}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="phone" 
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        {language === 'tr' ? 'Telefon Numaranız' : 'Your Phone'}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                      />
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="subject" 
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        {language === 'tr' ? 'Konu *' : 'Subject *'}
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="relative mb-6">
                    <label 
                      htmlFor="message" 
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      {language === 'tr' ? 'Mesajınız *' : 'Your Message *'}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-300 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        {language === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        {language === 'tr' ? 'Mesajı Gönder' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="lg:w-1/3" ref={infoSectionRef}>
              <div className="bg-slate-700 text-white rounded-xl shadow-2xl p-8 h-full relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-600 rounded-full opacity-20"></div>
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-slate-600 rounded-full opacity-20"></div>
                
                <h2 className="text-2xl font-bold mb-8">
                  {language === 'tr' ? 'İletişim Bilgilerimiz' : 'Contact Information'}
                </h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start">
                    <div className="bg-slate-600 rounded-full p-3 mr-4">
                      <FaMapMarkerAlt className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white/90 mb-1">
                        {language === 'tr' ? 'Adres' : 'Address'}
                      </h3>
                      <p className="text-white/75">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-slate-600 rounded-full p-3 mr-4">
                      <FaPhone className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white/90 mb-1">
                        {language === 'tr' ? 'Telefon' : 'Phone'}
                      </h3>
                      <p className="text-white/75">
                        <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                          {contactInfo.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-slate-600 rounded-full p-3 mr-4">
                      <FaEnvelope className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white/90 mb-1">
                        {language === 'tr' ? 'E-posta' : 'Email'}
                      </h3>
                      <p className="text-white/75">
                        <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                          {contactInfo.email}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-slate-600 rounded-full p-3 mr-4">
                      <FaClock className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white/90 mb-1">
                        {language === 'tr' ? 'Çalışma Saatleri' : 'Working Hours'}
                      </h3>
                      <p className="text-white/75">{contactInfo.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Google Maps */}
      <section className="py-20 bg-gray-50" ref={mapSectionRef}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {language === 'tr' ? 'Bizi Ziyaret Edin' : 'Visit Us'}
          </h2>
          
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 h-[500px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d751.2176022840297!2d28.971279827608576!3d41.077348080728906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzM3LjciTiAyOMKwNTgnMTcuMyJF!5e0!3m2!1str!2str!4v1699862596257!5m2!1str!2str" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title={language === 'tr' ? 'AYS Medical Konum' : 'AYS Medical Location'}
            ></iframe>
          </div>
          
          {/* Yol Tarifi Bölümü */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">
              {language === 'tr' ? 'Yol Tarifi' : 'Directions'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Toplu Taşıma */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h4 className="font-bold text-lg mb-3 text-slate-700">
                  {language === 'tr' ? 'Toplu Taşıma ile' : 'Public Transportation'}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-slate-600 mt-2 mr-2"></span>
                    {language === 'tr' 
                      ? 'Mecidiyeköy-Mahmutbey metro hattını kullanarak Nurtepe istasyonunda inin.' 
                      : 'Take the Mecidiyeköy-Mahmutbey metro line and get off at Nurtepe station.'}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-slate-600 mt-2 mr-2"></span>
                    {language === 'tr' 
                      ? 'İstasyondan çıkarak Seçkin Sokak yönünde 5 dakika yürüyün.' 
                      : 'Exit the station and walk 5 minutes towards Seçkin Street.'}
                  </li>
                </ul>
              </div>
              
              {/* Özel Araç */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h4 className="font-bold text-lg mb-3 text-slate-700">
                  {language === 'tr' ? 'Özel Araç ile' : 'By Car'}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-slate-600 mt-2 mr-2"></span>
                    {language === 'tr' 
                      ? 'Kağıthane D100 bağlantı yolunu takip ederek Merkez Mahallesi sapağından çıkın.' 
                      : 'Follow the Kağıthane D100 connection road and exit at Merkez District junction.'}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-slate-600 mt-2 mr-2"></span>
                    {language === 'tr' 
                      ? 'Z Ofis tabelalarını takip ederek Seçkin Sokak\'a ulaşın.' 
                      : 'Follow the Z Office signs to reach Seçkin Street.'}
                  </li>
                </ul>
              </div>
              
              {/* Taksi */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h4 className="font-bold text-lg mb-3 text-slate-700">
                  {language === 'tr' ? 'Taksi ile' : 'By Taxi'}
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-slate-600 mt-2 mr-2"></span>
                    {language === 'tr' 
                      ? 'Taksiye "Kağıthane Merkez Mahallesi, Z Ofis" adresini söyleyin.' 
                      : 'Tell the taxi driver "Kağıthane Merkez District, Z Office" address.'}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-slate-600 mt-2 mr-2"></span>
                    {language === 'tr' 
                      ? 'Alternatif olarak bu adres bilgisini kullanabilirsiniz: "Merkez Mah. Seçkin Sk. Z Ofis No: 2 -4A İç Kapı No: 239 Kağıthane"' 
                      : 'Alternatively, you can use this address information: "Merkez District, Seckin Street, Z Office No: 2 -4A Interior Door No: 239 Kagithane"'}
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=41.0772755,28.9714902`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors duration-300"
              >
                <FaMapMarkerAlt className="mr-2" />
                {language === 'tr' ? 'Google Maps\'te Yol Tarifi Al' : 'Get Directions on Google Maps'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 