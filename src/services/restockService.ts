import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
const MAX_QUANTITY = 10;

export const restockChocolateService = async (chocolateName: string, quantity: number) => {
  const chocolate = await prisma.chocolate.findUnique({ where: { name: chocolateName } });
  if (!chocolate) {
    throw { status: 404, message: 'Chocolate not found' };
  }
  if (chocolate.quantity + quantity > MAX_QUANTITY) {
    throw { status: 400, message: 'Cannot restock above max quantity (10)' };
  }
  const updated = await prisma.chocolate.update({
    where: { name: chocolateName },
    data: { quantity: chocolate.quantity + quantity },
  });
  return {
    message: 'Restocked successfully',
    updatedInventory: { name: updated.name, price: updated.price, quantity: updated.quantity },
  };
}; 