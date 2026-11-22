import { Routes } from '@angular/router';
import { bookingStepGuard } from './core/guards/booking-step.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'booking' },
  {
    path: 'booking',
    loadComponent: () =>
      import('./features/booking/booking-shell/booking-shell').then((m) => m.BookingShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sender' },
      {
        path: 'sender',
        loadComponent: () =>
          import('./features/booking/sender-step/sender-step').then((m) => m.SenderStep),
      },
      {
        path: 'recipient',
        canActivate: [bookingStepGuard('sender')],
        loadComponent: () =>
          import('./features/booking/booking-page/booking-page').then((m) => m.BookingPage),
      },
      {
        path: 'package',
        canActivate: [bookingStepGuard('sender', 'recipient')],
        loadComponent: () =>
          import('./features/booking/package-step/package-step').then((m) => m.PackageStep),
      },
      {
        path: 'summary',
        canActivate: [bookingStepGuard('sender', 'recipient', 'package')],
        loadComponent: () =>
          import('./features/booking/summary-step/summary-step').then((m) => m.SummaryStep),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found/not-found').then((m) => m.NotFound),
  },
];
