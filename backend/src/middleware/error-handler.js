import { errorResponse } from '../utils/api-response.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Exception at ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan sistem internal.';
  const code = err.code || 'INTERNAL_ERROR';

  return errorResponse(res, message, code, [err.details || err.message], statusCode);
};
