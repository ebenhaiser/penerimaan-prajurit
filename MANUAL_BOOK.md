# BUKU PANDUAN PENGGUNA (MANUAL BOOK)
# SISTEM PENERIMAAN PRAJURIT TERINTEGRASI BERBASIS AI

---

## DAFTAR ISI
1. [Tentang Aplikasi](#1-tentang-aplikasi)
2. [Arsitektur & Hak Akses (Role)](#2-arsitektur--hak-akses-role)
3. [Akun Demo & Akses Cepat](#3-akun-demo--akses-cepat)
4. [Panduan Calon Prajurit (Candidate Portal)](#4-panduan-calon-prajurit-candidate-portal)
   - 4.1 Registrasi & Masuk ke Sistem
   - 4.2 Pengisian Formulir Biodata & Pengecekan Syarat
   - 4.3 Unggah & Manajemen Dokumen
   - 4.4 Melaksanakan Pre-Test Digital (CBT)
   - 4.5 Melihat Rekomendasi Jalur Berbasis AI
   - 4.6 Memantau Status Kelulusan
5. [Panduan Panitia Seleksi (Committee Portal)](#5-panduan-panitia-seleksi-committee-portal)
   - 5.1 Dashboard Statistik Peserta
   - 5.2 Pencarian, Filter & Sortir Pelamar
   - 5.3 Verifikasi Keabsahan Dokumen
   - 5.4 Evaluasi & Penetapan Rekomendasi AI
6. [Panduan Administrator Sistem (Admin Portal)](#6-panduan-administrator-sistem-admin-portal)
   - 6.1 Konfigurasi Kriteria & Ambang Batas Jalur
   - 6.2 Manajemen Bank Soal Pre-Test (CBT)
   - 6.3 Audit Trail & Log Keamanan
   - 6.4 Ekspor Data Pelamar (CSV)
7. [Panduan Teknis & Pemecahan Masalah (Troubleshooting)](#7-panduan-teknis--pemecahan-masalah-troubleshooting)

---

## 1. Tentang Aplikasi

**Sistem Penerimaan Prajurit Terintegrasi Berbasis AI** adalah platform digital modern yang dirancang untuk mendukung proses rekrutmen prajurit TNI (Tamtama, Bintara, dan Perwira Pa PK) secara transparan, akuntabel, objektif, dan efisien.

### Fitur Kunci:
- **Pemeriksaan Kelayakan Otomatis (Automated Eligibility Engine)**: Validasi instan usia, tinggi badan, dan kalkulator BMI.
- **Computer-Based Testing (CBT) Pre-Test Digital**: Asesmen terpusat dengan timer otomatis untuk tes Numerik, Verbal, dan Penalaran Logis.
- **Mesin Rekomendasi Multi-Kriteria Berbasis AI**: Menganalisis perpaduan data fisik, pendidikan, dan hasil asesmen kognitif guna merekomendasikan jalur dinas militer yang paling optimal.
- **Workflow Verifikasi Dokumen**: Panitia dapat memeriksa keabsahan berkas secara real-time dan memberikan catatan perbaikan.
- **Keamanan Data Militer**: Menggunakan Row Level Security (RLS) pada basis data PostgreSQL Supabase dan enkripsi token JWT.

---

## 2. Arsitektur & Hak Akses (Role)

Aplikasi memiliki 3 tingkat hak akses pengguna:

| Role | Deskripsi | Akses Menu |
|---|---|---|
| **`candidate` (Calon Prajurit)** | Pelamar yang mendaftar rekrutmen | Beranda, Profil Biodata, Upload Dokumen, Pre-Test CBT, Hasil Rekomendasi AI |
| **`committee` (Panitia Seleksi)** | Petugas verifikasi & penguji | Dashboard Seleksi, Verifikasi Dokumen, Evaluasi Rekomendasi AI |
| **`admin` (Administrator)** | Pengelola sistem & parameter | Konfigurasi Jalur, Bank Soal CBT, Audit Log, Ekspor CSV |

---

## 3. Akun Demo & Akses Cepat

Untuk mempermudah pengujian alur operasional, aplikasi dilengkapi **Quick Switch Bar** pada bagian paling atas halaman web:

| Role | Email Demo | Password Demo |
|---|---|---|
| **Calon Prajurit** | `ahmad.fauzi@example.com` | `Prajurit2026!` |
| **Panitia Seleksi** | `panitia.seleksi@tni.mil.id` | `Panitia2026!` |
| **Administrator** | `admin.penerimaan@tni.mil.id` | `Admin2026!` |

> **Tips:** Klik salah satu tombol role pada *Quick Switch Bar* di bagian atas layar untuk login secara otomatis tanpa mengetik manual.

---

## 4. Panduan Calon Prajurit (Candidate Portal)

### 4.1 Registrasi & Masuk ke Sistem
1. Buka peramban (browser) dan akses alamat web: `http://localhost:5173`.
2. Klik tombol **Masuk / Daftar** pada pojok kanan atas navbar.
3. Untuk akun baru, pilih tab **Daftar Akun Baru**, masukkan:
   - Nama Lengkap (Sesuai KTP/Ijazah).
   - Alamat Email Aktif.
   - Kata Sandi (Minimal 8 karakter).
   - Nomor WhatsApp Aktif.
4. Klik tombol **Daftar Sekarang**.

### 4.2 Pengisian Formulir Biodata & Pengecekan Syarat
1. Masuk ke tab **Data Diri & Fisik**.
2. Lengkapi formulir pendaftaran:
   - **Data Pribadi**: NIK (16 digit), Tempat & Tanggal Lahir, Jenis Kelamin, Agama, Alamat Lengkap.
   - **Data Fisik**:
     - Masukkan **Tinggi Badan (cm)**.
     - Masukkan **Berat Badan (kg)**.
     - *Kalkulator BMI otomatis menghitung nilai Indeks Massa Tubuh dan menampilkan status gizi (Normal / Di Bawah Ideal / Di Atas Ideal).*
   - **Riwayat Pendidikan**: Tingkat Pendidikan (SMA/SMK/D3/S1), Jurusan, Nama Sekolah/Universitas, Nilai Rata-rata/IPK.
   - **Jalur Seleksi Pilihan**: Pilih Tamtama PK, Bintara PK, atau Perwira Pa PK.
3. Sistem secara otomatis mengevaluasi **Status Kelayakan Awal (Eligibility)**:
   - Indikator hijau menandakan seluruh kriteria awal terpenuhi.
   - Indikator kuning/merah memberikan detail parameter yang belum memenuhi batas (misal: usia melebihi ambang batas atau tinggi badan kurang dari standar minimal).
4. Klik tombol **Simpan Data Pendaftaran**.

### 4.3 Unggah & Manajemen Dokumen
1. Pilih tab **Berkas Dokumen**.
2. Unggah dokumen wajib yang dipersyaratkan:
   - **KTP Elektronik**
   - **Ijazah & Transkrip Nilai**
   - **SKCK (Surat Keterangan Catatan Kepolisian)**
   - **Akta Kelahiran**
   - **Pas Foto Resmi (Latar Merah)**
3. Status berkas akan tampil sebagai:
   - `PENDING`: Menunggu pemeriksaan panitia.
   - `VERIFIED`: Berkas dinyatakan sah dan lengkap.
   - `REJECTED`: Berkas ditolak (dapat diperbaiki berdasarkan catatan panitia).

### 4.4 Melaksanakan Pre-Test Digital (CBT)
1. Setelah data dan berkas tersimpan, calon prajurit berhak mengikuti ujian pre-test kognitif.
2. Klik tab **Pre-Test CBT** lalu klik tombol **Mulai Ujian Sekarang**.
3. Ketentuan Ujian:
   - Terdiri dari **15 butir soal** pilihan ganda.
   - Mencakup 3 domain kompetensi:
     - **Kemampuan Numerik** (Aritmatika, Deret Angka, Persentase).
     - **Kemampuan Verbal** (Sinonim, Analogi Kata, Silogisme).
     - **Penalaran Logis & Analitis** (Pola Spasial, Logika Formal).
   - Batas waktu pengerjaan: **45 Menit**.
4. Fitur CBT:
   - **Timer Mundur**: Tampil di pojok kanan atas dan akan otomatis mengunci saat waktu habis.
   - **Palet Nomor Soal**: Navigasi cepat untuk melihat soal yang sudah dijawab atau belum dijawab.
5. Klik **Selesaikan & Kirim Jawaban**. Konfirmasi pengiriman untuk memperoleh skor instan.

### 4.5 Melihat Rekomendasi Jalur Berbasis AI
1. Pilih tab **Rekomendasi AI**.
2. Mesin kecerdasan buatan menggabungkan analisis:
   - Kelayakan antropometri fisik (Tinggi/BMI).
   - Kualifikasi jenjang pendidikan dan kesesuaian jurusan.
   - Profil skor CBT pada masing-masing sub-tes (Numerik, Verbal, Logika).
3. Halaman menampilkan:
   - **Jalur yang Direkomendasikan Utama** (misal: *Bintara PK* atau *Perwira Pa PK*).
   - **Tingkat Keyakinan Rekomendasi (Confidence Score)**.
   - **Analisis Kekuatan Calon Prajurit**.
   - **Aspek yang Perlu Ditingkatkan** (Area for Improvement) untuk persiapan tahap pantukhir lanjutan.

---

## 5. Panduan Panitia Seleksi (Committee Portal)

### 5.1 Dashboard Statistik Peserta
Login sebagai Panitia (`panitia.seleksi@tni.mil.id`) untuk mengakses panel pengawasan:
- **Total Pendaftar**: Jumlah keseluruhan pendaftar dalam periode rekrutmen.
- **Status Berkas**: Rekapitulasi berkas yang belum diperiksa, terverifikasi, atau ditolak.
- **Distribusi Jalur**: Persentase peminat Tamtama, Bintara, dan Perwira.
- **Rata-Rata Skor CBT**: Rerata capaian nilai peserta se-Indonesia.

### 5.2 Pencarian, Filter & Sortir Pelamar
1. Gunakan kotak **Pencarian** untuk mencari peserta berdasarkan Nama atau Nomor Pendaftaran.
2. Gunakan bilah filter:
   - Filter **Jalur Pendaftaran** (Tamtama, Bintara, Perwira).
   - Filter **Status Berkas** (Semua, Menunggu, Sah, Ditolak).
   - Filter **Kelayakan** (Memenuhi Syarat / Tidak Memenuhi Syarat).

### 5.3 Verifikasi Keabsahan Dokumen
1. Klik baris nama pelamar pada tabel peserta.
2. Drawer detail pelamar akan terbuka di sisi kanan.
3. Klik tombol **Lihat Dokumen** untuk memeriksa pratinjau berkas (KTP, Ijazah, SKCK, dll.).
4. Berikan tindakan verifikasi:
   - Klik **Sahkan (Valid)** jika berkas asli dan sesuai.
   - Klik **Minta Perbaikan (Reject)** jika berkas buram atau tidak sesuai, lalu isikan **Catatan Resmi Panitia** (misal: *"Scan ijazah terpotong pada bagian legalisir, mohon upload ulang"*).
5. Klik **Simpan Status Verifikasi**.

### 5.4 Evaluasi & Penetapan Rekomendasi AI
1. Pada drawer calon prajurit, tinjau hasil analisis mesin rekomendasi AI.
2. Panitia memiliki wewenang untuk:
   - **Menyetujui Hasil Rekomendasi AI** sebagai keputusan jalur sidang parade.
   - **Mengubah/Menyesuaikan Rekomendasi** ke jalur lain dengan mencantumkan pertimbangan kebutuhan formasi matra/korps.

---

## 6. Panduan Administrator Sistem (Admin Portal)

Login sebagai Administrator (`admin.penerimaan@tni.mil.id`) untuk mengakses fungsi tata kelola sistem:

### 6.1 Konfigurasi Kriteria & Ambang Batas Jalur
Administrator dapat memperbarui syarat rekrutmen tanpa perlu mengubah source code:
1. Buka menu **Konfigurasi Jalur**.
2. Pilih jalur seleksi yang ingin disesuaikan (Tamtama, Bintara, atau Perwira).
3. Sesuaikan parameter:
   - **Usia Minimal** (misal: 17 tahun 9 bulan).
   - **Usia Maksimal** (misal: 22 tahun untuk Tamtama, 26 tahun untuk S1 Perwira Pa PK).
   - **Tinggi Badan Minimal Pria** (misal: 163 cm).
   - **Tinggi Badan Minimal Wanita** (misal: 157 cm).
4. Klik **Perbarui Konfigurasi**. Perubahan langsung berlaku secara real-time pada kalkulator kelayakan.

### 6.2 Manajemen Bank Soal Pre-Test (CBT)
1. Buka menu **Bank Soal**.
2. Administrator dapat:
   - Melihat daftar seluruh butir soal yang aktif beserta kategori dan tingkat kesulitannya.
   - Menambahkan butir soal baru: masukkan teks soal, opsi jawaban (A, B, C, D), kunci jawaban yang benar, kategori (Numerik/Verbal/Logika), serta bobot nilai.
   - Mengaktifkan atau menonaktifkan soal tertentu dari paket ujian.

### 6.3 Audit Trail & Log Keamanan
1. Buka menu **Log Aktivitas & Keamanan**.
2. Tabel audit menyajikan catatan kronologis:
   - Siapa yang melakukan aksi (User ID / Email).
   - Jenis aksi (`LOGIN`, `UPDATE_APPLICATION`, `VERIFY_DOCUMENT`, `SUBMIT_TEST`, `UPDATE_CONFIG`).
   - Waktu tepat pencatatan (Timestamp UTC / WIB).
   - IP Address & Detail perubahan data.
3. Fitur ini menjamin akuntabilitas dan pencegahan manipulasi data seleksi.

### 6.4 Ekspor Data Pelamar (CSV)
1. Pada halaman rekapitulasi pelamar, klik tombol **Ekspor ke CSV**.
2. Berkas CSV akan otomatis terunduh berisi:
   - Nomor Pendaftaran, NIK, Nama Lengkap, Jalur, Usia, Tinggi/Berat Badan, Skor CBT, Rekomendasi AI, dan Status Akhir.
3. Berkas ini siap diimpor ke aplikasi pengolah data (Microsoft Excel / Google Sheets) untuk bahan sidang pantukhir.

---

## 7. Panduan Teknis & Pemecahan Masalah (Troubleshooting)

### Q1: Muncul error `listen EADDRINUSE: address already in use :::5000` saat menjalankan `npm run dev`
- **Penyebab**: Server backend masih berjalan di jendela terminal lain atau proses Node.js sebelumnya belum tertutup.
- **Solusi**:
  1. Hentikan proses yang berjalan dengan menekan `Ctrl + C` pada terminal aktif.
  2. Atau periksa dan matikan proses port 5000 di Command Prompt / PowerShell:
     ```powershell
     netstat -ano | findstr :5000
     # Jika ada PID yang muncul (misal: 12345), matikan dengan:
     taskkill /PID 12345 /F
     ```
  3. Jalankan kembali: `npm run dev`.

### Q2: Bagaimana cara menyambungkan database Supabase sendiri?
- Salin berkas `backend/.env.example` ke `backend/.env`.
- Masukkan URL dan Key Supabase Anda:
  ```env
  SUPABASE_URL=https://<project-id>.supabase.co
  SUPABASE_KEY=sb_publishable_...
  ```
- Jalankan migrasi tabel yang tersedia di `backend/migrations/01_penerimaan_prajurit_schema.sql` melalui SQL Editor Supabase.

### Q3: Bagaimana jika koneksi Supabase terputus?
- Aplikasi dilengkapi mekanisme **Dual-Mode**: jika Supabase tidak terhubung atau offline, backend secara otomatis beralih ke penyimpanan repositori lokal in-memory yang sudah terisi (*seeded*) data pengujian lengkap sehingga demo aplikasi tetap berjalan lancar tanpa kendala.
