import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioEffectsEngineWebAudio } from '../utils/audioEffectsEngineWebAudio';
import { supabase } from '../lib/supabase';
import type { EffectPreset, EffectChain, UserAudioSettings, EffectState } from '../types/audioEffects';

export function useAudioEffects(audioContext?: AudioContext) {
  const [engine] = useState(() => new AudioEffectsEngineWebAudio());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [effectState, setEffectState] = useState<EffectState>({
    spatial: {
      reverb: {
        enabled: false,
        roomSize: 0.7,
        dampening: 3000,
        wet: 0.3,
        dry: 0.7,
      },
      delay: {
        enabled: false,
        delayTime: 0.25,
        feedback: 0.3,
        wet: 0.2,
        dry: 0.8,
      },
      panning: {
        enabled: false,
        pan: 0,
      },
    },
    dynamics: {
      compressor: {
        enabled: false,
        threshold: -24,
        ratio: 4,
        attack: 0.003,
        release: 0.25,
        knee: 30,
      },
      limiter: {
        enabled: false,
        threshold: -3,
      },
      gate: {
        enabled: false,
        threshold: -50,
        attack: 0.001,
        release: 0.1,
      },
    },
    modulation: {
      chorus: {
        enabled: false,
        frequency: 4,
        delayTime: 2.5,
        depth: 0.7,
        wet: 0.3,
      },
      phaser: {
        enabled: false,
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 350,
        wet: 0.3,
      },
      tremolo: {
        enabled: false,
        frequency: 5,
        depth: 0.5,
        wet: 0.3,
      },
    },
  });

  const [presets, setPresets] = useState<EffectPreset[]>([]);
  const [chains, setChains] = useState<EffectChain[]>([]);
  const [userSettings, setUserSettings] = useState<UserAudioSettings | null>(null);

  // Initialize the effects engine
  const initializeEngine = useCallback(async () => {
    if (isInitialized) return;

    setIsLoading(true);
    setError(null);

    try {
      // Use provided audioContext or create a new one
      const context = audioContext || new AudioContext();
      await engine.initialize(context);
      setIsInitialized(true);
    } catch (err) {
      setError('Failed to initialize audio effects engine');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [engine, isInitialized, audioContext]);

  // Load user settings from database
  const loadUserSettings = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_audio_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUserSettings(data);
        // Apply user defaults to state
        setEffectState(prev => ({
          ...prev,
          spatial: {
            ...prev.spatial,
            reverb: { ...prev.spatial.reverb, ...data.default_reverb },
            delay: { ...prev.spatial.delay, ...data.default_delay },
          },
          dynamics: {
            ...prev.dynamics,
            compressor: { ...prev.dynamics.compressor, ...data.default_compressor },
          },
        }));
      }
    } catch (err) {
      console.error('Error loading user settings:', err);
    }
  }, []);

  // Load presets
  const loadPresets = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('audio_effect_presets')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPresets(data || []);
    } catch (err) {
      console.error('Error loading presets:', err);
    }
  }, []);

  // Load chains
  const loadChains = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('audio_effect_chains')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChains(data || []);
    } catch (err) {
      console.error('Error loading chains:', err);
    }
  }, []);

  // Update effect parameters
  const updateEffect = useCallback((
    category: 'spatial' | 'dynamics' | 'modulation',
    effectName: string,
    params: Record<string, any>
  ) => {
    setEffectState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [effectName]: {
          ...prev[category][effectName as keyof typeof prev[typeof category]],
          ...params,
        },
      },
    }));

    // Apply to engine
    if (!isInitialized) return;

    if (category === 'spatial') {
      if (effectName === 'reverb') {
        engine.updateReverb(params);
      } else if (effectName === 'delay') {
        engine.updateDelay(params);
      } else if (effectName === 'panning') {
        engine.updatePanning(params.pan);
      }
    } else if (category === 'dynamics') {
      if (effectName === 'compressor') {
        engine.updateCompressor(params);
      } else if (effectName === 'limiter') {
        engine.updateLimiter(params.threshold);
      } else if (effectName === 'gate') {
        engine.updateGate(params);
      }
    } else if (category === 'modulation') {
      if (effectName === 'chorus') {
        engine.updateChorus(params);
      } else if (effectName === 'phaser') {
        engine.updatePhaser(params);
      } else if (effectName === 'tremolo') {
        engine.updateTremolo(params);
      }
    }
  }, [engine, isInitialized]);

  // Toggle effect on/off
  const toggleEffect = useCallback((
    category: 'spatial' | 'dynamics' | 'modulation',
    effectName: string
  ) => {
    setEffectState(prev => {
      const currentEnabled = prev[category][effectName as keyof typeof prev[typeof category]].enabled;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [effectName]: {
            ...prev[category][effectName as keyof typeof prev[typeof category]],
            enabled: !currentEnabled,
          },
        },
      };
    });

    // Rebuild effect chain
    if (isInitialized) {
      const enabledEffects = getEnabledEffects();
      const effectKey = effectName === 'panning' ? 'panning' : effectName;
      const newEnabled = !effectState[category][effectName as keyof typeof effectState[typeof category]].enabled;

      if (newEnabled) {
        enabledEffects.push(effectKey);
      } else {
        const index = enabledEffects.indexOf(effectKey);
        if (index > -1) enabledEffects.splice(index, 1);
      }

      engine.buildEffectChain(enabledEffects);
    }
  }, [engine, isInitialized, effectState]);

  // Get currently enabled effects
  const getEnabledEffects = useCallback(() => {
    const enabled: string[] = [];

    Object.entries(effectState.spatial).forEach(([key, value]) => {
      if (value.enabled) enabled.push(key);
    });

    Object.entries(effectState.dynamics).forEach(([key, value]) => {
      if (value.enabled) enabled.push(key);
    });

    Object.entries(effectState.modulation).forEach(([key, value]) => {
      if (value.enabled) enabled.push(key);
    });

    return enabled;
  }, [effectState]);

  // Save preset
  const savePreset = useCallback(async (
    name: string,
    effectType: 'spatial' | 'dynamics' | 'modulation' | 'eq' | 'filter',
    parameters: Record<string, any>,
    isPublic: boolean = false
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('audio_effect_presets').insert({
        user_id: user.id,
        name,
        effect_type: effectType,
        parameters,
        is_public: isPublic,
      });

      if (error) throw error;
      await loadPresets();
      return true;
    } catch (err) {
      console.error('Error saving preset:', err);
      return false;
    }
  }, [loadPresets]);

  // Save chain
  const saveChain = useCallback(async (name: string, effectsOrder: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('audio_effect_chains').insert({
        user_id: user.id,
        name,
        effects_order: effectsOrder,
      });

      if (error) throw error;
      await loadChains();
      return true;
    } catch (err) {
      console.error('Error saving chain:', err);
      return false;
    }
  }, [loadChains]);

  // Apply preset
  const applyPreset = useCallback((preset: EffectPreset) => {
    const category = preset.effect_type === 'spatial' ? 'spatial' :
                     preset.effect_type === 'dynamics' ? 'dynamics' : 'modulation';

    Object.entries(preset.parameters).forEach(([effectName, params]) => {
      updateEffect(category, effectName, params);
    });
  }, [updateEffect]);

  // Cleanup
  useEffect(() => {
    return () => {
      engine.dispose();
    };
  }, [engine]);

  // Load data on mount
  useEffect(() => {
    loadUserSettings();
    loadPresets();
    loadChains();
  }, [loadUserSettings, loadPresets, loadChains]);

  return {
    engine,
    isInitialized,
    isLoading,
    error,
    effectState,
    presets,
    chains,
    userSettings,
    initializeEngine,
    updateEffect,
    toggleEffect,
    savePreset,
    saveChain,
    applyPreset,
    loadPresets,
    loadChains,
    getEnabledEffects,
  };
}
