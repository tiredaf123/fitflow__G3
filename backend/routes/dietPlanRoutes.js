// routes/dietPlanRoutes.js

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { createDietPlan, getDietPlans } from '../controllers/planController.js';

const router = express.Router();

router.post('/', protect, createDietPlan);
router.get('/:clientId', protect, getDietPlans);

export default router;
