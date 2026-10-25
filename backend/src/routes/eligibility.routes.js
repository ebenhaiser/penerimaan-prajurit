import { Router } from 'express';
import { eligibilityController } from '../controllers/eligibility.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/applications/:id/eligibility', eligibilityController.getEligibility);
router.post('/applications/:id/evaluate-eligibility', eligibilityController.evaluateEligibility);

export default router;
