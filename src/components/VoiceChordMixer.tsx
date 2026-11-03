import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Trash2, Volume2, Music2, Sliders } from 'lucide-react';
import * as Tone from 'tone';

interface ChordSnapshot {
  time: number;
  chord: string;
  notes: number[];
  duration: number;
}

interface RecordingSession {
  voiceBlob: Blob;
  voiceUrl: string;
  chordSnapshots: ChordSnapshot[];
  totalDuration: number;
  timestamp: Date;
}

interface VoiceChordMixerProps {
  currentChord?: string;
  currentNotes?: number[];
  isPlaying?: boolean;
  bpm?: number;
  instrument?: string;
}

export default function VoiceChordMixer({
  currentChord = '',
  currentNotes = [],
  isPlaying = false,
  bpm = 100,
  instrument = 'acoustic_grand_piano'
}: VoiceChordMixerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sessions, setSessions] = useState<RecordingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<RecordingSession | null>(null);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(50);
  const [isMixing, setIsMixing] = useState(false);
  const [mixProgress, setMixProgress] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chordSnapshotsRef = useRef<ChordSnapshot[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicPlayerRef = useRef<Tone.PolySynth | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 96000
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];
      chordSnapshotsRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newSession: RecordingSession = {
          voiceBlob: audioBlob,
          voiceUrl: audioUrl,
          chordSnapshots: [...chordSnapshotsRef.current],
          totalDuration: recordingDuration,
          timestamp: new Date()
        };

        setSessions(prev => [newSession, ...prev]);
        setSelectedSession(newSession);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 0.1);
      }, 100);

      snapshotIntervalRef.current = setInterval(() => {
        if (currentChord && currentNotes.length > 0) {
          const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
          const snapshot: ChordSnapshot = {
            time: elapsed,
            chord: currentChord,
            notes: [...currentNotes],
            duration: (60 / bpm)
          };
          chordSnapshotsRef.current.push(snapshot);
        }
      }, 100);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
      snapshotIntervalRef.current = null;
    }
  };

  const playPreview = async () => {
    if (!selectedSession) return;

    await Tone.start();

    voiceAudioRef.current = new Audio(selectedSession.voiceUrl);
    voiceAudioRef.current.volume = voiceVolume / 100;

    if (!musicPlayerRef.current) {
      musicPlayerRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    musicPlayerRef.current.volume.value = Tone.gainToDb(musicVolume / 100);

    voiceAudioRef.current.play();
    setIsPlayingPreview(true);

    const now = Tone.now();
    selectedSession.chordSnapshots.forEach(snapshot => {
      musicPlayerRef.current?.triggerAttackRelease(
        snapshot.notes.map(n => Tone.Frequency(n, 'midi').toNote()),
        snapshot.duration,
        now + snapshot.time
      );
    });

    voiceAudioRef.current.onended = () => {
      setIsPlayingPreview(false);
    };
  };

  const stopPreview = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current = null;
    }
    if (musicPlayerRef.current) {
      musicPlayerRef.current.releaseAll();
    }
    setIsPlayingPreview(false);
  };

  const exportMix = async () => {
    if (!selectedSession) return;

    setIsMixing(true);
    setMixProgress(0);

    try {
      const sampleRate = 44100;
      const duration = selectedSession.totalDuration;
      const offlineContext = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

      const voiceArrayBuffer = await selectedSession.voiceBlob.arrayBuffer();
      const voiceBuffer = await offlineContext.decodeAudioData(voiceArrayBuffer);

      const voiceSource = offlineContext.createBufferSource();
      voiceSource.buffer = voiceBuffer;
      const voiceGain = offlineContext.createGain();
      voiceGain.gain.value = voiceVolume / 100;
      voiceSource.connect(voiceGain);
      voiceGain.connect(offlineContext.destination);

      const musicGain = offlineContext.createGain();
      musicGain.gain.value = musicVolume / 100;
      musicGain.connect(offlineContext.destination);

      selectedSession.chordSnapshots.forEach(snapshot => {
        snapshot.notes.forEach(midiNote => {
          const oscillator = offlineContext.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.value = Tone.Frequency(midiNote, 'midi').toFrequency();
          oscillator.connect(musicGain);
          oscillator.start(snapshot.time);
          oscillator.stop(snapshot.time + snapshot.duration);
        });
      });

      voiceSource.start(0);
      setMixProgress(30);

      const renderedBuffer = await offlineContext.startRendering();
      setMixProgress(70);

      const wavBlob = await bufferToWave(renderedBuffer);
      setMixProgress(100);

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      a.download = `voice-chord-mix-${timestamp}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsMixing(false);
        setMixProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Failed to export mix:', error);
      alert('Failed to create mix. Please try again.');
      setIsMixing(false);
      setMixProgress(0);
    }
  };

  const bufferToWave = async (buffer: AudioBuffer): Promise<Blob> => {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const deleteSession = (session: RecordingSession) => {
    if (window.confirm('Delete this recording session?')) {
      URL.revokeObjectURL(session.voiceUrl);
      setSessions(prev => prev.filter(s => s !== session));
      if (selectedSession === session) {
        setSelectedSession(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      sessions.forEach(session => URL.revokeObjectURL(session.voiceUrl));
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
      stopPreview();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
        <Sliders className="w-6 h-6 mr-2" />
        Voice + Chord Mixer
      </h3>
      <p className="text-blue-200 text-sm mb-6">
        Record your voice while chords play, then mix them together with full control
      </p>

      <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
        <h4 className="text-white font-bold mb-3 flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Step 1: Record Voice + Capture Chords
        </h4>

        {!isRecording ? (
          <>
            <button
              onClick={startRecording}
              disabled={!isPlaying}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
            {!isPlaying && (
              <p className="text-yellow-300 text-sm mt-2">⚠️ Start playing music first!</p>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-red-500/30 rounded-full h-2 overflow-hidden">
                <div className="bg-red-500 h-full animate-pulse" style={{ width: '100%' }} />
              </div>
              <span className="text-white font-mono font-bold">{formatTime(recordingDuration)}</span>
            </div>

            <div className="text-blue-200 text-sm">
              🎵 Current chord: <span className="text-white font-bold">{currentChord || 'Playing...'}</span>
            </div>
          </div>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
          <h4 className="text-white font-bold mb-3">Your Recording Sessions</h4>
          <div className="space-y-2">
            {sessions.map((session, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSession === session
                    ? 'bg-purple-500/20 border-purple-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <div>
                  <div className="text-white font-medium">
                    Session {sessions.length - idx}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {formatTime(session.totalDuration)} • {session.chordSnapshots.length} chords
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session);
                  }}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSession && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-4">
          <h4 className="text-white font-bold mb-3 flex items-center">
            <Sliders className="w-5 h-5 mr-2" />
            Step 2: Mix Voice & Chords
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-300 text-sm font-medium flex items-center">
                  <Mic className="w-4 h-4 mr-1" />
                  Voice Volume
                </label>
                <span className="text-white font-bold">{voiceVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-300 text-sm font-medium flex items-center">
                  <Music2 className="w-4 h-4 mr-1" />
                  Music Volume
                </label>
                <span className="text-white font-bold">{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
            <button
              onClick={isPlayingPreview ? stopPreview : playPreview}
              disabled={isMixing}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isPlayingPreview
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-400 hover:to-gray-500'
                  : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
              } ${isMixing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlayingPreview ? 'Stop' : 'Preview'}</span>
            </button>

            <button
              onClick={exportMix}
              disabled={isMixing}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isMixing
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-wait'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>{isMixing ? `Mixing... ${mixProgress}%` : 'Export Mix'}</span>
            </button>
          </div>

          <div className="text-yellow-200 text-xs bg-yellow-900/20 rounded p-2 border border-yellow-500/30">
            💡 Tip: Preview to test your mix, then Export when you're happy with the balance!
          </div>
        </div>
      )}
    </div>
  );
}
