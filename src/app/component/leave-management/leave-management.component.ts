import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../Service/leave.service';
import { LeaveApplicationResponse } from '../../Interface/leave.model';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../Service/notification.service';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css'],
  imports: [CommonModule],
})
export class LeaveManagementComponent implements OnInit {

  leaves: LeaveApplicationResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(private leaveService: LeaveService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadPendingLeaves();
  }

  loadPendingLeaves(): void {
    this.loading = true;
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        console.log('Leave data:', data);
        
        this.leaves = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load leave requests';
        this.loading = false;
      }
    });
  }

approve(id: number): void {
  this.leaveService.approveLeave(id).subscribe({
    next: () => {
      this.leaves = this.leaves.filter(l => l.id !== id);
      this.notificationService.success('Leave approved successfully');
    },
    error: () => {
      this.notificationService.error('Approval failed');
    }
  });
}

  reject(id: number): void {
    if (!confirm('Reject this leave request?')) return;

    this.leaveService.rejectLeave(id).subscribe({
      next: () => {
        this.leaves = this.leaves.filter(l => l.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('Rejection failed');
      }
    });
  }
}
