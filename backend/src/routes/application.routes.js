import { Router } from 'express';
import { applicationController } from '../controllers/application.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createApplicationSchema, updateApplicationSchema } from '../schemas/application.schema.js';

const router = Router();

router.use(authenticate);
router.get('/me', applicationController.getMyApplications);
router.post('/', validate(createApplicationSchema), applicationController.createApplication);
router.get('/:id', applicationController.getApplicationById);
router.put('/:id', validate(updateApplicationSchema), applicationController.updateApplication);
router.post('/:id/submit', applicationController.submitApplication);

export default router;
