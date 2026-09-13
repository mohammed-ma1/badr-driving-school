import { Component, Input, computed, signal } from '@angular/core';
import { IconComponent } from './icon.component';

/** Five-star rating readout used by the testimonial cards. */
@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [IconComponent],
  template: `
    <span class="inline-flex items-center gap-0.5 text-brand-500" [attr.aria-label]="'تقييم ' + rating + ' من 5'" role="img">
      @for (i of slots(); track i) {
        <app-icon name="star" [size]="size" [filled]="i <= rating" [class.text-stone-300]="i > rating" />
      }
    </span>
  `,
})
export class StarsComponent {
  @Input() rating = 5;
  @Input() size = 16;

  private readonly total = signal([1, 2, 3, 4, 5]);
  readonly slots = computed(() => this.total());
}
