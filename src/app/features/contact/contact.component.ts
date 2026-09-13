import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FAQ } from '../../core/data/content';
import { SeoService } from '../../core/services/seo.service';
import { COACH, SITE, links } from '../../core/site';
import { PageHeroComponent } from '../../shared/ui/page-hero.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [PageHeroComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  readonly site = SITE;
  readonly coach = COACH;
  readonly tel = links.tel;
  readonly mail = links.mail;
  readonly map = links.map;
  /** The URL is ours, built in `site.ts`; Angular blocks iframe srcs otherwise. */
  readonly mapEmbed = this.sanitizer.bypassSecurityTrustResourceUrl(links.mapEmbed);
  /** The first three FAQs answer most calls before they happen. */
  readonly faq = FAQ.slice(0, 3);

  readonly reasons = ['الاستفسار عن الأسعار', 'حجز درس تدريب', 'سؤال عن إجراءات الترخيص', 'موضوع آخر'];

  readonly name = signal('');
  readonly age = signal('');
  readonly nationalId = signal('');
  readonly licenseCategory = signal('');
  readonly phone = signal('');
  readonly reason = signal(this.reasons[0]);
  readonly message = signal('');
  readonly sent = signal(false);

  readonly phoneValid = computed(() => {
    const digits = this.phone().replace(/[^\d]/g, '');
    return /^07\d{8}$/.test(digits) || /^9627\d{8}$/.test(digits);
  });
  readonly nameValid = computed(() => this.name().trim().length >= 3);
  readonly canSend = computed(() => this.nameValid() && this.phoneValid() && this.message().trim().length >= 5);

  /** Same no-backend approach as the booking form: compose, then hand to WhatsApp. */
  readonly waLink = computed(() =>
    links.wa(
      [
        `مرحباً ${COACH.name},`,
        `• الاسم: ${this.name().trim() || '—'}`,
        `• العمر: ${this.age().trim() || '—'}`,
        `• الرقم الوطني: ${this.nationalId().trim() || '—'}`,
        `• فئة الرخصة: ${this.licenseCategory() || '—'}`,
        `• الهاتف: ${this.phone().trim() || '—'}`,
        `• الموضوع: ${this.reason()}`,
        `• الرسالة: ${this.message().trim() || '—'}`,
      ].join('\n'),
    ),
  );

  value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  }

  send(): void {
    if (!this.canSend()) return;
    this.sent.set(true);
    window.open(this.waLink(), '_blank', 'noopener');
  }

  constructor() {
    this.seo.set(
      'اتصل بنا',
      `تواصل مع ${SITE.name} على ${SITE.phoneDisplay} أو عبر واتساب. أوقات العمل ${SITE.hours.days} من ${SITE.hours.open} حتى ${SITE.hours.close}.`,
    );
  }
}
