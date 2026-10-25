import { errorResponse } from '../utils/api-response.js';

/**
 * Validate request body or query params using Zod schema
 * @param {import('zod').ZodSchema} schema 
 * @param {'body'|'query'|'params'} source 
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      const issues = err.errors ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`) : [err.message];
      return errorResponse(res, 'Validasi data gagal. Periksa kembali input Anda.', 'VALIDATION_ERROR', issues, 422);
    }
  };
};
