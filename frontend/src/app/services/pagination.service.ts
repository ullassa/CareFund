import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PaginationOptions {
  pageSize: number;
  currentPage: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private paginationState = new BehaviorSubject<PaginationOptions>({
    pageSize: 10,
    currentPage: 1,
    totalItems: 0
  });

  pagination$: Observable<PaginationOptions> = this.paginationState.asObservable();

  constructor() {}

  /**
   * Get paginated data from response
   */
  paginateResponse<T>(
    data: T[],
    options: Partial<PaginationOptions>
  ): PaginatedResponse<T> {
    const pageSize = options.pageSize || 10;
    const currentPage = options.currentPage || 1;
    const totalItems = options.totalItems || data.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data,
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }

  /**
   * Slice data array for pagination
   */
  getPagedData<T>(data: T[], pageSize: number, pageNumber: number): T[] {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }

  /**
   * Set pagination state
   */
  setPagination(options: Partial<PaginationOptions>): void {
    const current = this.paginationState.value;
    this.paginationState.next({ ...current, ...options });
  }

  /**
   * Get current pagination state
   */
  getPaginationState(): PaginationOptions {
    return this.paginationState.value;
  }

  /**
   * Reset pagination
   */
  reset(): void {
    this.paginationState.next({
      pageSize: 10,
      currentPage: 1,
      totalItems: 0
    });
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    const current = this.paginationState.value;
    const totalPages = Math.ceil(current.totalItems / current.pageSize);
    if (current.currentPage < totalPages) {
      this.setPagination({ currentPage: current.currentPage + 1 });
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    const current = this.paginationState.value;
    if (current.currentPage > 1) {
      this.setPagination({ currentPage: current.currentPage - 1 });
    }
  }

  /**
   * Go to specific page
   */
  goToPage(pageNumber: number): void {
    this.setPagination({ currentPage: pageNumber });
  }
}
