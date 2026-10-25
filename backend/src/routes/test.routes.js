import { Router } from 'express';
import { testController } from '../controllers/test.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { saveAnswerSchema, startAttemptSchema } from '../schemas/test.schema.js';

const router = Router();

router.use(authenticate);
router.get('/tests/available', testController.getAvailableTests);
router.post('/tests/:packageId/attempts', validate(startAttemptSchema), testController.startAttempt);
router.get('/attempts/:attemptId', testController.getAttempt);
router.put('/attempts/:attemptId/answers/:questionId', validate(saveAnswerSchema), testController.saveAnswer);
router.post('/attempts/:attemptId/submit', testController.submitAttempt);
router.get('/attempts/:attemptId/result', testController.getResult);

export default router;
