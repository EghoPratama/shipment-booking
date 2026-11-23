import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionService } from './core/services/region.service';
import { NotificationStore } from './core/services/notification-store.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('shipment-booking');
  private readonly regionService = inject(RegionService);
  protected readonly notifications = inject(NotificationStore);

  constructor() {
    this.regionService.getProvinces().subscribe((data) => console.log(data));
  }
}
