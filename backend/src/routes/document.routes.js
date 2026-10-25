import { Router } from 'express';
import { documentController } from '../controllers/document.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/applications/:id/documents', documentController.getDocuments);
router.post('/applications/:id/documents', documentController.uploadDocument);
router.delete('/documents/:id', documentController.deleteDocument);

export default router;
