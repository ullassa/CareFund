import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AnalyticsEvent {
  eventName: string;
  category: string;
  value: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface DonationMetrics {
  totalDonations: number;
  averageDonation: number;
  totalDonors: number;
  donationTrend: Array<{ date: string; amount: number }>;
  topCharities: Array<{ name: string; amount: number; donations: number }>;
}

export interface CharityMetrics {
  charityId: string;
  charityName: string;
  targetAmount: number;
  collectedAmount: number;
  collectionPercentage: number;
  totalDonors: number;
  averageDonation: number;
  donationTrend: Array<{ date: string; amount: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = '/api/analytics';
  private sessionId = this.generateSessionId();
  private events: AnalyticsEvent[] = [];
  private metrics = new BehaviorSubject<AnalyticsEvent[]>([]);

  metrics$: Observable<AnalyticsEvent[]> = this.metrics.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAnalytics();
  }

  /**
   * Initialize analytics
   */
  private initializeAnalytics(): void {
    // Track page view
    this.trackEvent('page_view', 'navigation', {
      page: window.location.pathname,
      referrer: document.referrer
    });

    // Track session
    this.trackEvent('session_start', 'engagement', {
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, category: string, value: any, userId?: string): void {
    const event: AnalyticsEvent = {
      eventName,
      category,
      value,
      timestamp: new Date(),
      userId,
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.metrics.next(this.events);

    // Send to server asynchronously
    this.sendEvent(event).subscribe({
      error: (error) => console.error('Failed to send analytic event:', error)
    });
  }

  /**
   * Track donation
   */
  trackDonation(
    charityId: string,
    amount: number,
    paymentMethod: string,
    userId?: string
  ): void {
    this.trackEvent(
      'donation_completed',
      'donations',
      {
        charityId,
        amount,
        paymentMethod,
        timestamp: new Date().toISOString()
      },
      userId
    );
  }

  /**
   * Track charity view
   */
  trackCharityView(charityId: string, charityName: string, userId?: string): void {
    this.trackEvent(
      'charity_viewed',
      'engagement',
      {
        charityId,
        charityName,
        timestamp: new Date().toISOString()
      },
      userId
    );
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultCount: number, userId?: string): void {
    this.trackEvent(
      'search_performed',
      'search',
      {
        query,
        resultCount,
        timestamp: new Date().toISOString()
      },
      userId
    );
  }

  /**
   * Track user signup
   */
  trackSignup(userType: 'customer' | 'charity', userId?: string): void {
    this.trackEvent(
      'user_signup',
      'auth',
      {
        userType,
        timestamp: new Date().toISOString()
      },
      userId
    );
  }

  /**
   * Track user login
   */
  trackLogin(userId: string): void {
    this.trackEvent('user_login', 'auth', { userId, timestamp: new Date().toISOString() }, userId);
  }

  /**
   * Track page scroll
   */
  trackScroll(page: string, scrollDepth: number): void {
    this.trackEvent('page_scroll', 'engagement', {
      page,
      scrollDepth,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send event to server
   */
  private sendEvent(event: AnalyticsEvent): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/events`, event);
  }

  /**
   * Get donation metrics
   */
  getDonationMetrics(startDate?: Date, endDate?: Date): Observable<DonationMetrics> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.http.get<DonationMetrics>(`${this.baseUrl}/donations`, { params });
  }

  /**
   * Get charity metrics
   */
  getCharityMetrics(charityId: string): Observable<CharityMetrics> {
    return this.http.get<CharityMetrics>(`${this.baseUrl}/charities/${charityId}`);
  }

  /**
   * Get user behavior analytics
   */
  getUserBehavior(userId: string): Observable<AnalyticsEvent[]> {
    return this.http.get<AnalyticsEvent[]>(`${this.baseUrl}/users/${userId}/behavior`);
  }

  /**
   * Get impact report
   */
  getImpactReport(): Observable<{
    totalDonations: number;
    totalDonors: number;
    totalCharities: number;
    avgDonationAmount: number;
    fundsDisbursed: number;
  }> {
    return this.http.get<{
      totalDonations: number;
      totalDonors: number;
      totalCharities: number;
      avgDonationAmount: number;
      fundsDisbursed: number;
    }>(`${this.baseUrl}/impact-report`);
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(type: 'top-donors' | 'top-charities' | 'rising-charities'): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaderboard/${type}`);
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(page: string): void {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeOnPage = (Date.now() - startTime) / 1000; // Convert to seconds
      this.trackEvent('page_time_spent', 'engagement', {
        page,
        secondsSpent: timeOnPage,
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get local analytics
   */
  getLocalAnalytics(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Clear local analytics
   */
  clearLocalAnalytics(): void {
    this.events = [];
    this.metrics.next([]);
  }
}
