import { Component, Input } from '@angular/core';

/**
 * Hand-drawn traffic signs for the flashcard deck.
 *
 * These are illustrations, not photographs: drawn on a 100×100 grid with the
 * real shape/colour conventions (red triangle = warning, red ring = prohibition,
 * blue disc = mandatory) so a student learns to read the *category* from the
 * silhouette, which is what actually matters on the road at speed.
 */
@Component({
  selector: 'app-traffic-sign',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100" role="img" [attr.aria-label]="label">
      @switch (art) {
        @case ('stop') {
          <polygon points="31,6 69,6 94,31 94,69 69,94 31,94 6,69 6,31" fill="#d81e05" stroke="#fff" stroke-width="5" />
          <text x="50" y="63" text-anchor="middle" font-size="30" font-weight="800" fill="#fff" font-family="Tajawal, sans-serif">قف</text>
        }
        @case ('yield') {
          <path d="M50 92 6 12h88Z" fill="#d81e05" stroke="#d81e05" stroke-width="6" stroke-linejoin="round" />
          <path d="M50 76 23 26h54Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round" />
        }
        @case ('no-entry') {
          <circle cx="50" cy="50" r="44" fill="#d81e05" />
          <rect x="20" y="42" width="60" height="16" rx="3" fill="#fff" />
        }
        @case ('speed-60') {
          <circle cx="50" cy="50" r="44" fill="#fff" stroke="#d81e05" stroke-width="11" />
          <text x="50" y="65" text-anchor="middle" font-size="40" font-weight="800" fill="#1a1a1a" font-family="'Open Sans', sans-serif">{{ value || '60' }}</text>
        }
        @case ('no-overtaking') {
          <circle cx="50" cy="50" r="44" fill="#fff" stroke="#d81e05" stroke-width="10" />
          <g stroke="#1a1a1a" stroke-width="3" fill="#1a1a1a">
            <rect x="24" y="38" width="20" height="26" rx="4" />
          </g>
          <g stroke="#d81e05" stroke-width="3" fill="#d81e05">
            <rect x="56" y="34" width="20" height="26" rx="4" />
          </g>
          <path d="M24 33v-6M76 67v6" stroke="#1a1a1a" stroke-width="3" />
        }
        @case ('no-parking') {
          <circle cx="50" cy="50" r="44" fill="#0a3d91" stroke="#d81e05" stroke-width="10" />
          <path d="M22 22 78 78" stroke="#d81e05" stroke-width="11" stroke-linecap="round" />
          <text x="50" y="66" text-anchor="middle" font-size="42" font-weight="800" fill="#fff" font-family="'Open Sans', sans-serif">P</text>
        }
        @case ('no-horn') {
          <circle cx="50" cy="50" r="44" fill="#fff" stroke="#d81e05" stroke-width="10" />
          <path d="M34 42h8l14-10v36L42 58h-8Z" fill="#1a1a1a" />
          <path d="M64 40c4 6 4 14 0 20" stroke="#1a1a1a" stroke-width="4" fill="none" stroke-linecap="round" />
          <path d="M22 22 78 78" stroke="#d81e05" stroke-width="9" stroke-linecap="round" />
        }
        @case ('pedestrian') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <g fill="#1a1a1a">
            <circle cx="48" cy="40" r="4" />
            <path d="M46 45h5l5 12-4 2-3-6v6l4 14h-5l-4-12-4 12h-5l5-16Z" />
          </g>
          <g stroke="#1a1a1a" stroke-width="2.5">
            <path d="M33 76h34M36 71h30M39 66h24" />
          </g>
        }
        @case ('children') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <g fill="#1a1a1a">
            <circle cx="40" cy="44" r="4" />
            <path d="M38 49h5l4 10-3 2-2-4 3 15h-4l-3-9-3 9h-4l4-16Z" />
            <circle cx="58" cy="47" r="4" />
            <path d="M56 52h5l4 9-3 2-2-4 3 13h-4l-3-8-3 8h-4l4-14Z" />
          </g>
        }
        @case ('bump') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <path d="M30 68h40" stroke="#1a1a1a" stroke-width="5" stroke-linecap="round" />
          <path d="M34 68a16 10 0 0 1 32 0" fill="none" stroke="#1a1a1a" stroke-width="5" />
        }
        @case ('slippery') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <rect x="38" y="44" width="24" height="16" rx="4" fill="#1a1a1a" />
          <g stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linecap="round">
            <path d="M30 68c4-4 4-8 0-12M38 72c4-4 4-8 0-12M62 68c-4-4-4-8 0-12M70 72c-4-4-4-8 0-12" />
          </g>
        }
        @case ('descent') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <path d="M28 48 72 74H28Z" fill="#1a1a1a" />
          <text x="52" y="46" text-anchor="middle" font-size="16" font-weight="800" fill="#1a1a1a" font-family="'Open Sans', sans-serif">10%</text>
        }
        @case ('curve') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <path d="M44 76V58c0-9 12-9 12-18v-4" stroke="#1a1a1a" stroke-width="6" fill="none" stroke-linecap="round" />
          <path d="m50 40 6-8 6 8Z" fill="#1a1a1a" />
        }
        @case ('traffic-light') {
          <path d="M50 8 94 86H6Z" fill="#d81e05" stroke="#d81e05" stroke-width="8" stroke-linejoin="round" />
          <path d="M50 25 80 78H20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" />
          <rect x="40" y="36" width="20" height="40" rx="5" fill="#1a1a1a" />
          <circle cx="50" cy="45" r="4.5" fill="#d81e05" />
          <circle cx="50" cy="56" r="4.5" fill="#f7b500" />
          <circle cx="50" cy="67" r="4.5" fill="#12a150" />
        }
        @case ('roundabout') {
          <circle cx="50" cy="50" r="44" fill="#0a3d91" />
          <g stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round">
            <path d="M50 76a26 26 0 0 1-16-46" />
            <path d="M66 34a26 26 0 0 1 4 30" />
          </g>
          <path d="m30 24 12 2-8 10Z" fill="#fff" />
          <path d="m74 60-10 8 14 4Z" fill="#fff" />
          <path d="M50 78v10" stroke="#fff" stroke-width="7" stroke-linecap="round" />
        }
        @case ('straight') {
          <circle cx="50" cy="50" r="44" fill="#0a3d91" />
          <path d="M50 76V34" stroke="#fff" stroke-width="9" stroke-linecap="round" />
          <path d="m50 22 16 18H34Z" fill="#fff" />
        }
        @case ('one-way') {
          <rect x="4" y="30" width="92" height="40" rx="5" fill="#0a3d91" />
          <path d="M26 50h44" stroke="#fff" stroke-width="8" stroke-linecap="round" />
          <path d="m78 50-18 12V38Z" fill="#fff" />
        }
        @case ('hospital') {
          <rect x="8" y="8" width="84" height="84" rx="8" fill="#0a3d91" />
          <path d="M38 26v48M62 26v48M38 50h24" stroke="#fff" stroke-width="9" stroke-linecap="round" />
        }
        @default {
          <circle cx="50" cy="50" r="44" fill="#e7e5e4" />
          <text x="50" y="60" text-anchor="middle" font-size="34" fill="#78716c">?</text>
        }
      }
    </svg>
  `,
})
export class TrafficSignComponent {
  /** Matches `TrafficSign.id` in the signs data, minus the numeric suffix. */
  @Input({ required: true }) art!: string;
  @Input() size: number | string = 96;
  @Input() label = '';
  /** Number printed inside the speed-limit disc. */
  @Input() value = '';
}
