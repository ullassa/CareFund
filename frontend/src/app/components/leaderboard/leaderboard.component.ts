import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { Observable } from 'rxjs';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  value: number;
  badge?: string;
  description?: string;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leaderboard-widget">
      <div class="leaderboard-header">
        <h3>{{ title }}</h3>
        <div class="leaderboard-filters" *ngIf="periods.length > 1">
          <button 
            *ngFor="let period of periods"
            class="filter-btn"
            [class.active]="selectedPeriod === period"
            (click)="selectPeriod(period)"
            [attr.aria-label]="'Filter by ' + period"
          >
            {{ period }}
          </button>
        </div>
      </div>

      <div class="leaderboard-list" *ngIf="entries$ | async as entries">
        <div *ngIf="entries.length === 0" class="empty-state">
          <p>No entries yet. Be the first to lead the board!</p>
        </div>

        <div *ngFor="let entry of entries" class="leaderboard-entry" [class.featured]="entry.rank <= 3">
          <!-- Rank Badge -->
          <div class="entry-rank" [ngClass]="'rank-' + entry.rank">
            <span *ngIf="entry.rank === 1">🥇</span>
            <span *ngIf="entry.rank === 2">🥈</span>
            <span *ngIf="entry.rank === 3">🥉</span>
            <span *ngIf="entry.rank > 3">{{ entry.rank }}</span>
          </div>

          <!-- Entry Info -->
          <div class="entry-info">
            <div class="entry-name">
              <img *ngIf="entry.avatar" [src]="entry.avatar" [alt]="entry.name" class="entry-avatar">
              <div class="name-section">
                <div class="entry-title">{{ entry.name }}</div>
                <div *ngIf="entry.description" class="entry-description">{{ entry.description }}</div>
              </div>
            </div>
          </div>

          <!-- Entry Value -->
          <div class="entry-value">
            <div class="value-number">{{ valueFormatter(entry.value) }}</div>
            <div *ngIf="entry.badge" class="entry-badge">{{ entry.badge }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leaderboard-widget {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    .leaderboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .leaderboard-header h3 {
      margin: 0;
      font-size: 1.3rem;
      color: var(--cf-ink);
    }

    .leaderboard-filters {
      display: flex;
      gap: 0.5rem;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      color: #64748b;
      transition: all 0.2s ease;
    }

    .filter-btn:hover {
      border-color: #e688d6;
      background: rgba(230, 136, 214, 0.05);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #e688d6 0%, #41b3a3 100%);
      color: #fff;
      border-color: transparent;
    }

    .leaderboard-list {
      display: grid;
      gap: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #94a3b8;
    }

    .leaderboard-entry {
      display: grid;
      grid-template-columns: 50px 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 10px;
      transition: all 0.2s ease;
      border: 1px solid #e5e7eb;
    }

    .leaderboard-entry:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }

    .leaderboard-entry.featured {
      background: linear-gradient(135deg, rgba(230, 136, 214, 0.08) 0%, rgba(65, 179, 163, 0.08) 100%);
      border: 1px solid rgba(230, 136, 214, 0.2);
    }

    .entry-rank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #fff;
      font-weight: 700;
      font-size: 1.3rem;
      border: 2px solid #e5e7eb;
    }

    .entry-rank.rank-1 {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #fff;
      border-color: #f59e0b;
    }

    .entry-rank.rank-2 {
      background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
      color: #fff;
      border-color: #9ca3af;
    }

    .entry-rank.rank-3 {
      background: linear-gradient(135deg, #fed7aa 0%, #d97706 100%);
      color: #fff;
      border-color: #d97706;
    }

    .entry-info {
      display: grid;
      gap: 0.5rem;
    }

    .entry-name {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .entry-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      background: #e5e7eb;
    }

    .name-section {
      display: grid;
      gap: 0.25rem;
    }

    .entry-title {
      font-weight: 600;
      color: var(--cf-ink);
      font-size: 0.95rem;
    }

    .entry-description {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .entry-value {
      display: grid;
      gap: 0.25rem;
      text-align: right;
      align-items: center;
    }

    .value-number {
      font-weight: 700;
      font-size: 1.2rem;
      background: linear-gradient(135deg, #e688d6 0%, #41b3a3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .entry-badge {
      font-size: 0.75rem;
      background: rgba(65, 179, 163, 0.1);
      color: #41b3a3;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }

    @media (max-width: 640px) {
      .leaderboard-widget {
        padding: 1rem;
      }

      .leaderboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .leaderboard-entry {
        grid-template-columns: 40px 1fr auto;
        gap: 0.75rem;
        padding: 0.75rem;
      }

      .entry-rank {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent implements OnInit {
  @Input() type: 'donors' | 'charities' | 'evangelists' = 'donors';
  @Input() title: string = 'Top Donors';
  @Input() periods: string[] = ['All Time', 'This Month', 'This Week'];
  
  entries$!: Observable<LeaderboardEntry[]>;
  selectedPeriod: string = 'All Time';
  private periodMap: { [key: string]: string } = {
    'All Time': 'all-time',
    'This Month': 'month',
    'This Week': 'week'
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.loadLeaderboard();
  }

  private loadLeaderboard(): void {
    const typeMap: Record<typeof this.type, 'top-donors' | 'top-charities' | 'rising-charities'> = {
      donors: 'top-donors',
      charities: 'top-charities',
      evangelists: 'rising-charities'
    };
    const leaderboardType = typeMap[this.type];
    this.entries$ = this.analyticsService.getLeaderboard(leaderboardType);
  }

  valueFormatter(value: number): string {
    if (this.type === 'donors') {
      return '₹' + this.formatNumber(value);
    } else if (this.type === 'charities') {
      return '₹' + this.formatNumber(value);
    } else {
      return this.formatNumber(value).toString();
    }
  }

  private formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }
}
