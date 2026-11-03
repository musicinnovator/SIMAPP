import React, { useState, useRef, useEffect } from 'react';
import { Mic, Music2, Square, PlayCircle, StopCircle, AlertCircle } from 'lucide-react';
import * as Tone from 'tone';

interface DualTrackRecorderProps {
  isPlaying: boolean;
  onStartRecording: () => void;
  onStopRecording: (vocalBlob: Blob, musicBlob: Blob, duration: number) => void;
  getMusicDestination: () => AudioNode | null;
  // ADDITIVE: Optional auto-play support when Start Recording is clicked
  musicMachineRef?: React.RefObject<{ playMusic: () => Promise<void> }>;
  autoPlayOnRecord?: boolean;
}

export function DualTrackRecorder({
  isPlaying,
  onStartRecording,
  onStopRecording,
  getMusicDestination,
  musicMachineRef,
  autoPlayOnRecord = true // ADDITIVE: Default to true for new auto-play behavior
}: DualTrackRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [vocalLevel, setVocalLevel] = useState(0);
  const [musicLevel, setMusicLevel] = useState(0);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState(false);

  const vocalRecorderRef = useRef<MediaRecorder | null>(null);
  const musicRecorderRef = useRef<MediaRecorder | null>(null);
  const vocalChunksRef = useRef<Blob[]>([]);
  const musicChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vocalAnalyserRef = useRef<AnalyserNode | null>(null);
  const musicAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const musicStreamDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const startTimeRef = useRef<number>(0);

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

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError('');
      return true;
    } catch (err) {
      setError('Microphone permission denied. Please enable microphone access.');
      setHasPermission(false);
      return false;
    }
  };

  const setupVocalRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          sampleSize: 16,
          channelCount: 1
        }
      });

      const audioContext = Tone.context.rawContext as AudioContext;
      const source = audioContext.createMediaStreamSource(stream);

      vocalAnalyserRef.current = audioContext.createAnalyser();
      vocalAnalyserRef.current.fftSize = 256;
      source.connect(vocalAnalyserRef.current);

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });

      vocalChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          vocalChunksRef.current.push(e.data);
        }
      };

      vocalRecorderRef.current = recorder;
      return true;
    } catch (err) {
      console.error('Failed to setup vocal recording:', err);
      setError('Failed to access microphone');
      return false;
    }
  };

  const setupMusicRecording = () => {
    try {
      const audioContext = Tone.context.rawContext as AudioContext;

      const musicDestination = getMusicDestination();
      if (!musicDestination) {
        throw new Error('Music destination not available');
      }

      const streamDestination = audioContext.createMediaStreamDestination();
      musicStreamDestinationRef.current = streamDestination;

      (musicDestination as any).connect(streamDestination);

      musicAnalyserRef.current = audioContext.createAnalyser();
      musicAnalyserRef.current.fftSize = 256;
      (musicDestination as any).connect(musicAnalyserRef.current);

      const recorder = new MediaRecorder(streamDestination.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      musicChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          musicChunksRef.current.push(e.data);
        }
      };

      musicRecorderRef.current = recorder;
      return true;
    } catch (err) {
      console.error('Failed to setup music recording:', err);
      setError('Failed to setup music recording');
      return false;
    }
  };

  const updateLevels = () => {
    if (!isRecording) return;

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
        setError('Failed to start music playback automatically');
        return;
      }
    }

    // PRESERVED: Original validation for when auto-play is disabled or unavailable
    if (!isPlaying && !autoPlayOnRecord) {
      setError('Please start music playback first');
      return;
    }

    if (!hasPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    setError('');

    const vocalSetup = await setupVocalRecording();
    if (!vocalSetup) return;

    const musicSetup = setupMusicRecording();
    if (!musicSetup) return;

    vocalRecorderRef.current?.start(100);
    musicRecorderRef.current?.start(100);

    setIsRecording(true);
    startTimeRef.current = Date.now();
    setRecordingTime(0);

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setRecordingTime(elapsed);
    }, 1000);

    updateLevels();
    onStartRecording();
  };

  const stopRecording = () => {
    if (!isRecording) return;

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

    setIsRecording(false);

    setTimeout(() => {
      const vocalBlob = new Blob(vocalChunksRef.current, { type: 'audio/webm' });
      const musicBlob = new Blob(musicChunksRef.current, { type: 'audio/webm' });
      const duration = recordingTime;

      onStopRecording(vocalBlob, musicBlob, duration);

      vocalChunksRef.current = [];
      musicChunksRef.current = [];
      setVocalLevel(0);
      setMusicLevel(0);
    }, 500);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-lg p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Music2 className="w-6 h-6 text-purple-300" />
          <span>Professional Recording Studio</span>
        </h3>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 font-mono text-lg">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-200">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {!isPlaying && !isRecording && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg flex items-center space-x-2 text-yellow-200">
          <AlertCircle className="w-5 h-5" />
          <span>Start music playback before recording</span>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-pink-400" />
              <span className="text-white font-medium">Vocals</span>
            </div>
            <span className="text-pink-300 text-sm font-mono">{Math.round(vocalLevel)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-100"
              style={{ width: `${vocalLevel}%` }}
            />
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Music2 className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Music</span>
            </div>
            <span className="text-blue-300 text-sm font-mono">{Math.round(musicLevel)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-50 transition-all duration-100"
              style={{ width: `${musicLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={!isPlaying}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <PlayCircle className="w-6 h-6" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Square className="w-6 h-6" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>
    </div>
  );
}
