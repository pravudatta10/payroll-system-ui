import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EmployeeService } from '../../Service/employee.service';
import { Employee, EmployeeFormPayload, OnboardingResponse } from '../../Interface/employee.model';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css'],
  imports: [CommonModule, ReactiveFormsModule,],
  standalone: true,
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  isLoading = false;
  notification: string | null = null;
  employeeForm;

  constructor(
    private readonly employeeService: EmployeeService,
    private formBuilder: FormBuilder,
  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      joiningDate: ['', Validators.required],
      basicSalary: [0, [Validators.required, Validators.min(0)]],
      hra: [0, [Validators.required, Validators.min(0)]],
      allowances: [0, [Validators.required, Validators.min(0)]],
      taxPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      pfPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService
      .getActiveEmployees()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
        },
        error: () => {
          this.notification = 'Unable to load employees at this time.';
        },
      });
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    console.log("this.selectedEmployee",this.selectedEmployee);
    
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      middleName: employee.middleName || '',
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
      basicSalary: employee.basicSalary ?? 0,
      hra: employee.hra ?? 0,
      allowances: employee.allowances ?? 0,
      taxPercentage: employee.taxPercentage ?? 0,
      pfPercentage: employee.pfPercentage ?? 0,
    });
  }

  clearSelection(): void {
    this.selectedEmployee = null;
    this.employeeForm.reset({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      department: '',
      designation: '',
      joiningDate: '',
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      taxPercentage: 0,
      pfPercentage: 0,
    });
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.notification = null;
    const payload = this.employeeForm.value as EmployeeFormPayload;
    this.isLoading = true;

    const request$ = this.selectedEmployee
      ? this.employeeService.updateEmployee(this.selectedEmployee.empCode, payload)
      : this.employeeService.createEmployee(payload);

    request$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.handleSuccess(response);
        },
        error: () => {
          this.notification = 'Unable to save employee. Please try again.';
        },
      });
  }

  deactivateEmployee(employee: Employee): void {
    this.notification = null;
    this.isLoading = true;
    this.employeeService
      .deactivateEmployee(employee.empCode)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.notification = `Employee ${employee.firstName} ${employee.lastName} has been deactivated.`;
          this.loadEmployees();
          if (this.selectedEmployee?.empCode === employee.empCode) {
            this.clearSelection();
          }
        },
        error: () => {
          this.notification = 'Unable to deactivate employee. Please try again.';
        },
      });
  }

  private handleSuccess(response: OnboardingResponse): void {
    this.notification = `Employee ${response.fullName} saved successfully.`;
    this.clearSelection();
    this.loadEmployees();
  }
}
