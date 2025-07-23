import { Request, Response, NextFunction } from 'express';
import { getInventoryService, getChocolateByIdService, createChocolateService, updateChocolateService, deleteChocolateService } from '../services/inventoryService';

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getInventoryService();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getChocolateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const chocolate = await getChocolateByIdService(Number(id));
    res.json(chocolate);
  } catch (err) {
    next(err);
  }
};

export const createChocolate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, quantity } = req.body;
    const chocolate = await createChocolateService({ name, price, quantity });
    res.status(201).json(chocolate);
  } catch (err) {
    next(err);
  }
};

export const updateChocolate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    const chocolate = await updateChocolateService(Number(id), { name, price, quantity });
    res.json(chocolate);
  } catch (err) {
    next(err);
  }
};

export const deleteChocolate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteChocolateService(Number(id));
    res.status(200).json({ message: 'Chocolate deleted successfully' });
  } catch (err) {
    next(err);
  }
}; 