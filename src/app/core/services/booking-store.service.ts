import { Injectable, signal } from '@angular/core';
import { PackageData, RecipientData, SenderData } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingStore {
  private readonly _sender = signal<SenderData | null>(null);
  private readonly _recipient = signal<RecipientData | null>(null);
  private readonly _packageData = signal<PackageData | null>(null);

  readonly sender = this._sender.asReadonly();
  readonly recipient = this._recipient.asReadonly();
  readonly packageData = this._packageData.asReadonly();

  saveSender(value: SenderData): void {
    this._sender.set(value);
  }

  saveRecipient(value: RecipientData): void {
    this._recipient.set(value);
  }

  savePackage(value: PackageData): void {
    this._packageData.set(value);
  }

  reset(): void {
    this._sender.set(null);
    this._recipient.set(null);
    this._packageData.set(null);
  }
}
