import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  socialLinks = [
    { label: 'Facebook', icon: '📘', url: 'https://facebook.com' },
    { label: 'Twitter', icon: '𝕏', url: 'https://twitter.com' },
    { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { label: 'Instagram', icon: '📷', url: 'https://instagram.com' },
  ];
}
