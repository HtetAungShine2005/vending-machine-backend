import { Request, Response, NextFunction } from 'express';
import { restockChocolateService } from '../services/restockService';

export const restockChocolate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chocolateName, quantity } = req.body;
    const result = await restockChocolateService(chocolateName, quantity);
    res.json(result);
  } catch (err) {
    next(err);
  }
}; 