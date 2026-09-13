import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { FAQ, JOURNEY, PILLARS, STATS, TESTIMONIALS } from '../../core/data/content';
import { CURATED_QUESTIONS } from '../../core/data/curated-questions';
// Imported from the leaf modules, not the `questions` aggregator: going through
// the aggregator would pull the whole generated exam bank into the home bundle.
import { Question, shuffle } from '../../core/data/question.model';
import { FeedbackService } from '../../core/services/feedback.service';
import { SeoService } from '../../core/services/seo.service';
import { COACH, SITE, links } from '../../core/site';
import { IconComponent } from '../../shared/ui/icon.component';
import { StarsComponent } from '../../shared/ui/stars.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IconComponent, StarsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private seo = inject(SeoService);
  private feedback = inject(FeedbackService);

  readonly site = SITE;
  readonly coach = COACH;
  readonly categories = CATEGORIES;
  readonly stats = STATS;
  readonly pillars = PILLARS;
  readonly journey = JOURNEY;
  readonly testimonials = TESTIMONIALS;
  readonly faq = FAQ;

  readonly tel = links.tel;
  readonly waLink = links.wa(`مرحباً ${SITE.name}، أرغب بحجز درس تعليم قيادة. متى أقرب موعد متاح؟`);

  /** One FAQ row open at a time; -1 means all collapsed. */
  readonly openFaq = signal(-1);

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? -1 : index));
  }

  // ---- "Question of the moment" teaser -------------------------------------
  // A single live question on the home page does more to sell the free mock exam
  // than any amount of copy about it: the visitor answers, gets it wrong, and
  // clicks through to practise.

  readonly sample = signal<Question>(this.pickSample());
  readonly picked = signal<number | null>(null);

  private pickSample(): Question {
    // Drawn from the centre's own questions rather than the whole bank: these
    // are text-only and carry an explanation, which is what this card renders.
    return shuffle(CURATED_QUESTIONS)[0];
  }

  answerSample(index: number): void {
    if (this.picked() !== null) return;
    this.picked.set(index);
    // This card reveals the answer immediately, so a right/wrong cue gives
    // nothing away — unlike the exam, which stays neutral until submission.
    if (index === this.sample().answer) {
      this.feedback.correct();
    } else {
      this.feedback.wrong();
    }
  }

  nextSample(): void {
    this.picked.set(null);
    this.sample.set(this.pickSample());
  }

  get sampleCorrect(): boolean {
    return this.picked() === this.sample().answer;
  }

  constructor() {
    this.seo.set(
      'تعليم قيادة السيارات في الأردن',
      `${COACH.name} — مدرب قيادة معتمد بخبرة ${COACH.yearsExperience} عاماً. تدريب لجميع الفئات، فحص نظري تجريبي مجاني، وحجز مباشر على ${SITE.phoneDisplay}.`,
    );
  }
}
