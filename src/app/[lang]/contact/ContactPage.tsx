'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane,
  FaCheckCircle,
  FaWhatsapp
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
  const [activeInput, setActiveInput] = useState<string | null>(null);
  
  // Intersection Observer için referanslar
  const fadeInElements = React.useRef<(HTMLDivElement | null)[]>([]);
  
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
    fadeInElements.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      fadeInElements.current.forEach((el) => {
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form işleme mantığı burada olacak
    console.log('Form data:', formData);
    
    // Başarılı form gönderimi simülasyonu
    setFormSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    // 3 saniye sonra başarı mesajını kaldır
    setTimeout(() => {
      setFormSuccess(false);
    }, 3000);
  };
  
  // İletişim bilgileri
  const contactInfo = {
    address: language === 'tr' 
      ? 'Yıldız Teknik Üniversitesi Teknoloji Geliştirme Bölgesi, C1 Blok No: 106-3 Esenler, İstanbul'
      : 'Yildiz Technical University Technology Development Zone, C1 Block No: 106-3 Esenler, Istanbul',
    phone: '+90 212 483 70 39',
    email: 'info@aysmed.com.tr',
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
            <source src="/images/contact/contactus.mp4" type="video/mp4" />
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
              href="https://wa.me/905555555555" 
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
            ref={(el) => (fadeInElements.current[0] = el)}
          >
            {/* Contact Form */}
            <div className="lg:w-2/3" id="contact-form">
              <div className="bg-white backdrop-blur-lg bg-opacity-70 rounded-xl shadow-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-slate-600 to-slate-500 text-transparent bg-clip-text">
                  {language === 'tr' ? 'Bize Mesaj Gönderin' : 'Send Us a Message'}
                </h2>
                
                {formSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-50 border border-slate-200 text-slate-700 px-6 py-4 rounded-lg mb-6 flex items-center"
                  >
                    <FaCheckCircle className="text-slate-500 mr-3 text-xl" />
                    <p>
                      {language === 'tr' 
                        ? 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.' 
                        : 'Your message has been sent successfully. We will get back to you as soon as possible.'}
                    </p>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="relative">
                      <label 
                        htmlFor="name" 
                        className={`absolute left-4 transition-all duration-200 ${
                          activeInput === 'name' || formData.name 
                            ? '-top-2.5 text-sm text-slate-600 bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        {language === 'tr' ? 'Adınız Soyadınız' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="email" 
                        className={`absolute left-4 transition-all duration-200 ${
                          activeInput === 'email' || formData.email 
                            ? '-top-2.5 text-sm text-slate-600 bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        {language === 'tr' ? 'E-posta Adresiniz' : 'Your Email'}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="phone" 
                        className={`absolute left-4 transition-all duration-200 ${
                          activeInput === 'phone' || formData.phone 
                            ? '-top-2.5 text-sm text-slate-600 bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        {language === 'tr' ? 'Telefon Numaranız' : 'Your Phone'}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus('phone')}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div className="relative">
                      <label 
                        htmlFor="subject" 
                        className={`absolute left-4 transition-all duration-200 ${
                          activeInput === 'subject' || formData.subject 
                            ? '-top-2.5 text-sm text-slate-600 bg-white px-1' 
                            : 'top-3 text-gray-500'
                        }`}
                      >
                        {language === 'tr' ? 'Konu' : 'Subject'}
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => handleFocus('subject')}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                        required
                      >
                        <option value="" disabled></option>
                        <option value="product">
                          {language === 'tr' ? 'Ürün Bilgisi' : 'Product Information'}
                        </option>
                        <option value="service">
                          {language === 'tr' ? 'Servis Talebi' : 'Service Request'}
                        </option>
                        <option value="support">
                          {language === 'tr' ? 'Teknik Destek' : 'Technical Support'}
                        </option>
                        <option value="other">
                          {language === 'tr' ? 'Diğer' : 'Other'}
                        </option>
                      </select>
                      <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L1 4H11L6 9Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8 relative">
                    <label 
                      htmlFor="message" 
                      className={`absolute left-4 transition-all duration-200 ${
                        activeInput === 'message' || formData.message 
                          ? '-top-2.5 text-sm text-slate-600 bg-white px-1' 
                          : 'top-3 text-gray-500'
                      }`}
                    >
                      {language === 'tr' ? 'Mesajınız' : 'Your Message'}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={handleBlur}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300"
                      required
                    ></textarea>
                  </div>
                  
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-slate-200 inline-flex items-center"
                  >
                    {language === 'tr' ? 'Gönder' : 'Send Message'} 
                    <FaPaperPlane className="ml-2" />
                  </motion.button>
                </form>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="lg:w-1/3">
              <div 
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-xl p-8 mb-8 border border-slate-100/50 backdrop-blur-lg"
                ref={(el) => (fadeInElements.current[1] = el)}
              >
                <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-slate-600 to-slate-500 text-transparent bg-clip-text">
                  {language === 'tr' ? 'İletişim Bilgileri' : 'Contact Information'}
                </h2>
                
                <div className="space-y-8">
                  <motion.div 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-slate-100 text-slate-600 rounded-full p-3 mr-4 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                      <FaMapMarkerAlt className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">
                        {language === 'tr' ? 'Adres' : 'Address'}
                      </h3>
                      <p className="text-gray-700">{contactInfo.address}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-slate-100 text-slate-600 rounded-full p-3 mr-4 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                      <FaPhone className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">
                        {language === 'tr' ? 'Telefon' : 'Phone'}
                      </h3>
                      <p className="text-gray-700">{contactInfo.phone}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-slate-100 text-slate-600 rounded-full p-3 mr-4 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                      <FaEnvelope className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">
                        {language === 'tr' ? 'E-posta' : 'Email'}
                      </h3>
                      <p className="text-gray-700">{contactInfo.email}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-slate-100 text-slate-600 rounded-full p-3 mr-4 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                      <FaClock className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">
                        {language === 'tr' ? 'Çalışma Saatleri' : 'Working Hours'}
                      </h3>
                      <p className="text-gray-700">{contactInfo.hours}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div 
            className="relative rounded-xl shadow-xl overflow-hidden"
            ref={(el) => (fadeInElements.current[3] = el)}
          >
            <div className="relative w-full h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2584437891208!2d28.890843976191906!3d41.0628058694036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab0a3aa121ecd%3A0xb5756f8b7555cb05!2sYildiz%20Technical%20University%20Technopark!5e0!3m2!1sen!2str!4v1632825325232!5m2!1sen!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
} 