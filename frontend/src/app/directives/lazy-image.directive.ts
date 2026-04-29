import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  @Input() appLazyImage: string = ''; // Main image URL
  @Input() appLazyImagePlaceholder: string = ''; // Placeholder URL
  @Input() appLazyImageWebp: string = ''; // WebP format URL
  @Input() appLazyImageSrcset: string = ''; // Responsive sizes

  private imageElement: HTMLImageElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.imageElement = el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.appLazyImage) return;

    // Set placeholder
    if (this.appLazyImagePlaceholder) {
      this.renderer.setAttribute(this.imageElement, 'src', this.appLazyImagePlaceholder);
      this.renderer.addClass(this.imageElement, 'lazy-placeholder');
    }

    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage();
            observer.unobserve(this.imageElement);
          }
        });
      }, {
        rootMargin: '50px' // Start loading 50px before entering viewport
      });

      observer.observe(this.imageElement);
    } else {
      // Fallback for older browsers
      this.loadImage();
    }
  }

  private loadImage(): void {
    // Set srcset for responsive images
    if (this.appLazyImageSrcset) {
      this.renderer.setAttribute(this.imageElement, 'srcset', this.appLazyImageSrcset);
    }

    // Add WebP source with fallback
    if (this.appLazyImageWebp) {
      const picture = this.imageElement.parentElement;
      if (picture?.tagName === 'PICTURE') {
        const webpSource = this.renderer.createElement('source');
        this.renderer.setAttribute(webpSource, 'srcset', this.appLazyImageWebp);
        this.renderer.setAttribute(webpSource, 'type', 'image/webp');
        this.renderer.insertBefore(picture, webpSource, this.imageElement);
      }
    }

    // Load main image
    const img = new Image();
    img.onload = () => {
      this.renderer.setAttribute(this.imageElement, 'src', this.appLazyImage);
      this.renderer.removeClass(this.imageElement, 'lazy-placeholder');
      this.renderer.addClass(this.imageElement, 'lazy-loaded');
    };
    img.src = this.appLazyImage;
  }
}
