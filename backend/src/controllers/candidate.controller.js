import { store } from '../config/store.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const candidateController = {
  getProfile(req, res) {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) return errorResponse(res, 'Profil tidak ditemukan.', 'NOT_FOUND', [], 404);

    const applications = store.applications.filter(a => a.candidate_id === req.user.id);
    const notifications = store.notifications.filter(n => n.user_id === req.user.id);

    return successResponse(res, 'Profil calon peserta berhasil diambil.', {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      active_applications_count: applications.length,
      unread_notifications_count: notifications.filter(n => !n.read_at).length
    });
  },

  updateProfile(req, res) {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) return errorResponse(res, 'Profil tidak ditemukan.', 'NOT_FOUND', [], 404);

    const { full_name, phone } = req.body;
    if (full_name) user.full_name = full_name;
    if (phone !== undefined) user.phone = phone;
    user.updated_at = new Date().toISOString();

    store.addAuditLog(user.id, 'PROFILE_UPDATED', 'profiles', user.id, { full_name, phone });

    return successResponse(res, 'Profil berhasil diperbarui.', {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role
    });
  }
};
