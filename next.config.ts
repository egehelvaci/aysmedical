import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // Static export için
  trailingSlash: true, // URL sonlarında / işareti olacak (SEO ve yönlendirme için faydalı)
  typescript: {
    // !! Sadece cPanel'e deploy etmek için !!
    // Tip kontrolünü build sırasında atla, hataları görmezden gel
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! Sadece cPanel'e deploy etmek için !!
    // ESLint hatalarını build sırasında görmezden gel
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // cPanel'de optimizasyon çalışmaz
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'freepik.cdnpk.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // React Server Component hatası için eklendi
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // TypeORM gibi external paketleri server tarafında kullanabilmek için
  serverExternalPackages: ["typeorm", "reflect-metadata"],
};

export default nextConfig;
