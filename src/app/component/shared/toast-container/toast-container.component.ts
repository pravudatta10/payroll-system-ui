import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NotificationMessage, NotificationService } from '../../../Service/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div *ngFor="let toast of toasts"
           class="alert alert-{{toast.type}} shadow mb-2">
        {{ toast.message }}
      </div>l̥
    </div>
  `
})
export class ToastContainerComponent implements OnInit {

  toasts: NotificationMessage[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(msg => {
      this.toasts.push(msg);

      setTimeout(() => {
        this.toasts.shift();
      }, 3000);
    });
  }
}