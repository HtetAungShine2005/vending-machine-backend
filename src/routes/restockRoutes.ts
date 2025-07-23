import { Router } from 'express';
import { restockChocolate } from '../controllers/restockController';

const router = Router();

router.post('/', restockChocolate);

export default router; 