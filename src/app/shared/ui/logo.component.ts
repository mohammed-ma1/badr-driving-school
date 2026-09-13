import { Component, Input } from '@angular/core';
import { COACH, SITE } from '../../core/site';

/**
 * Wordmark: a steering wheel inside a rounded plate, next to the centre name.
 * The mark alone is used in tight spots (mobile header, favicon-ish contexts).
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-2.5" [class.gap-2]="compact">
      <span
        class="relative grid place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-soft"
        [class]="compact ? 'h-9 w-9' : 'h-11 w-11'">
        <svg [attr.width]="compact ? 20 : 24" [attr.height]="compact ? 20 : 24" viewBox="0 0 24 24" fill="none" stroke="#2a1206" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
          <path d="M12 9V3M14.6 13.5l5.2 3M9.4 13.5l-5.2 3" />
        </svg>
      </span>
      @if (!markOnly) {
        <span class="flex flex-col leading-none">
          <span class="text-[17px] font-black tracking-tight text-ink" [class.text-base]="compact">{{ coachName }}</span>
          <span class="mt-0.5 text-[11px] font-bold text-brand-600">لتعليم قيادة السيارات</span>
        </span>
      }
    </span>
  `,
})
export class LogoComponent {
  @Input() compact = false;
  @Input() markOnly = false;

  readonly coachName = COACH.name;
  readonly siteName = SITE.name;
}
