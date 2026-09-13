import { Component, computed, inject, signal } from '@angular/core';
import { CATEGORIES, LicenseCategory } from '../../core/data/categories';
import { SeoService } from '../../core/services/seo.service';
import { COACH, SITE, links } from '../../core/site';
import { IconComponent } from '../../shared/ui/icon.component';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';

interface Extra {
  id: string;
  label: string;
  note: string;
  price: number;
  icon: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [IconComponent, PageHeroComponent],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  private seo = inject(SeoService);

  readonly site = SITE;
  readonly coach = COACH;
  readonly categories = CATEGORIES;
  readonly tel = links.tel;

  // ---- Cost & duration calculator -----------------------------------------
  // Students ask "how much" and "how long" in the same breath, so the calculator
  // answers both from one set of inputs. Every number it shows is derived from
  // the category data, so updating a price in one place updates the estimate.

  readonly extras: Extra[] = [
    { id: 'pickup', label: 'استلام من موقعك', note: 'داخل عمّان — للدروس كاملة', price: 20, icon: 'map-pin' },
    { id: 'night', label: 'درسان ليليان', note: 'قيادة بعد المغرب وفي الإضاءة الضعيفة', price: 25, icon: 'clock' },
    { id: 'highway', label: 'درس على الطريق السريع', note: 'دخول وخروج ومسارات التجاوز', price: 18, icon: 'road' },
    { id: 'simulation', label: 'درس محاكاة الاختبار', note: 'اختبار كامل + تقييم مكتوب', price: 22, icon: 'clipboard' },
  ];

  readonly selectedId = signal<string>(CATEGORIES[0].id);
  readonly lessons = signal<number>(CATEGORIES[0].lessons);
  readonly perWeek = signal<number>(3);
  readonly chosenExtras = signal<Set<string>>(new Set<string>(['simulation']));

  readonly selected = computed<LicenseCategory>(
    () => this.categories.find((c) => c.id === this.selectedId()) ?? this.categories[0],
  );

  /** Per-lesson rate implied by the package price, used to price lessons added or removed. */
  readonly lessonRate = computed(() => Math.round(this.selected().priceFrom / this.selected().lessons));

  readonly extrasTotal = computed(() =>
    this.extras.filter((e) => this.chosenExtras().has(e.id)).reduce((sum, e) => sum + e.price, 0),
  );

  readonly lessonsTotal = computed(() => this.lessons() * this.lessonRate());

  readonly total = computed(() => this.lessonsTotal() + this.extrasTotal());

  /** Calendar weeks needed at the chosen pace, plus a week for paperwork and the test slot. */
  readonly weeks = computed(() => Math.ceil(this.lessons() / this.perWeek()) + 1);

  readonly totalHours = computed(() => Math.round((this.lessons() * this.selected().lessonMinutes) / 60));

  selectCategory(id: string): void {
    this.selectedId.set(id);
    // Reset to the recommended lesson count: a slider left at 18 lessons from the
    // truck package makes no sense once the visitor switches to a motorcycle.
    this.lessons.set(this.selected().lessons);
  }

  onLessons(event: Event): void {
    this.lessons.set(Number((event.target as HTMLInputElement).value));
  }

  onPerWeek(event: Event): void {
    this.perWeek.set(Number((event.target as HTMLInputElement).value));
  }

  toggleExtra(id: string): void {
    this.chosenExtras.update((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  hasExtra(id: string): boolean {
    return this.chosenExtras().has(id);
  }

  /** Hands the whole estimate to WhatsApp so the coach sees it without re-asking. */
  readonly quoteLink = computed(() =>
    links.wa(
      [
        `مرحباً ${COACH.name}، أرغب بالاستفسار عن تدريب القيادة:`,
        `• الفئة: ${this.selected().label} — ${this.selected().subtitle}`,
        `• عدد الدروس: ${this.lessons()}`,
        `• الوتيرة: ${this.perWeek()} دروس أسبوعياً`,
        this.extrasTotal() > 0
          ? `• إضافات: ${this.extras.filter((e) => this.chosenExtras().has(e.id)).map((e) => e.label).join('، ')}`
          : '• بدون إضافات',
        `• التقدير من الموقع: ${this.total()} دينار خلال ${this.weeks()} أسابيع تقريباً`,
      ].join('\n'),
    ),
  );

  // ---- Packages ------------------------------------------------------------

  readonly packages = [
    {
      id: 'basic',
      name: 'الباقة الأساسية',
      tag: 'للمتمكّن',
      lessons: 10,
      price: 130,
      body: 'لمن لديه خبرة سابقة أو يحتاج تأسيساً سريعاً قبل الاختبار.',
      features: ['١٠ دروس عملية', 'تدريب على المواقف', 'الفحص النظري التجريبي مجاناً', 'مساندة في إجراءات الترخيص'],
    },
    {
      id: 'complete',
      name: 'الباقة الشاملة',
      tag: 'الأكثر اختياراً',
      lessons: 15,
      price: 190,
      body: 'الباقة القياسية للفئة الثالثة، وهي ما نوصي به المبتدئ تماماً.',
      features: [
        '١٥ درساً عملياً',
        'دروس على الدوارات والطرق السريعة',
        'درس قيادة ليلية',
        'درس محاكاة اختبار + تقييم مكتوب',
        'الفحص النظري التجريبي غير محدود',
        'مساندة كاملة في إجراءات الترخيص',
      ],
      featured: true,
    },
    {
      id: 'intensive',
      name: 'الباقة المكثّفة',
      tag: 'الأسرع',
      lessons: 20,
      price: 250,
      body: 'دروس يومية لمن يريد رخصته في أسرع وقت ممكن — مسافر أو بدء عمل جديد.',
      features: [
        '٢٠ درساً عملياً بوتيرة يومية',
        'استلام من موقعك داخل عمّان',
        'دروس ليلية وفي الطقس المطري',
        'درسان لمحاكاة الاختبار',
        'أولوية في المواعيد',
        'متابعة حتى يوم الاختبار',
      ],
    },
  ];

  constructor() {
    this.seo.set(
      'خدماتنا والأسعار',
      `فئات التدريب والأسعار في ${SITE.name}: الفئات من الأولى حتى السابعة، باقات تبدأ من 130 ديناراً، وحاسبة تكلفة تفاعلية. للاستفسار: ${SITE.phoneDisplay}`,
    );
  }
}
