export type TrackId = 'TRACK_1' | 'TRACK_2' | 'TRACK_3';

class AudioManager {
  private currentTrack: HTMLAudioElement | null = null;
  private sfxContext: AudioContext | null = null;
  public isMuted: boolean = false;

  private tracks: Record<TrackId, string> = {
    TRACK_1: 'https://cdn.freesound.org/previews/518/518925_9841808-lq.mp3', // Hanoi Dusk Memories
    TRACK_2: 'https://cdn.freesound.org/previews/464/464906_9961300-lq.mp3', // Sidewalk Hustle
    TRACK_3: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3', // Midnight Under The Bridge
  };

  private initSFX() {
    if (!this.sfxContext) {
      this.sfxContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.sfxContext.state === 'suspended') {
      this.sfxContext.resume();
    }
  }

  public playBGM(trackId: TrackId = 'TRACK_1') {
    if (this.isMuted) return;
    
    if (this.currentTrack) {
      this.currentTrack.pause();
      this.currentTrack.src = '';
    }

    this.currentTrack = new Audio(this.tracks[trackId]);
    this.currentTrack.loop = true;
    this.currentTrack.volume = 0.5;
    this.currentTrack.play().catch(e => console.warn('BGM play failed', e));
  }

  public stopBGM() {
    if (this.currentTrack) {
      this.currentTrack.pause();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    } else {
      this.playBGM();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    if (this.isMuted) return;
    this.initSFX();
    const ctx = this.sfxContext!;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  public playBlipSFX() {
    this.playTone(400, 'square', 0.1, 0.1);
  }

  public playCoinSFX() {
    this.playTone(1200, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1600, 'sine', 0.2, 0.1), 50);
  }

  public playErrorSFX() {
    this.playTone(150, 'sawtooth', 0.3, 0.15);
  }
  
  public playBarkSFX() {
    this.playTone(300, 'sawtooth', 0.1, 0.1);
  }

  public playSizzleSFX() {
    this.playTone(800, 'square', 0.3, 0.05);
  }
  
  public playWinSFX() {
    this.playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(500, 'sine', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(600, 'sine', 0.2, 0.1), 200);
  }
}

export const audioManager = new AudioManager();
