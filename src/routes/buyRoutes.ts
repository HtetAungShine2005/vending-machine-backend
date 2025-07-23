import { Router } from 'express';
import { buyChocolate } from '../controllers/buyController';

const router = Router();

router.post('/', buyChocolate);

export default router; 