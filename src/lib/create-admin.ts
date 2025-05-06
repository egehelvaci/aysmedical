import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Admin kullanıcısı oluşturma fonksiyonu
async function createAdmin() {
  try {
    // Kullanıcı adını kontrol et, varsa işlemi atla
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        username: 'egehelvaci',
      },
    });

    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut:', existingAdmin.username);
      return existingAdmin;
    }

    // Şifreyi hashle
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('ege2141486', saltRounds);

    // Yeni admin oluştur
    const newAdmin = await prisma.admin.create({
      data: {
        username: 'egehelvaci',
        password: hashedPassword,
        email: 'ege.helvaci@example.com',
        fullName: 'Ege Helvacı',
      },
    });

    console.log('Yeni admin kullanıcısı oluşturuldu:', newAdmin.username);
    return newAdmin;
  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script doğrudan çalıştırıldığında
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log('İşlem tamamlandı');
      process.exit(0);
    })
    .catch((error) => {
      console.error('İşlem başarısız:', error);
      process.exit(1);
    });
}

export { createAdmin }; 