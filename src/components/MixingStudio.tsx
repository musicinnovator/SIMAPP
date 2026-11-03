import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Share2, Save, Trash2, RotateCcw } from 'lucide-react';
import { TrackWaveform } from './TrackWaveform';
import { ExportManager } from './ExportManager';

interface Track {
  name: string;
  blob: Blob;
  url: string;
  color: string;
  icon: React.ReactNode;
}

interface MixingStudioProps {
  vocalBlob: Blob;
  musicBlob: Blob;
  duration: number;
  onClose: () => void;
  onSaveProject: (projectData: any) => void;
  onExport: (combinedBlob: Blob) => void;
}

export function MixingStudio({
  vocalBlob,
  musicBlob,
  duration,
  onClose,
  onSaveProject,
  onExport
}: MixingStudioProps) {
  const [vocalVolume, setVocalVolume] = useState(75);
  const [musicVolume, setMusicVolume] = useState(80);
  const [vocalMuted, setVocalMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [showExportManager, setShowExportManager] = useState(false);

  const vocalAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const vocalGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setupAudio();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (vocalGainRef.current) {
      vocalGainRef.current.gain.value = vocalMuted ? 0 : vocalVolume / 100;
    }
  }, [vocalVolume, vocalMuted]);

  useEffect(() => {
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = musicMuted ? 0 : musicVolume / 100;
    }
  }, [musicVolume, musicMuted]);

  const setupAudio = async () => {
    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const vocalUrl = URL.createObjectURL(vocalBlob);
      const musicUrl = URL.createObjectURL(musicBlob);

      const vocalAudio = new Audio(vocalUrl);
      const musicAudio = new Audio(musicUrl);

      vocalAudioRef.current = vocalAudio;
      musicAudioRef.current = musicAudio;

      const vocalSource = audioContext.createMediaElementSource(vocalAudio);
      const musicSource = audioContext.createMediaElementSource(musicAudio);

      const vocalGain = audioContext.createGain();
      const musicGain = audioContext.createGain();

      vocalGain.gain.value = vocalVolume / 100;
      musicGain.gain.value = musicVolume / 100;

      vocalGainRef.current = vocalGain;
      musicGainRef.current = musicGain;

      vocalSource.connect(vocalGain).connect(audioContext.destination);
      musicSource.connect(musicGain).connect(audioContext.destination);

      vocalAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    } catch (error) {
      console.error('Failed to setup audio:', error);
    }
  };

  const cleanup = () => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
    }
    if (vocalAudioRef.current) {
      vocalAudioRef.current.pause();
      URL.revokeObjectURL(vocalAudioRef.current.src);
    }
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      URL.revokeObjectURL(musicAudioRef.current.src);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const togglePlayback = async () => {
    if (!vocalAudioRef.current || !musicAudioRef.current) return;

    if (isPlaying) {
      vocalAudioRef.current.pause();
      musicAudioRef.current.pause();
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      setIsPlaying(false);
    } else {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      vocalAudioRef.current.currentTime = currentTime;
      musicAudioRef.current.currentTime = currentTime;

      vocalAudioRef.current.play();
      musicAudioRef.current.play();
      setIsPlaying(true);

      playbackIntervalRef.current = setInterval(() => {
        if (vocalAudioRef.current) {
          setCurrentTime(vocalAudioRef.current.currentTime);
        }
      }, 100);
    }
  };

  const resetPlayback = () => {
    if (vocalAudioRef.current) vocalAudioRef.current.currentTime = 0;
    if (musicAudioRef.current) musicAudioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
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
      onExport(combinedBlob);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export audio. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    const projectData = {
      vocalBlob,
      musicBlob,
      vocalVolume,
      musicVolume,
      duration,
      timestamp: Date.now()
    };
    onSaveProject(projectData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 border-b border-gray-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">🎚️ Mixing Studio</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Playback Controls */}
          <div className="bg-black/30 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayback}
                  className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <button
                  onClick={resetPlayback}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
              <div className="text-white font-mono text-lg">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Vocal Track */}
          <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/20 rounded-lg p-6 border border-pink-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-pink-200">🎤 Vocal Track</h3>
              <button
                onClick={() => setVocalMuted(!vocalMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  vocalMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {vocalMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
            </div>
            <div className="mb-4">
              <TrackWaveform audioBlob={vocalBlob} color="#ec4899" height={60} />
            </div>
            <div className="flex items-center space-x-4">
              <Volume2 className="w-5 h-5 text-pink-300 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={vocalVolume}
                onChange={(e) => setVocalVolume(Number(e.target.value))}
                className="flex-1 h-3 bg-gray-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${vocalVolume}%, #374151 ${vocalVolume}%, #374151 100%)`
                }}
              />
              <span className="text-pink-200 font-mono w-12 text-right">{vocalVolume}%</span>
            </div>
          </div>

          {/* Music Track */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-lg p-6 border border-blue-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-200">🎹 Music Track</h3>
              <button
                onClick={() => setMusicMuted(!musicMuted)}
                className={`p-2 rounded-lg transition-colors ${
                  musicMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {musicMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
            </div>
            <div className="mb-4">
              <TrackWaveform audioBlob={musicBlob} color="#3b82f6" height={60} />
            </div>
            <div className="flex items-center space-x-4">
              <Volume2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="flex-1 h-3 bg-gray-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${musicVolume}%, #374151 ${musicVolume}%, #374151 100%)`
                }}
              />
              <span className="text-blue-200 font-mono w-12 text-right">{musicVolume}%</span>
            </div>
          </div>

          {/* Export Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 rounded-lg text-white transition-all duration-200 shadow-lg"
            >
              <Download className="w-8 h-8 mb-2" />
              <span className="font-bold">{isExporting ? 'Exporting...' : 'Download'}</span>
              <span className="text-xs opacity-75">Combined</span>
            </button>

            <button
              onClick={handleSave}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg text-white transition-all duration-200 shadow-lg"
            >
              <Save className="w-8 h-8 mb-2" />
              <span className="font-bold">Save</span>
              <span className="text-xs opacity-75">Project</span>
            </button>

            <button
              onClick={onClose}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg text-white transition-all duration-200 shadow-lg"
            >
              <Trash2 className="w-8 h-8 mb-2" />
              <span className="font-bold">Discard</span>
              <span className="text-xs opacity-75">Close</span>
            </button>
          </div>
        </div>
      </div>

      {showExportManager && exportedBlob && (
        <ExportManager
          combinedBlob={exportedBlob}
          projectName="Scripture Recording"
          onClose={() => setShowExportManager(false)}
        />
      )}
    </div>
  );
}
