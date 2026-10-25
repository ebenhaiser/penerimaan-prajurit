import { describe, expect, it } from 'vitest';
import { calculateAge, calculateBMI } from '../../src/utils/date.js';

describe('Date & Physical Calculations', () => {
  it('calculates full age correctly based on reference date', () => {
    const dob = '2005-04-15';
    const ref = new Date('2026-04-14'); // day before 21st birthday
    expect(calculateAge(dob, ref)).toBe(20);

    const refAfter = new Date('2026-04-16'); // day after 21st birthday
    expect(calculateAge(dob, refAfter)).toBe(21);
  });

  it('calculates BMI correctly and maps category', () => {
    // 175 cm, 68 kg -> BMI ~ 22.2 (ideal)
    const result = calculateBMI(175, 68);
    expect(result.bmi).toBe(22.2);
    expect(result.category).toBe('ideal');

    // 160 cm, 85 kg -> BMI ~ 33.2 (obese)
    const obese = calculateBMI(160, 85);
    expect(obese.bmi).toBe(33.2);
    expect(obese.category).toBe('obese');
  });
});
