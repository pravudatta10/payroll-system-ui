import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LeaveRequest, LeaveApplicationResponse } from '../Interface/leave.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  constructor(private readonly http: HttpClient) { }
  private readonly baseUrl = 'http://localhost:8080/api/leaves';

  applyLeave(payload: LeaveRequest): Observable<LeaveApplicationResponse> {
    return this.http.post<LeaveApplicationResponse>(this.baseUrl, payload);
  }

  // ==========================
  // Approve Leave (HR)
  // ==========================
  approveLeave(requestId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${requestId}/approve`,
      {}
    );
  }

  // ==========================
  // Reject Leave (HR)
  // ==========================
  rejectLeave(requestId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${requestId}/reject`,
      {}
    );
  }

  // ==========================
  // Get Leaves
  // empCode optional
  // ==========================
  getLeaves(empCode?: string): Observable<LeaveApplicationResponse[]> {

    let params = new HttpParams();

    if (empCode) {
      params = params.set('empCode', empCode);
    }

    return this.http.get<LeaveApplicationResponse[]>(
      this.baseUrl,
      { params }
    );
  }
}
