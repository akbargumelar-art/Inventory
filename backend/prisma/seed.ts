import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
// Fix: Import 'exit' from 'process' to avoid type error on the global process object.
import { exit } from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // FIXED: Hashed passwords for seed users as per request.
  const adminPassword = await bcrypt.hash('password', 10);
  const akbarPassword = await bcrypt.hash('password', 10); // FIXED: Changed password to 'password' as requested.

  // Seed Users
  // NOTE: User requested 'ADMIN' role, but the application schema uses 'Administrator'.
  // Using 'Administrator' for consistency with the existing system.
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword },
    create: {
      username: 'admin',
      email: 'admin@inventory.com',
      name: 'Admin Utama',
      password: adminPassword,
      role: 'Administrator',
    },
  });

  await prisma.user.upsert({
    where: { username: 'akbar' },
    update: { password: akbarPassword },
    create: {
      username: 'akbar',
      email: 'akbar@inventory.com',
      name: 'Akbar',
      password: akbarPassword,
      role: 'Administrator', // FIXED: Role is Administrator.
    },
  });


  // Seed Location
  const gudangUtama = await prisma.location.upsert({
    where: { code: 'GU-01' },
    update: {},
    create: {
      name: 'Gudang Utama',
      code: 'GU-01',
      address: 'Jl. Industri No. 1, Jakarta',
      description: 'Lokasi penyimpanan pusat',
    },
  });

  const tokoDepan = await prisma.location.upsert({
      where: { code: 'TD-01'},
      update: {},
      create: {
          name: 'Toko Depan',
          code: 'TD-01',
          address: 'Jl. Jenderal Sudirman No. 2',
          description: 'Display toko'
      }
  });

  // Seed Category
  const elektronik = await prisma.category.upsert({
      where: { id: 'clerk_elektronik'}, // use a deterministic id if needed
      update: {},
      create: {
        id: 'clerk_elektronik',
        name: 'Elektronik',
      }
  });
  
  const atk = await prisma.category.upsert({
      where: {id: 'clerk_atk'},
      update: {},
      create: {
          id: 'clerk_atk',
          name: 'Alat Tulis Kantor',
      }
  });

  // Seed Items
  await prisma.item.upsert({
    where: { sku: 'LP-HP-001' },
    update: {},
    create: {
      name: 'Laptop HP Elitebook',
      sku: 'LP-HP-001',
      barcode: '123456789012',
      description: 'Laptop bisnis dengan performa tinggi.',
      categoryId: elektronik.id,
      defaultLocationId: gudangUtama.id,
      unit: 'pcs',
      stock: 15,
      minStock: 5,
      price: 15000000,
      status: 'Aktif',
    },
  });

   await prisma.item.upsert({
    where: { sku: 'KB-LOGI-002' },
    update: {},
    create: {
      name: 'Keyboard Logitech MX',
      sku: 'KB-LOGI-002',
      barcode: '987654321098',
      description: 'Keyboard mekanikal untuk profesional.',
      categoryId: elektronik.id,
      defaultLocationId: tokoDepan.id,
      unit: 'pcs',
      stock: 30,
      minStock: 10,
      price: 2100000,
      status: 'Aktif',
    },
  });
  
  await prisma.item.upsert({
      where: { sku: 'PN-STD-001'},
      update: {},
      create: {
          name: 'Pulpen Standard AE7',
          sku: 'PN-STD-001',
          barcode: '555555555555',
          description: 'Pulpen tinta hitam kualitas terbaik.',
          categoryId: atk.id,
          defaultLocationId: tokoDepan.id,
          unit: 'pcs',
          stock: 250,
          minStock: 50,
          price: 2500,
          status: 'Baik'
      }
  })

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
