import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'http://localhost:5292/api';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.baseUrl}/users`, { headers });
  }

  sendPhoneOtp(phone: string) {
    return this.http.post(
      `${this.baseUrl}/auth/send-phone-otp?phone=${encodeURIComponent(phone)}`,
      {}
    );
  }

  verifyPhoneOtp(phone: string, otp: string) {
    return this.http.post(
      `${this.baseUrl}/auth/verify-phone-otp?phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(otp)}`,
      {}
    );
  }

  sendEmailOtp(email: string) {
    return this.http.post(
      `${this.baseUrl}/auth/send-email-otp?email=${encodeURIComponent(email)}`,
      {}
    );
  }

  verifyEmailOtp(email: string, otp: string) {
    return this.http.post(
      `${this.baseUrl}/auth/verify-email-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      {}
    );
  }

  registerCharity(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register-charity`, data);
  }

  registerCustomer(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register-customer`, data);
  }

  getPublicCharities() {
    return this.http.get(`${this.baseUrl}/charities/public`).pipe(
      catchError(() => this.http.get(`${this.baseUrl}/Charities/public`).pipe(
        catchError(() => this.http.get(`${this.baseUrl}/auth/public-charities`))
      ))
    );
  }

  getPublicCharitiesFromAuth() {
    return this.http.get(`${this.baseUrl}/auth/public-charities`);
  }
}