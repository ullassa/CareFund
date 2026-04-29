import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule, LazyImageDirective],
  template: `
    <picture>
      <source 
        *ngIf="sources.length > 0"
        [srcset]="sources[0].srcset" 
        [type]="sources[0].type"
        media="(min-width: 768px)"
      />
      <source 
        *ngIf="sources.length > 1"
        [srcset]="sources[1].srcset" 
        [type]="sources[1].type"
        media="(max-width: 767px)"
      />
      <img
        [appLazyImage]="imageUrl"
        [appLazyImagePlaceholder]="placeholder"
        [appLazyImageWebp]="webpUrl"
        [appLazyImageSrcset]="srcset"
        [alt]="alt"
        [class]="imageClass"
        loading="lazy"
      />
    </picture>
  `,
  styles: [`
    :host {
      display: block;
    }

    picture {
      display: block;
      width: 100%;
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      max-width: 100%;
    }

    img.lazy-placeholder {
      filter: blur(8px);
      opacity: 0.6;
      transition: filter 0.3s, opacity 0.3s;
    }

    img.lazy-loaded {
      filter: blur(0);
      opacity: 1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedImageComponent {
  @Input() imageUrl: string = '';
  @Input() webpUrl: string = '';
  @Input() placeholder: string = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E';
  @Input() srcset: string = '';
  @Input() alt: string = 'Image';
  @Input() imageClass: string = '';
  @Input() sources: Array<{ srcset: string; type: string }> = [];

  constructor() {}
}
