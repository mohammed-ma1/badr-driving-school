import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { SeoService } from '../../core/services/seo.service';
import { COACH, SITE, links } from '../../core/site';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './booking.component.html',
})
export class BookingComponent {
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);

  readonly site = SITE;
  readonly coach = COACH;
  readonly categories = CATEGORIES;
  readonly tel = links.tel;

  // ---- Wizard --------------------------------------------------------------
  // There is no backend here on purpose: the form assembles a WhatsApp message
  // and hands off to the coach's own phone. That keeps the booking reliable (no
  // server to go down, no form-mail landing in spam) and means the coach replies
  // from the same thread he already uses with every other student.

  readonly steps = [
    { n: 1, title: 'ماذا تريد أن تتعلّم', icon: 'car' },
    { n: 2, title: 'متى يناسبك', icon: 'calendar' },
    { n: 3, title: 'بياناتك', icon: 'user' },
  ];

  readonly step = signal(1);

  // Step 1
  readonly categoryId = signal<string>('private');
  readonly transmission = signal<'auto' | 'manual' | 'any'>('auto');
  readonly experience = signal<'none' | 'some' | 'failed'>('none');

  // Step 2
  readonly days = signal<Set<string>>(new Set<string>());
  readonly timeSlot = signal<string>('');
  readonly pace = signal<string>('عاديّة — من درسين إلى ثلاثة أسبوعياً');
  readonly startWhen = signal<string>('هذا الأسبوع');

  // Step 3
  readonly fullName = signal('');
  readonly phone = signal('');
  readonly area = signal('');
  readonly notes = signal('');
  readonly submitted = signal(false);

  readonly dayOptions = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  readonly timeOptions = [
    { id: 'morning', label: 'صباحاً', note: '7:00 — 11:00' },
    { id: 'noon', label: 'ظهراً', note: '11:00 — 2:00' },
    { id: 'afternoon', label: 'بعد الظهر', note: '2:00 — 5:00' },
    { id: 'evening', label: 'مساءً', note: '5:00 — 7:00' },
  ];
  readonly paceOptions = [
    'مكثّفة — درس كل يوم',
    'عاديّة — من درسين إلى ثلاثة أسبوعياً',
    'مرنة — درس واحد أسبوعياً',
  ];
  readonly startOptions = ['هذا الأسبوع', 'الأسبوع القادم', 'خلال شهر', 'أستفسر فقط'];
  readonly experienceOptions = [
    { id: 'none', label: 'مبتدئ تماماً', note: 'لم أمسك مقوداً من قبل' },
    { id: 'some', label: 'لديّ خبرة بسيطة', note: 'سقت قليلاً لكن دون رخصة' },
    { id: 'failed', label: 'رسبت سابقاً', note: 'أحتاج تركيزاً على نقاط ضعفي' },
  ] as const;
  readonly transmissionOptions = [
    { id: 'auto', label: 'أوتوماتيك' },
    { id: 'manual', label: 'عادي (عصا)' },
    { id: 'any', label: 'لا يهمّ' },
  ] as const;

  readonly selectedCategory = computed(
    () => this.categories.find((c) => c.id === this.categoryId()) ?? this.categories[0],
  );

  /** Transmission only means something for the car classes. */
  readonly showTransmission = computed(() => ['private', 'public'].includes(this.categoryId()));

  // ---- Validation ----------------------------------------------------------
  // Jordanian mobiles are 10 digits starting 07, or the +962 7… international form.

  readonly phoneValid = computed(() => {
    const digits = this.phone().replace(/[^\d]/g, '');
    return /^07\d{8}$/.test(digits) || /^9627\d{8}$/.test(digits);
  });

  readonly nameValid = computed(() => this.fullName().trim().length >= 3);

  readonly canSubmit = computed(() => this.nameValid() && this.phoneValid());

  readonly stepValid = computed(() => {
    if (this.step() === 2) return this.days().size > 0 && this.timeSlot() !== '';
    if (this.step() === 3) return this.canSubmit();
    return true;
  });

  // ---- Actions -------------------------------------------------------------

  toggleDay(day: string): void {
    this.days.update((current) => {
      const next = new Set(current);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  hasDay(day: string): boolean {
    return this.days().has(day);
  }

  goToStep(n: number): void {
    // Backwards is always allowed so a visitor can revise an earlier answer.
    if (n < this.step() || this.stepValid()) {
      this.step.set(Math.min(3, Math.max(1, n)));
    }
  }

  nextStep(): void {
    if (this.stepValid()) this.step.update((n) => Math.min(3, n + 1));
  }

  prevStep(): void {
    this.step.update((n) => Math.max(1, n - 1));
  }

  /** Human-readable summary, reused by the review panel and the WhatsApp text. */
  readonly summary = computed(() => {
    const cat = this.selectedCategory();
    const slot = this.timeOptions.find((t) => t.id === this.timeSlot());
    const exp = this.experienceOptions.find((e) => e.id === this.experience());
    const rows: Array<{ label: string; value: string }> = [
      { label: 'الفئة', value: `${cat.label} — ${cat.subtitle}` },
    ];
    if (this.showTransmission()) {
      rows.push({
        label: 'ناقل الحركة',
        value: this.transmission() === 'auto' ? 'أوتوماتيك' : this.transmission() === 'manual' ? 'عادي' : 'لا يهمّ',
      });
    }
    rows.push(
      { label: 'مستوى الخبرة', value: exp?.label ?? '—' },
      { label: 'الأيام المناسبة', value: this.days().size ? [...this.days()].join('، ') : '—' },
      { label: 'الوقت المفضّل', value: slot ? `${slot.label} (${slot.note})` : '—' },
      { label: 'الوتيرة', value: this.pace() },
      { label: 'موعد البدء', value: this.startWhen() },
    );
    if (this.area().trim()) rows.push({ label: 'المنطقة', value: this.area().trim() });
    return rows;
  });

  readonly waLink = computed(() => {
    const body = [
      `مرحباً ${COACH.name}، أرغب بحجز دروس تعليم قيادة.`,
      '',
      ...this.summary().map((row) => `• ${row.label}: ${row.value}`),
      '',
      `• الاسم: ${this.fullName().trim() || '—'}`,
      `• رقم الهاتف: ${this.phone().trim() || '—'}`,
      this.notes().trim() ? `• ملاحظات: ${this.notes().trim()}` : '',
      '',
      '(أُرسلت من نموذج الحجز على الموقع)',
    ]
      .filter((line) => line !== '')
      .join('\n');
    return links.wa(body);
  });

  submit(): void {
    if (!this.canSubmit()) return;
    this.submitted.set(true);
    // Opened rather than navigated so the confirmation panel stays on screen
    // behind the WhatsApp tab — the visitor can still read their own summary.
    window.open(this.waLink(), '_blank', 'noopener');
  }

  reset(): void {
    this.submitted.set(false);
    this.step.set(1);
  }

  /** Unwraps the typed value so templates can stay `(input)="x.set(value($event))"`. */
  value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  constructor() {
    // Deep links from the services page preselect the category or package, so a
    // visitor who clicked "احجز لهذه الفئة" does not answer step 1 twice.
    const params = this.route.snapshot.queryParamMap;
    const category = params.get('category');
    if (category && this.categories.some((c) => c.id === category)) {
      this.categoryId.set(category);
    }
    const pkg = params.get('package');
    if (pkg === 'intensive') this.pace.set('مكثّفة — درس كل يوم');
    if (pkg === 'basic') this.experience.set('some');

    this.seo.set(
      'احجز موعد تدريب',
      `احجز درس تعليم قيادة مع ${COACH.name}. اختر الفئة والأيام المناسبة لك وأرسل الطلب مباشرة عبر واتساب، أو اتصل على ${SITE.phoneDisplay}`,
    );
  }
}
