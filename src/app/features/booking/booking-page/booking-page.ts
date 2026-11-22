import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { Province } from '../../../core/models/region.model';
import { RegionService } from '../../../core/services/region.service';

@Component({
  selector: 'app-booking-page',
  imports: [ReactiveFormsModule],
  templateUrl: './booking-page.html',
  styleUrl: './booking-page.css',
})
export class BookingPage {
  private readonly regionService = inject(RegionService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loadingRegencies = signal(false);
  protected readonly loadingDistricts = signal(false);
  protected readonly loadingVillages = signal(false);

  protected readonly form = new FormGroup({
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

  protected onSubmit(): void {
    if (this.form.invalid) return;
    console.log(this.form.getRawValue());
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
            tap(() => child.enable({ emitEvent: false })),
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
