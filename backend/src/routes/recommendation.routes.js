import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/applications/:id/recommendation', recommendationController.getRecommendation);
router.post('/applications/:id/generate-recommendation', recommendationController.generateRecommendation);

export default router;
