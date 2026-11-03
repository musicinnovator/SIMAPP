import * as Tone from 'tone';

class GlobalAudioEffects {
  private static instance: GlobalAudioEffects;
  private initialized: boolean = false;

  // Effects nodes
  public effectsChain: Tone.Gain | null = null;
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private compressor: Tone.Compressor | null = null;
  private limiter: Tone.Limiter | null = null;
  private chorus: Tone.Chorus | null = null;
  private phaser: Tone.Phaser | null = null;
  private tremolo: Tone.Tremolo | null = null;

  private constructor() {}

  public static getInstance(): GlobalAudioEffects {
    if (!GlobalAudioEffects.instance) {
      GlobalAudioEffects.instance = new GlobalAudioEffects();
    }
    return GlobalAudioEffects.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Start Tone.js audio context
      await Tone.start();

      // Create effects chain starting point
      this.effectsChain = new Tone.Gain(1);

      // Create effects in order
      this.reverb = new Tone.Reverb({
        decay: 2.5,
        wet: 0
      });

      this.delay = new Tone.FeedbackDelay({
        delayTime: 0.25,
        feedback: 0.3,
        wet: 0
      });

      this.compressor = new Tone.Compressor({
        threshold: -24,
        ratio: 4,
        attack: 0.003,
        release: 0.25
      });

      this.limiter = new Tone.Limiter(-3);

      this.chorus = new Tone.Chorus({
        frequency: 4,
        delayTime: 2.5,
        depth: 0.5,
        wet: 0
      });

      this.phaser = new Tone.Phaser({
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 350,
        wet: 0
      });

      this.tremolo = new Tone.Tremolo({
        frequency: 5,
        depth: 0.5,
        wet: 0
      });

      // Connect effects chain
      this.effectsChain.chain(
        this.reverb,
        this.delay,
        this.compressor,
        this.limiter,
        this.chorus,
        this.phaser,
        this.tremolo,
        Tone.Destination
      );

      // Generate reverb impulse response
      await this.reverb.generate();

      // Start modulation effects (only for those that need it)
      // Check if they're already started to prevent "start time" errors
      try {
        if (this.chorus.state === 'stopped') {
          this.chorus.start();
        }
      } catch (e) {
        console.warn('Chorus already started or error:', e);
      }

      try {
        if (this.tremolo.state === 'stopped') {
          this.tremolo.start();
        }
      } catch (e) {
        console.warn('Tremolo already started or error:', e);
      }

      this.initialized = true;
      console.log('Global Audio Effects initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio effects:', error);
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  // Update methods for each effect
  public updateReverb(wet: number, decay: number): void {
    if (this.reverb) {
      this.reverb.wet.value = wet;
      this.reverb.decay = decay;
    }
  }

  public updateDelay(wet: number, delayTime: number, feedback: number): void {
    if (this.delay) {
      this.delay.wet.value = wet;
      this.delay.delayTime.value = delayTime;
      this.delay.feedback.value = feedback;
    }
  }

  public updateCompressor(threshold: number, ratio: number): void {
    if (this.compressor) {
      this.compressor.threshold.value = threshold;
      this.compressor.ratio.value = ratio;
    }
  }

  public updateChorus(wet: number, frequency: number): void {
    if (this.chorus) {
      this.chorus.wet.value = wet;
      this.chorus.frequency.value = frequency;
    }
  }

  public updatePhaser(wet: number, frequency: number): void {
    if (this.phaser) {
      this.phaser.wet.value = wet;
      this.phaser.frequency.value = frequency;
    }
  }

  public updateTremolo(wet: number, frequency: number): void {
    if (this.tremolo) {
      this.tremolo.wet.value = wet;
      this.tremolo.frequency.value = frequency;
    }
  }

  public dispose(): void {
    if (this.reverb) this.reverb.dispose();
    if (this.delay) this.delay.dispose();
    if (this.compressor) this.compressor.dispose();
    if (this.limiter) this.limiter.dispose();
    if (this.chorus) this.chorus.dispose();
    if (this.phaser) this.phaser.dispose();
    if (this.tremolo) this.tremolo.dispose();
    if (this.effectsChain) this.effectsChain.dispose();

    this.initialized = false;
  }
}

export const globalAudioEffects = GlobalAudioEffects.getInstance();
