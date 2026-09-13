import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EXAM_MODELS,
  ExamModel,
  QUESTIONS,
  Question,
  QuestionTopic,
  TOPICS,
  examModel,
  questionsForModel,
  shuffle,
} from '../../core/data/questions';
import { SIGNS, SIGN_SHAPES, SignShape } from '../../core/data/signs';
import { FeedbackService } from '../../core/services/feedback.service';
import { SeoService } from '../../core/services/seo.service';
import { SITE, links } from '../../core/site';
import { IconComponent } from '../../shared/ui/icon.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';
import { TrafficSignComponent } from '../../shared/ui/traffic-sign.component';

type Mode = 'exam' | 'signs';
type Stage = 'setup' | 'running' | 'result';

/** The reference exam requires 51 correct answers out of 60. */
const PASS_PERCENT = 85;
/** The comprehensive exam allows 60 minutes for 60 questions. */
const SECONDS_PER_QUESTION = 60;
/** Length of a licensing-department exam, and so of our comprehensive one. */
const COMPREHENSIVE_COUNT = 60;
const BEST_KEY = 'badr.theory.best';

type ExamGroupId = ExamModel['group'];

/**
 * One launchable exam. Exactly one selector is set: `model` replays a reference
 * exam verbatim, `group` draws a fresh 60 from every model in that licence
 * class, and `topic` is a free subject drill.
 */
interface ExamPart {
  label: string;
  count: number;
  model?: string;
  group?: ExamGroupId;
  topic?: QuestionTopic | 'all';
}

interface ExamGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  parts: ExamPart[];
  comprehensive: ExamPart;
}

@Component({
  selector: 'app-theory',
  standalone: true,
  imports: [RouterLink, IconComponent, PageHeroComponent, TrafficSignComponent],
  templateUrl: './theory.component.html',
  styleUrls: ['./theory.component.scss'],
})
export class TheoryComponent implements OnDestroy {
  private seo = inject(SeoService);
  readonly feedback = inject(FeedbackService);

  readonly site = SITE;
  readonly tel = links.tel;
  readonly topics = TOPICS;
  readonly bank = QUESTIONS;
  readonly modelCount = EXAM_MODELS.length;

  readonly mode = signal<Mode>('exam');
  readonly stage = signal<Stage>('setup');

  // ---- Setup ---------------------------------------------------------------

  readonly topic = signal<QuestionTopic | 'all'>('all');
  readonly count = signal(20);
  readonly timed = signal(true);
  readonly examTitle = signal('اختبار تدريبي شامل');

  readonly countOptions = [10, 20, 30];

  /**
   * The real syllabus exam models, grouped by licence class. Each part replays
   * one numbered model exactly as the licensing department asks it; the
   * comprehensive exam draws a fresh 60 from the whole class.
   */
  readonly examGroups: ExamGroup[] = [
    {
      id: 'private-public',
      title: 'الفحص النظري للفئتين الثالثة والرابعة',
      description:
        'نماذج الفحص النظري لرخصة الخصوصي والعمومي. يمكنك إجراء كل نموذج بشكل منفصل، ثم إجراء اختبار شامل يجمع أسئلة جميع النماذج.',
      icon: 'car',
      parts: partsFor('class3'),
      comprehensive: {
        label: 'الاختبار الشامل للفئتين الثالثة والرابعة',
        group: 'class3',
        count: COMPREHENSIVE_COUNT,
      },
    },
    {
      id: 'heavy',
      title: 'الفحص النظري للفئتين الخامسة والسادسة',
      description:
        'نماذج تغطي مركبات المحورين والشاحنات والحافلات، بما فيها الحمولات وأنظمة المركبات الثقيلة. ابدأ بالنماذج، ثم اختبر نفسك بالاختبار الشامل.',
      icon: 'truck',
      parts: partsFor('heavy'),
      comprehensive: {
        label: 'الاختبار الشامل للفئتين الخامسة والسادسة',
        group: 'heavy',
        count: COMPREHENSIVE_COUNT,
      },
    },
    {
      id: 'motorcycle',
      title: 'الفحص النظري لفئة الدراجة النارية',
      description:
        'نماذج مخصّصة لقواعد قيادة الدراجة النارية والسلامة ومشاركة الطريق، يليها اختبار شامل مشابه لفحص الترخيص.',
      icon: 'moto',
      parts: partsFor('moto'),
      comprehensive: {
        label: 'الاختبار الشامل لفئة الدراجة النارية',
        group: 'moto',
        count: COMPREHENSIVE_COUNT,
      },
    },
  ];

  /** How many questions the bank can actually supply for the chosen topic. */
  readonly available = computed(() =>
    this.topic() === 'all' ? this.bank.length : this.bank.filter((q) => q.topic === this.topic()).length,
  );

  /** Clamped, so asking for 30 questions from a 6-question topic still works. */
  readonly effectiveCount = computed(() => Math.min(this.count(), this.available()));

  readonly allowanceMinutes = computed(() => Math.round((this.effectiveCount() * SECONDS_PER_QUESTION) / 60));

  // ---- Running exam --------------------------------------------------------

  readonly deck = signal<Question[]>([]);
  /** Parallel to `deck`; `null` means unanswered. */
  readonly answers = signal<(number | null)[]>([]);
  readonly index = signal(0);
  readonly remaining = signal(0);

  private ticker: ReturnType<typeof setInterval> | null = null;
  private advanceTimer: ReturnType<typeof setTimeout> | null = null;
  /** Set when a preset launched the exam, so "retry" replays the same one. */
  private lastPart: ExamPart | null = null;

  readonly current = computed(() => this.deck()[this.index()]);
  readonly picked = computed(() => this.answers()[this.index()] ?? null);
  readonly currentAnswered = computed(() => this.picked() !== null);
  readonly currentCorrect = computed(
    () => this.picked() !== null && this.picked() === this.current()?.answer,
  );
  /** Locks navigation while the colour, message and cue are being revealed. */
  readonly revealing = signal(false);
  /** Students may only move as far as the first unanswered question. */
  readonly furthest = computed(() => {
    const firstBlank = this.answers().findIndex((a) => a === null);
    return firstBlank === -1 ? Math.max(0, this.deck().length - 1) : firstBlank;
  });
  readonly answeredCount = computed(() => this.answers().filter((a) => a !== null).length);
  readonly unansweredCount = computed(() => this.deck().length - this.answeredCount());
  readonly progress = computed(() =>
    this.deck().length ? Math.round((this.answeredCount() / this.deck().length) * 100) : 0,
  );
  readonly positionProgress = computed(() =>
    this.deck().length ? Math.round(((this.index() + 1) / this.deck().length) * 100) : 0,
  );
  readonly allAnswered = computed(() => this.deck().length > 0 && this.answeredCount() === this.deck().length);

  readonly clock = computed(() => {
    const total = Math.max(0, this.remaining());
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${`${s}`.padStart(2, '0')}`;
  });

  /** Turns the clock red for the last 20% of the allowance. */
  readonly clockCritical = computed(() => this.remaining() <= SECONDS_PER_QUESTION * this.deck().length * 0.2);

  // ---- Result --------------------------------------------------------------

  readonly score = computed(() => this.deck().reduce((n, q, i) => (this.answers()[i] === q.answer ? n + 1 : n), 0));
  readonly percent = computed(() => (this.deck().length ? Math.round((this.score() / this.deck().length) * 100) : 0));
  readonly passed = computed(() => this.percent() >= PASS_PERCENT);
  readonly passMark = PASS_PERCENT;

  /** Every miss, including the ones left blank when the clock ran out. */
  readonly wrong = computed(() =>
    this.deck()
      .map((q, i) => ({ q, given: this.answers()[i] ?? null }))
      .filter((row) => row.given !== row.q.answer),
  );

  /** Per-topic accuracy, so the review screen can say *what* to go study. */
  readonly byTopic = computed(() => {
    const rows = new Map<QuestionTopic, { correct: number; total: number }>();
    this.deck().forEach((q, i) => {
      const row = rows.get(q.topic) ?? { correct: 0, total: 0 };
      row.total += 1;
      if (this.answers()[i] === q.answer) row.correct += 1;
      rows.set(q.topic, row);
    });
    return [...rows.entries()].map(([id, row]) => ({
      id,
      label: this.topics.find((t) => t.id === id)?.label ?? id,
      ...row,
      percent: Math.round((row.correct / row.total) * 100),
    }));
  });

  readonly best = signal<number | null>(readBest());

  // ---- Actions -------------------------------------------------------------

  start(): void {
    this.lastPart = null;
    const pool = this.topic() === 'all' ? this.bank : this.bank.filter((q) => q.topic === this.topic());
    const topicLabel = this.topics.find((item) => item.id === this.topic())?.label ?? 'كل المواضيع';
    this.launch(shuffle(pool).slice(0, this.effectiveCount()), `تدريب سريع — ${topicLabel}`);
  }

  /** Starts one of the reference exam models or a comprehensive exam directly. */
  startPreset(part: ExamPart): void {
    this.lastPart = part;
    this.timed.set(true);

    if (part.model) {
      // A numbered model is replayed in its original order, not shuffled: that
      // is the sequence the student will meet at the licensing department.
      const model = examModel(part.model);
      this.launch(model ? questionsForModel(model) : [], part.label);
      return;
    }

    if (part.group) {
      this.launch(shuffle(poolFor(part.group)).slice(0, part.count), part.label);
      return;
    }

    this.topic.set(part.topic ?? 'all');
    this.count.set(part.count);
    const pool = this.topic() === 'all' ? this.bank : this.bank.filter((q) => q.topic === this.topic());
    this.launch(shuffle(pool).slice(0, Math.min(part.count, pool.length)), part.label);
  }

  private launch(deck: Question[], title: string): void {
    this.stopAdvance();
    this.examTitle.set(title);
    this.deck.set(deck);
    this.answers.set(new Array(deck.length).fill(null));
    this.index.set(0);
    this.stage.set('running');

    this.stopTicker();
    if (this.timed()) {
      this.remaining.set(deck.length * SECONDS_PER_QUESTION);
      this.ticker = setInterval(() => {
        this.remaining.update((n) => n - 1);
        if (this.remaining() <= 0) {
          // Time up submits whatever the student has; unanswered questions
          // simply count as wrong, exactly like the real test.
          this.finish();
        }
      }, 1000);
    }
    scrollToTop();
  }

  answer(optionIndex: number): void {
    if (this.currentAnswered() || this.revealing()) return;

    const questionIndex = this.index();
    const correct = optionIndex === this.current().answer;
    this.answers.update((current) => {
      const next = [...current];
      next[questionIndex] = optionIndex;
      return next;
    });

    this.revealing.set(true);
    if (correct) {
      this.feedback.correct();
    } else {
      this.feedback.wrong();
    }

    // Keep the result visible long enough to register. A wrong answer stays
    // longer because the student also needs time to read the correct option.
    const delay = correct ? 1300 : 2300;
    this.advanceTimer = setTimeout(() => {
      this.advanceTimer = null;
      this.revealing.set(false);
      if (
        this.stage() === 'running' &&
        this.index() === questionIndex &&
        questionIndex < this.deck().length - 1
      ) {
        this.index.set(questionIndex + 1);
      }
    }, delay);
  }

  goTo(i: number): void {
    if (this.revealing() || i < 0 || i > this.furthest()) return;
    this.index.set(i);
  }

  next(): void {
    if (this.revealing() || !this.currentAnswered() || this.index() >= this.deck().length - 1) return;
    this.index.update((i) => i + 1);
  }

  prev(): void {
    if (!this.revealing() && this.index() > 0) {
      this.index.update((i) => i - 1);
    }
  }

  finish(): void {
    this.stopAdvance();
    this.stopTicker();
    this.stage.set('result');
    // Safe to be expressive now: the score is on screen anyway.
    if (this.passed()) {
      this.feedback.pass();
    } else {
      this.feedback.fail();
    }
    const pct = this.percent();
    if (this.best() === null || pct > (this.best() as number)) {
      this.best.set(pct);
      writeBest(pct);
    }
    scrollToTop();
  }

  requestFinish(): void {
    if (
      this.unansweredCount() > 0 &&
      typeof window !== 'undefined' &&
      !window.confirm(`بقي ${this.unansweredCount()} سؤالاً بلا إجابة. هل تريد تسليم الاختبار الآن؟`)
    ) {
      return;
    }
    this.finish();
  }

  restart(): void {
    this.stopAdvance();
    this.stopTicker();
    this.stage.set('setup');
    this.deck.set([]);
    this.answers.set([]);
    this.index.set(0);
    scrollToTop();
  }

  retrySame(): void {
    if (this.lastPart) {
      this.startPreset(this.lastPart);
    } else {
      this.start();
    }
  }

  setCount(n: number): void {
    this.count.set(n);
  }

  /** Status of the navigator pill for question `i`. */
  pillState(i: number): 'current' | 'answered' | 'empty' {
    if (i === this.index()) return 'current';
    return this.answers()[i] !== null ? 'answered' : 'empty';
  }

  optionLetter(i: number): string {
    return ['أ', 'ب', 'ج', 'د', 'هـ'][i] ?? `${i + 1}`;
  }

  // ---- Sign flashcards -----------------------------------------------------

  readonly signs = SIGNS;
  readonly shapes = SIGN_SHAPES;
  readonly shapeKeys = Object.keys(SIGN_SHAPES) as SignShape[];
  readonly shapeFilter = signal<SignShape | 'all'>('all');
  readonly flipped = signal<Set<string>>(new Set<string>());

  readonly visibleSigns = computed(() =>
    this.shapeFilter() === 'all' ? this.signs : this.signs.filter((s) => s.shape === this.shapeFilter()),
  );

  flip(id: string): void {
    this.flipped.update((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    this.feedback.tick();
  }

  isFlipped(id: string): boolean {
    return this.flipped().has(id);
  }

  flipAll(): void {
    const all = this.visibleSigns().map((s) => s.id);
    const everyFlipped = all.every((id) => this.flipped().has(id));
    this.flipped.set(everyFlipped ? new Set() : new Set(all));
  }

  /** Hands the student straight from the flashcards into a signs-only exam. */
  startSignsExam(): void {
    this.mode.set('exam');
    this.startPreset({
      label: 'اختبار الإشارات المرورية',
      topic: 'signs',
      count: 30,
    });
  }

  practiceTopic(topic: QuestionTopic): void {
    this.mode.set('exam');
    this.topic.set(topic);
    this.count.set(20);
    this.start();
  }

  // ---- Lifecycle -----------------------------------------------------------

  private stopTicker(): void {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  private stopAdvance(): void {
    if (this.advanceTimer) {
      clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
    }
    this.revealing.set(false);
  }

  ngOnDestroy(): void {
    this.stopAdvance();
    this.stopTicker();
  }

  constructor() {
    this.seo.set(
      'الفحص النظري التجريبي',
      `امتحان رخصة القيادة النظري التجريبي مجاناً: ${QUESTIONS.length} سؤالاً في ${EXAM_MODELS.length} نموذجاً لجميع الفئات، مع مؤقّت زمني ومراجعة للأخطاء وبطاقات الإشارات المرورية. ${SITE.name}`,
    );
  }
}

/** The numbered models of one licence class, as launchable exam parts. */
function partsFor(group: ExamGroupId): ExamPart[] {
  return EXAM_MODELS.filter((m) => m.group === group).map((m) => ({
    label: m.label,
    model: m.id,
    count: m.questionIds.length,
  }));
}

/** Every distinct question across one licence class's models. */
function poolFor(group: ExamGroupId): Question[] {
  const ids = new Set(EXAM_MODELS.filter((m) => m.group === group).flatMap((m) => m.questionIds));
  return QUESTIONS.filter((q) => ids.has(q.id));
}

function scrollToTop(): void {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/** Best score survives a reload so returning students can see progress. */
function readBest(): number | null {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
}

function writeBest(percent: number): void {
  try {
    localStorage.setItem(BEST_KEY, `${percent}`);
  } catch {
    // Private browsing blocks storage; the score just won't persist.
  }
}
