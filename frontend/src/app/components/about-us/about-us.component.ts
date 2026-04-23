import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
  values = [
    {
      title: 'Transparency',
      description: 'Every donation is tracked. You see exactly where your money goes.',
      icon: 'transparency'
    },
    {
      title: 'Trust',
      description: 'Verified organizations. Real impact. No middleman complications.',
      icon: 'trust'
    },
    {
      title: 'Impact',
      description: 'Direct connection between donors and charities. Maximum effectiveness.',
      icon: 'impact'
    },
    {
      title: 'Accessibility',
      description: 'Everyone can help. Start with any amount. Support any cause.',
      icon: 'accessibility'
    }
  ];

  team = [
    {
      name: 'Founders',
      role: 'Mission-driven',
      description: 'Creating a platform where compassion meets action'
    },
    {
      name: 'Community',
      role: 'Our Strength',
      description: 'Thousands of donors and charities working together'
    },
    {
      name: 'Technology',
      role: 'Our Foundation',
      description: 'Built for security, speed, and simplicity'
    }
  ];
}
