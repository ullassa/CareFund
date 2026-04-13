import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  causes = [
    { id: 1, name: 'Medical', description: 'Help those in medical need', icon: '🏥' },
    { id: 2, name: 'Education', description: 'Support education initiatives', icon: '📚' },
    { id: 3, name: 'Food & Hunger', description: 'Fight hunger and malnutrition', icon: '🍽️' },
    { id: 4, name: 'Disaster Relief', description: 'Emergency assistance', icon: '🆘' },
    { id: 5, name: 'Environmental', description: 'Protect our environment', icon: '🌍' }
  ];

  statistics = [
    { label: 'Total Donations', value: '$2.5M+', icon: '💰' },
    { label: 'Active Charities', value: '150+', icon: '🤝' },
    { label: 'Lives Impacted', value: '50K+', icon: '❤️' },
    { label: 'Donors', value: '10K+', icon: '👥' }
  ];

  testimonials = [
    {
      name: 'John Smith',
      role: 'Charity Partner',
      message: 'CareFund has helped us reach more people in need. Highly recommended!'
    },
    {
      name: 'Sarah Johnson',
      role: 'Donor',
      message: 'Simple, transparent, and truly makes a difference. Love this platform!'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Beneficiary',
      message: 'The support we received changed our lives. Thank you CareFund!'
    }
  ];
}
