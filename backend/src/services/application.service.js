import { store } from '../config/store.js';
import { eligibilityService } from './eligibility.service.js';

export const applicationService = {
  getApplicationsByCandidate(candidateId) {
    return store.applications
      .filter(app => app.candidate_id === candidateId)
      .map(app => this.formatApplication(app));
  },

  getApplicationById(id, userId, userRole) {
    const app = store.applications.find(a => a.id === id);
    if (!app) throw new Error('Pendaftaran tidak ditemukan.');

    // Candidates can only view their own
    if (userRole === 'candidate' && app.candidate_id !== userId) {
      throw new Error('Akses ditolak ke data pendaftaran ini.');
    }

    return this.formatApplication(app);
  },

  createApplication(candidateId, data) {
    const existingActive = store.applications.find(
      a => a.candidate_id === candidateId && a.period_id === data.period_id
    );
    if (existingActive) {
      throw new Error('Anda sudah memiliki berkas pendaftaran aktif pada periode ini.');
    }

    const regYear = new Date().getFullYear();
    const count = store.applications.length + 1;
    const application_number = `REG-${regYear}-${String(count).padStart(5, '0')}`;

    const newApp = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      candidate_id: candidateId,
      period_id: data.period_id,
      selected_path_id: data.selected_path_id || null,
      application_number,
      date_of_birth: data.date_of_birth || null,
      place_of_birth: data.place_of_birth || null,
      gender: data.gender || null,
      address: data.address || null,
      height_cm: data.height_cm ? Number(data.height_cm) : null,
      weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
      education_level: data.education_level || null,
      institution_name: data.institution_name || null,
      major: data.major || null,
      graduation_year: data.graduation_year ? Number(data.graduation_year) : null,
      academic_score: data.academic_score ? Number(data.academic_score) : null,
      eligibility_status: 'incomplete',
      application_status: 'draft',
      submitted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Evaluate initial eligibility
    const evalResult = eligibilityService.evaluateApplication(newApp);
    newApp.eligibility_status = evalResult.status;

    store.applications.push(newApp);
    store.addAuditLog(candidateId, 'APPLICATION_CREATED', 'candidate_applications', newApp.id, { application_number });

    return this.formatApplication(newApp);
  },

  updateApplication(id, candidateId, updateData) {
    const app = store.applications.find(a => a.id === id);
    if (!app) throw new Error('Pendaftaran tidak ditemukan.');
    if (app.candidate_id !== candidateId) throw new Error('Akses ditolak.');
    if (app.application_status !== 'draft') {
      throw new Error('Berkas yang sudah diajukan (submitted) tidak dapat diubah tanpa persetujuan panitia.');
    }

    Object.assign(app, updateData, { updated_at: new Date().toISOString() });

    // Re-evaluate eligibility
    const evalResult = eligibilityService.evaluateApplication(app);
    app.eligibility_status = evalResult.status;

    store.addAuditLog(candidateId, 'APPLICATION_UPDATED', 'candidate_applications', app.id);
    return this.formatApplication(app);
  },

  submitApplication(id, candidateId) {
    const app = store.applications.find(a => a.id === id);
    if (!app) throw new Error('Pendaftaran tidak ditemukan.');
    if (app.candidate_id !== candidateId) throw new Error('Akses ditolak.');

    // Ensure required data is filled
    const evalResult = eligibilityService.evaluateApplication(app);
    if (evalResult.status === 'incomplete') {
      throw new Error(`Data pendaftaran belum lengkap: ${evalResult.failed_rules.join(' ')}`);
    }

    app.application_status = 'submitted';
    app.submitted_at = new Date().toISOString();
    app.updated_at = new Date().toISOString();
    app.eligibility_status = evalResult.status;

    store.addAuditLog(candidateId, 'APPLICATION_SUBMITTED', 'candidate_applications', app.id, {
      application_number: app.application_number
    });

    store.addNotification(
      candidateId,
      'Pendaftaran Berhasil Dikirim',
      `Berkas pendaftaran nomor ${app.application_number} telah berhasil dikirim dan menunggu verifikasi panitia.`,
      'success'
    );

    return this.formatApplication(app);
  },

  formatApplication(app) {
    const candidate = store.users.find(u => u.id === app.candidate_id);
    const path = store.paths.find(p => p.id === app.selected_path_id);
    const period = store.periods.find(p => p.id === app.period_id);
    const docs = store.documents.filter(d => d.application_id === app.id);
    const latestAttempt = store.attempts
      .filter(at => at.application_id === app.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    const latestRec = store.recommendations.find(r => r.application_id === app.id);

    return {
      ...app,
      candidate: candidate ? {
        id: candidate.id,
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone
      } : null,
      path: path ? { id: path.id, code: path.code, name: path.name } : null,
      period: period ? { id: period.id, name: period.name, status: period.status } : null,
      documents_count: docs.length,
      latest_attempt: latestAttempt ? {
        id: latestAttempt.id,
        status: latestAttempt.status,
        score_total: latestAttempt.score_total,
        score_numeric: latestAttempt.score_numeric,
        score_verbal: latestAttempt.score_verbal,
        score_reasoning: latestAttempt.score_reasoning,
        submitted_at: latestAttempt.submitted_at
      } : null,
      recommendation: latestRec ? {
        id: latestRec.id,
        status: latestRec.recommendation_status,
        recommended_path_name: latestRec.recommended_path_name,
        review_status: latestRec.review_status,
        created_at: latestRec.created_at
      } : null
    };
  }
};
