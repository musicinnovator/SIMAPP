/**
 * Audio Effects Engine for Web Audio API (SoundFont Integration)
 * Works directly with AudioContext nodes from SoundFont playback
 */

export interface SpatialEffectParams {
  reverb: {
    roomSize: number;
    dampening: number;
    wet: number;
    dry: number;
  };
  delay: {
    delayTime: number;
    feedback: number;
    wet: number;
    dry: number;
  };
  panning: {
    pan: number;
  };
}

export interface DynamicsEffectParams {
  compressor: {
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
    knee: number;
  };
  limiter: {
    threshold: number;
  };
  gate: {
    threshold: number;
    attack: number;
    release: number;
  };
}

export interface ModulationEffectParams {
  chorus: {
    frequency: number;
    delayTime: number;
    depth: number;
    wet: number;
  };
  phaser: {
    frequency: number;
    octaves: number;
    baseFrequency: number;
    wet: number;
  };
  tremolo: {
    frequency: number;
    depth: number;
    wet: number;
  };
}

export class AudioEffectsEngineWebAudio {
  private audioContext: AudioContext | null = null;

  // Effect nodes
  private convolver: ConvolverNode | null = null;
  private delay: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private delayWet: GainNode | null = null;
  private delayDry: GainNode | null = null;
  private panner: StereoPannerNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbWet: GainNode | null = null;
  private reverbDry: GainNode | null = null;

  // LFO nodes for modulation
  private tremoloLFO: OscillatorNode | null = null;
  private tremoloGain: GainNode | null = null;
  private tremoloDepth: GainNode | null = null;

  // Input/Output
  private inputNode: GainNode | null = null;
  private outputNode: GainNode | null = null;

  private isInitialized = false;
  private activeEffects: Set<string> = new Set();

  async initialize(audioContext: AudioContext): Promise<void> {
    if (this.isInitialized) return;

    this.audioContext = audioContext;

    try {
      // Create input and output nodes
      this.inputNode = audioContext.createGain();
      this.outputNode = audioContext.createGain();

      // Spatial Effects
      await this.initializeReverb();
      this.initializeDelay();
      this.initializePanning();

      // Dynamics Effects
      this.initializeCompressor();

      // Modulation Effects
      this.initializeTremolo();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio effects:', error);
      throw error;
    }
  }

  private async initializeReverb(): Promise<void> {
    if (!this.audioContext) return;

    this.convolver = this.audioContext.createConvolver();
    this.reverbWet = this.audioContext.createGain();
    this.reverbDry = this.audioContext.createGain();

    this.reverbWet.gain.value = 0.3;
    this.reverbDry.gain.value = 0.7;

    // Create impulse response for reverb
    await this.createReverbImpulse(2.5, this.audioContext.sampleRate);
  }

  private async createReverbImpulse(duration: number, sampleRate: number): Promise<void> {
    if (!this.audioContext || !this.convolver) return;

    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    this.convolver.buffer = impulse;
  }

  private initializeDelay(): void {
    if (!this.audioContext) return;

    this.delay = this.audioContext.createDelay(5.0);
    this.delayFeedback = this.audioContext.createGain();
    this.delayWet = this.audioContext.createGain();
    this.delayDry = this.audioContext.createGain();

    this.delay.delayTime.value = 0.25;
    this.delayFeedback.gain.value = 0.3;
    this.delayWet.gain.value = 0.2;
    this.delayDry.gain.value = 0.8;

    // Connect delay feedback loop
    this.delay.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delay);
  }

  private initializePanning(): void {
    if (!this.audioContext) return;

    this.panner = this.audioContext.createStereoPanner();
    this.panner.pan.value = 0;
  }

  private initializeCompressor(): void {
    if (!this.audioContext) return;

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;
  }

  private initializeTremolo(): void {
    if (!this.audioContext) return;

    this.tremoloLFO = this.audioContext.createOscillator();
    this.tremoloGain = this.audioContext.createGain();
    this.tremoloDepth = this.audioContext.createGain();

    this.tremoloLFO.frequency.value = 5;
    this.tremoloDepth.gain.value = 0.5;
    this.tremoloGain.gain.value = 1;

    // Connect LFO to control gain
    this.tremoloLFO.connect(this.tremoloDepth);
    this.tremoloDepth.connect(this.tremoloGain.gain);
  }

  /**
   * Connect the effects engine to a source (like SoundFont output)
   */
  connectToSource(sourceNode: AudioNode): void {
    if (!this.isInitialized || !this.inputNode) {
      console.warn('Effects engine not initialized');
      return;
    }

    sourceNode.connect(this.inputNode);
  }

  /**
   * Connect the effects output to a destination (like AudioContext.destination)
   */
  connectToDestination(destinationNode: AudioNode): void {
    if (!this.isInitialized || !this.outputNode) {
      console.warn('Effects engine not initialized');
      return;
    }

    this.outputNode.connect(destinationNode);
  }

  /**
   * Build the effect chain based on enabled effects
   */
  buildEffectChain(enabledEffects: string[]): void {
    if (!this.isInitialized || !this.inputNode || !this.outputNode || !this.audioContext) {
      console.warn('Effects engine not initialized');
      return;
    }

    // Disconnect everything first
    this.disconnectAll();

    let currentNode: AudioNode = this.inputNode;

    // Dynamics (Compressor)
    if (enabledEffects.includes('compressor') && this.compressor) {
      currentNode.connect(this.compressor);
      currentNode = this.compressor;
      this.activeEffects.add('compressor');
    }

    // Panning
    if (enabledEffects.includes('panning') && this.panner) {
      currentNode.connect(this.panner);
      currentNode = this.panner;
      this.activeEffects.add('panning');
    }

    // Reverb (wet/dry mix)
    if (enabledEffects.includes('reverb') && this.convolver && this.reverbWet && this.reverbDry) {
      const reverbMix = this.audioContext.createGain();

      currentNode.connect(this.reverbDry);
      currentNode.connect(this.convolver);
      this.convolver.connect(this.reverbWet);

      this.reverbDry.connect(reverbMix);
      this.reverbWet.connect(reverbMix);

      currentNode = reverbMix;
      this.activeEffects.add('reverb');
    }

    // Delay (wet/dry mix)
    if (enabledEffects.includes('delay') && this.delay && this.delayWet && this.delayDry) {
      const delayMix = this.audioContext.createGain();

      currentNode.connect(this.delayDry);
      currentNode.connect(this.delay);
      this.delay.connect(this.delayWet);

      this.delayDry.connect(delayMix);
      this.delayWet.connect(delayMix);

      currentNode = delayMix;
      this.activeEffects.add('delay');
    }

    // Tremolo
    if (enabledEffects.includes('tremolo') && this.tremoloGain && this.tremoloLFO) {
      currentNode.connect(this.tremoloGain);
      currentNode = this.tremoloGain;

      if (this.tremoloLFO.context.state === 'running') {
        this.tremoloLFO.start();
      }

      this.activeEffects.add('tremolo');
    }

    // Connect to output
    currentNode.connect(this.outputNode);
  }

  private disconnectAll(): void {
    this.activeEffects.clear();

    const nodes = [
      this.inputNode,
      this.convolver,
      this.delay,
      this.delayFeedback,
      this.delayWet,
      this.delayDry,
      this.panner,
      this.compressor,
      this.reverbWet,
      this.reverbDry,
      this.tremoloLFO,
      this.tremoloGain,
      this.tremoloDepth,
    ];

    nodes.forEach((node) => {
      if (node) {
        try {
          node.disconnect();
        } catch (e) {
          // Node may not be connected
        }
      }
    });
  }

  // Effect parameter controls
  updateReverb(params: Partial<SpatialEffectParams['reverb']>): void {
    if (!this.audioContext || !this.convolver || !this.reverbWet || !this.reverbDry) return;

    if (params.roomSize !== undefined) {
      // Recreate impulse with new room size
      const duration = params.roomSize * 5;
      this.createReverbImpulse(duration, this.audioContext.sampleRate);
    }
    if (params.wet !== undefined && this.reverbWet) {
      this.reverbWet.gain.value = params.wet;
    }
    if (params.dry !== undefined && this.reverbDry) {
      this.reverbDry.gain.value = params.dry;
    }
  }

  updateDelay(params: Partial<SpatialEffectParams['delay']>): void {
    if (!this.delay || !this.delayFeedback || !this.delayWet || !this.delayDry) return;

    if (params.delayTime !== undefined) {
      this.delay.delayTime.value = params.delayTime;
    }
    if (params.feedback !== undefined) {
      this.delayFeedback.gain.value = params.feedback;
    }
    if (params.wet !== undefined) {
      this.delayWet.gain.value = params.wet;
    }
    if (params.dry !== undefined) {
      this.delayDry.gain.value = params.dry;
    }
  }

  updatePanning(pan: number): void {
    if (!this.panner) return;
    this.panner.pan.value = pan;
  }

  updateCompressor(params: Partial<DynamicsEffectParams['compressor']>): void {
    if (!this.compressor) return;

    if (params.threshold !== undefined) {
      this.compressor.threshold.value = params.threshold;
    }
    if (params.ratio !== undefined) {
      this.compressor.ratio.value = params.ratio;
    }
    if (params.attack !== undefined) {
      this.compressor.attack.value = params.attack;
    }
    if (params.release !== undefined) {
      this.compressor.release.value = params.release;
    }
    if (params.knee !== undefined) {
      this.compressor.knee.value = params.knee;
    }
  }

  updateTremolo(params: Partial<ModulationEffectParams['tremolo']>): void {
    if (!this.tremoloLFO || !this.tremoloDepth) return;

    if (params.frequency !== undefined) {
      this.tremoloLFO.frequency.value = params.frequency;
    }
    if (params.depth !== undefined) {
      this.tremoloDepth.gain.value = params.depth;
    }
  }

  updateLimiter(threshold: number): void {
    // Web Audio API doesn't have a limiter node
    // Use compressor with high ratio as limiter
    if (!this.compressor) return;
    this.compressor.threshold.value = threshold;
    this.compressor.ratio.value = 20;
  }

  updateGate(params: Partial<DynamicsEffectParams['gate']>): void {
    // Web Audio API doesn't have a gate node
    // Gate would need custom implementation with gain automation
    console.log('Gate effect not yet implemented in Web Audio engine');
  }

  updateChorus(params: Partial<ModulationEffectParams['chorus']>): void {
    // Chorus requires multiple delay lines - not yet implemented
    console.log('Chorus effect not yet implemented in Web Audio engine');
  }

  updatePhaser(params: Partial<ModulationEffectParams['phaser']>): void {
    // Phaser requires all-pass filters - not yet implemented
    console.log('Phaser effect not yet implemented in Web Audio engine');
  }

  getActiveEffects(): string[] {
    return Array.from(this.activeEffects);
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  dispose(): void {
    this.disconnectAll();

    if (this.tremoloLFO) {
      try {
        this.tremoloLFO.stop();
      } catch (e) {
        // Already stopped
      }
    }

    this.isInitialized = false;
    this.activeEffects.clear();
  }
}
