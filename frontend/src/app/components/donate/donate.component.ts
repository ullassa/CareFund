import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../../services/api.service';

interface PublicCharity {
  id: number;
  name: string;
  description: string;
  cause: string;
  location: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  status: string;
}

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {
  charities: PublicCharity[] = [];
  selectedCharity: PublicCharity | null = null;
  queryCharity: PublicCharity | null = null;
  charityLoading = false;
  charityError = '';

  showPaymentSection = false;
  selectedAmount = 0;
  selectedCharityImages: string[] = [];

  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' = 'upi';
  paymentProcessing = false;
  paymentMessage = '';

  upiId = '';
  cardHolderName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  bankName = '';
  walletNumber = '';
  predefinedAmounts = [10, 25, 50, 100, 250, 500];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const charityId = params['charityId'] ? parseInt(params['charityId'], 10) : null;

      if (params['charityName'] || charityId) {
        this.queryCharity = {
          id: charityId || 0,
          name: params['charityName'] || 'Selected Charity',
          description: params['description'] || '',
          cause: params['cause'] || '',
          location: params['location'] || '',
          email: params['email'] || '',
          phoneNumber: params['phone'] || '',
          isActive: true,
          status: 'Approved'
        };
      }

      if (charityId && this.charities.length > 0) {
        const preselected = this.charities.find(charity => charity.id === charityId);
        if (preselected) {
          this.openCharityDetails(preselected);
        }
      } else if (this.queryCharity && !this.selectedCharity) {
        this.openCharityDetails(this.queryCharity);
      }
    });

    this.loadCharities();
  }

  private loadCharities(): void {
    this.charityLoading = true;
    this.charityError = '';

    this.apiService.getPublicCharities().subscribe({
      next: (response: any) => {
        this.charities = this.mapCharities(response);

        if (this.charities.length === 0) {
          this.apiService.getPublicCharitiesFromAuth().subscribe({
            next: (fallbackResponse: any) => {
              this.charities = this.mapCharities(fallbackResponse);
              this.applyInitialSelection();
              this.charityLoading = false;
            },
            error: () => {
              this.applyInitialSelection();
              this.charityLoading = false;
            }
          });
          return;
        }

        this.applyInitialSelection();
        this.charityLoading = false;
      },
      error: (error) => {
        this.apiService.getPublicCharitiesFromAuth().subscribe({
          next: (fallbackResponse: any) => {
            this.charities = this.mapCharities(fallbackResponse);
            this.applyInitialSelection();
            this.charityLoading = false;
          },
          error: () => {
            this.charityLoading = false;
            const backendMessage = error?.error?.message || error?.message;
            this.charityError = backendMessage || 'Unable to load available charities right now.';

            if (this.queryCharity && !this.selectedCharity) {
              this.openCharityDetails(this.queryCharity);
              this.charityError = '';
            }
          }
        });
      }
    });
  }

  private mapCharities(response: any): PublicCharity[] {
    const payload = Array.isArray(response)
      ? response
      : (response?.items ?? response?.charities ?? []);

    return (Array.isArray(payload) ? payload : []).map((item: any) => ({
      id: item.id ?? item.charityId ?? 0,
      name: item.name ?? item.charityName ?? '',
      description: item.description ?? '',
      cause: item.cause ?? '',
      location: item.location ?? '',
      email: item.email ?? '',
      phoneNumber: item.phoneNumber ?? item.phone ?? '',
      isActive: item.isActive ?? true,
      status: item.status ?? ''
    }));
  }

  private applyInitialSelection(): void {
    const requestedId = this.route.snapshot.queryParamMap.get('charityId');
    if (requestedId) {
      const charityId = parseInt(requestedId, 10);
      const preselected = this.charities.find(charity => charity.id === charityId);
      if (preselected) {
        this.openCharityDetails(preselected);
      } else if (this.queryCharity && !this.selectedCharity) {
        this.openCharityDetails(this.queryCharity);
      }
    } else if (this.queryCharity && !this.selectedCharity) {
      this.openCharityDetails(this.queryCharity);
    }
  }

  private buildCharityImages(seedId: number, name: string): string[] {
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return Array.from({ length: 5 }, (_, index) =>
      `https://picsum.photos/seed/${safeName}-${seedId}-${index + 1}/900/600`
    );
  }

  openCharityDetails(charity: PublicCharity): void {
    this.selectedCharity = charity;
    this.selectedCharityImages = this.buildCharityImages(charity.id, charity.name || 'charity');
    this.showPaymentSection = false;
    this.paymentMessage = '';
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  startDonation(): void {
    if (!this.selectedCharity) {
      this.paymentMessage = 'Please select a charity first.';
      return;
    }

    this.showPaymentSection = true;
    this.paymentMessage = '';
  }

  selectPaymentMethod(method: 'upi' | 'card' | 'netbanking' | 'wallet'): void {
    this.paymentMethod = method;
    this.paymentMessage = '';
  }

  get selectedPaymentLabel(): string {
    switch (this.paymentMethod) {
      case 'upi': return 'UPI';
      case 'card': return 'Card';
      case 'netbanking': return 'Net Banking';
      case 'wallet': return 'Wallet';
      default: return 'Payment';
    }
  }

  proceedToDonate(): void {
    this.paymentMessage = '';

    if (!this.selectedCharity) {
      this.paymentMessage = 'Please choose a charity first.';
      return;
    }

    if (this.selectedAmount <= 0) {
      this.paymentMessage = 'Please choose a donation amount first.';
      return;
    }

    if (this.paymentMethod === 'upi' && !this.upiId.trim()) {
      this.paymentMessage = 'Enter your UPI ID to continue.';
      return;
    }

    if (this.paymentMethod === 'card') {
      if (!this.cardHolderName.trim() || !this.cardNumber.trim() || !this.cardExpiry.trim() || !this.cardCvv.trim()) {
        this.paymentMessage = 'Please fill card details to continue.';
        return;
      }
    }

    if (this.paymentMethod === 'netbanking' && !this.bankName.trim()) {
      this.paymentMessage = 'Please select a bank to continue.';
      return;
    }

    if (this.paymentMethod === 'wallet' && !this.walletNumber.trim()) {
      this.paymentMessage = 'Please enter your wallet number.';
      return;
    }

    this.paymentProcessing = true;
    setTimeout(() => {
      this.paymentProcessing = false;
      const paymentReference = `CF-${Date.now()}`;
      this.router.navigate(['/payment-success'], {
        queryParams: {
          charityName: this.selectedCharity?.name,
          amount: this.selectedAmount,
          paymentMethod: this.selectedPaymentLabel,
          reference: paymentReference
        }
      });
    }, 1400);
  }
}
