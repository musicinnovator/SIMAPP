import React from 'react';
import { Settings, Clock, Zap, SkipForward, Square } from 'lucide-react';
import { RealtimeChangeSettings as SettingsType, ChangeTimingMode } from '../types/realtimeChanges';

interface RealtimeChangeSettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  isPlaying?: boolean;
}

/**
 * OPTION C: User preference toggle for when parameter changes should be applied.
 *
 * This component allows users to control when parameter changes take effect:
 * - Immediately: Changes apply instantly (may cause audio discontinuity)
 * - Next Chord: Changes apply at the next chord change (smooth transition)
 * - Next Loop: Changes apply when the progression loops (most predictable)
 * - Manual: Changes only apply when stopping and restarting playback
 *
 * ADDITIVE-ONLY: This component does not modify existing functionality.
 * It only controls the behavior of the new queue system.
 */
export function RealtimeChangeSettings({
  settings,
  onSettingsChange,
  isPlaying = false
}: RealtimeChangeSettingsProps) {
  const timingModes: {
    value: ChangeTimingMode;
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
  }[] = [
    {
      value: 'immediately',
      label: 'Immediately',
      icon: <Zap className="w-4 h-4" />,
      description: 'Apply changes instantly (may cause audio discontinuity)',
      color: 'bg-yellow-500'
    },
    {
      value: 'next-chord',
      label: 'Next Chord',
      icon: <SkipForward className="w-4 h-4" />,
      description: 'Apply changes at the next chord (smooth transition)',
      color: 'bg-green-500'
    },
    {
      value: 'next-loop',
      label: 'Next Loop',
      icon: <Clock className="w-4 h-4" />,
      description: 'Apply changes when progression loops (most predictable)',
      color: 'bg-blue-500'
    },
    {
      value: 'manual',
      label: 'Manual',
      icon: <Square className="w-4 h-4" />,
      description: 'Only apply changes when stopping and restarting',
      color: 'bg-purple-500'
    }
  ];

  const handleTimingChange = (timing: ChangeTimingMode) => {
    onSettingsChange({
      ...settings,
      defaultTiming: timing
    });
  };

  const handleToggleEnabled = () => {
    onSettingsChange({
      ...settings,
      enabled: !settings.enabled
    });
  };

  const handleToggleNotifications = () => {
    onSettingsChange({
      ...settings,
      showNotifications: !settings.showNotifications
    });
  };

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-bold">Real-Time Parameter Changes</h4>
        </div>
        <button
          onClick={handleToggleEnabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            settings.enabled
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white/20 text-blue-200'
          }`}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {settings.enabled && (
        <>
          <div className="pt-4 border-t border-white/10">
            <label className="text-white text-sm font-medium block mb-3">
              When should changes be applied?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timingModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleTimingChange(mode.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    settings.defaultTiming === mode.value
                      ? `${mode.color} border-white/50 text-white shadow-lg`
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}
                  title={mode.description}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {mode.icon}
                    <span className="font-medium text-sm">{mode.label}</span>
                  </div>
                  <p className="text-xs opacity-80 leading-tight">
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {isPlaying && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-white text-xs">
                <strong>Playing:</strong> Changes will be applied{' '}
                {settings.defaultTiming === 'immediately' && 'immediately'}
                {settings.defaultTiming === 'next-chord' && 'at the next chord change'}
                {settings.defaultTiming === 'next-loop' && 'when the progression loops'}
                {settings.defaultTiming === 'manual' && 'when you stop and restart playback'}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <label className="text-white font-medium block">Show Change Notifications</label>
              <p className="text-white text-xs mt-1">
                Display visual feedback when queued changes are applied
              </p>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                settings.showNotifications
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/20 text-white'
              }`}
            >
              {settings.showNotifications ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-white text-xs">
              <strong>💡 Tip:</strong> Use "Next Loop" for the smoothest experience. Changes will be queued and applied seamlessly when the chord progression repeats.
            </p>
          </div>
        </>
      )}

      {!settings.enabled && (
        <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3">
          <p className="text-white text-xs">
            Real-time parameter changes are disabled. All changes will require stopping and restarting playback.
          </p>
        </div>
      )}
    </div>
  );
}
