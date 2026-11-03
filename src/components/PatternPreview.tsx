import React, { useRef, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import {
  BlockPattern,
  ArpeggiatedPattern,
  BrokenPattern
} from '../types/voicingPatterns';
import { globalVoicingEngine } from '../utils/voicingEngine';

interface PatternPreviewProps {
  pattern: BlockPattern | ArpeggiatedPattern | BrokenPattern;
  patternType: 'block' | 'arpeggiated' | 'broken';
  bpm?: number;
  instrument?: any;
  onPlaybackComplete?: () => void;
}

export default function PatternPreview({
  pattern,
  patternType,
  bpm = 120,
  instrument,
  onPlaybackComplete
}: PatternPreviewProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  const stopPlayback = () => {
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];
    setIsPlaying(false);
  };

  const playPreview = () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    if (!instrument) {
      console.warn('No instrument available for preview');
      return;
    }

    setIsPlaying(true);

    const testNotes = ['C4', 'E4', 'G4', 'C5'];

    try {
      const scheduledNotes = globalVoicingEngine.validateAndSchedule(
        patternType,
        pattern,
        testNotes,
        0,
        bpm,
        0.7
      );

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const startTime = audioContext.currentTime + 0.1;

      scheduledNotes.forEach((scheduledNote) => {
        const absoluteTime = (startTime + scheduledNote.startTime) * 1000;
        const delay = absoluteTime - Date.now();

        if (delay > 0) {
          const timeoutId = window.setTimeout(() => {
            try {
              instrument.play(scheduledNote.note, audioContext.currentTime, {
                duration: scheduledNote.duration,
                gain: scheduledNote.velocity
              });
            } catch (error) {
              console.error('Error playing note:', error);
            }
          }, delay);

          timeoutsRef.current.push(timeoutId);
        }
      });

      const maxDuration = Math.max(...scheduledNotes.map(n => n.startTime + n.duration));
      const completionTimeout = window.setTimeout(() => {
        setIsPlaying(false);
        if (onPlaybackComplete) {
          onPlaybackComplete();
        }
      }, (maxDuration * 1000) + 500);

      timeoutsRef.current.push(completionTimeout);
    } catch (error) {
      console.error('Error in pattern preview:', error);
      stopPlayback();
    }
  };

  const renderPatternVisualization = () => {
    if (patternType === 'block' && 'durations' in pattern) {
      const blockPattern = pattern as BlockPattern;
      return (
        <div className="mt-3 bg-gray-50 p-3 rounded">
          <div className="text-xs font-medium text-gray-600 mb-2">Block Pattern</div>
          <div className="flex gap-1">
            {blockPattern.durations.map((duration, idx) => (
              <div
                key={idx}
                className="bg-blue-500 rounded"
                style={{
                  width: `${(duration.beats / 4) * 100}%`,
                  height: '24px'
                }}
                title={`${duration.subdivision} (${duration.beats} beats)`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Time Signature: {blockPattern.timeSignature}
          </div>
        </div>
      );
    }

    if (patternType === 'arpeggiated' && 'sequence' in pattern) {
      const arpPattern = pattern as ArpeggiatedPattern;
      return (
        <div className="mt-3 bg-gray-50 p-3 rounded">
          <div className="text-xs font-medium text-gray-600 mb-2">Arpeggio Sequence</div>
          <div className="flex gap-2 flex-wrap">
            {arpPattern.sequence.split('-').map((note, idx) => (
              <div
                key={idx}
                className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm"
              >
                {note}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Subdivision: {arpPattern.subdivision}
            {arpPattern.swingAmount && ` | Swing: ${(arpPattern.swingAmount * 100).toFixed(0)}%`}
          </div>
        </div>
      );
    }

    if (patternType === 'broken' && 'rhythmTemplate' in pattern) {
      const brokenPattern = pattern as BrokenPattern;
      return (
        <div className="mt-3 bg-gray-50 p-3 rounded">
          <div className="text-xs font-medium text-gray-600 mb-2">Broken Rhythm</div>
          <div className="space-y-1">
            {brokenPattern.rhythmTemplate.map((rhythm, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="bg-orange-500 rounded"
                  style={{
                    width: `${rhythm.beats * 100}px`,
                    height: '20px'
                  }}
                />
                <span className="text-xs text-gray-600">
                  {rhythm.subdivision} (accent: {brokenPattern.accentPlacement[idx]?.toFixed(1)})
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
        <button
          onClick={playPreview}
          disabled={!instrument}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4" />
              <span className="text-sm font-medium">Stop</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Preview</span>
            </>
          )}
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>

      {renderPatternVisualization()}

      {!instrument && (
        <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded">
          No instrument loaded. Preview will be available once an instrument is selected.
        </div>
      )}
    </div>
  );
}
