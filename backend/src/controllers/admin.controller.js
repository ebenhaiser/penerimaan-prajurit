import { store } from '../config/store.js';
import { applicationService } from '../services/application.service.js';
import { documentService } from '../services/document.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const adminController = {
  getDashboardStats(req, res) {
    const totalApplications = store.applications.length;
    const submittedApplications = store.applications.filter(a => a.application_status === 'submitted' || a.application_status === 'verified').length;
    const pendingVerification = store.documents.filter(d => d.verification_status === 'pending').length;
    const eligibleCount = store.applications.filter(a => a.eligibility_status === 'eligible').length;
    const needsReviewCount = store.applications.filter(a => a.eligibility_status === 'needs_review').length;
    const completedTests = store.attempts.filter(a => a.status === 'completed').length;

    // Per path count
    const pathCounts = {};
    store.paths.forEach(p => {
      pathCounts[p.code] = store.applications.filter(a => a.selected_path_id === p.id).length;
    });

    // Score distribution
    const completedAttempts = store.attempts.filter(a => a.status === 'completed' && a.score_total !== null);
    const avgScore = completedAttempts.length > 0
      ? Number((completedAttempts.reduce((acc, a) => acc + (a.score_total || 0), 0) / completedAttempts.length).toFixed(1))
      : 0;

    return successResponse(res, 'Statistik dashboard berhasil diambil.', {
      total_candidates: store.users.filter(u => u.role === 'candidate').length,
      total_applications: totalApplications,
      submitted_applications: submittedApplications,
      pending_documents_verification: pendingVerification,
      eligible_candidates: eligibleCount,
      needs_review_candidates: needsReviewCount,
      completed_tests_count: completedTests,
      average_test_score: avgScore,
      path_distribution: pathCounts
    });
  },

  getApplications(req, res) {
    const { page = 1, limit = 10, search = '', path_id, status, eligibility } = req.query;

    let filtered = store.applications.map(app => applicationService.formatApplication(app));

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.application_number?.toLowerCase().includes(q) ||
        a.candidate?.full_name?.toLowerCase().includes(q) ||
        a.candidate?.email?.toLowerCase().includes(q)
      );
    }

    if (path_id) {
      filtered = filtered.filter(a => a.selected_path_id === path_id);
    }

    if (status) {
      filtered = filtered.filter(a => a.application_status === status);
    }

    if (eligibility) {
      filtered = filtered.filter(a => a.eligibility_status === eligibility);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    return successResponse(res, 'Daftar calon peserta berhasil diambil.', {
      items: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(total / limit)
    });
  },

  getApplicationDetail(req, res) {
    try {
      const app = applicationService.getApplicationById(req.params.id, req.user.id, req.user.role);
      const docs = store.documents.filter(d => d.application_id === req.params.id);
      const attempts = store.attempts.filter(a => a.application_id === req.params.id);
      const rec = store.recommendations.find(r => r.application_id === req.params.id);

      return successResponse(res, 'Detail lengkap calon peserta berhasil diambil.', {
        application: app,
        documents: docs,
        test_attempts: attempts,
        recommendation: rec
      });
    } catch (err) {
      return errorResponse(res, err.message, 'NOT_FOUND', [], 404);
    }
  },

  updateApplicationStatus(req, res) {
    const { status, notes } = req.body;
    const app = store.applications.find(a => a.id === req.params.id);
    if (!app) return errorResponse(res, 'Pendaftaran tidak ditemukan.', 'NOT_FOUND', [], 404);

    app.application_status = status;
    app.updated_at = new Date().toISOString();

    store.addAuditLog(req.user.id, 'APPLICATION_STATUS_UPDATED', 'candidate_applications', app.id, {
      new_status: status,
      notes
    });

    store.addNotification(
      app.candidate_id,
      'Pembaruan Status Seleksi',
      `Status berkas seleksi Anda kini menjadi: ${status.toUpperCase()}. ${notes ? `Catatan panitia: ${notes}` : ''}`,
      status === 'verified' ? 'success' : 'info'
    );

    return successResponse(res, 'Status pendaftaran berhasil diperbarui.', applicationService.formatApplication(app));
  },

  verifyDocument(req, res) {
    try {
      const { verification_status, review_notes } = req.body;
      const doc = documentService.verifyDocument(req.params.id, req.user.id, {
        verification_status,
        review_notes
      });
      return successResponse(res, 'Status verifikasi dokumen berhasil diperbarui.', doc);
    } catch (err) {
      return errorResponse(res, err.message, 'VERIFICATION_FAILED', [err.message], 400);
    }
  },

  getAuditLogs(req, res) {
    const { limit = 50 } = req.query;
    const logs = store.auditLogs.slice(0, Number(limit)).map(log => {
      const actor = store.users.find(u => u.id === log.actor_id);
      return {
        ...log,
        actor_name: actor ? actor.full_name : 'System',
        actor_role: actor ? actor.role : 'system'
      };
    });

    return successResponse(res, 'Log audit aktivitas berhasil diambil.', logs);
  },

  getReports(req, res) {
    // Generate summary data for export
    const data = store.applications.map(app => {
      const candidate = store.users.find(u => u.id === app.candidate_id);
      const path = store.paths.find(p => p.id === app.selected_path_id);
      const latestAttempt = store.attempts.find(a => a.application_id === app.id && a.status === 'completed');
      const rec = store.recommendations.find(r => r.application_id === app.id);

      return {
        Nomor_Pendaftaran: app.application_number,
        Nama_Lengkap: candidate?.full_name || '',
        Email: candidate?.email || '',
        No_Telepon: candidate?.phone || '',
        Jalur_Dipilih: path?.name || '',
        Status_Kelayakan: app.eligibility_status,
        Status_Pendaftaran: app.application_status,
        Tinggi_cm: app.height_cm,
        Berat_kg: app.weight_kg,
        Pendidikan: app.education_level,
        Nilai_Akademik: app.academic_score,
        Skor_Numerik: latestAttempt?.score_numeric || '-',
        Skor_Verbal: latestAttempt?.score_verbal || '-',
        Skor_Penalaran: latestAttempt?.score_reasoning || '-',
        Skor_Total_Pretest: latestAttempt?.score_total || '-',
        Rekomendasi_AI: rec?.recommended_path_name || '-',
        Status_Review_Rekomendasi: rec?.review_status || '-'
      };
    });

    store.addAuditLog(req.user.id, 'REPORT_EXPORTED', 'reports', null, { row_count: data.length });
    return successResponse(res, 'Data laporan rekapitulasi berhasil disiapkan.', data);
  },

  getRecruitmentPaths(req, res) {
    return successResponse(res, 'Konfigurasi jalur penerimaan berhasil diambil.', store.paths);
  },

  updateRecruitmentPath(req, res) {
    const path = store.paths.find(p => p.id === req.params.id);
    if (!path) return errorResponse(res, 'Jalur penerimaan tidak ditemukan.', 'NOT_FOUND', [], 404);

    Object.assign(path, req.body, { updated_at: new Date().toISOString() });
    store.addAuditLog(req.user.id, 'RECRUITMENT_PATH_UPDATED', 'recruitment_paths', path.id, req.body);

    return successResponse(res, 'Konfigurasi jalur penerimaan berhasil diperbarui.', path);
  },

  getTestQuestions(req, res) {
    const questions = store.questions.map(q => {
      const cat = store.categories.find(c => c.id === q.category_id);
      return {
        ...q,
        category_name: cat?.name || q.category_code
      };
    });
    return successResponse(res, 'Bank soal asesmen berhasil diambil.', questions);
  },

  createTestQuestion(req, res) {
    const { category_id, question_text, options, correct_answer, difficulty, score_weight } = req.body;
    const cat = store.categories.find(c => c.id === category_id);

    const newQuestion = {
      id: `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category_id,
      category_code: cat ? cat.code : 'NUMERIK',
      question_text,
      question_type: 'multiple_choice',
      options: options || [],
      correct_answer,
      difficulty: difficulty || 'medium',
      score_weight: score_weight ? Number(score_weight) : 1.0,
      active: true,
      version: 1,
      created_at: new Date().toISOString()
    };

    store.questions.push(newQuestion);
    store.addAuditLog(req.user.id, 'QUESTION_CREATED', 'test_questions', newQuestion.id);

    return successResponse(res, 'Soal baru berhasil ditambahkan.', newQuestion, 201);
  },

  reviewRecommendation(req, res) {
    const rec = store.recommendations.find(r => r.id === req.params.id);
    if (!rec) return errorResponse(res, 'Rekomendasi tidak ditemukan.', 'NOT_FOUND', [], 404);

    const { review_status, review_notes, recommended_path_id } = req.body;
    rec.review_status = review_status;
    rec.review_notes = review_notes;
    rec.reviewed_by = req.user.id;

    if (recommended_path_id) {
      const newPath = store.paths.find(p => p.id === recommended_path_id);
      if (newPath) {
        rec.recommended_path_id = newPath.id;
        rec.recommended_path_name = newPath.name;
        rec.recommended_path_code = newPath.code;
      }
    }

    const app = store.applications.find(a => a.id === rec.application_id);
    if (app) {
      store.addNotification(
        app.candidate_id,
        'Evaluasi Rekomendasi Panitia',
        `Panitia telah meninjau rekomendasi jalur pendaftaran Anda: ${rec.recommended_path_name}. Catatan: ${review_notes}`,
        'info'
      );
    }

    store.addAuditLog(req.user.id, 'RECOMMENDATION_REVIEWED', 'recommendations', rec.id, {
      review_status,
      recommended_path_name: rec.recommended_path_name
    });

    return successResponse(res, 'Tinjauan rekomendasi berhasil disimpan.', rec);
  }
};
