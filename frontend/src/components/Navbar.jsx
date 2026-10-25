import React, { useState, useEffect } from 'react';
import { Shield, Bell, LogOut, User, CheckCircle2, AlertCircle, ChevronDown, Award } from 'lucide-react';
import { api } from '../services/api';

export const Navbar = ({ user, onOpenAuth, onLogout, onSelectRole, activeTab, setActiveTab }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const list = await api.getNotifications();
      setNotifications(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(6, 21, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(45, 161, 112, 0.25)'
    }}>
      {/* Demo Switcher Quick Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0b2217 0%, #103122 50%, #0b2217 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '0.35rem 1.5rem',
        fontSize: '0.78rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
          <span style={{ color: 'var(--mil-gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Award size={13} /> AKUN DEMO RESMI:
          </span>
          <span style={{ color: '#94a3b8' }}>Uji sistem secara instan berdasarkan role:</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onSelectRole('candidate')}
            style={{
              background: user?.role === 'candidate' ? 'rgba(45, 161, 112, 0.4)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${user?.role === 'candidate' ? '#2da170' : 'rgba(255,255,255,0.15)'}`,
              color: user?.role === 'candidate' ? '#34d399' : '#e2e8f0',
              padding: '0.15rem 0.6rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            Calon Prajurit
          </button>
          <button
            onClick={() => onSelectRole('committee')}
            style={{
              background: user?.role === 'committee' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${user?.role === 'committee' ? '#f59e0b' : 'rgba(255,255,255,0.15)'}`,
              color: user?.role === 'committee' ? '#fbbf24' : '#e2e8f0',
              padding: '0.15rem 0.6rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            Panitia Seleksi
          </button>
          <button
            onClick={() => onSelectRole('admin')}
            style={{
              background: user?.role === 'admin' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${user?.role === 'admin' ? '#38bdf8' : 'rgba(255,255,255,0.15)'}`,
              color: user?.role === 'admin' ? '#38bdf8' : '#e2e8f0',
              padding: '0.15rem 0.6rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            Administrator
          </button>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #184430 0%, #0d281c 100%)',
            border: '1.5px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(212, 175, 55, 0.3)'
          }}>
            <Shield size={24} color="#d4af37" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '0.04em',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              PENERIMAAN PRAJURIT
              <span style={{ color: 'var(--mil-gold-primary)', fontSize: '0.75rem', background: 'rgba(212, 175, 55, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>AI-POWERED</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#94a3b8', letterSpacing: '0.02em' }}>
              Sistem Seleksi Terintegrasi & Asesmen Digital TNI
            </div>
          </div>
        </div>

        {/* Navigation items / User state */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              {/* Role-based navigation button */}
              {user.role === 'candidate' && (
                <button
                  className={activeTab === 'portal' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setActiveTab('portal')}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Dashboard Calon
                </button>
              )}
              {user.role === 'committee' && (
                <button
                  className={activeTab === 'committee' ? 'btn-gold' : 'btn-secondary'}
                  onClick={() => setActiveTab('committee')}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Panel Panitia
                </button>
              )}
              {user.role === 'admin' && (
                <button
                  className={activeTab === 'admin' ? 'btn-gold' : 'btn-secondary'}
                  onClick={() => setActiveTab('admin')}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  Panel Admin
                </button>
              )}

              {/* Notification Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  style={{
                    background: 'rgba(24, 68, 48, 0.5)',
                    border: '1px solid rgba(45, 161, 112, 0.3)',
                    color: '#e2e8f0',
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  title="Notifikasi"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notif Dropdown */}
                {showNotifMenu && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '320px',
                    maxHeight: '380px',
                    overflowY: 'auto',
                    padding: '0.75rem',
                    zIndex: 200,
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Notifikasi Sistem</span>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} style={{ background: 'transparent', border: 'none', color: 'var(--text-gold)', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Tandai Dibaca
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '1rem 0' }}>
                        Tidak ada notifikasi.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          background: n.read_at ? 'transparent' : 'rgba(34, 92, 66, 0.3)',
                          marginBottom: '0.4rem',
                          borderLeft: `3px solid ${n.type === 'success' ? '#10b981' : n.type === 'warning' ? '#f59e0b' : '#38bdf8'}`
                        }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.15rem' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(16, 49, 34, 0.6)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(45, 161, 112, 0.2)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mil-gold-primary)'
                }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
                    {user.full_name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-gold)', textTransform: 'uppercase' }}>
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    marginLeft: '0.4rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn-secondary" onClick={() => onOpenAuth('login')}>
                Masuk
              </button>
              <button className="btn-gold" onClick={() => onOpenAuth('register')}>
                Daftar Akun
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
