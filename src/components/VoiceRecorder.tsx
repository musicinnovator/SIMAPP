import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Download, Trash2, Volume2, Share2, Layers } from 'lucide-react';
import SocialMediaShare from './SocialMediaShare';
import { AudioMixer } from '../utils/audioMixer';
import { SimultaneousRecorder } from '../utils/simultaneousRecorder';

interface VoiceRecorderProps {
  isVisible: boolean;
  onRecordingChange?: (hasRecording: boolean) => void;
  scriptureReference?: string;
  scriptureText?: string;
  musicRecordingBlob?: Blob | null;
  onMixedAudioReady?: (mixedBlob: Blob) => void;
  musicAudioContext?: AudioContext | null;
  musicAudioNode?: any;
}

export function VoiceRecorder({ isVisible, onRecordingChange, scriptureReference, scriptureText, musicRecordingBlob, onMixedAudioReady, musicAudioContext, musicAudioNode }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingLevel, setRecordingLevel] = useState(0);
  const [playbackVolume, setPlaybackVolume] = useState(75);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [isMixing, setIsMixing] = useState(false);
  const [mixedAudioURL, setMixedAudioURL] = useState<string | null>(null);
  const [showMixControls, setShowMixControls] = useState(false);
  const [mixMusicVolume, setMixMusicVolume] = useState(70);
  const [mixVoiceVolume, setMixVoiceVolume] = useState(100);
  const [recordingMode, setRecordingMode] = useState<'voice-only' | 'voice-music'>('voice-only');
  const [simultaneousRecVolume, setSimultaneousRecVolume] = useState({ voice: 100, music: 70 });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const levelCheckRef = useRef<NodeJS.Timeout | null>(null);
  const audioMixerRef = useRef<AudioMixer | null>(null);
  const simultaneousRecorderRef = useRef<SimultaneousRecorder | null>(null);

  // Initialize services once on mount
  useEffect(() => {
    // Only create instances if they don't exist
    if (!audioMixerRef.current) {
      audioMixerRef.current = new AudioMixer();
      console.log('AudioMixer initialized');
    }
    if (!simultaneousRecorderRef.current) {
      simultaneousRecorderRef.current = new SimultaneousRecorder();
      console.log('SimultaneousRecorder initialized');
    }

    return () => {
      cleanup();
      if (audioMixerRef.current) {
        audioMixerRef.current.dispose();
        audioMixerRef.current = null;
      }
      if (simultaneousRecorderRef.current) {
        simultaneousRecorderRef.current.dispose();
        simultaneousRecorderRef.current = null;
      }
    };
  }, []); // Empty deps - only run once on mount

  // Debug: Monitor hasRecording state
  useEffect(() => {
    console.log('hasRecording state changed to:', hasRecording);
  }, [hasRecording]);

  // Cleanup function to destroy recordings and free memory
  const cleanup = () => {
    stopRecording();
    stopPlayback();
    
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    
    if (audioElementRef.current) {
      audioElementRef.current.src = '';
      audioElementRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    audioChunksRef.current = [];
    setHasRecording(false);
    setRecordingDuration(0);
    setPlaybackTime(0);
    setRecordingLevel(0);
    
    if (onRecordingChange) {
      onRecordingChange(false);
    }
  };

  // Initialize audio recording
  const startRecording = async () => {
    try {
      console.log('Starting voice-only recording...');

      // Request microphone access with optimized settings for small file size
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

      console.log('Microphone access granted');

      // Set up audio analysis for recording level
      audioContextRef.current = new AudioContext({ sampleRate: 48000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Configure MediaRecorder with high-quality settings
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      };

      // Clear any previous recording data
      audioChunksRef.current = [];
      setHasRecording(false); // Ensure we don't show playback UI while recording

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      let chunkCount = 0; // Track chunk number
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunkCount++;
          // Skip first 3 chunks to avoid microphone initialization noise
          if (chunkCount <= 3) {
            console.log(`⏭️ Skipping chunk ${chunkCount} (${event.data.size} bytes) - mic initialization noise`);
            return;
          }
          audioChunksRef.current.push(event.data);
          console.log(`Audio data chunk ${chunkCount} received:`, event.data.size, 'bytes');
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('🔴 onstop handler called!');
        console.log('MediaRecorder stopped. Total chunks:', audioChunksRef.current.length);
        console.log('Current isRecording state:', isRecording);

        // Verify we have actual data
        if (audioChunksRef.current.length === 0) {
          console.error('No audio data recorded!');
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        console.log('Created audio blob:', audioBlob.size, 'bytes', 'type:', audioBlob.type);

        // Clean up previous recording
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }

        audioUrlRef.current = URL.createObjectURL(audioBlob);
        console.log('Recording saved successfully');
        console.log('Audio URL created:', audioUrlRef.current);
        console.log('About to call setHasRecording(true)');
        setHasRecording(true);
        console.log('setHasRecording(true) called');

        if (onRecordingChange) {
          onRecordingChange(true);
        }

        // Stop all tracks to free up microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingDuration(0);
      console.log('Recording started successfully');

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

      // Start recording level monitoring
      const checkLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setRecordingLevel(average / 255 * 100);
        }
      };

      levelCheckRef.current = setInterval(checkLevel, 50);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  // Start simultaneous recording (voice + music)
  const startSimultaneousRecording = async () => {
    console.log('🔴 startSimultaneousRecording called!');
    console.trace('Call stack:'); // This will show us WHO called this function

    if (!simultaneousRecorderRef.current) {
      alert('Recording system not initialized. Please refresh the page.');
      return;
    }

    try {
      // Ensure we have a valid audio context
      let contextToUse = musicAudioContext;

      if (!contextToUse) {
        // Create a new context if none provided
        contextToUse = new AudioContext();
        console.log('Created fallback AudioContext for recording');
      }

      // Resume context if suspended
      if (contextToUse.state === 'suspended') {
        await contextToUse.resume();
        console.log('Resumed suspended AudioContext');
      }

      // Initialize the recorder with the audio context
      await simultaneousRecorderRef.current.initialize(contextToUse);

      // Connect music source if available
      if (musicAudioNode) {
        try {
          simultaneousRecorderRef.current.connectMusicSource(musicAudioNode);
          console.log('Music source connected successfully');
        } catch (err) {
          console.warn('Could not connect music source:', err);
          // Continue anyway - user can still record voice
        }
      } else {
        console.warn('No music audio node available - recording voice only');
      }

      // Start the actual recording
      await simultaneousRecorderRef.current.startRecording(
        simultaneousRecVolume.voice / 100,
        simultaneousRecVolume.music / 100
      );

      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

      console.log('Simultaneous recording started successfully');

    } catch (error) {
      console.error('Error starting simultaneous recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('microphone') || errorMessage.includes('permission')) {
        alert('Unable to access microphone. Please check your permissions and try again.');
      } else {
        alert(`Recording failed: ${errorMessage}`);
      }
    }
  };

  // Stop simultaneous recording
  const stopSimultaneousRecording = async () => {
    if (!simultaneousRecorderRef.current) return;

    try {
      const blob = await simultaneousRecorderRef.current.stopRecording();

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      audioUrlRef.current = URL.createObjectURL(blob);
      setHasRecording(true);
      setIsRecording(false);
      setRecordingLevel(0);

      if (onRecordingChange) {
        onRecordingChange(true);
      }

      if (onMixedAudioReady) {
        onMixedAudioReady(blob);
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

    } catch (error) {
      console.error('Error stopping simultaneous recording:', error);
      setIsRecording(false);
    }
  };

  // Unified start recording based on mode
  const handleStartRecording = async () => {
    if (recordingMode === 'voice-music') {
      await startSimultaneousRecording();
    } else {
      await startRecording();
    }
  };

  // Unified stop recording based on mode
  const handleStopRecording = async () => {
    if (recordingMode === 'voice-music' && simultaneousRecorderRef.current?.isActive()) {
      await stopSimultaneousRecording();
    } else {
      stopRecording();
    }
  };

  // Stop recording
  const stopRecording = () => {
    console.log('Stopping voice-only recording...');

    if (mediaRecorderRef.current && isRecording) {
      console.log('MediaRecorder state:', mediaRecorderRef.current.state);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingLevel(0);
      console.log('Stop signal sent to MediaRecorder');
    } else {
      console.warn('Cannot stop recording - mediaRecorder not active');
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
    setPlaybackTime(0);

    // Start playback timer
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
      audioElementRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPlaybackTime(0);
    
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  // Download recording
  const downloadRecording = () => {
    if (!audioUrlRef.current) return;

    const link = document.createElement('a');
    link.href = audioUrlRef.current;
    link.download = `scripture-recording-${new Date().toISOString().slice(0, 19)}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete recording
  const deleteRecording = () => {
    cleanup();
  };

  // Mix voice with music recording
  const mixVoiceWithMusic = async () => {
    if (!audioUrlRef.current || !musicRecordingBlob) {
      alert('Both voice and music recordings are required for mixing.');
      return;
    }

    setIsMixing(true);

    try {
      const voiceResponse = await fetch(audioUrlRef.current);
      const voiceBlob = await voiceResponse.blob();

      const maxDuration = Math.max(recordingDuration, 60);

      const mixer = audioMixerRef.current;
      if (!mixer) {
        throw new Error('Audio mixer not initialized');
      }

      const mixedBlob = await mixer.mixAndExport(
        musicRecordingBlob,
        voiceBlob,
        mixMusicVolume,
        mixVoiceVolume,
        maxDuration
      );

      if (mixedBlob) {
        if (mixedAudioURL) {
          URL.revokeObjectURL(mixedAudioURL);
        }

        const url = URL.createObjectURL(mixedBlob);
        setMixedAudioURL(url);

        if (onMixedAudioReady) {
          onMixedAudioReady(mixedBlob);
        }

        alert('Voice and music mixed successfully!');
      } else {
        throw new Error('Failed to mix audio');
      }
    } catch (error) {
      console.error('Error mixing audio:', error);
      alert('Failed to mix audio. Please try again.');
    } finally {
      setIsMixing(false);
    }
  };

  // Download mixed recording
  const downloadMixedRecording = () => {
    if (!mixedAudioURL) return;

    const link = document.createElement('a');
    link.href = mixedAudioURL;
    link.download = `scripture-mixed-${new Date().toISOString().slice(0, 19)}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Play mixed recording
  const playMixedRecording = () => {
    if (!mixedAudioURL) return;

    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    audioElementRef.current = new Audio(mixedAudioURL);
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
    setPlaybackTime(0);

    playbackTimerRef.current = setInterval(() => {
      if (audioElementRef.current) {
        setPlaybackTime(audioElementRef.current.currentTime);
      }
    }, 100);
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update playback volume
  const updateVolume = (volume: number) => {
    setPlaybackVolume(volume);
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume / 100;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-6 border border-red-500/30">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Voice Recorder</h3>
              <p className="text-red-200 text-sm">Record your voice over the instrumental track</p>
            </div>
          </div>
          
          {hasRecording && (
            <div className="flex items-center space-x-2">
              <span className="text-green-300 text-sm font-medium">Recording saved</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* DEBUG: State Display */}
        <div className="bg-red-500 text-white p-2 rounded mb-2 text-xs font-mono">
          DEBUG: hasRecording={String(hasRecording)} | isRecording={String(isRecording)} | audioURL={audioUrlRef.current ? 'EXISTS' : 'NULL'}
        </div>

        {/* Recording Mode Toggle */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-blue-300 text-sm font-medium">Recording Mode</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => !isRecording && setRecordingMode('voice-only')}
              disabled={isRecording}
              className={`px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                recordingMode === 'voice-only'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              } ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Mic className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Voice Only</div>
            </button>
            <button
              onClick={() => !isRecording && setRecordingMode('voice-music')}
              disabled={isRecording}
              className={`px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                recordingMode === 'voice-music'
                  ? 'bg-success-50 text-white shadow-lg'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              } ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Layers className="w-5 h-5 mx-auto mb-1" />
              <div className="text-sm">Voice + Music</div>
            </button>
          </div>
          {recordingMode === 'voice-music' && (
            <div className="mt-3 text-xs text-blue-200 bg-blue-900/20 rounded p-2">
              Records your voice and accompaniment together in real-time
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold hover:from-red-400 hover:to-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Mic className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:from-gray-400 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Square className="w-5 h-5" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-200 font-medium">Recording: {formatTime(recordingDuration)}</span>
              </div>
              
              {/* Recording Level Indicator */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 h-full transition-all duration-100"
                  style={{ width: `${recordingLevel}%` }}
                />
              </div>
              <p className="text-red-200 text-xs">Speak clearly into your microphone</p>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {hasRecording && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
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
                  onClick={() => setShowSocialShare(true)}
                  className="flex items-center space-x-2 bg-success-50 text-white px-4 py-2 rounded-lg font-medium hover:from-green-400 hover:to-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={deleteRecording}
                  className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-400 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mix with Music Section */}
        {hasRecording && musicRecordingBlob && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Mix Voice + Music</span>
              </h4>
              <button
                onClick={() => setShowMixControls(!showMixControls)}
                className="text-red-300 text-sm hover:text-white transition-colors"
              >
                {showMixControls ? 'Hide' : 'Show'} Controls
              </button>
            </div>

            {showMixControls && (
              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-red-300 text-sm font-medium">Music Volume</label>
                    <span className="text-white text-sm font-bold">{mixMusicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={mixMusicVolume}
                    onChange={(e) => setMixMusicVolume(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-red-300 text-sm font-medium">Voice Volume</label>
                    <span className="text-white text-sm font-bold">{mixVoiceVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={mixVoiceVolume}
                    onChange={(e) => setMixVoiceVolume(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={mixVoiceWithMusic}
                disabled={isMixing}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isMixing
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-purple-400 hover:to-purple-500'
                }`}
              >
                {isMixing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mixing...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-5 h-5" />
                    <span>Mix Tracks</span>
                  </>
                )}
              </button>

              {mixedAudioURL && (
                <>
                  <button
                    onClick={playMixedRecording}
                    className="flex items-center space-x-2 bg-success-50 text-white px-4 py-2 rounded-lg font-medium hover:from-green-400 hover:to-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Mixed</span>
                  </button>

                  <button
                    onClick={downloadMixedRecording}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save Mixed</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Recording Tips */}
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
          <h4 className="text-red-300 font-bold mb-2">Recording Tips</h4>
          <ul className="text-red-100 text-sm space-y-1">
            <li>• Position yourself close to your microphone for best quality</li>
            <li>• Recordings are optimized for minimal file size (mono, compressed)</li>
            <li>• Your recording will be automatically deleted when you close the session</li>
            <li>• Use the "Save" button to download your recording to your device</li>
            <li>• Mix your voice with the instrumental track for a complete performance</li>
            <li>• Adjust volume levels before mixing for the perfect balance</li>
          </ul>
        </div>

        {/* File Size Info */}
        {hasRecording && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-300">Recording Duration:</span>
              <span className="text-white font-medium">{formatTime(recordingDuration)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-red-300">Estimated Size:</span>
              <span className="text-white font-medium">
                ~{Math.round(recordingDuration * 4)} KB (compressed)
              </span>
            </div>
            {mixedAudioURL && (
              <div className="flex items-center justify-between text-sm mt-1 pt-2 border-t border-white/10">
                <span className="text-green-300 font-bold">Mixed Track Ready</span>
                <span className="text-green-400 text-xs">Voice + Music Combined</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Social Media Share Modal */}
      <SocialMediaShare
        audioUrl={audioUrlRef.current}
        scriptureReference={scriptureReference}
        scriptureText={scriptureText}
        isVisible={showSocialShare}
        onClose={() => setShowSocialShare(false)}
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ef4444, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ef4444, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}


export default VoiceRecorder