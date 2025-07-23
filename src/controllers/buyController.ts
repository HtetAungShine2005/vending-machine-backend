import { Request, Response, NextFunction } from 'express';
import { buyChocolateService } from '../services/buyService';

export const buyChocolate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chocolateName, insertedCash } = req.body;
    const result = await buyChocolateService(chocolateName, insertedCash);
    res.json(result);
  } catch (err) {
    next(err);
  }
}; 