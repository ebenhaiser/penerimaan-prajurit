import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { store } from '../config/store.js';

export const authService = {
  async register({ email, password, full_name, phone }) {
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Email sudah terdaftar dalam sistem.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = {
      id: `u-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: email.toLowerCase(),
      passwordHash,
      full_name,
      phone: phone || '',
      role: 'candidate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.users.push(newUser);
    store.addAuditLog(newUser.id, 'USER_REGISTERED', 'profiles', newUser.id, { email: newUser.email, role: 'candidate' });
    store.addNotification(newUser.id, 'Selamat Datang!', 'Akun pendaftaran prajurit Anda telah aktif. Silakan lengkapi profil dan data fisik Anda.', 'success');

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role
      }
    };
  },

  async login({ email, password }) {
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Kredensial login tidak cocok.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      store.addAuditLog(user.id, 'LOGIN_FAILED', 'profiles', user.id, { email });
      throw new Error('Kredensial login tidak cocok.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    store.addAuditLog(user.id, 'LOGIN_SUCCESS', 'profiles', user.id, { role: user.role });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role
      }
    };
  },

  async getMe(userId) {
    const user = store.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan.');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at
    };
  }
};
