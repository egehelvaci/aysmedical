'use client';

import { useState, useRef } from 'react';

export default function TebiUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      
      // Dosya önizleme
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Lütfen bir dosya seçin');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setResult(null);
    
    try {
      // Form verisi oluştur
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'uploads');
      
      // Yeni API endpoint'e gönder
      const response = await fetch('/api/tebi/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        // Form sıfırlama
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.error || 'Görsel yükleme hatası');
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Tebi.io Görsel Yükleme</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">
            Görsel Seçin
          </label>
          <input
            id="file"
            ref={fileInputRef}
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
        
        {previewUrl && (
          <div className="mt-4 border rounded overflow-hidden">
            <img 
              src={previewUrl}
              alt="Önizleme" 
              className="max-h-48 w-full object-contain"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading || !file}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Yükleniyor...
            </span>
          ) : 'Yükle'}
        </button>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-md text-red-700">
          <p className="font-medium">Hata</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-700">
            <p className="font-medium">Yükleme Başarılı!</p>
          </div>
          
          <div className="border rounded-md p-4">
            <p className="font-medium mb-2">Ana URL:</p>
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all text-sm"
            >
              {result.url}
            </a>
            
            <div className="mt-3 border rounded-md overflow-hidden">
              <img 
                src={result.url} 
                alt="Yüklenen görsel" 
                className="max-w-full h-auto"
                onError={(e) => {
                  console.error('Görsel yüklenemedi');
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNzU3NTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+R8O2cnNlbCBZw7xrbGVuZW1lZGk8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>
          </div>
          
          <details className="border rounded-md">
            <summary className="p-3 bg-gray-50 cursor-pointer font-medium text-sm">
              API Yanıtı
            </summary>
            <pre className="p-3 text-xs overflow-auto max-h-60 bg-gray-50">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
} 