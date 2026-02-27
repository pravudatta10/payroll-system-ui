import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../Interface/employee.model';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../Service/employee.service';
import { LeaveService } from '../../Service/leave.service';
import { LeaveRequest, LEAVE_TYPES, LeaveApplicationResponse } from '../../Interface/leave.model';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  employee: Employee | null = null;
  loading = true;
  error: string | null = null;

  leaveForm!: FormGroup;
  leaveTypes = LEAVE_TYPES;
  showLeaveForm = false;
  leaveSubmitting = false;
  leaveSuccess = false;
  leaveError: string | null = null;
  successMessage = '';

  minDate: string = '';
  leaveHistory: LeaveApplicationResponse[] = [];
  leaveHistoryLoading = false;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private fb: FormBuilder
  ) {
    this.initializeLeaveForm();
    this.setMinDate();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployeeByEmpCode(id).subscribe({
        next: (emp) => {
          this.employee = emp;
          this.loading = false;
        },
        error: () => {
          this.error = 'Employee not found.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No employee id provided.';
      this.loading = false;
    }
    if (id) {
      this.employeeService.getEmployeeByEmpCode(id).subscribe({
        next: (emp) => {
          this.employee = emp;
          this.loading = false;
          this.loadLeaveHistory(emp.empCode);
        },
        error: () => {
          this.error = 'Employee not found.';
          this.loading = false;
        }
      });
    }
  }

  initializeLeaveForm() {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  toggleLeaveForm() {
    this.showLeaveForm = !this.showLeaveForm;
    if (!this.showLeaveForm) {
      this.leaveForm.reset();
      this.leaveError = null;
      this.leaveSuccess = false;
    }
  }

  getAvailableLeaveBalance(leaveType: string): number {
    if (!this.employee) return 0;

    if (leaveType === 'PTO') {
      return this.employee.totalPTO - this.employee.usedPTO;
    } else if (leaveType === 'CLSL') {
      return this.employee.totalCLSL - this.employee.usedCLSL;
    }
    return 0;
  }

  calculateLeaveDays(): number {
    const fromDate = this.leaveForm.get('fromDate')?.value;
    const toDate = this.leaveForm.get('toDate')?.value;

    if (!fromDate || !toDate) return 0;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to < from) return 0;

    let days = 0;
    const current = new Date(from);

    while (current <= to) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  submitLeaveApplication() {
    if (this.leaveForm.invalid) {
      this.leaveError = 'Please fill in all required fields correctly.';
      return;
    }

    const leaveDays = this.calculateLeaveDays();
    if (leaveDays === 0) {
      this.leaveError = 'Please select valid dates (must be business days).';
      return;
    }

    const leaveType = this.leaveForm.get('leaveType')?.value;
    const availableBalance = this.getAvailableLeaveBalance(leaveType);

    if (leaveDays > availableBalance) {
      this.leaveError = `Insufficient leave balance. Available: ${availableBalance} days, Requested: ${leaveDays} days.`;
      return;
    }

    this.leaveSubmitting = true;
    const leaveRequest: LeaveRequest = {
      empCode: this.employee?.empCode || '',
      leaveType: leaveType,
      fromDate: this.leaveForm.get('fromDate')?.value,
      toDate: this.leaveForm.get('toDate')?.value,
      reason: this.leaveForm.get('reason')?.value
    };

    this.leaveService.applyLeave(leaveRequest).subscribe({
      next: (response) => {
        this.leaveSubmitting = false;
        this.leaveSuccess = true;
        this.successMessage = `Leave application submitted successfully for ${leaveDays} days.`;
        this.leaveHistory.unshift(response);
        this.leaveForm.reset();
        setTimeout(() => {
          this.showLeaveForm = false;
          this.leaveSuccess = false;
        }, 3000);
      },
      error: (err) => {
        this.leaveSubmitting = false;
        this.leaveError = 'Failed to submit leave application. Please try again.';
      }
    });
  }
  loadLeaveHistory(empCode: string) {
    this.leaveHistoryLoading = true;
    this.leaveService.getLeaves(empCode).subscribe({
      next: (data) => {
        this.leaveHistory = data;
        this.leaveHistoryLoading = false;
      },
      error: () => {
        this.leaveHistoryLoading = false;
      }
    });
  }

}
