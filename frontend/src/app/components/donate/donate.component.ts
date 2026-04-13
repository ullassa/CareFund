import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  selectedCauseId: number | null = null;
  selectedAmount = 0;

  causes = [
    { id: 1, name: 'Medical', description: 'Help those in medical need', image: '🏥' },
    { id: 2, name: 'Education', description: 'Support education initiatives', image: '📚' },
    { id: 3, name: 'Food & Hunger', description: 'Fight hunger and malnutrition', image: '🍽️' },
    { id: 4, name: 'Disaster Relief', description: 'Emergency assistance', image: '🆘' },
    { id: 5, name: 'Environmental', description: 'Protect our environment', image: '🌍' }
  ];

  predefinedAmounts = [10, 25, 50, 100, 250, 500];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['causeId']) {
        this.selectedCauseId = parseInt(params['causeId'], 10);
      }
    });
  }

  selectCause(causeId: number): void {
    this.selectedCauseId = causeId;
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  getSelectedCauseName(): string {
    const cause = this.causes.find(c => c.id === this.selectedCauseId);
    return cause ? cause.name : '';
  }

  proceedToDonate(): void {
    if (this.selectedCauseId && this.selectedAmount > 0) {
      console.log(`Donating $${this.selectedAmount} to cause ${this.selectedCauseId}`);
      // Navigate to payment page or process donation
    }
  }
}
