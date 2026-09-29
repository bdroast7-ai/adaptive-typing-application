// Audio feedback system using Web Audio API
class AudioFeedbackSystem {
  private audioContext: AudioContext | null = null;
  private clickBuffer: AudioBuffer | null = null;
  private errorBuffer: AudioBuffer | null = null;
  private enabled: boolean = true;

  async initialize() {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Generate click sound (short beep)
    this.clickBuffer = this.generateClickSound();
    
    // Generate error sound (lower pitch thud)
    this.errorBuffer = this.generateErrorSound();
  }

  private generateClickSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.05; // 50ms
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      // Short sine wave at 800Hz with envelope
      const envelope = Math.exp(-t * 50);
      data[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.3;
    }

    return buffer;
  }

  private generateErrorSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.08; // 80ms
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      // Lower frequency (200Hz) with different envelope for "thud" sound
      const envelope = Math.exp(-t * 30);
      data[i] = Math.sin(2 * Math.PI * 200 * t) * envelope * 0.4;
    }

    return buffer;
  }

  playClick() {
    if (!this.enabled || !this.audioContext || !this.clickBuffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.clickBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  playError() {
    if (!this.enabled || !this.audioContext || !this.errorBuffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.errorBuffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const audioFeedback = new AudioFeedbackSystem();
