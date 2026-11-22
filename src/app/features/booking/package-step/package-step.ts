import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceType } from '../../../core/models/booking.model';
import { BookingStore } from '../../../core/services/booking-store.service';

@Component({
  selector: 'app-package-step',
  imports: [ReactiveFormsModule],
  templateUrl: './package-step.html',
  styleUrl: './package-step.css',
})
export class PackageStep {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  private readonly saved = this.store.packageData();

  protected readonly form = new FormGroup({
    weightKg: new FormControl<number | null>(this.saved?.weightKg ?? null, {
      validators: [Validators.required, Validators.min(0.1), Validators.max(70)],
    }),
    description: new FormControl(this.saved?.description ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    service: new FormControl<ServiceType>(this.saved?.service ?? 'REGULAR', {
      nonNullable: true,
    }),
  });

  protected onSubmit(): void {
    const { weightKg, description, service } = this.form.getRawValue();
    if (this.form.invalid || weightKg === null) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.savePackage({ weightKg, description, service });
    this.router.navigate(['/booking/summary']);
  }

  protected back(): void {
    this.router.navigate(['/booking/recipient']);
  }
}
