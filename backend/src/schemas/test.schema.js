import { z } from 'zod';

export const saveAnswerSchema = z.object({
  answer: z.any({ required_error: 'Jawaban harus disertakan' })
});

export const startAttemptSchema = z.object({
  application_id: z.string().min(1, 'ID pendaftaran wajib diisi')
});
