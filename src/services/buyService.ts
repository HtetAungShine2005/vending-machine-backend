import { PrismaClient } from '../../generated/prisma';
import { UserCash } from '../models/UserCash';

const prisma = new PrismaClient();

export const buyChocolateService = async (chocolateName: string, insertedCash: number) => {
  const chocolate = await prisma.chocolate.findUnique({ where: { name: chocolateName } });
  if (!chocolate) {
    throw { status: 404, message: 'Chocolate not found' };
  }
  if (chocolate.quantity < 1) {
    throw { status: 400, message: 'Out of stock' };
  }
  if (insertedCash < chocolate.price) {
    throw { status: 400, message: 'Not enough money inserted' };
  }
  
  const userCash = UserCash.getInstance();
  const remainingCash = userCash.getCash();
  
  if (remainingCash < chocolate.price) {
    throw { status: 400, message: 'You have reached your spending limit of $200' };
  }
  
  const change = insertedCash - chocolate.price;
  await prisma.chocolate.update({
    where: { name: chocolateName },
    data: { quantity: chocolate.quantity - 1 },
  });
  
  userCash.spendCash(chocolate.price);
  
  return {
    message: 'Enjoy your chocolate!',
    change,
    remainingCash: userCash.getCash(),
    chocolateDispensed: chocolateName,
  };
};