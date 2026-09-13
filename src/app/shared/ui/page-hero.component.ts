import { Component, Input } from '@angular/core';

/**
 * The standard header for every inner page.
 *
 * Deliberately built from type, gradient and a road motif rather than a
 * photograph: the centre only has one usable photo, and repeating it behind
 * every page header made the site look like a template. Keeping the photo for
 * the home hero and the coach profile — where it actually says something — and
 * drawing everything else buys consistency and costs no bandwidth.
 */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  template: `
    <section class="page-hero relative isolate overflow-hidden bg-asphalt-900 text-white">
      <div class="hero-glow absolute inset-0" aria-hidden="true"></div>
      <div class="hero-grid absolute inset-0" aria-hidden="true"></div>
      <div class="hero-lane absolute inset-x-0 bottom-0 h-16" aria-hidden="true"></div>

      <div class="container-page relative flex min-h-[300px] flex-col justify-center pb-14 pt-32 md:min-h-[340px] md:pt-36">
        <div class="max-w-3xl">
          @if (eyebrow) {
            <span
              class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wide text-white/85 backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-brand-400"></span>
              {{ eyebrow }}
            </span>
          }

          <h1 class="text-3xl font-black leading-tight tracking-tight md:text-5xl">{{ title }}</h1>

          @if (subtitle) {
            <p class="mt-5 max-w-2xl text-[15px] leading-8 text-white/65 md:text-base">{{ subtitle }}</p>
          }

          <ng-content />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-glow {
        background:
          radial-gradient(38rem 20rem at 88% -10%, rgba(249, 115, 22, 0.28), transparent 70%),
          radial-gradient(30rem 18rem at 6% 110%, rgba(249, 115, 22, 0.12), transparent 70%);
      }

      /* RTL pages read right-to-left, so the warm light sits on the start edge. */
      :host-context([dir='rtl']) .hero-glow {
        background:
          radial-gradient(38rem 20rem at 12% -10%, rgba(249, 115, 22, 0.28), transparent 70%),
          radial-gradient(30rem 18rem at 94% 110%, rgba(249, 115, 22, 0.12), transparent 70%);
      }

      .hero-grid {
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
        background-size: 64px 64px;
        mask-image: radial-gradient(70% 70% at 50% 30%, #000, transparent);
      }

      .hero-lane {
        background:
          linear-gradient(to top, rgba(15, 17, 21, 0.9), transparent),
          repeating-linear-gradient(
            90deg,
            transparent 0 42px,
            rgba(249, 115, 22, 0.55) 42px 84px,
            transparent 84px 126px
          );
        background-size: 100% 100%, 126px 3px;
        background-position: center, center bottom 18px;
        background-repeat: no-repeat, repeat-x;
      }
    `,
  ],
})
export class PageHeroComponent {
  @Input({ required: true }) title!: string;
  @Input() eyebrow?: string;
  @Input() subtitle?: string;
}
