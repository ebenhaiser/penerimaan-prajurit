import { z } from 'zod';

export const reviewRecommendationSchema = z.object({
  review_status: z.enum(['approved', 'adjusted'], { message: 'Status review harus approved atau adjusted' }),
  recommended_path_id: z.string().optional(),
  review_notes: z.string().min(3, 'Catatan panitia minimal 3 karakter')
});
