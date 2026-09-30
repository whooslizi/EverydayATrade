export type TrackId = 'TRACK_1' | 'TRACK_2' | 'TRACK_3';

// Pentatonic scale: D4 E4 G4 A4 B4 D5 E5 G5
const PENTATONIC = [293.66, 329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99];

class AudioManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmOscs: OscillatorNode[] = [];
  private bgmInterval: number | null = null;
  public isMuted: boolean = false;
  private initialized = false;

  public init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);
    this.initialized = true;
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  private ensureCtx() {
    if (!this.ctx) this.init();
    if (this.ctx!.state === 'suspended') this.ctx!.resume();
  }

  private playTone(freq: number, type: OscillatorType, dur: number, vol: number) {
    if (this.isMuted) return;
    this.ensureCtx();
    const c = this.ctx!;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur);
  }

  public playBGM(_trackId: TrackId = 'TRACK_1') {
    if (this.isMuted) return;
    this.stopBGM();
    this.ensureCtx();
    let noteIdx = 0;
    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const freq = PENTATONIC[noteIdx % PENTATONIC.length];
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(0.06, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(g);
      g.connect(this.bgmGain!);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
      noteIdx++;
    }, 500);
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmOscs.forEach(o => { try { o.stop(); } catch {} });
    this.bgmOscs = [];
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) this.stopBGM();
    else this.playBGM();
  }

  public playBlipSFX() {
    this.playTone(400, 'square', 0.08, 0.08);
  }

  public playCoinSFX() {
    this.playTone(1200, 'sine', 0.08, 0.08);
    setTimeout(() => this.playTone(1600, 'sine', 0.15, 0.08), 50);
  }

  public playErrorSFX() {
    this.playTone(150, 'sawtooth', 0.25, 0.12);
  }

  public playBarkSFX() {
    this.playTone(350, 'sawtooth', 0.08, 0.08);
    setTimeout(() => this.playTone(300, 'sawtooth', 0.1, 0.06), 100);
  }

  public playSizzleSFX() {
    this.playTone(800, 'square', 0.25, 0.04);
  }

  public playWinSFX() {
    this.playTone(400, 'sine', 0.1, 0.08);
    setTimeout(() => this.playTone(500, 'sine', 0.1, 0.08), 100);
    setTimeout(() => this.playTone(600, 'sine', 0.15, 0.08), 200);
  }

  public playTabSFX() {
    this.playTone(600, 'triangle', 0.06, 0.05);
  }

  public playGearSFX() {
    this.playTone(200, 'square', 0.04, 0.06);
  }

  public playSirenSFX() {
    if (this.isMuted) return;
    this.ensureCtx();
    const c = this.ctx!;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, c.currentTime);
    osc.frequency.linearRampToValueAtTime(900, c.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.6);
    g.gain.setValueAtTime(0.1, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.8);
  }

  public playWastedHit() {
    if (this.isMuted) return;
    this.ensureCtx();
    const c = this.ctx!;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, c.currentTime + 1.5);
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 1.6);
  }

  public playRegisterSFX() {
    this.playTone(1000, 'sine', 0.06, 0.1);
    setTimeout(() => this.playTone(1400, 'sine', 0.12, 0.1), 60);
  }
}

export const audioManager = new AudioManager();
