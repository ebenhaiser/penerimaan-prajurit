import { store } from '../config/store.js';
import { calculateAge, calculateBMI } from '../utils/date.js';

export const eligibilityService = {
  /**
   * Evaluate candidate application eligibility against a specific path or selected path
   * @param {object} application 
   * @param {string} pathId Optional override path
   */
  evaluateApplication(application, pathId = null) {
    const targetPathId = pathId || application.selected_path_id;
    const path = store.paths.find(p => p.id === targetPathId);

    // 1. Check Completeness (BR-02)
    const requiredFields = [
      { key: 'date_of_birth', label: 'Tanggal Lahir' },
      { key: 'gender', label: 'Jenis Kelamin' },
      { key: 'height_cm', label: 'Tinggi Badan' },
      { key: 'weight_kg', label: 'Berat Badan' },
      { key: 'education_level', label: 'Tingkat Pendidikan' },
      { key: 'academic_score', label: 'Nilai Rata-rata / IPK' }
    ];

    const missingFields = requiredFields.filter(f => !application[f.key]);
    if (missingFields.length > 0) {
      return {
        status: 'incomplete',
        path_id: targetPathId,
        path_name: path?.name || 'Belum Dipilih',
        failed_rules: missingFields.map(f => `Data ${f.label} belum dilengkapi.`),
        evaluation_details: {
          missing_fields: missingFields.map(f => f.key)
        },
        rule_version: '1.0'
      };
    }

    if (!path) {
      return {
        status: 'incomplete',
        path_id: null,
        path_name: 'Belum Dipilih',
        failed_rules: ['Jalur pendaftaran belum ditentukan.'],
        evaluation_details: {},
        rule_version: '1.0'
      };
    }

    const failedRules = [];
    const age = calculateAge(application.date_of_birth);
    const { bmi, category: bmiCategory } = calculateBMI(application.height_cm, application.weight_kg);

    // 2. Age Check
    if (path.min_age && age < path.min_age) {
      failedRules.push(`Usia saat ini (${age} tahun) belum mencapai batas minimal ${path.min_age} tahun untuk jalur ${path.name}.`);
    }
    if (path.max_age && age > path.max_age) {
      failedRules.push(`Usia saat ini (${age} tahun) melampaui batas maksimal ${path.max_age} tahun untuk jalur ${path.name}.`);
    }

    // 3. Height Check
    const minHeight = application.gender === 'female' ? (path.min_height_female_cm || 157) : (path.min_height_male_cm || 163);
    if (application.height_cm < minHeight) {
      failedRules.push(`Tinggi badan (${application.height_cm} cm) di bawah batas minimal ${minHeight} cm untuk calon prajurit ${application.gender === 'female' ? 'wanita' : 'pria'}.`);
    }

    // 4. Education Level Check
    const allowedEdus = path.education_rules || [];
    const appEdu = (application.education_level || '').toUpperCase();
    const isEduValid = allowedEdus.some(rule => rule.toUpperCase() === appEdu);
    if (!isEduValid) {
      failedRules.push(`Kualifikasi pendidikan (${application.education_level}) tidak sesuai dengan syarat jalur ${path.name} (${allowedEdus.join(', ')}).`);
    }

    // 5. Academic Score Check
    const minScore = path.additional_rules?.min_academic_score || 0;
    if (application.academic_score < minScore) {
      failedRules.push(`Nilai akademik (${application.academic_score}) berada di bawah standar minimum jalur (${minScore}).`);
    }

    let status = 'eligible';
    if (failedRules.length > 0) {
      // If BMI is slightly off, mark as needs_review, otherwise not_eligible
      if (bmiCategory === 'obese') {
        failedRules.push(`Indeks Massa Tubuh (BMI: ${bmi}) berada dalam kategori obesitas. Perlu evaluasi kesamaptaan.`);
      }
      status = 'not_eligible';
    } else if (bmiCategory !== 'ideal') {
      status = 'needs_review';
    }

    const evaluation = {
      id: `eval-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      application_id: application.id,
      path_id: path.id,
      path_name: path.name,
      rule_version: '1.0',
      status,
      failed_rules: failedRules,
      evaluation_details: {
        calculated_age: age,
        height_cm: application.height_cm,
        min_height_required: minHeight,
        weight_kg: application.weight_kg,
        bmi,
        bmi_category: bmiCategory,
        education_level: application.education_level,
        academic_score: application.academic_score,
        min_score_required: minScore
      },
      evaluated_at: new Date().toISOString()
    };

    return evaluation;
  },

  /**
   * Evaluate application against all active paths to aid in recommendations
   */
  evaluateAllPaths(application) {
    return store.paths
      .filter(p => p.active)
      .map(p => this.evaluateApplication(application, p.id));
  }
};
