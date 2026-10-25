import { store } from '../config/store.js';
import { eligibilityService } from './eligibility.service.js';

export const recommendationService = {
  /**
   * Generate AI-assisted recruitment path recommendation
   * @param {string} applicationId 
   */
  generateRecommendation(applicationId) {
    const application = store.applications.find(a => a.id === applicationId);
    if (!application) throw new Error('Data pendaftaran tidak ditemukan.');

    // Find the latest completed test attempt
    const attempt = store.attempts
      .filter(a => a.application_id === applicationId && a.status === 'completed')
      .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))[0];

    const allEvaluations = eligibilityService.evaluateAllPaths(application);
    const eligiblePaths = allEvaluations.filter(e => e.status === 'eligible' || e.status === 'needs_review');

    const scoreSnapshot = attempt ? {
      score_total: attempt.score_total,
      score_numeric: attempt.score_numeric,
      score_verbal: attempt.score_verbal,
      score_reasoning: attempt.score_reasoning,
      test_attempt_id: attempt.id
    } : {
      score_total: 0,
      score_numeric: 0,
      score_verbal: 0,
      score_reasoning: 0,
      test_attempt_id: null
    };

    let recommendedPath = null;
    let recommendationStatus = 'ready';
    const supportingFactors = [];
    const missingFactors = [];
    let analysisNarrative = '';

    const perwiraEval = allEvaluations.find(e => e.path_name.includes('Perwira'));
    const bintaraEval = allEvaluations.find(e => e.path_name.includes('Bintara'));
    const tamtamaEval = allEvaluations.find(e => e.path_name.includes('Tamtama'));

    const perwiraPath = store.paths.find(p => p.code === 'PERWIRA_PA_PK');
    const bintaraPath = store.paths.find(p => p.code === 'BINTARA');
    const tamtamaPath = store.paths.find(p => p.code === 'TAMTAMA');

    // Rule 1: High potential university graduates for Perwira Pa PK
    if (perwiraEval && (perwiraEval.status === 'eligible' || perwiraEval.status === 'needs_review')) {
      if (scoreSnapshot.score_total >= 70) {
        recommendedPath = perwiraPath;
        supportingFactors.push('Kualifikasi pendidikan sarjana/diploma memenuhi syarat perwira karier.');
        supportingFactors.push(`Skor asesmen potensi tinggi (${scoreSnapshot.score_total}/100) dengan penalaran logis (${scoreSnapshot.score_reasoning}/100).`);
        supportingFactors.push('Memiliki profil analitis yang cocok untuk penugasan korps staf atau teknis perwira.');
        analysisNarrative = 'Kandidat menunjukkan profil akademik dan penalaran logis yang sangat baik, selaras dengan profil penugasan Perwira Prajurit Karier (Pa PK).';
      } else {
        // Fallback to Bintara if also eligible and interested
        recommendedPath = perwiraPath;
        supportingFactors.push('Pendidikan sarjana memenuhi syarat jalur perwira.');
        missingFactors.push(`Skor pre-test (${scoreSnapshot.score_total}) memerlukan penguatan kemampuan numerik & verbal sebelum tes komprehensif.`);
        recommendationStatus = 'needs_manual_review';
        analysisNarrative = 'Kandidat memenuhi syarat administratif Perwira, namun skor pre-test disarankan untuk ditingkatkan atau dipertimbangkan pada jalur Bintara keahlian.';
      }
    }
    // Rule 2: High school / diploma graduates for Bintara
    else if (bintaraEval && (bintaraEval.status === 'eligible' || bintaraEval.status === 'needs_review')) {
      recommendedPath = bintaraPath;
      supportingFactors.push('Tingkat pendidikan dan usia memenuhi rentang persyaratan Bintara PK.');
      supportingFactors.push(`Tinggi badan (${application.height_cm} cm) memenuhi standar minimal formasi.`);
      if (scoreSnapshot.score_total >= 60) {
        supportingFactors.push(`Hasil asesmen pre-test kompeten (${scoreSnapshot.score_total}/100).`);
        analysisNarrative = 'Kandidat memiliki kualifikasi fisik, usia, dan kemampuan penalaran yang proporsional untuk menjadi Bintara sebagai tulang punggung satuan pelaksana.';
      } else {
        missingFactors.push('Hasil skor tes awal masih berada di rentang ambang batas bawah.');
        recommendationStatus = 'needs_manual_review';
        analysisNarrative = 'Kandidat memenuhi syarat awal Bintara, disarankan pelatihan intensif pada materi numerik dan wawasan verbal.';
      }
    }
    // Rule 3: Secondary / Vocational graduates for Tamtama
    else if (tamtamaEval && (tamtamaEval.status === 'eligible' || tamtamaEval.status === 'needs_review')) {
      recommendedPath = tamtamaPath;
      supportingFactors.push('Kualifikasi pendidikan dasar/menengah memenuhi syarat Tamtama.');
      supportingFactors.push(`Tinggi badan (${application.height_cm} cm) dan usia (${application.date_of_birth}) sesuai kriteria penugasan tempur/pelaksana.`);
      analysisNarrative = 'Kandidat direkomendasikan pada jalur Tamtama PK dengan fokus kesiapan fisik, mental ideologi, dan kedisiplinan lapangan.';
    }
    // Rule 4: Ineligible across all
    else {
      recommendationStatus = 'not_recommended';
      allEvaluations.forEach(ev => {
        ev.failed_rules.forEach(fr => {
          if (!missingFactors.includes(fr)) missingFactors.push(fr);
        });
      });
      analysisNarrative = 'Berdasarkan pemeriksaan persyaratan awal, terdapat kriteria mendasar yang belum terpenuhi untuk seluruh jalur yang tersedia.';
    }

    // Check if review by committee is required
    const existingRec = store.recommendations.find(r => r.application_id === applicationId);

    const recommendationRecord = {
      id: existingRec ? existingRec.id : `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      application_id: applicationId,
      test_attempt_id: scoreSnapshot.test_attempt_id,
      recommended_path_id: recommendedPath ? recommendedPath.id : null,
      recommended_path_name: recommendedPath ? recommendedPath.name : 'Tidak Ada Rekomendasi Jalur',
      recommended_path_code: recommendedPath ? recommendedPath.code : null,
      recommendation_status: recommendationStatus,
      score_snapshot: scoreSnapshot,
      reasoning_summary: {
        narrative: analysisNarrative,
        supporting_factors: supportingFactors,
        missing_factors: missingFactors,
        all_evaluations: allEvaluations
      },
      rule_version: '1.0',
      reviewed_by: existingRec?.reviewed_by || null,
      review_status: existingRec?.review_status || 'pending',
      review_notes: existingRec?.review_notes || null,
      created_at: new Date().toISOString()
    };

    if (existingRec) {
      Object.assign(existingRec, recommendationRecord);
    } else {
      store.recommendations.unshift(recommendationRecord);
    }

    store.addAuditLog(
      application.candidate_id,
      'RECOMMENDATION_GENERATED',
      'recommendations',
      recommendationRecord.id,
      {
        application_id: applicationId,
        recommended_path: recommendedPath?.code,
        score_total: scoreSnapshot.score_total,
        status: recommendationStatus
      }
    );

    return recommendationRecord;
  }
};
