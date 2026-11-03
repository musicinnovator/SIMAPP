import * as Tone from 'tone';

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
  flanger: {
    frequency: number;
    depth: number;
    feedback: number;
    wet: number;
  };
  tremolo: {
    frequency: number;
    depth: number;
    wet: number;
  };
}

export class AudioEffectsEngine {
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private panner: Tone.Panner | null = null;
  private compressor: Tone.Compressor | null = null;
  private limiter: Tone.Limiter | null = null;
  private gate: Tone.Gate | null = null;
  private chorus: Tone.Chorus | null = null;
  private phaser: Tone.Phaser | null = null;
  private tremolo: Tone.Tremolo | null = null;
  private eq3: Tone.EQ3 | null = null;
  private filter: Tone.Filter | null = null;

  private reverbWet: Tone.CrossFade | null = null;
  private delayWet: Tone.CrossFade | null = null;
  private chorusWet: Tone.CrossFade | null = null;
  private phaserWet: Tone.CrossFade | null = null;
  private tremoloWet: Tone.CrossFade | null = null;

  private inputNode: Tone.Gain | null = null;
  private outputNode: Tone.Gain | null = null;

  private isInitialized = false;
  private activeEffects: Set<string> = new Set();

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Input and output nodes
      this.inputNode = new Tone.Gain(1);
      this.outputNode = new Tone.Gain(1);

      // Spatial Effects
      this.reverb = new Tone.Reverb({
        decay: 2.5,
        preDelay: 0.01,
      });

      this.delay = new Tone.FeedbackDelay({
        delayTime: 0.25,
        feedback: 0.3,
        wet: 0,
      });

      this.panner = new Tone.Panner(0);

      // Dynamics Effects
      this.compressor = new Tone.Compressor({
        threshold: -24,
        ratio: 4,
        attack: 0.003,
        release: 0.25,
        knee: 30,
      });

      this.limiter = new Tone.Limiter(-3);

      this.gate = new Tone.Gate({
        threshold: -50,
        attack: 0.001,
        release: 0.1,
      });

      // Modulation Effects
      this.chorus = new Tone.Chorus({
        frequency: 4,
        delayTime: 2.5,
        depth: 0.7,
        wet: 0,
      });

      this.phaser = new Tone.Phaser({
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 350,
        wet: 0,
      });

      this.tremolo = new Tone.Tremolo({
        frequency: 5,
        depth: 0.5,
        wet: 0,
      });

      // EQ and Filter
      this.eq3 = new Tone.EQ3({
        low: 0,
        mid: 0,
        high: 0,
        lowFrequency: 250,
        highFrequency: 4000,
      });

      this.filter = new Tone.Filter({
        frequency: 1000,
        type: 'lowpass',
        rolloff: -12,
      });

      // Wet/Dry crossfaders for better control
      this.reverbWet = new Tone.CrossFade(0.3);
      this.delayWet = new Tone.CrossFade(0.2);
      this.chorusWet = new Tone.CrossFade(0);
      this.phaserWet = new Tone.CrossFade(0);
      this.tremoloWet = new Tone.CrossFade(0);

      // Start reverb generation
      await this.reverb.generate();

      // Start modulation effects
      this.chorus.start();
      this.tremolo.start();

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio effects:', error);
      throw error;
    }
  }

  connectToSource(source: Tone.ToneAudioNode): void {
    if (!this.isInitialized || !this.inputNode) {
      console.warn('Effects engine not initialized');
      return;
    }

    source.connect(this.inputNode);
  }

  connectToDestination(destination: Tone.ToneAudioNode): void {
    if (!this.isInitialized || !this.outputNode) {
      console.warn('Effects engine not initialized');
      return;
    }

    this.outputNode.connect(destination);
  }

  buildEffectChain(enabledEffects: string[]): void {
    if (!this.isInitialized || !this.inputNode || !this.outputNode) {
      console.warn('Effects engine not initialized');
      return;
    }

    // Disconnect everything first
    this.disconnectAll();

    let currentNode: Tone.ToneAudioNode = this.inputNode;

    // Build chain based on enabled effects in order
    // Order: Input -> Dynamics -> EQ/Filter -> Spatial -> Modulation -> Output

    // Dynamics (Gate -> Compressor -> Limiter)
    if (enabledEffects.includes('gate') && this.gate) {
      currentNode.connect(this.gate);
      currentNode = this.gate;
      this.activeEffects.add('gate');
    }

    if (enabledEffects.includes('compressor') && this.compressor) {
      currentNode.connect(this.compressor);
      currentNode = this.compressor;
      this.activeEffects.add('compressor');
    }

    if (enabledEffects.includes('limiter') && this.limiter) {
      currentNode.connect(this.limiter);
      currentNode = this.limiter;
      this.activeEffects.add('limiter');
    }

    // EQ and Filter
    if (enabledEffects.includes('eq') && this.eq3) {
      currentNode.connect(this.eq3);
      currentNode = this.eq3;
      this.activeEffects.add('eq');
    }

    if (enabledEffects.includes('filter') && this.filter) {
      currentNode.connect(this.filter);
      currentNode = this.filter;
      this.activeEffects.add('filter');
    }

    // Panning
    if (enabledEffects.includes('panning') && this.panner) {
      currentNode.connect(this.panner);
      currentNode = this.panner;
      this.activeEffects.add('panning');
    }

    // Spatial Effects with wet/dry
    if (enabledEffects.includes('reverb') && this.reverb && this.reverbWet) {
      currentNode.connect(this.reverbWet.a);
      currentNode.connect(this.reverb);
      this.reverb.connect(this.reverbWet.b);
      currentNode = this.reverbWet;
      this.activeEffects.add('reverb');
    }

    if (enabledEffects.includes('delay') && this.delay && this.delayWet) {
      currentNode.connect(this.delayWet.a);
      currentNode.connect(this.delay);
      this.delay.connect(this.delayWet.b);
      currentNode = this.delayWet;
      this.activeEffects.add('delay');
    }

    // Modulation Effects with wet/dry
    if (enabledEffects.includes('chorus') && this.chorus && this.chorusWet) {
      currentNode.connect(this.chorusWet.a);
      currentNode.connect(this.chorus);
      this.chorus.connect(this.chorusWet.b);
      currentNode = this.chorusWet;
      this.activeEffects.add('chorus');
    }

    if (enabledEffects.includes('phaser') && this.phaser && this.phaserWet) {
      currentNode.connect(this.phaserWet.a);
      currentNode.connect(this.phaser);
      this.phaser.connect(this.phaserWet.b);
      currentNode = this.phaserWet;
      this.activeEffects.add('phaser');
    }

    if (enabledEffects.includes('tremolo') && this.tremolo && this.tremoloWet) {
      currentNode.connect(this.tremoloWet.a);
      currentNode.connect(this.tremolo);
      this.tremolo.connect(this.tremoloWet.b);
      currentNode = this.tremoloWet;
      this.activeEffects.add('tremolo');
    }

    // Connect final node to output
    currentNode.connect(this.outputNode);
  }

  private disconnectAll(): void {
    this.activeEffects.clear();

    const nodes = [
      this.inputNode,
      this.reverb,
      this.delay,
      this.panner,
      this.compressor,
      this.limiter,
      this.gate,
      this.chorus,
      this.phaser,
      this.tremolo,
      this.eq3,
      this.filter,
      this.reverbWet,
      this.delayWet,
      this.chorusWet,
      this.phaserWet,
      this.tremoloWet,
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

  // Spatial Effect Controls
  updateReverb(params: Partial<SpatialEffectParams['reverb']>): void {
    if (!this.reverb || !this.reverbWet) return;

    if (params.roomSize !== undefined) {
      this.reverb.decay = params.roomSize * 5;
    }
    if (params.wet !== undefined && this.reverbWet) {
      this.reverbWet.fade.value = params.wet;
    }
  }

  updateDelay(params: Partial<SpatialEffectParams['delay']>): void {
    if (!this.delay) return;

    if (params.delayTime !== undefined) {
      this.delay.delayTime.value = params.delayTime;
    }
    if (params.feedback !== undefined) {
      this.delay.feedback.value = params.feedback;
    }
    if (params.wet !== undefined && this.delayWet) {
      this.delayWet.fade.value = params.wet;
    }
  }

  updatePanning(pan: number): void {
    if (!this.panner) return;
    this.panner.pan.value = pan;
  }

  // Dynamics Effect Controls
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

  updateLimiter(threshold: number): void {
    if (!this.limiter) return;
    this.limiter.threshold.value = threshold;
  }

  updateGate(params: Partial<DynamicsEffectParams['gate']>): void {
    if (!this.gate) return;

    if (params.threshold !== undefined) {
      this.gate.threshold.value = params.threshold;
    }
    if (params.attack !== undefined) {
      this.gate.attack.value = params.attack;
    }
    if (params.release !== undefined) {
      this.gate.release.value = params.release;
    }
  }

  // Modulation Effect Controls
  updateChorus(params: Partial<ModulationEffectParams['chorus']>): void {
    if (!this.chorus) return;

    if (params.frequency !== undefined) {
      this.chorus.frequency.value = params.frequency;
    }
    if (params.delayTime !== undefined) {
      this.chorus.delayTime = params.delayTime;
    }
    if (params.depth !== undefined) {
      this.chorus.depth = params.depth;
    }
    if (params.wet !== undefined && this.chorusWet) {
      this.chorusWet.fade.value = params.wet;
    }
  }

  updatePhaser(params: Partial<ModulationEffectParams['phaser']>): void {
    if (!this.phaser) return;

    if (params.frequency !== undefined) {
      this.phaser.frequency.value = params.frequency;
    }
    if (params.octaves !== undefined) {
      this.phaser.octaves = params.octaves;
    }
    if (params.baseFrequency !== undefined) {
      this.phaser.baseFrequency = params.baseFrequency;
    }
    if (params.wet !== undefined && this.phaserWet) {
      this.phaserWet.fade.value = params.wet;
    }
  }

  updateTremolo(params: Partial<ModulationEffectParams['tremolo']>): void {
    if (!this.tremolo) return;

    if (params.frequency !== undefined) {
      this.tremolo.frequency.value = params.frequency;
    }
    if (params.depth !== undefined) {
      this.tremolo.depth.value = params.depth;
    }
    if (params.wet !== undefined && this.tremoloWet) {
      this.tremoloWet.fade.value = params.wet;
    }
  }

  // EQ Controls
  updateEQ(low: number, mid: number, high: number): void {
    if (!this.eq3) return;

    this.eq3.low.value = low;
    this.eq3.mid.value = mid;
    this.eq3.high.value = high;
  }

  // Filter Controls
  updateFilter(frequency: number, type: 'lowpass' | 'highpass' | 'bandpass'): void {
    if (!this.filter) return;

    this.filter.frequency.value = frequency;
    this.filter.type = type;
  }

  getActiveEffects(): string[] {
    return Array.from(this.activeEffects);
  }

  dispose(): void {
    this.disconnectAll();

    const nodes = [
      this.reverb,
      this.delay,
      this.panner,
      this.compressor,
      this.limiter,
      this.gate,
      this.chorus,
      this.phaser,
      this.tremolo,
      this.eq3,
      this.filter,
      this.reverbWet,
      this.delayWet,
      this.chorusWet,
      this.phaserWet,
      this.tremoloWet,
      this.inputNode,
      this.outputNode,
    ];

    nodes.forEach((node) => {
      if (node) {
        node.dispose();
      }
    });

    this.isInitialized = false;
    this.activeEffects.clear();
  }
}
