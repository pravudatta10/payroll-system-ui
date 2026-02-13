import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeService } from './employee.service';
import { Employee } from '../Interface/employee.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<Employee | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    employees: Employee[] = [];
    userInfo: any;
    constructor(private employeeService: EmployeeService) {
        // Load user from localStorage on service init
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    login(employeeId: string, password: string): Observable<Employee> {
        this.employeeService.getEmployeeByEmpCode(employeeId).subscribe({
            next: (emp) => {
                this.employees.push(emp);
            },
            error: () => {
                // Handle error if needed
            }
        });

        for (let emp of this.employees) {
            console.log(emp.empCode);

        }

        return new Observable(observer => {
            setTimeout(() => {
                const user = this.employees.find(emp => emp.empCode === employeeId);
                if (user && password === "password") {
                    this.userInfo = user;
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

    getCurrentUser(): Employee | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }
}
