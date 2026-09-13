export type QuestionTopic = 'signs' | 'rules' | 'safety' | 'vehicle';

export interface Question {
  id: number;
  topic: QuestionTopic;
  text: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /**
   * Shown on the review screen. Only the centre's own hand-written questions
   * carry one; the official-syllabus bank ships answers without commentary, so
   * the review card simply omits the explanation box when this is absent.
   */
  explanation?: string;
  /** Sign or road-scenario artwork the question refers to. */
  image?: string;
}

export const TOPICS: Array<{ id: QuestionTopic | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'كل المواضيع', icon: 'grid' },
  { id: 'signs', label: 'الإشارات المرورية', icon: 'sign' },
  { id: 'rules', label: 'قواعد السير', icon: 'road' },
  { id: 'safety', label: 'السلامة المرورية', icon: 'shield' },
  { id: 'vehicle', label: 'المركبة والصيانة', icon: 'wrench' },
];

/** Fisher-Yates on a copy, so the source bank keeps its order. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
