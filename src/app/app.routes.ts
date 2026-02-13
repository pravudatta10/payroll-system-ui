
import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { EmployeeManagementComponent } from './component/employee-management/employee-management.component';

import { PayrollManagementComponent } from './component/payroll-management/payroll-management.component';
import { EmployeeProfileComponent } from './component/employee-profile/employee-profile.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'employee-management', component: EmployeeManagementComponent },
	{ path: 'payroll-management', component: PayrollManagementComponent },
	{ path: 'employee-profile/:id', component: EmployeeProfileComponent },
];
