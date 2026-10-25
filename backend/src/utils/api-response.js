/**
 * Standard API Response utility conforming to PRD 9.9
 */
export const successResponse = (res, message = 'Data berhasil diproses', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Permintaan tidak dapat diproses', code = 'INTERNAL_ERROR', details = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details: Array.isArray(details) ? details : [details]
    }
  });
};
