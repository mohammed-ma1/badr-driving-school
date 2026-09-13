/**
 * Traffic-sign flashcards. `shape` drives the colour legend and `art` selects the
 * drawing in `TrafficSignComponent` — keep the two in sync when adding a sign.
 */
export type SignShape = 'warning' | 'prohibition' | 'mandatory' | 'guide';

export interface TrafficSign {
  id: string;
  name: string;
  shape: SignShape;
  meaning: string;
  /** The one thing a student actually has to *do*. Shown on the card back. */
  action: string;
}

export const SIGN_SHAPES: Record<SignShape, { label: string; hint: string; dot: string }> = {
  warning: { label: 'تحذيرية', hint: 'مثلث بإطار أحمر — تنبّه لخطر قادم', dot: 'bg-amber-500' },
  prohibition: { label: 'تنظيمية / منع', hint: 'دائرة بإطار أحمر — منع أو تحديد', dot: 'bg-red-500' },
  mandatory: { label: 'إلزامية', hint: 'دائرة زرقاء — أمر يجب تنفيذه', dot: 'bg-blue-600' },
  guide: { label: 'إرشادية', hint: 'مستطيل أزرق أو أخضر — معلومات ودلالة', dot: 'bg-emerald-600' },
};

export const SIGNS: TrafficSign[] = [
  {
    id: 'stop',
    name: 'قف',
    shape: 'prohibition',
    meaning: 'وقوف إلزامي تام قبل خط الوقوف أو حدّ التقاطع.',
    action: 'توقف حتى ثبات المركبة تماماً، ثم تابع بعد التأكد من خلو الطريق. التخفيف وحده مخالفة.',
  },
  {
    id: 'yield',
    name: 'أعطِ الأولوية',
    shape: 'prohibition',
    meaning: 'الأولوية للمركبات على الطريق الذي تدخل إليه.',
    action: 'خفّف السرعة واستعدّ للتوقف. توقف فعلياً فقط إن كانت هناك مركبة قادمة.',
  },
  {
    id: 'no-entry',
    name: 'ممنوع الدخول',
    shape: 'prohibition',
    meaning: 'الطريق مغلق أمام جميع المركبات من هذا الاتجاه.',
    action: 'لا تدخل مهما كان الطريق خالياً — غالباً يكون باتجاه واحد معاكس.',
  },
  {
    id: 'speed-60',
    name: 'تحديد السرعة',
    shape: 'prohibition',
    meaning: 'الحدّ الأقصى للسرعة على هذا الجزء من الطريق.',
    action: 'لا تتجاوز الرقم المكتوب، وخفّف أكثر إذا كان الطقس أو الرؤية سيّئة.',
  },
  {
    id: 'no-overtaking',
    name: 'ممنوع التجاوز',
    shape: 'prohibition',
    meaning: 'يمنع تجاوز المركبات الأخرى حتى نهاية المنطقة.',
    action: 'ابقَ في مسارك مع مسافة أمان كافية حتى ترى إشارة نهاية المنع.',
  },
  {
    id: 'no-parking',
    name: 'ممنوع الوقوف',
    shape: 'prohibition',
    meaning: 'يمنع وقوف المركبة في هذا الموقع.',
    action: 'لا تترك المركبة هنا؛ التوقف اللحظي للإنزال قد يكون مسموحاً حسب اللوحة الفرعية.',
  },
  {
    id: 'no-horn',
    name: 'ممنوع استعمال المنبّه',
    shape: 'prohibition',
    meaning: 'منع استخدام الزامور، وتُوضع قرب المستشفيات والمدارس.',
    action: 'لا تستخدم المنبّه إلا لتجنّب خطر مباشر ووشيك.',
  },
  {
    id: 'pedestrian',
    name: 'ممر مترجّلين',
    shape: 'warning',
    meaning: 'ممر مشاة مخطّط على مسافة قريبة أمامك.',
    action: 'خفّف السرعة واستعدّ للتوقف. للمترجّل على الممر أولوية مطلقة.',
  },
  {
    id: 'children',
    name: 'انتبه — أطفال / مدرسة',
    shape: 'warning',
    meaning: 'منطقة مدرسة أو تواجد أطفال على الطريق.',
    action: 'خفّف إلى ٣٠–٤٠ كم/س وراقب بين المركبات الواقفة؛ الطفل قد يظهر مفاجئاً.',
  },
  {
    id: 'bump',
    name: 'مطبّ صناعي',
    shape: 'warning',
    meaning: 'مطبّ أو تعريجة على سطح الطريق.',
    action: 'خفّف قبل المطبّ لا عليه، وامرره باستقامة لتفادي إجهاد المقود والمخمّدات.',
  },
  {
    id: 'slippery',
    name: 'طريق زلق',
    shape: 'warning',
    meaning: 'سطح الطريق قد يكون زلقاً، خاصة بعد المطر.',
    action: 'خفّف السرعة وضاعف المسافة الآمنة، وتجنّب الفرملة أو المقود المفاجئ.',
  },
  {
    id: 'descent',
    name: 'منحدر خطر',
    shape: 'warning',
    meaning: 'هبوط حادّ بنسبة ميل مرتفعة.',
    action: 'انزل على سرعة منخفضة واستخدم الفرملة المحرّكية بدل الاستمرار على البدال.',
  },
  {
    id: 'curve',
    name: 'منحنى خطر',
    shape: 'warning',
    meaning: 'انعطاف حادّ في الطريق بالاتجاه المرسوم.',
    action: 'خفّف قبل المنحنى وابقَ في وسط مسارك؛ لا تفرمل في منتصف الانعطاف.',
  },
  {
    id: 'traffic-light',
    name: 'إشارة ضوئية أمامك',
    shape: 'warning',
    meaning: 'تقاطع منظّم بإشارة ضوئية على مسافة قريبة.',
    action: 'ارفع قدمك عن الوقود واستعدّ للتوقف، خاصة إذا كانت الإشارة خضراء منذ فترة.',
  },
  {
    id: 'roundabout',
    name: 'دوار إلزامي',
    shape: 'mandatory',
    meaning: 'عليك الدوران حول الجزيرة بالاتجاه المحدّد.',
    action: 'أعطِ الأولوية لمن هو داخل الدوار، وأشِر يميناً قبل الخروج منه.',
  },
  {
    id: 'straight',
    name: 'السير للأمام إلزامي',
    shape: 'mandatory',
    meaning: 'الاتجاه الوحيد المسموح هو الأمام.',
    action: 'لا تنعطف يميناً أو يساراً من هذا الموقع.',
  },
  {
    id: 'one-way',
    name: 'طريق باتجاه واحد',
    shape: 'guide',
    meaning: 'حركة السير على هذا الطريق باتجاه واحد فقط.',
    action: 'سِر بالاتجاه المرسوم، ويمكنك استخدام كامل عرض الطريق دون مركبات مقابلة.',
  },
  {
    id: 'hospital',
    name: 'مستشفى',
    shape: 'guide',
    meaning: 'خدمة طبية قريبة من الطريق.',
    action: 'خفّف السرعة وتجنّب المنبّه، وتوقّع دخول وخروج مركبات الإسعاف.',
  },
];
