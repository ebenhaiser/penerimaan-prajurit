import { store } from '../config/store.js';
import { recommendationService } from '../services/recommendation.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const recommendationController = {
  getRecommendation(req, res) {
    const { id } = req.params;
    const app = store.applications.find(a => a.id === id);
    if (!app) return errorResponse(res, 'Pendaftaran tidak ditemukan.', 'NOT_FOUND', [], 404);

    if (req.user.role === 'candidate' && app.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    let rec = store.recommendations.find(r => r.application_id === id);
    if (!rec) {
      // Auto-generate if pre-test is done or candidate completed initial data
      rec = recommendationService.generateRecommendation(id);
    }

    return successResponse(res, 'Rekomendasi jalur penerimaan berhasil diambil.', rec);
  },

  generateRecommendation(req, res) {
    const { id } = req.params;
    const app = store.applications.find(a => a.id === id);
    if (!app) return errorResponse(res, 'Pendaftaran tidak ditemukan.', 'NOT_FOUND', [], 404);

    if (req.user.role === 'candidate' && app.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    try {
      const rec = recommendationService.generateRecommendation(id);
      return successResponse(res, 'Rekomendasi jalur baru berhasil dihasilkan.', rec);
    } catch (err) {
      return errorResponse(res, err.message, 'RECOMMENDATION_FAILED', [err.message], 400);
    }
  }
};
