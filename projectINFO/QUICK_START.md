# CareFund Quick Integration Examples

## Table of Contents
1. [App Component Setup](#app-component-setup)
2. [Charity Detail Page](#charity-detail-page)
3. [Charity List / Browse](#charity-list--browse)
4. [Dashboard / Admin](#dashboard--admin)
5. [Search Integration](#search-integration)
6. [Header Enhancement](#header-enhancement)
7. [Email/Newsletter](#emailnewsletter)

---

## App Component Setup

### Location: `src/app/app.component.ts`

**Current State**: Basic app component with router outlet

**Add Notification Toast** (Real-time notifications):

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';

@Component({
  selector: 'app-root',
  template: `
    <!-- Global notification system -->
    <app-notification-toast></app-notification-toast>
    
    <!-- Main app content -->
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NotificationToastComponent]
})
export class AppComponent {
  title = 'CareFund';
}
```

**Result**: All notifications will appear in top-right corner with auto-dismiss.

---

## Charity Detail Page

### Location: `src/app/pages/charity-detail/charity-detail.component.ts`

**Current State**: Display single charity details

**Add Image Optimization + Sharing**:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImageDirective } from '../../directives/lazy-image.directive';
import { ShareButtonsComponent } from '../../components/share-buttons/share-buttons.component';
import { OptimizedImageComponent } from '../../components/optimized-image/optimized-image.component';
import { AnalyticsService } from '../../services/analytics.service';

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  galleryImages: string[];
  raisedAmount: number;
  targetAmount: number;
  donorCount: number;
}

@Component({
  selector: 'app-charity-detail',
  template: `
    <div class="charity-detail">
      <!-- Hero Image -->
      <section class="hero">
        <img 
          [appLazyImage]="charity.image" 
          [alt]="charity.name"
          class="hero-image"
        >
      </section>

      <!-- Charity Info -->
      <section class="info">
        <h1>{{ charity.name }}</h1>
        <p>{{ charity.description }}</p>

        <!-- Share Buttons -->
        <app-share-buttons
          [url]="currentUrl"
          [title]="charity.name"
          [description]="charity.description"
          layout="horizontal"
          [showLabel]="true"
        ></app-share-buttons>

        <!-- Donation Stats -->
        <div class="stats">
          <div class="stat">
            <strong>₹{{ charity.raisedAmount | number }}</strong>
            <span>Raised</span>
          </div>
          <div class="stat">
            <strong>₹{{ charity.targetAmount | number }}</strong>
            <span>Target</span>
          </div>
          <div class="stat">
            <strong>{{ charity.donorCount }}</strong>
            <span>Donors</span>
          </div>
        </div>

        <!-- Donation Button -->
        <button (click)="donate()" class="donate-btn">
          Donate Now
        </button>
      </section>

      <!-- Gallery with Lazy Loading -->
      <section class="gallery">
        <h2>Gallery</h2>
        <div class="gallery-grid">
          <img
            *ngFor="let image of charity.galleryImages"
            [appLazyImage]="image"
            [alt]="charity.name + ' gallery image'"
            class="gallery-image"
          >
        </div>
      </section>

      <!-- Social Proof / Similar Charities -->
      <section class="similar">
        <h2>Similar Causes</h2>
        <!-- List of similar charities with pagination -->
      </section>
    </div>
  `,
  styles: [`
    .charity-detail {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      width: 100%;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .info {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 10px;
    }

    .stat {
      display: grid;
      gap: 0.5rem;
      text-align: center;
    }

    .stat strong {
      font-size: 1.5rem;
      color: #41b3a3;
    }

    .donate-btn {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #e688d6 0%, #41b3a3 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1.1rem;
      width: fit-content;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .gallery-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }
  `],
  imports: [
    CommonModule,
    LazyImageDirective,
    ShareButtonsComponent,
    OptimizedImageComponent
  ]
})
export class CharityDetailComponent implements OnInit {
  charity!: Charity;
  currentUrl = window.location.href;

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    // Load charity details
    this.loadCharity();
    
    // Track page view
    this.analytics.trackCharityView('charity-id', 'health');
  }

  loadCharity() {
    // TODO: Load from API
    this.charity = {
      id: '1',
      name: 'Education Initiative',
      description: 'Building schools in rural areas',
      category: 'education',
      image: 'https://example.com/hero.jpg',
      galleryImages: [
        'https://example.com/gallery-1.jpg',
        'https://example.com/gallery-2.jpg',
        'https://example.com/gallery-3.jpg'
      ],
      raisedAmount: 500000,
      targetAmount: 1000000,
      donorCount: 250
    };
  }

  donate() {
    // Navigate to donation flow
    console.log('Donate clicked');
  }
}
```

---

## Charity List / Browse

### Location: `src/app/pages/charities/charities.component.ts`

**Current State**: List view with basic cards

**Add Pagination + Virtual Scrolling**:

```typescript
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImageDirective } from '../../directives/lazy-image.directive';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { VirtualListComponent } from '../../components/virtual-list/virtual-list.component';

interface Charity {
  id: string;
  name: string;
  image: string;
  category: string;
  raised: number;
  target: number;
  donors: number;
  rating: number;
}

@Component({
  selector: 'app-charities',
  template: `
    <div class="charities-page">
      <h1>Browse Charities</h1>

      <!-- Display Options -->
      <div class="view-options">
        <button 
          (click)="viewMode = 'grid'" 
          [class.active]="viewMode === 'grid'"
        >
          Grid View
        </button>
        <button 
          (click)="viewMode = 'list'" 
          [class.active]="viewMode === 'list'"
        >
          List View
        </button>
      </div>

      <!-- Grid View with Pagination -->
      <div *ngIf="viewMode === 'grid'" class="charities-grid">
        <div 
          *ngFor="let charity of paginatedCharities" 
          class="charity-card"
        >
          <div class="card-image">
            <img [appLazyImage]="charity.image" [alt]="charity.name">
            <span class="category">{{ charity.category }}</span>
          </div>
          <div class="card-content">
            <h3>{{ charity.name }}</h3>
            <div class="rating">★ {{ charity.rating }}</div>
            <div class="progress">
              <div class="progress-bar" [style.width.%]="(charity.raised / charity.target) * 100"></div>
            </div>
            <div class="meta">
              <span>₹{{ charity.raised | number }} of ₹{{ charity.target | number }}</span>
              <span>{{ charity.donors }} donors</span>
            </div>
            <button class="donate-btn">Donate</button>
          </div>
        </div>
      </div>

      <!-- List View with Virtual Scrolling (for large lists) -->
      <div *ngIf="viewMode === 'list' && allCharities.length > 100" class="charities-list">
        <app-virtual-list
          [items]="allCharities"
          itemHeight="120"
          [trackBy]="trackByCharityId"
        >
          <ng-template #item let-charity="item">
            <div class="list-item">
              <img 
                [appLazyImage]="charity.image" 
                [alt]="charity.name"
                class="item-image"
              >
              <div class="item-info">
                <h4>{{ charity.name }}</h4>
                <p>{{ charity.category | uppercase }}</p>
                <div class="item-stats">
                  <span>★ {{ charity.rating }}</span>
                  <span>₹{{ charity.raised | number }}</span>
                  <span>{{ charity.donors }} donors</span>
                </div>
              </div>
              <button class="donate-btn">Donate</button>
            </div>
          </ng-template>
        </app-virtual-list>
      </div>

      <!-- List View Standard (for small lists) -->
      <div *ngIf="viewMode === 'list' && allCharities.length <= 100" class="charities-list">
        <div *ngFor="let charity of paginatedCharities" class="list-item">
          <img 
            [appLazyImage]="charity.image" 
            [alt]="charity.name"
            class="item-image"
          >
          <div class="item-info">
            <h4>{{ charity.name }}</h4>
            <p>{{ charity.category | uppercase }}</p>
            <div class="item-stats">
              <span>★ {{ charity.rating }}</span>
              <span>₹{{ charity.raised | number }}</span>
              <span>{{ charity.donors }} donors</span>
            </div>
          </div>
          <button class="donate-btn">Donate</button>
        </div>
      </div>

      <!-- Pagination Controls -->
      <app-pagination
        [totalItems]="totalCharities"
        [initialPageSize]="20"
        (pageChange)="onPageChange($event)"
      ></app-pagination>
    </div>
  `,
  styles: [`
    .charities-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .view-options {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .view-options button {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-options button.active {
      background: #e688d6;
      color: white;
      border-color: #e688d6;
    }

    .charities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .charity-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .charity-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .card-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .category {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(230, 136, 214, 0.9);
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .card-content {
      padding: 1rem;
      display: grid;
      gap: 0.75rem;
    }

    .card-content h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .rating {
      color: #f59e0b;
      font-weight: 600;
    }

    .progress {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #e688d6, #41b3a3);
      transition: width 0.3s;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #64748b;
    }

    .donate-btn {
      padding: 0.75rem;
      background: linear-gradient(135deg, #e688d6, #41b3a3);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .donate-btn:hover {
      transform: scale(1.02);
    }

    .charities-list {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .list-item {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .list-item:hover {
      border-color: #e688d6;
      box-shadow: 0 2px 8px rgba(230, 136, 214, 0.1);
    }

    .item-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-info {
      display: grid;
      gap: 0.5rem;
    }

    .item-info h4 {
      margin: 0;
    }

    .item-info p {
      margin: 0;
      font-size: 0.85rem;
      color: #64748b;
    }

    .item-stats {
      display: flex;
      gap: 1rem;
      font-size: 0.9rem;
    }
  `],
  imports: [
    CommonModule,
    LazyImageDirective,
    PaginationComponent,
    VirtualListComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharitiesComponent implements OnInit {
  allCharities: Charity[] = [];
  paginatedCharities: Charity[] = [];
  totalCharities = 0;
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit() {
    // Load all charities
    this.loadCharities();
  }

  loadCharities() {
    // TODO: Load from API
    this.allCharities = Array.from({ length: 500 }, (_, i) => ({
      id: `${i}`,
      name: `Charity ${i + 1}`,
      image: `https://picsum.photos/300/200?random=${i}`,
      category: ['health', 'education', 'disaster'][i % 3],
      raised: Math.random() * 1000000,
      target: 1000000,
      donors: Math.floor(Math.random() * 500),
      rating: (Math.random() * 2 + 3).toFixed(1) as any
    }));

    this.totalCharities = this.allCharities.length;
    this.onPageChange({ page: 1, pageSize: 20 });
  }

  onPageChange(event: { page: number; pageSize: number }) {
    const start = (event.page - 1) * event.pageSize;
    const end = start + event.pageSize;
    this.paginatedCharities = this.allCharities.slice(start, end);
  }

  trackByCharityId(index: number, charity: Charity) {
    return charity.id;
  }
}
```

---

## Dashboard / Admin

### Location: `src/app/pages/dashboard/dashboard.component.ts`

**Current State**: Basic dashboard

**Add Analytics & Leaderboards**:

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDashboardComponent } from '../../components/analytics-dashboard/analytics-dashboard.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <!-- Analytics -->
      <section class="analytics-section">
        <app-analytics-dashboard></app-analytics-dashboard>
      </section>

      <!-- Leaderboards -->
      <section class="leaderboards">
        <div class="leaderboard-col">
          <app-leaderboard
            type="donors"
            title="Top Donors"
            [periods]="['All Time', 'This Month', 'This Week']"
          ></app-leaderboard>
        </div>

        <div class="leaderboard-col">
          <app-leaderboard
            type="charities"
            title="Top Charities"
            [periods]="['All Time', 'This Month', 'This Week']"
          ></app-leaderboard>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .analytics-section {
      margin-bottom: 2rem;
    }

    .leaderboards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .leaderboard-col {
      min-height: 400px;
    }
  `],
  imports: [
    CommonModule,
    AnalyticsDashboardComponent,
    LeaderboardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
```

---

## Search Integration

### Location: `src/app/components/header/header.component.ts`

**Add Search Component to Header**:

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { SearchResult } from '../../services/search.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header" role="banner">
      <div class="header-content">
        <div class="logo">
          <h1>CareFund</h1>
        </div>

        <!-- Search Bar in Header -->
        <div class="search-bar">
          <app-search
            (resultSelected)="onSearchResultSelected($event)"
          ></app-search>
        </div>

        <nav role="navigation" aria-label="Main navigation">
          <a href="/browse">Browse</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Profile</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 2rem;
      align-items: center;
    }

    .search-bar {
      min-width: 300px;
    }

    nav {
      display: flex;
      gap: 1rem;
    }

    nav a {
      text-decoration: none;
      color: #64748b;
      font-weight: 500;
      transition: color 0.2s;
    }

    nav a:hover {
      color: #e688d6;
    }
  `],
  imports: [SearchComponent]
})
export class HeaderComponent {
  constructor(private router: Router) {}

  onSearchResultSelected(result: SearchResult<any>) {
    // Navigate to charity detail
    this.router.navigate(['/charity', result.id]);
  }
}
```

---

## Complete Integration Workflow

### Step 1: Update imports in `app.component.ts`
```typescript
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
```

### Step 2: Add to main template
```html
<app-notification-toast></app-notification-toast>
<router-outlet></router-outlet>
```

### Step 3: For each feature page, import required components

**Charity Detail**:
```typescript
imports: [
  CommonModule,
  LazyImageDirective,
  ShareButtonsComponent,
  OptimizedImageComponent
]
```

**Charity List**:
```typescript
imports: [
  CommonModule,
  LazyImageDirective,
  PaginationComponent,
  VirtualListComponent
]
```

**Dashboard**:
```typescript
imports: [
  CommonModule,
  AnalyticsDashboardComponent,
  LeaderboardComponent
]
```

**Header**:
```typescript
imports: [SearchComponent]
```

---

## Testing the Integration

### Test Lazy Loading
1. Open charity detail page
2. Scroll through gallery
3. Verify images load as they come into viewport
4. Check Network tab - images load only when needed

### Test Pagination
1. Navigate to charity list
2. Change page size
3. Go to different pages
4. Verify URL updates and data refreshes

### Test Search
1. Click search bar in header
2. Start typing a query
3. View suggestions dropdown
4. Select a result
5. Navigate to charity detail

### Test Sharing
1. Open charity detail
2. Click share button
3. Select platform
4. Verify correct URL/message shared

### Test Notifications
1. Make a donation
2. Check notification appears in top-right
3. Verify auto-dismiss after 5 seconds
4. Verify close button works

### Test Analytics
1. Visit dashboard
2. View impact metrics
3. Check donations trend
4. View top donors/charities
5. Filter by time period

---

## Performance Verification Checklist

- [ ] Images lazy load (check Network tab)
- [ ] Pagination reduces initial load
- [ ] Search suggestions appear within 300ms
- [ ] Virtual scrolling for 100+ items
- [ ] Notifications don't block main thread
- [ ] Analytics events batched (check Network)
- [ ] WebP images used on Chrome
- [ ] Share buttons don't load external scripts

