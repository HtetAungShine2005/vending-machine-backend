import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

async function seed() {
  const chocolates = [
    { name: 'Toblerone', price: 5, quantity: 10 },
    { name: 'Snickers Pack', price: 8, quantity: 10 },
    { name: 'Ferrero', price: 15, quantity: 10 },
  ];
  for (const choco of chocolates) {
    const exists = await prisma.chocolate.findUnique({ where: { name: choco.name } });
    if (!exists) {
      await prisma.chocolate.create({ data: choco });
    }
  }
  console.log('Seed complete');
  await prisma.$disconnect();
}

seed(); 