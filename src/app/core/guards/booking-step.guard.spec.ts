import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BookingStore } from '../services/booking-store.service';
import { bookingStepGuard } from './booking-step.guard';

describe('bookingStepGuard', () => {
  let store: BookingStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    store = TestBed.inject(BookingStore);
    router = TestBed.inject(Router);
  });

  function run(...required: ('sender' | 'recipient' | 'package')[]) {
    return TestBed.runInInjectionContext(() =>
      bookingStepGuard(...required)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  it('mengarahkan ke langkah pengirim bila masih kosong', () => {
    const result = run('sender');
    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/booking/sender');
  });

  it('mengizinkan akses bila data pengirim sudah ada', () => {
    store.saveSender({ name: 'Egho', phone: '081234567890' });
    expect(run('sender')).toBe(true);
  });

  it('mengarahkan ke langkah pertama yang belum terisi', () => {
    store.saveSender({ name: 'Egho', phone: '081234567890' });
    const result = run('sender', 'recipient');
    expect(router.serializeUrl(result as UrlTree)).toBe('/booking/recipient');
  });
});
