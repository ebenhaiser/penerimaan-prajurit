import React, { useState, useEffect } from 'react';
import { Shield, User, FileText, CheckCircle2, AlertTriangle, XCircle, Upload, Play, Award, RefreshCw, ChevronRight, Info } from 'lucide-react';
import { api } from '../services/api';

export const CandidatePortal = ({ user, onStartExam }) => {
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'documents' | 'eligibility' | 'assessment'
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [availablePaths, setAvailablePaths] = useState([]);
  const [activePeriod, setActivePeriod] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    date_of_birth: '2005-04-15',
    place_of_birth: 'Surabaya',
    gender: 'male',
    address: 'Jl. Merdeka No. 45, Surabaya, Jawa Timur',
    height_cm: 172,
    weight_kg: 66,
    education_level: 'SMA',
    institution_name: 'SMAN 1 Surabaya',
    major: 'IPA',
    graduation_year: 2023,
    academic_score: 8.4,
    selected_path_id: ''
  });

  // Document upload state
  const [docType, setDocType] = useState('KTP');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    loadPortalData();
  }, []);

  const loadPortalData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load public info for paths & periods
      const info = await api.getPublicInfo();
      setAvailablePaths(info.paths || []);
      const period = info.periods?.[0];
      setActivePeriod(period);

      // Load applications for current candidate
      const apps = await api.getMyApplications();
      let currentApp = apps[0];

      if (!currentApp && period) {
        // Automatically create initial draft application if not existing
        currentApp = await api.createApplication({
          period_id: period.id,
          selected_path_id: info.paths?.find(p => p.code === 'BINTARA')?.id || info.paths?.[0]?.id,
          ...formData
        });
      }

      if (currentApp) {
        setApplication(currentApp);
        setFormData({
          date_of_birth: currentApp.date_of_birth || '2005-04-15',
          place_of_birth: currentApp.place_of_birth || 'Surabaya',
          gender: currentApp.gender || 'male',
          address: currentApp.address || 'Jl. Merdeka No. 45, Surabaya',
          height_cm: currentApp.height_cm || 172,
          weight_kg: currentApp.weight_kg || 66,
          education_level: currentApp.education_level || 'SMA',
          institution_name: currentApp.institution_name || 'SMAN 1 Surabaya',
          major: currentApp.major || 'IPA',
          graduation_year: currentApp.graduation_year || 2023,
          academic_score: currentApp.academic_score || 8.4,
          selected_path_id: currentApp.selected_path_id || ''
        });

        // Load documents
        const docs = await api.getDocuments(currentApp.id);
        setDocuments(docs);

        // Load eligibility
        const elig = await api.getEligibility(currentApp.id);
        setEligibilityData(elig);

        // Load recommendation
        const rec = await api.getRecommendation(currentApp.id);
        setRecommendation(rec);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data portal calon.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    if (!application) return;

    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');

      const updated = await api.updateApplication(application.id, {
        ...formData,
        height_cm: Number(formData.height_cm),
        weight_kg: Number(formData.weight_kg),
        graduation_year: Number(formData.graduation_year),
        academic_score: Number(formData.academic_score)
      });

      setApplication(updated);

      // Refresh eligibility & recommendation
      const elig = await api.getEligibility(application.id);
      setEligibilityData(elig);

      const rec = await api.generateRecommendation(application.id);
      setRecommendation(rec);

      setSuccessMsg('Data pendaftaran dan fisik berhasil disimpan & dievaluasi ulang.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!application) return;
    try {
      setSaving(true);
      setError('');
      const submitted = await api.submitApplication(application.id);
      setApplication(submitted);
      setSuccessMsg('Berkas pendaftaran resmi diserahkan ke panitia seleksi!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadMockDoc = async () => {
    if (!application) return;
    try {
      setUploadingDoc(true);
      const doc = await api.uploadDocument(application.id, {
        document_type: docType,
        filename: `${docType.toLowerCase()}_${user.full_name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        mime_type: 'application/pdf',
        file_size: Math.floor(Math.random() * 200000) + 100000
      });
      const updatedDocs = await api.getDocuments(application.id);
      setDocuments(updatedDocs);
      setSuccessMsg(`Dokumen ${docType} berhasil diunggah.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await api.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // BMI calculation live
  const heightM = (formData.height_cm || 170) / 100;
  const bmiVal = Number(((formData.weight_kg || 65) / (heightM * heightM)).toFixed(1));
  let bmiStatus = 'Ideal';
  if (bmiVal < 18.5) bmiStatus = 'Di Bawah Normal';
  else if (bmiVal > 25 && bmiVal <= 27) bmiStatus = 'Kelebihan Bobot';
  else if (bmiVal > 27) bmiStatus = 'Obesitas';

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ color: 'var(--mil-gold-primary)', fontSize: '1.2rem', fontWeight: 600 }}>
          Memuat Data Calon Prajurit...
        </div>
      </div>
    );
  }

  const selectedPath = availablePaths.find(p => p.id === formData.selected_path_id) || application?.path;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      {/* Top Banner / Summary Card */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        border: '1px solid rgba(212, 175, 55, 0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #184430 0%, #0d281c 100%)',
            border: '2px solid var(--mil-gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--mil-gold-primary)',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.25)'
          }}>
            <Shield size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#ffffff' }}>{user.full_name}</h2>
              <span className={`badge ${
                application?.application_status === 'verified' ? 'badge-verified' :
                application?.application_status === 'submitted' ? 'badge-info' : 'badge-pending'
              }`}>
                {application?.application_status?.toUpperCase() || 'DRAFT'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span>No. Registrasi: <strong style={{ color: 'var(--text-gold)' }}>{application?.application_number || '-'}</strong></span>
              <span>Jalur: <strong style={{ color: '#ffffff' }}>{selectedPath?.name || 'Belum Dipilih'}</strong></span>
              <span>Kelayakan Awal: <strong style={{
                color: application?.eligibility_status === 'eligible' ? '#34d399' :
                       application?.eligibility_status === 'needs_review' ? '#fbbf24' : '#f87171'
              }}>{application?.eligibility_status?.toUpperCase()}</strong></span>
            </div>
          </div>
        </div>

        {/* Action button */}
        {application?.application_status === 'draft' && (
          <button
            className="btn-gold"
            onClick={handleSubmitApplication}
            disabled={saving || application?.eligibility_status === 'incomplete'}
            title={application?.eligibility_status === 'incomplete' ? 'Lengkapi data terlebih dahulu' : 'Ajukan pendaftaran'}
          >
            Ajukan Pendaftaran Resmi
          </button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#6ee7b7',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(45, 161, 112, 0.25)',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {[
          { key: 'data', label: '1. Data Pribadi & Fisik', icon: User },
          { key: 'documents', label: '2. Kelengkapan Dokumen', icon: FileText },
          { key: 'eligibility', label: '3. Pemeriksaan Persyaratan', icon: CheckCircle2 },
          { key: 'assessment', label: '4. Pre-Test & Rekomendasi AI', icon: Award }
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
                borderRadius: '8px 8px 0 0',
                background: isActive ? 'rgba(34, 92, 66, 0.6)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--mil-gold-primary)' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--mil-gold-primary)' : '#94a3b8'} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DATA PRIBADI & FISIK */}
      {activeTab === 'data' && (
        <form onSubmit={handleSaveData}>
          <div className="grid-2">
            {/* Left: Data Pribadi & Jalur */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} color="var(--mil-gold-primary)" /> Data Pribadi Calon
              </h3>

              <div className="form-group">
                <label className="form-label">Pilihan Jalur Penerimaan</label>
                <select
                  className="form-select"
                  value={formData.selected_path_id}
                  onChange={(e) => setFormData({ ...formData, selected_path_id: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Jalur --</option>
                  {availablePaths.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Min. {p.education_rules?.join('/')})</option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="male">Pria</option>
                    <option value="female">Wanita</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tempat Lahir</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.place_of_birth}
                  onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap Domisili</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Right: Data Fisik & Pendidikan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={20} color="var(--mil-gold-primary)" /> Data Fisik &amp; Antropometri
                </h3>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.height_cm}
                      onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                      min="140"
                      max="220"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Berat Badan (kg)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                      min="35"
                      max="150"
                      required
                    />
                  </div>
                </div>

                {/* Live BMI Calculator Indicator */}
                <div style={{
                  background: 'rgba(6, 21, 14, 0.7)',
                  border: '1px solid rgba(45, 161, 112, 0.25)',
                  padding: '1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Indeks Massa Tubuh (BMI)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                      {bmiVal} <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>kg/m²</span>
                    </div>
                  </div>
                  <span className={`badge ${
                    bmiStatus === 'Ideal' ? 'badge-eligible' :
                    bmiStatus === 'Kelebihan Bobot' ? 'badge-review' : 'badge-ineligible'
                  }`}>
                    {bmiStatus}
                  </span>
                </div>
              </div>

              {/* Pendidikan */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} color="var(--mil-gold-primary)" /> Kualifikasi Pendidikan
                </h3>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Jenjang Pendidikan</label>
                    <select
                      className="form-select"
                      value={formData.education_level}
                      onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                      required
                    >
                      <option value="SMP">SMP / Sederajat</option>
                      <option value="SMA">SMA / Sederajat</option>
                      <option value="SMK">SMK</option>
                      <option value="MA">Madrasah Aliyah</option>
                      <option value="D3">Diploma 3 (D3)</option>
                      <option value="D4">Diploma 4 (D4)</option>
                      <option value="S1">Sarjana (S1)</option>
                      <option value="S2">Magister (S2)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tahun Lulus</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.graduation_year}
                      onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                      min="2010"
                      max="2030"
                      required
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Sekolah / Kampus</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.institution_name}
                      onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nilai Rapor / IPK</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.academic_score}
                      onChange={(e) => setFormData({ ...formData, academic_score: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="submit"
              className="btn-gold"
              disabled={saving}
              style={{ padding: '0.8rem 2.5rem' }}
            >
              {saving ? 'Menyimpan & Mengevaluasi...' : 'Simpan Pembaruan Data'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KELENGKAPAN DOKUMEN */}
      {activeTab === 'documents' && (
        <div>
          {/* Upload card */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={20} color="var(--mil-gold-primary)" /> Unggah Berkas Persyaratan
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Unggah berkas resmi dalam format PDF atau Gambar (.pdf, .jpg, .png). Ukuran maksimal 2 MB per berkas.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                className="form-select"
                style={{ width: '220px' }}
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="KTP">KTP Elektronik</option>
                <option value="IJAZAH">Ijazah &amp; Transkrip</option>
                <option value="SKCK">SKCK Kepolisian</option>
                <option value="AKTA_LAHIR">Akta Kelahiran</option>
                <option value="KARTU_KELUARGA">Kartu Keluarga (KK)</option>
                <option value="PAS_FOTO">Pas Foto Resmi</option>
              </select>

              <button
                type="button"
                className="btn-primary"
                onClick={handleUploadMockDoc}
                disabled={uploadingDoc}
              >
                {uploadingDoc ? 'Mengunggah...' : `Unggah Dokumen ${docType}`}
              </button>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(45, 161, 112, 0.2)' }}>
              <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Daftar Dokumen yang Telah Diunggah</h4>
            </div>

            {documents.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                Belum ada dokumen yang diunggah. Silakan unggah dokumen di atas.
              </div>
            ) : (
              <table className="mil-table">
                <thead>
                  <tr>
                    <th>Tipe Dokumen</th>
                    <th>Nama File</th>
                    <th>Ukuran</th>
                    <th>Status Verifikasi</th>
                    <th>Catatan Panitia</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-gold)' }}>{d.document_type}</td>
                      <td style={{ color: '#cbd5e1' }}>{d.storage_path.split('/').pop()}</td>
                      <td>{(d.file_size / 1024).toFixed(0)} KB</td>
                      <td>
                        <span className={`badge ${
                          d.verification_status === 'verified' ? 'badge-verified' :
                          d.verification_status === 'needs_correction' ? 'badge-review' : 'badge-pending'
                        }`}>
                          {d.verification_status === 'verified' ? 'Terverifikasi' :
                           d.verification_status === 'needs_correction' ? 'Perlu Perbaikan' : 'Menunggu Pemeriksaan'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {d.review_notes || '-'}
                      </td>
                      <td>
                        <button
                          className="btn-danger"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteDoc(d.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PEMERIKSAAN KELAYAKAN AWAL */}
      {activeTab === 'eligibility' && (
        <div>
          {/* Current Selection Eligibility */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>EVALUASI PERSYARATAN RESMI</span>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff' }}>
                  Kelayakan Jalur: {eligibilityData?.current_evaluation?.path_name || selectedPath?.name}
                </h3>
              </div>
              <span className={`badge ${
                eligibilityData?.current_evaluation?.status === 'eligible' ? 'badge-eligible' :
                eligibilityData?.current_evaluation?.status === 'needs_review' ? 'badge-review' : 'badge-ineligible'
              }`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                STATUS: {eligibilityData?.current_evaluation?.status?.toUpperCase()}
              </span>
            </div>

            {/* Failed criteria breakdown if any */}
            {eligibilityData?.current_evaluation?.failed_rules?.length > 0 ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1.25rem',
                borderRadius: '10px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontWeight: 700, color: '#fca5a5', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={18} /> Kriteria yang Belum Terpenuhi:
                </div>
                <ul style={{ paddingLeft: '1.5rem', color: '#fecaca', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {eligibilityData.current_evaluation.failed_rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '1.25rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                color: '#6ee7b7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle2 size={24} />
                <div>
                  <div style={{ fontWeight: 700 }}>Memenuhi Seluruh Syarat Awal!</div>
                  <div style={{ fontSize: '0.85rem' }}>Data usia, tinggi badan, kualifikasi ijazah, dan nilai akademik Anda sesuai dengan standar penerimaan.</div>
                </div>
              </div>
            )}
          </div>

          {/* Matrix All Paths comparison */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1.25rem' }}>
              Perbandingan Kelayakan di Seluruh Jalur Penerimaan TNI
            </h4>

            <div className="grid-3">
              {(eligibilityData?.all_paths || []).map(pe => (
                <div key={pe.path_id} style={{
                  background: 'rgba(6, 21, 14, 0.6)',
                  border: `1px solid ${pe.status === 'eligible' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                  padding: '1.5rem',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h5 style={{ fontSize: '1.05rem', color: '#ffffff' }}>{pe.path_name}</h5>
                    <span className={`badge ${
                      pe.status === 'eligible' ? 'badge-eligible' :
                      pe.status === 'needs_review' ? 'badge-review' : 'badge-ineligible'
                    }`}>
                      {pe.status}
                    </span>
                  </div>

                  {pe.failed_rules?.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#34d399' }}>✓ Memenuhi seluruh kriteria awal</div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
                      ✗ {pe.failed_rules[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRE-TEST & REKOMENDASI AI */}
      {activeTab === 'assessment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Pre-Test Action Card */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>MODUL ASESMEN DIGITAL</span>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  Pre-Test Potensi Akademik &amp; Penalaran
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '650px' }}>
                  Pre-test terdiri dari 15 butir soal mencakup Numerik, Verbal, dan Penalaran Logis berdurasi 45 menit. Hasil tes menjadi dasar rekomendasi penempatan jalur berbasis AI.
                </p>
              </div>

              {application?.latest_attempt?.status === 'completed' ? (
                <div style={{
                  background: 'rgba(30, 112, 77, 0.4)',
                  border: '1px solid #2da170',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SKOR AKHIR PRE-TEST</div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--mil-gold-primary)', lineHeight: 1.1 }}>
                    {application.latest_attempt.score_total}/100
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Ujian Telah Diselesaikan</div>
                </div>
              ) : (
                <button
                  className="btn-gold"
                  onClick={async () => {
                    const available = await api.getAvailableTests();
                    if (available.length > 0) {
                      const att = await api.startAttempt(available[0].id, application.id);
                      onStartExam(att.id);
                    }
                  }}
                  style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
                >
                  <Play size={18} /> Mulai Pre-Test Sekarang
                </button>
              )}
            </div>
          </div>

          {/* AI Recommendation Engine Card */}
          {recommendation && (
            <div className="glass-panel-gold" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Award size={24} color="var(--mil-gold-primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      HASIL ANALISIS REKOMENDASI BERBASIS AI
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                    Rekomendasi Jalur: <span style={{ color: 'var(--mil-gold-primary)' }}>{recommendation.recommended_path_name}</span>
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Engine Aturan Versi: <strong>{recommendation.rule_version}</strong> • Status Tinjauan Panitia: <strong>{recommendation.review_status?.toUpperCase()}</strong>
                  </div>
                </div>

                <span className={`badge ${
                  recommendation.recommendation_status === 'ready' ? 'badge-eligible' :
                  recommendation.recommendation_status === 'needs_manual_review' ? 'badge-review' : 'badge-ineligible'
                }`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                  {recommendation.recommendation_status === 'ready' ? 'Rekomendasi Terbuka' :
                   recommendation.recommendation_status === 'needs_manual_review' ? 'Memerlukan Tinjauan Manual' : 'Belum Memenuhi'}
                </span>
              </div>

              {/* Narrative Analysis */}
              <div style={{
                background: 'rgba(6, 21, 14, 0.7)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                color: '#f8fafc',
                lineHeight: 1.7
              }}>
                {recommendation.reasoning_summary?.narrative}
              </div>

              {/* Supporting & Improvement Factors */}
              <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(16, 49, 34, 0.6)', padding: '1.25rem', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#34d399', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> Faktor Pendukung Rekomendasi
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    {(recommendation.reasoning_summary?.supporting_factors || []).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(16, 49, 34, 0.6)', padding: '1.25rem', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#fbbf24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Info size={16} /> Catatan Penguatan / Evaluasi
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    {(recommendation.reasoning_summary?.missing_factors?.length > 0
                      ? recommendation.reasoning_summary.missing_factors
                      : ['Tidak ada catatan defisit kriteria wajib. Pertahankan kesiapan mental & fisik.']
                    ).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Official Disclaimer per PRD BR-06 */}
              <div style={{
                background: 'rgba(6, 21, 14, 0.5)',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                borderLeft: '4px solid var(--mil-gold-primary)',
                fontSize: '0.8rem',
                color: '#94a3b8'
              }}>
                <strong style={{ color: '#ffffff' }}>DISCLAIMER RESMI:</strong> Hasil rekomendasi sistem merupakan dukungan analitis awal berbasis aturan dan skor asesmen potensi. Keputusan resmi penerimaan dan penempatan korps sepenuhnya berada pada Panitia Seleksi Instansi yang berwenang.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
