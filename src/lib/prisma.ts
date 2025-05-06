import { PrismaClient } from '@prisma/client';

// PrismaClient singleton oluştur
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Development dışındaki ortamlarda global nesneye ata
if (process.env.NODE_ENV !== 'development') {
  globalForPrisma.prisma = prisma;
} 