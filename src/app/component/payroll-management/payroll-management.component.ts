import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HrPayrollView } from '../../Interface/payroll.model';
import { PayrollService } from '../../Service/payroll.service';

@Component({
  selector: 'app-payroll-management',
  templateUrl: './payroll-management.component.html',
  styleUrls: ['./payroll-management.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]

})
export class PayrollManagementComponent implements OnInit {

  filterForm!: FormGroup;
  payrollList: HrPayrollView[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      year: [new Date().getFullYear()],
      month: [new Date().getMonth() + 1]
    });
  }

  loadPayroll(): void {
    const { year, month } = this.filterForm.value;

    this.loading = true;

    this.payrollService.getHrPayrollView(year, month)
      .subscribe({
        next: (data) => {
          this.payrollList = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  generatePayroll(employeeId: number): void {
    const { year, month } = this.filterForm.value;

    this.payrollService.generatePayroll(employeeId, year, month)
      .subscribe({
        next: () => {
          this.loadPayroll(); // refresh table
        },
        error: (err) => console.error(err)
      });
  }

  downloadPayroll(employeeId: number): void {
    const { year, month } = this.filterForm.value;

    this.payrollService.downloadPayroll(employeeId, year, month)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `payslip-${employeeId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => console.error(err)
      });
  }
}