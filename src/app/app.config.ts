import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

// Needed so the date pipe can render Arabic month names (dates are RTL-embedded
// in the UI, and English month names read backwards there).
registerLocaleData(localeAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // `anchorScrolling` is what makes the footer's per-category links land on
      // the right card on the services page.
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
  ],
};
