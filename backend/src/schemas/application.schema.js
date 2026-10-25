import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter').max(100),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').max(15).optional()
});

export const createApplicationSchema = z.object({
  period_id: z.string().min(1, 'Periode pendaftaran wajib dipilih'),
  selected_path_id: z.string().optional().nullable(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir harus YYYY-MM-DD').optional().nullable(),
  place_of_birth: z.string().min(2, 'Tempat lahir minimal 2 karakter').optional().nullable(),
  gender: z.enum(['male', 'female'], { message: 'Jenis kelamin harus male atau female' }).optional().nullable(),
  address: z.string().min(5, 'Alamat minimal 5 karakter').optional().nullable(),
  height_cm: z.number().min(140, 'Tinggi badan minimal 140 cm').max(220, 'Tinggi badan maksimal 220 cm').optional().nullable(),
  weight_kg: z.number().min(35, 'Berat badan minimal 35 kg').max(150, 'Berat badan maksimal 150 kg').optional().nullable(),
  education_level: z.string().min(2, 'Tingkat pendidikan wajib diisi').optional().nullable(),
  institution_name: z.string().min(2, 'Nama sekolah/universitas wajib diisi').optional().nullable(),
  major: z.string().optional().nullable(),
  graduation_year: z.number().int().min(2000).max(2030).optional().nullable(),
  academic_score: z.number().min(0).max(100).optional().nullable()
});

export const updateApplicationSchema = createApplicationSchema.partial();
