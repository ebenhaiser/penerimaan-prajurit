import { store } from '../config/store.js';

export const scoringService = {
  /**
   * Score a test attempt given its submitted answers and package configuration
   * @param {string} attemptId 
   */
  calculateAttemptScore(attemptId) {
    const attempt = store.attempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error('Attempt tidak ditemukan.');

    const pkg = store.packages.find(p => p.id === attempt.test_package_id);
    const answers = store.answers.filter(ans => ans.attempt_id === attemptId);

    // Group answers by question category
    const categoryStats = {
      NUMERIK: { correct: 0, total: 0, pointsEarned: 0, maxPoints: 0 },
      VERBAL: { correct: 0, total: 0, pointsEarned: 0, maxPoints: 0 },
      PENALARAN_LOGIS: { correct: 0, total: 0, pointsEarned: 0, maxPoints: 0 }
    };

    let totalPointsEarned = 0;
    let totalMaxPoints = 0;
    let totalCorrect = 0;

    answers.forEach(ans => {
      const question = store.questions.find(q => q.id === ans.question_id);
      if (!question) return;

      const categoryCode = question.category_code || 'NUMERIK';
      const weight = question.score_weight || 1.0;

      if (!categoryStats[categoryCode]) {
        categoryStats[categoryCode] = { correct: 0, total: 0, pointsEarned: 0, maxPoints: 0 };
      }

      categoryStats[categoryCode].total += 1;
      categoryStats[categoryCode].maxPoints += weight;
      totalMaxPoints += weight;

      // Check correctness
      const isCorrect = String(ans.answer).trim().toUpperCase() === String(question.correct_answer).trim().toUpperCase();
      ans.is_correct = isCorrect;
      ans.score_awarded = isCorrect ? weight : 0;

      if (isCorrect) {
        categoryStats[categoryCode].correct += 1;
        categoryStats[categoryCode].pointsEarned += weight;
        totalPointsEarned += weight;
        totalCorrect += 1;
      }
    });

    // Calculate percentage score per category (0 - 100)
    const calcCatScore = (code) => {
      const stat = categoryStats[code];
      if (!stat || stat.maxPoints === 0) return 0;
      return Number(((stat.pointsEarned / stat.maxPoints) * 100).toFixed(1));
    };

    const scoreNumeric = calcCatScore('NUMERIK');
    const scoreVerbal = calcCatScore('VERBAL');
    const scoreReasoning = calcCatScore('PENALARAN_LOGIS');

    // Total score using package weights or raw average
    const cfg = pkg?.scoring_config || { numeric_weight: 0.35, verbal_weight: 0.35, reasoning_weight: 0.30 };
    const numWeight = cfg.numeric_weight ?? 0.35;
    const vrbWeight = cfg.verbal_weight ?? 0.35;
    const rsnWeight = cfg.reasoning_weight ?? 0.30;

    const weightedScore = Number(
      (scoreNumeric * numWeight + scoreVerbal * vrbWeight + scoreReasoning * rsnWeight).toFixed(1)
    );

    // Duration calculation
    const startedAt = new Date(attempt.started_at);
    const submittedAt = attempt.submitted_at ? new Date(attempt.submitted_at) : new Date();
    const durationSeconds = Math.max(0, Math.floor((submittedAt.getTime() - startedAt.getTime()) / 1000));

    return {
      score_total: weightedScore,
      score_numeric: scoreNumeric,
      score_verbal: scoreVerbal,
      score_reasoning: scoreReasoning,
      correct_answers_count: totalCorrect,
      total_questions: answers.length,
      accuracy_percentage: answers.length > 0 ? Number(((totalCorrect / answers.length) * 100).toFixed(1)) : 0,
      duration_seconds: durationSeconds,
      category_breakdown: categoryStats
    };
  }
};
