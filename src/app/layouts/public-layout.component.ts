import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactFabComponent } from '../shared/ui/contact-fab.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ContactFabComponent],
  template: `
    <a href="#main-content" class="skip-link">تخطَّ إلى المحتوى</a>
    <div class="flex min-h-screen flex-col">
      <app-header />
      <main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
        <router-outlet />
      </main>
      <app-footer />
      <app-contact-fab />
    </div>
  `,
})
export class PublicLayoutComponent {}
