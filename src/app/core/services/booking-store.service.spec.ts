import { TestBed } from '@angular/core/testing';
import { BookingStore } from './booking-store.service';

describe('BookingStore', () => {
  let store: BookingStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(BookingStore);
  });

  it('awalnya kosong', () => {
    expect(store.sender()).toBeNull();
    expect(store.recipient()).toBeNull();
    expect(store.packageData()).toBeNull();
  });

  it('menyimpan data pengirim', () => {
    store.saveSender({ name: 'Egho', phone: '081234567890' });
    expect(store.sender()).toEqual({ name: 'Egho', phone: '081234567890' });
  });

  it('menyimpan data paket', () => {
    store.savePackage({ weightKg: 2, description: 'Buku', service: 'REGULAR' });
    expect(store.packageData()?.weightKg).toBe(2);
  });

  it('reset mengosongkan semua data', () => {
    store.saveSender({ name: 'Egho', phone: '081234567890' });
    store.savePackage({ weightKg: 2, description: 'Buku', service: 'EXPRESS' });
    store.reset();
    expect(store.sender()).toBeNull();
    expect(store.packageData()).toBeNull();
  });
});
