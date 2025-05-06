import { Metadata } from "next";

// Metadata for the different languages
export const metadata: Record<string, Metadata> = {
  tr: {
    title: "AYS Medikal - Tıbbi Görüntüleme Sistemleri ve Servis Hizmetleri",
    description: "AYS Medikal, modern tıbbi görüntüleme sistemleri alanında uzmanlaşmış sağlık teknolojileri firmasıdır. MR, BT, Röntgen ve Mamografi cihazları için servis, bakım ve satış hizmetleri sunuyoruz.",
    metadataBase: new URL('https://aysmed.com'),
    keywords: ["Manyetik rezonans", "MR", "Bilgisayarlı tomografi", "BT", "Röntgen", "Mamografi", "Tıbbi görüntüleme", "Medikal cihazlar", "Servis hizmetleri", "Medikal teknik servis"],
    robots: "index, follow",
    openGraph: {
      title: "AYS Medikal - Tıbbi Görüntüleme Sistemleri ve Servis Hizmetleri",
      description: "AYS Medikal, modern tıbbi görüntüleme sistemleri alanında uzmanlaşmış sağlık teknolojileri firmasıdır.",
      siteName: "AYS Medikal",
      images: [
        {
          url: "/images/hero/MR.webp",
          width: 1200,
          height: 630,
          alt: "AYS Medikal - Tıbbi Görüntüleme Sistemleri",
        },
      ],
      locale: "tr_TR",
      type: "website",
    },
  },
  en: {
    title: "AYS Medical - Medical Imaging Systems and Service",
    description: "AYS Medical is a healthcare technology company specializing in modern medical imaging systems. We provide service, maintenance, and sales for MRI, CT, X-Ray, and Mammography devices.",
    metadataBase: new URL('https://aysmed.com'),
    keywords: ["Magnetic resonance", "MRI", "Computed tomography", "CT", "X-Ray", "Mammography", "Medical imaging", "Medical devices", "Service", "Medical technical service"],
    robots: "index, follow",
    openGraph: {
      title: "AYS Medical - Medical Imaging Systems and Service",
      description: "AYS Medical is a healthcare technology company specializing in modern medical imaging systems.",
      siteName: "AYS Medical",
      images: [
        {
          url: "/images/hero/MR.webp",
          width: 1200,
          height: 630,
          alt: "AYS Medical - Medical Imaging Systems",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  },
}; 