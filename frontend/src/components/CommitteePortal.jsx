import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle2, XCircle, AlertTriangle, Eye, ShieldCheck, FileText, Award, RefreshCw, X } from 'lucide-react';
import { api } from '../services/api';

export const CommitteePortal = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pathFilter, setPathFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paths, setPaths] = useState([]);

  // Detail Modal State
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [docReviewNotes, setDocReviewNotes] = useState({});
  const [recReviewNotes, setRecReviewNotes] = useState('');
  const [adjustedPathId, setAdjustedPathId] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadCommitteeData();
  }, [search, pathFilter, statusFilter]);

  const loadCommitteeData = async () => {
    try {
      setLoading(true);
      const [statsData, appsData, pathsData] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminApplications({ search, path_id: pathFilter, status: statusFilter, limit: 50 }),
        api.getRecruitmentPaths()
      ]);
      setStats(statsData);
      setApplications(appsData.items || []);
      setPaths(pathsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      setLoadingDetail(true);
      setActionSuccess('');
      setActionError('');
      const detail = await api.getAdminApplicationDetail(id);
      setSelectedAppDetail(detail);
      setAdjustedPathId(detail.recommendation?.recommended_path_id || '');
      setRecReviewNotes(detail.recommendation?.review_notes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleVerifyDocument = async (docId, status) => {
    try {
      const notes = docReviewNotes[docId] || (status === 'verified' ? 'Dokumen valid & sah.' : 'Perlu scan ulang lebih jelas.');
      await api.verifyDocument(docId, status, notes);
      setActionSuccess(`Dokumen berhasil diperbarui ke: ${status}`);
      // Refresh detail
      if (selectedAppDetail) {
        handleOpenDetail(selectedAppDetail.application.id);
      }
      loadCommitteeData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleReviewRecommendation = async (recId, reviewStatus) => {
    try {
      await api.reviewRecommendation(
        recId,
        reviewStatus,
        recReviewNotes || 'Disetujui oleh panitia seleksi.',
        adjustedPathId
      );
      setActionSuccess(`Tinjauan rekomendasi disimpan: ${reviewStatus.toUpperCase()}`);
      if (selectedAppDetail) {
        handleOpenDetail(selectedAppDetail.application.id);
      }
      loadCommitteeData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      await api.updateAdminApplicationStatus(appId, newStatus, 'Pemeriksaan berkas oleh panitia.');
      setActionSuccess(`Status berkas seleksi diubah menjadi: ${newStatus.toUpperCase()}`);
      if (selectedAppDetail) {
        handleOpenDetail(selectedAppDetail.application.id);
      }
      loadCommitteeData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>PANEL PANITIA SELEKSI</span>
        <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>Monitoring &amp; Verifikasi Calon Prajurit</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Pemeriksaan administrasi, validasi berkas dokumen, dan review rekomendasi hasil asesmen.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TOTAL PENDAFTAR</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              {stats.total_applications}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem' }}>
              {stats.submitted_applications} Berkas Diajukan
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>DOKUMEN MENUNGGU</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
              {stats.pending_documents_verification}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Perlu Pemeriksaan Fisik
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LOLOS SYARAT AWAL</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              {stats.eligible_candidates}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.2rem' }}>
              {stats.needs_review_candidates} Perlu Tinjauan Khusus
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PRE-TEST SELESAI</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--mil-gold-primary)', marginTop: '0.2rem' }}>
              {stats.completed_tests_count}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
              Rata-rata Skor: {stats.average_test_score}/100
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari nama, email, atau nomor registrasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '200px' }}
          value={pathFilter}
          onChange={(e) => setPathFilter(e.target.value)}
        >
          <option value="">Semua Jalur</option>
          {paths.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="verified">Verified (Sah)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat daftar peserta...</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Tidak ada pelamar yang cocok.</div>
        ) : (
          <table className="mil-table">
            <thead>
              <tr>
                <th>No. Registrasi</th>
                <th>Nama Calon</th>
                <th>Jalur Pilihan</th>
                <th>Tinggi / BMI</th>
                <th>Kelayakan</th>
                <th>Skor Pre-Test</th>
                <th>Status Berkas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-gold)' }}>
                    {app.application_number}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{app.candidate?.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{app.candidate?.email}</div>
                  </td>
                  <td>{app.path?.name || '-'}</td>
                  <td>
                    {app.height_cm ? `${app.height_cm} cm` : '-'}
                  </td>
                  <td>
                    <span className={`badge ${
                      app.eligibility_status === 'eligible' ? 'badge-eligible' :
                      app.eligibility_status === 'needs_review' ? 'badge-review' : 'badge-ineligible'
                    }`}>
                      {app.eligibility_status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--mil-gold-primary)' }}>
                    {app.latest_attempt?.score_total ? `${app.latest_attempt.score_total}/100` : '-'}
                  </td>
                  <td>
                    <span className={`badge ${
                      app.application_status === 'verified' ? 'badge-verified' :
                      app.application_status === 'submitted' ? 'badge-info' : 'badge-pending'
                    }`}>
                      {app.application_status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => handleOpenDetail(app.id)}
                    >
                      <Eye size={14} /> Periksa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Candidate Inspection Modal */}
      {selectedAppDetail && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedAppDetail(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
              <span className="badge badge-info" style={{ marginBottom: '0.3rem' }}>PEMERIKSAAN BERKAS PANITIA</span>
              <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
                {selectedAppDetail.application.candidate?.full_name} ({selectedAppDetail.application.application_number})
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                Jalur: <strong>{selectedAppDetail.application.path?.name}</strong> • Status Saat Ini: <strong>{selectedAppDetail.application.application_status.toUpperCase()}</strong>
              </div>
            </div>

            {actionSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionSuccess}
              </div>
            )}
            {actionError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionError}
              </div>
            )}

            {/* Profile & Physical Summary */}
            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(6, 21, 14, 0.7)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ color: '#94a3b8' }}>Tanggal Lahir</div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>{selectedAppDetail.application.date_of_birth}</div>
                <div style={{ color: '#94a3b8', marginTop: '0.4rem' }}>Jenis Kelamin</div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>{selectedAppDetail.application.gender === 'male' ? 'Pria' : 'Wanita'}</div>
              </div>

              <div style={{ background: 'rgba(6, 21, 14, 0.7)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ color: '#94a3b8' }}>Tinggi &amp; Berat Badan</div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {selectedAppDetail.application.height_cm} cm / {selectedAppDetail.application.weight_kg} kg
                </div>
                <div style={{ color: '#94a3b8', marginTop: '0.4rem' }}>Kelayakan Fisik</div>
                <div style={{ fontWeight: 600, color: '#34d399' }}>{selectedAppDetail.application.eligibility_status}</div>
              </div>

              <div style={{ background: 'rgba(6, 21, 14, 0.7)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <div style={{ color: '#94a3b8' }}>Pendidikan &amp; Sekolah</div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {selectedAppDetail.application.education_level} - {selectedAppDetail.application.institution_name}
                </div>
                <div style={{ color: '#94a3b8', marginTop: '0.4rem' }}>Nilai Akademik</div>
                <div style={{ fontWeight: 600, color: 'var(--mil-gold-primary)' }}>{selectedAppDetail.application.academic_score}</div>
              </div>
            </div>

            {/* Document Verification Section */}
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              Verifikasi Dokumen Administrasi
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {selectedAppDetail.documents?.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Belum ada berkas yang diunggah calon.</div>
              ) : (
                selectedAppDetail.documents.map(d => (
                  <div key={d.id} style={{
                    background: 'rgba(6, 21, 14, 0.6)',
                    border: '1px solid rgba(45, 161, 112, 0.25)',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-gold)' }}>{d.document_type}</div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{d.storage_path}</div>
                      <span className={`badge ${
                        d.verification_status === 'verified' ? 'badge-verified' :
                        d.verification_status === 'needs_correction' ? 'badge-review' : 'badge-pending'
                      }`} style={{ marginTop: '0.4rem' }}>
                        {d.verification_status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Catatan panitia..."
                        style={{ width: '220px', padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
                        value={docReviewNotes[d.id] || ''}
                        onChange={(e) => setDocReviewNotes({ ...docReviewNotes, [d.id]: e.target.value })}
                      />
                      <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        onClick={() => handleVerifyDocument(d.id, 'verified')}
                      >
                        Sah
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderColor: '#f59e0b', color: '#fbbf24' }}
                        onClick={() => handleVerifyDocument(d.id, 'needs_correction')}
                      >
                        Perbaiki
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recommendation Review Section */}
            {selectedAppDetail.recommendation && (
              <div className="glass-panel-gold" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="var(--mil-gold-primary)" />
                  Tinjauan Rekomendasi AI: {selectedAppDetail.recommendation.recommended_path_name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                  {selectedAppDetail.recommendation.reasoning_summary?.narrative}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select
                    className="form-select"
                    style={{ width: '220px' }}
                    value={adjustedPathId}
                    onChange={(e) => setAdjustedPathId(e.target.value)}
                  >
                    {paths.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Catatan persetujuan panitia..."
                    style={{ flex: 1, minWidth: '200px' }}
                    value={recReviewNotes}
                    onChange={(e) => setRecReviewNotes(e.target.value)}
                  />

                  <button
                    className="btn-gold"
                    onClick={() => handleReviewRecommendation(selectedAppDetail.recommendation.id, 'approved')}
                  >
                    Setujui Rekomendasi
                  </button>
                </div>
              </div>
            )}

            {/* Final Decision Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <button
                className="btn-danger"
                onClick={() => handleUpdateApplicationStatus(selectedAppDetail.application.id, 'rejected')}
              >
                Tolak Pendaftaran
              </button>
              <button
                className="btn-primary"
                onClick={() => handleUpdateApplicationStatus(selectedAppDetail.application.id, 'verified')}
              >
                Tetapkan Sah &amp; Lulus Administrasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
