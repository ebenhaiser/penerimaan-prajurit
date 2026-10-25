import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedData } from '../src/config/seed-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Menyinkronkan Data Awal (Seeds) ke Supabase ---');

  // 1. Periods
  const { data: pData, error: pErr } = await supabase
    .from('recruitment_periods')
    .upsert(seedData.periods, { onConflict: 'id' });
  console.log('Recruitment Periods:', pErr ? `Error: ${pErr.message}` : 'Berhasil disinkronkan');

  // 2. Paths
  const { data: pathData, error: pathErr } = await supabase
    .from('recruitment_paths')
    .upsert(seedData.paths, { onConflict: 'id' });
  console.log('Recruitment Paths:', pathErr ? `Error: ${pathErr.message}` : 'Berhasil disinkronkan');

  // 3. Categories
  const { data: catData, error: catErr } = await supabase
    .from('test_categories')
    .upsert(seedData.categories, { onConflict: 'id' });
  console.log('Test Categories:', catErr ? `Error: ${catErr.message}` : 'Berhasil disinkronkan');

  // 4. Packages
  const { data: pkgData, error: pkgErr } = await supabase
    .from('test_packages')
    .upsert(seedData.packages, { onConflict: 'id' });
  console.log('Test Packages:', pkgErr ? `Error: ${pkgErr.message}` : 'Berhasil disinkronkan');

  // 5. Questions
  const questionsToInsert = seedData.questions.map(q => ({
    id: q.id,
    category_id: q.category_id,
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    correct_answer: q.correct_answer,
    difficulty: q.difficulty,
    score_weight: q.score_weight,
    active: q.active,
    version: q.version
  }));

  const { data: qData, error: qErr } = await supabase
    .from('test_questions')
    .upsert(questionsToInsert, { onConflict: 'id' });
  console.log('Test Questions (15 butir):', qErr ? `Error: ${qErr.message}` : 'Berhasil disinkronkan');

  // 6. Test Package Questions Join
  const joins = seedData.questions.map((q, idx) => ({
    test_package_id: 'd0000000-0000-0000-0000-000000000001',
    question_id: q.id,
    question_order: idx + 1
  }));

  const { data: jData, error: jErr } = await supabase
    .from('test_package_questions')
    .upsert(joins, { onConflict: 'test_package_id,question_id' });
  console.log('Test Package Questions Join:', jErr ? `Error: ${jErr.message}` : 'Berhasil disinkronkan');

  console.log('--- Sinkronisasi Selesai ---');
}

seed().catch(console.error);
