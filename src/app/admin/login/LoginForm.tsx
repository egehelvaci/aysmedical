'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Login isteği gönderiliyor:', { username });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      // İlk olarak yanıtın text olarak alınması
      const responseText = await response.text();
      
      // Yanıtın JSON olarak parse edilmeye çalışılması
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Login yanıtı:', result, 'Status:', response.status);
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError);
        console.error('Alınan yanıt:', responseText);
        throw new Error('Sunucu yanıtı geçersiz format içeriyor');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Giriş başarısız');
      }

      // Başarılı giriş - doğrudan sayfayı değiştir
      console.log('Giriş başarılı, dashboard\'a yönlendiriliyor...');
      
      // Basit yönlendirme
      window.location.href = '/admin/dashboard';
      
    } catch (err) {
      console.error('Login hatası:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Kullanıcı Adı
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </div>
    </form>
  );
}