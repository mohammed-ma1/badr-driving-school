import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      { path: 'theory', loadComponent: () => import('./features/theory/theory.component').then((m) => m.TheoryComponent) },
      { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent) },
      // Retired marketing pages now lead directly to the exam experience.
      { path: 'coach', redirectTo: 'theory' },
      { path: 'services', redirectTo: 'theory' },
      { path: 'booking', redirectTo: 'theory' },
      { path: 'about-us', redirectTo: 'theory' },
      { path: 'theoretical-examination', redirectTo: 'theory' },
      { path: 'contact-us', redirectTo: 'contact' },
      { path: 'about', redirectTo: 'theory' },
      { path: 'exam', redirectTo: 'theory' },
    ],
  },
  { path: '**', redirectTo: '' },
];
