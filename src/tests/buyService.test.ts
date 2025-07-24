import { buyChocolateService } from '../services/buyService';
import { UserCash } from '../models/UserCash';

jest.mock('../../generated/prisma', () => {
  const chocolates = [
    { name: 'Toblerone', price: 5, quantity: 10 },
    { name: 'Snickers Pack', price: 8, quantity: 0 },
  ];
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      chocolate: {
        findUnique: jest.fn(({ where: { name } }) =>
          Promise.resolve(chocolates.find((c) => c.name === name) || null)
        ),
        update: jest.fn(({ where: { name }, data: { quantity } }) =>
          Promise.resolve({ name, price: 5, quantity })
        ),
      },
    })),
  };
});

describe('buyChocolateService', () => {
  beforeEach(() => {
    const userCash = UserCash.getInstance();
    userCash.setCash(200);
  });

  it('should buy chocolate successfully', async () => {
    const result = await buyChocolateService('Toblerone', 10);
    expect(result.message).toBe('Enjoy your chocolate!');
    expect(result.change).toBe(5);
    expect(result.chocolateDispensed).toBe('Toblerone');
  });

  it('should fail if chocolate is out of stock', async () => {
    await expect(buyChocolateService('Snickers Pack', 10)).rejects.toMatchObject({ status: 400 });
  });

  it('should fail if not enough money', async () => {
    await expect(buyChocolateService('Toblerone', 2)).rejects.toMatchObject({ status: 400 });
  });

  it('should fail if chocolate does not exist', async () => {
    await expect(buyChocolateService('Mars', 10)).rejects.toMatchObject({ status: 404 });
  });
}); 