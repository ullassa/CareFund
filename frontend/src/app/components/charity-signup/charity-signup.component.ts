import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-charity-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './charity-signup.component.html',
  styleUrls: ['./charity-signup.component.css']
})
export class CharitySignupComponent implements OnInit {
  signupForm!: FormGroup;
  currentStep = 1;
  totalSteps = 5;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  submitted = false;
  errorMessage = '';

  // OTP Variables
  emailOtpSent = false;
  phoneOtpSent = false;
  emailOtpVerified = false;
  phoneOtpVerified = false;
  emailOtpError = '';
  phoneOtpError = '';

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signupForm = this.fb.group({
      // Step 1: Organization Info
      organizationName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      emailOtp: [''],
      
      // Step 2: Phone Verification
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,}$/)]],
      phoneOtp: [''],
      
      // Step 3: Password
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      
      // Step 4: Registration Details
      dob: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      
      // Step 5: Charity Details (for admin approval)
      charityRegistrationNumber: ['', [Validators.required]],
      charityType: ['', [Validators.required]],
      focusAreas: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      website: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
      taxExemptCertificate: ['', Validators.required]
    });
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.signupForm.get('organizationName')?.valid &&
               this.signupForm.get('email')?.valid &&
               this.emailOtpVerified);
      case 2:
        return !!(this.signupForm.get('phone')?.valid && this.phoneOtpVerified);
      case 3:
        return !!(this.signupForm.get('password')?.valid &&
               this.signupForm.get('confirmPassword')?.valid &&
               this.passwordsMatch());
      case 4:
        return !!(this.signupForm.get('dob')?.valid &&
               this.signupForm.get('city')?.valid &&
               this.signupForm.get('state')?.valid &&
               this.signupForm.get('country')?.valid);
      case 5:
        return !!(this.signupForm.get('charityRegistrationNumber')?.valid &&
               this.signupForm.get('charityType')?.valid &&
               this.signupForm.get('focusAreas')?.valid &&
               this.signupForm.get('description')?.valid &&
               this.signupForm.get('taxExemptCertificate')?.valid);
      default:
        return false;
    }
  }

  // OTP Methods
  sendEmailOtp(): void {
    const email = this.signupForm.get('email')?.value;
    if (email && this.signupForm.get('email')?.valid) {
      this.isLoading = true;
      this.emailOtpError = '';
      this.api.sendEmailOtp(email).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.emailOtpSent = true;
            console.log('OTP sent to email:', email);
          } else {
            this.emailOtpError = response.message || 'Failed to send OTP';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.emailOtpError = 'Error sending OTP. Please try again.';
          console.error('Error sending email OTP:', error);
        }
      });
    }
  }

  verifyEmailOtp(): void {
    const email = this.signupForm.get('email')?.value;
    const otp = this.signupForm.get('emailOtp')?.value;
    if (email && otp) {
      this.isLoading = true;
      this.emailOtpError = '';
      this.api.verifyEmailOtp(email, otp).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.emailOtpVerified = true;
            console.log('Email verified successfully');
          } else {
            this.emailOtpError = response.message || 'Invalid OTP';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.emailOtpError = 'Error verifying OTP. Please try again.';
          console.error('Error verifying email OTP:', error);
        }
      });
    }
  }

  sendPhoneOtp(): void {
    const phone = this.signupForm.get('phone')?.value;
    if (phone && this.signupForm.get('phone')?.valid) {
      this.isLoading = true;
      this.phoneOtpError = '';
      this.api.sendPhoneOtp(phone).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.phoneOtpSent = true;
            console.log('OTP sent to phone:', phone);
          } else {
            this.phoneOtpError = response.message || 'Failed to send OTP';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.phoneOtpError = 'Error sending OTP. Please try again.';
          console.error('Error sending phone OTP:', error);
        }
      });
    }
  }

  verifyPhoneOtp(): void {
    const phone = this.signupForm.get('phone')?.value;
    const otp = this.signupForm.get('phoneOtp')?.value;
    if (phone && otp) {
      this.isLoading = true;
      this.phoneOtpError = '';
      this.api.verifyPhoneOtp(phone, otp).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.phoneOtpVerified = true;
            console.log('Phone verified successfully');
          } else {
            this.phoneOtpError = response.message || 'Invalid OTP';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.phoneOtpError = 'Error verifying OTP. Please try again.';
          console.error('Error verifying phone OTP:', error);
        }
      });
    }
  }

  passwordsMatch(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;
    return password === confirmPassword && password !== '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.signupForm.valid && this.emailOtpVerified && this.phoneOtpVerified) {
      this.isLoading = true;
      console.log('Charity registration form:', this.signupForm.value);
      
      setTimeout(() => {
        this.isLoading = false;
        console.log('Charity registration submitted successfully');
      }, 2000);
    }
  }

  // Getter methods
  get organizationName() { return this.signupForm.get('organizationName'); }
  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get dob() { return this.signupForm.get('dob'); }
  get city() { return this.signupForm.get('city'); }
  get state() { return this.signupForm.get('state'); }
  get country() { return this.signupForm.get('country'); }
  get charityRegistrationNumber() { return this.signupForm.get('charityRegistrationNumber'); }
  get charityType() { return this.signupForm.get('charityType'); }
  get focusAreas() { return this.signupForm.get('focusAreas'); }
  get description() { return this.signupForm.get('description'); }
  get taxExemptCertificate() { return this.signupForm.get('taxExemptCertificate'); }
}
