import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  charityName = 'Selected Charity';
  amount = 0;
  paymentMethod = 'Payment';
  reference = '';
  shareUrl = '';
  shareText = '';
  copied = false;
  feedbackSubmitted = false;
  feedbackSaving = false;
  feedbackError = '';
  feedbackForm = {
    rating: 5,
    experience: '',
    suggestion: ''
  };

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.charityName = params['charityName'] || 'Selected Charity';
      this.amount = params['amount'] ? Number(params['amount']) : 0;
      this.paymentMethod = params['paymentMethod'] || 'Payment';
      this.reference = params['reference'] || `CF-${Date.now()}`;
      this.buildSharePayload();
    });
  }

  private buildSharePayload(): void {
    const amountText = this.amount > 0 ? `₹${this.amount.toLocaleString('en-IN')}` : 'a contribution';
    this.shareText = `I just donated ${amountText} to ${this.charityName} on CareFund. Join me in supporting real causes and creating positive impact.`;
    this.shareUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
  }

  get whatsappShareLink(): string {
    return `https://wa.me/?text=${encodeURIComponent(`${this.shareText} ${this.shareUrl}`)}`;
  }

  get twitterShareLink(): string {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.shareText)}&url=${encodeURIComponent(this.shareUrl)}`;
  }

  get facebookShareLink(): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}&quote=${encodeURIComponent(this.shareText)}`;
  }

  get linkedInShareLink(): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`;
  }

  async copyShareLink(): Promise<void> {
    const textToCopy = this.shareUrl;
    try {
      await navigator.clipboard.writeText(textToCopy);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch {
      this.copied = false;
    }
  }

  submitFeedback(): void {
    if (!this.feedbackForm.experience.trim()) {
      this.feedbackError = 'Please share your experience before submitting feedback.';
      return;
    }

    this.feedbackSaving = true;
    this.feedbackError = '';

    const payload = {
      charityName: this.charityName,
      amount: this.amount || 0,
      paymentMethod: this.paymentMethod,
      paymentReference: this.reference,
      rating: this.feedbackForm.rating,
      experience: this.feedbackForm.experience.trim(),
      suggestion: this.feedbackForm.suggestion?.trim() || ''
    };

    this.api.submitFeedback(payload).subscribe({
      next: () => {
        this.feedbackSaving = false;
        this.feedbackSubmitted = true;
      },
      error: (err) => {
        this.feedbackSaving = false;
        if (err?.status === 401 || err?.status === 403) {
          this.feedbackError = 'Your session expired. Please login again and resubmit feedback.';
          return;
        }

        const apiMessage =
          (typeof err?.error === 'string' ? err.error : '') ||
          err?.error?.message ||
          err?.error?.detail ||
          err?.message ||
          '';

        this.feedbackError = apiMessage || 'Unable to submit feedback right now.';
      }
    });
  }
}
