import { API_BASE_URL } from '@/config/env';
import { IS_DEVELOPMENT } from '@/config/env';

/** 
 * Sayfalama parametreleri için tip tanımı
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
};

/**
 * API yanıtları için genel tip
 */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

/**
 * Sayfalanmış API yanıtı tipi
 */
export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

/**
 * API isteği yapmak için yardımcı fonksiyon.
 * Tüm API isteklerinde kullanılabilir.
 * 
 * @param endpoint - API endpoint'i (örn: '/api/products')
 * @param options - fetch API için options (method, headers, body, vs.)
 * @returns API yanıtı
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Endpoint'in / ile başladığından emin ol
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Development modunda mutlak URL kullanma, direkt endpoint kullan
  // Production modunda mutlak URL kullan
  const url = IS_DEVELOPMENT 
    ? path 
    : `${API_BASE_URL}${path}`;
  
  // Varsayılan headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // JSON yanıtı çözümle
    const data = await response.json();
    
    // Hata kontrolü
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API isteği başarısız oldu');
    }
    
    return data as T;
  } catch (error) {
    console.error(`API isteği başarısız: ${url}`, error);
    throw error;
  }
}

/**
 * GET isteği için yardımcı fonksiyon
 * 
 * @param endpoint - API endpoint'i
 * @param options - fetch API için ek options
 * @returns API yanıtı
 */
export function getAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'GET',
    ...options
  });
}

/**
 * POST isteği için yardımcı fonksiyon
 * 
 * @param endpoint - API endpoint'i
 * @param data - Gönderilecek veri
 * @param options - fetch API için ek options
 * @returns API yanıtı
 */
export function postAPI<T = any>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
}

/**
 * PUT isteği için yardımcı fonksiyon
 * 
 * @param endpoint - API endpoint'i
 * @param data - Gönderilecek veri
 * @param options - fetch API için ek options
 * @returns API yanıtı
 */
export function putAPI<T = any>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
}

/**
 * DELETE isteği için yardımcı fonksiyon
 * 
 * @param endpoint - API endpoint'i
 * @param options - fetch API için ek options
 * @returns API yanıtı
 */
export function deleteAPI<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'DELETE',
    ...options
  });
}

/**
 * Sayfalama parametreleri içeren GET isteği için yardımcı fonksiyon
 * 
 * @param endpoint - API endpoint'i
 * @param params - Sayfalama parametreleri
 * @param options - fetch API için ek options
 * @returns Sayfalanmış API yanıtı
 */
export function getPaginatedAPI<T = any>(
  endpoint: string,
  params: PaginationParams,
  options: RequestInit = {}
): Promise<PaginatedResponse<T>> {
  const url = addQueryParams(endpoint, {
    page: params.page,
    limit: params.limit,
    sort: params.sort,
    order: params.order,
    search: params.search
  });
  
  return getAPI<PaginatedResponse<T>>(url, options);
}

// URL'e query parametreleri eklemek için yardımcı fonksiyon
export function addQueryParams(url: string, params: Record<string, string | number | boolean | undefined>): string {
  const urlObj = new URL(url.startsWith('http') ? url : `http://placeholder.com${url}`);
  
  // Mevcut parametreleri temizleme opsiyonu
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlObj.searchParams.append(key, String(value));
    }
  });
  
  // URL'in yol ve query parametrelerini döndür
  return url.startsWith('http') 
    ? urlObj.toString() 
    : `${urlObj.pathname}${urlObj.search}`;
} 