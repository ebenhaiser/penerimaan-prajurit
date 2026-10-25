import { authService } from '../services/auth.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const authController = {
  async register(req, res) {
    try {
      const { email, password, full_name, phone } = req.body;
      if (!email || !password || !full_name) {
        return errorResponse(res, 'Email, kata sandi, dan nama lengkap wajib diisi.', 'VALIDATION_ERROR', [], 422);
      }

      const result = await authService.register({ email, password, full_name, phone });
      return successResponse(res, 'Registrasi berhasil. Akun Anda telah siap.', result, 201);
    } catch (err) {
      return errorResponse(res, err.message, 'REGISTRATION_FAILED', [err.message], 400);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return errorResponse(res, 'Email dan kata sandi wajib diisi.', 'VALIDATION_ERROR', [], 422);
      }

      const result = await authService.login({ email, password });
      return successResponse(res, 'Login berhasil.', result);
    } catch (err) {
      return errorResponse(res, err.message, 'AUTH_FAILED', [err.message], 401);
    }
  },

  async logout(req, res) {
    return successResponse(res, 'Logout berhasil. Sesi telah diakhiri.');
  },

  async me(req, res) {
    try {
      const profile = await authService.getMe(req.user.id);
      return successResponse(res, 'Profil pengguna berhasil diambil.', profile);
    } catch (err) {
      return errorResponse(res, err.message, 'NOT_FOUND', [], 404);
    }
  }
};
