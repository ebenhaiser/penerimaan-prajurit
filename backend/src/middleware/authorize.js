import { errorResponse } from '../utils/api-response.js';

/**
 * Role-Based Access Control (RBAC) middleware
 * Allowed roles: candidate, committee, admin
 * @param  {...string} roles Allowed roles for endpoint
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Autentikasi diperlukan sebelum pemeriksaan otorisasi.', 'UNAUTHORIZED', [], 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.',
        'FORBIDDEN',
        [`Role '${req.user.role}' tidak berwenang mengakses sumber daya ini. Diperlukan role: ${roles.join(', ')}`],
        403
      );
    }

    next();
  };
};
