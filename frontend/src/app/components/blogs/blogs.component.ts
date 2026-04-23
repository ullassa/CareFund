import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  allPosts: any[] = [];
  categories = ['All'];
  selectedCategory = 'All';
  isLoading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadCharities();
  }

  loadCharities(): void {
    this.isLoading = true;
    this.api.getPublicCharities().subscribe({
      next: (response: any) => {
        const items = (response?.items ?? []).filter((item: any) => item.status === 'Approved');
        this.allPosts = items.slice(0, 8).map((item: any, index: number) => ({
          id: item.charityId ?? index,
          title: item.charityName || 'Charity Update',
          description: item.about || item.mission || 'Supporting communities in need',
          cause: item.cause || 'Community Support',
          location: item.location || 'India',
          raised: Number(item.totalReceived || 0),
          target: Number(item.targetAmount || 0),
          progress: Number(item.progressPercent || 0),
          imageUrl: Array.isArray(item.imageUrls) && item.imageUrls.length > 0 ? item.imageUrls[0] : ''
        }));

        const liveCategories = Array.from(new Set(this.allPosts.map(post => post.cause).filter(Boolean)));
        this.categories = ['All', ...liveCategories];
        this.isLoading = false;
      },
      error: () => {
        this.allPosts = [];
        this.categories = ['All'];
        this.isLoading = false;
      }
    });
  }

  get filteredPosts() {
    return this.selectedCategory === 'All'
      ? this.allPosts
      : this.allPosts.filter(post => post.cause === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  normalizeImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('/images/')) return url;
    if (url.startsWith('http')) return url;
    return `http://localhost:5294${url.startsWith('/') ? url : '/' + url}`;
  }
}
