import { applicationService } from '../services/application.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const applicationController = {
  getMyApplications(req, res) {
    try {
      const apps = applicationService.getApplicationsByCandidate(req.user.id);
      return successResponse(res, 'Daftar pendaftaran berhasil diambil.', apps);
    } catch (err) {
      return errorResponse(res, err.message, 'INTERNAL_ERROR', [], 500);
    }
  },

  createApplication(req, res) {
    try {
      const app = applicationService.createApplication(req.user.id, req.body);
      return successResponse(res, 'Berkas pendaftaran berhasil dibuat.', app, 201);
    } catch (err) {
      return errorResponse(res, err.message, 'APPLICATION_CREATE_FAILED', [err.message], 400);
    }
  },

  getApplicationById(req, res) {
    try {
      const app = applicationService.getApplicationById(req.params.id, req.user.id, req.user.role);
      return successResponse(res, 'Detail pendaftaran berhasil diambil.', app);
    } catch (err) {
      const statusCode = err.message.includes('Akses ditolak') ? 403 : 404;
      return errorResponse(res, err.message, 'APPLICATION_NOT_FOUND', [err.message], statusCode);
    }
  },

  updateApplication(req, res) {
    try {
      const app = applicationService.updateApplication(req.params.id, req.user.id, req.body);
      return successResponse(res, 'Data pendaftaran berhasil diperbarui.', app);
    } catch (err) {
      const statusCode = err.message.includes('Akses ditolak') ? 403 : 400;
      return errorResponse(res, err.message, 'UPDATE_FAILED', [err.message], statusCode);
    }
  },

  submitApplication(req, res) {
    try {
      const app = applicationService.submitApplication(req.params.id, req.user.id);
      return successResponse(res, 'Pendaftaran berhasil dikirim untuk verifikasi lanjutan.', app);
    } catch (err) {
      const statusCode = err.message.includes('Akses ditolak') ? 403 : 400;
      return errorResponse(res, err.message, 'SUBMIT_FAILED', [err.message], statusCode);
    }
  }
};
