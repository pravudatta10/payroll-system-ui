// src/app/payroll/services/payroll.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { HrPayrollView, PayrollResponse } from '../Interface/payroll.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getHrPayrollView(year: number, month: number): Observable<HrPayrollView[]> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);

    return this.http.get<HrPayrollView[]>(
      `${this.baseUrl}/hr/payroll-view`,
      { params }
    );
  }

  generatePayroll(employeeId: number, year: number, month: number):
    Observable<PayrollResponse> {

    const params = new HttpParams()
      .set('employeeId', employeeId)
      .set('year', year)
      .set('month', month);

    return this.http.post<PayrollResponse>(
      `${this.baseUrl}/hr/generate`,
      null,
      { params }
    );
  }

  downloadPayroll(employeeId: number, year: number, month: number):
    Observable<Blob> {

    const params = new HttpParams()
      .set('employeeId', employeeId)
      .set('year', year)
      .set('month', month);

    return this.http.get(
      `${this.baseUrl}/download`,
      {
        params,
        responseType: 'blob'
      }
    );
  }
}