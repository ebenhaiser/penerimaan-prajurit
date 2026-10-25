/**
 * Date calculation utilities
 */

/**
 * Calculate age in full years based on date of birth and reference date
 * @param {string|Date} dateOfBirth 
 * @param {string|Date} referenceDate Default is current date or recruitment cutoff
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth, referenceDate = new Date()) => {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const ref = new Date(referenceDate);

  if (isNaN(dob.getTime())) return 0;

  let age = ref.getFullYear() - dob.getFullYear();
  const monthDiff = ref.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} heightCm 
 * @param {number} weightKg 
 * @returns {{ bmi: number, category: string }}
 */
export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0) return { bmi: 0, category: 'unknown' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi >= 18.5 && bmi <= 25.0) category = 'ideal';
  else if (bmi > 25.0 && bmi <= 27.0) category = 'overweight';
  else category = 'obese';

  return { bmi, category };
};
