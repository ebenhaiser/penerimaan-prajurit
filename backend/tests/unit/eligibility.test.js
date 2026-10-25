import { describe, expect, it } from 'vitest';
import { store } from '../../src/config/store.js';
import { eligibilityService } from '../../src/services/eligibility.service.js';

describe('Eligibility Evaluation Service', () => {
  const bintaraPath = store.paths.find(p => p.code === 'BINTARA');

  it('marks application as incomplete if mandatory fields are missing', () => {
    const incompleteApp = {
      id: 'app-incomplete',
      selected_path_id: bintaraPath.id,
      date_of_birth: null
    };

    const res = eligibilityService.evaluateApplication(incompleteApp);
    expect(res.status).toBe('incomplete');
    expect(res.failed_rules.length).toBeGreaterThan(0);
  });

  it('evaluates eligible candidate correctly', () => {
    const validCandidate = {
      id: 'app-valid',
      selected_path_id: bintaraPath.id,
      date_of_birth: '2005-01-01', // ~21 years old in 2026
      gender: 'male',
      height_cm: 172,
      weight_kg: 65,
      education_level: 'SMA',
      academic_score: 8.5
    };

    const res = eligibilityService.evaluateApplication(validCandidate);
    expect(res.status).toBe('eligible');
    expect(res.failed_rules).toHaveLength(0);
  });

  it('flags not_eligible when height is below minimum', () => {
    const shortCandidate = {
      id: 'app-short',
      selected_path_id: bintaraPath.id,
      date_of_birth: '2005-01-01',
      gender: 'male',
      height_cm: 158, // min is 163 for male
      weight_kg: 55,
      education_level: 'SMA',
      academic_score: 8.0
    };

    const res = eligibilityService.evaluateApplication(shortCandidate);
    expect(res.status).toBe('not_eligible');
    expect(res.failed_rules[0]).toContain('Tinggi badan (158 cm) di bawah batas minimal');
  });
});
