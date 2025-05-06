'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSuccess(null);
    setUploadedImage(null);
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Dosya tipi kontrolü
    if (!selectedFile.type.startsWith('image/')) {
      setError('Lütfen sadece görsel dosyası yükleyin');
      setFile(null);
      setPreview(null);
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    
    // Önizleme URL oluştur
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Lütfen bir dosya seçin');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Görsel yükleme hatası');
      }

      setSuccess('Görsel başarıyla yüklendi');
      setUploadedImage(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tebi Görsel Yükleme Testi</h1>
      
      <div className="mb-6">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
          Görsel Seçin
        </label>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>

      {preview && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Önizleme</h2>
          <div className="border border-gray-200 rounded-md p-2 w-64 h-64 relative">
            <img 
              src={preview} 
              alt="Önizleme" 
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Yükleniyor...' : 'Yükle'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md border border-green-200">
          {success}
        </div>
      )}

      {uploadedImage && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Yüklenen Görsel</h2>
          <div className="border border-gray-200 rounded-md p-2">
            <img 
              src={uploadedImage} 
              alt="Yüklenen görsel" 
              className="object-contain max-w-full max-h-80"
            />
            <p className="mt-2 text-sm text-gray-500 break-all">{uploadedImage}</p>
          </div>
        </div>
      )}
    </div>
  );
} 