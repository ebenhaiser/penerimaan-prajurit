import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let supabaseClient = null;
let supabaseAdmin = null;

if (config.isSupabaseConfigured) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
    logger.info('Supabase client initialized successfully.');

    if (config.supabaseServiceRoleKey) {
      supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      logger.info('Supabase service role admin client initialized.');
    }
  } catch (error) {
    logger.error('Failed to initialize Supabase client:', error);
  }
} else {
  logger.warn('Supabase credentials not fully configured. Utilizing integrated persistent store repository for standalone execution.');
}

export { supabaseClient, supabaseAdmin };
