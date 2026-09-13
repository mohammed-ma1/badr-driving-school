import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'badr-feedback-enabled';

/**
 * Short tones and haptic taps for exam interactions.
 *
 * Tones are synthesised with the Web Audio API rather than shipped as audio
 * files: every cue here is a sine blip under half a second, so generating them
 * costs nothing to download and never waits on a network fetch mid-question.
 *
 * The context is created lazily on the first cue. Browsers refuse to start
 * audio outside a user gesture, and every call site is a tap, so building it on
 * demand is both legal and avoids holding an audio device open for visitors who
 * never sit an exam.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  /** Persisted so a student who mutes once stays muted on the next visit. */
  readonly enabled = signal(readStored());

  private ctx: AudioContext | null = null;

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    } catch {
      // Private browsing can refuse storage; the in-memory signal still works.
    }
    // Confirm the new state audibly, so the toggle proves itself.
    if (next) this.tick();
  }

  /**
   * Neutral selection blip.
   *
   * Used when an answer is chosen *during* an exam. It must stay neutral: the
   * exam only reveals correctness after submission, so a right/wrong tone here
   * would hand the student the answer key.
   */
  tick(): void {
    this.tone([{ freq: 660, start: 0, duration: 0.07, gain: 0.07 }]);
    this.buzz(12);
  }

  /** Rising two-note cue for a revealed correct answer. */
  correct(): void {
    this.tone([
      { freq: 740, start: 0, duration: 0.1, gain: 0.08 },
      { freq: 1110, start: 0.09, duration: 0.16, gain: 0.08 },
    ]);
    this.buzz(18);
  }

  /** Falling, duller cue for a revealed wrong answer. */
  wrong(): void {
    this.tone([
      { freq: 300, start: 0, duration: 0.13, gain: 0.08, type: 'triangle' },
      { freq: 196, start: 0.12, duration: 0.22, gain: 0.08, type: 'triangle' },
    ]);
    this.buzz([30, 45, 30]);
  }

  /** Arpeggio for a passing result. */
  pass(): void {
    this.tone([
      { freq: 523, start: 0, duration: 0.13, gain: 0.08 },
      { freq: 659, start: 0.12, duration: 0.13, gain: 0.08 },
      { freq: 784, start: 0.24, duration: 0.13, gain: 0.08 },
      { freq: 1047, start: 0.36, duration: 0.3, gain: 0.09 },
    ]);
    this.buzz([28, 60, 28, 60, 55]);
  }

  /** Soft descending pair for a failing result — a nudge, not a punishment. */
  fail(): void {
    this.tone([
      { freq: 415, start: 0, duration: 0.2, gain: 0.07, type: 'triangle' },
      { freq: 311, start: 0.19, duration: 0.34, gain: 0.07, type: 'triangle' },
    ]);
    this.buzz([40, 70, 40]);
  }

  // ---- plumbing ------------------------------------------------------------

  private tone(notes: Note[]): void {
    if (!this.enabled()) return;
    const ctx = this.audio();
    if (!ctx) return;

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = note.type ?? 'sine';
      osc.frequency.value = note.freq;

      // A tiny attack/release ramp: stopping a sine at full amplitude produces
      // an audible click on most output devices.
      const at = ctx.currentTime + note.start;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(note.gain, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + note.duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + note.duration + 0.02);
    }
  }

  private buzz(pattern: number | number[]): void {
    if (!this.enabled()) return;
    // Desktop browsers and every iOS browser lack the Vibration API; the tone
    // is the fallback, so a missing `vibrate` is not worth reporting.
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Some browsers throw when the document is not user-activated.
    }
  }

  private audio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const Ctor = window.AudioContext ?? (window as WindowWithLegacyAudio).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx ??= new Ctor();
      // Safari parks the context in `suspended` until a gesture resumes it.
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }
}

interface Note {
  freq: number;
  /** Seconds from now. */
  start: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
}

interface WindowWithLegacyAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function readStored(): boolean {
  try {
    // Default on: the feature is the point, and there is a visible mute toggle.
    return localStorage.getItem(STORAGE_KEY) !== '0';
  } catch {
    return true;
  }
}
