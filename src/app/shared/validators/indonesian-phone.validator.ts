import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const PHONE_PATTERN = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

export function indonesianPhone(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').replace(/[\s-]/g, '');

    // Biarkan Validators.required yang menangani nilai kosong
    if (!value) return null;

    return PHONE_PATTERN.test(value) ? null : { indonesianPhone: true };
  };
}
