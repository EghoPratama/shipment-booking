import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingStore } from '../../../core/services/booking-store.service';
import { indonesianPhone } from '../../../shared/validators/indonesian-phone.validator';

@Component({
  selector: 'app-sender-step',
  imports: [ReactiveFormsModule],
  templateUrl: './sender-step.html',
  styleUrl: './sender-step.css',
})
export class SenderStep {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({
    name: new FormControl(this.store.sender()?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    phone: new FormControl(this.store.sender()?.phone ?? '', {
      nonNullable: true,
      validators: [Validators.required, indonesianPhone()],
    }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.store.saveSender({ ...value, phone: value.phone.replace(/[\s-]/g, '') });
    this.router.navigate(['/booking/recipient']);
  }
}
