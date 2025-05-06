'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CloudArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

type Feature = {
  id: string;
  title: string;
  description: string;
  languageCode: string;
};

type UsageArea = {
  id: string;
  title: string;
  description: string;
  languageCode: string;
};

type ProductFormData = {
  code: string;
  image_url: string;
  localizations: {
    tr: {
      name: string;
      description: string;
      slug: string;
    };
    en: {
      name: string;
      description: string;
      slug: string;
    };
  };
  features: Feature[];
  usageAreas: UsageArea[];
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = React.use(params).id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tr' | 'en'>('tr');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form verisi
  const [formData, setFormData] = useState<ProductFormData>({
    code: '',
    image_url: '',
    localizations: {
      tr: {
        name: '',
        description: '',
        slug: '',
      },
      en: {
        name: '',
        description: '',
        slug: '',
      }
    },
    features: [],
    usageAreas: []
  });

  // Ürün verilerini getir
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Ürün bilgileri yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        
        // Verileri form formatına dönüştür
        setFormData({
          code: data.code || '',
          image_url: data.image_url || '',
          localizations: {
            tr: {
              name: data.localizations?.tr?.name || '',
              description: data.localizations?.tr?.description || '',
              slug: data.localizations?.tr?.slug || '',
            },
            en: {
              name: data.localizations?.en?.name || '',
              description: data.localizations?.en?.description || '',
              slug: data.localizations?.en?.slug || '',
            }
          },
          features: data.features || [],
          usageAreas: data.usageAreas || []
        });
        
        // Resim önizlemesi
        if (data.image_url) {
          setPreviewUrl(data.image_url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ürün bilgileri yüklenirken bir hata oluştu');
        console.error('Ürün getirme hatası:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Dosya seçildiğinde
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, vb.)');
      return;
    }
    
    // Dosya boyutu 10MB'dan küçük olmalı
    if (file.size > 10 * 1024 * 1024) {
      setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    // Önizleme
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);

    // Dosyayı upload et
    uploadFile(file);
  };

  // Dosyayı Tebi.io'ya yükle
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'products');
      
      const response = await fetch('/api/tebi/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setFormData(prev => ({
          ...prev,
          image_url: result.url
        }));
      } else {
        throw new Error(result.error || 'Dosya yüklenirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Dosya yüklenirken bir hata oluştu');
      
      // Başarısız olduğunda önizlemeyi temizle
      if (previewUrl && !formData.image_url) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Sürükle ve bırak işlemleri
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, vb.)');
        return;
      }
      
      // Önizleme
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setError(null);
      
      // Dosyayı upload et
      uploadFile(file);
    }
  };

  // Form alanlarını güncelle
  const handleChange = (
    lang: 'tr' | 'en',
    field: keyof ProductFormData['localizations']['tr'],
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      localizations: {
        ...prev.localizations,
        [lang]: {
          ...prev.localizations[lang],
          [field]: value
        }
      }
    }));
    
    // Slug alanını otomatik doldur
    if (field === 'name' && !formData.localizations[lang].slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({
        ...prev,
        localizations: {
          ...prev.localizations,
          [lang]: {
            ...prev.localizations[lang],
            slug
          }
        }
      }));
    }
  };

  // Ürün kodu değiştiğinde
  const handleCodeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      code: value
    }));
  };

  // Özellik ekle
  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      title: '',
      description: '',
      languageCode: activeTab
    };
    
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  // Özellik sil
  const removeFeature = (id: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== id)
    }));
  };

  // Özellik güncelle
  const updateFeature = (id: string, field: keyof Omit<Feature, 'id' | 'languageCode'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(feature => 
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    }));
  };

  // Kullanım alanı ekle
  const addUsageArea = () => {
    const newUsageArea: UsageArea = {
      id: Date.now().toString(),
      title: '',
      description: '',
      languageCode: activeTab
    };
    
    setFormData(prev => ({
      ...prev,
      usageAreas: [...prev.usageAreas, newUsageArea]
    }));
  };

  // Kullanım alanı sil
  const removeUsageArea = (id: string) => {
    setFormData(prev => ({
      ...prev,
      usageAreas: prev.usageAreas.filter(usageArea => usageArea.id !== id)
    }));
  };

  // Kullanım alanı güncelle
  const updateUsageArea = (id: string, field: keyof Omit<UsageArea, 'id' | 'languageCode'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      usageAreas: prev.usageAreas.map(usageArea => 
        usageArea.id === id ? { ...usageArea, [field]: value } : usageArea
      )
    }));
  };

  // Formu gönder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Zorunlu alanları kontrol et
      if (!formData.code) {
        setError('Ürün kodu zorunludur');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.image_url) {
        setError('Ürün görseli zorunludur');
        setIsSubmitting(false);
        return;
      }
      
      // Form verilerini düzenle
      const formDataToSubmit = {
        ...formData,
        // Kullanım alanlarını düzgün formatta gönder
        usageAreas: formData.usageAreas.filter(ua => ua.title.trim() !== '')
      };
      
      // Form verilerini konsola yazdır (hata ayıklama için)
      console.log('Form data:', JSON.stringify(formDataToSubmit, null, 2));
      
      // API'ye gönder
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (!response.ok) {
        let errorMessage = 'Ürün güncellenirken bir hata oluştu';
        
        if (result.error) {
          errorMessage = result.error;
          if (result.details) {
            errorMessage += `: ${result.details}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Başarılı
      setSuccess('Ürün başarıyla güncellendi');
      
      // Ürünler sayfasına yönlendir
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Form gönderme hatası:', err);
      setError(err instanceof Error ? err.message : 'Ürün güncellenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Ürün Düzenle</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ürün bilgilerini güncelleyin ve kaydedin.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
        {/* Ürün Kodu */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="product-code" className="block text-sm font-medium text-gray-700">
              Ürün Kodu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="product-code"
              value={formData.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Örn: AYS-001"
              required
            />
          </div>
          
          {/* Ürün Resmi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Resmi <span className="text-red-500">*</span>
            </label>
            
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
                isUploading ? 'opacity-50' : ''
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative w-full h-48 mx-auto">
                    <Image
                      src={previewUrl}
                      alt="Ürün resmi önizleme"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>
                      {previewUrl ? 'Resmi değiştir' : 'Resim yükle'}
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      disabled={isUploading}
                    />
                  </label>
                  {!previewUrl && <p className="pl-1">veya sürükleyip bırakın</p>}
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (maks. 10MB)</p>
                
                {isUploading && (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
                    <p className="text-sm text-gray-500">Yükleniyor...</p>
                  </div>
                )}
              </div>
            </div>
            
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
        
        {/* Dil Sekmeleri */}
        <div className="p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                type="button"
                className={`${
                  activeTab === 'tr'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('tr')}
              >
                Türkçe
              </button>
              <button
                type="button"
                className={`${
                  activeTab === 'en'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('en')}
              >
                English
              </button>
            </nav>
          </div>
          
          {/* Dil İçeriği */}
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor={`name-${activeTab}`} className="block text-sm font-medium text-gray-700">
                Ürün Adı {activeTab === 'tr' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                id={`name-${activeTab}`}
                value={formData.localizations[activeTab].name}
                onChange={(e) => handleChange(activeTab, 'name', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={activeTab === 'tr' ? 'Ürün adı' : 'Product name'}
                required={activeTab === 'tr'}
              />
            </div>
            
            <div>
              <label htmlFor={`description-${activeTab}`} className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id={`description-${activeTab}`}
                value={formData.localizations[activeTab].description}
                onChange={(e) => handleChange(activeTab, 'description', e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={activeTab === 'tr' ? 'Ürün açıklaması...' : 'Product description...'}
              />
            </div>
            
            <div>
              <label htmlFor={`slug-${activeTab}`} className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                id={`slug-${activeTab}`}
                value={formData.localizations[activeTab].slug}
                onChange={(e) => handleChange(activeTab, 'slug', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={activeTab === 'tr' ? 'urun-adi' : 'product-name'}
              />
              <p className="mt-1 text-xs text-gray-500">
                {activeTab === 'tr' ? 'URL için kullanılacak benzersiz tanımlayıcı' : 'Unique identifier for URL'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Ürün Özellikleri */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {activeTab === 'tr' ? 'Ürün Özellikleri' : 'Product Features'}
            </h3>
            
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Özellik Ekle
            </button>
          </div>
          
          {formData.features.filter(feature => feature.languageCode === activeTab).length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Henüz özellik eklenmemiş. "Özellik Ekle" butonuna tıklayarak yeni özellik ekleyebilirsiniz.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.features
                .filter(feature => feature.languageCode === activeTab)
                .map((feature) => (
                  <div key={feature.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Özellik Başlığı
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={activeTab === 'tr' ? 'Güçlü Mıknatıs' : 'Powerful Magnet'}
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex items-start space-x-4">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Açıklama
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={activeTab === 'tr' ? 'Özellik açıklaması...' : 'Feature description...'}
                          rows={2}
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeFeature(feature.id)}
                        className="mt-7 flex-shrink-0 p-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Ürün Kullanım Alanları */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {activeTab === 'tr' ? 'Ürün Kullanım Alanları' : 'Product Usage Areas'}
            </h3>
            
            <button
              type="button"
              onClick={addUsageArea}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Kullanım Alanı Ekle
            </button>
          </div>
          
          {formData.usageAreas.filter(usageArea => usageArea.languageCode === activeTab).length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Henüz kullanım alanı eklenmemiş. "Kullanım Alanı Ekle" butonuna tıklayarak yeni kullanım alanı ekleyebilirsiniz.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.usageAreas
                .filter(usageArea => usageArea.languageCode === activeTab)
                .map((usageArea) => (
                  <div key={usageArea.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kullanım Alanı Başlığı
                      </label>
                      <input
                        type="text"
                        value={usageArea.title}
                        onChange={(e) => updateUsageArea(usageArea.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={activeTab === 'tr' ? 'Kullanım Alanı' : 'Usage Area'}
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex items-start space-x-4">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Açıklama
                        </label>
                        <textarea
                          value={usageArea.description}
                          onChange={(e) => updateUsageArea(usageArea.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={activeTab === 'tr' ? 'Kullanım alanı açıklaması...' : 'Usage area description...'}
                          rows={2}
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeUsageArea(usageArea.id)}
                        className="mt-7 flex-shrink-0 p-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        
        {/* Form Gönder */}
        <div className="p-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            İptal
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || isUploading || !formData.image_url}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Güncelle'}
          </button>
        </div>
        
        {error && (
          <div className="mx-6 mb-6 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
