import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CandidatePortal } from './components/CandidatePortal';
import { PreTestExam } from './components/PreTestExam';
import { CommitteePortal } from './components/CommitteePortal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';

export function App() {
  const [user, setUser] = useState(api.user);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'portal' | 'committee' | 'admin' | 'exam'
  const [examAttemptId, setExamAttemptId] = useState(null);
  const [publicInfo, setPublicInfo] = useState({ paths: [], periods: [] });
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    loadPublicInfo();
    checkCurrentUser();
  }, []);

  const loadPublicInfo = async () => {
    try {
      const data = await api.getPublicInfo();
      setPublicInfo(data);
    } catch (e) {
      console.error('Failed to load public info:', e);
    }
  };

  const checkCurrentUser = async () => {
    if (api.token) {
      try {
        const me = await api.getMe();
        setUser(me);
        if (me.role === 'candidate') setActiveTab('portal');
        else if (me.role === 'committee') setActiveTab('committee');
        else if (me.role === 'admin') setActiveTab('admin');
      } catch (err) {
        api.setSession(null, null);
        setUser(null);
        setActiveTab('home');
      }
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'candidate') setActiveTab('portal');
    else if (userData.role === 'committee') setActiveTab('committee');
    else if (userData.role === 'admin') setActiveTab('admin');
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setActiveTab('home');
  };

  const handleSelectRole = async (role) => {
    let email = 'candidate@tni.mil.id';
    let pass = 'Prajurit2026!';

    if (role === 'committee') {
      email = 'committee@tni.mil.id';
      pass = 'Panitia2026!';
    } else if (role === 'admin') {
      email = 'admin@tni.mil.id';
      pass = 'Admin2026!';
    }

    try {
      const res = await api.login(email, pass);
      handleAuthSuccess(res.user);
    } catch (e) {
      console.error('Demo login failed:', e);
    }
  };

  const handleStartExam = (attemptId) => {
    setExamAttemptId(attemptId);
    setActiveTab('exam');
  };

  const handleExamFinished = () => {
    setExamAttemptId(null);
    setActiveTab('portal');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <LandingPage
            paths={publicInfo.paths}
            periods={publicInfo.periods}
            onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
            onSelectPath={() => setAuthModal({ isOpen: true, mode: 'register' })}
          />
        )}

        {activeTab === 'portal' && user?.role === 'candidate' && (
          <CandidatePortal user={user} onStartExam={handleStartExam} />
        )}

        {activeTab === 'exam' && examAttemptId && (
          <PreTestExam
            attemptId={examAttemptId}
            onFinished={handleExamFinished}
            onCancel={() => setActiveTab('portal')}
          />
        )}

        {activeTab === 'committee' && (user?.role === 'committee' || user?.role === 'admin') && (
          <CommitteePortal user={user} />
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminPortal user={user} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(6, 21, 14, 0.95)',
        borderTop: '1px solid rgba(45, 161, 112, 0.25)',
        padding: '2rem 0',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: '#64748b'
      }}>
        <div className="container">
          <div style={{ color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
            Sistem Penerimaan Prajurit Terintegrasi Berbasis AI • Versi 1.0 MVP
          </div>
          <div>
            Dikembangkan sesuai spesifikasi Product Requirements Document (PRD). Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
