import { Router } from 'express';
import {
  getInventory,
  getChocolateById,
  createChocolate,
  updateChocolate,
  deleteChocolate
} from '../controllers/inventoryController';

const router = Router();

router.get('/', getInventory);
router.get('/:id', getChocolateById);
router.post('/', createChocolate);
router.put('/:id', updateChocolate);
router.delete('/:id', deleteChocolate);

export default router; 