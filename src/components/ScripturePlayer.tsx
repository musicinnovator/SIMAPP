import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, BookOpen, Music } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import VoiceRecorder from './VoiceRecorder';
import { CompactRecordingStudio } from './CompactRecordingStudio';

interface Scripture {
  id: string;
  text: string;
  reference: string;
  audioUrl: string;
}

interface ScripturePlayerProps {
  scripture: any;
  onStartQuiz: () => void;
  musicDestination?: () => AudioNode | null;
  isMusicPlaying?: boolean;
  stopMusic?: () => void;
  // ADDITIVE: Optional musicMachineRef for auto-play support
  musicMachineRef?: React.RefObject<{ playMusic: () => Promise<void> }>;
}

export function ScripturePlayer({
  scripture,
  onStartQuiz,
  musicDestination,
  isMusicPlaying = false,
  stopMusic,
  musicMachineRef
}: ScripturePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [hasVoiceRecording, setHasVoiceRecording] = useState(false);
  const [mixedAudioBlob, setMixedAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mixedAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentScripture = scripture || {
    id: 'default',
    text: 'Default scripture text',
    reference: 'Default Reference',
    audioUrl: ''
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentScripture.audioUrl]);

  const handleMixedAudioReady = (blob: Blob) => {
    setMixedAudioBlob(blob);
  };

  const togglePlay = () => {
    const audio = mixedAudioBlob ? mixedAudioRef.current : audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (mixedAudioBlob && !mixedAudioRef.current) {
        mixedAudioRef.current = new Audio(URL.createObjectURL(mixedAudioBlob));
        mixedAudioRef.current.addEventListener('ended', () => setIsPlaying(false));
        mixedAudioRef.current.addEventListener('timeupdate', () => {
          if (mixedAudioRef.current) {
            setCurrentTime(mixedAudioRef.current.currentTime);
          }
        });
      }
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg p-8 shadow-2xl border border-white/10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Scripture Content */}
        <div className="flex-1">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{currentScripture.reference}</h2>
            <p className="text-xl text-blue-100 leading-relaxed italic">
              "{currentScripture.text}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onStartQuiz}
              className="flex-1 bg-accent-50 text-yellow-900 px-6 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Interactive Quiz</span>
            </button>
            
            <button
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                showVoiceRecorder
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500'
              }`}
            >
              <Music className="w-5 h-5" />
              <span>{showVoiceRecorder ? 'Hide' : 'Show'} Voice Recorder</span>
            </button>
          </div>
        </div>

        {/* Compact Recording Studio (replaces useless Audio Scripture badge) */}
        <div className="lg:w-80">
          <CompactRecordingStudio
            scriptureText={currentScripture.text}
            scriptureReference={currentScripture.reference}
            isPlaying={isMusicPlaying}
            getMusicDestination={musicDestination || (() => null)}
            stopMusic={stopMusic}
            musicMachineRef={musicMachineRef}
          />
        </div>
      </div>
      
      {/* Voice Recorder */}
      <VoiceRecorder
        isVisible={showVoiceRecorder}
        onRecordingChange={setHasVoiceRecording}
        scriptureReference={currentScripture.reference}
        scriptureText={currentScripture.text}
        onMixedAudioReady={handleMixedAudioReady}
      />
    </div>
  );
}

export default ScripturePlayer;