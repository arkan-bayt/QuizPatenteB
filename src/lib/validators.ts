// ==========================================
// DATA LAYER - Quiz Data Validation
// ==========================================

import { QuizData } from './types';

/**
 * Validate that quizData from JSON has the correct structure.
 * Every question must have q (string) and a (boolean).
 */
export function isValidQuizData(data: unknown): data is QuizData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    if (typeof key !== 'string') return false;
    if (!val || typeof val !== 'object' || Array.isArray(val)) return false;
    for (const [subKey, subVal] of Object.entries(val as Record<string, unknown>)) {
      if (!Array.isArray(subVal)) return false;
      for (const q of subVal) {
        if (!q || typeof q !== 'object') return false;
        if (typeof (q as Record<string, unknown>).q !== 'string') return false;
        if (typeof (q as Record<string, unknown>).a !== 'boolean') return false;
      }
    }
  }
  return true;
}
