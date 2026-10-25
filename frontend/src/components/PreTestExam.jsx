import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Send, HelpCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export const PreTestExam = ({ attemptId, onFinished, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [completedResult, setCompletedResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExamData();
  }, [attemptId]);

  // Countdown timer
  useEffect(() => {
    if (remainingSeconds <= 0 || completedResult) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, completedResult]);

  const loadExamData = async () => {
    try {
      setLoading(true);
      const data = await api.getAttempt(attemptId);
      setAttempt(data.attempt);
      setQuestions(data.questions || []);
      setRemainingSeconds(data.remaining_seconds || 0);

      // Map existing answers
      const map = {};
      (data.answers || []).forEach(ans => {
        map[ans.question_id] = ans.answer;
      });
      setAnswers(map);

      if (data.attempt.status === 'completed') {
        const result = await api.getTestResult(attemptId);
        setCompletedResult(result);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat paket ujian.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = async (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    try {
      setSavingAnswer(true);
      await api.saveAnswer(attemptId, questionId, optionId);
    } catch (err) {
      console.error('Error saving answer:', err);
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      const result = await api.submitAttempt(attemptId);
      setCompletedResult(result);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleManualSubmit = async () => {
    try {
      setShowConfirmSubmit(false);
      setLoading(true);
      const result = await api.submitAttempt(attemptId);
      setCompletedResult(result);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ color: 'var(--mil-gold-primary)', fontSize: '1.2rem', fontWeight: 600 }}>
          Menyiapkan Lembar Soal Pre-Test Digital...
        </div>
      </div>
    );
  }

  // Result Screen after test completion
  if (completedResult) {
    return (
      <div className="container" style={{ maxWidth: '780px', padding: '3rem 1.5rem' }}>
        <div className="glass-panel-gold" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.2)',
            border: '2px solid var(--mil-gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Award size={36} color="var(--mil-gold-primary)" />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
            UJIAN SELESAI &amp; TERVERIFIKASI
          </span>

          <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Hasil Pre-Test Asesmen Potensi
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Skor Anda telah dihitung secara terpusat oleh engine penilaian backend.
          </p>

          {/* Big Score Box */}
          <div style={{
            background: 'rgba(6, 21, 14, 0.7)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            maxWidth: '320px',
            margin: '0 auto 2rem auto'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Skor Total Terbobot
            </div>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: 'var(--mil-gold-primary)',
              lineHeight: 1.1
            }}>
              {completedResult.score_total || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, marginTop: '0.25rem' }}>
              Akurasi: {completedResult.accuracy_percentage || 0}%
            </div>
          </div>

          {/* Subscores breakdown */}
          <div className="grid-3" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(16, 49, 34, 0.6)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NUMERIK</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
                {completedResult.score_numeric || 0}
              </div>
            </div>
            <div style={{ background: 'rgba(16, 49, 34, 0.6)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>VERBAL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
                {completedResult.score_verbal || 0}
              </div>
            </div>
            <div style={{ background: 'rgba(16, 49, 34, 0.6)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PENALARAN LOGIS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
                {completedResult.score_reasoning || 0}
              </div>
            </div>
          </div>

          <button className="btn-gold" style={{ padding: '0.75rem 2rem' }} onClick={onFinished}>
            Lihat Rekomendasi Penempatan Jalur <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const currentAnswer = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1100px' }}>
      {/* Exam Header */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        border: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '0.25rem' }}>
            PRE-TEST DIGITAL CBT
          </span>
          <h2 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
            Asesmen Potensi Calon Prajurit TNI TA 2026
          </h2>
        </div>

        {/* Timer Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: remainingSeconds < 300 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(212, 175, 55, 0.15)',
          border: `1.5px solid ${remainingSeconds < 300 ? '#ef4444' : 'var(--mil-gold-primary)'}`,
          padding: '0.5rem 1.25rem',
          borderRadius: '10px',
          color: remainingSeconds < 300 ? '#fca5a5' : 'var(--text-gold)',
          fontWeight: 700,
          fontSize: '1.15rem',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
        }}>
          <Clock size={20} />
          <span>Sisa Waktu: {formatTimer(remainingSeconds)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '1.5rem' }}>
        {/* Left: Question area */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {/* Question Category & Number */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 700 }}>
              KATEGORI: {currentQ.category_code?.replace('_', ' ')}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Soal No. <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>{currentIndex + 1}</strong> dari {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div style={{ fontSize: '1.1rem', color: '#f8fafc', lineHeight: 1.6, marginBottom: '2rem' }}>
            {currentQ.question_text}
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
            {(currentQ.options || []).map((opt) => {
              const isSelected = currentAnswer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectAnswer(currentQ.id, opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(30, 112, 77, 0.4)' : 'rgba(6, 21, 14, 0.6)',
                    border: `1.5px solid ${isSelected ? 'var(--mil-gold-primary)' : 'rgba(45, 161, 112, 0.25)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--mil-gold-primary)' : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#06150e' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    {opt.id}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: isSelected ? '#ffffff' : '#cbd5e1', fontWeight: isSelected ? 600 : 400 }}>
                    {opt.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn-secondary"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft size={16} /> Sebelumnya
            </button>

            {savingAnswer && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Menyimpan jawaban...</span>
            )}

            {isLastQuestion ? (
              <button
                className="btn-gold"
                onClick={() => setShowConfirmSubmit(true)}
              >
                Kirim Lembar Jawaban <Send size={16} />
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Selanjutnya <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Palette Grid */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
            Daftar Soal ({answeredCount}/{questions.length} Terjawab)
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {questions.map((q, idx) => {
              const hasAns = Boolean(answers[q.id]);
              const isCurrent = idx === currentIndex;

              let bg = 'rgba(6, 21, 14, 0.6)';
              let border = '1px solid rgba(255,255,255,0.1)';
              let color = '#94a3b8';

              if (hasAns) {
                bg = 'rgba(30, 112, 77, 0.5)';
                border = '1px solid #2da170';
                color = '#34d399';
              }
              if (isCurrent) {
                border = '2px solid var(--mil-gold-primary)';
                color = '#ffffff';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    padding: '0.5rem 0',
                    borderRadius: '6px',
                    background: bg,
                    border,
                    color,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'rgba(30, 112, 77, 0.5)', border: '1px solid #2da170', borderRadius: '3px' }}></div>
              <span>Sudah Dijawab</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'rgba(6, 21, 14, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px' }}></div>
              <span>Belum Dijawab</span>
            </div>
          </div>

          <button
            className="btn-gold"
            style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.85rem' }}
            onClick={() => setShowConfirmSubmit(true)}
          >
            Selesaikan Ujian
          </button>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--mil-gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Send size={24} color="var(--mil-gold-primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>Konfirmasi Pengiriman</h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
              Anda telah menjawab <strong>{answeredCount}</strong> dari {questions.length} soal. Jawaban yang diserahkan akan dikunci dan dihitung skornya oleh sistem.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmSubmit(false)}>
                Periksa Lagi
              </button>
              <button className="btn-gold" style={{ flex: 1 }} onClick={handleManualSubmit}>
                Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
