export interface EffectPreset {
  id?: string;
  user_id?: string;
  name: string;
  effect_type: 'spatial' | 'dynamics' | 'modulation' | 'eq' | 'filter';
  parameters: Record<string, any>;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EffectChain {
  id?: string;
  user_id?: string;
  name: string;
  effects_order: Array<{
    effect: string;
    enabled: boolean;
    parameters: Record<string, any>;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface UserAudioSettings {
  id?: string;
  user_id?: string;
  default_reverb: {
    roomSize: number;
    dampening: number;
    wet: number;
    dry: number;
  };
  default_delay: {
    delayTime: number;
    feedback: number;
    wet: number;
    dry: number;
  };
  default_compressor: {
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
    knee: number;
  };
  default_eq: {
    low: number;
    mid: number;
    high: number;
    lowFreq: number;
    midFreq: number;
    highFreq: number;
  };
  default_modulation: {
    rate: number;
    depth: number;
    wet: number;
    dry: number;
  };
  updated_at?: string;
}

export interface EffectModule {
  id: string;
  name: string;
  type: 'spatial' | 'dynamics' | 'modulation';
  enabled: boolean;
  bypassed: boolean;
  parameters: Record<string, EffectParameter>;
}

export interface EffectParameter {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  label: string;
  description?: string;
}

export type EffectCategory = 'spatial' | 'dynamics' | 'modulation';

export interface EffectState {
  spatial: {
    reverb: {
      enabled: boolean;
      roomSize: number;
      dampening: number;
      wet: number;
      dry: number;
    };
    delay: {
      enabled: boolean;
      delayTime: number;
      feedback: number;
      wet: number;
      dry: number;
    };
    panning: {
      enabled: boolean;
      pan: number;
    };
  };
  dynamics: {
    compressor: {
      enabled: boolean;
      threshold: number;
      ratio: number;
      attack: number;
      release: number;
      knee: number;
    };
    limiter: {
      enabled: boolean;
      threshold: number;
    };
    gate: {
      enabled: boolean;
      threshold: number;
      attack: number;
      release: number;
    };
  };
  modulation: {
    chorus: {
      enabled: boolean;
      frequency: number;
      delayTime: number;
      depth: number;
      wet: number;
    };
    phaser: {
      enabled: boolean;
      frequency: number;
      octaves: number;
      baseFrequency: number;
      wet: number;
    };
    tremolo: {
      enabled: boolean;
      frequency: number;
      depth: number;
      wet: number;
    };
  };
}
