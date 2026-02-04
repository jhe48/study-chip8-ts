export class Audio {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private muted: boolean = false;

  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.1;
    }
  }

  start(): void {
    if (this.isPlaying || this.muted) {
      return;
    }

    this.initAudioContext();
    if (!this.audioContext || !this.gainNode) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 440;
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.isPlaying = true;
  }

  stop(): void {
    if (!this.isPlaying || !this.oscillator) {
      return;
    }

    this.oscillator.stop();
    this.oscillator.disconnect();
    this.oscillator = null;
    this.isPlaying = false;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.isPlaying) {
      this.stop();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }
}
