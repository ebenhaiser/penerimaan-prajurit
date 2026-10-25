import bcrypt from 'bcryptjs';

const defaultHash = bcrypt.hashSync('Prajurit2026!', 10);
const adminHash = bcrypt.hashSync('Admin2026!', 10);
const committeeHash = bcrypt.hashSync('Panitia2026!', 10);

export const seedData = {
  users: [
    {
      id: 'u0000000-0000-0000-0000-000000000001',
      email: 'candidate@tni.mil.id',
      passwordHash: defaultHash,
      full_name: 'Ahmad Rizky Pratama',
      phone: '081234567890',
      role: 'candidate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'u0000000-0000-0000-0000-000000000002',
      email: 'committee@tni.mil.id',
      passwordHash: committeeHash,
      full_name: 'Mayor Inf. Bambang Suryono',
      phone: '081298765432',
      role: 'committee',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'u0000000-0000-0000-0000-000000000003',
      email: 'admin@tni.mil.id',
      passwordHash: adminHash,
      full_name: 'Letkol Chb. Hendra Wibowo',
      phone: '081311223344',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  periods: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Penerimaan Prajurit TNI TA 2026 Gelombang I',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  paths: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      code: 'TAMTAMA',
      name: 'Tamtama PK TNI',
      education_rules: ['SMP', 'SMA', 'SMK', 'MA'],
      min_age: 17,
      max_age: 22,
      min_height_male_cm: 163,
      min_height_female_cm: 157,
      additional_rules: {
        min_academic_score: 6.0,
        description: 'Jalur penerimaan prajurit golongan tamtama untuk lulusan minimal SMP/sederajat.'
      },
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      code: 'BINTARA',
      name: 'Bintara PK TNI',
      education_rules: ['SMA', 'SMK', 'MA', 'D3'],
      min_age: 17,
      max_age: 22,
      min_height_male_cm: 163,
      min_height_female_cm: 157,
      additional_rules: {
        min_academic_score: 6.5,
        description: 'Jalur penerimaan prajurit golongan bintara untuk lulusan SMA/SMK sederajat dan diploma.'
      },
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      code: 'PERWIRA_PA_PK',
      name: 'Perwira Prajurit Karier (Pa PK) TNI',
      education_rules: ['D4', 'S1', 'S1_PROFESI', 'S2'],
      min_age: 18,
      max_age: 28,
      min_height_male_cm: 163,
      min_height_female_cm: 157,
      additional_rules: {
        min_academic_score: 2.8,
        description: 'Jalur penerimaan perwira karier untuk sarjana/diploma 4 ke atas dengan keahlian khusus.'
      },
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  categories: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      code: 'NUMERIK',
      name: 'Kemampuan Numerik',
      description: 'Matematika dasar, deret angka, perhitungan cepat, logika numerik',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      code: 'VERBAL',
      name: 'Kemampuan Verbal',
      description: 'Analogi kata, sinonim/antonim, pemahaman bacaan dan instruksi militer',
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      code: 'PENALARAN_LOGIS',
      name: 'Penalaran Logis & Analitis',
      description: 'Pola logika, silogisme, penalaran analitis, ketahanan berpikir terstruktur',
      active: true,
      created_at: new Date().toISOString()
    }
  ],
  questions: [
    // Numerik (5 Soal)
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      category_id: 'c0000000-0000-0000-0000-000000000001',
      category_code: 'NUMERIK',
      question_text: 'Tentukan angka lanjutan dari deret berikut: 3, 6, 12, 24, 48, ...',
      question_type: 'multiple_choice',
      options: [
        { id: 'A', text: '72' },
        { id: 'B', text: '96' },
        { id: 'C', text: '84' },
        { id: 'D', text: '108' }
      ],
      correct_answer: 'B',
      difficulty: 'easy',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      category_id: 'c0000000-0000-0000-0000-000000000001',
      category_code: 'NUMERIK',
      question_text: 'Sebuah kompi beranggotakan 120 personel membutuhkan logistik beras sebanyak 36 kg per hari. Jika personel bertambah menjadi 150 personel, berapa kg beras yang dibutuhkan per hari?',
      options: [
        { id: 'A', text: '42 kg' },
        { id: 'B', text: '45 kg' },
        { id: 'C', text: '48 kg' },
        { id: 'D', text: '50 kg' }
      ],
      correct_answer: 'B',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      category_id: 'c0000000-0000-0000-0000-000000000001',
      category_code: 'NUMERIK',
      question_text: 'Tentukan dua angka selanjutnya dari deret: 5, 8, 12, 17, 23, ..., ...',
      options: [
        { id: 'A', text: '29, 36' },
        { id: 'B', text: '30, 38' },
        { id: 'C', text: '30, 37' },
        { id: 'D', text: '31, 39' }
      ],
      correct_answer: 'B',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      category_id: 'c0000000-0000-0000-0000-000000000001',
      category_code: 'NUMERIK',
      question_text: 'Kecepatan konvoi kendaraan taktis adalah 60 km/jam. Jika jarak ke pos depan adalah 180 km dan konvoi berangkat pukul 06.30 WIB, pukul berapa konvoi tiba jika sempat istirahat 30 menit?',
      options: [
        { id: 'A', text: '09.30 WIB' },
        { id: 'B', text: '10.00 WIB' },
        { id: 'C', text: '10.30 WIB' },
        { id: 'D', text: '11.00 WIB' }
      ],
      correct_answer: 'B',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000005',
      category_id: 'c0000000-0000-0000-0000-000000000001',
      category_code: 'NUMERIK',
      question_text: 'Jika 4 orang prajurit dapat mendirikan sebuah tenda peleton dalam waktu 45 menit, berapa menit waktu yang diperlukan jika dikerjakan oleh 6 orang prajurit dengan kecepatan kerja yang sama?',
      options: [
        { id: 'A', text: '25 menit' },
        { id: 'B', text: '30 menit' },
        { id: 'C', text: '35 menit' },
        { id: 'D', text: '28 menit' }
      ],
      correct_answer: 'B',
      difficulty: 'hard',
      score_weight: 1.0,
      active: true,
      version: 1
    },

    // Verbal (5 Soal)
    {
      id: 'e0000000-0000-0000-0000-000000000006',
      category_id: 'c0000000-0000-0000-0000-000000000002',
      category_code: 'VERBAL',
      question_text: 'PRAJURIT : DISIPLIN = ILMUWAN : ...',
      options: [
        { id: 'A', text: 'Laboratorium' },
        { id: 'B', text: 'Ketelitian' },
        { id: 'C', text: 'Gelar' },
        { id: 'D', text: 'Buku' }
      ],
      correct_answer: 'B',
      difficulty: 'easy',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000007',
      category_id: 'c0000000-0000-0000-0000-000000000002',
      category_code: 'VERBAL',
      question_text: 'Sinonim yang paling tepat untuk kata "MILITAN" adalah...',
      options: [
        { id: 'A', text: 'Tangguh dan bersemangat tinggi' },
        { id: 'B', text: 'Keras kepala' },
        { id: 'C', text: 'Berhati dingin' },
        { id: 'D', text: 'Bersenjata berat' }
      ],
      correct_answer: 'A',
      difficulty: 'easy',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000008',
      category_id: 'c0000000-0000-0000-0000-000000000002',
      category_code: 'VERBAL',
      question_text: 'Antonim (lawan kata) yang tepat untuk kata "OTORITER" adalah...',
      options: [
        { id: 'A', text: 'Monarki' },
        { id: 'B', text: 'Demokratis' },
        { id: 'C', text: 'Diktator' },
        { id: 'D', text: 'Skeptis' }
      ],
      correct_answer: 'B',
      difficulty: 'easy',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000009',
      category_id: 'c0000000-0000-0000-0000-000000000002',
      category_code: 'VERBAL',
      question_text: 'NAVIGASI : KOMPAS = KOMUNIKASI : ...',
      options: [
        { id: 'A', text: 'Satelit Radio' },
        { id: 'B', text: 'Surat' },
        { id: 'C', text: 'Antena' },
        { id: 'D', text: 'Bahasa' }
      ],
      correct_answer: 'A',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000010',
      category_id: 'c0000000-0000-0000-0000-000000000002',
      category_code: 'VERBAL',
      question_text: 'Bacalah instruksi: "Setiap laporan intelijen harus terverifikasi minimal dari dua sumber independen sebelum diteruskan ke pos komando." Kesimpulan yang paling logis adalah...',
      options: [
        { id: 'A', text: 'Satu sumber intelijen sudah mencukupi jika mendesak.' },
        { id: 'B', text: 'Laporan dari sumber tunggal tidak boleh langsung diteruskan tanpa verifikasi lanjutan.' },
        { id: 'C', text: 'Pos komando tidak menerima laporan apapun.' },
        { id: 'D', text: 'Sumber intelijen tidak perlu independen.' }
      ],
      correct_answer: 'B',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },

    // Penalaran Logis (5 Soal)
    {
      id: 'e0000000-0000-0000-0000-000000000011',
      category_id: 'c0000000-0000-0000-0000-000000000003',
      category_code: 'PENALARAN_LOGIS',
      question_text: 'Semua prajurit harus memiliki ketahanan fisik yang prima. Budi adalah seorang prajurit. Kesimpulan yang sah adalah...',
      options: [
        { id: 'A', text: 'Budi belum tentu memiliki fisik prima.' },
        { id: 'B', text: 'Budi harus memiliki ketahanan fisik yang prima.' },
        { id: 'C', text: 'Orang yang memiliki fisik prima pasti prajurit.' },
        { id: 'D', text: 'Budi adalah komandan peleton.' }
      ],
      correct_answer: 'B',
      difficulty: 'easy',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000012',
      category_id: 'c0000000-0000-0000-0000-000000000003',
      category_code: 'PENALARAN_LOGIS',
      question_text: 'Semua kendaraan tempur memiliki lapis baja. Beberapa kendaraan angkut pasukan adalah kendaraan tempur. Maka kesimpulannya...',
      options: [
        { id: 'A', text: 'Semua kendaraan angkut pasukan memiliki lapis baja.' },
        { id: 'B', text: 'Beberapa kendaraan angkut pasukan memiliki lapis baja.' },
        { id: 'C', text: 'Tidak ada kendaraan angkut pasukan yang berlapis baja.' },
        { id: 'D', text: 'Kendaraan berlapis baja tidak digunakan untuk angkut pasukan.' }
      ],
      correct_answer: 'B',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000013',
      category_id: 'c0000000-0000-0000-0000-000000000003',
      category_code: 'PENALARAN_LOGIS',
      question_text: 'Prajurit A lebih tinggi dari B. Prajurit C lebih tinggi dari A. Prajurit D tidak lebih tinggi dari B. Siapakah yang paling tinggi di antara mereka?',
      options: [
        { id: 'A', text: 'Prajurit A' },
        { id: 'B', text: 'Prajurit B' },
        { id: 'C', text: 'Prajurit C' },
        { id: 'D', text: 'Prajurit D' }
      ],
      correct_answer: 'C',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000014',
      category_id: 'c0000000-0000-0000-0000-000000000003',
      category_code: 'PENALARAN_LOGIS',
      question_text: 'Jika cuaca berkabut tebal, helikopter patroli dilarang lepas landas. Pagi ini helikopter patroli lepas landas. Kesimpulan yang pasti benar adalah...',
      options: [
        { id: 'A', text: 'Cuaca tidak berkabut tebal.' },
        { id: 'B', text: 'Cuaca hujan deras.' },
        { id: 'C', text: 'Pilot melanggar perintah.' },
        { id: 'D', text: 'Misi dibatalkan.' }
      ],
      correct_answer: 'A',
      difficulty: 'medium',
      score_weight: 1.0,
      active: true,
      version: 1
    },
    {
      id: 'e0000000-0000-0000-0000-000000000015',
      category_id: 'c0000000-0000-0000-0000-000000000003',
      category_code: 'PENALARAN_LOGIS',
      question_text: 'Dalam strategi pertahanan, jika Pos Timur diserang maka Pos Barat harus mengirim bantuan. Pos Barat tidak mengirim bantuan. Maka kesimpulannya...',
      options: [
        { id: 'A', text: 'Pos Barat kekurangan personel.' },
        { id: 'B', text: 'Pos Timur tidak diserang.' },
        { id: 'C', text: 'Pos Timur telah jatuh ke musuh.' },
        { id: 'D', text: 'Pos Utara yang diserang.' }
      ],
      correct_answer: 'B',
      difficulty: 'hard',
      score_weight: 1.0,
      active: true,
      version: 1
    }
  ],
  packages: [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      name: 'Paket Pre-Test Asesmen Potensi Calon Prajurit TA 2026',
      duration_minutes: 45,
      question_count: 15,
      scoring_config: {
        numeric_weight: 0.35,
        verbal_weight: 0.35,
        reasoning_weight: 0.30
      },
      version: 1,
      active: true,
      created_at: new Date().toISOString()
    }
  ],
  applications: [
    {
      id: 'app-00000000-0000-0000-0000-000000000001',
      candidate_id: 'u0000000-0000-0000-0000-000000000001',
      period_id: 'a0000000-0000-0000-0000-000000000001',
      selected_path_id: 'b0000000-0000-0000-0000-000000000002', // Bintara
      application_number: 'REG-2026-00129',
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
      eligibility_status: 'eligible',
      application_status: 'submitted',
      submitted_at: '2026-02-10T08:30:00.000Z',
      created_at: '2026-02-01T10:00:00.000Z',
      updated_at: '2026-02-10T08:30:00.000Z'
    }
  ],
  documents: [
    {
      id: 'doc-00000000-0000-0000-0000-000000000001',
      application_id: 'app-00000000-0000-0000-0000-000000000001',
      document_type: 'KTP',
      storage_path: '/uploads/ktp_ahmad_rizky.pdf',
      mime_type: 'application/pdf',
      file_size: 142050,
      verification_status: 'verified',
      reviewed_by: 'u0000000-0000-0000-0000-000000000002',
      review_notes: 'NIK dan data identitas terbaca jelas sesuai pendaftaran.',
      reviewed_at: '2026-02-11T09:00:00.000Z',
      created_at: '2026-02-05T11:00:00.000Z'
    },
    {
      id: 'doc-00000000-0000-0000-0000-000000000002',
      application_id: 'app-00000000-0000-0000-0000-000000000001',
      document_type: 'IJAZAH',
      storage_path: '/uploads/ijazah_ahmad_rizky.pdf',
      mime_type: 'application/pdf',
      file_size: 285400,
      verification_status: 'verified',
      reviewed_by: 'u0000000-0000-0000-0000-000000000002',
      review_notes: 'Ijazah SMA IPA legalisir sah, nilai rata-rata 8.4.',
      reviewed_at: '2026-02-11T09:05:00.000Z',
      created_at: '2026-02-05T11:05:00.000Z'
    },
    {
      id: 'doc-00000000-0000-0000-0000-000000000003',
      application_id: 'app-00000000-0000-0000-0000-000000000001',
      document_type: 'SKCK',
      storage_path: '/uploads/skck_ahmad_rizky.pdf',
      mime_type: 'application/pdf',
      file_size: 198200,
      verification_status: 'pending',
      reviewed_by: null,
      review_notes: null,
      reviewed_at: null,
      created_at: '2026-02-05T11:10:00.000Z'
    }
  ],
  notifications: [
    {
      id: 'notif-00000000-0000-0000-0000-000000000001',
      user_id: 'u0000000-0000-0000-0000-000000000001',
      title: 'Pendaftaran Diterima',
      message: 'Pengajuan berkas Anda untuk nomor REG-2026-00129 telah berhasil diterima dan siap diverifikasi.',
      type: 'success',
      read_at: '2026-02-10T09:00:00.000Z',
      created_at: '2026-02-10T08:31:00.000Z'
    },
    {
      id: 'notif-00000000-0000-0000-0000-000000000002',
      user_id: 'u0000000-0000-0000-0000-000000000001',
      title: 'Jadwal Pre-Test Asesmen',
      message: 'Anda dapat mengikuti modul Pre-Test Asesmen Potensi Digital sekarang.',
      type: 'info',
      read_at: null,
      created_at: '2026-02-10T08:35:00.000Z'
    }
  ],
  auditLogs: [
    {
      id: 'log-00000000-0000-0000-0000-000000000001',
      actor_id: 'u0000000-0000-0000-0000-000000000001',
      action: 'APPLICATION_SUBMITTED',
      entity_type: 'candidate_applications',
      entity_id: 'app-00000000-0000-0000-0000-000000000001',
      metadata: { application_number: 'REG-2026-00129', selected_path: 'BINTARA' },
      created_at: '2026-02-10T08:30:00.000Z'
    },
    {
      id: 'log-00000000-0000-0000-0000-000000000002',
      actor_id: 'u0000000-0000-0000-0000-000000000002',
      action: 'DOCUMENT_VERIFIED',
      entity_type: 'candidate_documents',
      entity_id: 'doc-00000000-0000-0000-0000-000000000001',
      metadata: { document_type: 'KTP', status: 'verified' },
      created_at: '2026-02-11T09:00:00.000Z'
    }
  ]
};
