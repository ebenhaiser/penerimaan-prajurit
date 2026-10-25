import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi beberapa saat kemudian.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      details: ['Batas request tercapai. Mohon tunggu 15 menit.']
    }
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit sensitive auth operations to 30 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak upaya login/autentikasi. Coba lagi dalam 15 menit.',
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      details: ['Demi keamanan akun, pembatasan akses sementara diaktifkan.']
    }
  }
});
