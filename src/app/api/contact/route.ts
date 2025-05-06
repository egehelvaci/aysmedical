import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  ADMIN_EMAIL,
  NEXT_PUBLIC_SITE_URL
} from '@/config/env';

// Node.js runtime kullan - Edge desteklenmiyor
export const runtime = 'nodejs';

// E-posta gönderimi için transporter oluştur
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    // TLS/SSL hatalarını görmezden gelme (güvenlik açısından risk oluşturabilir - sadece hata ayıklama için)
    rejectUnauthorized: false
  }
});

// API yanıtlarını oluşturan yardımcı fonksiyonlar
const createApiResponse = (request: NextRequest, data: any, options: any = {}) => {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

const createApiErrorResponse = (request: NextRequest, error: string, options: any = {}) => {
  return createApiResponse(
    request, 
    { error, ...(options.details ? { details: options.details } : {}) }, 
    { status: options.status || 500 }
  );
};

// İletişim formu gönderimi
export async function POST(request: NextRequest) {
  try {
    // Form verilerini al
    const data = await request.json();
    
    // Zorunlu alanları kontrol et
    if (!data.name || !data.email || !data.subject || !data.message) {
      return createApiErrorResponse(
        request,
        'Tüm zorunlu alanları doldurunuz',
        { status: 400 }
      );
    }
    
    // Dil bilgisini al veya varsayılan olarak 'tr' kullan
    const languageCode = data.languageCode || 'tr';
    
    try {
      // Prisma ile mesajı veritabanına kaydet
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message,
          subject: data.subject || (languageCode === 'tr' ? 'İletişim Formu' : 'Contact Form'),
          languageCode: languageCode,
          isRead: false
        }
      });
      
      // E-posta gönder
      try {
        console.log('E-posta gönderme isteği - SMTP ayarları:', {
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_SECURE,
          user: SMTP_USER ? `${SMTP_USER.substring(0, 3)}***` : 'yok',
          from: SMTP_FROM,
          to: ADMIN_EMAIL
        });
        
        // Mail içeriğini hazırla
        const mailSubject = languageCode === 'tr' 
          ? `Yeni İletişim Formu: ${data.subject}`
          : `New Contact Form: ${data.subject}`;
        
        const mailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .container { padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; }
            h2 { color: #444; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .message { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; padding-top: 10px; }
            .button { display: inline-block; padding: 10px 15px; background-color: #334155; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>${languageCode === 'tr' ? 'Yeni İletişim Formu Mesajı' : 'New Contact Form Message'}</h2>
            <p><span class="label">${languageCode === 'tr' ? 'İsim:' : 'Name:'}</span> ${data.name}</p>
            <p><span class="label">${languageCode === 'tr' ? 'E-posta:' : 'Email:'}</span> ${data.email}</p>
            <p><span class="label">${languageCode === 'tr' ? 'Telefon:' : 'Phone:'}</span> ${data.phone || (languageCode === 'tr' ? 'Belirtilmemiş' : 'Not specified')}</p>
            <p><span class="label">${languageCode === 'tr' ? 'Konu:' : 'Subject:'}</span> ${data.subject}</p>
            <p><span class="label">${languageCode === 'tr' ? 'Mesaj:' : 'Message:'}</span></p>
            <div class="message">${data.message.replace(/\n/g, '<br>')}</div>
            <div class="footer">
              <p>${languageCode === 'tr' ? 'Bu mesaj' : 'This message was sent from'} ${NEXT_PUBLIC_SITE_URL} ${languageCode === 'tr' ? 'sitesinden gönderildi.' : '.'}</p>
              <a href="${NEXT_PUBLIC_SITE_URL}/admin/messages" class="button">${languageCode === 'tr' ? 'Admin Panelde Görüntüle' : 'View in Admin Panel'}</a>
            </div>
          </div>
        </body>
        </html>
        `;
        
        // E-posta gönder
        const mailResult = await transporter.sendMail({
          from: `"AYS Medical" <${SMTP_FROM}>`,
          to: ADMIN_EMAIL,
          subject: mailSubject,
          html: mailHTML,
          text: `
            ${languageCode === 'tr' ? 'Yeni İletişim Formu Mesajı' : 'New Contact Form Message'}
            
            ${languageCode === 'tr' ? 'İsim' : 'Name'}: ${data.name}
            ${languageCode === 'tr' ? 'E-posta' : 'Email'}: ${data.email}
            ${languageCode === 'tr' ? 'Telefon' : 'Phone'}: ${data.phone || (languageCode === 'tr' ? 'Belirtilmemiş' : 'Not specified')}
            ${languageCode === 'tr' ? 'Konu' : 'Subject'}: ${data.subject}
            ${languageCode === 'tr' ? 'Mesaj' : 'Message'}: ${data.message}
          `
        });
        
        console.log('E-posta başarıyla gönderildi:', mailResult.messageId);
        
        // Teşekkür e-postası gönder (isteğe bağlı)
        try {
          const autoReplySubject = languageCode === 'tr' 
            ? 'Mesajınız Alındı - AYS Medical'
            : 'Your Message Received - AYS Medical';
          
          const autoReplyHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .container { padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; }
              h2 { color: #444; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; }
              .footer { margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; padding-top: 10px; }
              .button { display: inline-block; padding: 10px 15px; background-color: #334155; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>${languageCode === 'tr' ? 'Mesajınız Alındı' : 'Your Message Has Been Received'}</h2>
              <p>${languageCode === 'tr' ? 'Sayın' : 'Dear'} ${data.name},</p>
              <p>${languageCode === 'tr' 
                ? 'İletişim formu aracılığıyla bize ulaştırdığınız mesajınız için teşekkür ederiz. En kısa sürede size geri dönüş yapacağız.' 
                : 'Thank you for your message sent through our contact form. We will get back to you as soon as possible.'}</p>
              <p>${languageCode === 'tr' ? 'İlettiğiniz mesajın detayları:' : 'Details of your message:'}</p>
              <p><strong>${languageCode === 'tr' ? 'Konu' : 'Subject'}:</strong> ${data.subject}</p>
              <p><strong>${languageCode === 'tr' ? 'Tarih' : 'Date'}:</strong> ${new Date().toLocaleDateString()}</p>
              <div class="footer">
                <p>${languageCode === 'tr' ? 'Saygılarımızla,' : 'Best regards,'}<br>AYS Medical</p>
                <a href="${NEXT_PUBLIC_SITE_URL}" class="button">${languageCode === 'tr' ? 'Web Sitemizi Ziyaret Edin' : 'Visit Our Website'}</a>
              </div>
            </div>
          </body>
          </html>
          `;
          
          await transporter.sendMail({
            from: `"AYS Medical" <${SMTP_FROM}>`,
            to: data.email,
            subject: autoReplySubject,
            html: autoReplyHTML
          });
          
          console.log('Otomatik yanıt e-postası gönderildi');
        } catch (autoReplyError) {
          console.error('Otomatik yanıt e-postası gönderilirken hata oluştu:', autoReplyError);
        }
        
      } catch (emailError) {
        console.error('E-posta gönderme hatası:', emailError);
        
        // E-posta hatası detaylarını loglama
        if (emailError instanceof Error) {
          console.error('Hata Mesajı:', emailError.message);
          console.error('Hata Detayları:', emailError.stack);
        }
        
        // Hata olmasa bile yine de işlem başarılı sayılıyor, çünkü veritabanına kayıt yapıldı
      }
      
      // Başarılı yanıt döndür
      return createApiResponse(
        request,
        {
          success: true,
          message: languageCode === 'tr' 
            ? 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.' 
            : 'Your message has been sent successfully. We will get back to you as soon as possible.',
          contactId: contactMessage.id,
        }
      );
    } catch (dbError) {
      console.error('Veritabanı hatası:', dbError);
      return createApiErrorResponse(
        request,
        languageCode === 'tr' 
          ? 'Mesajınız kaydedilirken bir hata oluştu' 
          : 'An error occurred while saving your message',
        { 
          status: 500,
          details: dbError instanceof Error ? dbError.message : 'Bilinmeyen hata'
        }
      );
    }
  } catch (error) {
    console.error('İletişim formu hatası:', error);
    return createApiErrorResponse(
      request,
      'Bir hata oluştu',
      { 
        status: 500,
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    );
  }
}

// OPTIONS isteği için CORS desteği
export async function OPTIONS(request: NextRequest) {
  return createApiResponse(request, {}, { status: 200 });
}
