import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeService } from './employee.service';

export interface User {
  id: string;
  role: 'employee' | 'hr' | 'admin';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private employeeService: EmployeeService) {
    // Load user from localStorage on service init
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(employeeId: string, password: string): Observable<User> {
    // Dummy login logic - replace with API call later
    const dummyUsers: { [key: string]: User } = {
      'EMP005': { id: 'EMP005', role: 'employee', name: 'John Doe' },
      'E002': { id: 'E002', role: 'employee', name: 'Alice Johnson' },
      'H001': { id: 'H001', role: 'hr', name: 'Jane Smith' },
      'H002': { id: 'H002', role: 'hr', name: 'Robert Brown' },
      'A001': { id: 'A001', role: 'admin', name: 'Admin User' }
    };

    return new Observable(observer => {
      setTimeout(() => {
        const user = dummyUsers[employeeId];
        if (user && password === 'password') {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          observer.next(user);
          observer.complete();
        } else {
          observer.error(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
