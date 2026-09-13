import { Component } from '@angular/core';
import { COACH, SITE, links } from '../core/site';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="mt-auto bg-[#202020] text-white/70">
      <div class="container-page grid gap-12 py-14 md:grid-cols-2">
        <div>
          <h3 class="mb-5 text-xl font-bold text-white">عن المركز</h3>
          <p class="max-w-md text-sm leading-8">
            المركز الأول والوحيد في المملكة الأردنية الهاشمية الذي يدرب جميع فئات القيادة،
            بإشراف المدرب المعتمد {{ coachName }}.
          </p>
        </div>

        <div>
          <h3 class="mb-5 text-xl font-bold text-white">تواصل</h3>
          <p class="text-sm">اتصل على:</p>
          <a [href]="tel" class="num mt-2 block text-xl font-bold text-brand-400 hover:text-brand-300">{{ phone }}</a>
          <p class="mt-6 text-sm font-bold text-white">أوقات العمل</p>
          <p class="mt-2 text-sm">{{ hours.days }}</p>
          <p class="num mt-1 text-sm">{{ hours.open }} - {{ hours.close }}</p>
        </div>
      </div>

      <div class="border-t border-white/10 bg-[#181818]">
        <div class="container-page py-5 text-center text-xs text-white/45">
          Copyright © <span class="num">{{ year }}</span> {{ siteNameFull }}
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly phone = SITE.phoneDisplay;
  readonly tel = links.tel;
  readonly hours = SITE.hours;
  readonly siteNameFull = SITE.nameFull;
  readonly coachName = COACH.name;
  readonly year = SITE.year;
}
