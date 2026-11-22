import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { Province } from '../../../core/models/region.model';
import { BookingStore } from '../../../core/services/booking-store.service';
import { RegionService } from '../../../core/services/region.service';

@Component({
  selector: 'app-booking-page',
  imports: [ReactiveFormsModule],
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.css',
})
export class BookingPage {
  private readonly regionService = inject(RegionService);
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  // Nilai tersimpan yang menunggu opsi dropdown selesai dimuat
  private readonly pendingRestore = new Map<FormControl<string>, string>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loadingRegencies = signal(false);
  protected readonly loadingDistricts = signal(false);
  protected readonly loadingVillages = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    provinceId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    regencyId: new FormControl(
      { value: '', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    districtId: new FormControl(
      { value: '', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    villageId: new FormControl(
      { value: '', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
  });

  protected readonly provinces = toSignal(
    this.regionService.getProvinces().pipe(
      catchError(() => {
        this.errorMessage.set('Gagal memuat data wilayah. Coba lagi nanti.');
        return of([] as Province[]);
      }),
    ),
    { initialValue: [] as Province[] },
  );

  protected readonly regencies = this.cascadeOptions(
    this.form.controls.provinceId,
    this.form.controls.regencyId,
    (id) => this.regionService.getRegencies(id),
    this.loadingRegencies,
  );

  protected readonly districts = this.cascadeOptions(
    this.form.controls.regencyId,
    this.form.controls.districtId,
    (id) => this.regionService.getDistricts(id),
    this.loadingDistricts,
  );

  protected readonly villages = this.cascadeOptions(
    this.form.controls.districtId,
    this.form.controls.villageId,
    (id) => this.regionService.getVillages(id),
    this.loadingVillages,
  );

  constructor() {
    const saved = this.store.recipient();
    if (!saved) return;

    // Anak-anaknya diisi bertahap oleh cascadeOptions setelah opsinya dimuat
    this.pendingRestore.set(this.form.controls.regencyId, saved.regencyId);
    this.pendingRestore.set(this.form.controls.districtId, saved.districtId);
    this.pendingRestore.set(this.form.controls.villageId, saved.villageId);

    this.form.patchValue({
      name: saved.name,
      street: saved.street,
      provinceId: saved.provinceId,
    });
  }

  /** Form dianggap lengkap bila semua field (termasuk yang disabled) terisi dan valid. */
  protected isComplete(): boolean {
    const raw = this.form.getRawValue();
    return this.form.valid && Object.values(raw).every((value) => value.trim() !== '');
  }

  protected onSubmit(): void {
    if (!this.isComplete()) return;

    const v = this.form.getRawValue();
    this.store.saveRecipient({
      name: v.name,
      street: v.street,
      provinceId: v.provinceId,
      provinceName: this.nameOf(this.provinces(), v.provinceId),
      regencyId: v.regencyId,
      regencyName: this.nameOf(this.regencies(), v.regencyId),
      districtId: v.districtId,
      districtName: this.nameOf(this.districts(), v.districtId),
      villageId: v.villageId,
      villageName: this.nameOf(this.villages(), v.villageId),
    });
    this.router.navigate(['/booking/package']);
  }

  protected back(): void {
    this.router.navigate(['/booking/sender']);
  }

  private nameOf(list: { id: string; name: string }[], id: string): string {
    return list.find((item) => item.id === id)?.name ?? '';
  }

  /**
   * Saat `parent` berubah: kosongkan dan nonaktifkan `child`,
   * lalu ambil opsi baru dan aktifkan `child` kembali.
   */
  private cascadeOptions<T>(
    parent: FormControl<string>,
    child: FormControl<string>,
    fetchOptions: (parentId: string) => Observable<T[]>,
    loading: WritableSignal<boolean>,
  ): Signal<T[]> {
    return toSignal(
      parent.valueChanges.pipe(
        tap(() => {
          this.errorMessage.set(null);
          child.reset();
          child.disable({ emitEvent: false });
        }),
        switchMap((parentId) => {
          if (!parentId) return of([] as T[]);

          loading.set(true);
          return fetchOptions(parentId).pipe(
            tap(() => {
              child.enable({ emitEvent: false });
              const saved = this.pendingRestore.get(child);
              if (saved) {
                this.pendingRestore.delete(child);
                child.setValue(saved);
              }
            }),
            catchError(() => {
              this.errorMessage.set('Gagal memuat data wilayah. Coba lagi nanti.');
              return of([] as T[]);
            }),
            finalize(() => loading.set(false)),
          );
        }),
      ),
      { initialValue: [] as T[] },
    );
  }
}
