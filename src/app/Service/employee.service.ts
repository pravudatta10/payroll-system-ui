
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, EmployeeFormPayload, OnboardingResponse } from '../Interface/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/employees';

  constructor(private readonly http: HttpClient) { }

  getActiveEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  createEmployee(payload: EmployeeFormPayload): Observable<OnboardingResponse> {
    return this.http.post<OnboardingResponse>(this.baseUrl, payload);
  }

  updateEmployee(empCode: string, payload: EmployeeFormPayload): Observable<OnboardingResponse> {
    return this.http.put<OnboardingResponse>(`${this.baseUrl}/${empCode}`, payload);
  }

  deactivateEmployee(empCode: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${empCode}`);
  }
  getEmployeeByEmpCode(empCode: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${empCode}`);
  }
  getPayslip(empId: number, year: number, month: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8080/api/employee/payroll?employeeId=${empId}&year=${year}&month=${month}`
    );
  }

  downloadPayslip(empId: number, year: number, month: number): Observable<Blob> {
    return this.http.get(
      `http://localhost:8080/api/download?employeeId=${empId}&year=${year}&month=${month}`,
      { responseType: 'blob' }
    );
  }
}
