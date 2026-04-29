import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged } from 'rxjs';

export interface SearchFilter {
  [key: string]: any;
}

export interface SearchResult<T> {
  query: string;
  results: T[];
  filters: SearchFilter;
  totalResults: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuery = new BehaviorSubject<string>('');
  private filters = new BehaviorSubject<SearchFilter>({});
  private searchHistory: string[] = [];
  private searchSuggestions = new BehaviorSubject<string[]>([]);
  private searchHistorySubject = new BehaviorSubject<string[]>([]);

  searchQuery$: Observable<string> = this.searchQuery.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  filters$: Observable<SearchFilter> = this.filters.asObservable();
  suggestions$: Observable<string[]> = this.searchSuggestions.asObservable();

  constructor() {
    this.loadSearchHistory();
    this.searchHistorySubject.next([...this.searchHistory]);
  }

  /**
   * Set search query
   */
  setSearchQuery(query: string): void {
    this.searchQuery.next(query);
    this.updateSearchHistory(query);
  }

  /**
   * Get current search query
   */
  getSearchQuery(): string {
    return this.searchQuery.value;
  }

  /**
   * Add filter
   */
  addFilter(key: string, value: any): void {
    const current = this.filters.value;
    this.filters.next({ ...current, [key]: value });
  }

  /**
   * Remove filter
   */
  removeFilter(key: string): void {
    const current = this.filters.value;
    const updated = { ...current };
    delete updated[key];
    this.filters.next(updated);
  }

  /**
   * Set all filters
   */
  setFilters(filters: SearchFilter): void {
    this.filters.next(filters);
  }

  /**
   * Get current filters
   */
  getFilters(): SearchFilter {
    return this.filters.value;
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filters.next({});
  }

  /**
   * Search in array with filters
   */
  search<T>(
    data: T[],
    query: string,
    searchableFields: (keyof T)[],
    filters?: SearchFilter
  ): SearchResult<T> {
    let results = data;

    // Apply text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter((item) =>
        searchableFields.some((field) =>
          String(item[field]).toLowerCase().includes(lowerQuery)
        )
      );
    }

    // Apply filters
    if (filters && Object.keys(filters).length > 0) {
      results = results.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (Array.isArray(value)) {
            return value.includes((item as any)[key]);
          }
          return (item as any)[key] === value;
        })
      );
    }

    return {
      query,
      results,
      filters: filters || {},
      totalResults: results.length,
      timestamp: new Date()
    };
  }

  /**
   * Get search suggestions based on history
   */
  getSuggestions(query: string): string[] {
    if (!query) return this.searchHistory.slice(0, 5);
    
    const lowerQuery = query.toLowerCase();
    return this.searchHistory
      .filter((s) => s.toLowerCase().includes(lowerQuery))
      .slice(0, 5);
  }

  /**
   * Observable search history
   */
  getSearchHistory(): Observable<string[]> {
    return this.searchHistorySubject.asObservable();
  }

  /**
   * Add term to search history
   */
  addToHistory(query: string): void {
    this.updateSearchHistory(query);
    this.searchHistorySubject.next([...this.searchHistory]);
  }

  /**
   * Clear search history
   */
  clearHistory(): void {
    this.clearSearchHistory();
    this.searchHistorySubject.next([]);
  }

  /**
   * Update search history
   */
  private updateSearchHistory(query: string): void {
    if (query.trim()) {
      this.searchHistory = [
        query,
        ...this.searchHistory.filter((s) => s !== query)
      ].slice(0, 10);
      this.saveSearchHistory();
      this.searchHistorySubject.next([...this.searchHistory]);
    }
  }

  /**
   * Save search history to localStorage
   */
  private saveSearchHistory(): void {
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

  /**
   * Load search history from localStorage
   */
  private loadSearchHistory(): void {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      this.searchHistory = JSON.parse(saved);
    }
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
    this.searchHistorySubject.next([]);
  }

  /**
   * Advanced search with multiple criteria
   */
  advancedSearch<T>(
    data: T[],
    criteria: { field: keyof T; value: any; operator?: 'contains' | 'equals' | 'gt' | 'lt' }[]
  ): T[] {
    return data.filter((item) =>
      criteria.every(({ field, value, operator = 'contains' }) => {
        const itemValue = item[field];
        switch (operator) {
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'equals':
            return itemValue === value;
          case 'gt':
            return itemValue > value;
          case 'lt':
            return itemValue < value;
          default:
            return true;
        }
      })
    );
  }
}
