'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

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

export default function NewProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tr');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  // Dosya seçildiğinde
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      setUploadError('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, vb.)');
      return;
    }
    
    // Dosya boyutu 10MB'dan küçük olmalı
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    // Önizleme
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadError(null);

    // Dosyayı upload et
    uploadFile(file);
  };

  // Dosyayı Tebi.io'ya yükle
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
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
      setUploadError(err instanceof Error ? err.message : 'Dosya yüklenirken bir hata oluştu');
      
      // Başarısız olduğunda önizlemeyi temizle
      if (previewUrl) {
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
        setUploadError('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, vb.)');
        return;
      }
      
      // Önizleme
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploadError(null);
      
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
    
    // Ürün adı değiştiğinde otomatik slug oluştur
    if (field === 'name') {
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
      languageCode: activeTab,
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
      languageCode: activeTab,
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
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Form verilerini düzenle
      const formDataToSubmit = {
        ...formData,
        // Kullanım alanlarını düzgün formatta gönder
        usageAreas: formData.usageAreas.filter(ua => ua.title.trim() !== '')
      };
      
      // Form verilerini konsola yazdır (hata ayıklama için)
      console.log('Form data to submit:', JSON.stringify(formDataToSubmit, null, 2));
      
      // API'ye gönder
      try {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSubmit),
        });
        
        const result = await response.json();
        console.log('API response:', result);
        
        if (!response.ok) {
          let errorMessage = 'Ürün kaydedilirken bir hata oluştu';
          
          if (result.error) {
            errorMessage = result.error;
            if (result.details) {
              errorMessage += `: ${result.details}`;
            }
          }
          
          throw new Error(errorMessage);
        }
        
        // Başarılı
        setSuccess('Ürün başarıyla kaydedildi');
        
        // Ürünler sayfasına yönlendir
        setTimeout(() => {
          router.push('/admin/products');
        }, 1500);
      } catch (apiError) {
        console.error('API hatası:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      setSubmitError(error instanceof Error ? error.message : 'Ürün kaydedilirken bir hata oluştu');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yeni Ürün Ekle</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Geri Dön
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Ürün Kodu ve Resim Yükleme */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Kodu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="MR-1000"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Benzersiz bir ürün kodu girin (örn. MR-1000)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Görseli <span className="text-red-500">*</span>
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={previewUrl}
                      alt="Önizleme"
                      fill
                      className="object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, image_url: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Dosya seçin</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">ya da sürükleyip bırakın</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF maks. 10MB</p>
                  </div>
                )}
              </div>
              
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
              
              {isUploading && (
                <div className="mt-2 flex items-center text-sm text-indigo-600">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Görsel yükleniyor...
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Dil Seçimi ve Tab */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              onClick={() => setActiveTab('tr')}
              className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                activeTab === 'tr'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Türkçe
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                activeTab === 'en'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              İngilizce
            </button>
          </nav>
        </div>
        
        {/* Ürün Detayları - Türkçe veya İngilizce */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">
            {activeTab === 'tr' ? 'Türkçe Ürün Detayları' : 'İngilizce Ürün Detayları'}
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.localizations[activeTab as 'tr' | 'en'].name}
                onChange={(e) => handleChange(activeTab as 'tr' | 'en', 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={activeTab === 'tr' ? 'MR Cihazı' : 'MR Device'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Açıklaması
              </label>
              <textarea
                value={formData.localizations[activeTab as 'tr' | 'en'].description}
                onChange={(e) => handleChange(activeTab as 'tr' | 'en', 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={activeTab === 'tr' ? 'Ürün açıklaması...' : 'Product description...'}
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.localizations[activeTab as 'tr' | 'en'].slug}
                onChange={(e) => handleChange(activeTab as 'tr' | 'en', 'slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="urun-adi"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL-dostu ürün adı. Ürün adı girildiğinde otomatik oluşturulur.
              </p>
            </div>
          </div>
        </div>
        
        {/* Ürün Özellikleri */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {activeTab === 'tr' ? 'Türkçe Ürün Özellikleri' : 'İngilizce Ürün Özellikleri'}
            </h2>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {activeTab === 'tr' ? 'Türkçe Ürün Kullanım Alanları' : 'İngilizce Ürün Kullanım Alanları'}
            </h2>
            <button
              type="button"
              onClick={addUsageArea}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
                        placeholder={activeTab === 'tr' ? 'Kullanım Alanı Başlığı' : 'Usage Area Title'}
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
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
        
        {submitError && (
          <div className="mx-6 mb-6 p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}
        
        {success && (
          <div className="mx-6 mb-6 p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
      </form>
    </div>
  );
} 