/**
 * Single source of truth for everything the centre might want to change without
 * touching a template: the phone number, the coach's name, hours and address.
 * Nothing else in the app should hardcode these.
 */
export const SITE = {
  name: 'المدرب بدر الجبور',
  nameFull: 'المدرب بدر الجبور لتعليم قيادة السيارات',
  tagline: 'تعليم قيادة السيارات لجميع الفئات في المملكة الأردنية الهاشمية',
  url: 'https://mohammed-ma1.github.io/badr-driving-school/',
  year: 2026,

  /** Dialable form (what `tel:` uses) and the grouped form shown on screen. */
  phone: '0772083839',
  phoneDisplay: '077 208 3839',
  phoneIntl: '+962772083839',
  /** wa.me refuses a leading +, and Jordanian numbers drop the leading 0. */
  whatsapp: '962772083839',

  email: 'info@badr-driving.jo',

  location: {
    city: 'عمّان',
    area: 'الأردن',
    address: 'المملكة الأردنية الهاشمية — عمّان',
    /** Replace with the centre's exact pin; the map embed reads from here. */
    mapQuery: 'Amman, Jordan',
  },

  hours: {
    days: 'السبت — الخميس',
    open: '7:00 صباحاً',
    close: '7:00 مساءً',
    closed: 'الجمعة',
  },

  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
  },
} as const;

/** The coach. Bio copy lives here so the profile page and the home spotlight never drift. */
export const COACH = {
  name: 'بدر الجبور',
  shortName: 'بدر الجبور',
  title: 'مدرب قيادة معتمد ومؤسس المركز',
  photo: 'coach-badr-car.jpg',
  yearsExperience: 18,
  graduates: 6500,
  successRate: 96,
  languages: ['العربية', 'الإنجليزية'],
  license: 'رخصة تدريب مهنية صادرة عن إدارة ترخيص السواقين والمركبات',

  intro:
    'مدرب قيادة معتمد بخبرة تمتد لأكثر من ١٨ عاماً على طرق المملكة، درّب خلالها آلاف السائقين على اختلاف فئاتهم وأعمارهم. أسلوبه في التدريب يقوم على الهدوء والصبر وبناء الثقة خطوة بخطوة، لا على الحفظ والتلقين.',

  story: [
    'بدأ بدر الجبور مسيرته في تعليم القيادة عام ٢٠٠٨، بعد سنوات من العمل في القيادة المهنية على الطرق الخارجية والشاحنات. هذه الخلفية العملية هي ما يميّز تدريبه: الطالب لا يتعلّم كيف ينجح في الاختبار فقط، بل كيف يتصرّف في المطر، في الازدحام، على المنحدرات، وفي اللحظة التي يخطئ فيها سائق آخر.',
    'مع الوقت تحوّل التدريب الفردي إلى مركز متكامل يغطي فئات القيادة السبع، مع أسطول من السيارات الحديثة المزوّدة بدبل بدال أمان، ومنظومة تدريب نظري إلكترونية يتمرّن عليها الطالب من بيته قبل أن يجلس خلف المقود.',
    'ما يفتخر به المدرب بدر أكثر من نسبة النجاح هو الرسائل التي تصله بعد سنوات من سائقين يقولون إن جملة قالها لهم في درس واحد جنّبتهم حادثاً. هذه هي الغاية: تخريج سائقين آمنين، لا حاملي رخص.',
  ],

  /** Shown as a vertical timeline on the coach page. */
  milestones: [
    { year: '2008', title: 'بداية المسيرة', body: 'الحصول على رخصة التدريب المهنية وبدء تعليم الفئة الثالثة (خصوصي).' },
    { year: '2012', title: 'التوسّع للفئات الثقيلة', body: 'اعتماد تدريب فئتي الشاحنات والحافلات بعد سنوات من القيادة المهنية على الطرق الخارجية.' },
    { year: '2017', title: 'تدريب ذوي الاحتياجات الخاصة', body: 'تجهيز سيارة بأدوات تحكّم يدوية وتدريب معتمد للفئة السابعة.' },
    { year: '2021', title: 'أسطول حديث', body: 'تحديث السيارات بموديلات مزوّدة بدبل بدال، كاميرا خلفية، وحساسات مساعدة.' },
    { year: '2026', title: 'المنظومة الإلكترونية', body: 'إطلاق الفحص النظري التجريبي وبطاقات الإشارات المرورية على الموقع مجاناً لكل الطلاب.' },
  ],

  certifications: [
    'رخصة تدريب مهنية — إدارة ترخيص السواقين والمركبات',
    'دورة القيادة الدفاعية (Defensive Driving)',
    'شهادة الإسعافات الأولية — جمعية الهلال الأحمر الأردني',
    'دورة تدريب قيادة المركبات المعدّلة لذوي الاحتياجات الخاصة',
    'رخصة قيادة الفئات من الأولى حتى السابعة',
  ],

  /** The teaching method, presented as four stages on the home page. */
  method: [
    {
      n: 1,
      title: 'جلسة التعرّف',
      body: 'قبل أي درس نجلس معك خمسة عشر دقيقة: مستوى خبرتك، مخاوفك، والوقت المتاح لك أسبوعياً. من هذه الجلسة نبني خطة دروسك.',
      icon: 'chat',
    },
    {
      n: 2,
      title: 'التأسيس في ساحة مغلقة',
      body: 'أول الدروس تكون بعيداً عن الشارع: التحكّم بالمقود، القابض والبدالات، الرجوع للخلف، والمواقف. لا ضغط ولا سيارات حولك.',
      icon: 'cone',
    },
    {
      n: 3,
      title: 'الشارع الحقيقي',
      body: 'ننتقل تدريجياً من الشوارع الفرعية إلى الدوارات والطرق السريعة، مع تدريب على القيادة الليلية وفي المطر.',
      icon: 'road',
    },
    {
      n: 4,
      title: 'محاكاة الاختبار',
      body: 'درس كامل على شكل اختبار حقيقي مع تقييم مكتوب لنقاط ضعفك، ثم الفحص النظري التجريبي حتى تصل لعلامة كاملة.',
      icon: 'medal',
    },
  ],
} as const;

/** Convenience builders so no template has to assemble a URL by hand. */
export const links = {
  tel: `tel:${SITE.phoneIntl}`,
  wa: (message: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`,
  mail: `mailto:${SITE.email}`,
  map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.location.mapQuery)}`,
  mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(SITE.location.mapQuery)}&z=12&output=embed`,
};
