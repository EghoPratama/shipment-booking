import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-booking-shell',
  imports: [RouterOutlet],
  templateUrl: './booking-shell.html',
  styleUrl: './booking-shell.css',
})
export class BookingShell {
  private readonly router = inject(Router);

  protected readonly steps = [
    { path: 'sender', label: 'Pengirim' },
    { path: 'recipient', label: 'Penerima' },
    { path: 'package', label: 'Paket' },
    { path: 'summary', label: 'Ringkasan' },
  ];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentIndex = computed(() =>
    this.steps.findIndex((step) => this.url().includes(`/booking/${step.path}`)),
  );
}
