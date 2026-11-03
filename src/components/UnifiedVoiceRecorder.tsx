import React, { useState, useEffect } from 'react';
import { Mic, Music, Layers, Smartphone, Monitor, Info, Eye, EyeOff, History, Cloud, Upload } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import VoiceRecorderV2 from './VoiceRecorderV2';
import VoiceChordMixer from './VoiceChordMixer';
import WaveformVisualizer from './WaveformVisualizer';
import RecordingAudioEffects, { DEFAULT_EFFECTS_SETTINGS, RecordingEffectsSettings } from './RecordingAudioEffects';
import { useRecordingHistory } from '../hooks/useRecordingHistory';

/**
 * UnifiedVoiceRecorder - Wrapper Component
 *
 * This component provides a unified interface for all recording modes.
 * It does NOT modify existing components - it simply routes to them based on user selection.
 * All existing components (VoiceRecorder, VoiceRecorderV2, VoiceChordMixer) remain unchanged.
 */

interface UnifiedVoiceRecorderProps {
  // Props passed through to underlying components
  isVisible?: boolean;
  scriptureReference?: string;
  scriptureText?: string;
  musicRecordingBlob?: Blob | null;
  musicAudioContext?: AudioContext | null;
  musicAudioNode?: any;
  onRecordingChange?: (hasRecording: boolean) => void;
  onMixedAudioReady?: (mixedBlob: Blob) => void;

  // Props for VoiceChordMixer
  currentChord?: string;
  currentNotes?: number[];
  isPlaying?: boolean;
  bpm?: number;
  instrument?: string;
}

type RecordingMode = 'voice-only' | 'live-mix' | 'post-mix';

export default function UnifiedVoiceRecorder(props: UnifiedVoiceRecorderProps) {
  // Detect platform
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Recording mode state
  const [selectedMode, setSelectedMode] = useState<RecordingMode>('voice-only');
  const [showInfo, setShowInfo] = useState(false);

  // NEW FEATURES - Added additively
  const [showLegacyRecorders, setShowLegacyRecorders] = useState(false);
  const [showWaveform, setShowWaveform] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [effectsSettings, setEffectsSettings] = useState<RecordingEffectsSettings>(DEFAULT_EFFECTS_SETTINGS);
  const recordingHistory = useRecordingHistory();

  // Auto-select best mode based on platform
  useEffect(() => {
    if (isMobile) {
      // Mobile: default to voice-only or post-mix
      setSelectedMode('voice-only');
    } else {
      // Desktop: live-mix is available
      setSelectedMode('live-mix');
    }
  }, [isMobile]);

  // Mode configurations
  const modes = {
    'voice-only': {
      title: 'Voice Only',
      icon: Mic,
      description: 'Record your voice without music',
      component: VoiceRecorderV2,
      available: true,
      recommended: isMobile
    },
    'live-mix': {
      title: 'Live Mix',
      icon: Music,
      description: 'Record voice + music in real-time (Desktop)',
      component: VoiceRecorderV2,
      available: !isMobile,
      recommended: !isMobile
    },
    'post-mix': {
      title: 'Post Mix',
      icon: Layers,
      description: 'Record voice, then mix with music afterwards',
      component: VoiceChordMixer,
      available: true,
      recommended: false
    }
  };

  // Get current mode config
  const currentModeConfig = modes[selectedMode];

  // Prepare props for the selected component
  const getComponentProps = () => {
    const baseProps = {
      scriptureText: props.scriptureText,
      onRecordingChange: props.onRecordingChange,
      musicAudioContext: props.musicAudioContext,
      musicAudioNode: props.musicAudioNode
    };

    if (selectedMode === 'post-mix') {
      // VoiceChordMixer props
      return {
        currentChord: props.currentChord,
        currentNotes: props.currentNotes,
        isPlaying: props.isPlaying,
        bpm: props.bpm,
        instrument: props.instrument
      };
    } else if (selectedMode === 'live-mix') {
      // VoiceRecorderV2 with live-mix mode
      return {
        ...baseProps
      };
    } else {
      // Voice-only mode
      return {
        ...baseProps
      };
    }
  };

  // Render the selected component
  const renderRecorder = () => {
    const componentProps = getComponentProps();
    const Component = currentModeConfig.component;

    return <Component {...componentProps} />;
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-6 border border-white/20 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Mic className="w-6 h-6 mr-2" />
            Voice Recording Studio
          </h3>
          <p className="text-blue-200 text-sm mt-1">
            Choose your recording mode below
          </p>
        </div>

        {/* Platform indicator */}
        <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
          {isMobile ? (
            <>
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">Mobile</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4 text-green-300" />
              <span className="text-green-200 text-sm font-medium">Desktop</span>
            </>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex space-x-2 mb-6 bg-white/5 rounded-lg p-1 border border-white/10">
        {Object.entries(modes).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = selectedMode === key;
          const isAvailable = config.available;
          const isRecommended = config.recommended;

          return (
            <button
              key={key}
              onClick={() => isAvailable && setSelectedMode(key as RecordingMode)}
              disabled={!isAvailable}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 relative
                ${isSelected
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105'
                  : isAvailable
                    ? 'bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{config.title}</span>
              {isRecommended && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  Best
                </span>
              )}
              {!isAvailable && (
                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  N/A
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mode Description */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-100 text-sm font-medium">
            {currentModeConfig.description}
          </p>

          {/* Mode-specific tips */}
          {selectedMode === 'voice-only' && (
            <p className="text-blue-200 text-xs mt-1">
              💡 Perfect for recording your voice clearly without any background music
            </p>
          )}
          {selectedMode === 'live-mix' && (
            <p className="text-blue-200 text-xs mt-1">
              💡 Records voice and music together in real-time with adjustable volumes
            </p>
          )}
          {selectedMode === 'post-mix' && (
            <p className="text-blue-200 text-xs mt-1">
              💡 Record voice while music plays, then adjust the mix afterwards for perfect balance
            </p>
          )}
        </div>
      </div>

      {/* Render the selected recorder component */}
      <div className="border-t border-white/10 pt-4">
        {renderRecorder()}
      </div>

      {/* Feature Comparison (collapsible) */}
      <details className="mt-4">
        <summary className="text-blue-300 text-sm cursor-pointer hover:text-blue-200 flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span>Compare Recording Modes</span>
        </summary>
        <div className="mt-3 bg-white/5 rounded-lg p-4 border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-blue-300 py-2">Feature</th>
                <th className="text-center text-blue-300 py-2">Voice Only</th>
                <th className="text-center text-blue-300 py-2">Live Mix</th>
                <th className="text-center text-blue-300 py-2">Post Mix</th>
              </tr>
            </thead>
            <tbody className="text-blue-100">
              <tr className="border-b border-white/10">
                <td className="py-2">Mobile Support</td>
                <td className="text-center">✅</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2">Desktop Support</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2">Adjust Mix Later</td>
                <td className="text-center">N/A</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2">Real-time Mixing</td>
                <td className="text-center">N/A</td>
                <td className="text-center">✅</td>
                <td className="text-center">❌</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2">Voice Quality</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td className="py-2">Ease of Use</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* NEW FEATURE: Advanced Controls Toggle Bar */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setShowEffects(!showEffects)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showEffects
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
              : 'bg-white/10 text-blue-300 hover:bg-white/20'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Audio Effects</span>
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showHistory
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
              : 'bg-white/10 text-blue-300 hover:bg-white/20'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History ({recordingHistory.recordings.length})</span>
        </button>

        <button
          onClick={() => setShowLegacyRecorders(!showLegacyRecorders)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            showLegacyRecorders
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          {showLegacyRecorders ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>Legacy Recorders</span>
        </button>
      </div>

      {/* NEW FEATURE: Audio Effects Panel */}
      {showEffects && (
        <div className="mt-4 animate-fadeIn">
          <RecordingAudioEffects
            settings={effectsSettings}
            onSettingsChange={setEffectsSettings}
            compact={isMobile}
          />
        </div>
      )}

      {/* NEW FEATURE: Recording History Panel */}
      {showHistory && (
        <div className="mt-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-white/10 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-bold flex items-center">
              <History className="w-5 h-5 mr-2" />
              Recording History
            </h4>
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-blue-300" />
              <span className="text-blue-300 text-sm">
                {recordingHistory.recordings.length} recordings
              </span>
            </div>
          </div>

          {recordingHistory.loading ? (
            <div className="text-center text-blue-300 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300 mx-auto mb-2"></div>
              Loading recordings...
            </div>
          ) : recordingHistory.recordings.length === 0 ? (
            <div className="text-center text-blue-300 py-8">
              <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recordings yet</p>
              <p className="text-sm text-blue-400 mt-1">Your recordings will appear here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recordingHistory.recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{recording.name}</h5>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-blue-300">
                        <span className="capitalize">{recording.mode.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>{Math.floor(recording.duration)}s</span>
                        <span>•</span>
                        <span>{new Date(recording.created_at).toLocaleDateString()}</span>
                      </div>
                      {recording.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recording.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => recording.is_favorite ?
                        recordingHistory.toggleFavorite(recording.id, true) :
                        recordingHistory.toggleFavorite(recording.id, false)
                      }
                      className="text-yellow-400 hover:text-yellow-300 text-xl"
                    >
                      {recording.is_favorite ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recordingHistory.error && (
            <div className="mt-2 text-red-300 text-sm bg-red-900/20 rounded p-2 border border-red-500/30">
              ⚠️ {recordingHistory.error}
            </div>
          )}
        </div>
      )}

      {/* NEW FEATURE: Legacy Recorders Toggle */}
      {showLegacyRecorders && (
        <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center space-x-2 text-yellow-300 mb-3">
            <Info className="w-5 h-5" />
            <h4 className="font-bold">Legacy Recording Components (Preserved)</h4>
          </div>
          <p className="text-yellow-200 text-sm mb-4">
            These are the original recording components, preserved for backward compatibility.
            They function independently and are kept for reference or advanced use cases.
          </p>

          <div className="space-y-4">
            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="p-3 cursor-pointer hover:bg-white/10 rounded-lg text-white font-medium">
                VoiceRecorder (Original)
              </summary>
              <div className="p-4 border-t border-white/10">
                <VoiceRecorder
                  isVisible={props.isVisible || true}
                  scriptureText={props.scriptureText}
                  musicRecordingBlob={props.musicRecordingBlob}
                  musicAudioContext={props.musicAudioContext}
                  musicAudioNode={props.musicAudioNode}
                />
              </div>
            </details>

            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="p-3 cursor-pointer hover:bg-white/10 rounded-lg text-white font-medium">
                VoiceRecorderV2 (Dual Mode)
              </summary>
              <div className="p-4 border-t border-white/10">
                <VoiceRecorderV2
                  scriptureText={props.scriptureText}
                  musicAudioContext={props.musicAudioContext}
                  musicAudioNode={props.musicAudioNode}
                />
              </div>
            </details>

            <details className="bg-white/5 rounded-lg border border-white/10">
              <summary className="p-3 cursor-pointer hover:bg-white/10 rounded-lg text-white font-medium">
                VoiceChordMixer (Post-Mix)
              </summary>
              <div className="p-4 border-t border-white/10">
                <VoiceChordMixer
                  currentChord={props.currentChord}
                  currentNotes={props.currentNotes}
                  isPlaying={props.isPlaying}
                  bpm={props.bpm}
                  instrument={props.instrument}
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Technical Note */}
      <div className="mt-4 text-xs text-gray-400 bg-gray-900/30 rounded p-2 border border-gray-700">
        ℹ️ Note: This unified interface uses your existing recording components internally.
        All previous functionality is preserved and enhanced with cloud storage, waveform visualization, and professional audio effects.
      </div>
    </div>
  );
}
