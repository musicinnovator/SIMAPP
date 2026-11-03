import Soundfont from 'soundfont-player';
import * as Tone from 'tone';
import { BLOCK_PATTERNS, STRUM_PATTERNS, BROKEN_CHORD_PATTERNS } from '../data/voicingPatternLibrary';

export interface InstrumentConfig {
  name: string;
  soundfontName: string;
  category: string;
  description: string;
}

export const INSTRUMENTS: Record<string, InstrumentConfig> = {
  piano: {
    name: 'Acoustic Grand Piano',
    soundfontName: 'acoustic_grand_piano',
    category: 'Keyboard',
    description: 'Rich, natural piano sound'
  },
  brightPiano: {
    name: 'Bright Acoustic Piano',
    soundfontName: 'bright_acoustic_piano',
    category: 'Keyboard',
    description: 'Crisp, clear piano tone'
  },
  electricPiano: {
    name: 'Electric Piano',
    soundfontName: 'electric_piano_1',
    category: 'Keyboard',
    description: 'Warm electric piano'
  },
  organ: {
    name: 'Church Organ',
    soundfontName: 'church_organ',
    category: 'Organ',
    description: 'Majestic church organ'
  },
  rockOrgan: {
    name: 'Rock Organ',
    soundfontName: 'rock_organ',
    category: 'Organ',
    description: 'Powerful rock organ sound'
  },
  strings: {
    name: 'String Ensemble',
    soundfontName: 'string_ensemble_1',
    category: 'Strings',
    description: 'Warm orchestral strings'
  },
  violin: {
    name: 'Violin',
    soundfontName: 'violin',
    category: 'Strings',
    description: 'Expressive solo violin'
  },
  cello: {
    name: 'Cello',
    soundfontName: 'cello',
    category: 'Strings',
    description: 'Rich, deep cello tone'
  },
  choir: {
    name: 'Choir Aahs',
    soundfontName: 'choir_aahs',
    category: 'Voice',
    description: 'Angelic choir sound'
  },
  voiceOohs: {
    name: 'Voice Oohs',
    soundfontName: 'voice_oohs',
    category: 'Voice',
    description: 'Smooth vocal ensemble'
  },
  brass: {
    name: 'Brass Section',
    soundfontName: 'brass_section',
    category: 'Brass',
    description: 'Full brass ensemble'
  },
  trumpet: {
    name: 'Trumpet',
    soundfontName: 'trumpet',
    category: 'Brass',
    description: 'Bright trumpet sound'
  },
  frenchHorn: {
    name: 'French Horn',
    soundfontName: 'french_horn',
    category: 'Brass',
    description: 'Warm, noble horn'
  },
  bell: {
    name: 'Tubular Bells',
    soundfontName: 'tubular_bells',
    category: 'Percussion',
    description: 'Clear bell chimes'
  },
  vibraphone: {
    name: 'Vibraphone',
    soundfontName: 'vibraphone',
    category: 'Percussion',
    description: 'Mellow mallet instrument'
  },
  harp: {
    name: 'Orchestral Harp',
    soundfontName: 'orchestral_harp',
    category: 'Strings',
    description: 'Delicate harp plucks'
  },
  guitar: {
    name: 'Acoustic Guitar',
    soundfontName: 'acoustic_guitar_nylon',
    category: 'Guitar',
    description: 'Classical nylon guitar'
  },
  pad: {
    name: 'Warm Pad',
    soundfontName: 'pad_2_warm',
    category: 'Synth',
    description: 'Atmospheric synth pad'
  }
};

export class SoundFontManager {
  private audioContext: AudioContext | null = null;
  private currentInstrument: any = null;
  private loadedInstruments: Map<string, any> = new Map();
  private isLoading: boolean = false;
  private effectsInputNode: GainNode | null = null;
  private currentTempo: number = 80;
  private currentBPM: number = 80;  // NEW: Track actual BPM for rhythm calculations
  private isPlaying: boolean = false;
  private currentChords: Array<{ notes: string[], name: string, voicing?: string[], rootPositionNotes?: string[] }> = [];
  private currentTechnique: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial' = 'block';
  private currentVelocity: number = 0.75;
  private currentArpeggioPattern: string = '1-3-5-3';
  private currentTimeSignature: string = '4/4';
  private currentPartialMode: string = 'root-third';
  private currentUseVoiceLeading: boolean = true;
  private currentOnChordChange: ((chordName: string, index: number) => void) | null = null;
  private currentBlockPatternId: string = 'block-4quarter';
  private currentStrumPatternId: string = 'strum-down-quarter';
  private currentBrokenPatternId: string = 'broken-root-third-fifth';
  private currentAdvancedStrumControls: any = null;

  constructor() {
    // Use Tone.js's AudioContext instead of creating a new one
    if (typeof window !== 'undefined') {
      this.audioContext = Tone.context.rawContext as AudioContext;
      this.effectsInputNode = this.audioContext.createGain();
      this.effectsInputNode.gain.value = 1.0;

      // Initially connect to destination (will be rerouted to effects later)
      this.effectsInputNode.connect(this.audioContext.destination);
    }
  }

  async loadInstrument(instrumentKey: string): Promise<boolean> {
    if (!this.audioContext) {
      console.error('AudioContext not available');
      return false;
    }

    const config = INSTRUMENTS[instrumentKey];
    if (!config) {
      console.error(`Unknown instrument: ${instrumentKey}`);
      return false;
    }

    // Check if already loaded
    if (this.loadedInstruments.has(instrumentKey)) {
      this.currentInstrument = this.loadedInstruments.get(instrumentKey);
      return true;
    }

    this.isLoading = true;

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const instrument = await Soundfont.instrument(
        this.audioContext,
        config.soundfontName,
        {
          format: 'mp3',
          soundfont: 'MusyngKite',
          destination: this.effectsInputNode || undefined
        }
      );

      this.loadedInstruments.set(instrumentKey, instrument);
      this.currentInstrument = instrument;
      this.isLoading = false;
      return true;
    } catch (error) {
      console.error(`Error loading instrument ${instrumentKey}:`, error);
      this.isLoading = false;
      return false;
    }
  }

  playNote(note: string, duration: number = 1, velocity: number = 1): void {
    if (!this.currentInstrument) {
      console.warn('No instrument loaded');
      return;
    }

    try {
      this.currentInstrument.play(note, this.audioContext?.currentTime || 0, {
        duration,
        gain: velocity
      });
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  playChord(notes: string[], duration: number = 1, velocity: number = 1): void {
    if (!this.currentInstrument) {
      console.warn('No instrument loaded');
      return;
    }

    try {
      notes.forEach(note => {
        this.currentInstrument.play(note, this.audioContext?.currentTime || 0, {
          duration,
          gain: velocity
        });
      });
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }

  private getOctaveNote(note: string): string {
    // Extract note name and octave number
    const match = note.match(/^([A-G][#b]?)(\d+)$/);
    if (match) {
      const noteName = match[1];
      const octave = parseInt(match[2]);
      return `${noteName}${octave + 1}`;
    }
    return note;
  }

  private getNoteFromPattern(notes: string[], patternValue: string): string {
    const numValue = parseInt(patternValue);

    // Map scale degrees to note indices (matching voicingEngine logic)
    let index: number;
    switch (numValue) {
      case 1:
        index = 0; // Root
        break;
      case 3:
        index = Math.min(1, notes.length - 1); // Third
        break;
      case 5:
        index = Math.min(2, notes.length - 1); // Fifth
        break;
      case 7:
        index = Math.min(3, notes.length - 1); // Seventh
        break;
      case 8:
        // Octave - return root note one octave higher
        return this.getOctaveNote(notes[0]);
      case 9:
        index = Math.min(4, notes.length - 1); // Ninth
        break;
      case 11:
        index = Math.min(5, notes.length - 1); // Eleventh
        break;
      case 13:
        index = Math.min(6, notes.length - 1); // Thirteenth
        break;
      default:
        index = 0; // Default to root
    }

    return notes[index];
  }

  playArpeggio(notes: string[], pattern: string, duration: number = 1, velocity: number = 1): void {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument loaded or AudioContext unavailable');
      return;
    }

    try {
      const patternValues = pattern.split('-');
      const noteDelay = duration / patternValues.length;
      const noteDuration = noteDelay * 1.5; // Longer overlap for smoother arpeggio

      // Log the actual notes being played for debugging
      const actualNotes = patternValues.map(val => this.getNoteFromPattern(notes, val));
      console.log(`🎵 [Arpeggio] Pattern ${pattern} → Playing: ${actualNotes.join(' → ')}`);

      patternValues.forEach((value, i) => {
        const note = this.getNoteFromPattern(notes, value);
        const startTime = this.audioContext!.currentTime + (i * noteDelay);

        // Add velocity curve for more musical arpeggio
        const velocityCurve = i === 0 ? 1.0 : (i === patternValues.length - 1 ? 0.9 : 0.85);

        this.currentInstrument.play(note, startTime, {
          duration: noteDuration,
          gain: velocity * velocityCurve
        });
      });
    } catch (error) {
      console.error('Error playing arpeggio:', error);
    }
  }

  playBroken(notes: string[], duration: number = 1, velocity: number = 1): void {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument loaded or AudioContext unavailable');
      return;
    }

    try {
      // Broken chord: play notes with distinct irregular, syncopated timing
      // This creates a "stumbling" or "broken" effect
      const irregularPattern = [0, 0.15, 0.4, 0.65, 0.85]; // Highly irregular timings
      const noteDuration = duration * 0.4; // Shorter, more staccato notes

      notes.forEach((note, i) => {
        const delay = irregularPattern[i % irregularPattern.length] * duration;
        const startTime = this.audioContext!.currentTime + delay;

        // Much more dramatic velocity variation (60% to 100%)
        const randomVelocity = velocity * (0.6 + Math.random() * 0.4);

        this.currentInstrument.play(note, startTime, {
          duration: noteDuration,
          gain: randomVelocity
        });
      });
    } catch (error) {
      console.error('Error playing broken chord:', error);
    }
  }

  private getDefaultRhythmicPattern(timeSignature: string): { beats: number[], accents: number[] } {
    const rhythmicPatterns: { [key: string]: { beats: number[], accents: number[] } } = {
      '4/4': {
        beats: [0, 0.25, 0.5, 0.75], // 4 quarter notes
        accents: [1.0, 0.6, 0.7, 0.6]  // STRONG-weak-medium-weak
      },
      '3/4': {
        beats: [0, 0.333, 0.666], // 3 quarter notes
        accents: [1.0, 0.5, 0.5]  // STRONG-weak-weak (waltz)
      },
      '6/8': {
        beats: [0, 0.166, 0.333, 0.5, 0.666, 0.833], // 6 eighth notes
        accents: [1.0, 0.5, 0.5, 0.7, 0.5, 0.5]  // STRONG-weak-weak-medium-weak-weak
      },
      '2/4': {
        beats: [0, 0.5], // 2 quarter notes
        accents: [1.0, 0.6]  // STRONG-weak (march)
      },
      '5/4': {
        beats: [0, 0.2, 0.4, 0.6, 0.8], // 5 quarter notes
        accents: [1.0, 0.5, 0.5, 0.7, 0.5]  // STRONG-weak-weak-medium-weak (3+2 grouping)
      },
      '7/8': {
        beats: [0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857], // 7 eighth notes
        accents: [1.0, 0.5, 0.5, 0.7, 0.5, 0.7, 0.5]  // STRONG-weak-weak-medium-weak-medium-weak (3+2+2)
      }
    };
    return rhythmicPatterns[timeSignature] || rhythmicPatterns['4/4'];
  }

  playPartial(notes: string[], duration: number = 1, velocity: number = 1, partialMode: string = 'root-third'): void {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument loaded or AudioContext unavailable');
      return;
    }

    try {
      // Partial voicing: play subset of notes based on selected mode
      let partialNotes: string[] = [];

      if (notes.length >= 3) {
        switch (partialMode) {
          case 'root-third':
            partialNotes = [notes[0], notes[1]]; // Root + 3rd
            break;
          case 'root-fifth':
            partialNotes = [notes[0], notes[2]]; // Root + 5th (power chord)
            break;
          case 'third-fifth':
            partialNotes = notes.length >= 3 ? [notes[1], notes[2]] : [notes[0], notes[1]]; // 3rd + 5th
            break;
          case 'root-only':
            partialNotes = [notes[0]]; // Just root note
            break;
          case 'shell':
            // Shell voicing: root + 3rd + 7th (no 5th) - jazz style
            partialNotes = notes.length >= 4 ? [notes[0], notes[1], notes[3]] : [notes[0], notes[1]];
            break;
          default:
            partialNotes = [notes[0], notes[1]];
        }
      } else {
        partialNotes = [...notes];
      }

      // Play partial notes simultaneously with slightly increased volume
      partialNotes.forEach(note => {
        this.currentInstrument.play(note, this.audioContext!.currentTime, {
          duration,
          gain: velocity * 1.1 // Slightly louder since fewer notes
        });
      });
    } catch (error) {
      console.error('Error playing partial chord:', error);
    }
  }

  playWithTimeSignatureAtTime(
    notes: string[],
    technique: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial',
    duration: number,
    velocity: number,
    arpeggioPattern: string,
    timeSignature: string,
    partialMode: string = 'root-third',
    startTime: number = 0,
    blockPatternId?: string,
    strumPatternId?: string,
    brokenChordPatternId?: string,
    tieredArpeggioConfig?: any  // NEW: Tiered arpeggio system config
  ): void {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument or audio context available');
      return;
    }

    // For block voicing, use the selected pattern if provided
    let pattern: { beats: number[], accents: number[], durations?: number[] };

    console.log('[SoundFont playWithTimeSignature] Called with:', {
      technique,
      timeSignature,
      blockPatternId,
      strumPatternId,
      brokenChordPatternId,
      arpeggioPattern,
      notesCount: notes.length
    });

    // Handle strum technique - play notes ONE AT A TIME (guitar strum effect)
    if (technique === 'strum') {
      console.log('[SoundFont] 🎸 Handling STRUM - one note at a time');

      if (strumPatternId) {
        const strumPatternData = STRUM_PATTERNS.find((p: any) => p.id === strumPatternId);

        if (strumPatternData) {
          console.log('[SoundFont] ✅ Using strum pattern:', strumPatternData.name);
          const { rhythmTemplate, direction, velocityCurve, articulation } = strumPatternData;

          // Each beat in rhythmTemplate = ONE complete strum through all notes
          rhythmTemplate.forEach((beat: any, idx: number) => {
            const strumStartTime = startTime + (beat.relativePosition * duration);

            // Determine note order based on direction
            let strumNotes = [...notes];
            if (direction === 'up') {
              strumNotes.reverse();
            } else if (direction === 'alternating') {
              if (idx % 2 === 1) strumNotes.reverse();
            } else if (direction === 'mixed') {
              if (idx % 2 === 1) strumNotes.reverse();
            }

            // Strum spread: time between each individual note in the strum
            const strumSpread = articulation === 'staccato' ? 0.01 :
                                articulation === 'muted' ? 0.008 :
                                articulation === 'legato' ? 0.02 : 0.015;

            const noteDur = articulation === 'staccato' ? duration * 0.1 :
                           articulation === 'muted' ? duration * 0.15 :
                           articulation === 'legato' ? duration * 0.4 : duration * 0.2;

            const vel = velocityCurve[idx % velocityCurve.length] *
                       (articulation === 'muted' ? 0.6 : 1.0) * velocity;

            // Play each note ONE AT A TIME with slight delay between them
            strumNotes.forEach((note, noteIdx) => {
              const noteTime = strumStartTime + (noteIdx * strumSpread);
              this.currentInstrument!.play(note, noteTime, {
                duration: noteDur,
                gain: vel
              });
            });
          });
          return; // Exit early
        } else {
          console.warn('[SoundFont] ❌ Strum pattern not found:', strumPatternId);
        }
      }

      // Fallback: Simple downward strum (one note at a time)
      console.log('[SoundFont] Using simple strum fallback');
      const strumSpread = 0.015;
      notes.forEach((note, i) => {
        const noteTime = startTime + (i * strumSpread);
        this.currentInstrument!.play(note, noteTime, {
          duration: duration * 0.2,
          gain: velocity
        });
      });
      return; // Exit early
    }

    if (technique === 'broken' && brokenChordPatternId) {
      console.log('[SoundFont] 🎹 Handling BROKEN CHORD pattern:', brokenChordPatternId);
      const brokenPatternData = BROKEN_CHORD_PATTERNS.find((p: any) => p.id === brokenChordPatternId);

      if (brokenPatternData) {
        console.log('[SoundFont] ✅ Found broken chord pattern:', brokenPatternData.name);
        const { rhythmTemplate, firstNote, secondNotePair, accentPattern } = brokenPatternData;

        // Helper to get note
        const getNote = (pos: string): string | null => {
          const map: any = {
            'root': notes[0], 'third': notes[1], 'fifth': notes[2],
            'seventh': notes[3], 'ninth': notes[4], 'eleventh': notes[5], 'thirteenth': notes[6]
          };
          return map[pos] || null;
        };

        const firstNoteActual = getNote(firstNote);
        const second1 = getNote(secondNotePair[0]);
        const second2 = getNote(secondNotePair[1]);

        if (firstNoteActual && second1 && second2) {
          rhythmTemplate.forEach((beatOffset: number, i: number) => {
            const playTime = startTime + (beatOffset * duration);
            const accent = accentPattern[i % accentPattern.length];
            const vel = (accent ? 1.0 : 0.7) * velocity;
            const dur = duration * 0.15;

            if (i % 3 === 0) {
              // First note alone
              this.currentInstrument!.play(firstNoteActual, playTime, {
                duration: dur,
                gain: vel
              });
            } else {
              // Two notes together
              this.currentInstrument!.play(second1, playTime, { duration: dur, gain: vel });
              this.currentInstrument!.play(second2, playTime, { duration: dur, gain: vel });
            }
          });
          return; // Exit early - broken chord handles everything
        } else {
          console.warn('[SoundFont] ❌ Could not map broken chord notes');
        }
      } else {
        console.warn('[SoundFont] ❌ Broken chord pattern not found:', brokenChordPatternId);
      }
    }

    if (technique === 'block' && blockPatternId) {
      const selectedBlockPattern = BLOCK_PATTERNS.find((p: any) => p.id === blockPatternId);

      if (selectedBlockPattern) {
        console.log('[SoundFont] ✅ Found block pattern:', selectedBlockPattern.name, blockPatternId);
        console.log('[SoundFont] Pattern durations:', selectedBlockPattern.durations);
        // Convert block pattern to beats, accents, AND note durations
        pattern = {
          beats: selectedBlockPattern.durations.map((d: any) => d.relativePosition),
          accents: selectedBlockPattern.durations.map((d: any, i: number) =>
            i === 0 ? 1.0 : (d.beats >= 2 ? 0.7 : 0.6)  // First beat strongest, longer notes medium
          ),
          durations: selectedBlockPattern.durations.map((d: any) => d.beats) // CRITICAL: Store actual note durations!
        };
        console.log('[SoundFont] Converted to beats:', pattern.beats, 'accents:', pattern.accents, 'durations:', pattern.durations);
      } else {
        console.warn('[SoundFont] ❌ Block pattern not found, using default');
        // Fallback to default pattern
        pattern = this.getDefaultRhythmicPattern(timeSignature);
      }
    } else {
      console.log('[SoundFont] Using default pattern (technique:', technique, ')');
      // Use default rhythmic patterns for other techniques
      pattern = this.getDefaultRhythmicPattern(timeSignature);
    }

    console.log('[SoundFont] Final pattern:', {beats: pattern.beats, accents: pattern.accents});

    // Play chord at each beat in the measure with proper accent
    pattern.beats.forEach((beatTime, index) => {
      const absoluteStartTime = startTime + (beatTime * duration);
      const accentVelocity = velocity * pattern.accents[index];

      // CRITICAL FIX: Use the actual duration from the pattern, not equal division!
      // For block patterns, each note has its own duration (whole=4, half=2, quarter=1, eighth=0.5)
      const noteDuration = pattern.durations && pattern.durations[index]
        ? (duration * (pattern.durations[index] / 4)) * 0.95  // Convert beats to seconds, 95% to avoid overlap
        : (duration / pattern.beats.length) * 0.95;  // Fallback for non-block patterns

      console.log('[Block Playback] Beat', index, 'at time', beatTime, 'duration', noteDuration, 'seconds');

      // Apply the voicing technique at each beat
      switch (technique) {
        case 'block':
          notes.forEach(note => {
            this.currentInstrument.play(note, absoluteStartTime, {
              duration: noteDuration,
              gain: accentVelocity
            });
          });
          break;
        case 'arpeggiated':
          // TIERED ARPEGGIO SYSTEM: Use rhythm data if available, otherwise use legacy timing
          const patternValues = arpeggioPattern.split('-');

          let noteTimings: number[] = [];
          let noteDurations: number[] = [];
          let swingAmount = 0;

          if (tieredArpeggioConfig && tieredArpeggioConfig.rhythm) {
            // NEW: Use tiered arpeggio system with rhythm patterns
            const rhythm = tieredArpeggioConfig.rhythm;
            console.log('[Tiered Arpeggio] Using rhythm pattern:', rhythm.name, rhythm.subdivision);

            // Calculate note timing based on rhythm durations using actual BPM
            const secondsPerBeat = 60 / this.currentBPM;
            const subdivisionMap: any = {
              'whole': 4.0,
              'half': 2.0,
              'quarter': 1.0,
              'eighth': 0.5,
              'sixteenth': 0.25,
              'triplet-eighth': 0.333,
              'triplet-quarter': 0.666
            };

            const subdivisionDuration = (subdivisionMap[rhythm.subdivision] || 1.0) * secondsPerBeat;
            swingAmount = rhythm.swingAmount || 0;

            // Generate note timings based on rhythm durations
            let currentTime = 0;
            for (let i = 0; i < patternValues.length; i++) {
              const durationFactor = rhythm.durations && rhythm.durations[i % rhythm.durations.length]
                ? rhythm.durations[i % rhythm.durations.length]
                : 1.0;

              noteTimings.push(currentTime);
              noteDurations.push(subdivisionDuration * durationFactor * 0.9);

              // Apply swing to odd-numbered notes
              if (swingAmount > 0 && i % 2 === 1) {
                currentTime += subdivisionDuration * (1 + swingAmount);
              } else {
                currentTime += subdivisionDuration * durationFactor;
              }
            }

            console.log('[Tiered Arpeggio] Note timings:', noteTimings, 'durations:', noteDurations);
          } else {
            // LEGACY: Use hardcoded timing (backward compatibility)
            const singleArpDuration = noteDuration * 0.3;
            for (let i = 0; i < patternValues.length; i++) {
              noteTimings.push(i * singleArpDuration);
              noteDurations.push(singleArpDuration * 0.9);
            }
          }

          // Calculate how many times to repeat pattern to fill the measure
          const totalArpTime = noteTimings[noteTimings.length - 1] + noteDurations[noteDurations.length - 1];
          const repetitions = Math.ceil(noteDuration / totalArpTime);

          // Log the pattern with actual note names
          const actualNotes = patternValues.map(val => this.getNoteFromPattern(notes, val));
          console.log(`🎵 [Arpeggio] Pattern ${arpeggioPattern} → ${actualNotes.join(' → ')} (x${repetitions} reps at beat ${index})`);

          // Repeat the arpeggio pattern to fill the time
          for (let rep = 0; rep < repetitions; rep++) {
            patternValues.forEach((value, i) => {
              const arpStartTime = absoluteStartTime + (rep * totalArpTime) + noteTimings[i];

              // Don't play past the end of this beat
              if (arpStartTime < absoluteStartTime + noteDuration) {
                const note = this.getNoteFromPattern(notes, value);
                this.currentInstrument.play(note, arpStartTime, {
                  duration: noteDurations[i],
                  gain: accentVelocity * 0.8 // Slightly softer for arpeggios
                });
              }
            });
          }
          break;
        case 'strum':
          // Strum is handled above with early return - this should never be reached
          break;
        case 'broken':
          // Broken chord is handled above with early return - this should never be reached
          break;
        case 'partial':
          // Partial voicing on each beat using specified mode
          let partialNotes: string[] = [];
          if (notes.length >= 3) {
            switch (partialMode) {
              case 'root-third':
                partialNotes = [notes[0], notes[1]];
                break;
              case 'root-fifth':
                partialNotes = [notes[0], notes[2]];
                break;
              case 'third-fifth':
                partialNotes = [notes[1], notes[2]];
                break;
              case 'root-only':
                partialNotes = [notes[0]];
                break;
              case 'shell':
                partialNotes = notes.length >= 4 ? [notes[0], notes[1], notes[3]] : [notes[0], notes[1]];
                break;
              default:
                partialNotes = [notes[0], notes[1]];
            }
          } else {
            partialNotes = [...notes];
          }
          partialNotes.forEach(note => {
            this.currentInstrument.play(note, absoluteStartTime, {
              duration: noteDuration,
              gain: accentVelocity * 1.1
            });
          });
          break;
      }
    });
  }

  playWithTimeSignature(
    notes: string[],
    technique: 'block' | 'arpeggiated' | 'broken' | 'partial',
    duration: number,
    velocity: number,
    arpeggioPattern: string,
    timeSignature: string,
    partialMode: string = 'root-third'
  ): void {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument or audio context available');
      return;
    }

    // Use current time for backward compatibility (existing calls)
    const startTime = this.audioContext.currentTime;
    this.playWithTimeSignatureAtTime(notes, technique, duration, velocity, arpeggioPattern, timeSignature, partialMode, startTime);
  }

  scheduleChordProgression(
    chords: Array<{ notes: string[], name: string, voicing?: string[], rootPositionNotes?: string[] }>,
    technique: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial',
    chordDuration: number,
    velocity: number,
    arpeggioPattern: string,
    timeSignature: string,
    partialMode: string,
    useVoiceLeading: boolean,
    onChordChange: (chordName: string, index: number) => void,
    blockPatternId?: string,
    strumPatternId?: string,
    brokenChordPatternId?: string,
    advancedStrumControls?: any,
    explicitStartTime?: number,  // Optional explicit start time for seamless looping
    tieredArpeggioConfig?: any,  // Optional tiered arpeggio system config
    bpm?: number  // NEW: Optional BPM for accurate rhythm timing
  ): { timeoutIds: number[], endTime: number } {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument or audio context available');
      return { timeoutIds: [], endTime: this.audioContext?.currentTime || 0 };
    }

    // Store current playback state for tempo changes
    this.isPlaying = true;
    this.currentChords = chords;
    this.currentTechnique = technique;
    this.currentVelocity = velocity;
    this.currentArpeggioPattern = arpeggioPattern;
    this.currentTimeSignature = timeSignature;
    this.currentPartialMode = partialMode;
    this.currentUseVoiceLeading = useVoiceLeading;
    this.currentOnChordChange = onChordChange;
    this.currentBlockPatternId = blockPatternId || 'block-4quarter';
    this.currentStrumPatternId = strumPatternId || 'strum-down-quarter';
    this.currentBrokenPatternId = brokenChordPatternId || 'broken-root-third-fifth';
    this.currentAdvancedStrumControls = advancedStrumControls;
    if (bpm !== undefined) {
      this.currentBPM = bpm;  // NEW: Update BPM for rhythm calculations
    }

    // Use explicit start time if provided (for seamless looping), otherwise use current time
    const startTime = explicitStartTime !== undefined ? explicitStartTime : this.audioContext.currentTime;
    const scheduledTimeouts: number[] = [];

    console.log('[Loop Fix] scheduleChordProgression called with:', {
      explicitStartTime,
      actualStartTime: startTime,
      currentTime: this.audioContext.currentTime,
      chordCount: chords.length,
      chordDuration
    });

    chords.forEach((chord, index) => {
      const chordStartTime = startTime + (index * chordDuration);

      // For arpeggiated patterns, ALWAYS use root position notes to ensure badge labels match played notes
      // For other techniques, use voice-led voicing if available, otherwise use original notes
      let notesToPlay: string[];
      if (technique === 'arpeggiated') {
        notesToPlay = chord.rootPositionNotes || chord.notes;
      } else {
        notesToPlay = (useVoiceLeading && chord.voicing) ? chord.voicing : chord.notes;
      }

      // Schedule the chord to play at exact time
      this.playWithTimeSignatureAtTime(
        notesToPlay,
        technique,
        chordDuration, // Use FULL duration (not 0.9)
        velocity,
        arpeggioPattern,
        timeSignature,
        partialMode,
        chordStartTime,
        blockPatternId,
        strumPatternId,
        brokenChordPatternId,
        tieredArpeggioConfig  // NEW: Pass tiered config
      );

      // Schedule UI update for chord name change
      const delayMs = (chordStartTime - this.audioContext.currentTime) * 1000;
      const timeoutId = window.setTimeout(() => {
        onChordChange(chord.name, index);
      }, Math.max(0, delayMs));
      scheduledTimeouts.push(timeoutId);
    });

    // Calculate the exact end time of this progression
    const progressionEndTime = startTime + (chords.length * chordDuration);

    console.log('[Loop Fix] Progression scheduled:', {
      startTime,
      endTime: progressionEndTime,
      duration: progressionEndTime - startTime,
      timeoutsScheduled: scheduledTimeouts.length
    });

    return { timeoutIds: scheduledTimeouts, endTime: progressionEndTime };
  }

  // Legacy method - keeping for backward compatibility
  playWithTimeSignatureOld(
    notes: string[],
    technique: 'block' | 'arpeggiated' | 'broken' | 'partial',
    duration: number,
    velocity: number,
    arpeggioPattern: string,
    timeSignature: string,
    partialMode: string = 'root-third'
  ): void {
    if (!this.currentInstrument || !this.audioContext) {
      console.warn('No instrument or audio context available');
      return;
    }

    // Define rhythmic patterns for each time signature
    const rhythmicPatterns: { [key: string]: { beats: number[], accents: number[] } } = {
      '4/4': {
        beats: [0, 0.25, 0.5, 0.75], // 4 quarter notes
        accents: [1.0, 0.6, 0.7, 0.6]  // STRONG-weak-medium-weak
      },
      '3/4': {
        beats: [0, 0.333, 0.666], // 3 quarter notes
        accents: [1.0, 0.5, 0.5]  // STRONG-weak-weak (waltz)
      },
      '6/8': {
        beats: [0, 0.166, 0.333, 0.5, 0.666, 0.833], // 6 eighth notes
        accents: [1.0, 0.5, 0.5, 0.7, 0.5, 0.5]  // STRONG-weak-weak-medium-weak-weak
      },
      '2/4': {
        beats: [0, 0.5], // 2 quarter notes
        accents: [1.0, 0.6]  // STRONG-weak (march)
      },
      '5/4': {
        beats: [0, 0.2, 0.4, 0.6, 0.8], // 5 quarter notes
        accents: [1.0, 0.5, 0.5, 0.7, 0.5]  // STRONG-weak-weak-medium-weak (3+2 grouping)
      },
      '7/8': {
        beats: [0, 0.143, 0.286, 0.429, 0.571, 0.714, 0.857], // 7 eighth notes
        accents: [1.0, 0.5, 0.5, 0.7, 0.5, 0.7, 0.5]  // STRONG-weak-weak-medium-weak-medium-weak (3+2+2)
      }
    };

    const pattern = rhythmicPatterns[timeSignature] || rhythmicPatterns['4/4'];
    const currentTime = this.audioContext.currentTime;

    // Play chord at each beat in the measure with proper accent
    pattern.beats.forEach((beatTime, index) => {
      const startTime = currentTime + (beatTime * duration);
      const accentVelocity = velocity * pattern.accents[index];
      const noteDuration = (duration / pattern.beats.length) * 0.8; // Slight separation between beats

      // Apply the voicing technique at each beat
      switch (technique) {
        case 'block':
          notes.forEach(note => {
            this.currentInstrument.play(note, startTime, {
              duration: noteDuration,
              gain: accentVelocity
            });
          });
          break;
        case 'arpeggiated':
          // For arpeggiated, only play on strong beats to avoid overcrowding
          if (pattern.accents[index] >= 0.7) {
            const patternValues = arpeggioPattern.split('-');
            const arpDelay = noteDuration / patternValues.length;
            patternValues.forEach((value, i) => {
              const note = this.getNoteFromPattern(notes, value);
              this.currentInstrument.play(note, startTime + (i * arpDelay), {
                duration: arpDelay * 1.2,
                gain: accentVelocity
              });
            });
          }
          break;
        case 'broken':
          // Play broken pattern on accented beats
          if (pattern.accents[index] >= 0.6) {
            notes.forEach((note, i) => {
              const delay = (i / notes.length) * noteDuration * 0.5;
              this.currentInstrument.play(note, startTime + delay, {
                duration: noteDuration * 0.6,
                gain: accentVelocity * (0.8 + Math.random() * 0.2)
              });
            });
          }
          break;
        case 'partial':
          // Partial voicing on each beat using specified mode
          let partialNotes: string[] = [];
          if (notes.length >= 3) {
            switch (partialMode) {
              case 'root-third':
                partialNotes = [notes[0], notes[1]];
                break;
              case 'root-fifth':
                partialNotes = [notes[0], notes[2]];
                break;
              case 'third-fifth':
                partialNotes = [notes[1], notes[2]];
                break;
              case 'root-only':
                partialNotes = [notes[0]];
                break;
              case 'shell':
                partialNotes = notes.length >= 4 ? [notes[0], notes[1], notes[3]] : [notes[0], notes[1]];
                break;
              default:
                partialNotes = [notes[0], notes[1]];
            }
          } else {
            partialNotes = [...notes];
          }
          partialNotes.forEach(note => {
            this.currentInstrument.play(note, startTime, {
              duration: noteDuration,
              gain: accentVelocity * 1.1
            });
          });
          break;
      }
    });
  }

  playVoicing(
    notes: string[],
    technique: 'block' | 'arpeggiated' | 'broken' | 'partial',
    duration: number = 1,
    velocity: number = 1,
    arpeggioPattern: string = '1-3-5-3',
    partialMode: string = 'root-third',
    brokenStyle: string = 'syncopated'
  ): void {
    switch (technique) {
      case 'block':
        this.playChord(notes, duration, velocity);
        break;
      case 'arpeggiated':
        this.playArpeggio(notes, arpeggioPattern, duration, velocity);
        break;
      case 'broken':
        this.playBroken(notes, duration, velocity);
        break;
      case 'partial':
        this.playPartial(notes, duration, velocity, partialMode);
        break;
      default:
        this.playChord(notes, duration, velocity);
    }
  }

  stopAllNotes(): void {
    if (this.currentInstrument && this.currentInstrument.stop) {
      this.currentInstrument.stop();
    }
  }

  getLoadedInstruments(): string[] {
    return Array.from(this.loadedInstruments.keys());
  }

  isInstrumentLoaded(instrumentKey: string): boolean {
    return this.loadedInstruments.has(instrumentKey);
  }

  getCurrentInstrument(): any {
    return this.currentInstrument;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Get the effects input node that can be connected to an effects chain
   * This allows audio effects to be applied to SoundFont output
   */
  getEffectsInputNode(): GainNode | null {
    return this.effectsInputNode;
  }

  /**
   * Set the master volume for SoundFont playback
   * @param volume - Volume value from 0 to 1
   */
  setVolume(volume: number): void {
    if (this.effectsInputNode) {
      this.effectsInputNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Connect SoundFont output to an effects chain input
   * @param effectsInput - The input node of the effects chain
   */
  connectToEffects(effectsInput: AudioNode): void {
    if (!this.effectsInputNode) {
      console.warn('Effects input node not available');
      return;
    }

    try {
      // Disconnect from default destination
      this.effectsInputNode.disconnect();
      // Connect to effects chain
      this.effectsInputNode.connect(effectsInput);
    } catch (error) {
      console.error('Error connecting to effects:', error);
    }
  }

  /**
   * Disconnect from effects chain and route back to default output
   */
  disconnectFromEffects(): void {
    if (!this.effectsInputNode || !this.audioContext) {
      return;
    }

    try {
      this.effectsInputNode.disconnect();
      this.effectsInputNode.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error disconnecting from effects:', error);
    }
  }

  clearCache(): void {
    this.loadedInstruments.clear();
    this.currentInstrument = null;
  }

  dispose(): void {
    this.stopAllNotes();
    this.clearCache();
    // DO NOT close the AudioContext - it's shared with Tone.js
    // Closing it would break all audio functionality
    // if (this.audioContext && this.audioContext.state !== 'closed') {
    //   this.audioContext.close();
    // }

    // Disconnect effects node but keep references
    if (this.effectsInputNode) {
      try {
        this.effectsInputNode.disconnect();
      } catch (e) {
        // Already disconnected
      }
    }

    // Don't null out the context - it will be reused
    // this.audioContext = null;
    // this.effectsInputNode = null;
  }

  setTempo(newBPM: number): void {
    this.currentTempo = newBPM;
  }

  getTempo(): number {
    return this.currentTempo;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  stopPlayback(): void {
    this.isPlaying = false;
  }

  rescheduleWithNewTempo(newBPM: number): void {
    if (!this.isPlaying || !this.currentChords.length || !this.currentOnChordChange) {
      return;
    }

    // Clear all existing timeouts
    if ((window as any).__musicTimeouts) {
      (window as any).__musicTimeouts.forEach((id: number) => window.clearTimeout(id));
      (window as any).__musicTimeouts = [];
    }

    // Update tempo
    this.currentTempo = newBPM;

    // Calculate new chord duration based on tempo and time signature
    const getBeatsPerMeasure = (timeSig: string): number => {
      switch (timeSig) {
        case '3/4': return 3;
        case '6/8': return 6;
        case '2/4': return 2;
        case '5/4': return 5;
        case '7/8': return 7;
        case '3/8': return 3;
        case '12/8': return 12;
        case '4/4':
        default: return 4;
      }
    };

    const getBeatValue = (timeSig: string): number => {
      if (timeSig.includes('/8')) return 8;
      return 4;
    };

    const beatsPerMeasure = getBeatsPerMeasure(this.currentTimeSignature);
    const beatValue = getBeatValue(this.currentTimeSignature);
    const secondsPerBeat = 60 / newBPM;
    const adjustedSecondsPerBeat = beatValue === 8 ? secondsPerBeat / 2 : secondsPerBeat;
    const newChordDuration = adjustedSecondsPerBeat * beatsPerMeasure;

    // Reschedule with new timing
    const scheduledTimeouts = this.scheduleChordProgression(
      this.currentChords,
      this.currentTechnique,
      newChordDuration,
      this.currentVelocity,
      this.currentArpeggioPattern,
      this.currentTimeSignature,
      this.currentPartialMode,
      this.currentUseVoiceLeading,
      this.currentOnChordChange,
      this.currentBlockPatternId,
      this.currentStrumPatternId,
      this.currentBrokenPatternId,
      this.currentAdvancedStrumControls
    );

    // Store new timeout IDs
    if (!(window as any).__musicTimeouts) {
      (window as any).__musicTimeouts = [];
    }
    (window as any).__musicTimeouts.push(...scheduledTimeouts);
  }
}

export const instrumentCategories = {
  'Keyboard': ['piano', 'brightPiano', 'electricPiano'],
  'Organ': ['organ', 'rockOrgan'],
  'Strings': ['strings', 'violin', 'cello', 'harp'],
  'Voice': ['choir', 'voiceOohs'],
  'Brass': ['brass', 'trumpet', 'frenchHorn'],
  'Percussion': ['bell', 'vibraphone'],
  'Guitar': ['guitar'],
  'Synth': ['pad']
};
