'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';

type HeroSliderProps = {
  language: string;
};

const HeroSlider: React.FC<HeroSliderProps> = ({ language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Scroll animasyonu için
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const translateY = useTransform(scrollY, [0, 300], [0, 100]);
  
  // Video repeat için
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video otomatik oynatılamadı:", error);
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden" ref={containerRef} style={{margin: 0, padding: 0, top: 0, position: "absolute", left: 0, right: 0, bottom: 0}}>
      {/* Video Arka Plan */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover opacity-85"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://s3.tebi.io/aysmedical/hero1.mp4" type="video/mp4" />
        </video>
        {/* Koyu Overlay - Daha hafif bir gradient kullanıyorum */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/40"></div>
      </div>

      {/* İçerik */}
      <motion.div 
        className="container mx-auto h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ opacity, y: translateY }}
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-md sm:text-xl text-slate-300 font-medium mb-2 drop-shadow-lg text-center">
              {language === 'tr' 
                ? 'AYS Medikal Görüntüleme ve Sağlık Hizmetleri A.Ş' 
                : 'AYS Medical Imaging and Healthcare Services Inc.'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg text-center">
              {language === 'tr' 
                ? 'Tıbbi Görüntüleme Sistemlerinde Güvenilir Çözüm Ortağınız' 
                : 'Your Reliable Partner in Medical Imaging Systems'}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl text-gray-200 mb-8 drop-shadow-md text-center">
              {language === 'tr'
                ? 'En son teknoloji tıbbi görüntüleme sistemleri ve uzman teknik servis hizmetleri ile sağlık sektörünün hizmetindeyiz.'
                : 'We are at the service of the healthcare sector with the latest technology medical imaging systems and expert technical services.'}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href={`/${language}/products`}
              className="inline-flex items-center bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-md transition-colors shadow-lg"
            >
              {language === 'tr' ? 'Ürünlerimiz' : 'Our Products'}
              <FaArrowRight className="ml-2" />
            </Link>
            <Link 
              href={`/${language}/contact`}
              className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white/10 py-3 px-6 rounded-md transition-colors"
            >
              {language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="text-white text-sm uppercase tracking-wider text-center mb-2">
          {language === 'tr' ? 'Aşağı Kaydır' : 'Scroll Down'}
        </div>
        <div className="w-8 h-12 rounded-full border-2 border-white mx-auto flex justify-center">
          <motion.div 
            className="w-1.5 h-3 bg-white rounded-full mt-2"
            animate={{ 
              y: [0, 7, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSlider; 