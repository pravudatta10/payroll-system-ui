import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  employeeId = '';
  password = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.employeeId, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.role === 'employee') {
          this.router.navigate(['/employee-profile', user.id]);
        } else if (user.role === 'hr' || user.role === 'admin') {
          this.router.navigate(['/employee-management']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid Employee ID or Password';
      }
    });
  }
}
