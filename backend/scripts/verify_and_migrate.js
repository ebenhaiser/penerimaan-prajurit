import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://mxkrolutqintnbeigdzx.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_L-je31KQd2ISMHAnOnY_lg_YVxc8Lp7';

const REQUIRED_TABLES = [
  'profiles',
  'recruitment_periods',
  'recruitment_paths',
  'candidate_applications',
  'candidate_documents',
  'test_categories',
  'test_questions',
  'test_packages',
  'test_package_questions',
  'test_attempts',
  'test_answers',
  'eligibility_evaluations',
  'recommendations',
  'notifications',
  'audit_logs'
];

async function main() {
  console.log('====================================================================');
  console.log(' SISTEM PENERIMAAN PRAJURIT - VERIFIKASI SKEMA SUPABASE');
  console.log(' URL:', supabaseUrl);
  console.log('====================================================================');

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('\n[1/2] Memeriksa status keberadaan 15 tabel PRD di database...');
  const tableStatus = {};
  let existingCount = 0;

  for (const table of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
          tableStatus[table] = { exists: false, error: 'Belum dibuat di database' };
        } else {
          // Table exists but RLS blocks unauthenticated access
          tableStatus[table] = { exists: true, note: `Tabel ada (RLS aktif: ${error.code})` };
          existingCount++;
        }
      } else {
        tableStatus[table] = { exists: true, rows: data ? data.length : 0 };
        existingCount++;
      }
    } catch (e) {
      tableStatus[table] = { exists: false, error: e.message };
    }
  }

  console.table(
    Object.entries(tableStatus).map(([t, s]) => ({
      'Nama Tabel': t,
      'Status': s.exists ? '✓ SUDAH ADA' : '✗ BELUM ADA',
      'Keterangan': s.rows !== undefined ? `${s.rows} baris data` : (s.note || s.error)
    }))
  );

  console.log(`\nHasil: ${existingCount} dari ${REQUIRED_TABLES.length} tabel terdeteksi di Supabase.`);

  if (existingCount < REQUIRED_TABLES.length) {
    console.log('\n[2/2] PANDUAN EKSEKUSI MIGRASI:');
    console.log('Karena Supabase REST API menggunakan Publishable / Anon Key (PostgREST), operasi DDL (CREATE TABLE/INDEX/RLS) memerlukan hak akses administratif.');
    console.log('\nLangkah eksekusi ke Supabase:');
    console.log('1. Buka dashboard proyek Supabase Anda:');
    console.log(`   https://supabase.com/dashboard/project/mxkrolutqintnbeigdzx/sql`);
    console.log('2. Buka menu "SQL Editor" -> Klik "New query".');
    console.log('3. Buka file skrip migrasi yang telah kami siapkan di:');
    console.log(`   backend/migrations/init.sql`);
    console.log('4. Salin seluruh isi file dan tempelkan di SQL Editor Supabase, lalu klik "Run".');
    console.log('5. Jalankan kembali script verifikasi ini: node scripts/verify_and_migrate.js');
  } else {
    console.log('\n✓ Seluruh 15 tabel telah terverifikasi aktif di Supabase!');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
