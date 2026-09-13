import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../site';

/**
 * Per-route title and description. Each page calls `set()` in its constructor,
 * which keeps the copy next to the page it describes instead of in the route table.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  set(pageTitle: string, description: string): void {
    const full = `${pageTitle} | ${SITE.name}`;
    this.title.setTitle(full);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: full });
    this.meta.updateTag({ property: 'og:description', content: description });
  }
}
