import { PrismaClient } from 'generated/prisma';
const prisma = new PrismaClient();
import * as argon from 'argon2';

async function main() {
  const password = process.env.USER_DEFAULT_PASSWORD;

  const user = await prisma.user.upsert({
    where: { email: 'user@mail.com' },
    update: {},
    create: {
      email: 'user@mail.com',
      password: await argon.hash(password),
    },
  });
  const [warehouse1, wareHouse2, warehouse3] = await Promise.all([
    prisma.wareHouse.upsert({
      where: { id: 'b6a1c8f1-8b2f-4c3e-bd5e-9f734a42d8b9' },
      create: {
        name: 'warehouse-1',
        location: '22 hart-ford road,new Layout',
        capacity: 500,
        userId: user.id,
        id: 'b6a1c8f1-8b2f-4c3e-bd5e-9f734a42d8b9',
      },
      update: {},
    }),
    prisma.wareHouse.upsert({
      where: { id: 'd4c7e6e2-1a59-4b61-a8f4-5aef9e7d2d4b' },
      create: {
        name: 'warehouse-2',
        location: '33 hart-ford road,new Layout',
        capacity: 750,
        userId: user.id,
        id: 'd4c7e6e2-1a59-4b61-a8f4-5aef9e7d2d4b',
      },
      update: {},
    }),
    prisma.wareHouse.upsert({
      where: { id: 'f9d3d788-872a-4306-8916-421f76b30802' },
      create: {
        name: 'warehouse-3',
        location: '44 hart-ford road,new Layout',
        capacity: 1000,
        userId: user.id,
        id: '9f23bde3-3a2b-4e8f-9c74-2e0b92b3e5cd',
      },
      update: {},
    }),
  ]);
}
