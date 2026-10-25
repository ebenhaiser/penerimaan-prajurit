import { Router } from 'express';
import { candidateController } from '../controllers/candidate.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/application.schema.js';

const router = Router();

router.use(authenticate);
router.get('/me', candidateController.getProfile);
router.put('/me', validate(updateProfileSchema), candidateController.updateProfile);

export default router;
