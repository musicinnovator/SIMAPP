import React, { useState, useRef, useEffect } from 'react';
import { X, Circle, Square, Play, RotateCcw, Save, Download, Share2 } from 'lucide-react';
import { ScriptureDisplay } from './recording/ScriptureDisplay';
import { LiveMusicControls, LiveMusicSettings } from './recording/LiveMusicControls';
import { RealTimeMixer } from './recording/RealTimeMixer';
import { TrackWaveform } from './TrackWaveform';
import { ExportManager } from './ExportManager';
import { useDualTrackRecordings } from '../hooks/useDualTrackRecordings';
import * as Tone from 'tone';

interface LiveRecordingStudioProps {
  scriptureText: string;
  isPlaying: boolean;
  onClose: () => void;
  getMusicDestination: () => AudioNode | null;
  // ADDITIVE: Optional auto-play support when Start Recording is clicked
  musicMachineRef?: React.RefObject<{ playMusic: () => Promise<void> }>;
  autoPlayOnRecord?: boolean;
}

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing';

export function LiveRecordingStudio({
  scriptureText,
  isPlaying,
  onClose,
  getMusicDestination,
  musicMachineRef,
  autoPlayOnRecord = true // ADDITIVE: Default to true for new auto-play behavior
}: LiveRecordingStudioProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [vocalBlob, setVocalBlob] = useState<Blob | null>(null);
  const [musicBlob, setMusicBlob] = useState<Blob | null>(null);

  const [vocalVolume, setVocalVolume] = useState(75);
  const [musicVolume, setMusicVolume] = useState(80);
  const [vocalMuted, setVocalMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [vocalLevel, setVocalLevel] = useState(0);
  const [musicLevel, setMusicLevel] = useState(0);

  const [showExportManager, setShowExportManager] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);

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
  const vocalChunksRef = useRef<Blob[]>([]);
  const musicChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vocalAnalyserRef = useRef<AnalyserNode | null>(null);
  const musicAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

    try {
      const audioContext = Tone.context.rawContext as AudioContext;

      const vocalStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const vocalSource = audioContext.createMediaStreamSource(vocalStream);
      vocalAnalyserRef.current = audioContext.createAnalyser();
      vocalAnalyserRef.current.fftSize = 256;
      vocalSource.connect(vocalAnalyserRef.current);

      const vocalRecorder = new MediaRecorder(vocalStream);
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

        const musicRecorder = new MediaRecorder(streamDestination.stream);
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

  const stopRecording = () => {
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

  const handleRestart = () => {
    setRecordingState('idle');
    setRecordingTime(0);
    setVocalBlob(null);
    setMusicBlob(null);
    vocalChunksRef.current = [];
    musicChunksRef.current = [];
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
        project_name: `Live Recording - ${new Date().toLocaleString()}`,
        vocal_volume: vocalVolume,
        music_volume: musicVolume,
        duration: recordingTime,
        metadata: {
          musicSettings,
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

  const handleMusicSettingsChange = (updates: Partial<LiveMusicSettings>) => {
    setMusicSettings(prev => ({ ...prev, ...updates }));
  };

  const handlePreviewMusic = () => {
    console.log('Preview music with settings:', musicSettings);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex">
      {/* LEFT PANEL: Scripture Display (40%) */}
      <div className="w-2/5 border-r border-gray-700">
        <ScriptureDisplay
          text={scriptureText}
          autoScroll={false}
          fontSize="large"
          highlightEnabled={recordingState === 'recording'}
          currentPosition={(recordingTime / 180) * 100}
        />
      </div>

      {/* RIGHT PANEL: Controls (60%) */}
      <div className="w-3/5 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-900 to-purple-900 p-6 border-b border-gray-700 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">🎙️ Live Recording Studio</h2>
              <p className="text-indigo-200 text-sm">Professional multi-track recording with live mixing</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Recording Transport */}
          <div className="bg-gradient-to-br from-gray-800 to-black rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {recordingState === 'idle' && (
                  <button
                    onClick={startRecording}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg"
                  >
                    <Circle className="w-6 h-6" fill="currentColor" />
                    <span>Start Recording</span>
                  </button>
                )}

                {recordingState === 'recording' && (
                  <button
                    onClick={stopRecording}
                    className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg"
                  >
                    <Square className="w-6 h-6" fill="currentColor" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordingState === 'recorded' && (
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>New Recording</span>
                  </button>
                )}
              </div>

              {recordingState === 'recording' && (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-300 font-mono text-2xl font-bold">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
            </div>

            {recordingState === 'recorded' && vocalBlob && musicBlob && (
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-pink-300 text-sm mb-2">Vocal Track</p>
                    <TrackWaveform audioBlob={vocalBlob} color="#ec4899" height={50} />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm mb-2">Music Track</p>
                    <TrackWaveform audioBlob={musicBlob} color="#3b82f6" height={50} />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleExport}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export & Download</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real-Time Mixer */}
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

          {/* Live Music Controls */}
          <LiveMusicControls
            settings={musicSettings}
            onSettingsChange={handleMusicSettingsChange}
            onPreview={handlePreviewMusic}
            isRecording={recordingState === 'recording'}
            isPlaying={isPlaying}
          />
        </div>
      </div>

      {/* Export Manager */}
      {showExportManager && exportedBlob && (
        <ExportManager
          combinedBlob={exportedBlob}
          projectName="Live Recording"
          onClose={() => setShowExportManager(false)}
        />
      )}
    </div>
  );
}
