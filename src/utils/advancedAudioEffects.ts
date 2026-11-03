export interface VocalEffectsSettings {
  reverb: {
    enabled: boolean;
    type: 'hall' | 'room' | 'plate' | 'cathedral';
    wetDry: number;
    decay: number;
  };
  delay: {
    enabled: boolean;
    type: 'slapback' | 'pingpong' | 'tape';
    time: number;
    feedback: number;
    wetDry: number;
  };
  compression: {
    enabled: boolean;
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
  };
  eq: {
    enabled: boolean;
    lowCut: number;
    lowMid: number;
    mid: number;
    highMid: number;
    high: number;
  };
  deEsser: {
    enabled: boolean;
    frequency: number;
    threshold: number;
  };
  doubler: {
    enabled: boolean;
    delay: number;
    detune: number;
    wetDry: number;
  };
  chorus: {
    enabled: boolean;
    rate: number;
    depth: number;
    wetDry: number;
  };
}

export interface MusicEffectsSettings {
  reverb: {
    enabled: boolean;
    wetDry: number;
    size: number;
  };
  compression: {
    enabled: boolean;
    threshold: number;
    ratio: number;
  };
  eq: {
    enabled: boolean;
    low: number;
    mid: number;
    high: number;
  };
  stereoWidth: {
    enabled: boolean;
    width: number;
  };
}

export interface MasterEffectsSettings {
  limiter: {
    enabled: boolean;
    threshold: number;
    release: number;
  };
  stereoEnhancer: {
    enabled: boolean;
    width: number;
  };
  finalEQ: {
    enabled: boolean;
    low: number;
    mid: number;
    high: number;
  };
}

export class AdvancedAudioEffects {
  private audioContext: AudioContext;
  private vocalChain: AudioNode[] = [];
  private musicChain: AudioNode[] = [];
  private masterChain: AudioNode[] = [];
  private vocalInput: GainNode;
  private musicInput: GainNode;
  private masterOutput: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.vocalInput = audioContext.createGain();
    this.musicInput = audioContext.createGain();
    this.masterOutput = audioContext.createGain();
  }

  applyVocalEffects(settings: VocalEffectsSettings): void {
    this.clearVocalChain();

    let currentNode: AudioNode = this.vocalInput;

    if (settings.eq.enabled) {
      const eq = this.createVocalEQ(settings.eq);
      currentNode.connect(eq);
      currentNode = eq;
      this.vocalChain.push(eq);
    }

    if (settings.compression.enabled) {
      const compressor = this.createCompressor(settings.compression);
      currentNode.connect(compressor);
      currentNode = compressor;
      this.vocalChain.push(compressor);
    }

    if (settings.deEsser.enabled) {
      const deEsser = this.createDeEsser(settings.deEsser);
      currentNode.connect(deEsser);
      currentNode = deEsser;
      this.vocalChain.push(deEsser);
    }

    if (settings.doubler.enabled) {
      const doubler = this.createDoubler(settings.doubler);
      currentNode.connect(doubler);
      currentNode = doubler;
      this.vocalChain.push(doubler);
    }

    if (settings.chorus.enabled) {
      const chorus = this.createChorus(settings.chorus);
      currentNode.connect(chorus);
      currentNode = chorus;
      this.vocalChain.push(chorus);
    }

    if (settings.delay.enabled) {
      const delay = this.createDelay(settings.delay);
      currentNode.connect(delay);
      currentNode = delay;
      this.vocalChain.push(delay);
    }

    if (settings.reverb.enabled) {
      const reverb = this.createReverb(settings.reverb);
      currentNode.connect(reverb);
      currentNode = reverb;
      this.vocalChain.push(reverb);
    }

    currentNode.connect(this.masterOutput);
  }

  private createVocalEQ(settings: VocalEffectsSettings['eq']): BiquadFilterNode {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = 3000;
    filter.Q.value = 1;
    filter.gain.value = settings.mid;
    return filter;
  }

  private createCompressor(settings: VocalEffectsSettings['compression']): DynamicsCompressorNode {
    const compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.value = settings.threshold;
    compressor.ratio.value = settings.ratio;
    compressor.attack.value = settings.attack / 1000;
    compressor.release.value = settings.release / 1000;
    return compressor;
  }

  private createDeEsser(settings: VocalEffectsSettings['deEsser']): BiquadFilterNode {
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = settings.frequency;
    filter.Q.value = 2;
    filter.gain.value = -6;
    return filter;
  }

  private createDoubler(settings: VocalEffectsSettings['doubler']): GainNode {
    const wet = this.audioContext.createGain();
    const dry = this.audioContext.createGain();
    const delay = this.audioContext.createDelay();
    const output = this.audioContext.createGain();

    delay.delayTime.value = settings.delay / 1000;
    wet.gain.value = settings.wetDry / 100;
    dry.gain.value = 1 - (settings.wetDry / 100);

    this.vocalInput.connect(dry);
    this.vocalInput.connect(delay);
    delay.connect(wet);
    dry.connect(output);
    wet.connect(output);

    return output;
  }

  private createChorus(settings: VocalEffectsSettings['chorus']): GainNode {
    const wet = this.audioContext.createGain();
    const dry = this.audioContext.createGain();
    const delay = this.audioContext.createDelay(0.1);
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    const output = this.audioContext.createGain();

    lfo.frequency.value = settings.rate;
    lfoGain.gain.value = settings.depth / 1000;
    wet.gain.value = settings.wetDry / 100;
    dry.gain.value = 1 - (settings.wetDry / 100);

    lfo.connect(lfoGain);
    lfoGain.connect(delay.delayTime);

    this.vocalInput.connect(dry);
    this.vocalInput.connect(delay);
    delay.connect(wet);
    dry.connect(output);
    wet.connect(output);

    lfo.start();

    return output;
  }

  private createDelay(settings: VocalEffectsSettings['delay']): GainNode {
    const wet = this.audioContext.createGain();
    const dry = this.audioContext.createGain();
    const delay = this.audioContext.createDelay(2);
    const feedback = this.audioContext.createGain();
    const output = this.audioContext.createGain();

    delay.delayTime.value = settings.time / 1000;
    feedback.gain.value = settings.feedback / 100;
    wet.gain.value = settings.wetDry / 100;
    dry.gain.value = 1 - (settings.wetDry / 100);

    this.vocalInput.connect(dry);
    this.vocalInput.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    dry.connect(output);
    wet.connect(output);

    return output;
  }

  private createReverb(settings: VocalEffectsSettings['reverb']): ConvolverNode {
    const convolver = this.audioContext.createConvolver();
    const impulse = this.createImpulseResponse(settings.type, settings.decay);
    convolver.buffer = impulse;
    return convolver;
  }

  private createImpulseResponse(type: string, decay: number): AudioBuffer {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * decay;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }

    return impulse;
  }

  private clearVocalChain(): void {
    this.vocalChain.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {
        // Node already disconnected
      }
    });
    this.vocalChain = [];
  }

  getVocalInput(): GainNode {
    return this.vocalInput;
  }

  getMusicInput(): GainNode {
    return this.musicInput;
  }

  getMasterOutput(): GainNode {
    return this.masterOutput;
  }

  dispose(): void {
    this.clearVocalChain();
    this.vocalInput.disconnect();
    this.musicInput.disconnect();
    this.masterOutput.disconnect();
  }
}

export const DEFAULT_VOCAL_EFFECTS: VocalEffectsSettings = {
  reverb: {
    enabled: false,
    type: 'room',
    wetDry: 30,
    decay: 1.5
  },
  delay: {
    enabled: false,
    type: 'slapback',
    time: 150,
    feedback: 30,
    wetDry: 25
  },
  compression: {
    enabled: true,
    threshold: -24,
    ratio: 4,
    attack: 5,
    release: 50
  },
  eq: {
    enabled: true,
    lowCut: 80,
    lowMid: 0,
    mid: 2,
    highMid: 3,
    high: 1
  },
  deEsser: {
    enabled: false,
    frequency: 7000,
    threshold: -20
  },
  doubler: {
    enabled: false,
    delay: 30,
    detune: 10,
    wetDry: 40
  },
  chorus: {
    enabled: false,
    rate: 0.5,
    depth: 5,
    wetDry: 30
  }
};

export const DEFAULT_MUSIC_EFFECTS: MusicEffectsSettings = {
  reverb: {
    enabled: false,
    wetDry: 20,
    size: 0.7
  },
  compression: {
    enabled: true,
    threshold: -18,
    ratio: 3
  },
  eq: {
    enabled: true,
    low: 0,
    mid: 0,
    high: 0
  },
  stereoWidth: {
    enabled: false,
    width: 1.2
  }
};

export const DEFAULT_MASTER_EFFECTS: MasterEffectsSettings = {
  limiter: {
    enabled: true,
    threshold: -1,
    release: 100
  },
  stereoEnhancer: {
    enabled: false,
    width: 1.0
  },
  finalEQ: {
    enabled: false,
    low: 0,
    mid: 0,
    high: 0
  }
};
