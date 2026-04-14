import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  charityName = 'Selected Charity';
  amount = 0;
  paymentMethod = 'Payment';
  reference = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.charityName = params['charityName'] || 'Selected Charity';
      this.amount = params['amount'] ? Number(params['amount']) : 0;
      this.paymentMethod = params['paymentMethod'] || 'Payment';
      this.reference = params['reference'] || `CF-${Date.now()}`;
    });
  }
}
