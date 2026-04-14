import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  donateCausesOpen = false;

  causes = [
    { id: 1, name: 'Medical' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'Food & Hunger' },
    { id: 4, name: 'Disaster Relief' },
    { id: 5, name: 'Environmental' }
  ];

  toggleDonateCauses(): void {
    this.donateCausesOpen = !this.donateCausesOpen;
  }

  closeDonateCauses(): void {
    this.donateCausesOpen = false;
  }

  navigateToDonate(causeId: number): void {
    this.closeDonateCauses();
  }
}
