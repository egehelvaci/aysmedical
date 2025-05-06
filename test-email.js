const nodemailer = require('nodemailer');

// E-posta gönderimi için transporter oluştur
const transporter = nodemailer.createTransport({
  host: 'mail.kurumsaleposta.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@ayshealth.com.tr',
    pass: 'MehmetOzhan.1486',
  },
  tls: {
    // TLS/SSL hatalarını görmezden gelme (güvenlik açısından risk oluşturabilir - sadece hata ayıklama için)
    rejectUnauthorized: false
  }
});

// Bağlantıyı doğrula
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP bağlantı hatası:', error);
  } else {
    console.log('SMTP sunucusuna bağlantı başarılı:', success);
    
    // Bağlantı başarılıysa test e-postası gönder
    sendTestEmail();
  }
});

// Test e-postası gönderme fonksiyonu
async function sendTestEmail() {
  try {
    console.log('Test e-postası gönderiliyor...');
    
    const mailResult = await transporter.sendMail({
      from: '"AYS Medical Test" <info@ayshealth.com.tr>',
      to: 'info@ayshealth.com.tr', // Test için kendi adresinize gönderim
      subject: 'Test E-postası',
      text: 'Bu bir test e-postasıdır.',
      html: '<b>Bu bir test e-postasıdır.</b>',
    });
    
    console.log('Test e-postası başarıyla gönderildi:', mailResult.messageId);
  } catch (error) {
    console.error('Test e-postası gönderme hatası:', error);
  }
} 