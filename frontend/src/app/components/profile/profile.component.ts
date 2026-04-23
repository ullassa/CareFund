import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = false;
  saving = false;
  error = '';
  message = '';
  role = '';
  isEditing = false;

  private readonly storageListener = (event: StorageEvent): void => {
    if (event.key === 'cf:profile:refresh' || event.key === 'cf:auth:changed') {
      this.load();
    }
  };

  profile: any = {
    name: '',
    email: '',
    phoneNumber: '',
    city: ''
  };

  charityProfile: any = {
    addressLine: '',
    mission: '',
    about: '',
    activities: '',
    socialMediaLink: '',
    causeType: ''
  };

  constructor(private api: ApiService) {}

  get isCharityManager(): boolean {
    return this.role === 'CharityManager';
  }

  get isCustomer(): boolean {
    return this.role === 'Customer';
  }

  get canEditProfile(): boolean {
    return this.role !== 'CharityManager';
  }

  canEditField(field: 'name' | 'email' | 'phone' | 'city'): boolean {
    if (!this.isEditing) {
      return false;
    }

    if (this.isCustomer) {
      return field === 'name' || field === 'city';
    }

    return true;
  }

  ngOnInit(): void {
    this.load();
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageListener);
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.api.getMyProfile().subscribe({
      next: (res: any) => {
        this.role = (res?.role || '').toString();
        this.profile = {
          name: res?.user?.userName || '',
          email: res?.user?.email || '',
          phoneNumber: res?.user?.phoneNumber || '',
          city: res?.customer?.city || res?.user?.city || ''
        };

        this.charityProfile = {
          addressLine: res?.charity?.addressLine || '',
          mission: res?.charity?.mission || '',
          about: res?.charity?.about || '',
          activities: res?.charity?.activities || '',
          socialMediaLink: res?.charity?.socialMediaLink || '',
          causeType: res?.charity?.causeType || ''
        };

        this.loading = false;
        this.isEditing = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load profile.';
      }
    });
  }

  save(): void {
    this.error = '';
    this.message = '';

    if (this.isCharityManager) {
      this.error = 'Charity profiles are read-only and cannot be edited.';
      return;
    }

    this.saving = true;
    this.api.updateCustomerProfile({
      name: this.profile.name,
      email: this.profile.email,
      phoneNumber: this.profile.phoneNumber,
      city: this.profile.city
    }).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.message = res?.message || 'Profile updated successfully.';
        sessionStorage.setItem('userName', this.profile.name || '');
          localStorage.setItem('cf:profile:refresh', Date.now().toString());
          localStorage.setItem('cf:auth:changed', Date.now().toString());
          this.isEditing = false;
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Unable to update profile.';
      }
    });
  }

  enableEdit(): void {
    if (!this.canEditProfile) {
      return;
    }

    this.isEditing = true;
    this.message = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.load();
  }
}