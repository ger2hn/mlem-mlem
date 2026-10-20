// Web Audio API synthesizer for adorable gentle chimes and cute bloom effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private isPlayingMusic: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isPlayingMusic) {
      this.stopAmbientMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cute organic "Pop / Bloop" when sprout shoots up from ground
  public playSproutSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Gentle rising pentatonic kalimba note
  public playNote(freq: number, duration: number = 0.4, type: OscillatorType = 'triangle', volume: number = 0.12) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Growth sequence: rising notes
  public playGrowthSound(stageIndex: number) {
    if (this.isMuted) return;
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25]; // C D E G A C E
    const freq = frequencies[stageIndex % frequencies.length];
    this.playNote(freq, 0.45, 'sine', 0.15);
  }

  // Full Bloom: glorious sparkling chime arpeggio
  public playBloomChimes() {
    if (this.isMuted) return;
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    chord.forEach((freq, i) => {
      setTimeout(() => {
        this.playNote(freq, 0.9, 'sine', 0.14);
      }, i * 90);
    });
  }

  // Hovering on a photo petal
  public playPetalHoverSound() {
    if (this.isMuted) return;
    this.playNote(880 + Math.random() * 200, 0.25, 'sine', 0.06);
  }

  // Clicking a photo petal to inspect
  public playPetalClickSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Harmonic bell
    const baseFreq = 587.33; // D5
    [1, 2.01, 3.02].forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      const vol = (0.15 / (i + 1));
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.82);
    });
  }

  // Showering petals explosion
  public playShowerPetalsSound() {
    if (this.isMuted) return;
    const notes = [659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const freq = notes[Math.floor(Math.random() * notes.length)] * (1 + Math.random() * 0.1);
        this.playNote(freq, 0.35, 'triangle', 0.08);
      }, i * 60);
    }
  }

  // Cute ambient music box melody toggle
  public toggleAmbientMusic(): boolean {
    if (this.isPlayingMusic) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic();
      return true;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlayingMusic;
  }

  public startAmbientMusic() {
    if (this.isMuted) this.isMuted = false;
    this.isPlayingMusic = true;

    const melodyNotes = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.00, 698.46,
      659.25, 783.99, 1046.50, 783.99,
      783.99, 987.77, 1174.66, 987.77
    ];
    let noteIndex = 0;

    const playStep = () => {
      if (!this.isPlayingMusic) return;
      const freq = melodyNotes[noteIndex % melodyNotes.length];
      this.playNote(freq, 0.6, 'sine', 0.05);
      // light bass note occasionally
      if (noteIndex % 4 === 0) {
        this.playNote(freq / 2, 0.9, 'triangle', 0.04);
      }
      noteIndex++;
    };

    playStep();
    this.musicInterval = setInterval(playStep, 550);
  }

  public stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sounds = new SoundManager();
