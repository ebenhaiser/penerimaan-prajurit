import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config } from './config/env.js';
import { store } from './config/store.js';
import { errorHandler } from './middleware/error-handler.js';
import { apiLimiter } from './middleware/rate-limit.js';

import adminRoutes from './routes/admin.routes.js';
import applicationRoutes from './routes/application.routes.js';
import authRoutes from './routes/auth.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import documentRoutes from './routes/document.routes.js';
import eligibilityRoutes from './routes/eligibility.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import testRoutes from './routes/test.routes.js';
import { errorResponse, successResponse } from './utils/api-response.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all standard API routes
app.use('/api', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  return successResponse(res, 'Sistem Penerimaan Prajurit API Operasional', {
    status: 'UP',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: config.isSupabaseConfigured ? 'Supabase Live' : 'Standalone Persistent Store'
  });
});

// Public General Information (Recruitment paths, active periods)
app.get('/api/v1/public/info', (req, res) => {
  return successResponse(res, 'Informasi seleksi berhasil diambil.', {
    periods: store.periods.filter(p => p.status === 'open'),
    paths: store.paths.filter(p => p.active).map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      education_rules: p.education_rules,
      min_age: p.min_age,
      max_age: p.max_age,
      min_height_male_cm: p.min_height_male_cm,
      min_height_female_cm: p.min_height_female_cm,
      additional_rules: p.additional_rules
    }))
  });
});

// Register Modular REST Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1', documentRoutes);
app.use('/api/v1', eligibilityRoutes);
app.use('/api/v1', testRoutes);
app.use('/api/v1', recommendationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 404 Handler
app.use((req, res) => {
  return errorResponse(res, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`, 'NOT_FOUND', [], 404);
});

// Central Error Handler
app.use(errorHandler);

export default app;
