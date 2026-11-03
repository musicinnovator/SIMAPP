import React, { useState, useRef, useEffect } from 'react';
import { Circle, Square, RotateCcw, Save, Download, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { RealTimeMixer } from './recording/RealTimeMixer';
import { LiveMusicControls, LiveMusicSettings } from './recording/LiveMusicControls';
import { TrackWaveform } from './TrackWaveform';
import { ExportManager } from './ExportManager';
import { MixingStudio } from './MixingStudio';
import { useDualTrackRecordings } from '../hooks/useDualTrackRecordings';
import * as Tone from 'tone';

interface CompactRecordingStudioProps {
  scriptureText: string;
  scriptureReference: string;
  isPlaying: boolean;
  getMusicDestination: () => AudioNode | null;
  stopMusic?: () => void;
  // ADDITIVE: Optional auto-play support when Start Recording is clicked
  musicMachineRef?: React.RefObject<{ playMusic: () => Promise<void> }>;
  autoPlayOnRecord?: boolean;
}

type RecordingState = 'idle' | 'recording' | 'recorded' | 'mixing';
type RecordingMode = 'standard' | 'professional';

export function CompactRecordingStudio({
  scriptureText,
  scriptureReference,
  isPlaying,
  getMusicDestination,
  stopMusic,
  musicMachineRef,
  autoPlayOnRecord = true // ADDITIVE: Default to true for new auto-play behavior
}: CompactRecordingStudioProps) {
  const [recordingMode, setRecordingMode] = useState<RecordingMode>('standard');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [vocalBlob, setVocalBlob] = useState<Blob | null>(null);
  const [musicBlob, setMusicBlob] = useState<Blob | null>(null);
  const [combinedBlob, setCombinedBlob] = useState<Blob | null>(null);

  const [vocalVolume, setVocalVolume] = useState(75);
  const [musicVolume, setMusicVolume] = useState(80);
  const [vocalMuted, setVocalMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [vocalLevel, setVocalLevel] = useState(0);
  const [musicLevel, setMusicLevel] = useState(0);

  const [showExportManager, setShowExportManager] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [expandedSection, setExpandedSection] = useState<'mixer' | 'music' | null>('mixer');

  const [musicSettings, setMusicSettings] = useState<LiveMusicSettings>({
    instrument: 'Acoustic Grand Piano',
    tempo: 120,
    key: 'C Major',
    pattern: 'arpeggio',
    meter: '4/4',
    inversion: 'root',
    chordProgression: 'I-V-vi-IV',
    voiceLeading: true
  });

  const { saveRecording } = useDualTrackRecordings();

  const vocalRecorderRef = useRef<MediaRecorder | null>(null);
  const musicRecorderRef = useRef<MediaRecorder | null>(null);
  const combinedRecorderRef = useRef<MediaRecorder | null>(null);
  const vocalChunksRef = useRef<Blob[]>([]);
  const musicChunksRef = useRef<Blob[]>([]);
  const combinedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vocalAnalyserRef = useRef<AnalyserNode | null>(null);
  const musicAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mixerNodeRef = useRef<GainNode | null>(null);
  const vocalGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update gain nodes in real-time during professional recording
  useEffect(() => {
    if (recordingMode === 'professional' && recordingState === 'recording') {
      if (vocalGainRef.current) {
        vocalGainRef.current.gain.value = vocalMuted ? 0 : vocalVolume / 100;
      }
      if (musicGainRef.current) {
        musicGainRef.current.gain.value = musicMuted ? 0 : musicVolume / 100;
      }
    }
  }, [vocalVolume, musicVolume, vocalMuted, musicMuted, recordingMode, recordingState]);

  const updateLevels = () => {
    if (recordingState !== 'recording') return;

    if (vocalAnalyserRef.current) {
      const dataArray = new Uint8Array(vocalAnalyserRef.current.frequencyBinCount);
      vocalAnalyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVocalLevel(Math.min(100, (average / 255) * 100));
    }

    if (musicAnalyserRef.current) {
      const dataArray = new Uint8Array(musicAnalyserRef.current.frequencyBinCount);
      musicAnalyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setMusicLevel(Math.min(100, (average / 255) * 100));
    }

    animationFrameRef.current = requestAnimationFrame(updateLevels);
  };

  const startRecording = async () => {
    // ADDITIVE: Auto-play music if not playing and autoPlayOnRecord is enabled
    if (!isPlaying && autoPlayOnRecord && musicMachineRef?.current) {
      try {
        await musicMachineRef.current.playMusic();
        // Wait a moment for music to start and state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to auto-start music:', error);
        alert('Failed to start music playback automatically');
        return;
      }
    }

    // PRESERVED: Original validation for when auto-play is disabled or unavailable
    if (!isPlaying && !autoPlayOnRecord) {
      alert('⚠️ Please start music playback first!');
      return;
    }

    if (recordingMode === 'professional') {
      return startProfessionalRecording();
    }

    // STANDARD MODE: Dual-track recording
    try {
      const audioContext = Tone.context.rawContext as AudioContext;

      const vocalStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      });

      const vocalSource = audioContext.createMediaStreamSource(vocalStream);
      vocalAnalyserRef.current = audioContext.createAnalyser();
      vocalAnalyserRef.current.fftSize = 256;
      vocalSource.connect(vocalAnalyserRef.current);

      // HIGH QUALITY SETTINGS
      const vocalRecorder = new MediaRecorder(vocalStream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 192000  // High quality: 192kbps
      });
      vocalChunksRef.current = [];
      vocalRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          vocalChunksRef.current.push(e.data);
        }
      };
      vocalRecorderRef.current = vocalRecorder;

      const musicDestination = getMusicDestination();
      if (musicDestination) {
        const streamDestination = audioContext.createMediaStreamDestination();
        (musicDestination as any).connect(streamDestination);

        musicAnalyserRef.current = audioContext.createAnalyser();
        musicAnalyserRef.current.fftSize = 256;
        (musicDestination as any).connect(musicAnalyserRef.current);

        // HIGH QUALITY SETTINGS
        const musicRecorder = new MediaRecorder(streamDestination.stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 192000  // High quality: 192kbps
        });
        musicChunksRef.current = [];
        musicRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            musicChunksRef.current.push(e.data);
          }
        };
        musicRecorderRef.current = musicRecorder;
        musicRecorder.start(100);
      }

      vocalRecorder.start(100);
      setRecordingState('recording');
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      updateLevels();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('❌ Failed to start recording. Please check microphone permissions.');
    }
  };

  const startProfessionalRecording = async () => {
    // PROFESSIONAL MODE: Real-time mixdown to single track
    try {
      const audioContext = Tone.context.rawContext as AudioContext;

      // Get vocal stream
      const vocalStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      });

      const vocalSource = audioContext.createMediaStreamSource(vocalStream);

      // Create vocal gain node
      vocalGainRef.current = audioContext.createGain();
      vocalGainRef.current.gain.value = vocalVolume / 100;
      vocalSource.connect(vocalGainRef.current);

      // Analyser for vocal
      vocalAnalyserRef.current = audioContext.createAnalyser();
      vocalAnalyserRef.current.fftSize = 256;
      vocalGainRef.current.connect(vocalAnalyserRef.current);

      // Get music destination
      const musicDestination = getMusicDestination();
      if (!musicDestination) {
        throw new Error('Music destination not available');
      }

      // Create music gain node
      musicGainRef.current = audioContext.createGain();
      musicGainRef.current.gain.value = musicVolume / 100;
      (musicDestination as any).connect(musicGainRef.current);

      // Analyser for music
      musicAnalyserRef.current = audioContext.createAnalyser();
      musicAnalyserRef.current.fftSize = 256;
      musicGainRef.current.connect(musicAnalyserRef.current);

      // Create mixer destination
      const mixerDestination = audioContext.createMediaStreamDestination();
      mixerNodeRef.current = audioContext.createGain();
      mixerNodeRef.current.gain.value = 1.0;

      // Connect both sources to mixer
      vocalGainRef.current.connect(mixerNodeRef.current);
      musicGainRef.current.connect(mixerNodeRef.current);
      mixerNodeRef.current.connect(mixerDestination);

      // Record the mixed output with HIGH QUALITY
      const combinedRecorder = new MediaRecorder(mixerDestination.stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 256000  // Professional quality: 256kbps
      });

      combinedChunksRef.current = [];
      combinedRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          combinedChunksRef.current.push(e.data);
        }
      };
      combinedRecorderRef.current = combinedRecorder;

      combinedRecorder.start(100);
      setRecordingState('recording');
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      updateLevels();

      // Store vocal stream for cleanup
      vocalRecorderRef.current = { stream: vocalStream } as any;
    } catch (error) {
      console.error('Failed to start professional recording:', error);
      alert('❌ Failed to start professional recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (recordingMode === 'professional') {
      return stopProfessionalRecording();
    }

    // STANDARD MODE: Stop dual-track recording
    if (vocalRecorderRef.current && vocalRecorderRef.current.state !== 'inactive') {
      vocalRecorderRef.current.stop();
      vocalRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (musicRecorderRef.current && musicRecorderRef.current.state !== 'inactive') {
      musicRecorderRef.current.stop();
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setTimeout(() => {
      const vocal = new Blob(vocalChunksRef.current, { type: 'audio/webm' });
      const music = new Blob(musicChunksRef.current, { type: 'audio/webm' });

      setVocalBlob(vocal);
      setMusicBlob(music);
      setRecordingState('recorded');
      setVocalLevel(0);
      setMusicLevel(0);
    }, 500);
  };

  const stopProfessionalRecording = () => {
    // PROFESSIONAL MODE: Stop combined recording
    if (combinedRecorderRef.current && combinedRecorderRef.current.state !== 'inactive') {
      combinedRecorderRef.current.stop();
    }

    // Stop vocal stream
    if (vocalRecorderRef.current && (vocalRecorderRef.current as any).stream) {
      (vocalRecorderRef.current as any).stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Cleanup gain nodes
    if (vocalGainRef.current) {
      vocalGainRef.current.disconnect();
    }
    if (musicGainRef.current) {
      musicGainRef.current.disconnect();
    }
    if (mixerNodeRef.current) {
      mixerNodeRef.current.disconnect();
    }

    setTimeout(() => {
      const combined = new Blob(combinedChunksRef.current, { type: 'audio/webm' });
      setCombinedBlob(combined);
      setRecordingState('recorded');
      setVocalLevel(0);
      setMusicLevel(0);
    }, 500);
  };

  const handleRestart = () => {
    setRecordingState('idle');
    setRecordingTime(0);
    setVocalBlob(null);
    setMusicBlob(null);
    setCombinedBlob(null);
    vocalChunksRef.current = [];
    musicChunksRef.current = [];
    combinedChunksRef.current = [];
  };

  const handleMixingStudioOpen = () => {
    setRecordingState('mixing');
  };

  const handleMixingStudioClose = () => {
    setRecordingState('recorded');
  };

  const handleExport = async () => {
    if (!vocalBlob || !musicBlob) return;

    try {
      const { mergeAudioTracks } = await import('../utils/audioMixer');
      const combinedBlob = await mergeAudioTracks(
        vocalBlob,
        musicBlob,
        vocalVolume / 100,
        musicVolume / 100
      );
      setExportedBlob(combinedBlob);
      setShowExportManager(true);
    } catch (error) {
      console.error('Export failed:', error);
      alert('❌ Failed to export audio. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      const saved = await saveRecording({
        project_name: `Recording - ${scriptureReference} - ${new Date().toLocaleString()}`,
        vocal_volume: vocalVolume,
        music_volume: musicVolume,
        duration: recordingTime,
        metadata: {
          musicSettings,
          scriptureReference,
          timestamp: Date.now()
        }
      });

      if (saved) {
        alert(`✅ Project saved successfully!\n\nProject ID: ${saved.id}`);
      } else {
        alert('❌ Failed to save project.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`❌ Error saving project: ${error}`);
    }
  };

  const handleSaveFromMixing = async (projectData: any) => {
    try {
      const saved = await saveRecording({
        project_name: `Recording - ${scriptureReference} - ${new Date().toLocaleString()}`,
        vocal_volume: projectData.vocalVolume,
        music_volume: projectData.musicVolume,
        duration: projectData.duration,
        metadata: {
          timestamp: projectData.timestamp,
          scriptureReference
        }
      });

      if (saved) {
        alert(`✅ Project saved successfully!\n\nProject ID: ${saved.id}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`❌ Error saving project: ${error}`);
    }
  };

  const handleMusicSettingsChange = (updates: Partial<LiveMusicSettings>) => {
    setMusicSettings(prev => ({ ...prev, ...updates }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSection = (section: 'mixer' | 'music') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // If in mixing mode, show full mixing studio
  if (recordingState === 'mixing' && vocalBlob && musicBlob) {
    return (
      <div className="bg-gradient-to-b from-white/10 to-white/5 rounded-xl border border-white/20 max-h-[600px] overflow-y-auto">
        <MixingStudio
          vocalBlob={vocalBlob}
          musicBlob={musicBlob}
          duration={recordingTime}
          onClose={handleMixingStudioClose}
          onSaveProject={handleSaveFromMixing}
          onExport={(blob) => {
            setExportedBlob(blob);
            setShowExportManager(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white/10 to-white/5 rounded-xl p-4 border border-white/20 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-white">Recording Studio</h3>
        </div>
        {recordingState === 'recording' && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-mono text-sm font-bold">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {/* Mode Toggle (only show when idle) */}
      {recordingState === 'idle' && (
        <div className="mb-3 bg-black/20 rounded-lg p-2 border border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs font-semibold">Mode:</span>
            <button
              onClick={() => setRecordingMode('standard')}
              className={`flex-1 px-3 py-1.5 rounded text-xs font-bold transition-all duration-200 ${
                recordingMode === 'standard'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setRecordingMode('professional')}
              className={`flex-1 px-3 py-1.5 rounded text-xs font-bold transition-all duration-200 ${
                recordingMode === 'professional'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              Professional
            </button>
          </div>
          <p className="text-xs text-gray-300 mt-2 italic">
            {recordingMode === 'standard'
              ? '📊 Dual-track: Separate vocals & music for post-production mixing'
              : '🎚️ Live mixdown: Real-time blend into single professional track'
            }
          </p>
        </div>
      )}

      {/* Scripture Display */}
      <div className="bg-white/5 rounded-lg p-3 mb-3 border border-white/10">
        <p className="text-blue-200 text-xs font-semibold mb-1">{scriptureReference}</p>
        <p className="text-white text-sm italic line-clamp-2">{scriptureText}</p>
      </div>

      {/* Recording Transport */}
      <div className="mb-3">
        <div className="flex items-center justify-center space-x-2">
          {recordingState === 'idle' && (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Circle className="w-5 h-5" fill="currentColor" />
              <span>Start Recording</span>
            </button>
          )}

          {recordingState === 'recording' && (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Square className="w-5 h-5" fill="currentColor" />
              <span>Stop Recording</span>
            </button>
          )}

          {recordingState === 'recorded' && (
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Recording</span>
            </button>
          )}
        </div>
      </div>

      {/* Stop Music Button - Emergency Kill Switch */}
      {isPlaying && stopMusic && (
        <div className="mb-3">
          <button
            onClick={stopMusic}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-orange-300"
          >
            <Square className="w-5 h-5" fill="currentColor" />
            <span>🛑 STOP MUSIC</span>
          </button>
          <p className="text-xs text-orange-200 text-center mt-1 italic">Emergency music kill switch</p>
        </div>
      )}

      {/* Waveforms (Standard Mode - Dual Track) */}
      {recordingState === 'recorded' && recordingMode === 'standard' && vocalBlob && musicBlob && (
        <div className="space-y-3 mb-3">
          <div>
            <p className="text-pink-300 text-xs mb-1 font-semibold">Vocal Track</p>
            <TrackWaveform audioBlob={vocalBlob} color="#ec4899" height={40} />
          </div>
          <div>
            <p className="text-blue-300 text-xs mb-1 font-semibold">Music Track</p>
            <TrackWaveform audioBlob={musicBlob} color="#3b82f6" height={40} />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-lg transition-all duration-200 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

          <button
            onClick={handleMixingStudioOpen}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all duration-200"
          >
            <Play className="w-4 h-4" />
            <span>Open Full Mixing Studio</span>
          </button>
        </div>
      )}

      {/* Waveform (Professional Mode - Single Combined Track) */}
      {recordingState === 'recorded' && recordingMode === 'professional' && combinedBlob && (
        <div className="space-y-3 mb-3">
          <div>
            <p className="text-green-300 text-xs mb-1 font-semibold">✨ Professional Mixed Track</p>
            <TrackWaveform audioBlob={combinedBlob} color="#10b981" height={60} />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (combinedBlob) {
                  const url = URL.createObjectURL(combinedBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `professional-recording-${scriptureReference}-${Date.now()}.webm`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-lg transition-all duration-200 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

          <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-center">
            <p className="text-green-300 text-xs font-semibold">✅ Professional quality • 256kbps • Ready to share</p>
          </div>
        </div>
      )}

      {/* Real-Time Mixer (Collapsible) */}
      <div className="mb-3">
        <button
          onClick={() => toggleSection('mixer')}
          className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors mb-2"
        >
          <span className="text-white font-semibold text-sm">Mixer Controls</span>
          {expandedSection === 'mixer' ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </button>

        {expandedSection === 'mixer' && (
          <div className="bg-black/20 rounded-lg p-3 border border-white/10">
            <RealTimeMixer
              vocalVolume={vocalVolume}
              musicVolume={musicVolume}
              vocalMuted={vocalMuted}
              musicMuted={musicMuted}
              vocalLevel={vocalLevel}
              musicLevel={musicLevel}
              onVocalVolumeChange={setVocalVolume}
              onMusicVolumeChange={setMusicVolume}
              onVocalMutedChange={setVocalMuted}
              onMusicMutedChange={setMusicMuted}
              allowAdjustWhileRecording={true}
              isRecording={recordingState === 'recording'}
            />
          </div>
        )}
      </div>

      {/* Music Settings (Collapsible) */}
      <div>
        <button
          onClick={() => toggleSection('music')}
          className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors mb-2"
        >
          <span className="text-white font-semibold text-sm">Music Settings</span>
          {expandedSection === 'music' ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </button>

        {expandedSection === 'music' && (
          <div className="bg-black/20 rounded-lg p-3 border border-white/10">
            <LiveMusicControls
              settings={musicSettings}
              onSettingsChange={handleMusicSettingsChange}
              onPreview={() => console.log('Preview music')}
              isRecording={recordingState === 'recording'}
              isPlaying={isPlaying}
            />
          </div>
        )}
      </div>

      {/* Export Manager Modal */}
      {showExportManager && exportedBlob && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ExportManager
              combinedBlob={exportedBlob}
              projectName={`Recording - ${scriptureReference}`}
              onClose={() => setShowExportManager(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
