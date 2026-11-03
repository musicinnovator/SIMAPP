import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Square, Play, Pause, Download, Settings,
  Volume2, Music as MusicIcon, ChevronLeft, Save,
  Circle, Layers, RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { MusicMachine } from './MusicMachine';
import '../styles/studioTheme.css';

interface UnifiedStudioPageProps {
  onNavigate: (page: string) => void;
  initialTemplate?: any;
  initialScripture?: any;
}

export default function UnifiedStudioPage({
  onNavigate,
  initialTemplate,
  initialScripture
}: UnifiedStudioPageProps) {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingMode, setRecordingMode] = useState<'voice' | 'music' | 'both'>('both');
  const [showMusicSettings, setShowMusicSettings] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(50);
  const [hasRecording, setHasRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [scripture, setScripture] = useState(
    initialScripture || {
      reference: 'Psalm 23:1-3',
      text: `The LORD is my shepherd; I shall not want.
He maketh me to lie down in green pastures: he leadeth me beside the still waters.
He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.`
    }
  );

  const [musicConfig, setMusicConfig] = useState(
    initialTemplate || {
      key: 'D',
      tempo: 72,
      timeSignature: '4/4',
      instrument: 'acoustic_grand_piano',
      pattern: 'simple'
    }
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // ADDITIVE: Reference to MusicMachine for auto-play functionality
  const musicMachineRef = useRef<{ playMusic: () => Promise<void>; stopMusic: () => void } | null>(null);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    // ADDITIVE: Auto-play music when Start Recording is clicked
    if (musicMachineRef.current && recordingMode !== 'voice') {
      try {
        await musicMachineRef.current.playMusic();
        // Wait a moment for music to start
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to auto-start music:', error);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioUrl);
        setHasRecording(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!user || !hasRecording) {
      alert('Please sign in and record audio before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const fileName = `recording_${Date.now()}.webm`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(`${user.id}/${fileName}`, audioBlob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(`${user.id}/${fileName}`);

      const { error: dbError } = await supabase
        .from('dual_track_recordings')
        .insert({
          user_id: user.id,
          title: scripture.reference,
          scripture_reference: scripture.reference,
          combined_audio_url: urlData.publicUrl,
          duration: formatTime(recordingTime),
          music_config: musicConfig
        });

      if (dbError) throw dbError;

      alert('Recording saved successfully!');
    } catch (error) {
      console.error('Error saving recording:', error);
      alert('Failed to save recording. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!audioRef.current) {
      alert('No recording available to export.');
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scripture.reference.replace(/[^a-z0-9]/gi, '_')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="studio-theme min-h-screen">
      <div className="studio-container max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('studio-dashboard')}
            className="studio-button-ghost flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="studio-heading-2 text-center flex-1">Recording: {scripture.reference}</h1>
          <div className="w-20"></div>
        </header>

        <div className="space-y-4">
          <section className="studio-card studio-fade-in">
            <h2 className="studio-card-subheader mb-3">Scripture Text</h2>
            <div className="bg-studio-gray-900 p-4 rounded border border-studio-border max-h-48 overflow-y-auto studio-scroll">
              <p className="studio-text-primary text-base leading-relaxed whitespace-pre-wrap">
                {scripture.text}
              </p>
            </div>
            <button
              onClick={() => onNavigate('scripture')}
              className="studio-button-ghost mt-3 text-xs"
            >
              Change Scripture
            </button>
          </section>

          <section className="studio-card studio-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="studio-card-subheader mb-0">Music Configuration</h2>
              <button
                onClick={() => setShowMusicSettings(!showMusicSettings)}
                className="studio-button-ghost text-xs flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                {showMusicSettings ? 'Hide' : 'Edit'}
              </button>
            </div>

            {!showMusicSettings ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="studio-label text-xs">Key</span>
                  <p className="studio-text-primary font-medium">{musicConfig.key} Major</p>
                </div>
                <div>
                  <span className="studio-label text-xs">Tempo</span>
                  <p className="studio-text-primary font-medium">{musicConfig.tempo} BPM</p>
                </div>
                <div>
                  <span className="studio-label text-xs">Time</span>
                  <p className="studio-text-primary font-medium">{musicConfig.timeSignature}</p>
                </div>
                <div>
                  <span className="studio-label text-xs">Pattern</span>
                  <p className="studio-text-primary font-medium capitalize">{musicConfig.pattern}</p>
                </div>
              </div>
            ) : (
              <div className="bg-studio-gray-900 p-4 rounded border border-studio-border">
                <MusicMachine ref={musicMachineRef} onNavigate={onNavigate} />
              </div>
            )}
          </section>

          <section className="studio-card studio-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="studio-card-subheader mb-4">Recording Controls</h2>

            <div className="flex flex-col items-center gap-6 py-6">
              <div className="flex items-center gap-4">
                {!isRecording && !hasRecording && (
                  <button
                    onClick={startRecording}
                    className="studio-button-primary text-lg px-8 py-4 flex items-center gap-3"
                  >
                    <Circle className="w-6 h-6 fill-current" />
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="bg-studio-accent-red hover:bg-red-600 text-white px-8 py-4 rounded flex items-center gap-3 font-semibold transition-all"
                  >
                    <Square className="w-6 h-6" />
                    Stop Recording
                  </button>
                )}

                {hasRecording && !isRecording && (
                  <>
                    <button
                      onClick={togglePlayback}
                      className="studio-button-primary px-6 py-3 flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Play
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setHasRecording(false);
                        setRecordingTime(0);
                        audioChunksRef.current = [];
                        audioRef.current = null;
                      }}
                      className="studio-button-secondary px-6 py-3 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Re-record
                    </button>
                  </>
                )}
              </div>

              {isRecording && (
                <div className="flex items-center gap-2">
                  <span className="studio-recording-indicator"></span>
                  <span className="studio-text-accent font-mono text-lg">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}

              <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={() => setRecordingMode('voice')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                      recordingMode === 'voice'
                        ? 'bg-studio-accent-gold text-studio-black'
                        : 'bg-studio-gray-800 text-studio-text-muted hover:bg-studio-gray-700'
                    }`}
                  >
                    <Mic className="w-4 h-4 inline mr-1" />
                    Voice Only
                  </button>
                  <button
                    onClick={() => setRecordingMode('music')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                      recordingMode === 'music'
                        ? 'bg-studio-accent-gold text-studio-black'
                        : 'bg-studio-gray-800 text-studio-text-muted hover:bg-studio-gray-700'
                    }`}
                  >
                    <MusicIcon className="w-4 h-4 inline mr-1" />
                    Music Only
                  </button>
                  <button
                    onClick={() => setRecordingMode('both')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                      recordingMode === 'both'
                        ? 'bg-studio-accent-gold text-studio-black'
                        : 'bg-studio-gray-800 text-studio-text-muted hover:bg-studio-gray-700'
                    }`}
                  >
                    <Layers className="w-4 h-4 inline mr-1" />
                    Voice + Music
                  </button>
                </div>

                <div className="w-full bg-studio-gray-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-studio-accent-gold transition-all duration-300"
                    style={{ width: isRecording ? '100%' : hasRecording ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <section className="studio-card studio-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="studio-card-subheader mb-4">Mixer</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="studio-label text-xs flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Voice Level
                  </label>
                  <span className="studio-text-muted text-sm font-mono">
                    {voiceVolume > 0 ? `-${100 - voiceVolume}` : '-∞'} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(Number(e.target.value))}
                  className="w-full h-2 bg-studio-gray-800 rounded-lg appearance-none cursor-pointer accent-studio-accent-gold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="studio-label text-xs flex items-center gap-2">
                    <MusicIcon className="w-4 h-4" />
                    Music Level
                  </label>
                  <span className="studio-text-muted text-sm font-mono">
                    {musicVolume > 0 ? `-${100 - musicVolume}` : '-∞'} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="w-full h-2 bg-studio-gray-800 rounded-lg appearance-none cursor-pointer accent-studio-accent-gold"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col sm:flex-row gap-3 studio-fade-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleSave}
              disabled={!hasRecording || isSaving || !user}
              className="studio-button-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Project'}
            </button>
            <button
              onClick={handleExport}
              disabled={!hasRecording}
              className="studio-button-primary flex-1 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Audio
            </button>
          </section>

          {!user && (
            <div className="studio-card bg-studio-gray-900 border-studio-accent-gold studio-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="studio-text-secondary text-sm text-center">
                Sign in to save your recordings and access them from any device
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
