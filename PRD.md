# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# SISTEM PENERIMAAN PRAJURIT TERINTEGRASI BERBASIS AI

**Versi:** 1.0  
**Status:** Draft untuk Pengembangan MVP  
**Platform:** Web Application  
**Backend:** Node.js + Express.js  
**Database:** Supabase PostgreSQL  
**Authentication:** Supabase Auth  
**Bahasa:** Bahasa Indonesia

---

## 1. RINGKASAN PRODUK

### 1.1 Nama Produk
Sistem Penerimaan Prajurit Terintegrasi Berbasis AI.

### 1.2 Deskripsi Produk
Aplikasi web yang dirancang untuk membantu proses awal penerimaan calon prajurit melalui pengelolaan data calon peserta, verifikasi persyaratan administrasi, asesmen potensi, pre-test digital, serta pemberian rekomendasi jalur pendaftaran berdasarkan kualifikasi dan hasil asesmen.

Sistem mendukung tiga jalur penerimaan:
- Perwira, termasuk Perwira Prajurit Karier (Pa PK).
- Bintara.
- Tamtama.

Aplikasi menyediakan dashboard bagi calon peserta dan administrator untuk memantau kelengkapan data, status verifikasi, hasil pre-test, serta rekomendasi jalur yang sesuai.

Penggunaan AI pada tahap MVP dirancang sebagai fitur pendukung analisis dan rekomendasi. Keputusan resmi penerimaan tetap berada pada panitia seleksi yang berwenang.

### 1.3 Latar Belakang
Proses penerimaan prajurit memerlukan pengelolaan data yang terintegrasi, penilaian yang lebih terukur, serta proses administrasi yang efisien.

Sistem ini dikembangkan untuk:
1. Meningkatkan efektivitas proses penerimaan.
2. Mengintegrasikan data calon peserta dengan tahapan asesmen awal.
3. Mengurangi kesalahan dalam pemeriksaan administrasi.
4. Memetakan potensi akademik dan penalaran calon peserta.
5. Memberikan rekomendasi awal jalur pendaftaran berdasarkan kriteria yang berlaku.
6. Membantu panitia melakukan monitoring dan evaluasi melalui dashboard terpusat.

### 1.4 Tujuan Produk
- Menyediakan sistem pendaftaran calon prajurit berbasis web.
- Mengotomatisasi pemeriksaan awal persyaratan administratif.
- Menyediakan pre-test digital untuk mengukur kemampuan numerik, verbal, dan penalaran logis.
- Menghasilkan rekomendasi awal jalur Perwira, Bintara, atau Tamtama.
- Menyediakan dashboard monitoring bagi administrator dan panitia.
- Menjaga keamanan, kerahasiaan, serta integritas data calon peserta.

---

## 2. TARGET PENGGUNA

### 2.1 Calon Prajurit
Pengguna yang melakukan pendaftaran dan mengikuti asesmen awal.

Kebutuhan:
- Membuat akun dan login.
- Melengkapi profil dan data pendidikan.
- Memeriksa kelengkapan administrasi.
- Mengerjakan pre-test digital.
- Melihat status pendaftaran dan rekomendasi jalur.

### 2.2 Administrator
Pengguna yang mengelola sistem dan konfigurasi aplikasi.

Kebutuhan:
- Mengelola akun dan hak akses.
- Mengelola periode pendaftaran.
- Mengelola kriteria kelayakan dan konfigurasi jalur.
- Mengelola soal dan konfigurasi pre-test.
- Melihat laporan dan aktivitas sistem.

### 2.3 Panitia Seleksi
Pengguna internal yang melakukan pemeriksaan dan evaluasi calon peserta.

Kebutuhan:
- Memeriksa data calon peserta.
- Melakukan verifikasi dokumen.
- Melihat hasil asesmen dan rekomendasi.
- Memperbarui status verifikasi sesuai kewenangan.
- Mencatat alasan keputusan dan koreksi data.

---

## 3. RUANG LINGKUP MVP

### 3.1 Fitur yang Termasuk
1. Autentikasi dan otorisasi pengguna.
2. Dashboard calon peserta.
3. Formulir data pribadi dan pendidikan.
4. Pemeriksaan awal persyaratan administrasi dan fisik.
5. Pemilihan jalur pendaftaran.
6. Modul pre-test digital.
7. Penilaian otomatis berdasarkan kunci jawaban.
8. Mesin rekomendasi jalur berbasis aturan dan skor.
9. Dashboard administrator dan panitia.
10. Manajemen soal dan kriteria penerimaan.
11. Riwayat pendaftaran dan asesmen.
12. Laporan dan ekspor data.
13. Audit log aktivitas penting.
14. Notifikasi status dan hasil asesmen.

### 3.2 Fitur di Luar MVP
Fitur berikut dapat dikembangkan pada fase lanjutan:
- Integrasi langsung dengan Dukcapil.
- Integrasi dengan sistem pendidikan untuk validasi NISN dan ijazah.
- Integrasi dengan layanan Kepolisian untuk verifikasi SKCK.
- Integrasi biometrik dan pengenalan wajah.
- AI/ML yang dilatih menggunakan data historis seleksi tervalidasi.
- Integrasi sistem seleksi resmi milik instansi.
- Pengiriman notifikasi melalui WhatsApp atau SMS.

Integrasi eksternal hanya dapat diaktifkan setelah tersedia akses API resmi, persetujuan instansi, dan mekanisme perlindungan data yang sesuai.

---

## 4. ALUR UTAMA PENGGUNA

### 4.1 Alur Calon Peserta
1. Calon peserta membuka halaman aplikasi.
2. Calon peserta membuat akun menggunakan email dan kata sandi.
3. Sistem mengirimkan email verifikasi.
4. Calon peserta login.
5. Calon peserta melengkapi profil pribadi.
6. Calon peserta mengisi data fisik dan pendidikan.
7. Sistem memeriksa kelengkapan data dan persyaratan awal.
8. Calon peserta memilih periode dan jalur pendaftaran.
9. Sistem memeriksa apakah calon peserta memenuhi kriteria awal jalur.
10. Calon peserta mengerjakan pre-test digital.
11. Sistem menghitung skor secara otomatis.
12. Sistem menghasilkan rekomendasi awal berdasarkan aturan yang telah dikonfigurasi.
13. Calon peserta melihat hasil asesmen dan status administrasi.
14. Panitia melakukan verifikasi dan evaluasi lanjutan.

### 4.2 Alur Panitia
1. Panitia login menggunakan akun dengan role yang sesuai.
2. Panitia membuka dashboard monitoring.
3. Panitia melihat daftar calon peserta.
4. Panitia memfilter peserta berdasarkan jalur, periode, dan status.
5. Panitia memeriksa data dan dokumen.
6. Panitia menetapkan status verifikasi.
7. Panitia meninjau hasil pre-test dan rekomendasi.
8. Panitia mencatat keputusan, catatan, atau alasan koreksi.
9. Sistem menyimpan seluruh perubahan pada audit log.

---

## 5. KEBUTUHAN FUNGSIONAL

### FR-01: Autentikasi Pengguna
Sistem harus menyediakan:
- Registrasi akun.
- Login dan logout.
- Verifikasi email.
- Reset kata sandi.
- Manajemen sesi.
- Role-based access control.

Role minimal:
- `candidate`
- `committee`
- `admin`

Setiap pengguna hanya dapat mengakses data dan fungsi sesuai kewenangannya.

### FR-02: Manajemen Profil Calon Peserta
Sistem harus menyediakan formulir untuk:
- Nama lengkap.
- Nomor identitas yang diperlukan.
- Tempat dan tanggal lahir.
- Jenis kelamin, jika diperlukan berdasarkan aturan resmi.
- Alamat.
- Nomor telepon.
- Tinggi badan.
- Berat badan.
- Pendidikan terakhir.
- Nama institusi pendidikan.
- Jurusan atau program studi.
- Tahun kelulusan.
- Nilai rapor atau IPK.
- Dokumen pendukung yang dipersyaratkan.

Sistem harus melakukan validasi format, tipe data, dan kelengkapan input.

Data sensitif tidak boleh ditampilkan kepada pengguna yang tidak memiliki kewenangan.

### FR-03: Manajemen Jalur Penerimaan
Sistem harus mendukung jalur:
- Tamtama.
- Bintara.
- Perwira Prajurit Karier.

Setiap jalur memiliki konfigurasi:
- Kualifikasi pendidikan.
- Batas usia.
- Tinggi badan minimum.
- Persyaratan fisik lain yang berlaku.
- Ketentuan nilai atau kompetensi.
- Periode pendaftaran.
- Status aktif atau tidak aktif.

Nilai persyaratan harus dapat dikelola administrator tanpa mengubah source code.

**Catatan:** Angka persyaratan harus mengikuti pengumuman resmi untuk setiap jalur dan periode. Nilai dalam dokumen kajian merupakan gambaran awal dan tidak otomatis dianggap sebagai ketentuan penerimaan yang berlaku.

### FR-04: Pemeriksaan Persyaratan Awal
Sistem harus memeriksa:
- Kelengkapan data wajib.
- Rentang usia berdasarkan tanggal lahir dan tanggal acuan seleksi.
- Persyaratan pendidikan.
- Persyaratan tinggi badan.
- Kriteria tambahan sesuai jalur yang dipilih.

Status hasil pemeriksaan:
- `incomplete`: data belum lengkap.
- `eligible`: memenuhi kriteria awal.
- `not_eligible`: terdapat kriteria wajib yang tidak terpenuhi.
- `needs_review`: memerlukan pemeriksaan manual.

Sistem harus menjelaskan kriteria yang belum terpenuhi dan memberikan arahan perbaikan jika memungkinkan.

Ketidaklayakan awal untuk satu jalur tidak boleh otomatis menghapus akun atau menutup kemungkinan calon peserta mendaftar melalui jalur lain.

### FR-05: Manajemen Dokumen
Sistem harus menyediakan:
- Unggah dokumen.
- Validasi format dan ukuran file.
- Status dokumen: menunggu pemeriksaan, terverifikasi, atau perlu perbaikan.
- Catatan pemeriksaan oleh panitia.
- Riwayat perubahan status.

File harus disimpan pada penyimpanan privat. Akses menggunakan mekanisme otorisasi dan signed URL dengan masa berlaku terbatas.

### FR-06: Pre-Test Digital
Sistem harus menyediakan tes awal yang terdiri dari:

**A. Kemampuan Numerik**
- Matematika dasar.
- Deret angka.
- Kecepatan perhitungan.
- Logika numerik.

**B. Kemampuan Verbal**
- Pemahaman bacaan.
- Analogi kata.
- Pemahaman instruksi.
- Kemampuan komunikasi dasar.

**C. Penalaran Logis**
- Pola logika.
- Penalaran analitis.
- Penyelesaian masalah.

Fitur pre-test:
- Daftar soal dan pilihan jawaban.
- Timer pengerjaan.
- Navigasi antarsoal.
- Penyimpanan jawaban sementara.
- Pengiriman jawaban.
- Penguncian pengerjaan setelah waktu habis.
- Penghitungan skor otomatis.
- Penyimpanan hasil dan waktu pengerjaan.

Soal, jawaban benar, bobot, dan aturan penilaian tidak boleh dikirimkan ke frontend sebelum diperlukan.

### FR-07: Penilaian Pre-Test
Sistem menghitung:
- Skor numerik.
- Skor verbal.
- Skor penalaran logis.
- Skor total.
- Persentase jawaban benar.
- Durasi pengerjaan.

Skor harus dihitung di backend.

Rumus dasar:

`Skor Total = Total Poin yang Diperoleh / Total Poin Maksimal × 100`

Jika bobot antarkomponen berbeda, sistem harus menggunakan konfigurasi bobot yang disimpan di database.

### FR-08: Mesin Rekomendasi Jalur
Sistem menghasilkan rekomendasi awal berdasarkan:
- Kualifikasi pendidikan.
- Usia.
- Tinggi badan.
- Persyaratan wajib jalur.
- Skor numerik.
- Skor verbal.
- Skor penalaran logis.
- Kriteria tambahan yang telah ditetapkan.

Tahapan rekomendasi:
1. Periksa persyaratan wajib setiap jalur.
2. Keluarkan jalur yang tidak memenuhi persyaratan wajib dari daftar kandidat rekomendasi.
3. Hitung skor asesmen.
4. Terapkan aturan rekomendasi yang telah disahkan.
5. Tampilkan jalur yang sesuai beserta alasan dan kriteria yang mendasarinya.
6. Jika data tidak lengkap atau aturan belum memadai, tampilkan status memerlukan evaluasi manual.

Output rekomendasi:
- Jalur yang direkomendasikan.
- Status kelayakan awal.
- Skor asesmen.
- Faktor yang mendukung rekomendasi.
- Faktor yang belum terpenuhi.
- Waktu pembuatan rekomendasi.

Rekomendasi bersifat pendukung dan bukan keputusan kelulusan resmi.

Batas skor, bobot, dan aturan rekomendasi harus dapat dikonfigurasi serta disetujui oleh pihak berwenang. Jangan mengasumsikan bahwa skor tinggi otomatis berarti layak menjadi Perwira atau skor rendah otomatis berarti layak menjadi Tamtama.

### FR-09: Dashboard Calon Peserta
Dashboard menampilkan:
- Status profil.
- Status kelengkapan dokumen.
- Status pemeriksaan persyaratan awal.
- Status pre-test.
- Riwayat asesmen.
- Hasil skor.
- Rekomendasi jalur.
- Catatan perbaikan.
- Notifikasi terbaru.

### FR-10: Dashboard Panitia
Dashboard menampilkan:
- Jumlah calon peserta terdaftar.
- Jumlah peserta per jalur.
- Jumlah data belum lengkap.
- Jumlah peserta menunggu verifikasi.
- Jumlah peserta yang memenuhi persyaratan awal.
- Jumlah peserta yang memerlukan pemeriksaan manual.
- Distribusi hasil pre-test.
- Ringkasan rekomendasi jalur.

Panitia dapat mencari, memfilter, membuka detail, dan memperbarui status peserta sesuai kewenangan.

### FR-11: Manajemen Soal
Administrator dapat:
- Membuat dan mengubah soal.
- Menetapkan kategori soal.
- Menetapkan tingkat kesulitan.
- Mengatur pilihan jawaban.
- Menetapkan kunci jawaban.
- Menetapkan bobot skor.
- Mengaktifkan atau menonaktifkan soal.
- Mengelola paket tes dan durasi.

Perubahan soal tidak boleh mengubah hasil tes yang sudah selesai. Setiap pengerjaan harus terhubung dengan versi paket soal yang digunakan.

### FR-12: Pelaporan
Sistem harus menyediakan:
- Daftar calon peserta.
- Status administrasi.
- Rekap hasil pre-test.
- Distribusi rekomendasi jalur.
- Riwayat verifikasi.
- Ekspor CSV untuk pengguna berwenang.

Ekspor harus mengikuti hak akses dan mencatat aktivitas ekspor pada audit log.

### FR-13: Notifikasi
Sistem menyediakan notifikasi dalam aplikasi untuk:
- Registrasi berhasil.
- Profil belum lengkap.
- Dokumen perlu diperbaiki.
- Jadwal pre-test.
- Pre-test selesai.
- Hasil asesmen tersedia.
- Perubahan status verifikasi.

### FR-14: Audit Log
Sistem mencatat aktivitas penting, antara lain:
- Login dan kegagalan autentikasi yang relevan.
- Perubahan data penting.
- Perubahan konfigurasi persyaratan.
- Perubahan status verifikasi.
- Perubahan soal.
- Pembuatan rekomendasi.
- Ekspor data.

Audit log harus mencatat pelaku, tindakan, objek yang terpengaruh, waktu, dan metadata yang diperlukan tanpa menyimpan kata sandi, token rahasia, atau data sensitif yang tidak diperlukan.

---

## 6. KEBUTUHAN NONFUNGSIONAL

### NFR-01: Keamanan
- Seluruh koneksi menggunakan HTTPS.
- Validasi input dilakukan di backend.
- Password ditangani oleh Supabase Auth.
- Secret dan service role key disimpan pada environment variable server.
- Service role key tidak boleh dikirim ke browser.
- Endpoint dilindungi autentikasi dan otorisasi.
- Terapkan rate limiting pada login dan endpoint sensitif.
- Terapkan validasi file dan pembatasan ukuran unggahan.
- Terapkan prinsip least privilege.
- Gunakan Row Level Security (RLS) pada tabel yang terekspos melalui Supabase API.
- Jangan mengandalkan validasi frontend sebagai mekanisme keamanan.

### NFR-02: Kinerja
Target awal MVP:
- Endpoint umum memiliki target respons p95 di bawah 2 detik pada beban normal.
- Pagination digunakan pada daftar data berukuran besar.
- Query database menggunakan indeks yang sesuai.
- Perhitungan skor tidak boleh bergantung pada proses frontend.

Target tersebut harus divalidasi melalui pengujian, bukan dianggap sebagai hasil yang sudah tercapai.

### NFR-03: Ketersediaan dan Reliabilitas
- Penanganan error terpusat.
- Logging error tanpa membocorkan informasi sensitif.
- Validasi dan transaksi database untuk operasi yang saling bergantung.
- Mekanisme backup dan pemulihan mengikuti kemampuan serta konfigurasi layanan yang digunakan.

### NFR-04: Usability
- Antarmuka responsif pada desktop, tablet, dan ponsel.
- Formulir memiliki validasi dan pesan kesalahan yang jelas.
- Status proses menggunakan label yang konsisten.
- Bahasa antarmuka menggunakan Bahasa Indonesia.

### NFR-05: Privasi
- Data pribadi hanya dikumpulkan sesuai kebutuhan dan tujuan pemrosesan.
- Pengguna mendapatkan informasi mengenai penggunaan datanya.
- Akses data dibatasi berdasarkan role.
- Retensi dan penghapusan data mengikuti kebijakan yang disetujui.
- Data hasil asesmen tidak boleh dipublikasikan tanpa dasar dan kewenangan yang sesuai.

---

## 7. TEKNOLOGI DAN ARSITEKTUR

### 7.1 Backend
- Node.js LTS.
- Express.js.
- JavaScript ES Modules atau TypeScript.
- Supabase JavaScript Client.
- Zod untuk validasi request.
- Helmet untuk HTTP security headers.
- CORS dengan allowlist origin.
- Express Rate Limit untuk pembatasan request.
- Pino atau Winston untuk logging.
- Jest atau Vitest untuk unit testing.
- Supertest untuk integration testing.

### 7.2 Database dan Layanan Supabase
- Supabase PostgreSQL sebagai database utama.
- Supabase Auth untuk autentikasi.
- Supabase Storage untuk dokumen privat.
- Row Level Security untuk perlindungan data.
- Database migration untuk pengelolaan skema.

### 7.3 Frontend
Frontend merupakan aplikasi web terpisah yang berkomunikasi dengan backend Express melalui REST API. Teknologi frontend dapat menggunakan React, Next.js, atau teknologi lain yang dipilih pada tahap implementasi.

### 7.4 Prinsip Arsitektur
1. Frontend tidak mengakses fungsi sensitif secara langsung.
2. Backend Express menangani validasi bisnis dan proses rekomendasi.
3. Supabase menyimpan data utama.
4. Supabase Auth menangani identitas pengguna.
5. Backend memverifikasi identitas dan role pengguna pada endpoint terlindungi.
6. Seluruh operasi sensitif menerapkan otorisasi.
7. Kunci service role hanya digunakan di lingkungan server.
8. Rekomendasi dapat ditelusuri berdasarkan data, aturan, dan versi konfigurasi yang digunakan.

### 7.5 Alur Request
1. Pengguna login melalui Supabase Auth.
2. Frontend memperoleh access token.
3. Frontend mengirim request ke Express dengan bearer token.
4. Middleware backend memverifikasi token.
5. Middleware memeriksa role dan hak akses.
6. Controller memvalidasi input.
7. Service menjalankan logika bisnis.
8. Repository atau Supabase client berinteraksi dengan database.
9. Backend mengembalikan respons JSON.
10. Aktivitas penting dicatat dalam audit log.

---

## 8. STRUKTUR DATABASE SUPABASE

Gunakan UUID sebagai primary key untuk tabel utama. Sertakan `created_at` dan `updated_at` pada tabel yang memerlukan riwayat perubahan.

### 8.1 profiles
Menyimpan profil aplikasi pengguna.

Kolom:
- `id`: UUID, primary key, referensi ke `auth.users.id`.
- `full_name`: TEXT.
- `phone`: TEXT.
- `role`: TEXT, default `candidate`.
- `created_at`: TIMESTAMPTZ.
- `updated_at`: TIMESTAMPTZ.

Role harus divalidasi di backend dan tidak boleh dapat dinaikkan sendiri oleh calon peserta.

### 8.2 recruitment_periods
Menyimpan periode pendaftaran.

Kolom:
- `id`: UUID, primary key.
- `name`: TEXT.
- `start_date`: DATE.
- `end_date`: DATE.
- `status`: TEXT, misalnya `draft`, `open`, `closed`.
- `created_at`: TIMESTAMPTZ.
- `updated_at`: TIMESTAMPTZ.

### 8.3 recruitment_paths
Menyimpan konfigurasi jalur penerimaan.

Kolom:
- `id`: UUID, primary key.
- `code`: TEXT, unique, misalnya `TAMTAMA`, `BINTARA`, `PERWIRA_PA_PK`.
- `name`: TEXT.
- `education_rules`: JSONB.
- `min_age`: INTEGER, nullable sesuai kebijakan.
- `max_age`: INTEGER, nullable sesuai kebijakan.
- `min_height_male_cm`: NUMERIC, nullable.
- `min_height_female_cm`: NUMERIC, nullable.
- `additional_rules`: JSONB.
- `active`: BOOLEAN.
- `created_at`: TIMESTAMPTZ.
- `updated_at`: TIMESTAMPTZ.

Nilai aturan harus memiliki versi dan masa berlaku agar perubahan kebijakan tidak mengubah evaluasi historis secara diam-diam.

### 8.4 candidate_applications
Menyimpan pengajuan pendaftaran calon peserta.

Kolom:
- `id`: UUID, primary key.
- `candidate_id`: UUID, referensi ke `profiles.id`.
- `period_id`: UUID, referensi ke `recruitment_periods.id`.
- `selected_path_id`: UUID, referensi ke `recruitment_paths.id`, nullable.
- `application_number`: TEXT, unique.
- `date_of_birth`: DATE.
- `place_of_birth`: TEXT.
- `gender`: TEXT, nullable sesuai kebutuhan.
- `address`: TEXT.
- `height_cm`: NUMERIC.
- `weight_kg`: NUMERIC.
- `education_level`: TEXT.
- `institution_name`: TEXT.
- `major`: TEXT.
- `graduation_year`: INTEGER.
- `academic_score`: NUMERIC.
- `eligibility_status`: TEXT.
- `application_status`: TEXT.
- `submitted_at`: TIMESTAMPTZ, nullable.
- `created_at`: TIMESTAMPTZ.
- `updated_at`: TIMESTAMPTZ.

NIK atau identitas nasional lain hanya ditambahkan jika memang diperlukan dan telah ditetapkan sebagai bagian dari proses resmi.

### 8.5 candidate_documents
Menyimpan metadata dokumen.

Kolom:
- `id`: UUID, primary key.
- `application_id`: UUID, referensi ke `candidate_applications.id`.
- `document_type`: TEXT.
- `storage_path`: TEXT.
- `mime_type`: TEXT.
- `file_size`: BIGINT.
- `verification_status`: TEXT.
- `reviewed_by`: UUID, nullable.
- `review_notes`: TEXT, nullable.
- `reviewed_at`: TIMESTAMPTZ, nullable.
- `created_at`: TIMESTAMPTZ.

File disimpan di Supabase Storage, bukan sebagai binary dalam tabel PostgreSQL.

### 8.6 test_categories
Menyimpan kategori asesmen.

Kolom:
- `id`: UUID, primary key.
- `code`: TEXT, unique.
- `name`: TEXT.
- `description`: TEXT.
- `active`: BOOLEAN.
- `created_at`: TIMESTAMPTZ.

Kategori awal:
- Numerik.
- Verbal.
- Penalaran logis.

### 8.7 test_questions
Menyimpan soal pre-test.

Kolom:
- `id`: UUID, primary key.
- `category_id`: UUID, referensi ke `test_categories.id`.
- `question_text`: TEXT.
- `question_type`: TEXT.
- `options`: JSONB.
- `correct_answer`: JSONB atau kolom privat terpisah.
- `difficulty`: TEXT.
- `score_weight`: NUMERIC.
- `active`: BOOLEAN.
- `version`: INTEGER.
- `created_at`: TIMESTAMPTZ.
- `updated_at`: TIMESTAMPTZ.

Kunci jawaban tidak boleh dapat dibaca oleh calon peserta melalui endpoint publik.

### 8.8 test_packages
Menyimpan paket dan konfigurasi tes.

Kolom:
- `id`: UUID, primary key.
- `name`: TEXT.
- `duration_minutes`: INTEGER.
- `question_count`: INTEGER.
- `scoring_config`: JSONB.
- `version`: INTEGER.
- `active`: BOOLEAN.
- `created_at`: TIMESTAMPTZ.

### 8.9 test_package_questions
Relasi antara paket tes dan soal.

Kolom:
- `test_package_id`: UUID, referensi ke `test_packages.id`.
- `question_id`: UUID, referensi ke `test_questions.id`.
- `question_order`: INTEGER.

Primary key gabungan: `test_package_id`, `question_id`.

### 8.10 test_attempts
Menyimpan pengerjaan pre-test.

Kolom:
- `id`: UUID, primary key.
- `application_id`: UUID, referensi ke `candidate_applications.id`.
- `test_package_id`: UUID, referensi ke `test_packages.id`.
- `status`: TEXT.
- `started_at`: TIMESTAMPTZ.
- `submitted_at`: TIMESTAMPTZ, nullable.
- `expires_at`: TIMESTAMPTZ.
- `score_total`: NUMERIC, nullable.
- `score_numeric`: NUMERIC, nullable.
- `score_verbal`: NUMERIC, nullable.
- `score_reasoning`: NUMERIC, nullable.
- `scoring_details`: JSONB, nullable.
- `created_at`: TIMESTAMPTZ.

Batasi pengerjaan ulang berdasarkan kebijakan tes yang telah disahkan.

### 8.11 test_answers
Menyimpan jawaban peserta.

Kolom:
- `id`: UUID, primary key.
- `attempt_id`: UUID, referensi ke `test_attempts.id`.
- `question_id`: UUID, referensi ke `test_questions.id`.
- `answer`: JSONB.
- `is_correct`: BOOLEAN, nullable sampai proses penilaian.
- `score_awarded`: NUMERIC, nullable sampai proses penilaian.
- `answered_at`: TIMESTAMPTZ.
- `created_at`: TIMESTAMPTZ.
- `updated_at`: TIMESTAMPTZ.

Tambahkan unique constraint pada kombinasi `attempt_id` dan `question_id`.

### 8.12 eligibility_evaluations
Menyimpan hasil pemeriksaan kelayakan awal.

Kolom:
- `id`: UUID, primary key.
- `application_id`: UUID, referensi ke `candidate_applications.id`.
- `path_id`: UUID, referensi ke `recruitment_paths.id`.
- `rule_version`: TEXT.
- `status`: TEXT.
- `failed_rules`: JSONB.
- `evaluation_details`: JSONB.
- `evaluated_at`: TIMESTAMPTZ.

### 8.13 recommendations
Menyimpan rekomendasi jalur.

Kolom:
- `id`: UUID, primary key.
- `application_id`: UUID, referensi ke `candidate_applications.id`.
- `test_attempt_id`: UUID, referensi ke `test_attempts.id`.
- `recommended_path_id`: UUID, referensi ke `recruitment_paths.id`, nullable.
- `recommendation_status`: TEXT.
- `score_snapshot`: JSONB.
- `reasoning_summary`: JSONB.
- `rule_version`: TEXT.
- `reviewed_by`: UUID, nullable.
- `review_status`: TEXT.
- `review_notes`: TEXT, nullable.
- `created_at`: TIMESTAMPTZ.

Simpan snapshot skor dan versi aturan yang digunakan agar hasil lama tetap dapat diaudit.

### 8.14 notifications
Menyimpan notifikasi pengguna.

Kolom:
- `id`: UUID, primary key.
- `user_id`: UUID, referensi ke `profiles.id`.
- `title`: TEXT.
- `message`: TEXT.
- `type`: TEXT.
- `read_at`: TIMESTAMPTZ, nullable.
- `created_at`: TIMESTAMPTZ.

### 8.15 audit_logs
Menyimpan jejak aktivitas.

Kolom:
- `id`: UUID, primary key.
- `actor_id`: UUID, nullable.
- `action`: TEXT.
- `entity_type`: TEXT.
- `entity_id`: UUID, nullable.
- `metadata`: JSONB.
- `created_at`: TIMESTAMPTZ.

Batasi akses baca dan perubahan audit log hanya untuk pihak yang berwenang.

---

## 9. DESAIN REST API EXPRESS.JS

Prefix API: `/api/v1`

Semua endpoint privat harus memerlukan access token yang valid dan otorisasi yang sesuai.

### 9.1 Authentication
- `POST /auth/register` — membuat akun.
- `POST /auth/login` — login melalui Supabase Auth jika alur autentikasi ditangani backend.
- `POST /auth/logout` — logout.
- `POST /auth/refresh` — memperbarui sesi jika didukung oleh rancangan autentikasi.
- `GET /auth/me` — mengambil identitas dan profil pengguna.

Implementasi harus memilih satu alur autentikasi yang konsisten. Jangan membuat mekanisme password sendiri apabila menggunakan Supabase Auth.

### 9.2 Candidate
- `GET /candidates/me` — melihat profil.
- `PUT /candidates/me` — memperbarui profil.
- `GET /applications/me` — melihat daftar pendaftaran.
- `POST /applications` — membuat pengajuan pendaftaran.
- `GET /applications/:id` — melihat detail pendaftaran milik pengguna atau yang diizinkan.
- `PUT /applications/:id` — memperbarui data yang masih dapat diedit.
- `POST /applications/:id/submit` — mengajukan pendaftaran.

### 9.3 Documents
- `POST /applications/:id/documents` — mendaftarkan atau mengunggah dokumen.
- `GET /applications/:id/documents` — melihat dokumen yang berhak diakses.
- `DELETE /documents/:id` — menghapus dokumen jika kebijakan mengizinkan.

### 9.4 Eligibility
- `POST /applications/:id/evaluate-eligibility` — menghitung ulang kelayakan awal.
- `GET /applications/:id/eligibility` — melihat hasil pemeriksaan.

### 9.5 Tests
- `GET /tests/available` — melihat tes yang tersedia.
- `POST /tests/:packageId/attempts` — memulai tes.
- `GET /attempts/:attemptId` — mengambil status dan soal yang boleh ditampilkan.
- `PUT /attempts/:attemptId/answers/:questionId` — menyimpan jawaban.
- `POST /attempts/:attemptId/submit` — menyelesaikan tes.
- `GET /attempts/:attemptId/result` — melihat hasil jika telah dirilis.

Backend harus memverifikasi pemilik attempt, batas waktu, status tes, dan aturan pengerjaan ulang.

### 9.6 Recommendations
- `GET /applications/:id/recommendation` — melihat rekomendasi.
- `POST /applications/:id/generate-recommendation` — menghasilkan rekomendasi jika persyaratan terpenuhi.

### 9.7 Admin
- `GET /admin/dashboard` — statistik dashboard.
- `GET /admin/applications` — daftar calon peserta dengan pagination dan filter.
- `GET /admin/applications/:id` — detail calon peserta.
- `PATCH /admin/applications/:id/status` — memperbarui status.
- `PATCH /admin/documents/:id/verification` — memperbarui hasil verifikasi.
- `GET /admin/reports` — membuat laporan.
- `GET /admin/audit-logs` — membaca audit log sesuai kewenangan.

### 9.8 Configuration
- `GET /admin/recruitment-paths` — melihat konfigurasi jalur.
- `POST /admin/recruitment-paths` — membuat konfigurasi.
- `PATCH /admin/recruitment-paths/:id` — memperbarui konfigurasi.
- `GET /admin/test-questions` — melihat daftar soal.
- `POST /admin/test-questions` — membuat soal.
- `PATCH /admin/test-questions/:id` — memperbarui soal.

### 9.9 Format Respons API
Respons sukses menggunakan format konsisten:

{
  "success": true,
  "message": "Data berhasil diproses",
  "data": {}
}

Respons gagal:

{
  "success": false,
  "message": "Permintaan tidak dapat diproses",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}

Jangan mengembalikan stack trace, query internal, kunci rahasia, atau informasi sensitif kepada pengguna.

---

## 10. ATURAN BISNIS

### BR-01: Validasi Jalur
Setiap jalur mempunyai kriteria masing-masing yang disimpan dalam konfigurasi berversi.

### BR-02: Pemeriksaan Administrasi
Data yang tidak lengkap harus menghasilkan status belum lengkap, bukan otomatis dinyatakan gagal seleksi.

### BR-03: Kelayakan Awal
Kegagalan pada satu persyaratan wajib dapat menyebabkan jalur tersebut tidak memenuhi kelayakan awal, sesuai konfigurasi resmi yang berlaku.

### BR-04: Skoring
Skor dihitung pada backend dengan menggunakan konfigurasi bobot yang berlaku ketika tes dimulai.

### BR-05: Integritas Tes
Jawaban yang sudah diserahkan tidak boleh diubah melalui endpoint biasa. Koreksi administratif harus melalui prosedur khusus dan tercatat.

### BR-06: Rekomendasi
Rekomendasi tidak sama dengan keputusan kelulusan resmi dan harus disertai penjelasan yang dapat ditinjau.

### BR-07: Perubahan Aturan
Perubahan aturan tidak boleh mengubah hasil historis tanpa proses evaluasi ulang yang eksplisit dan tercatat.

### BR-08: Pemisahan Hak Akses
Calon peserta hanya dapat melihat dan mengubah data miliknya yang masih dapat diedit. Panitia hanya dapat mengakses data sesuai tugasnya. Administrator memiliki hak konfigurasi berdasarkan kebijakan akses.

---

## 11. KEAMANAN DATABASE DAN SUPABASE

Implementasi wajib mencakup:
1. RLS pada tabel yang dapat diakses melalui Supabase API.
2. Kebijakan agar calon peserta hanya dapat membaca data miliknya.
3. Pembatasan perubahan role hanya untuk proses administratif tepercaya.
4. Pembatasan akses dokumen menggunakan storage policy.
5. Pemisahan data publik dan data sensitif.
6. Penggunaan environment variable untuk konfigurasi rahasia.
7. Validasi token pada endpoint backend.
8. Validasi role dari sumber tepercaya, bukan dari request body.
9. Penggunaan query terparameterisasi melalui Supabase client.
10. Pencatatan aktivitas administratif.
11. Pembatasan akses terhadap kunci jawaban.
12. Pembatasan percobaan login dan pengiriman tes.

Jika backend menggunakan Supabase service role key, semua pemeriksaan otorisasi harus dilakukan dengan benar di backend karena key tersebut dapat melewati RLS. Jangan pernah mengekspos key tersebut ke frontend.

---

## 12. UI/UX DAN HALAMAN APLIKASI

### Halaman Publik
- Landing page.
- Informasi sistem dan alur pendaftaran.
- Informasi jalur penerimaan.
- Login.
- Registrasi.
- Reset kata sandi.

### Halaman Calon Peserta
- Dashboard.
- Profil pribadi.
- Formulir pendaftaran.
- Unggah dokumen.
- Pemeriksaan kelayakan awal.
- Halaman pre-test.
- Halaman hasil tes.
- Halaman rekomendasi.
- Notifikasi.
- Riwayat aktivitas yang relevan.

### Halaman Panitia
- Dashboard monitoring.
- Daftar calon peserta.
- Detail peserta.
- Verifikasi dokumen.
- Detail hasil pre-test.
- Evaluasi rekomendasi.
- Riwayat verifikasi.
- Laporan.

### Halaman Administrator
- Manajemen pengguna dan role.
- Manajemen periode penerimaan.
- Manajemen jalur.
- Manajemen kriteria.
- Manajemen paket tes.
- Manajemen soal.
- Manajemen konfigurasi skor.
- Audit log.
- Pengaturan sistem.

### Arahan Desain
- Gunakan tampilan profesional dengan nuansa hijau tua, putih, dan aksen emas.
- Gunakan layout dashboard yang rapi dan konsisten.
- Tampilkan status melalui badge dan indikator yang jelas.
- Gunakan tabel dengan pencarian, filter, pagination, dan tampilan detail.
- Optimalkan tampilan mobile.
- Jangan menggunakan logo, lambang, atau identitas resmi institusi tanpa izin.

---

## 13. ACCEPTANCE CRITERIA

MVP dianggap memenuhi kebutuhan awal apabila:

1. Pengguna dapat melakukan registrasi, verifikasi email, login, dan logout.
2. Pengguna dapat melengkapi dan memperbarui profilnya.
3. Sistem dapat menyimpan data pendaftaran ke Supabase.
4. Sistem dapat memeriksa kelengkapan dan kriteria awal berdasarkan konfigurasi.
5. Sistem dapat menampilkan alasan ketika suatu kriteria belum terpenuhi.
6. Pengguna dapat mengunggah dokumen melalui penyimpanan privat.
7. Panitia dapat memeriksa dokumen dan mengubah status verifikasi.
8. Pengguna dapat memulai dan menyelesaikan pre-test.
9. Jawaban dan hasil tes tersimpan dengan benar.
10. Sistem dapat menghitung skor secara konsisten di backend.
11. Sistem dapat menghasilkan rekomendasi sesuai aturan yang dikonfigurasi.
12. Hasil rekomendasi menyimpan versi aturan dan snapshot skor.
13. Dashboard menampilkan data sesuai role.
14. Calon peserta tidak dapat mengakses data peserta lain.
15. Calon peserta tidak dapat melihat kunci jawaban.
16. Endpoint administratif menolak pengguna tanpa izin.
17. Aktivitas sensitif tercatat dalam audit log.
18. Pengujian endpoint utama dan kontrol akses berhasil.
19. Aplikasi memiliki dokumentasi konfigurasi dan cara menjalankan proyek.
20. Tidak ada secret yang tersimpan di repository atau frontend.

---

## 14. STRUKTUR FOLDER BACKEND

Gunakan struktur modular berikut:

src/
- app.js
- server.js
- config/
  - env.js
  - supabase.js
- routes/
  - auth.routes.js
  - candidate.routes.js
  - application.routes.js
  - document.routes.js
  - eligibility.routes.js
  - test.routes.js
  - recommendation.routes.js
  - admin.routes.js
- controllers/
  - auth.controller.js
  - candidate.controller.js
  - application.controller.js
  - document.controller.js
  - eligibility.controller.js
  - test.controller.js
  - recommendation.controller.js
  - admin.controller.js
- services/
  - auth.service.js
  - application.service.js
  - document.service.js
  - eligibility.service.js
  - scoring.service.js
  - recommendation.service.js
  - notification.service.js
- repositories/
  - application.repository.js
  - test.repository.js
  - recommendation.repository.js
- middleware/
  - authenticate.js
  - authorize.js
  - validate.js
  - error-handler.js
  - rate-limit.js
- schemas/
  - application.schema.js
  - test.schema.js
  - recommendation.schema.js
- utils/
  - api-response.js
  - date.js
  - logger.js
- tests/
  - unit/
  - integration/
- migrations/
- docs/
  - api.md
  - setup.md
- .env.example
- .gitignore
- package.json
- README.md

Struktur dapat disesuaikan dengan kebutuhan implementasi, tetapi pemisahan route, controller, service, dan akses data harus tetap jelas.

---

## 15. ENVIRONMENT VARIABLES

Sediakan `.env.example` dengan variabel:

NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

Ketentuan:
- Jangan memasukkan nilai rahasia asli ke file `.env.example`.
- Jangan commit file `.env` ke Git.
- Gunakan key sesuai alur autentikasi yang dipilih.
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh tersedia di server dan hanya digunakan jika memang dibutuhkan.
- Validasi environment variable saat aplikasi mulai berjalan.

---

## 16. TESTING

### Unit Test
- Validasi tanggal lahir dan usia.
- Validasi persyaratan pendidikan.
- Validasi tinggi badan.
- Penghitungan skor.
- Evaluasi kelayakan awal.
- Mesin rekomendasi.
- Validasi status pengerjaan tes.

### Integration Test
- Registrasi dan login.
- Penyimpanan profil.
- Pengajuan pendaftaran.
- Unggah dan verifikasi dokumen.
- Pengerjaan dan pengumpulan tes.
- Penyimpanan skor.
- Pembuatan rekomendasi.
- Pembatasan akses berdasarkan role.

### Security Test
- Akses data pengguna lain.
- Eskalasi role tanpa izin.
- Akses kunci jawaban.
- Penggunaan token tidak valid.
- Akses endpoint administratif.
- Manipulasi skor dari frontend.
- Akses dokumen privat tanpa otorisasi.
- Penyalahgunaan endpoint melalui request berulang.

---

## 17. METRIK KEBERHASILAN MVP

Metrik awal yang perlu dipantau:
- Persentase pendaftaran yang berhasil diselesaikan.
- Persentase profil yang lengkap.
- Persentase dokumen yang telah diverifikasi.
- Persentase pre-test yang berhasil diselesaikan.
- Waktu rata-rata proses verifikasi.
- Waktu respons API.
- Jumlah error aplikasi.
- Jumlah temuan keamanan.
- Konsistensi hasil perhitungan skor.
- Persentase rekomendasi yang dapat ditinjau dan dijelaskan.

Target kuantitatif ditetapkan setelah tersedia baseline dan hasil pengujian.

---

## 18. TAHAPAN IMPLEMENTASI

### Fase 1 — Fondasi
- Inisialisasi Express.js.
- Konfigurasi Supabase.
- Autentikasi dan middleware otorisasi.
- Database migration.
- Logging dan error handling.

### Fase 2 — Pendaftaran
- Profil calon peserta.
- Formulir pendaftaran.
- Konfigurasi jalur.
- Validasi persyaratan awal.
- Pengelolaan dokumen.

### Fase 3 — Pre-Test
- Manajemen kategori dan soal.
- Paket tes.
- Timer dan penyimpanan jawaban.
- Penilaian otomatis.
- Riwayat pengerjaan.

### Fase 4 — Rekomendasi
- Mesin aturan.
- Penghitungan skor.
- Penjelasan rekomendasi.
- Penyimpanan hasil dan versi aturan.
- Evaluasi manual oleh panitia.

### Fase 5 — Dashboard dan Pelaporan
- Dashboard calon peserta.
- Dashboard panitia.
- Manajemen pengguna.
- Laporan dan ekspor.
- Audit log.

### Fase 6 — Pengujian dan Deployment
- Unit dan integration testing.
- Pengujian kontrol akses.
- Pengujian beban.
- Deployment backend dan frontend.
- Konfigurasi environment production.
- Dokumentasi operasional.

---

## 19. RISIKO DAN MITIGASI

### Risiko 1: Kriteria penerimaan berubah
Mitigasi: Simpan aturan dengan versi dan periode berlaku.

### Risiko 2: Data pribadi bocor
Mitigasi: Terapkan RLS, otorisasi backend, storage privat, dan audit log.

### Risiko 3: Rekomendasi tidak akurat
Mitigasi: Gunakan aturan yang telah disahkan, lakukan validasi hasil, dan sediakan evaluasi manual.

### Risiko 4: Bias dalam sistem penilaian
Mitigasi: Evaluasi hasil berdasarkan kelompok yang relevan secara sah, dokumentasikan kriteria, dan hindari penggunaan variabel yang tidak memiliki dasar penilaian yang sah.

### Risiko 5: Integrasi eksternal tidak tersedia
Mitigasi: Sediakan status verifikasi manual dan desain adapter integrasi yang dapat diaktifkan setelah akses resmi tersedia.

### Risiko 6: Manipulasi hasil tes
Mitigasi: Hitung skor di backend, simpan jawaban dan waktu pengerjaan, serta batasi perubahan setelah tes selesai.

### Risiko 7: Penggunaan data historis yang tidak memadai
Mitigasi: Jangan mengklaim model AI memiliki akurasi yang tervalidasi sebelum tersedia dataset yang sah, representatif, dan telah diuji.

---

## 20. ASUMSI DAN KEPUTUSAN YANG MASIH DIPERLUKAN

Sebelum implementasi production, tentukan:
1. Ketentuan resmi untuk setiap jalur dan periode.
2. Definisi skor, bobot, dan ambang rekomendasi.
3. Jumlah soal dan durasi pre-test.
4. Apakah calon peserta dapat mengulang tes.
5. Dokumen wajib untuk masing-masing jalur.
6. Role dan kewenangan setiap jenis panitia.
7. Kebijakan retensi serta penghapusan data.
8. Mekanisme verifikasi eksternal.
9. Infrastruktur deployment dan strategi backup.
10. Apakah AI akan berupa rule-based recommendation pada MVP atau model machine learning pada fase lanjutan.

---

## 21. DEFINISI SELESAI (DEFINITION OF DONE)

Satu fitur dinyatakan selesai jika:
- Implementasi mengikuti requirement yang relevan.
- Validasi backend telah tersedia.
- Hak akses telah diuji.
- Error ditangani secara konsisten.
- Unit test dan integration test yang relevan lulus.
- Tidak ada secret di source code.
- Dokumentasi API dan konfigurasi diperbarui.
- Perubahan database disertai migration.
- Hasil akhir dapat diverifikasi melalui acceptance criteria.

---

## PENUTUP

Sistem Penerimaan Prajurit Terintegrasi Berbasis AI bertujuan membantu proses awal penerimaan melalui integrasi administrasi, asesmen digital, pemetaan potensi, dan rekomendasi jalur.

Express.js digunakan sebagai backend untuk logika bisnis dan REST API, sedangkan Supabase menyediakan PostgreSQL, autentikasi, dan penyimpanan dokumen. Sistem dirancang modular, aman, dapat diaudit, dan dapat dikembangkan secara bertahap.

Seluruh rekomendasi yang dihasilkan sistem merupakan dukungan analitis untuk proses seleksi. Keputusan penerimaan akhir tetap mengikuti ketentuan dan kewenangan resmi yang berlaku.
