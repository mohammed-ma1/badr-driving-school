import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE, links } from '../core/site';
import { IconComponent } from '../shared/ui/icon.component';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <header class="absolute inset-x-0 top-0 z-[100] text-white">
      <div class="border-b border-white/15 bg-black/20">
        <div class="container-page flex h-10 items-center justify-between text-xs">
          <!-- The icons stay 15px, but each link fills the bar's full height so
               the tap target is finger-sized on a phone. -->
          <div class="-mx-2 flex items-center">
            <a [href]="social.facebook" target="_blank" rel="noopener" aria-label="فيسبوك" class="grid h-10 w-9 place-items-center transition-colors hover:text-brand-300"><app-icon name="facebook" [size]="15" /></a>
            <a [href]="social.instagram" target="_blank" rel="noopener" aria-label="إنستغرام" class="grid h-10 w-9 place-items-center transition-colors hover:text-brand-300"><app-icon name="instagram" [size]="15" /></a>
            <a [href]="social.tiktok" target="_blank" rel="noopener" aria-label="تيك توك" class="grid h-10 w-9 place-items-center transition-colors hover:text-brand-300"><app-icon name="tiktok" [size]="15" /></a>
          </div>
          <p class="hidden items-center gap-1.5 text-white/75 sm:flex">
            <app-icon name="map-pin" [size]="14" />
            {{ address }}
          </p>
          <a [href]="tel" class="num -mx-2 flex h-10 items-center gap-1.5 px-2 font-bold transition-colors hover:text-brand-300">
            <app-icon name="phone" [size]="14" />{{ phone }}
          </a>
        </div>
      </div>

      <div class="bg-black/45">
      <div class="container-page flex h-[86px] items-center justify-between gap-5">
        <a routerLink="/" class="flex shrink-0 items-center gap-2.5" aria-label="الصفحة الرئيسية">
          <span class="grid h-12 w-12 place-items-center rounded-full border-2 border-brand-400 text-brand-400">
            <app-icon name="wheel" [size]="27" />
          </span>
          <span class="hidden leading-tight sm:block">
            <span class="block text-base font-black">{{ siteName }}</span>
            <span class="text-[10px] font-semibold text-white/65">لتعليم قيادة السيارات</span>
          </span>
        </a>

        <nav class="hidden items-center gap-8 lg:flex" aria-label="التنقل الرئيسي">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="text-brand-300"
              [routerLinkActiveOptions]="{ exact: item.path === '/' }"
              class="text-sm font-semibold text-white/85 transition-colors hover:text-brand-300">
              {{ item.label }}
            </a>
          }
        </nav>

        <a routerLink="/theory" class="hidden rounded bg-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600 lg:inline-flex">
          تدرب الآن
        </a>

        <button
          type="button"
          (click)="drawer.set(!drawer())"
          class="grid h-11 w-11 place-items-center rounded border border-white/30 text-brand-300 lg:hidden"
          [attr.aria-expanded]="drawer()"
          aria-controls="mobile-drawer"
          aria-label="القائمة">
          <app-icon [name]="drawer() ? 'x' : 'menu'" [size]="24" />
        </button>
      </div>
      </div>
    </header>

    @if (drawer()) {
      <div class="fixed inset-0 z-[101] bg-black/55 lg:hidden" (click)="drawer.set(false)" aria-hidden="true"></div>
      <aside
        id="mobile-drawer"
        class="fixed inset-y-0 end-0 z-[102] flex w-[84%] max-w-sm flex-col overflow-y-auto bg-white p-6 text-ink shadow-lifted animate-slide-in-start lg:hidden">
        <div class="mb-4 flex items-center justify-between">
          <p class="font-black text-brand-600">{{ siteName }}</p>
          <button type="button" (click)="drawer.set(false)" class="grid h-9 w-9 place-items-center rounded-xl text-stone-500 hover:bg-brand-50" aria-label="إغلاق">
            <app-icon name="x" [size]="20" />
          </button>
        </div>

        @for (item of nav; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-brand-50 text-brand-700"
            [routerLinkActiveOptions]="{ exact: item.path === '/' }"
            (click)="drawer.set(false)"
            class="mobile-nav-link">
            <app-icon [name]="item.icon" [size]="20" class="text-brand-500" />
            {{ item.label }}
          </a>
        }

        <div class="mt-5 space-y-2.5 border-t border-brand-100 pt-5">
          <a routerLink="/theory" (click)="drawer.set(false)" class="btn-primary w-full">
            <app-icon name="clipboard" [size]="18" />تدرب الآن
          </a>
        </div>

        <div class="mt-5 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-stone-600">
          <p class="mb-1 font-bold text-ink">أوقات العمل</p>
          {{ hours.days }}<br />
          <span class="num">{{ hours.open }} — {{ hours.close }}</span>
        </div>
      </aside>
    }
  `,
})
export class HeaderComponent {
  readonly nav: NavItem[] = [
    { path: '/', label: 'الصفحة الرئيسية', icon: 'grid' },
    { path: '/coach', label: 'عن المركز', icon: 'user' },
    { path: '/services', label: 'خدماتنا', icon: 'car' },
    { path: '/theory', label: 'الفحص النظري', icon: 'clipboard' },
    { path: '/contact', label: 'اتصل بنا', icon: 'phone' },
  ];

  readonly siteName = SITE.name;
  readonly phone = SITE.phoneDisplay;
  readonly tel = links.tel;
  readonly waLink = links.wa(`مرحباً ${SITE.name}، أرغب بالاستفسار عن دروس تعليم القيادة.`);
  readonly hours = SITE.hours;
  readonly address = SITE.location.address;
  readonly social = SITE.social;

  readonly drawer = signal(false);

  /** Escape closes the drawer; without it the only way out is the overlay. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.drawer.set(false);
  }
}
