import * as Tone from 'tone';

export interface VoicedChord {
  name: string;
  notes: string[];
  romanNumeral: string;
  root: string;
  voicing: string[];
}

export class VoiceLeadingEngine {
  private lastVoicing: string[] | null = null;

  constructor() {}

  private getMidiNumber(note: string): number {
    return Tone.Frequency(note).toMidi();
  }

  private noteFromMidi(midi: number): string {
    return Tone.Frequency(midi, 'midi').toNote();
  }

  private getInterval(note1: string, note2: string): number {
    return Math.abs(this.getMidiNumber(note1) - this.getMidiNumber(note2));
  }

  private getTotalVoiceMotion(voicing1: string[], voicing2: string[]): number {
    let totalMotion = 0;
    const minLength = Math.min(voicing1.length, voicing2.length);

    for (let i = 0; i < minLength; i++) {
      totalMotion += this.getInterval(voicing1[i], voicing2[i]);
    }

    return totalMotion;
  }

  private preserveTopVoice(targetChord: string[], previousTopVoice: string): string[] | null {
    const targetMidis = targetChord.map(n => this.getMidiNumber(n));
    const topMidi = this.getMidiNumber(previousTopVoice);

    const topNoteClass = topMidi % 12;

    for (const targetMidi of targetMidis) {
      if (targetMidi % 12 === topNoteClass) {
        return this.buildVoicingWithTop(targetChord, targetMidi);
      }
    }

    const targetOctave = Math.floor(topMidi / 12);
    const testMidi = topNoteClass + (targetOctave * 12);

    for (const baseMidi of targetMidis) {
      const noteClass = baseMidi % 12;
      for (let octaveShift = -1; octaveShift <= 1; octaveShift++) {
        const adjustedMidi = testMidi + (octaveShift * 12);
        if (adjustedMidi % 12 === noteClass) {
          return this.buildVoicingWithTop(targetChord, adjustedMidi);
        }
      }
    }

    return null;
  }

  private buildVoicingWithTop(chordNotes: string[], topMidi: number): string[] {
    const chordMidis = chordNotes.map(n => this.getMidiNumber(n));
    const uniqueNoteClasses = [...new Set(chordMidis.map(m => m % 12))];

    const topNoteClass = topMidi % 12;
    const topOctave = Math.floor(topMidi / 12);

    const voicing: number[] = [];

    for (const noteClass of uniqueNoteClasses) {
      if (noteClass === topNoteClass) continue;

      let bestMidi = noteClass + (topOctave * 12);
      if (bestMidi >= topMidi) {
        bestMidi -= 12;
      }

      while (bestMidi < topMidi - 12) {
        bestMidi += 12;
      }

      voicing.push(bestMidi);
    }

    voicing.sort((a, b) => a - b);
    voicing.push(topMidi);

    return voicing.map(m => this.noteFromMidi(m));
  }

  private getAllVoicings(chordNotes: string[]): string[][] {
    const voicings: string[][] = [];
    const chordMidis = chordNotes.map(n => this.getMidiNumber(n));
    const uniqueNoteClasses = [...new Set(chordMidis.map(m => m % 12))];

    const baseOctave = Math.floor(chordMidis[0] / 12);

    for (let inversion = 0; inversion < uniqueNoteClasses.length; inversion++) {
      const topNoteClass = uniqueNoteClasses[inversion];
      const voicing: number[] = [];

      for (let i = 0; i < uniqueNoteClasses.length; i++) {
        const noteClass = uniqueNoteClasses[(inversion + i) % uniqueNoteClasses.length];
        let midi = noteClass + (baseOctave * 12);

        if (voicing.length > 0 && midi <= voicing[voicing.length - 1]) {
          midi += 12;
        }

        voicing.push(midi);
      }

      voicings.push(voicing.map(m => this.noteFromMidi(m)));
    }

    return voicings;
  }

  private findBestVoicing(targetChord: string[], previousVoicing: string[]): string[] {
    const allVoicings = this.getAllVoicings(targetChord);

    let bestVoicing = allVoicings[0];
    let minMotion = Infinity;

    for (const voicing of allVoicings) {
      const motion = this.getTotalVoiceMotion(previousVoicing, voicing);
      if (motion < minMotion) {
        minMotion = motion;
        bestVoicing = voicing;
      }
    }

    return bestVoicing;
  }

  public applyVoiceLeading(chord: VoicedChord): VoicedChord {
    if (!this.lastVoicing || this.lastVoicing.length === 0) {
      // First chord: normalize to a comfortable middle register voicing
      const normalizedVoicing = this.normalizeToMiddleRegister(chord.notes);
      this.lastVoicing = normalizedVoicing;
      return {
        ...chord,
        voicing: normalizedVoicing
      };
    }

    const topVoice = this.lastVoicing[this.lastVoicing.length - 1];
    let newVoicing = this.preserveTopVoice(chord.notes, topVoice);

    if (!newVoicing) {
      newVoicing = this.findBestVoicing(chord.notes, this.lastVoicing);
    }

    this.lastVoicing = newVoicing;

    return {
      ...chord,
      voicing: newVoicing
    };
  }

  private normalizeToMiddleRegister(chordNotes: string[]): string[] {
    // Place the chord in a comfortable middle register (around C4-C5)
    const chordMidis = chordNotes.map(n => this.getMidiNumber(n));
    const uniqueNoteClasses = [...new Set(chordMidis.map(m => m % 12))];

    // Target middle C (C4 = MIDI 60) as the bass note area
    const targetBassOctave = 4;
    const voicing: number[] = [];

    for (let i = 0; i < uniqueNoteClasses.length; i++) {
      const noteClass = uniqueNoteClasses[i];
      let midi = noteClass + (targetBassOctave * 12);

      // Ensure each note is above the previous one
      if (voicing.length > 0 && midi <= voicing[voicing.length - 1]) {
        midi += 12;
      }

      voicing.push(midi);
    }

    return voicing.map(m => this.noteFromMidi(m));
  }

  public applyVoiceLeadingToProgression(chords: VoicedChord[]): VoicedChord[] {
    this.lastVoicing = null;

    // Safety check
    if (!chords || chords.length === 0) {
      return [];
    }

    // First pass: apply voice-leading to all chords in sequence
    const voicedChords = chords.map(chord => this.applyVoiceLeading(chord));

    // LOOP CONTINUITY FIX: Re-voice-lead the first chord to connect smoothly with the last chord
    // This ensures seamless looping when the progression repeats
    if (voicedChords.length >= 2) {
      const lastChordVoicing = voicedChords[voicedChords.length - 1].voicing;
      const firstChord = voicedChords[0];

      if (lastChordVoicing && lastChordVoicing.length > 0) {
        // Temporarily set lastVoicing to the last chord
        this.lastVoicing = lastChordVoicing;

        // Find the best voicing for the first chord that connects smoothly from the last chord
        const topVoice = lastChordVoicing[lastChordVoicing.length - 1];
        let loopAwareVoicing = this.preserveTopVoice(firstChord.notes, topVoice);

        if (!loopAwareVoicing) {
          loopAwareVoicing = this.findBestVoicing(firstChord.notes, lastChordVoicing);
        }

        // Update the first chord with the loop-aware voicing
        voicedChords[0] = {
          ...firstChord,
          voicing: loopAwareVoicing
        };

        console.log('[Voice-Leading Loop Fix] Re-voiced first chord for loop continuity:', {
          originalFirstChordVoicing: firstChord.voicing,
          lastChordVoicing,
          newFirstChordVoicing: loopAwareVoicing,
          voiceMotion: this.getTotalVoiceMotion(lastChordVoicing, loopAwareVoicing)
        });
      }
    }

    return voicedChords;
  }

  public reset(): void {
    this.lastVoicing = null;
  }
}

export const voiceLeadingEngine = new VoiceLeadingEngine();
