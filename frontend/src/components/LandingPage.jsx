import React, { useState } from 'react';
import { Shield, Award, CheckCircle, FileText, Cpu, ArrowRight, UserCheck, Clock, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react';

export const LandingPage = ({ paths = [], periods = [], onOpenAuth, onSelectPath }) => {
  const [selectedPathDetail, setSelectedPathDetail] = useState(null);

  const activePeriod = periods.length > 0 ? periods[0] : { name: 'Penerimaan Prajurit TNI TA 2026 Gelombang I', status: 'open' };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div className="container">
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            color: 'var(--text-gold)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)'
          }}>
            <Award size={16} />
            PENDAFTARAN RESMI DIBUKA: {activePeriod.name}
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto',
            letterSpacing: '-0.02em'
          }}>
            Mengabdi untuk Bangsa melalui Seleksi Modern &amp; <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #d4af37 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Berbasis AI</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            maxWidth: '750px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.7
          }}>
            Platform terpadu penerimaan calon prajurit TNI. Otomatisasi pemeriksaan persyaratan administrasi, asesmen potensi digital (CBT), dan rekomendasi awal penempatan jalur yang transparan &amp; terukur.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" onClick={() => onOpenAuth('register')} style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
              Daftar Sekarang TA 2026 <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => onOpenAuth('login')} style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}>
              Masuk ke Portal Calon
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="grid-3" style={{ marginTop: '4rem', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(45, 161, 112, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#34d399' }}>
                <CheckCircle size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Validasi Otomatis</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Pemeriksaan instan kriteria usia, tinggi badan, indeks massa tubuh (BMI), dan kualifikasi ijazah terhadap aturan resmi per jalur.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--mil-gold-primary)' }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Pre-Test CBT Digital</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Asesmen kemampuan numerik, pemahaman verbal, dan penalaran logis dengan timer tersinkronisasi serta penilaian langsung di backend.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#38bdf8' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Mesin Rekomendasi AI</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Saran objektif jalur Tamtama, Bintara, atau Perwira Pa PK berdasarkan profil fisik, akademik, dan skor asesmen dengan alasan transparan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jalur Penerimaan Section */}
      <section style={{ padding: '3rem 0', background: 'rgba(6, 21, 14, 0.5)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-eligible" style={{ marginBottom: '0.5rem' }}>JALUR SELEKSI</span>
            <h2 style={{ fontSize: '2rem', color: '#ffffff' }}>Pilihan Jalur Penerimaan Prajurit</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Tentukan jalur pengabdian sesuai dengan kualifikasi pendidikan dan usia Anda.
            </p>
          </div>

          <div className="grid-3">
            {paths.map(path => (
              <div key={path.id} className="glass-panel" style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: path.code === 'BINTARA' ? '1px solid rgba(212, 175, 55, 0.4)' : undefined,
                position: 'relative'
              }}>
                {path.code === 'BINTARA' && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #d4af37, #f59e0b)',
                    color: '#06150e',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    POPULER
                  </div>
                )}

                <div>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(34, 92, 66, 0.3)',
                    border: '1px solid rgba(45, 161, 112, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mil-gold-primary)',
                    marginBottom: '1rem'
                  }}>
                    <Shield size={20} />
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                    {path.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', minHeight: '40px', marginBottom: '1.25rem' }}>
                    {path.additional_rules?.description || 'Jalur seleksi prajurit berkualifikasi.'}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    padding: '1rem',
                    background: 'rgba(6, 21, 14, 0.5)',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Pendidikan Min:</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{(path.education_rules || []).join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Rentang Usia:</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{path.min_age} - {path.max_age} Tahun</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Tinggi Badan:</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                        Pria {path.min_height_male_cm} cm | Wanita {path.min_height_female_cm} cm
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, fontSize: '0.85rem' }}
                    onClick={() => {
                      onOpenAuth('register');
                    }}
                  >
                    Pilih Jalur <ArrowRight size={14} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    onClick={() => setSelectedPathDetail(path)}
                  >
                    Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Seleksi Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>TAHAPAN RESMI</span>
            <h2 style={{ fontSize: '2rem', color: '#ffffff' }}>Alur Pendaftaran &amp; Seleksi Awal</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              5 langkah terpadu dari pendaftaran online hingga rekomendasi akhir penempatan.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            position: 'relative'
          }}>
            {[
              { step: '01', title: 'Buat Akun & Profil', desc: 'Isi biodata lengkap, tanggal lahir, dan kontak aktif.' },
              { step: '02', title: 'Data Fisik & Ijazah', desc: 'Input tinggi, berat badan, kualifikasi sekolah/kampus.' },
              { step: '03', title: 'Unggah Berkas', desc: 'Upload dokumen KTP, Ijazah, dan SKCK dalam format PDF/Gambar.' },
              { step: '04', title: 'Pre-Test Digital', desc: 'Selesaikan 15 soal asesmen numerik, verbal, dan penalaran logis.' },
              { step: '05', title: 'Hasil & Rekomendasi', desc: 'Dapatkan skor terinci dan rekomendasi jalur berbasis AI.' }
            ].map((st, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--mil-gold-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.35rem' }}>{st.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Path Detail Modal */}
      {selectedPathDetail && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1rem' }}>
              Syarat &amp; Ketentuan: {selectedPathDetail.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
              <div><strong>Kualifikasi Ijazah:</strong> {(selectedPathDetail.education_rules || []).join(', ')}</div>
              <div><strong>Rentang Usia:</strong> {selectedPathDetail.min_age} sampai {selectedPathDetail.max_age} Tahun</div>
              <div><strong>Tinggi Minimal:</strong> Pria {selectedPathDetail.min_height_male_cm} cm, Wanita {selectedPathDetail.min_height_female_cm} cm</div>
              <div><strong>Nilai Standar Minimum:</strong> {selectedPathDetail.additional_rules?.min_academic_score || 6.0}</div>
              <div style={{ background: 'rgba(34, 92, 66, 0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <span style={{ color: 'var(--text-gold)', fontWeight: 600 }}>Catatan: </span>
                {selectedPathDetail.additional_rules?.description}
              </div>
            </div>
            <button className="btn-gold" style={{ width: '100%' }} onClick={() => setSelectedPathDetail(null)}>
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
