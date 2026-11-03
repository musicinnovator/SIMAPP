import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Trash2, Volume2, Music } from 'lucide-react';
import { SimultaneousRecorder } from '../utils/simultaneousRecorder';

interface VoiceRecorderV2Props {
  scriptureText?: string;
  onRecordingChange?: (hasRecording: boolean) => void;
  musicAudioContext?: AudioContext;
  musicAudioNode?: any;
}

type RecordingMode = 'voice-only' | 'voice-music';

export default function VoiceRecorderV2({
  scriptureText,
  onRecordingChange,
  musicAudioContext,
  musicAudioNode
}: VoiceRecorderV2Props) {
  // Detect if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Recording mode
  const [recordingMode, setRecordingMode] = useState<RecordingMode>('voice-only');

  // Voice-only recording states
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingLevel, setRecordingLevel] = useState(0);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackVolume, setPlaybackVolume] = useState(100);

  // Simultaneous recording states
  const [voiceVolume, setVoiceVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(70);
  const [simultaneousRecorder] = useState(() => new SimultaneousRecorder());

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const levelCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start voice-only recording
  const startVoiceOnlyRecording = async () => {
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

      audioStreamRef.current = stream;

      // Setup audio context for level monitoring
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Setup MediaRecorder with high-quality settings
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });

        // Clean up previous recording
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }

        audioUrlRef.current = URL.createObjectURL(audioBlob);
        setHasRecording(true);

        if (onRecordingChange) {
          onRecordingChange(true);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

      // Start level monitoring
      levelCheckRef.current = setInterval(() => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setRecordingLevel(average);
        }
      }, 50);

    } catch (error) {
      console.error('Failed to start voice-only recording:', error);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  // Start simultaneous recording
  const startSimultaneousRecording = async () => {
    // Mobile fallback: Use ambient recording (mic captures voice + speakers)
    if (isMobile) {
      alert('📱 Mobile Mode:\n\n' +
            '• Turn up your device volume\n' +
            '• The microphone will capture both your voice and the music playing from speakers\n' +
            '• Headphones with mic work best!\n\n' +
            'Tip: Start playing music first, then start recording.');

      // Use voice-only recording but with higher gain for ambient capture
      startVoiceOnlyRecording();
      return;
    }

    // Desktop: Use proper audio mixing
    if (!musicAudioContext || !musicAudioNode) {
      alert('Music system not available. Please start playing music first.');
      return;
    }

    try {
      await simultaneousRecorder.initialize(musicAudioContext);
      simultaneousRecorder.connectMusicSource(musicAudioNode);
      await simultaneousRecorder.startRecording(voiceVolume / 100, musicVolume / 100);

      setIsRecording(true);
      setRecordingDuration(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

    } catch (error) {
      console.error('Failed to start simultaneous recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  // Stop voice-only recording
  const stopVoiceOnlyRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingLevel(0);
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (levelCheckRef.current) {
      clearInterval(levelCheckRef.current);
      levelCheckRef.current = null;
    }
  };

  // Stop simultaneous recording
  const stopSimultaneousRecording = async () => {
    try {
      const blob = await simultaneousRecorder.stopRecording();

      // Clean up previous recording
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      audioUrlRef.current = URL.createObjectURL(blob);
      setHasRecording(true);
      setIsRecording(false);

      if (onRecordingChange) {
        onRecordingChange(true);
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

    } catch (error) {
      console.error('Failed to stop simultaneous recording:', error);
      setIsRecording(false);
    }
  };

  // Unified start handler
  const handleStartRecording = () => {
    if (recordingMode === 'voice-only') {
      startVoiceOnlyRecording();
    } else {
      startSimultaneousRecording();
    }
  };

  // Unified stop handler
  const handleStopRecording = () => {
    if (recordingMode === 'voice-only') {
      stopVoiceOnlyRecording();
    } else {
      stopSimultaneousRecording();
    }
  };

  // Play recording
  const playRecording = () => {
    if (!audioUrlRef.current) return;

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    audioElementRef.current = new Audio(audioUrlRef.current);
    audioElementRef.current.volume = playbackVolume / 100;

    audioElementRef.current.onended = () => {
      setIsPlaying(false);
      setPlaybackTime(0);
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };

    audioElementRef.current.play();
    setIsPlaying(true);

    playbackTimerRef.current = setInterval(() => {
      if (audioElementRef.current) {
        setPlaybackTime(audioElementRef.current.currentTime);
      }
    }, 100);
  };

  // Stop playback
  const stopPlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    setIsPlaying(false);
    setPlaybackTime(0);

    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  // Update volume
  const updateVolume = (newVolume: number) => {
    setPlaybackVolume(newVolume);
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVolume / 100;
    }
  };

  // Download recording
  const downloadRecording = () => {
    if (!audioUrlRef.current) return;

    const a = document.createElement('a');
    a.href = audioUrlRef.current;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `recording-${timestamp}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Delete recording
  const deleteRecording = () => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      stopPlayback();

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      setHasRecording(false);
      if (onRecordingChange) {
        onRecordingChange(false);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if (levelCheckRef.current) clearInterval(levelCheckRef.current);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      simultaneousRecorder.dispose();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-red-900/50 to-purple-900/50 rounded-xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Mic className="w-6 h-6 mr-2" />
        Voice Recorder
      </h3>

      {/* Recording Mode Toggle */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-blue-300 text-sm font-medium">Recording Mode</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => !isRecording && setRecordingMode('voice-only')}
            disabled={isRecording}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              recordingMode === 'voice-only'
                ? 'bg-blue-500/20 border-blue-400 text-white'
                : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
            } ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Mic className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Voice Only</div>
          </button>
          <button
            onClick={() => !isRecording && setRecordingMode('voice-music')}
            disabled={isRecording}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              recordingMode === 'voice-music'
                ? 'bg-purple-500/20 border-purple-400 text-white'
                : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
            } ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Music className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Voice + Music</div>
            {isMobile && (
              <div className="text-xs text-yellow-300 mt-1">📱 Ambient Mode</div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile info for Voice + Music mode */}
      {recordingMode === 'voice-music' && !isRecording && isMobile && (
        <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
          <h4 className="text-yellow-300 font-bold mb-2 flex items-center">
            📱 Mobile Recording Mode
          </h4>
          <ul className="text-yellow-100 text-sm space-y-1">
            <li>• Start playing music first</li>
            <li>• Turn up your device volume</li>
            <li>• Microphone will capture both voice + music from speakers</li>
            <li>• Best with headphones that have a mic</li>
          </ul>
        </div>
      )}

      {/* Volume Controls (for simultaneous mode - desktop only) */}
      {recordingMode === 'voice-music' && !isRecording && !isMobile && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4 space-y-3">
          <div>
            <label className="text-blue-300 text-sm font-medium mb-2 block">Voice Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-white text-sm">{voiceVolume}%</span>
          </div>
          <div>
            <label className="text-blue-300 text-sm font-medium mb-2 block">Music Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-white text-sm">{musicVolume}%</span>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold hover:from-red-400 hover:to-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Mic className="w-6 h-6" />
            <span>Start Recording</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleStopRecording}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Square className="w-6 h-6" />
              <span>Stop Recording</span>
            </button>

            {/* Recording Duration */}
            <div className="text-white text-2xl font-mono font-bold">
              {formatTime(recordingDuration)}
            </div>

            {/* Level Meter (voice-only mode) */}
            {recordingMode === 'voice-only' && (
              <div className="w-full max-w-xs">
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-success-50 h-full transition-all duration-100"
                    style={{ width: `${Math.min(recordingLevel * 2, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Playback Controls */}
      {hasRecording && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 mt-4">
          <h4 className="text-white font-bold mb-4">Your Recording</h4>

          <div className="space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={isPlaying ? stopPlayback : playRecording}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-400 hover:to-gray-500'
                    : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Play'} Recording</span>
              </button>
            </div>

            {/* Playback Progress */}
            <div className="space-y-2">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-success-50 h-full transition-all duration-300"
                  style={{ width: recordingDuration > 0 ? `${(playbackTime / recordingDuration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-sm text-red-200">
                <span>{formatTime(playbackTime)}</span>
                <span>{formatTime(recordingDuration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-red-200" />
              <input
                type="range"
                min="0"
                max="100"
                value={playbackVolume}
                onChange={(e) => updateVolume(Number(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-full appearance-none slider"
              />
              <span className="text-red-200 text-sm font-medium w-12">{playbackVolume}%</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={downloadRecording}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={deleteRecording}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-400 hover:to-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
