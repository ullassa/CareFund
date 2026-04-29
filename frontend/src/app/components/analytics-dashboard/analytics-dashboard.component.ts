import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, DonationMetrics } from '../../services/analytics.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-dashboard">
      <!-- Impact Metrics -->
      <section class="metrics-section" *ngIf="donationMetrics$ | async as metrics">
        <h2>Impact Overview</h2>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Total Donations</div>
            <div class="metric-value">₹{{ metrics.totalDonations | number:'1.0-0' }}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Total Donors</div>
            <div class="metric-value">{{ metrics.totalDonors | number:'1.0-0' }}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Average Donation</div>
            <div class="metric-value">₹{{ metrics.averageDonation | number:'1.0-0' }}</div>
          </div>
        </div>
      </section>

      <!-- Donation Trend -->
      <section class="trend-section" *ngIf="donationMetrics$ | async as metrics">
        <h2>Donation Trend (6 months)</h2>
        <div class="trend-chart">
          <div *ngFor="let trend of metrics.donationTrend" class="trend-item">
            <span class="trend-date">{{ trend.date }}</span>
            <div class="trend-bar">
              <div 
                class="trend-fill" 
                [style.width.%]="getTrendPercentage(trend.amount, metrics.donationTrend)"
              ></div>
            </div>
            <span class="trend-amount">₹{{ trend.amount | number:'1.0-0' }}</span>
          </div>
        </div>
      </section>

      <!-- Top Charities -->
      <section class="top-charities-section" *ngIf="donationMetrics$ | async as metrics">
        <h2>Top Charities by Donations</h2>
        <div class="charities-list">
          <div *ngFor="let charity of metrics.topCharities; let i = index" class="charity-item">
            <div class="charity-rank">{{ i + 1 }}</div>
            <div class="charity-info">
              <div class="charity-name">{{ charity.name }}</div>
              <div class="charity-stats">{{ charity.donations }} donations</div>
            </div>
            <div class="charity-amount">₹{{ charity.amount | number:'1.0-0' }}</div>
          </div>
        </div>
      </section>

      <!-- Top Donors Leaderboard -->
      <section class="leaderboard-section">
        <h2>Top Donors</h2>
        <div class="leaderboard" *ngIf="topDonors$ | async as donors">
          <div *ngFor="let donor of donors; let i = index" class="leaderboard-item">
            <div class="leaderboard-rank" [ngClass]="'rank-' + (i + 1)">
              <span *ngIf="i === 0">🥇</span>
              <span *ngIf="i === 1">🥈</span>
              <span *ngIf="i === 2">🥉</span>
              <span *ngIf="i > 2">{{ i + 1 }}</span>
            </div>
            <div class="leaderboard-name">{{ donor.name }}</div>
            <div class="leaderboard-amount">₹{{ donor.totalDonated | number:'1.0-0' }}</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .analytics-dashboard {
      display: grid;
      gap: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(230, 136, 214, 0.08) 0%, rgba(65, 179, 163, 0.08) 100%);
      border-radius: 16px;
    }

    .metrics-section h2,
    .trend-section h2,
    .top-charities-section h2,
    .leaderboard-section h2 {
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      color: var(--cf-ink);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .metric-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #e688d6 0%, #41b3a3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .trend-chart {
      display: grid;
      gap: 0.75rem;
    }

    .trend-item {
      display: grid;
      grid-template-columns: 60px 1fr 80px;
      gap: 1rem;
      align-items: center;
    }

    .trend-date {
      font-size: 0.85rem;
      color: #64748b;
    }

    .trend-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .trend-fill {
      height: 100%;
      background: linear-gradient(90deg, #e688d6, #41b3a3);
      transition: width 0.3s ease;
    }

    .trend-amount {
      font-weight: 600;
      color: var(--cf-ink);
      text-align: right;
    }

    .charities-list {
      display: grid;
      gap: 0.75rem;
    }

    .charity-item {
      display: grid;
      grid-template-columns: 40px 1fr auto;
      gap: 1rem;
      align-items: center;
      background: #fff;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
    }

    .charity-rank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #e688d6 0%, #41b3a3 100%);
      color: #fff;
      border-radius: 50%;
      font-weight: 700;
    }

    .charity-info {
      display: grid;
      gap: 0.25rem;
    }

    .charity-name {
      font-weight: 600;
      color: var(--cf-ink);
    }

    .charity-stats {
      font-size: 0.85rem;
      color: #64748b;
    }

    .charity-amount {
      font-weight: 700;
      color: #41b3a3;
    }

    .leaderboard {
      display: grid;
      gap: 0.5rem;
    }

    .leaderboard-item {
      display: grid;
      grid-template-columns: 60px 1fr auto;
      gap: 1rem;
      align-items: center;
      background: #fff;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      transition: transform 0.2s ease;
    }

    .leaderboard-item:hover {
      transform: translateY(-2px);
    }

    .leaderboard-rank {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .leaderboard-rank.rank-1 {
      color: #f59e0b;
    }

    .leaderboard-rank.rank-2 {
      color: #8b8b8b;
    }

    .leaderboard-rank.rank-3 {
      color: #cd7f32;
    }

    .leaderboard-name {
      font-weight: 600;
      color: var(--cf-ink);
    }

    .leaderboard-amount {
      font-weight: 700;
      color: #e688d6;
    }

    @media (max-width: 768px) {
      .analytics-dashboard {
        padding: 1rem;
        gap: 1.5rem;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsDashboardComponent implements OnInit {
  donationMetrics$!: Observable<DonationMetrics>;
  topDonors$!: Observable<any[]>;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.donationMetrics$ = this.analyticsService.getDonationMetrics();
    this.topDonors$ = this.analyticsService.getLeaderboard('top-donors');
  }

  getTrendPercentage(amount: number, trends: any[]): number {
    const maxAmount = Math.max(...trends.map((t) => t.amount));
    return (amount / maxAmount) * 100;
  }
}
