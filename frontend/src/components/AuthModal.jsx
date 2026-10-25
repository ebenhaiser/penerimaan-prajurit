import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const data = await api.login(email, password);
        onAuthSuccess(data.user);
        onClose();
      } else {
        const data = await api.register(email, password, fullName, phone);
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'candidate') {
      setEmail('candidate@tni.mil.id');
      setPassword('Prajurit2026!');
    } else if (role === 'committee') {
      setEmail('committee@tni.mil.id');
      setPassword('Panitia2026!');
    } else if (role === 'admin') {
      setEmail('admin@tni.mil.id');
      setPassword('Admin2026!');
    }
    setMode('login');
    setError('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(4, 14, 9, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2rem',
        position: 'relative',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid var(--mil-gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <ShieldCheck size={28} color="var(--mil-gold-primary)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.25rem' }}>
            {mode === 'login' ? 'Masuk ke Portal Seleksi' : 'Pendaftaran Akun Baru'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Sistem Penerimaan Prajurit Terintegrasi Berbasis AI
          </p>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          background: 'rgba(6, 21, 14, 0.6)',
          borderRadius: '8px',
          padding: '0.25rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(45, 161, 112, 0.2)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'login' ? 'var(--mil-green-primary)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'register' ? 'var(--mil-green-primary)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Buat Akun Calon
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">
                  <User size={15} /> Nama Lengkap Sesuai KTP
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Dimas Setiawan Pratama"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={15} /> Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={15} /> Alamat Email Aktif
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} /> Kata Sandi
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sebagai Calon'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Accounts Quick Click */}
        {mode === 'login' && (
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '0.6rem' }}>
              PILIH AKUN PENGUJIAN OTOMATIS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('candidate')}
                style={{
                  background: 'rgba(30, 112, 77, 0.25)',
                  border: '1px solid rgba(45, 161, 112, 0.4)',
                  color: '#34d399',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Calon
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('committee')}
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Panitia
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
