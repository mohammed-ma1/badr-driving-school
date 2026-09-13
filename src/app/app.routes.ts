import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      { path: 'coach', loadComponent: () => import('./features/coach/coach.component').then((m) => m.CoachComponent) },
      { path: 'services', loadComponent: () => import('./features/services/services.component').then((m) => m.ServicesComponent) },
      { path: 'theory', loadComponent: () => import('./features/theory/theory.component').then((m) => m.TheoryComponent) },
      { path: 'booking', loadComponent: () => import('./features/booking/booking.component').then((m) => m.BookingComponent) },
      { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent) },
      // Keep the same public URLs used by the reference website.
      { path: 'about-us', redirectTo: 'coach' },
      { path: 'theoretical-examination', redirectTo: 'theory' },
      { path: 'contact-us', redirectTo: 'contact' },
      { path: 'about', redirectTo: 'coach' },
      { path: 'exam', redirectTo: 'theory' },
    ],
  },
  { path: '**', redirectTo: '' },
];
