import { store } from '../config/store.js';
import { eligibilityService } from '../services/eligibility.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const eligibilityController = {
  getEligibility(req, res) {
    const app = store.applications.find(a => a.id === req.params.id);
    if (!app) return errorResponse(res, 'Pendaftaran tidak ditemukan.', 'NOT_FOUND', [], 404);

    if (req.user.role === 'candidate' && app.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    const currentEval = eligibilityService.evaluateApplication(app);
    const allPathsEval = eligibilityService.evaluateAllPaths(app);

    return successResponse(res, 'Pemeriksaan kelayakan berhasil dilakukan.', {
      current_evaluation: currentEval,
      all_paths: allPathsEval
    });
  },

  evaluateEligibility(req, res) {
    const app = store.applications.find(a => a.id === req.params.id);
    if (!app) return errorResponse(res, 'Pendaftaran tidak ditemukan.', 'NOT_FOUND', [], 404);

    if (req.user.role === 'candidate' && app.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    const { path_id } = req.body;
    const evaluation = eligibilityService.evaluateApplication(app, path_id);

    app.eligibility_status = evaluation.status;
    app.updated_at = new Date().toISOString();

    store.addAuditLog(req.user.id, 'ELIGIBILITY_EVALUATED', 'candidate_applications', app.id, {
      status: evaluation.status,
      path_id: evaluation.path_id
    });

    return successResponse(res, 'Kelayakan pendaftaran berhasil dievaluasi ulang.', evaluation);
  }
};
