'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CubeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    admins: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // İstatistikleri yükle
    const fetchStats = async () => {
      try {
        // Ürünleri getir
        const productsResponse = await fetch('/api/admin/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!productsResponse.ok) {
          throw new Error('Ürünler alınamadı');
        }

        const productsData = await productsResponse.json();
        
        setStats({
          products: productsData.products.length,
          admins: 1 // Admin sayısı şimdilik sabit
        });
      } catch (error) {
        console.error('İstatistik yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const cards = [
    {
      name: 'Ürünler',
      icon: CubeIcon,
      value: stats.products,
      href: '/admin/products',
      bgColor: 'bg-blue-500',
    },
    {
      name: 'Yöneticiler',
      icon: UserIcon,
      value: stats.admins,
      href: '/admin/admins',
      bgColor: 'bg-purple-500',
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-700">
        Aysmed Yönetim Paneline Hoş Geldiniz
      </p>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${card.bgColor}`}>
                    <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                      <dd>
                        {isLoading ? (
                          <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          <div className="text-lg font-medium text-gray-900">{card.value}</div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={card.href}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Görüntüle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Hızlı Erişim</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900">Yeni Ürün Ekle</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Kataloğa yeni bir ürün ekleyin.</p>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
                >
                  Yeni Ürün
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 