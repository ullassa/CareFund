import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  submitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.valid) {
      this.isLoading = true;

      const payload = {
        email: (this.loginForm.get('email')?.value ?? '').trim().toLowerCase(),
        passwordHash: this.loginForm.get('password')?.value ?? ''
      };

      this.api.login(payload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response?.success && response?.token) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/']);
            return;
          }

          this.errorMessage = response?.message || 'Login failed. Please try again.';
        },
        error: (error) => {
          this.isLoading = false;
          const backendMessage = error?.error?.message;
          const backendDetails = error?.error?.details;
          const errorNumber = error?.error?.errorNumber;
          const statusCode = error?.status;

          if (backendMessage && backendDetails && errorNumber !== undefined) {
            this.errorMessage = `${backendMessage} [SQL ${errorNumber}] (${backendDetails})`;
            return;
          }

          if (backendMessage && backendDetails) {
            this.errorMessage = `${backendMessage} (${backendDetails})`;
            return;
          }

          if (backendMessage) {
            this.errorMessage = backendMessage;
            return;
          }

          if (statusCode === 503) {
            this.errorMessage = 'Database connection failed. Check SQL Server and connection string.';
            return;
          }

          if (statusCode === 500) {
            this.errorMessage = 'Server error while logging in. Check backend logs for SQL connection failure.';
            return;
          }

          this.errorMessage = 'Invalid email or password.';
        }
      });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
