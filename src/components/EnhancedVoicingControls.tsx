import React from 'react';
import { Music, Waves, Zap, Layers, Guitar } from 'lucide-react';
import {
  BLOCK_PATTERNS,
  ARPEGGIATED_PATTERNS,
  BROKEN_PATTERNS,
  STRUM_PATTERNS,
  BROKEN_CHORD_PATTERNS
} from '../data/voicingPatternLibrary';

interface EnhancedVoicingControlsProps {
  voicingTechnique: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial';
  selectedBlockPatternId: string;
  selectedArpPatternId: string;
  selectedStrumPatternId: string;
  selectedBrokenPatternId: string;
  selectedBrokenChordPatternId: string;
  partialMode: string;
  onBlockPatternChange: (id: string) => void;
  onArpPatternChange: (id: string) => void;
  onStrumPatternChange: (id: string) => void;
  onBrokenPatternChange: (id: string) => void;
  onBrokenChordPatternChange: (id: string) => void;
  onPartialModeChange: (mode: string) => void;
}

export function EnhancedVoicingControls({
  voicingTechnique,
  selectedBlockPatternId,
  selectedArpPatternId,
  selectedStrumPatternId,
  selectedBrokenPatternId,
  selectedBrokenChordPatternId,
  partialMode,
  onBlockPatternChange,
  onArpPatternChange,
  onStrumPatternChange,
  onBrokenPatternChange,
  onBrokenChordPatternChange,
  onPartialModeChange
}: EnhancedVoicingControlsProps) {

  // Group block patterns by time signature
  const blockPatternsByTime = {
    '4/4': BLOCK_PATTERNS.filter(p => p.timeSignature === '4/4'),
    '3/4': BLOCK_PATTERNS.filter(p => p.timeSignature === '3/4'),
    '2/4': BLOCK_PATTERNS.filter(p => p.timeSignature === '2/4'),
    '6/8': BLOCK_PATTERNS.filter(p => p.timeSignature === '6/8')
  };

  // Group arpeggio patterns by subdivision
  const arpPatternsBySubdivision = {
    'Sixteenth Notes': ARPEGGIATED_PATTERNS.filter(p => p.subdivision === 'sixteenth' && !p.sequence.includes('8')),
    'Eighth Notes': ARPEGGIATED_PATTERNS.filter(p => p.subdivision === 'eighth'),
    'Octave Patterns': ARPEGGIATED_PATTERNS.filter(p => p.sequence.includes('8')),
    'Triplets': ARPEGGIATED_PATTERNS.filter(p => p.subdivision === 'triplet-eighth'),
    'Special': ARPEGGIATED_PATTERNS.filter(p => p.swingAmount || p.velocityVariation)
  };

  // Group broken patterns by style
  const brokenPatternsByStyle = {
    'Standard Rhythms': BROKEN_PATTERNS.filter(p =>
      !p.microTimingOffset && !p.dropProbability && !p.id.includes('waltz')
    ).slice(0, 10),
    'Expressive': BROKEN_PATTERNS.filter(p => p.microTimingOffset),
    'Random': BROKEN_PATTERNS.filter(p => p.dropProbability),
    'Dance': BROKEN_PATTERNS.filter(p => p.id.includes('waltz'))
  };

  // Group strum patterns by direction/style
  const strumPatternsByStyle = {
    'Basic Strums': STRUM_PATTERNS.filter(p =>
      p.id.includes('down-quarter') || p.id.includes('up-eighth') || p.id.includes('alternating') ||
      p.id.includes('down-whole') || p.id.includes('down-half') || p.id.includes('down-eighth-continuous') ||
      p.id.includes('up-continuous') || p.id.includes('down-down-up') || p.id.includes('down-up-up-down') ||
      p.id.includes('down-rest') || p.id.includes('accented-down') || p.id.includes('down-triplet') ||
      p.id.includes('alternating-sixteenth') || p.id.includes('up-quarter')
    ),
    'Folk/Acoustic': STRUM_PATTERNS.filter(p =>
      p.id.includes('folk') || p.id.includes('travis') || p.id.includes('fingerstyle') || p.id.includes('fingerpick')
    ),
    // DISABLED CATEGORIES (patterns remain in library for backward compatibility)
    // 'Latin/World': STRUM_PATTERNS.filter(p =>
    //   p.id.includes('bossa') || p.id.includes('reggae') || p.id.includes('latin') || p.id.includes('flamenco')
    // ),
    // 'Jazz/Blues': STRUM_PATTERNS.filter(p =>
    //   p.id.includes('jazz') || p.id.includes('blues') || p.id.includes('shuffle') || p.id.includes('swing')
    // ),
    // 'Rock/Funk': STRUM_PATTERNS.filter(p =>
    //   p.id.includes('muted') || p.id.includes('funk') || p.id.includes('metal') || p.id.includes('power')
    // ),
    'Special': STRUM_PATTERNS.filter(p =>
      p.id.includes('ska') || p.id.includes('waltz') || p.id.includes('country') || p.id.includes('tremolo')
    )
  };

  // Group broken chord patterns by first note
  const brokenChordPatternsByNote = {
    'From Root': BROKEN_CHORD_PATTERNS.filter(p => p.firstNote === 'root'),
    'From Third': BROKEN_CHORD_PATTERNS.filter(p => p.firstNote === 'third'),
    'From Fifth': BROKEN_CHORD_PATTERNS.filter(p => p.firstNote === 'fifth'),
    'From Seventh': BROKEN_CHORD_PATTERNS.filter(p => p.firstNote === 'seventh'),
    'Extensions': BROKEN_CHORD_PATTERNS.filter(p =>
      p.secondNotePair.includes('ninth') || p.secondNotePair.includes('eleventh') || p.secondNotePair.includes('thirteenth')
    )
  };

  const partialModes = [
    { id: 'root-third', name: 'Root + Third', icon: '1+3', description: 'Light harmony' },
    { id: 'root-fifth', name: 'Root + Fifth', icon: '1+5', description: 'Power chord' },
    { id: 'third-fifth', name: 'Third + Fifth', icon: '3+5', description: 'Upper structure' },
    { id: 'root-only', name: 'Root Only', icon: '1', description: 'Bass emphasis' },
    { id: 'shell', name: 'Shell Voicing', icon: '1-3-7', description: 'Jazz style' }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-white/20 rounded-xl p-5 mt-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/20">
          {voicingTechnique === 'block' && <Music className="w-5 h-5 text-purple-400" />}
          {voicingTechnique === 'arpeggiated' && <Waves className="w-5 h-5 text-blue-400" />}
          {voicingTechnique === 'strum' && <Guitar className="w-5 h-5 text-orange-400" />}
          {voicingTechnique === 'broken' && <Zap className="w-5 h-5 text-yellow-400" />}
          {voicingTechnique === 'partial' && <Layers className="w-5 h-5 text-green-400" />}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">
            {voicingTechnique === 'block' && 'Block Voicing Patterns'}
            {voicingTechnique === 'arpeggiated' && 'Arpeggio Patterns'}
            {voicingTechnique === 'strum' && 'Strum Patterns'}
            {voicingTechnique === 'broken' && 'Broken Chord Patterns'}
            {voicingTechnique === 'partial' && 'Partial Voicing Mode'}
          </h3>
          <p className="text-gray-400 text-sm">
            {voicingTechnique === 'block' && 'Select rhythmic pattern - ONLY works in BLOCK mode'}
            {voicingTechnique === 'arpeggiated' && 'Choose note sequence - ONLY works in ARPEGGIATED mode'}
            {voicingTechnique === 'strum' && 'Guitar-style strum patterns - ONLY works in STRUM mode'}
            {voicingTechnique === 'broken' && 'Single note + two-note combinations - ONLY works in BROKEN mode'}
            {voicingTechnique === 'partial' && 'Select which notes to play - ONLY works in PARTIAL mode'}
          </p>
        </div>
        <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/20">
          <div className="text-xs text-gray-400">Active Mode</div>
          <div className="text-white font-bold uppercase text-sm">{voicingTechnique}</div>
        </div>
      </div>

      {/* Block Patterns */}
      {voicingTechnique === 'block' && (
        <div className="space-y-4">
          {Object.entries(blockPatternsByTime).map(([timeSignature, patterns]) => (
            patterns.length > 0 && (
              <div key={timeSignature}>
                <h4 className="text-purple-300 text-sm font-semibold mb-2">{timeSignature} Time</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {patterns.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        console.log('[Block Pattern] Selected:', pattern.name, pattern.id);
                        onBlockPatternChange(pattern.id);
                      }}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedBlockPatternId === pattern.id
                          ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="text-white font-medium text-sm mb-1">{pattern.name}</div>
                      <div className="text-gray-400 text-xs">{pattern.description}</div>
                      <div className="text-purple-300 text-xs mt-1">{pattern.durations.length} notes</div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Arpeggiated Patterns */}
      {voicingTechnique === 'arpeggiated' && (
        <div className="space-y-4">
          {Object.entries(arpPatternsBySubdivision).map(([category, patterns]) => (
            patterns.length > 0 && (
              <div key={category}>
                <h4 className="text-blue-300 text-sm font-semibold mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {patterns.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        console.log('[Arpeggio Pattern] Selected:', pattern.name, pattern.sequence, pattern.id);
                        onArpPatternChange(pattern.id);
                      }}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedArpPatternId === pattern.id
                          ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50'
                      }`}
                    >
                      <div className="text-white font-medium text-sm mb-1">{pattern.name}</div>
                      <div className="text-gray-400 text-xs mb-1">{pattern.description}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-blue-300 text-xs font-mono">{pattern.sequence}</code>
                        {pattern.swingAmount && (
                          <span className="text-xs text-yellow-400">Swing</span>
                        )}
                        {pattern.velocityVariation && (
                          <span className="text-xs text-green-400">Dynamic</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Strum Patterns */}
      {voicingTechnique === 'strum' && (
        <div className="space-y-4">
          {Object.entries(strumPatternsByStyle).map(([category, patterns]) => (
            patterns.length > 0 && (
              <div key={category}>
                <h4 className="text-orange-300 text-sm font-semibold mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {patterns.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        console.log('[Strum Pattern] Selected:', pattern.name, pattern.id);
                        onStrumPatternChange(pattern.id);
                      }}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedStrumPatternId === pattern.id
                          ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-400/50'
                      }`}
                    >
                      <div className="text-white font-medium text-sm mb-1">{pattern.name}</div>
                      <div className="text-gray-400 text-xs mb-1">{pattern.description}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-300 uppercase">{pattern.direction}</span>
                        <span className="text-gray-500">{pattern.articulation}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Broken Chord Patterns - NEW SYSTEM */}
      {voicingTechnique === 'broken' && (
        <div className="space-y-4">
          {Object.entries(brokenChordPatternsByNote).map(([category, patterns]) => (
            patterns.length > 0 && (
              <div key={category}>
                <h4 className="text-yellow-300 text-sm font-semibold mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {patterns.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        console.log('[Broken Chord Pattern] Selected:', pattern.name, pattern.id);
                        onBrokenChordPatternChange(pattern.id);
                      }}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedBrokenChordPatternId === pattern.id
                          ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-400/50'
                      }`}
                    >
                      <div className="text-white font-medium text-sm mb-1">{pattern.name}</div>
                      <div className="text-gray-400 text-xs mb-1">{pattern.description}</div>
                      <div className="text-yellow-300 text-xs">{pattern.rhythmTemplate.length} events</div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Old Broken Patterns - DEPRECATED */}
      {voicingTechnique === 'broken-old' && (
        <div className="space-y-4">
          {Object.entries(brokenPatternsByStyle).map(([category, patterns]) => (
            patterns.length > 0 && (
              <div key={category}>
                <h4 className="text-yellow-300 text-sm font-semibold mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {patterns.map(pattern => (
                    <button
                      key={pattern.id}
                      onClick={() => {
                        console.log('[Broken Pattern] Selected:', pattern.name, pattern.id);
                        onBrokenPatternChange(pattern.id);
                      }}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedBrokenPatternId === pattern.id
                          ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-400/50'
                      }`}
                    >
                      <div className="text-white font-medium text-sm mb-1">{pattern.name}</div>
                      <div className="text-gray-400 text-xs mb-1">{pattern.description}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-300">{pattern.rhythmTemplate.length} beats</span>
                        {pattern.microTimingOffset && (
                          <span className="text-purple-400">Expressive</span>
                        )}
                        {pattern.dropProbability && (
                          <span className="text-red-400">Random</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Partial Modes */}
      {voicingTechnique === 'partial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {partialModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                console.log('[Partial Mode] Selected:', mode.name, mode.id);
                onPartialModeChange(mode.id);
              }}
              className={`p-4 rounded-lg border transition-all text-left ${
                partialMode === mode.id
                  ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-400/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-bold text-lg">{mode.name}</div>
                <code className="text-green-300 font-mono text-sm bg-black/30 px-2 py-1 rounded">
                  {mode.icon}
                </code>
              </div>
              <div className="text-gray-400 text-sm">{mode.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Current Selection Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-sm text-gray-400">
          <span className="text-purple-300">Selected:</span>{' '}
          {voicingTechnique === 'block' && (
            BLOCK_PATTERNS.find(p => p.id === selectedBlockPatternId)?.name || 'None'
          )}
          {voicingTechnique === 'arpeggiated' && (
            <>
              {ARPEGGIATED_PATTERNS.find(p => p.id === selectedArpPatternId)?.name || 'None'}
              {' '}
              <code className="text-blue-300 font-mono">
                ({ARPEGGIATED_PATTERNS.find(p => p.id === selectedArpPatternId)?.sequence})
              </code>
            </>
          )}
          {voicingTechnique === 'broken' && (
            BROKEN_PATTERNS.find(p => p.id === selectedBrokenPatternId)?.name || 'None'
          )}
          {voicingTechnique === 'partial' && (
            partialModes.find(m => m.id === partialMode)?.name || 'None'
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedVoicingControls;
