import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, Play, Music } from 'lucide-react';
import * as Tone from 'tone';

interface AudioClip {
  id: string;
  lyric: string;
  notes: string[];
  duration: string;
}

interface LyricAudioMatchingProps {
  scripture: {
    text: string;
    key: string;
    tempo: number;
  };
  onComplete: (score: number) => void;
}

export function LyricAudioMatching({ scripture, onComplete }: LyricAudioMatchingProps) {
  const [clips, setClips] = useState<AudioClip[]>([]);
  const [shuffledLyrics, setShuffledLyrics] = useState<AudioClip[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [selectedLyric, setSelectedLyric] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: boolean }>({});
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    const lines = scripture.text.split('\n').filter(line => line.trim());
    const audioClips: AudioClip[] = lines.slice(0, 4).map((line, idx) => ({
      id: `clip-${idx}`,
      lyric: line.trim(),
      notes: generateNotesForLine(idx),
      duration: '2n'
    }));

    setClips(audioClips);
    setShuffledLyrics([...audioClips].sort(() => Math.random() - 0.5));

    return () => {
      newSynth.dispose();
    };
  }, [scripture]);

  const generateNotesForLine = (lineIndex: number): string[] => {
    const baseNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    const patterns = [
      ['C4', 'E4', 'G4', 'C5'],
      ['G4', 'F4', 'E4', 'D4'],
      ['E4', 'G4', 'A4', 'G4'],
      ['A4', 'G4', 'F4', 'E4']
    ];
    return patterns[lineIndex % patterns.length];
  };

  const playClip = async (clip: AudioClip) => {
    if (!synth || isPlaying) return;

    setIsPlaying(clip.id);
    await Tone.start();

    const now = Tone.now();
    clip.notes.forEach((note, idx) => {
      synth.triggerAttackRelease(note, '8n', now + idx * 0.3);
    });

    setTimeout(() => setIsPlaying(null), clip.notes.length * 300 + 500);
  };

  const handleAudioSelect = (clipId: string) => {
    if (matches[clipId]) return;
    setSelectedAudio(clipId);

    if (selectedLyric) {
      checkMatch(clipId, selectedLyric);
    }
  };

  const handleLyricSelect = (clipId: string) => {
    if (Object.values(matches).includes(clipId)) return;
    setSelectedLyric(clipId);

    if (selectedAudio) {
      checkMatch(selectedAudio, clipId);
    }
  };

  const checkMatch = (audioId: string, lyricId: string) => {
    const isCorrect = audioId === lyricId;

    if (isCorrect) {
      setMatches(prev => ({ ...prev, [audioId]: lyricId }));
      setFeedback(prev => ({ ...prev, [audioId]: true }));
    } else {
      setFeedback(prev => ({ ...prev, [audioId]: false }));
      setTimeout(() => {
        setFeedback(prev => {
          const newFeedback = { ...prev };
          delete newFeedback[audioId];
          return newFeedback;
        });
      }, 1000);
    }

    setSelectedAudio(null);
    setSelectedLyric(null);

    if (Object.keys(matches).length + (isCorrect ? 1 : 0) === clips.length) {
      const correctMatches = Object.keys(matches).length + (isCorrect ? 1 : 0);
      const score = (correctMatches / clips.length) * 100;
      setTimeout(() => onComplete(score), 1500);
    }
  };

  const isMatched = (clipId: string) => {
    return matches[clipId] || Object.values(matches).includes(clipId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Music className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Lyric-Audio Matching</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Listen to each audio clip and match it with the correct lyric
        </p>
        <div className="text-blue-200">
          Matched: {Object.keys(matches).length} / {clips.length}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Audio Clips */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-green-400" />
            Audio Clips
          </h3>
          {clips.map((clip) => (
            <div
              key={clip.id}
              onClick={() => !isMatched(clip.id) && handleAudioSelect(clip.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                isMatched(clip.id)
                  ? 'bg-green-500/20 border-green-500 opacity-50'
                  : selectedAudio === clip.id
                  ? 'bg-blue-500/30 border-blue-400 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playClip(clip);
                    }}
                    disabled={isPlaying === clip.id}
                    className={`p-3 rounded-full transition-all ${
                      isPlaying === clip.id
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    <Play className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-white font-medium">
                    Audio Clip {parseInt(clip.id.split('-')[1]) + 1}
                  </span>
                </div>
                {feedback[clip.id] !== undefined && (
                  <div>
                    {feedback[clip.id] ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lyrics */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Music className="w-6 h-6 text-purple-400" />
            Lyrics
          </h3>
          {shuffledLyrics.map((clip) => (
            <div
              key={`lyric-${clip.id}`}
              onClick={() => !isMatched(clip.id) && handleLyricSelect(clip.id)}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                isMatched(clip.id)
                  ? 'bg-green-500/20 border-green-500 opacity-50'
                  : selectedLyric === clip.id
                  ? 'bg-purple-500/30 border-purple-400 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
              }`}
            >
              <p className="text-white leading-relaxed">{clip.lyric}</p>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(matches).length > 0 && (
        <div className="text-center">
          <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-xl px-6 py-3">
            <p className="text-green-300 font-semibold">
              Great job! Keep matching!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
