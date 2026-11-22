import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingStore } from '../services/booking-store.service';

type StepKey = 'sender' | 'recipient' | 'package';

/**
 * Guard untuk satu langkah booking. Menerima langkah-langkah yang
 * harus sudah terisi, dan mengarahkan ke langkah pertama yang masih kosong.
 */
export const bookingStepGuard =
  (...required: StepKey[]): CanActivateFn =>
  () => {
    const store = inject(BookingStore);
    const router = inject(Router);

    const filled: Record<StepKey, boolean> = {
      sender: store.sender() !== null,
      recipient: store.recipient() !== null,
      package: store.packageData() !== null,
    };

    const firstMissing = required.find((key) => !filled[key]);

    return firstMissing ? router.createUrlTree(['/booking', firstMissing]) : true;
  };
