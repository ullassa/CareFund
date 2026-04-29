import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="itemHeight" [minBufferPx]="minBufferPx" [maxBufferPx]="maxBufferPx">
      <div *cdkVirtualFor="let item of items; trackBy: trackByFn" class="virtual-item">
        <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    cdk-virtual-scroll-viewport {
      height: 100%;
    }

    .virtual-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent<T> {
  @Input() items: T[] = [];
  @Input() itemHeight: number = 60;
  @Input() minBufferPx: number = 100;
  @Input() maxBufferPx: number = 200;
  @Input() itemTemplate: any;

  trackByFn(index: number, item: T): any {
    return index;
  }
}
