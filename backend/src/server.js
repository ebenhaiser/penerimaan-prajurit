import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(` SISTEM PENERIMAAN PRAJURIT TERINTEGRASI BERBASIS AI `);
  logger.info(` Server aktif pada port http://localhost:${PORT}        `);
  logger.info(` Mode: ${config.env.toUpperCase()}                     `);
  logger.info(` Supabase Status: ${config.isSupabaseConfigured ? 'CONNECTED' : 'STANDALONE SEEDED REPOSITORY'} `);
  logger.info(`=======================================================`);
});

process.on('SIGTERM', () => {
  logger.info('Menerima sinyal SIGTERM. Menutup server dengan aman...');
  server.close(() => {
    logger.info('Server berhasil ditutup.');
    process.exit(0);
  });
});
