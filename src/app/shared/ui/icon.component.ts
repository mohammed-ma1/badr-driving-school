import { Component, Input } from '@angular/core';

/**
 * The app's whole icon set, inlined. A single component beats an icon-font or a
 * runtime SVG fetch here: the site is static and every icon ships in the same
 * chunk, so nothing flashes in on first paint.
 *
 * All art is drawn on a 24×24 grid with a 2px stroke and `currentColor`, so size
 * and colour come from the host's Tailwind classes.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="shrink-0">
      @switch (name) {
        @case ('car') {
          <path d="M5 17H3v-5l2-5h14l2 5v5h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6M3 12h18" />
        }
        @case ('wheel') {
          <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 9V3M14.6 13.5l5.2 3M9.4 13.5l-5.2 3" />
        }
        @case ('moto') {
          <circle cx="5.5" cy="17" r="3.5" /><circle cx="18.5" cy="17" r="3.5" /><path d="M9 17h6l-3-6h4l-2-4h-3" /><path d="M5.5 17 9 11h3" />
        }
        @case ('tractor') {
          <circle cx="6.5" cy="16.5" r="4.5" /><circle cx="18" cy="18" r="3" /><path d="M6.5 12V7h5l2 5h4.5v3" /><path d="M11 12h5" />
        }
        @case ('taxi') {
          <path d="M5 17H3v-5l2-5h14l2 5v5h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6M3 12h18M9 7V4h6v3" />
        }
        @case ('truck') {
          <path d="M2 17V6h11v11" /><path d="M13 9h4l4 4v4h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /><path d="M9 18h6" />
        }
        @case ('truck-sm') {
          <rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h3l3 3v3h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
        }
        @case ('accessible') {
          <circle cx="12" cy="4.5" r="2" /><path d="M12 8v5h5l2 7" /><path d="M12 13a5 5 0 1 0 3.5 8.5" />
        }
        @case ('cone') {
          <path d="M12 3 6 19h12L12 3Z" /><path d="M9 12h6M8 15.5h8" /><path d="M4 21h16" />
        }
        @case ('road') {
          <path d="M5 21 8 3M19 21 16 3" /><path d="M12 4v3M12 11v3M12 18v3" />
        }
        @case ('sign') {
          <path d="M12 22v-7" /><path d="M5 4h10l3 3.5-3 3.5H5z" /><circle cx="12" cy="7.5" r="0" />
        }
        @case ('medal') {
          <circle cx="12" cy="15" r="6" /><path d="m9 9-3-6M15 9l3-6M8 3h8" /><path d="m12 12.5 1 2 2 .3-1.4 1.4.3 2-1.9-1-1.9 1 .3-2L9 14.8l2-.3Z" />
        }
        @case ('shield') {
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" />
        }
        @case ('users') {
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        }
        @case ('user') {
          <path d="M19 21v-2a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5v2" /><circle cx="12" cy="7" r="4" />
        }
        @case ('spark') {
          <path d="M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /><circle cx="12" cy="12" r="3.5" />
        }
        @case ('phone') {
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
        }
        @case ('whatsapp') {
          <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.3L3.5 20.5l1.7-4.9A8.4 8.4 0 1 1 21 11.5Z" /><path d="M8.8 8.4c.3-.6.6-.6 1-.6h.4c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a6 6 0 0 0 2.6 2.3c.3.1.5.1.7-.1l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.3.2.3.4.3.6a2 2 0 0 1-1.4 1.4c-.7.1-2.4 0-4.6-2a9.6 9.6 0 0 1-2.8-4c-.2-.7-.2-1.5.1-2.1Z" />
        }
        @case ('file') {
          <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5M9 13h6M9 17h4" />
        }
        @case ('clipboard') {
          <rect x="7" y="4" width="10" height="4" rx="1" /><path d="M17 6h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" /><path d="m8.5 13.5 1.5 1.5 3-3" /><path d="M8.5 18h7" />
        }
        @case ('chat') {
          <path d="M21 12a8 8 0 0 1-11.7 7.1L4 21l1.9-5.3A8 8 0 1 1 21 12Z" /><path d="M9 11h6M9 14.5h4" />
        }
        @case ('check') {
          <path d="M20 6 9 17l-5-5" />
        }
        @case ('check-circle') {
          <circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" />
        }
        @case ('x') {
          <path d="M18 6 6 18M6 6l12 12" />
        }
        @case ('x-circle') {
          <circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9l6 6" />
        }
        @case ('star') {
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z" [attr.fill]="filled ? 'currentColor' : 'none'" />
        }
        @case ('menu') {
          <path d="M4 6h16M4 12h16M4 18h16" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" />
        }
        @case ('chevron-start') {
          <path d="m9 6 6 6-6 6" />
        }
        @case ('arrow-start') {
          <path d="M19 12H5M11 18l-6-6 6-6" />
        }
        @case ('arrow-end') {
          <path d="M5 12h14M13 6l6 6-6 6" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
        }
        @case ('timer') {
          <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 1.5M9 2h6M12 5V2" />
        }
        @case ('map-pin') {
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        }
        @case ('mail') {
          <rect x="2" y="5" width="20" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
        }
        @case ('grid') {
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
        }
        @case ('wrench') {
          <path d="M14.5 5.5a4 4 0 1 0 4.2 6.5l-2.7-2.7 1.4-1.4 2.7 2.7A4 4 0 0 0 14.5 5.5Z" /><path d="m13 11-8 8 2.5 2.5 8-8" />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" /><path d="M8 15h3M14 15h2" />
        }
        @case ('play') {
          <circle cx="12" cy="12" r="9" /><path d="m10 8.5 6 3.5-6 3.5Z" />
        }
        @case ('refresh') {
          <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 21v-5h5" />
        }
        @case ('info') {
          <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
        }
        @case ('quote') {
          <path d="M9 6C6 7 4.5 9.5 4.5 13.5c0 2.5 1.4 4 3.3 4 1.7 0 3-1.2 3-3s-1.2-2.9-2.7-2.9c-.3 0-.6 0-.8.1.3-1.5 1.3-2.7 2.7-3.3Z" fill="currentColor" stroke="none" /><path d="M18.5 6c-3 1-4.5 3.5-4.5 7.5 0 2.5 1.4 4 3.3 4 1.7 0 3-1.2 3-3s-1.2-2.9-2.7-2.9c-.3 0-.6 0-.8.1.3-1.5 1.3-2.7 2.7-3.3Z" fill="currentColor" stroke="none" />
        }
        @case ('calculator') {
          <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8v3H8z" /><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
        }
        @case ('send') {
          <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4Z" />
        }
        @case ('bolt') {
          <path d="M13 2 4 14h6l-1 8 9-12h-6Z" />
        }
        @case ('target') {
          <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" />
        }
        @case ('trophy') {
          <path d="M8 4h8v6a4 4 0 0 1-8 0Z" /><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" /><path d="M12 14v4M9 21h6" />
        }
        @case ('volume-on') {
          <path d="M11 5 6 9H3v6h3l5 4Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" />
        }
        @case ('volume-off') {
          <path d="M11 5 6 9H3v6h3l5 4Z" /><path d="m16 9 5 6M21 9l-5 6" />
        }
        @case ('facebook') {
          <path d="M14 9V7a2 2 0 0 1 2-2h2V2h-3a5 5 0 0 0-5 5v2H8v3h2v10h4V12h3l.5-3Z" />
        }
        @case ('instagram') {
          <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" />
        }
        @case ('tiktok') {
          <path d="M15 3v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M15 3c.5 2.5 2 4 4.5 4.3" />
        }
        @default {
          <circle cx="12" cy="12" r="9" /><path d="M12 8v.01M12 11v5" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() size: number | string = 24;
  @Input() strokeWidth: number | string = 2;
  /** Only meaningful for `star`: draws it solid. */
  @Input() filled = false;
}
