/**
 * The public entry point for theory-exam data.
 *
 * Two banks feed it: the centre's own explained questions in
 * `curated-questions.ts`, and the official-syllabus bank generated into
 * `exam-bank.ts` from the numbered 60-question models students are taught from.
 * Everything re-exports from here so callers need not know the split.
 */
import { CURATED_QUESTIONS } from './curated-questions';
import { EXAM_BANK, EXAM_MODELS, ExamModel } from './exam-bank';
import { Question } from './question.model';

export { TOPICS, shuffle } from './question.model';
export type { Question, QuestionTopic } from './question.model';
export { EXAM_BANK, EXAM_MODELS, CURATED_QUESTIONS };
export type { ExamModel };

/** Everything a free-practice exam may draw from. */
export const QUESTIONS: Question[] = [...CURATED_QUESTIONS, ...EXAM_BANK];

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

/** Rebuilds one reference exam model in its original question order. */
export function questionsForModel(model: ExamModel): Question[] {
  return model.questionIds.map((id) => BY_ID.get(id)).filter((q): q is Question => q !== undefined);
}

export function examModel(id: string): ExamModel | undefined {
  return EXAM_MODELS.find((m) => m.id === id);
}
