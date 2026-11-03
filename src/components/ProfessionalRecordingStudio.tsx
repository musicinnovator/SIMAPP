import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DualTrackRecorder } from './DualTrackRecorder';
import { MixingStudio } from './MixingStudio';
import { ScriptureDisplay } from './recording/ScriptureDisplay';
import { useDualTrackRecordings } from '../hooks/useDualTrackRecordings';

interface ProfessionalRecordingStudioProps {
  isPlaying: boolean;
  onClose: () => void;
  getMusicDestination: () => AudioNode | null;
  scriptureText?: string;
  // ADDITIVE: Optional musicMachineRef for auto-play support
  musicMachineRef?: React.RefObject<{ playMusic: () => Promise<void> }>;
}

export function ProfessionalRecordingStudio({
  isPlaying,
  onClose,
  getMusicDestination,
  scriptureText = 'No scripture text provided',
  musicMachineRef
}: ProfessionalRecordingStudioProps) {
  const [vocalBlob, setVocalBlob] = useState<Blob | null>(null);
  const [musicBlob, setMusicBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showMixingStudio, setShowMixingStudio] = useState(false);

  const { saveRecording } = useDualTrackRecordings();

  const handleStartRecording = () => {
    console.log('Recording started');
  };

  const handleStopRecording = (vocal: Blob, music: Blob, duration: number) => {
    console.log('Recording stopped', { vocal, music, duration });
    setVocalBlob(vocal);
    setMusicBlob(music);
    setRecordingDuration(duration);
    setShowMixingStudio(true);
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      const saved = await saveRecording({
        project_name: `Scripture Recording - ${new Date().toLocaleString()}`,
        vocal_volume: projectData.vocalVolume,
        music_volume: projectData.musicVolume,
        duration: projectData.duration,
        metadata: {
          timestamp: projectData.timestamp,
          vocalBlob: projectData.vocalBlob ? 'recorded' : 'missing',
          musicBlob: projectData.musicBlob ? 'recorded' : 'missing'
        }
      });

      if (saved) {
        alert(`✅ Project saved successfully!\n\nProject ID: ${saved.id}\nVocal Volume: ${saved.vocal_volume}%\nMusic Volume: ${saved.music_volume}%\nDuration: ${saved.duration}s`);
      } else {
        alert('❌ Failed to save project. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`❌ Error saving project: ${error}`);
    }
  };

  const handleExport = (combinedBlob: Blob) => {
    console.log('Exported combined audio', combinedBlob);
  };

  const handleCloseMixingStudio = () => {
    setShowMixingStudio(false);
    setVocalBlob(null);
    setMusicBlob(null);
    setRecordingDuration(0);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-40 flex">
      {/* LEFT: Scripture Text (35%) */}
      <div className="w-[35%] border-r border-gray-700">
        <ScriptureDisplay
          text={scriptureText}
          autoScroll={false}
          fontSize="medium"
          highlightEnabled={false}
        />
      </div>

      {/* RIGHT: Recording Interface (65%) */}
      <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black min-h-full border-l border-purple-500/30">
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-indigo-900 p-6 border-b border-purple-500/30 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">🎙️ Professional Recording Studio</h2>
              <p className="text-purple-200 text-sm">Record vocals and music on separate tracks for perfect mixing</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showMixingStudio ? (
            <DualTrackRecorder
              isPlaying={isPlaying}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              getMusicDestination={getMusicDestination}
              musicMachineRef={musicMachineRef}
            />
          ) : (
            vocalBlob && musicBlob && (
              <MixingStudio
                vocalBlob={vocalBlob}
                musicBlob={musicBlob}
                duration={recordingDuration}
                onClose={handleCloseMixingStudio}
                onSaveProject={handleSaveProject}
                onExport={handleExport}
              />
            )
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
