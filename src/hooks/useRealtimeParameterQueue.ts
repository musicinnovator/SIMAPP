import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  QueuedParameter,
  RealtimeChangeSettings,
  DEFAULT_REALTIME_SETTINGS,
  ParameterType,
  ChangeTimingMode,
  ParameterChangeEvent
} from '../types/realtimeChanges';

/**
 * Hook for managing real-time parameter changes during playback.
 *
 * This hook provides a queue system that allows parameters to be changed
 * during playback and applied at specific times (immediately, next chord,
 * next loop, or manual stop/play).
 *
 * ADDITIVE-ONLY: This hook does NOT modify existing playback logic.
 * It wraps parameter changes and queues them for application at the
 * appropriate time.
 */
export function useRealtimeParameterQueue() {
  const [settings, setSettings] = useState<RealtimeChangeSettings>(DEFAULT_REALTIME_SETTINGS);
  const [queue, setQueue] = useState<QueuedParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ParameterChangeEvent[]>([]);

  const queueIdCounter = useRef(0);
  const loopListeners = useRef<((params: QueuedParameter[]) => void)[]>([]);
  const chordListeners = useRef<((params: QueuedParameter[]) => void)[]>([]);

  // Load settings from database or localStorage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Load from localStorage for non-authenticated users
        const stored = localStorage.getItem('realtimeChangeSettings');
        if (stored) {
          setSettings(JSON.parse(stored));
        }
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('realtime_change_settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.realtime_change_settings) {
        setSettings(data.realtime_change_settings);
      }
    } catch (err) {
      console.error('[RealtimeQueue] Error loading settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: RealtimeChangeSettings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Save to localStorage for non-authenticated users
        localStorage.setItem('realtimeChangeSettings', JSON.stringify(newSettings));
        setSettings(newSettings);
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          realtime_change_settings: newSettings
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setSettings(newSettings);
      console.log('[RealtimeQueue] Settings saved:', newSettings);
    } catch (err) {
      console.error('[RealtimeQueue] Error saving settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  /**
   * Queue a parameter change to be applied at the specified timing.
   *
   * @param type - The type of parameter being changed
   * @param value - The new value
   * @param previousValue - The previous value (for undo)
   * @param displayName - Human-readable name for notifications
   * @param priority - Priority level (high/medium)
   * @param customTiming - Optional custom timing (overrides default)
   */
  const queueChange = useCallback((
    type: ParameterType,
    value: any,
    previousValue: any,
    displayName: string,
    priority: 'high' | 'medium' = 'high',
    customTiming?: ChangeTimingMode
  ) => {
    if (!settings.enabled) {
      // If real-time changes are disabled, return false to indicate
      // the change should be applied immediately using existing logic
      return false;
    }

    const timing = customTiming || settings.defaultTiming;

    // If timing is 'immediately' or 'manual', return false to use existing logic
    if (timing === 'immediately' || timing === 'manual') {
      return false;
    }

    const queuedParam: QueuedParameter = {
      id: `param-${++queueIdCounter.current}`,
      type,
      value,
      previousValue,
      queuedAt: Date.now(),
      applyAt: timing,
      displayName,
      priority
    };

    setQueue(prev => {
      // Remove any existing queued changes for this parameter type
      const filtered = prev.filter(p => p.type !== type);
      return [...filtered, queuedParam];
    });

    console.log('[RealtimeQueue] Queued:', queuedParam);
    return true; // Indicates the change was queued
  }, [settings]);

  /**
   * Apply all queued parameters immediately (called on next chord or next loop)
   */
  const applyQueue = useCallback((applyTiming: 'next-chord' | 'next-loop') => {
    setQueue(prev => {
      const toApply = prev.filter(p => p.applyAt === applyTiming);
      const remaining = prev.filter(p => p.applyAt !== applyTiming);

      if (toApply.length > 0) {
        console.log(`[RealtimeQueue] Applying ${toApply.length} parameters at ${applyTiming}:`, toApply);

        // Record in history
        const events: ParameterChangeEvent[] = toApply.map(p => ({
          type: p.type,
          oldValue: p.previousValue,
          newValue: p.value,
          appliedAt: applyTiming,
          timestamp: Date.now()
        }));
        setHistory(prev => [...prev, ...events].slice(-50)); // Keep last 50 events

        // Notify listeners
        if (applyTiming === 'next-loop') {
          loopListeners.current.forEach(listener => listener(toApply));
        } else if (applyTiming === 'next-chord') {
          chordListeners.current.forEach(listener => listener(toApply));
        }
      }

      return remaining;
    });
  }, []);

  /**
   * Register a listener for loop boundary (called when loop restarts)
   */
  const onNextLoop = useCallback((callback: (params: QueuedParameter[]) => void) => {
    loopListeners.current.push(callback);
    return () => {
      loopListeners.current = loopListeners.current.filter(cb => cb !== callback);
    };
  }, []);

  /**
   * Register a listener for chord change
   */
  const onNextChord = useCallback((callback: (params: QueuedParameter[]) => void) => {
    chordListeners.current.push(callback);
    return () => {
      chordListeners.current = chordListeners.current.filter(cb => cb !== callback);
    };
  }, []);

  /**
   * Clear a specific queued parameter
   */
  const clearQueuedParameter = useCallback((id: string) => {
    setQueue(prev => prev.filter(p => p.id !== id));
    console.log('[RealtimeQueue] Cleared parameter:', id);
  }, []);

  /**
   * Clear all queued parameters
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
    console.log('[RealtimeQueue] Queue cleared');
  }, []);

  /**
   * Get queued parameters by type
   */
  const getQueuedByType = useCallback((type: ParameterType) => {
    return queue.filter(p => p.type === type);
  }, [queue]);

  /**
   * Get queued parameters by timing
   */
  const getQueuedByTiming = useCallback((timing: ChangeTimingMode) => {
    return queue.filter(p => p.applyAt === timing);
  }, [queue]);

  /**
   * Check if a parameter type is currently queued
   */
  const isQueued = useCallback((type: ParameterType) => {
    return queue.some(p => p.type === type);
  }, [queue]);

  return {
    // Settings
    settings,
    saveSettings,

    // Queue management
    queue,
    queueChange,
    applyQueue,
    clearQueuedParameter,
    clearQueue,

    // Query functions
    getQueuedByType,
    getQueuedByTiming,
    isQueued,

    // Event listeners
    onNextLoop,
    onNextChord,

    // History
    history,

    // State
    loading,
    error
  };
}
