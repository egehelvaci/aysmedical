'use client';

import React from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import CookieConsent from './CookieConsent';

type FooterProps = {
  lang: string;
};

const Footer = ({ lang }: FooterProps) => {
  const language = lang || 'tr'; // Default to 'tr' if lang is undefined
  const year = new Date().getFullYear();
  
  const contactInfo = {
    phone: '+90 506 886 01 05',
    email: 'info@ayshealth.com.tr',
    address: language === 'tr' 
      ? 'MERKEZ MAH. SEÇKİN SK. Z OFİS NO: 2 -4A İÇ KAPI NO: 239 KAĞITHANE/ İSTANBUL' 
      : 'MERKEZ DISTRICT, SECKIN ST. Z OFFICE NO: 2 -4A INTERIOR DOOR NO: 239 KAGITHANE/ISTANBUL',
    whatsapp: '+90 506 886 01 05'
  };
  
  const footerLinks = {
    company: [
      { title: language === 'tr' ? 'Hakkımızda' : 'About Us', path: `/${language}/about` },
      { title: language === 'tr' ? 'Hizmetler' : 'Services', path: `/${language}/services` },
      { title: language === 'tr' ? 'Ürünler' : 'Products', path: `/${language}/products` },
      { title: language === 'tr' ? 'İletişim' : 'Contact', path: `/${language}/contact` },
    ]
  };

  return (
    <>
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {language === 'tr' ? 'AYS Medikal' : 'AYS Medical'}
                </h3>
                <p className="text-sm text-gray-400 tracking-wider">
                  {language === 'tr' 
                    ? 'Görüntüleme ve Sağlık Hizmetleri' 
                    : 'Imaging and Healthcare Services'}
                </p>
              </div>
              <p className="mb-4 text-gray-400">
                {language === 'tr' 
                  ? 'Modern tıbbi görüntüleme sistemleri sunan lider sağlık teknolojileri firması.'
                  : 'Leading healthcare technology company providing modern medical imaging systems.'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">{language === 'tr' ? 'Hızlı Linkler' : 'Quick Links'}</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link href={link.path} className="text-gray-400 hover:text-white transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">{language === 'tr' ? 'İletişim' : 'Contact'}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-2 text-green-400" />
                  <span className="text-gray-400">{contactInfo.address}</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="mr-2 text-green-400" />
                  <a href={`tel:${contactInfo.phone}`} className="text-gray-400 hover:text-white">
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="mr-2 text-green-400" />
                  <a href={`mailto:${contactInfo.email}`} className="text-gray-400 hover:text-white">
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-center">
                  <FaWhatsapp className="mr-2 text-green-400" />
                  <a 
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/\s+/g, '')}`} 
                    className="text-gray-400 hover:text-white"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>© {year} {language === 'tr' ? 'AYS Medikal' : 'AYS Medical'}. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
      <CookieConsent language={lang} />
    </>
  );
};

export default Footer; 