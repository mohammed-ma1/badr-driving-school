/**
 * The seven Jordanian licence classes the centre trains for. `lessons` and
 * `priceFrom` feed the cost calculator on the services page, so they are plain
 * numbers rather than formatted strings.
 *
 * NOTE FOR THE CENTRE: prices are indicative starting points — update them here
 * and every page (cards, calculator, packages) follows automatically.
 */
export interface LicenseCategory {
  /** URL/track key. */
  id: string;
  /** e.g. "الفئة الثالثة" */
  label: string;
  /** e.g. "خصوصي" */
  subtitle: string;
  icon: string;
  summary: string;
  /** Bullet list shown on the services page. */
  includes: string[];
  /** Typical number of practical lessons. */
  lessons: number;
  /** Minutes per lesson. */
  lessonMinutes: number;
  /** Starting price in JOD for the default package. */
  priceFrom: number;
  minAge: number;
  popular?: boolean;
}

export const CATEGORIES: LicenseCategory[] = [
  {
    id: 'private',
    label: 'الفئة الثالثة',
    subtitle: 'خصوصي — أوتوماتيك وعادي',
    icon: 'car',
    summary:
      'رخصة السيارات الخصوصية، وهي الأكثر طلباً. تدريب على ناقل الحركة الأوتوماتيكي أو العادي حسب اختيارك، بسيارات حديثة مزوّدة بدبل بدال أمان.',
    includes: [
      'دروس عملية بسيارة حديثة (أوتوماتيك أو عادي)',
      'تدريب على المواقف الموازية والعمودية',
      'دروس على الدوارات والطرق السريعة',
      'درس قيادة ليلية ودرس في الطقس المطري',
      'الفحص النظري التجريبي غير محدود على الموقع',
      'درس محاكاة اختبار مع تقييم مكتوب',
    ],
    lessons: 15,
    lessonMinutes: 45,
    priceFrom: 190,
    minAge: 18,
    popular: true,
  },
  {
    id: 'moto',
    label: 'الفئة الأولى',
    subtitle: 'دراجات نارية (1 و 2)',
    icon: 'moto',
    summary:
      'رخصة الدراجات النارية بفرعيها. تدريب يبدأ من التوازن والانطلاق في ساحة مغلقة وصولاً إلى القيادة الآمنة بين السيارات.',
    includes: [
      'تدريب التوازن والانطلاق في ساحة مغلقة',
      'الفرملة الطارئة والمناورة بين الحواجز',
      'قواعد السير الخاصة بالدراجات',
      'إرشادات معدّات الحماية الإلزامية',
      'الفحص النظري التجريبي على الموقع',
    ],
    lessons: 10,
    lessonMinutes: 45,
    priceFrom: 130,
    minAge: 18,
  },
  {
    id: 'agri',
    label: 'الفئة الثانية',
    subtitle: 'زراعي وإنشائي',
    icon: 'tractor',
    summary:
      'تدريب على المركبات الزراعية والآليات الإنشائية، مع التركيز على قواعد السلامة في مواقع العمل وحدود الحمولة والاتزان.',
    includes: [
      'تشغيل وقيادة الآليات الزراعية والإنشائية',
      'قواعد الاتزان والحمولة',
      'السلامة المهنية في مواقع العمل',
      'السير على الطرق العامة بالآليات البطيئة',
    ],
    lessons: 12,
    lessonMinutes: 60,
    priceFrom: 210,
    minAge: 18,
  },
  {
    id: 'public',
    label: 'الفئة الرابعة',
    subtitle: 'عمومي',
    icon: 'taxi',
    summary:
      'رخصة القيادة العمومية لمن يعمل في نقل الركاب. تدريب يشمل التعامل المهني مع الراكب وقواعد السير في المدن المزدحمة.',
    includes: [
      'دروس عملية بسيارة عمومي',
      'قواعد نقل الركاب والتعامل المهني',
      'القيادة في الازدحام وشوارع وسط البلد',
      'الفحص النظري التجريبي على الموقع',
    ],
    lessons: 12,
    lessonMinutes: 45,
    priceFrom: 200,
    minAge: 21,
  },
  {
    id: 'twoaxle',
    label: 'الفئة الخامسة',
    subtitle: 'محورين',
    icon: 'truck-sm',
    summary:
      'تدريب على مركبات المحورين، ونقطة الانتقال الطبيعية لمن يريد العمل في النقل والتوصيل قبل الانتقال للفئة السادسة.',
    includes: [
      'قيادة مركبات المحورين محمّلة وفارغة',
      'الرجوع للخلف والمناورة في المساحات الضيقة',
      'ربط الحمولة وتوزيعها',
      'الفرملة على المنحدرات',
    ],
    lessons: 14,
    lessonMinutes: 60,
    priceFrom: 260,
    minAge: 21,
  },
  {
    id: 'heavy',
    label: 'الفئة السادسة',
    subtitle: 'شاحنات وحافلات',
    icon: 'truck',
    summary:
      'أثقل الفئات وأكثرها حاجة لخبرة المدرب. تدريب على الشاحنات والحافلات مبني على سنوات عمل حقيقية على الطرق الخارجية.',
    includes: [
      'قيادة الشاحنات والحافلات على الطرق الخارجية',
      'الفرملة المحرّكية والهبوط على المنحدرات الطويلة',
      'المناورة والرجوع بمقطورة',
      'الفحص اليومي للمركبة قبل الانطلاق',
      'أوقات العمل والراحة وسجلات السائق',
    ],
    lessons: 18,
    lessonMinutes: 60,
    priceFrom: 340,
    minAge: 21,
  },
  {
    id: 'accessible',
    label: 'الفئة السابعة',
    subtitle: 'ذوي الاحتياجات الخاصة',
    icon: 'accessible',
    summary:
      'تدريب بسيارة مجهّزة بأدوات تحكّم يدوية، بخطة دروس تُبنى على قدرات كل طالب على حدة وبوتيرة يختارها هو.',
    includes: [
      'سيارة مجهّزة بأدوات تحكّم يدوية',
      'خطة دروس مخصّصة حسب القدرات',
      'مرونة كاملة في مدة الدرس وعدد الدروس',
      'مساندة في إجراءات الترخيص والتقارير الطبية',
    ],
    lessons: 16,
    lessonMinutes: 45,
    priceFrom: 190,
    minAge: 18,
  },
];

export function findCategory(id: string): LicenseCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
