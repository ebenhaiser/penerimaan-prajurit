import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { store } from '../config/store.js';
import { supabaseAdmin, supabaseClient } from '../config/supabase.js';
import { errorResponse } from '../utils/api-response.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Akses ditolak. Token otorisasi tidak ditemukan.', 'UNAUTHORIZED', ['Header Authorization Bearer diperlukan.'], 401);
    }

    const token = authHeader.split(' ')[1];

    // If Supabase is active and token is from Supabase Auth
    if (config.isSupabaseConfigured && (supabaseAdmin || supabaseClient)) {
      try {
        const client = supabaseAdmin || supabaseClient;
        const { data: { user }, error } = await client.auth.getUser(token);
        if (user && !error) {
          // Find matching profile in store or supabase
          const profile = store.users.find(u => u.id === user.id) || {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'candidate',
            full_name: user.user_metadata?.full_name || user.email
          };
          req.user = profile;
          return next();
        }
      } catch (sbErr) {
        // Fall back to JWT verification
      }
    }

    // Verify application JWT
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = store.users.find(u => u.id === decoded.id);

      if (!user) {
        return errorResponse(res, 'Sesi tidak valid atau pengguna tidak ditemukan.', 'UNAUTHORIZED', ['Pengguna tidak terdaftar.'], 401);
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone
      };

      return next();
    } catch (jwtErr) {
      return errorResponse(res, 'Token kadaluarsa atau tidak valid.', 'INVALID_TOKEN', [jwtErr.message], 401);
    }
  } catch (error) {
    return errorResponse(res, 'Terjadi kesalahan pada verifikasi autentikasi.', 'INTERNAL_ERROR', [error.message], 500);
  }
};
