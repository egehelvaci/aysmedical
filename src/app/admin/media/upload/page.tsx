'use client';

import { useState, useRef } from 'react';
import { CloudArrowUpIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function MediaUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya seçildiğinde
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Sadece resim dosyalarını kabul et
      if (!selectedFile.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, vb.)');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setUploadResult(null);
      
      // Önizleme URL'si oluştur
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Dosyayı sıfırla
  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Dosya yükle
  const handleUpload = async () => {
    if (!file) {
      setError('Lütfen bir dosya seçin');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // FormData oluştur
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'admin-uploads');
      
      // Tebi.io API'sine gönder
      const response = await fetch('/api/tebi/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUploadResult(result);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Dosya yüklenirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Dosya yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  // Yükleme formunu kopyala
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('URL panoya kopyalandı');
      },
      (err) => {
        console.error('Kopyalama hatası:', err);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-lg font-medium leading-6 text-gray-900">Medya Yükleme</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Tebi.io depolama sistemi ile görselleri yükleyin. Yüklenen görseller otomatik olarak medya kütüphanesine eklenecektir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Görsel Seçin</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                  Dosya
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">ya da sürükleyip bırakın</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF maks. 10MB</p>
                  </div>
                </div>
              </div>

              {file && (
                <div className="flex items-center gap-x-2">
                  <span className="text-sm font-medium text-gray-500">Seçilen:</span>
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Hata</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Yükleniyor...
                    </>
                  ) : (
                    'Yükle'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sıfırla
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Önizleme</h3>
            
            <div className="mt-2 flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md min-h-[300px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Önizleme"
                  className="max-h-[300px] max-w-full object-contain rounded-md"
                />
              ) : uploadResult && uploadResult.url ? (
                <div className="flex flex-col items-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2" />
                  <h4 className="text-lg font-medium text-gray-900">Yükleme Başarılı</h4>
                  <img
                    src={uploadResult.url}
                    alt="Yüklenen görsel"
                    className="max-h-[200px] max-w-full object-contain rounded-md mt-4"
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Görsel önizlemesi burada görünecek</p>
                </div>
              )}
            </div>

            {uploadResult && uploadResult.url && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Yükleme Bilgileri</h4>
                <div className="mt-2 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Görsel URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        readOnly
                        value={uploadResult.url}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md sm:text-sm border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(uploadResult.url)}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                      >
                        Kopyala
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Dosya Adı</label>
                      <p className="mt-1 text-sm text-gray-900 truncate">{uploadResult.fileName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Boyut</label>
                      <p className="mt-1 text-sm text-gray-900">{Math.round(uploadResult.fileSize / 1024)} KB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 