import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

const MAX_RETRIES = 2;

function isTransient(error: unknown): boolean {
  return error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500);
}

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Hanya GET yang aman diulang. POST/PUT bisa menggandakan data.
  if (req.method !== 'GET') return next(req);

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error, retryCount) =>
        isTransient(error) ? timer(retryCount * 500) : throwError(() => error),
    }),
  );
};
