import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { SeoService } from '../../core/services/seo.service';
import { COACH, SITE, links } from '../../core/site';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-coach',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './coach.component.html',
})
export class CoachComponent {
  private seo = inject(SeoService);

  readonly site = SITE;
  readonly coach = COACH;
  readonly categories = CATEGORIES;
  readonly tel = links.tel;
  readonly waLink = links.wa(`مرحباً ${COACH.name}، أرغب بالاستفسار عن دروس تعليم القيادة.`);

  /** What the coach commits to, phrased as promises rather than features. */
  readonly promises = [
    {
      icon: 'clock',
      title: 'لن أتأخر عن موعدك',
      body: 'الدرس يبدأ في وقته وينتهي في وقته. إن حدث طارئ نُبلغك مسبقاً ونعوّض الوقت كاملاً في الدرس التالي.',
    },
    {
      icon: 'users',
      title: 'لن أرفع صوتي عليك',
      body: 'الخطأ جزء من التعلّم لا سبب للتوبيخ. الطالب الخائف لا يتعلّم، والصراخ يصنع سائقاً متردّداً في الشارع.',
    },
    {
      icon: 'target',
      title: 'لن أدفعك للاختبار قبل جهوزك',
      body: 'أخبرك بصراحة إن كنت تحتاج درسين إضافيين، بدل أن أدفعك لاختبار تدفع رسومه ثم ترسب فيه.',
    },
    {
      icon: 'shield',
      title: 'سأعلّمك لما بعد الرخصة',
      body: 'ما ستحتاجه فعلاً هو القيادة في المطر، والمنحدرات، والازدحام، وردّ فعلك حين يخطئ غيرك — وهذا ما ندرّب عليه.',
    },
  ];

  /** Answers the "will he suit me?" question for the four most common profiles. */
  readonly audiences = [
    { icon: 'user', title: 'المبتدئ تماماً', body: 'لم تمسك مقوداً من قبل؟ أول درسين في ساحة مغلقة بلا سيارات ولا ضغط.' },
    { icon: 'users', title: 'السيدات', body: 'احترام كامل، التزام بالمواعيد، ومرونة في اختيار أوقات الدروس حسب الدوام أو الدراسة.' },
    { icon: 'refresh', title: 'من رسب سابقاً', body: 'نحدّد سبب الرسوب بدقة ونعمل عليه وحده، بدل إعادة المنهج من الصفر.' },
    { icon: 'truck', title: 'الباحث عن عمل بالنقل', body: 'تدريب على الفئات الثقيلة من مدرب عمل سنوات على الطرق الخارجية فعلياً.' },
  ];

  constructor() {
    this.seo.set(
      `المدرب ${COACH.name}`,
      `${COACH.name} — ${COACH.title}. خبرة ${COACH.yearsExperience} عاماً، أكثر من ${COACH.graduates} طالب متخرّج، وتدريب لفئات القيادة السبع. للحجز: ${SITE.phoneDisplay}`,
    );
  }
}
