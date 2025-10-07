import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import products from './products.json';
import suppliersJson from './suppliers.json';
import warehouses from './warehouses.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const password = process.env.USER_DEFAULT_PASSWORD || 'password123';

  // 1️⃣ Create or update a default user
  const user = await prisma.user.upsert({
    where: { email: 'user@mail.com' },
    update: {},
    create: {
      email: 'user@mail.com',
      password: await argon.hash(password),
    },
  });

  // 2️⃣ Seed warehouses
  await Promise.all(
    warehouses.map((wh) =>
      prisma.wareHouse.upsert({
        where: { id: wh.id },
        update: {},
        create: {
          id: wh.id,
          name: wh.name,
          location: wh.location,
          capacity: wh.capacity,
          userId: user.id,
        },
      }),
    ),
  );

  // 3️⃣ Seed suppliers
  await Promise.all(
    suppliersJson.map((supplier) =>
      prisma.supplier.upsert({
        where: { id: supplier.id },
        update: {},
        create: {
          id: supplier.id,
          name: supplier.name,
          contactInformation: supplier.contactInformation,
        },
      }),
    ),
  );

  // 4️⃣ Seed products
  await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { id: product.id },
        update: {},
        create: {
          id: product.id,
          name: product.name,
          description: product.description,
          quantityInStock: 100,
          reorderThreshold: 20,
          ownerId: user.id,
          supplierId: product.supplierId,
          wareHouseId: product.warehouseId,
        },
      }),
    ),
  );

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
