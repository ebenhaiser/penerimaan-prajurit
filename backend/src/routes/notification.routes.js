import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { notificationService } from '../services/notification.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => {
  const notifs = notificationService.getUserNotifications(req.user.id);
  return successResponse(res, 'Notifikasi berhasil diambil.', notifs);
});

router.patch('/:id/read', (req, res) => {
  try {
    const updated = notificationService.markAsRead(req.params.id, req.user.id);
    return successResponse(res, 'Notifikasi ditandai telah dibaca.', updated);
  } catch (err) {
    return errorResponse(res, err.message, 'NOT_FOUND', [], 404);
  }
});

router.post('/read-all', (req, res) => {
  const count = notificationService.markAllAsRead(req.user.id);
  return successResponse(res, `${count} notifikasi ditandai telah dibaca.`);
});

export default router;
