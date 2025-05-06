import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Aysmed Admin Girişi',
  description: 'Aysmed yönetici paneli giriş sayfası',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Aysmed Admin</h1>
          <p className="text-gray-600 mt-2">Yönetici paneline giriş yapın</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
} 