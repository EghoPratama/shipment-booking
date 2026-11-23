import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationStore } from '../services/notification-store.service';

function toMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Terjadi kesalahan tak terduga.';
  if (error.status === 0) return 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
  if (error.status === 404) return 'Data tidak ditemukan.';
  if (error.status >= 500) return 'Server sedang bermasalah. Coba lagi nanti.';
  return 'Permintaan gagal. Coba lagi.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationStore);

  return next(req).pipe(
    catchError((error: unknown) => {
      notifications.show(toMessage(error));
      return throwError(() => error);
    }),
  );
};
