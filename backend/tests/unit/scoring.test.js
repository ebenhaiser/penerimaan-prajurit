import { describe, expect, it } from 'vitest';
import { store } from '../../src/config/store.js';
import { scoringService } from '../../src/services/scoring.service.js';

describe('Scoring Service', () => {
  it('correctly calculates category scores and weighted total score', () => {
    // Mock an attempt
    const attemptId = 'test-attempt-unit-1';
    store.attempts.push({
      id: attemptId,
      application_id: 'app-00000000-0000-0000-0000-000000000001',
      test_package_id: 'd0000000-0000-0000-0000-000000000001',
      status: 'in_progress',
      started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    });

    // Provide answers matching the 15 questions
    store.questions.forEach(q => {
      store.answers.push({
        id: `ans-${q.id}`,
        attempt_id: attemptId,
        question_id: q.id,
        answer: q.correct_answer, // all correct
        is_correct: null,
        score_awarded: null,
        answered_at: new Date().toISOString()
      });
    });

    const result = scoringService.calculateAttemptScore(attemptId);
    expect(result.score_total).toBe(100);
    expect(result.score_numeric).toBe(100);
    expect(result.score_verbal).toBe(100);
    expect(result.score_reasoning).toBe(100);
    expect(result.accuracy_percentage).toBe(100);
    expect(result.correct_answers_count).toBe(15);
  });
});
