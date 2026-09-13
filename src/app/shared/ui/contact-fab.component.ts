import { Component, HostListener, signal } from '@angular/core';
import { SITE, links } from '../../core/site';
import { IconComponent } from './icon.component';

/**
 * Floating call + WhatsApp buttons. On a driving-school site the phone number
 * *is* the conversion, so it stays one thumb-reach away on every screen.
 *
 * Hidden until the visitor scrolls past the hero, where the number is already
 * the largest thing on the page and the buttons would only cover it.
 */
@Component({
  selector: 'app-contact-fab',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (visible()) {
      <div class="fixed bottom-5 start-4 z-[90] flex flex-col items-start gap-3 animate-fade-in print:hidden">
        <a
          [href]="waLink"
          target="_blank"
          rel="noopener"
          class="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lifted transition-transform hover:scale-105 hover:w-auto hover:gap-2 hover:px-5"
          aria-label="تواصل عبر واتساب">
          <app-icon name="whatsapp" [size]="26" />
          <span class="hidden whitespace-nowrap text-sm font-bold group-hover:inline">واتساب</span>
        </a>
        <a
          [href]="tel"
          class="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-on-brand shadow-lifted transition-transform hover:scale-105 hover:w-auto hover:gap-2 hover:px-5"
          [attr.aria-label]="'اتصل الآن ' + phone">
          <span class="absolute inset-0 rounded-full bg-brand-500 animate-ping-slow" aria-hidden="true"></span>
          <app-icon name="phone" [size]="24" class="relative" />
          <span class="num relative hidden whitespace-nowrap text-sm font-bold group-hover:inline">{{ phone }}</span>
        </a>
      </div>
    }
  `,
})
export class ContactFabComponent {
  readonly phone = SITE.phoneDisplay;
  readonly tel = links.tel;
  readonly waLink = links.wa(`مرحباً ${SITE.name}، أرغب بالاستفسار عن دروس تعليم القيادة.`);

  readonly visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 600);
  }
}
