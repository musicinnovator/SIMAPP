/**
 * Real-Time Parameter Change System Types
 *
 * Defines types for the queue-based parameter change system that allows
 * parameters to be changed during playback and applied at specific times.
 */

export type ChangeTimingMode = 'immediately' | 'next-chord' | 'next-loop' | 'manual';

export type ParameterType =
  // HIGH PRIORITY
  | 'voicing-technique'
  | 'voicing-pattern'
  | 'tempo'
  | 'volume'
  | 'audio-effects'
  // MEDIUM PRIORITY
  | 'octave-range'
  | 'voicing-style'
  | 'dynamics'
  | 'instrument';

export interface QueuedParameter {
  id: string;
  type: ParameterType;
  value: any;
  previousValue: any;
  queuedAt: number;
  applyAt: ChangeTimingMode;
  displayName: string;
  priority: 'high' | 'medium';
}

export interface RealtimeChangeSettings {
  enabled: boolean;
  defaultTiming: ChangeTimingMode;
  showNotifications: boolean;
  notificationDuration: number; // milliseconds
}

export const DEFAULT_REALTIME_SETTINGS: RealtimeChangeSettings = {
  enabled: true,
  defaultTiming: 'next-loop',
  showNotifications: true,
  notificationDuration: 3000
};

export interface ParameterChangeEvent {
  type: ParameterType;
  oldValue: any;
  newValue: any;
  appliedAt: 'immediately' | 'next-chord' | 'next-loop';
  timestamp: number;
}
