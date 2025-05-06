'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      console.log('Dosya seçildi:', files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    if (!file) {
      setError('Lütfen bir dosya seçin');
      setIsLoading(false);
      return;
    }

    try {
      // Dosyayı blobToBase64 fonksiyonu ile base64'e dönüştür
      const base64 = await blobToBase64(file);
      
      // Sadece data kısmını al (data:image/jpeg;base64, kısmını çıkar)
      const base64Data = base64.split(',')[1];
      
      // Sunucuya gönderilecek veri
      const data = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: base64Data
      };

      // API'ye direkt JSON olarak gönder
      const response = await fetch('/api/test/upload-base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Yükleme hatası');
      }
      
      setResult(responseData);
    } catch (err) {
      console.error('Hata:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Blob'u base64'e dönüştürme fonksiyonu
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Tebi Base64 Upload Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Görsel Seçin
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded p-2 text-sm"
          />
          {file && (
            <p className="mt-1 text-xs text-gray-500">
              {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Yükleniyor...' : 'Yükle'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
          <p className="font-medium">Hata</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 p-3 rounded text-green-700 border border-green-100">
            <p className="font-medium">Yükleme Başarılı</p>
          </div>
          
          <div className="border rounded p-4">
            <p className="font-medium mb-2">Dosya URL:</p>
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all text-sm"
            >
              {result.url}
            </a>
            
            <div className="mt-3 border rounded overflow-hidden">
              <img 
                src={result.url} 
                alt="Yüklenen görsel" 
                className="max-w-full h-auto"
                onError={() => {
                  console.error('Görsel yüklenemedi:', result.url);
                }}
              />
            </div>
          </div>
          
          <details className="border rounded">
            <summary className="cursor-pointer p-2 bg-gray-50 text-sm font-medium">
              API Yanıtı
            </summary>
            <pre className="p-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
} 