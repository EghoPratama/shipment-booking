import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'booking' },
  {
    path: 'booking',
    loadComponent: () =>
      import('./features/booking/booking-page/booking-page').then((m) => m.BookingPage),
  },
  { path: '**', redirectTo: 'booking' },
];
