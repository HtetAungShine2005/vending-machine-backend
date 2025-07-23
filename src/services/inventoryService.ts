import { PrismaClient } from '../../generated/prisma';
import { UserCash } from '../models/UserCash';

const prisma = new PrismaClient();
const MAX_QUANTITY = 10;

export const getInventoryService = async () => {
  const chocolates = await prisma.chocolate.findMany({
    select: { id: true, name: true, price: true, quantity: true },
  });
  const userCash = UserCash.getInstance().getCash();
  return { chocolates, userCash };
};

export const getChocolateByIdService = async (id: number) => {
  const chocolate = await prisma.chocolate.findUnique({ where: { id } });
  if (!chocolate) throw { status: 404, message: 'Chocolate not found' };
  return chocolate;
};

export const createChocolateService = async ({ name, price, quantity }: { name: string; price: number; quantity: number }) => {
  if (quantity > MAX_QUANTITY) throw { status: 400, message: `Max quantity is ${MAX_QUANTITY}` };
  try {
    return await prisma.chocolate.create({ data: { name, price, quantity } });
  } catch (err: any) {
    if (err.code === 'P2002') throw { status: 400, message: 'Chocolate name must be unique' };
    throw err;
  }
};

export const updateChocolateService = async (id: number, { name, price, quantity }: { name: string; price: number; quantity: number }) => {
  if (quantity > MAX_QUANTITY) throw { status: 400, message: `Max quantity is ${MAX_QUANTITY}` };
  const chocolate = await prisma.chocolate.findUnique({ where: { id } });
  if (!chocolate) throw { status: 404, message: 'Chocolate not found' };
  try {
    return await prisma.chocolate.update({ where: { id }, data: { name, price, quantity } });
  } catch (err: any) {
    if (err.code === 'P2002') throw { status: 400, message: 'Chocolate name must be unique' };
    throw err;
  }
};

export const deleteChocolateService = async (id: number) => {
  const chocolate = await prisma.chocolate.findUnique({ where: { id } });
  if (!chocolate) throw { status: 404, message: 'Chocolate not found' };
  await prisma.chocolate.delete({ where: { id } });
}; 