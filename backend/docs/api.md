# DOKUMENTASI REST API
# SISTEM PENERIMAAN PRAJURIT TERINTEGRASI BERBASIS AI

Prefix URL: `/api/v1`

---

## 1. Autentikasi (`/auth`)

### POST `/auth/register`
Mendaftarkan akun calon prajurit baru.
**Body:**
```json
{
  "email": "calon@example.com",
  "password": "Password123!",
  "full_name": "Calon Prajurit Satu",
  "phone": "081234567890"
}
```

### POST `/auth/login`
Autentikasi kredensial pengguna.
**Body:**
```json
{
  "email": "candidate@tni.mil.id",
  "password": "Prajurit2026!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "u0000000-...",
      "email": "candidate@tni.mil.id",
      "full_name": "Ahmad Rizky Pratama",
      "role": "candidate"
    }
  }
}
```

### GET `/auth/me`
Mengambil data profil sesi pengguna aktif (Header: `Authorization: Bearer <token>`).

---

## 2. Pendaftaran (`/applications`)

### GET `/applications/me`
Mengambil seluruh pendaftaran milik calon peserta aktif.

### POST `/applications`
Membuat pengajuan pendaftaran baru.

### GET `/applications/:id`
Mengambil detail pendaftaran.

### PUT `/applications/:id`
Memperbarui data pendaftaran yang masih berstatus `draft`.

### POST `/applications/:id/submit`
Mengirim berkas pendaftaran untuk verifikasi lanjutan.

---

## 3. Kelayakan Awal (`/applications/:id/eligibility`)

### GET `/applications/:id/eligibility`
Mendapatkan hasil evaluasi kelayakan saat ini dan perbandingan di seluruh jalur (Tamtama, Bintara, Perwira).

### POST `/applications/:id/evaluate-eligibility`
Menghitung ulang kelayakan berdasarkan perubahan data fisik atau akademik.

---

## 4. Pre-Test Digital (`/tests` & `/attempts`)

### GET `/tests/available`
Melihat paket tes aktif.

### POST `/tests/:packageId/attempts`
Memulai sesi pengerjaan tes baru (timer diaktifkan di backend).

### GET `/attempts/:attemptId`
Mengambil daftar soal aktif dan status timer (kunci jawaban disembunyikan untuk calon peserta).

### PUT `/attempts/:attemptId/answers/:questionId`
Menyimpan pilihan jawaban secara sementara.

### POST `/attempts/:attemptId/submit`
Menyerahkan tes untuk dinilai secara otomatis di backend.

### GET `/attempts/:attemptId/result`
Melihat hasil skor numerik, verbal, penalaran logis, dan total skor.

---

## 5. Rekomendasi Jalur Berbasis AI (`/applications/:id/recommendation`)

### GET `/applications/:id/recommendation`
Melihat rekomendasi jalur, snapshot skor, faktor pendukung, dan evaluasi manual.

### POST `/applications/:id/generate-recommendation`
Menghasilkan rekomendasi baru berdasarkan data profil & hasil asesmen terbaru.

---

## 6. Panel Panitia & Administrator (`/admin`)

- `GET /admin/dashboard` : Statistik agregat & distribusi calon peserta.
- `GET /admin/applications` : Daftar pelamar dengan pencarian, filter jalur, dan pagination.
- `GET /admin/applications/:id` : Detail pelamar, riwayat dokumen, tes, dan rekomendasi.
- `PATCH /admin/applications/:id/status` : Mengubah status berkas (submitted / verified / rejected).
- `PATCH /admin/documents/:id/verification` : Memverifikasi dokumen (verified / needs_correction) + catatan.
- `POST /admin/recommendations/:id/review` : Menyetujui atau menyesuaikan jalur rekomendasi panitia.
- `GET /admin/reports` : Rekapitulasi pelamar untuk ekspor data.
- `GET /admin/audit-logs` : Jejak audit aktivitas seluruh pengguna.
