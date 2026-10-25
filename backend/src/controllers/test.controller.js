import { store } from '../config/store.js';
import { scoringService } from '../services/scoring.service.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export const testController = {
  getAvailableTests(req, res) {
    const packages = store.packages
      .filter(p => p.active)
      .map(p => ({
        id: p.id,
        name: p.name,
        duration_minutes: p.duration_minutes,
        question_count: p.question_count,
        categories: store.categories.map(c => ({ id: c.id, code: c.code, name: c.name }))
      }));

    return successResponse(res, 'Daftar tes tersedia berhasil diambil.', packages);
  },

  startAttempt(req, res) {
    const { packageId } = req.params;
    const { application_id } = req.body;

    const pkg = store.packages.find(p => p.id === packageId && p.active);
    if (!pkg) return errorResponse(res, 'Paket tes tidak ditemukan atau tidak aktif.', 'NOT_FOUND', [], 404);

    const app = store.applications.find(a => a.id === application_id);
    if (!app) return errorResponse(res, 'Pendaftaran tidak ditemukan.', 'NOT_FOUND', [], 404);

    if (req.user.role === 'candidate' && app.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    // Check if there is an in-progress attempt
    let activeAttempt = store.attempts.find(
      a => a.application_id === application_id && a.test_package_id === packageId && a.status === 'in_progress'
    );

    if (activeAttempt) {
      // Check expiration
      if (new Date() > new Date(activeAttempt.expires_at)) {
        activeAttempt.status = 'completed';
        const scores = scoringService.calculateAttemptScore(activeAttempt.id);
        Object.assign(activeAttempt, scores, { submitted_at: activeAttempt.expires_at });
      } else {
        return successResponse(res, 'Melanjutkan pengerjaan tes yang sedang aktif.', activeAttempt);
      }
    }

    // Create new attempt
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + pkg.duration_minutes * 60 * 1000);

    const newAttempt = {
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      application_id,
      test_package_id: packageId,
      status: 'in_progress',
      started_at: startedAt.toISOString(),
      submitted_at: null,
      expires_at: expiresAt.toISOString(),
      score_total: null,
      score_numeric: null,
      score_verbal: null,
      score_reasoning: null,
      scoring_details: null,
      created_at: startedAt.toISOString()
    };

    store.attempts.push(newAttempt);
    store.addAuditLog(req.user.id, 'TEST_ATTEMPT_STARTED', 'test_attempts', newAttempt.id, {
      test_package_id: packageId,
      application_id
    });

    return successResponse(res, 'Pre-test dimulai. Waktu pengerjaan berjalan.', newAttempt, 201);
  },

  getAttempt(req, res) {
    const { attemptId } = req.params;
    const attempt = store.attempts.find(a => a.id === attemptId);
    if (!attempt) return errorResponse(res, 'Pengerjaan tes tidak ditemukan.', 'NOT_FOUND', [], 404);

    const app = store.applications.find(a => a.id === attempt.application_id);
    if (req.user.role === 'candidate' && app?.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    // Sanitize questions: strip correct_answer if user is candidate
    const questions = store.questions
      .filter(q => q.active)
      .map(q => {
        const questionData = {
          id: q.id,
          category_id: q.category_id,
          category_code: q.category_code,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          difficulty: q.difficulty,
          score_weight: q.score_weight
        };

        // NEVER send correct_answer to candidate during exam
        if (req.user.role !== 'candidate') {
          questionData.correct_answer = q.correct_answer;
        }

        return questionData;
      });

    const userAnswers = store.answers
      .filter(ans => ans.attempt_id === attemptId)
      .map(ans => ({
        question_id: ans.question_id,
        answer: ans.answer,
        answered_at: ans.answered_at
      }));

    return successResponse(res, 'Data pengerjaan tes berhasil diambil.', {
      attempt,
      questions,
      answers: userAnswers,
      remaining_seconds: Math.max(0, Math.floor((new Date(attempt.expires_at) - new Date()) / 1000))
    });
  },

  saveAnswer(req, res) {
    const { attemptId, questionId } = req.params;
    const { answer } = req.body;

    const attempt = store.attempts.find(a => a.id === attemptId);
    if (!attempt) return errorResponse(res, 'Pengerjaan tes tidak ditemukan.', 'NOT_FOUND', [], 404);

    if (attempt.status !== 'in_progress') {
      return errorResponse(res, 'Tes sudah diselesaikan atau waktu telah habis. Jawaban dikunci.', 'TEST_LOCKED', [], 400);
    }

    if (new Date() > new Date(attempt.expires_at)) {
      attempt.status = 'completed';
      const scores = scoringService.calculateAttemptScore(attempt.id);
      Object.assign(attempt, scores, { submitted_at: attempt.expires_at });
      return errorResponse(res, 'Waktu pengerjaan tes telah habis. Tes otomatis ditutup.', 'TEST_EXPIRED', [], 400);
    }

    let existingAns = store.answers.find(ans => ans.attempt_id === attemptId && ans.question_id === questionId);
    const now = new Date().toISOString();

    if (existingAns) {
      existingAns.answer = answer;
      existingAns.answered_at = now;
      existingAns.updated_at = now;
    } else {
      existingAns = {
        id: `ans-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        attempt_id: attemptId,
        question_id: questionId,
        answer,
        is_correct: null,
        score_awarded: null,
        answered_at: now,
        created_at: now,
        updated_at: now
      };
      store.answers.push(existingAns);
    }

    return successResponse(res, 'Jawaban berhasil disimpan sementara.', {
      question_id: questionId,
      answer: existingAns.answer
    });
  },

  submitAttempt(req, res) {
    const { attemptId } = req.params;
    const attempt = store.attempts.find(a => a.id === attemptId);
    if (!attempt) return errorResponse(res, 'Pengerjaan tes tidak ditemukan.', 'NOT_FOUND', [], 404);

    const app = store.applications.find(a => a.id === attempt.application_id);
    if (req.user.role === 'candidate' && app?.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    if (attempt.status === 'completed') {
      return successResponse(res, 'Tes ini sudah diserahkan sebelumnya.', attempt);
    }

    attempt.status = 'completed';
    attempt.submitted_at = new Date().toISOString();

    // Calculate score in backend
    const scoringResult = scoringService.calculateAttemptScore(attempt.id);
    Object.assign(attempt, scoringResult);

    store.addAuditLog(req.user.id, 'TEST_ATTEMPT_SUBMITTED', 'test_attempts', attempt.id, {
      score_total: scoringResult.score_total,
      duration_seconds: scoringResult.duration_seconds
    });

    if (app) {
      store.addNotification(
        app.candidate_id,
        'Pre-Test Selesai!',
        `Anda telah menyelesaikan pre-test dengan skor total: ${scoringResult.score_total}/100. Rekomendasi jalur kini tersedia.`,
        'success'
      );
    }

    return successResponse(res, 'Tes berhasil diselesaikan dan dinilai.', attempt);
  },

  getResult(req, res) {
    const { attemptId } = req.params;
    const attempt = store.attempts.find(a => a.id === attemptId);
    if (!attempt) return errorResponse(res, 'Pengerjaan tes tidak ditemukan.', 'NOT_FOUND', [], 404);

    const app = store.applications.find(a => a.id === attempt.application_id);
    if (req.user.role === 'candidate' && app?.candidate_id !== req.user.id) {
      return errorResponse(res, 'Akses ditolak.', 'FORBIDDEN', [], 403);
    }

    if (attempt.status !== 'completed') {
      return errorResponse(res, 'Hasil tes belum tersedia karena tes masih berlangsung.', 'NOT_AVAILABLE', [], 400);
    }

    return successResponse(res, 'Hasil asesmen pre-test berhasil diambil.', attempt);
  }
};
