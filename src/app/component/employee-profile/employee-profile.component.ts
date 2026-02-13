import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../Interface/employee.model';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../Service/employee.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  employee: Employee | null = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) {
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
  }
}
