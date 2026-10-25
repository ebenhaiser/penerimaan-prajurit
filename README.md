# Sistem Penerimaan Prajurit Terintegrasi Berbasis AI

Aplikasi web modern untuk proses awal penerimaan prajurit TNI (Tamtama, Bintara, dan Perwira Prajurit Karier / Pa PK) yang dikembangkan berdasarkan spesifikasi resmi **Product Requirements Document (PRD)**.

---

📖 **Buku Panduan Pengguna (Manual Book)** lengkap tersedia pada dokumen: [**`MANUAL_BOOK.md`**](MANUAL_BOOK.md).

---

## 🎖️ Fitur Utama Aplikasi

1. **Autentikasi & Role-Based Access Control (RBAC)**:
   - Mendukung 3 Role: `candidate` (Calon Prajurit), `committee` (Panitia Seleksi), dan `admin` (Administrator Sistem).
   - Pengalihan instan akun pengujian (Quick Demo Bar) di bilah atas aplikasi.
2. **Dashboard Calon Prajurit (Candidate Portal)**:
   - Formulir pendaftaran terstruktur: Data Pribadi, Data Fisik & Antropometri, dan Riwayat Pendidikan.
   - **Kalkulator BMI Otomatis** dengan indikator status berat badan ideal/normal.
   - **Pemeriksaan Persyaratan Awal (Live Eligibility Check)** terhadap batas usia, tinggi badan minimal (pria/wanita), dan kualifikasi ijazah.
   - **Manajemen Berkas Dokumen** (KTP, Ijazah, SKCK, Akta Lahir, Pas Foto).
3. **Modul Pre-Test Digital (CBT Interface)**:
   - 15 butir soal terbagi dalam 3 kategori: **Kemampuan Numerik**, **Kemampuan Verbal**, dan **Penalaran Logis & Analitis**.
   - Timer mundur otomatis (45 menit) yang mengunci ujian saat waktu habis.
   - Palet navigasi nomor soal interaktif.
   - Perhitungan skor otomatis terpusat di backend.
4. **Mesin Rekomendasi Jalur Berbasis AI**:
   - Mengevaluasi multi-kriteria: kelayakan administratif, kesesuaian ijazah, usia, tinggi badan, dan skor asesmen numerik, verbal, dan penalaran logis.
   - Menghasilkan ringkasan rekomendasi jalur (Tamtama / Bintara / Perwira Pa PK) beserta narasi alasan pendukung dan faktor perbaikan/penguatan.
   - Menyimpan snapshot skor dan versi aturan untuk auditabilitas.
5. **Panel Panitia Seleksi (Committee Portal)**:
   - Dashboard monitoring statistik calon peserta.
   - Pencarian, filter per jalur, dan filter status berkas.
   - Drawer inspeksi calon peserta: verifikasi keabsahan dokumen (Sah / Perlu Perbaikan) dengan catatan resmi panitia.
   - Evaluasi rekomendasi AI: persetujuan atau penyesuaian jalur penempatan.
6. **Panel Administrator Sistem (Admin Portal)**:
   - Konfigurasi ambang batas usia dan tinggi badan per jalur seleksi tanpa mengubah source code.
   - Manajemen bank soal asesmen digital (tambah soal baru, pilihan jawaban, kunci jawaban, dan tingkat kesulitan).
   - Jejak audit aktivitas (*Audit Log*) pengguna secara kronologis.
   - **Ekspor Rekapitulasi Data (CSV)** pelamar dan hasil asesmen.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Server & Web App Sekaligus
```bash
# Dari root direktori d:/Pribadi/penerimaan-prajurit
npm run dev
```
- **Frontend App**: `http://localhost:5173/`
- **Backend API**: `http://localhost:5000/api/v1`

### 2. Menjalankan Unit Tests Backend
```bash
npm run test:backend
```

---

## 👤 Akun Pengujian Bawaan (Pre-Seeded Demo Accounts)

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Calon Prajurit** | `candidate@tni.mil.id` | `Prajurit2026!` | Pengisian profil, live eligibility check, pre-test CBT, rekomendasi AI |
| **Panitia Seleksi** | `committee@tni.mil.id` | `Panitia2026!` | Verifikasi dokumen administrasi, tinjauan hasil tes & rekomendasi |
| **Administrator** | `admin@tni.mil.id` | `Admin2026!` | Kelola kriteria jalur, bank soal, audit log, unduh CSV rekapitulasi |

---

## 🗄️ Database Supabase Migration
Skrip DDL PostgreSQL lengkap beserta RLS (*Row Level Security*) dan data awal tersedia pada file:
[`backend/migrations/init.sql`](backend/migrations/init.sql)
