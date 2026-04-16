import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  otpSent = false;
  otpVerified = false;
  otpVerifying = false;
  resendCooldown = 0;
  private resendTimer: ReturnType<typeof setInterval> | null = null;
  loading = false;
  message = '';
  error = '';

  constructor(private api: ApiService) {}

  sendOtp(): void {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.api.forgotPassword((this.email || '').trim().toLowerCase()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.otpSent = true;
        this.otpVerified = false;
        this.startResendCooldown();
        this.message = res?.message || 'OTP sent to your email.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to send OTP.';
      }
    });
  }

  verifyOtp(): void {
    this.otpVerifying = true;
    this.error = '';
    this.message = '';

    this.api.verifyForgotPasswordOtp((this.email || '').trim().toLowerCase(), (this.otp || '').trim()).subscribe({
      next: (res: any) => {
        this.otpVerifying = false;
        this.otpVerified = true;
        this.message = res?.message || 'OTP verified. You can now set a new password.';
      },
      error: (err) => {
        this.otpVerifying = false;
        this.otpVerified = false;
        this.error = err?.error?.message || 'Unable to verify OTP.';
      }
    });
  }

  resetPassword(): void {
    if (!this.otpVerified) {
      this.error = 'Please verify OTP before setting a new password.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Password and confirm password do not match.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    this.api.resetPassword({
      email: (this.email || '').trim().toLowerCase(),
      otp: (this.otp || '').trim(),
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res?.message || 'Password reset successful.';
        this.otp = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.otpVerified = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to reset password.';
      }
    });
  }

  private startResendCooldown(): void {
    this.resendCooldown = 30;
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }

    this.resendTimer = setInterval(() => {
      this.resendCooldown = Math.max(0, this.resendCooldown - 1);
      if (this.resendCooldown === 0 && this.resendTimer) {
        clearInterval(this.resendTimer);
        this.resendTimer = null;
      }
    }, 1000);
  }
}
