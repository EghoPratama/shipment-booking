import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly _message = signal<string | null>(null);
  private timer: ReturnType<typeof setTimeout> | undefined;

  readonly message = this._message.asReadonly();

  show(message: string, durationMs = 5000): void {
    this._message.set(message);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.dismiss(), durationMs);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this._message.set(null);
  }
}
