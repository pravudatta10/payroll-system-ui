import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeManagementComponent } from "./component/employee-management/employee-management.component";

@Component({
  selector: 'app-root',
  imports: [EmployeeManagementComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'payrollSystem';
}
