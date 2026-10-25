import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { reviewRecommendationSchema } from '../schemas/recommendation.schema.js';

const router = Router();

router.use(authenticate);
// Accessible by committee and admin
router.use(authorize('committee', 'admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/applications', adminController.getApplications);
router.get('/applications/:id', adminController.getApplicationDetail);
router.patch('/applications/:id/status', adminController.updateApplicationStatus);
router.patch('/documents/:id/verification', adminController.verifyDocument);
router.get('/reports', adminController.getReports);
router.get('/audit-logs', adminController.getAuditLogs);

// Recommendation review by committee
router.post('/recommendations/:id/review', validate(reviewRecommendationSchema), adminController.reviewRecommendation);

// Management routes
router.get('/recruitment-paths', adminController.getRecruitmentPaths);
router.patch('/recruitment-paths/:id', authorize('admin'), adminController.updateRecruitmentPath);
router.get('/test-questions', adminController.getTestQuestions);
router.post('/test-questions', authorize('admin'), adminController.createTestQuestion);

export default router;
