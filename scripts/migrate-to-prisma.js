// TypeORM'dan Prisma'ya veri göçü scripti
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
require('dotenv').config();

// Prisma Client
const prisma = new PrismaClient();

// PostgreSQL bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateData() {
  console.log('Veri göçü başlatılıyor...');
  
  try {
    // PostgreSQL bağlantısı kur
    const client = await pool.connect();
    console.log('PostgreSQL bağlantısı kuruldu');
    
    try {
      // 1. Admin verilerini taşı
      console.log('Admin verilerini kontrol ediliyor...');
      
      // Önce admin tablosunun var olup olmadığını kontrol et
      const tableCheckQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'admin'
        );
      `;
      
      const tableExists = await client.query(tableCheckQuery);
      
      if (tableExists.rows[0].exists) {
        const adminsQuery = await client.query('SELECT * FROM admin');
        const admins = adminsQuery.rows;
        
        console.log(`${admins.length} admin bulundu.`);
        
        for (const admin of admins) {
          await prisma.admin.upsert({
            where: { id: admin.id },
            update: {
              username: admin.username,
              password: admin.password,
              createdAt: admin.createdAt || new Date(),
              updatedAt: admin.updatedAt || new Date()
            },
            create: {
              id: admin.id,
              username: admin.username,
              password: admin.password,
              createdAt: admin.createdAt || new Date(),
              updatedAt: admin.updatedAt || new Date()
            }
          });
        }
      } else {
        console.log('Admin tablosu bulunamadı. Varsayılan admin oluşturuluyor...');
        // Varsayılan admin oluştur
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash('AysMedical.951', 10);
        
        await prisma.admin.create({
          data: {
            username: 'admin',
            password: hashedPassword
          }
        });
        
        console.log('Varsayılan admin oluşturuldu');
      }
      
      // 2. İletişim mesajlarını taşı
      console.log('İletişim mesajlarını kontrol ediliyor...');
      
      const contactTableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'contact_message'
        );
      `);
      
      if (contactTableExists.rows[0].exists) {
        const messagesQuery = await client.query('SELECT * FROM contact_message');
        const messages = messagesQuery.rows;
        
        console.log(`${messages.length} iletişim mesajı bulundu.`);
        
        for (const message of messages) {
          await prisma.contactMessage.upsert({
            where: { id: message.id },
            update: {
              name: message.name,
              email: message.email,
              phone: message.phone,
              message: message.message,
              status: message.status || 'new',
              read: message.isRead || false,
              createdAt: message.createdAt || new Date(),
              updatedAt: message.updatedAt || new Date()
            },
            create: {
              id: message.id,
              name: message.name,
              email: message.email,
              phone: message.phone,
              message: message.message,
              status: message.status || 'new',
              read: message.isRead || false,
              createdAt: message.createdAt || new Date(),
              updatedAt: message.updatedAt || new Date()
            }
          });
        }
      } else {
        console.log('Contact_message tablosu bulunamadı.');
      }
      
      // 3. Ürünleri ve ilişkili verilerini taşı
      console.log('Ürün verilerini kontrol ediliyor...');
      
      const productTableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'product'
        );
      `);
      
      if (productTableExists.rows[0].exists) {
        // Ana ürünleri getir
        const productsQuery = await client.query('SELECT * FROM product');
        const products = productsQuery.rows;
        
        console.log(`${products.length} ürün bulundu.`);
        
        for (const product of products) {
          // Önce ana ürünü oluştur
          await prisma.product.upsert({
            where: { id: product.id },
            update: {
              code: product.code,
              image_url: product.image_url,
              createdAt: product.createdAt || new Date(),
              updatedAt: product.updatedAt || new Date()
            },
            create: {
              id: product.id,
              code: product.code,
              image_url: product.image_url,
              createdAt: product.createdAt || new Date(),
              updatedAt: product.updatedAt || new Date()
            }
          });
          
          // Lokalizasyonları kontrol et
          const localizationTableExists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_name = 'product_localization'
            );
          `);
          
          if (localizationTableExists.rows[0].exists) {
            const localizationsQuery = await client.query('SELECT * FROM product_localization WHERE "productId" = $1', [product.id]);
            const localizations = localizationsQuery.rows;
            
            for (const localization of localizations) {
              await prisma.productLocalization.upsert({
                where: { id: localization.id },
                update: {
                  productId: localization.productId,
                  languageCode: localization.languageCode,
                  name: localization.name,
                  description: localization.description || '',
                  slug: localization.slug,
                  createdAt: localization.createdAt || new Date(),
                  updatedAt: localization.updatedAt || new Date()
                },
                create: {
                  id: localization.id,
                  productId: localization.productId,
                  languageCode: localization.languageCode,
                  name: localization.name,
                  description: localization.description || '',
                  slug: localization.slug,
                  createdAt: localization.createdAt || new Date(),
                  updatedAt: localization.updatedAt || new Date()
                }
              });
            }
          }
          
          // Özellikleri kontrol et
          const featureTableExists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_name = 'product_feature'
            );
          `);
          
          if (featureTableExists.rows[0].exists) {
            const featuresQuery = await client.query('SELECT * FROM product_feature WHERE "productId" = $1', [product.id]);
            const features = featuresQuery.rows;
            
            for (const feature of features) {
              await prisma.productFeature.upsert({
                where: { id: feature.id },
                update: {
                  productId: feature.productId,
                  languageCode: feature.languageCode,
                  title: feature.title,
                  description: feature.description || '',
                  icon: feature.icon,
                  createdAt: feature.createdAt || new Date(),
                  updatedAt: feature.updatedAt || new Date()
                },
                create: {
                  id: feature.id,
                  productId: feature.productId,
                  languageCode: feature.languageCode,
                  title: feature.title,
                  description: feature.description || '',
                  icon: feature.icon,
                  createdAt: feature.createdAt || new Date(),
                  updatedAt: feature.updatedAt || new Date()
                }
              });
            }
          }
          
          // Detayları kontrol et
          const detailTableExists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_name = 'product_detail'
            );
          `);
          
          if (detailTableExists.rows[0].exists) {
            const detailsQuery = await client.query('SELECT * FROM product_detail WHERE "productId" = $1', [product.id]);
            const details = detailsQuery.rows;
            
            for (const detail of details) {
              await prisma.productDetail.upsert({
                where: { id: detail.id },
                update: {
                  productId: detail.productId,
                  languageCode: detail.languageCode,
                  title: detail.title,
                  content: detail.content,
                  createdAt: detail.createdAt || new Date(),
                  updatedAt: detail.updatedAt || new Date()
                },
                create: {
                  id: detail.id,
                  productId: detail.productId,
                  languageCode: detail.languageCode,
                  title: detail.title,
                  content: detail.content,
                  createdAt: detail.createdAt || new Date(),
                  updatedAt: detail.updatedAt || new Date()
                }
              });
            }
          }
          
          // Kullanım alanlarını kontrol et
          const usageAreaTableExists = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' AND table_name = 'product_usage_area'
            );
          `);
          
          if (usageAreaTableExists.rows[0].exists) {
            const areasQuery = await client.query('SELECT * FROM product_usage_area WHERE "productId" = $1', [product.id]);
            const areas = areasQuery.rows;
            
            for (const area of areas) {
              await prisma.productUsageArea.upsert({
                where: { id: area.id },
                update: {
                  productId: area.productId,
                  languageCode: area.languageCode,
                  title: area.title,
                  description: area.description || '',
                  icon: area.icon,
                  createdAt: area.createdAt || new Date(),
                  updatedAt: area.updatedAt || new Date()
                },
                create: {
                  id: area.id,
                  productId: area.productId,
                  languageCode: area.languageCode,
                  title: area.title,
                  description: area.description || '',
                  icon: area.icon,
                  createdAt: area.createdAt || new Date(),
                  updatedAt: area.updatedAt || new Date()
                }
              });
            }
          }
        }
      } else {
        console.log('Product tablosu bulunamadı.');
      }
      
      console.log('Veri göçü başarıyla tamamlandı!');
    } finally {
      // PostgreSQL bağlantısını kapat
      client.release();
    }
  } catch (error) {
    console.error('Veri göçü sırasında bir hata oluştu:', error);
  } finally {
    // Prisma bağlantısını kapat
    await prisma.$disconnect();
  }
}

// Veri göçünü başlat
migrateData(); 