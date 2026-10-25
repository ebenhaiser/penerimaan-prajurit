import React, { useState, useEffect } from 'react';
import { Shield, Settings, HelpCircle, FileSpreadsheet, Activity, Plus, CheckCircle, Save, Download } from 'lucide-react';
import { api } from '../services/api';

export const AdminPortal = ({ user }) => {
  const [activeTab, setActiveTab] = useState('paths'); // 'paths' | 'questions' | 'audit' | 'reports'
  const [paths, setPaths] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New question form modal
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQData, setNewQData] = useState({
    category_id: 'c0000000-0000-0000-0000-000000000001',
    question_text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct_answer: 'A',
    difficulty: 'medium',
    score_weight: 1.0
  });

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'paths') {
        const p = await api.getRecruitmentPaths();
        setPaths(p || []);
      } else if (activeTab === 'questions') {
        const q = await api.getTestQuestions();
        setQuestions(q || []);
      } else if (activeTab === 'audit') {
        const logs = await api.getAuditLogs(50);
        setAuditLogs(logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePath = async (id, updatedFields) => {
    try {
      await api.updateRecruitmentPath(id, updatedFields);
      setSuccessMsg('Konfigurasi jalur berhasil diperbarui.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.createTestQuestion({
        category_id: newQData.category_id,
        question_text: newQData.question_text,
        options: [
          { id: 'A', text: newQData.optionA },
          { id: 'B', text: newQData.optionB },
          { id: 'C', text: newQData.optionC },
          { id: 'D', text: newQData.optionD }
        ],
        correct_answer: newQData.correct_answer,
        difficulty: newQData.difficulty,
        score_weight: Number(newQData.score_weight)
      });
      setShowAddQuestion(false);
      setSuccessMsg('Soal asesmen baru berhasil disimpan ke bank soal.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = await api.getReports();
      if (!data || data.length === 0) {
        alert('Tidak ada data pelamar untuk diekspor.');
        return;
      }

      // Convert JSON to CSV string
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(obj => Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `rekapitulasi_calon_prajurit_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMsg('Laporan rekapitulasi CSV berhasil diunduh.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>PANEL ADMINISTRATOR SISTEM</span>
          <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Manajemen Sistem &amp; Konfigurasi Seleksi</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Kelola kriteria kelayakan jalur, bank soal asesmen, rekam jejak audit, dan ekspor data.
          </p>
        </div>

        <button className="btn-gold" onClick={handleExportCSV}>
          <Download size={16} /> Unduh Rekapitulasi CSV
        </button>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(45, 161, 112, 0.25)', marginBottom: '2rem' }}>
        {[
          { key: 'paths', label: 'Konfigurasi Jalur Penerimaan', icon: Settings },
          { key: 'questions', label: 'Bank Soal Asesmen', icon: HelpCircle },
          { key: 'audit', label: 'Jejak Audit Aktivitas', icon: Activity }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: isActive ? 'rgba(34, 92, 66, 0.6)' : 'transparent',
                borderBottom: isActive ? '3px solid var(--mil-gold-primary)' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--mil-gold-primary)' : '#94a3b8'} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PATHS MANAGER */}
      {activeTab === 'paths' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {paths.map(p => (
            <div key={p.id} className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                  {p.name} ({p.code})
                </h3>
                <span className={`badge ${p.active ? 'badge-eligible' : 'badge-ineligible'}`}>
                  {p.active ? 'Aktif' : 'Non-Aktif'}
                </span>
              </div>

              <div className="grid-4" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Usia Minimal</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={p.min_age}
                    onBlur={(e) => handleUpdatePath(p.id, { min_age: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Usia Maksimal</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={p.max_age}
                    onBlur={(e) => handleUpdatePath(p.id, { max_age: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tinggi Min. Pria (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={p.min_height_male_cm}
                    onBlur={(e) => handleUpdatePath(p.id, { min_height_male_cm: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tinggi Min. Wanita (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={p.min_height_female_cm}
                    onBlur={(e) => handleUpdatePath(p.id, { min_height_female_cm: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Aturan Pendidikan: <strong>{(p.education_rules || []).join(', ')}</strong> • Standar Nilai Min: <strong>{p.additional_rules?.min_academic_score || '-'}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: QUESTIONS MANAGER */}
      {activeTab === 'questions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Bank Soal Pre-Test Digital ({questions.length} Butir)</h3>
            <button className="btn-primary" onClick={() => setShowAddQuestion(true)}>
              <Plus size={16} /> Tambah Soal Baru
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-info">{q.category_name || q.category_code}</span>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Tingkat: <strong style={{ color: '#ffffff' }}>{q.difficulty}</strong> • Bobot: <strong>{q.score_weight}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.75rem', fontWeight: 600 }}>
                  {idx + 1}. {q.question_text}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {(q.options || []).map(opt => {
                    const isCorrect = opt.id === q.correct_answer;
                    return (
                      <div key={opt.id} style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 21, 14, 0.5)',
                        border: `1px solid ${isCorrect ? '#10b981' : 'rgba(255,255,255,0.06)'}`,
                        color: isCorrect ? '#6ee7b7' : '#cbd5e1'
                      }}>
                        <strong>{opt.id}.</strong> {opt.text} {isCorrect && '(Kunci)'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Modal */}
          {showAddQuestion && (
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1.5rem'
            }}>
              <form onSubmit={handleCreateQuestion} className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '1.25rem' }}>Tambah Butir Soal Baru</h3>

                <div className="form-group">
                  <label className="form-label">Kategori Soal</label>
                  <select
                    className="form-select"
                    value={newQData.category_id}
                    onChange={(e) => setNewQData({ ...newQData, category_id: e.target.value })}
                  >
                    <option value="c0000000-0000-0000-0000-000000000001">Kemampuan Numerik</option>
                    <option value="c0000000-0000-0000-0000-000000000002">Kemampuan Verbal</option>
                    <option value="c0000000-0000-0000-0000-000000000003">Penalaran Logis &amp; Analitis</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pertanyaan</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Tuliskan butir soal..."
                    value={newQData.question_text}
                    onChange={(e) => setNewQData({ ...newQData, question_text: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pilihan A"
                    value={newQData.optionA}
                    onChange={(e) => setNewQData({ ...newQData, optionA: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pilihan B"
                    value={newQData.optionB}
                    onChange={(e) => setNewQData({ ...newQData, optionB: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pilihan C"
                    value={newQData.optionC}
                    onChange={(e) => setNewQData({ ...newQData, optionC: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pilihan D"
                    value={newQData.optionD}
                    onChange={(e) => setNewQData({ ...newQData, optionD: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Kunci Jawaban</label>
                    <select
                      className="form-select"
                      value={newQData.correct_answer}
                      onChange={(e) => setNewQData({ ...newQData, correct_answer: e.target.value })}
                    >
                      <option value="A">Pilihan A</option>
                      <option value="B">Pilihan B</option>
                      <option value="C">Pilihan C</option>
                      <option value="D">Pilihan D</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tingkat Kesulitan</label>
                    <select
                      className="form-select"
                      value={newQData.difficulty}
                      onChange={(e) => setNewQData({ ...newQData, difficulty: e.target.value })}
                    >
                      <option value="easy">Mudah</option>
                      <option value="medium">Sedang</option>
                      <option value="hard">Sulit</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddQuestion(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn-gold">
                    Simpan Soal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(45, 161, 112, 0.2)' }}>
            <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Log Jejak Audit Aktivitas Pengguna &amp; Sistem</h4>
          </div>

          <table className="mil-table">
            <thead>
              <tr>
                <th>Waktu (UTC)</th>
                <th>Pelaku</th>
                <th>Tindakan (Action)</th>
                <th>Entitas</th>
                <th>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{log.actor_name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-gold)', textTransform: 'uppercase' }}>
                      {log.actor_role}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{log.action}</span>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{log.entity_type}</td>
                  <td style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {JSON.stringify(log.metadata || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
