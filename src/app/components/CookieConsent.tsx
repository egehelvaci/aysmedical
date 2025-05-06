'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FaCookieBite, FaShieldAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type CookieConsentProps = {
  language: string;
};

const CookieConsent: React.FC<CookieConsentProps> = ({ language }) => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Sayfanın yüklenmesini bekle
    const timer = setTimeout(() => {
      // Check if user already accepted cookies
      const cookieConsent = Cookies.get('cookie-consent');
      if (!cookieConsent) {
        setShowConsent(true);
      }
    }, 1500); // 1.5 saniye gecikme

    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    // Set cookie for 30 days
    Cookies.set('cookie-consent', 'accepted', { expires: 30 });
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Set cookie to remember that user declined (but only for this session)
    Cookies.set('cookie-consent', 'declined');
    setShowConsent(false);
  };

  const consentVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      y: 100, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div 
          variants={consentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-5 left-0 right-0 z-50 mx-auto px-4 max-w-4xl"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="relative p-6">
              {/* Kapatma butonu */}
              <button 
                onClick={declineCookies}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={language === 'tr' ? 'Kapat' : 'Close'}
              >
                <FaTimes />
              </button>
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Icon ve Başlık */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    <FaCookieBite className="text-blue-600 text-xl" />
                  </div>
                </div>
                
                {/* İçerik */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'tr' 
                      ? 'Çerez Kullanımı ve Gizlilik Politikası' 
                      : 'Cookie Usage and Privacy Policy'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'tr' 
                      ? 'Bu web sitesi, deneyiminizi geliştirmek için çerezler kullanmaktadır. Çerezler, web sitemizi nasıl kullandığınızı anlamamıza ve içeriklerimizi kişiselleştirmemize yardımcı olur. Kabul ederek, çerezleri KVKK ve GDPR çerçevesinde kullanmamıza izin vermiş olursunuz.' 
                      : 'This website uses cookies to enhance your experience. Cookies help us understand how you use our website and allow us to personalize our content. By accepting, you consent to our use of cookies in accordance with GDPR and privacy regulations.'}
                  </p>
                  
                  {/* Butonlar */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptCookies}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center font-medium"
                    >
                      <FaShieldAlt className="mr-2" />
                      {language === 'tr' ? 'Çerezleri Kabul Et' : 'Accept Cookies'}
                    </button>
                    <button
                      onClick={declineCookies}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                    >
                      {language === 'tr' ? 'Sadece Gerekli Çerezler' : 'Essential Cookies Only'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Alt bilgi şeridi */}
            <div className="bg-gray-50 py-2 px-6 text-xs text-gray-500 border-t border-gray-100">
              {language === 'tr' 
                ? 'Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.' 
                : 'For more information, please review our Privacy Policy.'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent; 