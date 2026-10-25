# PANDUAN INSTALASI & MENJALANKAN SISTEM

## 1. Prasyarat
- Node.js versi 18+ (Rekomendasi v20 LTS atau v22)
- NPM versi 9+

---

## 2. Cara Menjalankan Aplikasi

### Mode Cepat (Root Launcher)
Dari direktori utama proyek (`d:/Pribadi/penerimaan-prajurit`):
```bash
# Menjalankan Backend (Port 5000) dan Frontend (Port 5173) secara bersamaan:
npm run dev
```

### Menjalankan Terpisah
**Backend:**
```bash
cd backend
npm run dev
# Server aktif di http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Web app aktif di http://localhost:5173
```

---

## 3. Akun Pengujian Bawaan (Pre-Seeded Demo Accounts)

Untuk mempermudah demonstrasi dan pengujian langsung:

1. **Calon Prajurit (Candidate)**:
   - Email: `candidate@tni.mil.id`
   - Sandi: `Prajurit2026!`
   - Hak Akses: Dashboard Calon, Pengisian Profil, Cek Kelayakan, Pre-Test Digital CBT, Rekomendasi Jalur AI.

2. **Panitia Seleksi (Committee)**:
   - Email: `committee@tni.mil.id`
   - Sandi: `Panitia2026!`
   - Hak Akses: Dashboard Monitoring, Verifikasi Dokumen, Review Hasil Asesmen & Rekomendasi.

3. **Administrator Sistem (Admin)**:
   - Email: `admin@tni.mil.id`
   - Sandi: `Admin2026!`
   - Hak Akses: Statistik Keseluruhan, Manajemen Bank Soal & Paket Tes, Konfigurasi Jalur Penerimaan, Audit Log, Ekspor Laporan CSV.

---

## 4. Konfigurasi Database Supabase (Opsional)
Aplikasi telah dilengkapi adapter ganda:
1. **Mode Standalone (Bawaan)**: Berjalan langsung tanpa perlu koneksi database eksternal.
2. **Mode Supabase Live**:
   - Buat proyek di [Supabase.com](https://supabase.com).
   - Jalankan skrip SQL di `backend/migrations/init.sql` pada menu **SQL Editor** di dashboard Supabase.
   - Isi kredensial di file `backend/.env`:
     ```env
     SUPABASE_URL=https://proyek-anda.supabase.co
     SUPABASE_ANON_KEY=eyJh...
     SUPABASE_SERVICE_ROLE_KEY=eyJh...
     ```
