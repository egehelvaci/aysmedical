'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, EnvelopeOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getAPI, putAPI, deleteAPI } from '@/lib/api';

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  languageCode: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Mesajları getir
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        
        // getAPI yardımcı fonksiyonunu kullan
        const data = await getAPI('/api/admin/messages');
        
        // Okunmamış mesajlar önce gösterilecek şekilde sırala
        const sortedMessages = [...data.messages].sort((a, b) => {
          // Önce okunmamış mesajlar
          if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1; // Okunmamışlar önce
          }
          // Aynı okuma durumuna sahiplerse, tarihe göre sırala (en yeni önce)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setMessages(sortedMessages);
      } catch (err) {
        console.error('Mesajları getirme hatası:', err);
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Mesaj silme işlemi
  const handleDeleteClick = (id: number) => {
    setDeleteMessageId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteMessageId) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // deleteAPI yardımcı fonksiyonunu kullan
      await deleteAPI(`/api/admin/messages/${deleteMessageId}`);
      
      // Mesajı listeden kaldır
      setMessages(messages.filter(message => message.id !== deleteMessageId));
      setDeleteSuccess(true);
      
      // Kısa bir süre sonra başarı mesajını kaldır ve modalı kapat
      setTimeout(() => {
        setDeleteSuccess(false);
        setShowDeleteModal(false);
      }, 1500);
      
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
      setDeleteError(error instanceof Error ? error.message : 'Mesaj silinirken bir hata oluştu');
    } finally {
      setIsDeleting(false);
    }
  };

  // Mesajı okundu olarak işaretle
  const markAsRead = async (id: number) => {
    try {
      // putAPI yardımcı fonksiyonunu kullan
      await putAPI(`/api/admin/messages/${id}/read`, {});
      
      // Mesaj durumunu güncelle ve yeniden sırala
      const updatedMessages = messages.map(message => 
        message.id === id ? { ...message, isRead: true } : message
      );
      
      // Okunmamış mesajlar önce gösterilecek şekilde sırala
      const sortedMessages = [...updatedMessages].sort((a, b) => {
        // Önce okunmamış mesajlar
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1; // Okunmamışlar önce
        }
        // Aynı okuma durumuna sahiplerse, tarihe göre sırala (en yeni önce)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setMessages(sortedMessages);
    } catch (err) {
      console.error('Mesaj durumu güncelleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Mesaj durumu güncellenirken bir hata oluştu');
    }
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İletişim Mesajları</h1>
        <div className="text-sm text-gray-600">
          {messages.filter(m => !m.isRead).length} okunmamış mesaj
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-600">Henüz mesaj bulunmuyor.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {messages.map((message) => (
              <li key={message.id} className={`${!message.isRead ? 'bg-blue-50' : ''}`}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {!message.isRead ? (
                        <EnvelopeIcon 
                          className="h-5 w-5 text-blue-500 mr-2 cursor-pointer" 
                          onClick={() => markAsRead(message.id)}
                          title="Okundu olarak işaretle"
                        />
                      ) : (
                        <EnvelopeOpenIcon className="h-5 w-5 text-gray-400 mr-2" />
                      )}
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {message.subject}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-4">
                        {formatDate(message.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteClick(message.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Sil</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Gönderen:</span> {message.name} ({message.email})
                      {message.phone && ` - ${message.phone}`}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {message.message}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Silme onay modalı */}
      {showDeleteModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto" onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div 
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Mesajı Sil</h3>
                    <div className="mt-2">
                      {deleteSuccess ? (
                        <p className="text-sm text-green-500">
                          Mesaj başarıyla silindi!
                        </p>
                      ) : deleteError ? (
                        <p className="text-sm text-red-500">
                          {deleteError}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!deleteSuccess && (
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                      isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                    } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Siliniyor...
                      </>
                    ) : (
                      'Sil'
                    )}
                  </button>
                )}
                {!isDeleting && !deleteSuccess && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    İptal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
