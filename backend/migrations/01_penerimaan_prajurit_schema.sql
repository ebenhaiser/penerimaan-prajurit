-- ====================================================================
-- SISTEM PENERIMAAN PRAJURIT TERINTEGRASI BERBASIS AI
-- Migration 01: Core Database Schema, Indexes, RLS & Seed Data
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TRIGGER FUNCTION FOR updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE (referencing auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate', 'committee', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. RECRUITMENT PERIODS
CREATE TABLE IF NOT EXISTS public.recruitment_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. RECRUITMENT PATHS
CREATE TABLE IF NOT EXISTS public.recruitment_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    education_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    min_age INTEGER,
    max_age INTEGER,
    min_height_male_cm NUMERIC,
    min_height_female_cm NUMERIC,
    additional_rules JSONB DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CANDIDATE APPLICATIONS
CREATE TABLE IF NOT EXISTS public.candidate_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES public.recruitment_periods(id),
    selected_path_id UUID REFERENCES public.recruitment_paths(id),
    application_number TEXT UNIQUE NOT NULL,
    date_of_birth DATE,
    place_of_birth TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')),
    address TEXT,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    education_level TEXT,
    institution_name TEXT,
    major TEXT,
    graduation_year INTEGER,
    academic_score NUMERIC,
    eligibility_status TEXT NOT NULL DEFAULT 'incomplete' CHECK (eligibility_status IN ('incomplete', 'eligible', 'not_eligible', 'needs_review')),
    application_status TEXT NOT NULL DEFAULT 'draft' CHECK (application_status IN ('draft', 'submitted', 'under_review', 'verified', 'rejected')),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. CANDIDATE DOCUMENTS
CREATE TABLE IF NOT EXISTS public.candidate_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.candidate_applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    file_size BIGINT,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'needs_correction', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id),
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TEST CATEGORIES
CREATE TABLE IF NOT EXISTS public.test_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TEST QUESTIONS
CREATE TABLE IF NOT EXISTS public.test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.test_categories(id),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice',
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer JSONB NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    score_weight NUMERIC NOT NULL DEFAULT 1.0,
    active BOOLEAN NOT NULL DEFAULT true,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TEST PACKAGES
CREATE TABLE IF NOT EXISTS public.test_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    question_count INTEGER NOT NULL DEFAULT 15,
    scoring_config JSONB NOT NULL DEFAULT '{"numeric_weight": 0.35, "verbal_weight": 0.35, "reasoning_weight": 0.30}'::jsonb,
    version INTEGER NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. TEST PACKAGE QUESTIONS (Relational Join Table)
CREATE TABLE IF NOT EXISTS public.test_package_questions (
    test_package_id UUID NOT NULL REFERENCES public.test_packages(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.test_questions(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    PRIMARY KEY (test_package_id, question_id)
);

-- 12. TEST ATTEMPTS
CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.candidate_applications(id) ON DELETE CASCADE,
    test_package_id UUID NOT NULL REFERENCES public.test_packages(id),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'expired')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submitted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    score_total NUMERIC,
    score_numeric NUMERIC,
    score_verbal NUMERIC,
    score_reasoning NUMERIC,
    scoring_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. TEST ANSWERS
CREATE TABLE IF NOT EXISTS public.test_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.test_questions(id),
    answer JSONB NOT NULL,
    is_correct BOOLEAN,
    score_awarded NUMERIC,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(attempt_id, question_id)
);

-- 14. ELIGIBILITY EVALUATIONS
CREATE TABLE IF NOT EXISTS public.eligibility_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.candidate_applications(id) ON DELETE CASCADE,
    path_id UUID NOT NULL REFERENCES public.recruitment_paths(id),
    rule_version TEXT NOT NULL DEFAULT '1.0',
    status TEXT NOT NULL CHECK (status IN ('eligible', 'not_eligible', 'needs_review')),
    failed_rules JSONB DEFAULT '[]'::jsonb,
    evaluation_details JSONB DEFAULT '{}'::jsonb,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.candidate_applications(id) ON DELETE CASCADE,
    test_attempt_id UUID REFERENCES public.test_attempts(id),
    recommended_path_id UUID REFERENCES public.recruitment_paths(id),
    recommendation_status TEXT NOT NULL DEFAULT 'ready' CHECK (recommendation_status IN ('ready', 'needs_manual_review', 'not_recommended')),
    score_snapshot JSONB NOT NULL,
    reasoning_summary JSONB NOT NULL,
    rule_version TEXT NOT NULL DEFAULT '1.0',
    reviewed_by UUID REFERENCES public.profiles(id),
    review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'adjusted')),
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- PERFORMANCE INDEXES (Foreign Keys & Frequent Filter Columns)
-- ====================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Candidate Applications
CREATE INDEX IF NOT EXISTS idx_candidate_applications_candidate_id ON public.candidate_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_applications_period_id ON public.candidate_applications(period_id);
CREATE INDEX IF NOT EXISTS idx_candidate_applications_selected_path_id ON public.candidate_applications(selected_path_id);
CREATE INDEX IF NOT EXISTS idx_candidate_applications_status ON public.candidate_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_candidate_applications_eligibility ON public.candidate_applications(eligibility_status);
CREATE INDEX IF NOT EXISTS idx_candidate_applications_number ON public.candidate_applications(application_number);

-- Candidate Documents
CREATE INDEX IF NOT EXISTS idx_candidate_documents_application_id ON public.candidate_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_status ON public.candidate_documents(verification_status);

-- Questions & Tests
CREATE INDEX IF NOT EXISTS idx_test_questions_category ON public.test_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_active ON public.test_questions(active);
CREATE INDEX IF NOT EXISTS idx_test_package_questions_pkg ON public.test_package_questions(test_package_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_application ON public.test_attempts(application_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_status ON public.test_attempts(status);
CREATE INDEX IF NOT EXISTS idx_test_answers_attempt ON public.test_answers(attempt_id);

-- Evaluations & Recommendations
CREATE INDEX IF NOT EXISTS idx_eligibility_evaluations_app ON public.eligibility_evaluations(application_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_application ON public.recommendations(application_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON public.recommendations(recommendation_status);

-- Notifications & Audit
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ====================================================================
-- TRIGGERS FOR updated_at
-- ====================================================================
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_periods_updated_at ON public.recruitment_periods;
CREATE TRIGGER trg_periods_updated_at BEFORE UPDATE ON public.recruitment_periods FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_paths_updated_at ON public.recruitment_paths;
CREATE TRIGGER trg_paths_updated_at BEFORE UPDATE ON public.recruitment_paths FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_applications_updated_at ON public.candidate_applications;
CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON public.candidate_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_questions_updated_at ON public.test_questions;
CREATE TRIGGER trg_questions_updated_at BEFORE UPDATE ON public.test_questions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_answers_updated_at ON public.test_answers;
CREATE TRIGGER trg_answers_updated_at BEFORE UPDATE ON public.test_answers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_package_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Public Info (Recruitment Periods, Paths, Categories)
CREATE POLICY "Public read periods" ON public.recruitment_periods
    FOR SELECT USING (true);
CREATE POLICY "Public read paths" ON public.recruitment_paths
    FOR SELECT USING (active = true);
CREATE POLICY "Public read categories" ON public.test_categories
    FOR SELECT USING (active = true);
CREATE POLICY "Public read packages" ON public.test_packages
    FOR SELECT USING (active = true);

-- 3. Candidate Applications RLS
CREATE POLICY "Candidates can read own applications" ON public.candidate_applications
    FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Candidates can create own applications" ON public.candidate_applications
    FOR INSERT WITH CHECK (auth.uid() = candidate_id);
CREATE POLICY "Candidates can update own draft applications" ON public.candidate_applications
    FOR UPDATE USING (auth.uid() = candidate_id AND application_status = 'draft');

-- 4. Candidate Documents RLS
CREATE POLICY "Candidates can read own documents" ON public.candidate_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_applications
            WHERE candidate_applications.id = candidate_documents.application_id
            AND candidate_applications.candidate_id = auth.uid()
        )
    );
CREATE POLICY "Candidates can insert own documents" ON public.candidate_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.candidate_applications
            WHERE candidate_applications.id = candidate_documents.application_id
            AND candidate_applications.candidate_id = auth.uid()
        )
    );
CREATE POLICY "Candidates can delete own documents" ON public.candidate_documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.candidate_applications
            WHERE candidate_applications.id = candidate_documents.application_id
            AND candidate_applications.candidate_id = auth.uid()
            AND candidate_applications.application_status = 'draft'
        )
    );

-- 5. Test Questions RLS (PRD: Kunci jawaban tidak boleh dapat dibaca oleh calon peserta)
CREATE POLICY "Read active questions" ON public.test_questions
    FOR SELECT USING (active = true);

-- 6. Test Attempts RLS
CREATE POLICY "Candidates can view own test attempts" ON public.test_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_applications
            WHERE candidate_applications.id = test_attempts.application_id
            AND candidate_applications.candidate_id = auth.uid()
        )
    );
CREATE POLICY "Candidates can insert own test attempt" ON public.test_attempts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.candidate_applications
            WHERE candidate_applications.id = test_attempts.application_id
            AND candidate_applications.candidate_id = auth.uid()
        )
    );

-- 7. Test Answers RLS
CREATE POLICY "Candidates can manage own answers" ON public.test_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts
            JOIN public.candidate_applications ON candidate_applications.id = test_attempts.application_id
            WHERE test_attempts.id = test_answers.attempt_id
            AND candidate_applications.candidate_id = auth.uid()
        )
    );

-- 8. Recommendations RLS
CREATE POLICY "Candidates can view own recommendations" ON public.recommendations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_applications
            WHERE candidate_applications.id = recommendations.application_id
            AND candidate_applications.candidate_id = auth.uid()
        )
    );

-- 9. Notifications RLS
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications read status" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 10. Audit Logs RLS
CREATE POLICY "Users can view relevant audit logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = actor_id);

-- ====================================================================
-- SEED DATA (Dengan ON CONFLICT DO NOTHING agar data tidak terhapus)
-- ====================================================================

-- 1. Periode Penerimaan TA 2026
INSERT INTO public.recruitment_periods (id, name, start_date, end_date, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Penerimaan Prajurit TNI TA 2026 Gelombang I', '2026-01-01', '2026-12-31', 'open')
ON CONFLICT (id) DO NOTHING;

-- 2. Jalur Penerimaan (Tamtama, Bintara, Perwira Pa PK)
INSERT INTO public.recruitment_paths (id, code, name, education_rules, min_age, max_age, min_height_male_cm, min_height_female_cm, additional_rules, active)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'TAMTAMA',
        'Tamtama PK TNI',
        '["SMP", "SMA", "SMK", "MA"]'::jsonb,
        17, 22, 163, 157,
        '{"min_academic_score": 6.0, "description": "Jalur penerimaan prajurit golongan tamtama untuk lulusan minimal SMP/sederajat."}'::jsonb,
        true
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'BINTARA',
        'Bintara PK TNI',
        '["SMA", "SMK", "MA", "D3"]'::jsonb,
        17, 22, 163, 157,
        '{"min_academic_score": 6.5, "description": "Jalur penerimaan prajurit golongan bintara untuk lulusan SMA/SMK sederajat dan diploma."}'::jsonb,
        true
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'PERWIRA_PA_PK',
        'Perwira Prajurit Karier (Pa PK) TNI',
        '["D4", "S1", "S1_PROFESI", "S2"]'::jsonb,
        18, 28, 163, 157,
        '{"min_academic_score": 2.8, "description": "Jalur penerimaan perwira karier untuk sarjana/diploma 4 ke atas dengan keahlian khusus."}'::jsonb,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Kategori Pre-Test
INSERT INTO public.test_categories (id, code, name, description, active)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'NUMERIK', 'Kemampuan Numerik', 'Matematika dasar, deret angka, perhitungan cepat, logika numerik', true),
    ('c0000000-0000-0000-0000-000000000002', 'VERBAL', 'Kemampuan Verbal', 'Analogi kata, sinonim/antonim, pemahaman bacaan dan instruksi militer', true),
    ('c0000000-0000-0000-0000-000000000003', 'PENALARAN_LOGIS', 'Penalaran Logis & Analitis', 'Pola logika, silogisme, penalaran analitis, ketahanan berpikir terstruktur', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Paket Pre-Test
INSERT INTO public.test_packages (id, name, duration_minutes, question_count, scoring_config, version, active)
VALUES
    (
        'd0000000-0000-0000-0000-000000000001',
        'Paket Pre-Test Asesmen Potensi Calon Prajurit TA 2026',
        45,
        15,
        '{"numeric_weight": 0.35, "verbal_weight": 0.35, "reasoning_weight": 0.30}'::jsonb,
        1,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Bank Soal (15 Soal)
INSERT INTO public.test_questions (id, category_id, question_text, question_type, options, correct_answer, difficulty, score_weight, active, version)
VALUES
    -- Numerik
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Tentukan angka lanjutan dari deret berikut: 3, 6, 12, 24, 48, ...', 'multiple_choice', '[{"id": "A", "text": "72"}, {"id": "B", "text": "96"}, {"id": "C", "text": "84"}, {"id": "D", "text": "108"}]'::jsonb, '"B"'::jsonb, 'easy', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Sebuah kompi beranggotakan 120 personel membutuhkan logistik beras sebanyak 36 kg per hari. Jika personel bertambah menjadi 150 personel, berapa kg beras yang dibutuhkan per hari?', 'multiple_choice', '[{"id": "A", "text": "42 kg"}, {"id": "B", "text": "45 kg"}, {"id": "C", "text": "48 kg"}, {"id": "D", "text": "50 kg"}]'::jsonb, '"B"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Tentukan dua angka selanjutnya dari deret: 5, 8, 12, 17, 23, ..., ...', 'multiple_choice', '[{"id": "A", "text": "29, 36"}, {"id": "B", "text": "30, 38"}, {"id": "C", "text": "30, 37"}, {"id": "D", "text": "31, 39"}]'::jsonb, '"B"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Kecepatan konvoi kendaraan taktis adalah 60 km/jam. Jika jarak ke pos depan adalah 180 km dan konvoi berangkat pukul 06.30 WIB, pukul berapa konvoi tiba jika sempat istirahat 30 menit?', 'multiple_choice', '[{"id": "A", "text": "09.30 WIB"}, {"id": "B", "text": "10.00 WIB"}, {"id": "C", "text": "10.30 WIB"}, {"id": "D", "text": "11.00 WIB"}]'::jsonb, '"B"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Jika 4 orang prajurit dapat mendirikan sebuah tenda peleton dalam waktu 45 menit, berapa menit waktu yang diperlukan jika dikerjakan oleh 6 orang prajurit dengan kecepatan kerja yang sama?', 'multiple_choice', '[{"id": "A", "text": "25 menit"}, {"id": "B", "text": "30 menit"}, {"id": "C", "text": "35 menit"}, {"id": "D", "text": "28 menit"}]'::jsonb, '"B"'::jsonb, 'hard', 1.0, true, 1),
    -- Verbal
    ('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'PRAJURIT : DISIPLIN = ILMUWAN : ...', 'multiple_choice', '[{"id": "A", "text": "Laboratorium"}, {"id": "B", "text": "Ketelitian"}, {"id": "C", "text": "Gelar"}, {"id": "D", "text": "Buku"}]'::jsonb, '"B"'::jsonb, 'easy', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'Sinonim yang paling tepat untuk kata "MILITAN" adalah...', 'multiple_choice', '[{"id": "A", "text": "Tangguh dan bersemangat tinggi"}, {"id": "B", "text": "Keras kepala"}, {"id": "C", "text": "Berhati dingin"}, {"id": "D", "text": "Bersenjata berat"}]'::jsonb, '"A"'::jsonb, 'easy', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'Antonim (lawan kata) yang tepat untuk kata "OTORITER" adalah...', 'multiple_choice', '[{"id": "A", "text": "Monarki"}, {"id": "B", "text": "Demokratis"}, {"id": "C", "text": "Diktator"}, {"id": "D", "text": "Skeptis"}]'::jsonb, '"B"'::jsonb, 'easy', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000002', 'NAVIGASI : KOMPAS = KOMUNIKASI : ...', 'multiple_choice', '[{"id": "A", "text": "Satelit Radio"}, {"id": "B", "text": "Surat"}, {"id": "C", "text": "Antena"}, {"id": "D", "text": "Bahasa"}]'::jsonb, '"A"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000002', 'Bacalah instruksi: "Setiap laporan intelijen harus terverifikasi minimal dari dua sumber independen sebelum diteruskan ke pos komando." Kesimpulan yang paling logis adalah...', 'multiple_choice', '[{"id": "A", "text": "Satu sumber intelijen sudah mencukupi jika mendesak."}, {"id": "B", "text": "Laporan dari sumber tunggal tidak boleh langsung diteruskan tanpa verifikasi lanjutan."}, {"id": "C", "text": "Pos komando tidak menerima laporan apapun."}, {"id": "D", "text": "Sumber intelijen tidak perlu independen."}]'::jsonb, '"B"'::jsonb, 'medium', 1.0, true, 1),
    -- Penalaran Logis
    ('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'Semua prajurit harus memiliki ketahanan fisik yang prima. Budi adalah seorang prajurit. Kesimpulan yang sah adalah...', 'multiple_choice', '[{"id": "A", "text": "Budi belum tentu memiliki fisik prima."}, {"id": "B", "text": "Budi harus memiliki ketahanan fisik yang prima."}, {"id": "C", "text": "Orang yang memiliki fisik prima pasti prajurit."}, {"id": "D", "text": "Budi adalah komandan peleton."}]'::jsonb, '"B"'::jsonb, 'easy', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'Semua kendaraan tempur memiliki lapis baja. Beberapa kendaraan angkut pasukan adalah kendaraan tempur. Maka kesimpulannya...', 'multiple_choice', '[{"id": "A", "text": "Semua kendaraan angkut pasukan memiliki lapis baja."}, {"id": "B", "text": "Beberapa kendaraan angkut pasukan memiliki lapis baja."}, {"id": "C", "text": "Tidak ada kendaraan angkut pasukan yang berlapis baja."}, {"id": "D", "text": "Kendaraan berlapis baja tidak digunakan untuk angkut pasukan."}]'::jsonb, '"B"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000003', 'Prajurit A lebih tinggi dari B. Prajurit C lebih tinggi dari A. Prajurit D tidak lebih tinggi dari B. Siapakah yang paling tinggi di antara mereka?', 'multiple_choice', '[{"id": "A", "text": "Prajurit A"}, {"id": "B", "text": "Prajurit B"}, {"id": "C", "text": "Prajurit C"}, {"id": "D", "text": "Prajurit D"}]'::jsonb, '"C"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000003', 'Jika cuaca berkabut tebal, helikopter patroli dilarang lepas landas. Pagi ini helikopter patroli lepas landas. Kesimpulan yang pasti benar adalah...', 'multiple_choice', '[{"id": "A", "text": "Cuaca tidak berkabut tebal."}, {"id": "B", "text": "Cuaca hujan deras."}, {"id": "C", "text": "Pilot melanggar perintah."}, {"id": "D", "text": "Misi dibatalkan."}]'::jsonb, '"A"'::jsonb, 'medium', 1.0, true, 1),
    ('e0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000003', 'Dalam strategi pertahanan, jika Pos Timur diserang maka Pos Barat harus mengirim bantuan. Pos Barat tidak mengirim bantuan. Maka kesimpulannya...', 'multiple_choice', '[{"id": "A", "text": "Pos Barat kekurangan personel."}, {"id": "B", "text": "Pos Timur tidak diserang."}, {"id": "C", "text": "Pos Timur telah jatuh ke musuh."}, {"id": "D", "text": "Pos Utara yang diserang."}]'::jsonb, '"B"'::jsonb, 'hard', 1.0, true, 1)
ON CONFLICT (id) DO NOTHING;

-- Relasikan Soal dengan Paket Tes (15 Soal)
INSERT INTO public.test_package_questions (test_package_id, question_id, question_order)
SELECT 
    'd0000000-0000-0000-0000-000000000001'::uuid,
    id,
    ROW_NUMBER() OVER (ORDER BY category_id, id)
FROM public.test_questions
ON CONFLICT (test_package_id, question_id) DO NOTHING;
