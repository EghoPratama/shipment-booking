import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingStore } from '../../../core/services/booking-store.service';

@Component({
  selector: 'app-summary-step',
  imports: [CurrencyPipe],
  templateUrl: './summary-step.html',
  styleUrl: './summary-step.css',
})
export class SummaryStep {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly summary = computed(() => {
    const sender = this.store.sender();
    const recipient = this.store.recipient();
    const pkg = this.store.packageData();
    if (!sender || !recipient || !pkg) return null;

    // Tarif mock untuk demo, bukan data ongkir sungguhan
    const ratePerKg = pkg.service === 'EXPRESS' ? 18000 : 10000;
    const cost = Math.ceil(pkg.weightKg) * ratePerKg;

    return { sender, recipient, pkg, cost };
  });

  protected confirm(): void {
    console.log('Booking confirmed:', this.summary());
  }

  protected back(): void {
    this.router.navigate(['/booking/package']);
  }
}
