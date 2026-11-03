import {
  ArpeggioSequence,
  DistributionMode,
  DistributionConfig,
  ChordProgressionSegment
} from '../types/arpeggioSystem';

export class SequenceDistributor {
  public distributeSequence(
    sequence: ArpeggioSequence,
    progressionLength: number,
    config: DistributionConfig
  ): ChordProgressionSegment[] {
    if (!config.enabled || config.mode === 'continuous') {
      return this.continuousMode(sequence, progressionLength);
    }

    switch (config.mode) {
      case 'even-split':
        return this.evenSplitMode(sequence, progressionLength);
      case 'grouped':
        return this.groupedMode(sequence, progressionLength);
      case 'cascade':
        return this.cascadeMode(sequence, progressionLength);
      case 'progressive':
        return this.progressiveMode(sequence, progressionLength);
      default:
        return this.continuousMode(sequence, progressionLength);
    }
  }

  private continuousMode(sequence: ArpeggioSequence, progressionLength: number): ChordProgressionSegment[] {
    const segments: ChordProgressionSegment[] = [];
    for (let i = 0; i < progressionLength; i++) {
      segments.push({
        chordIndex: i,
        notes: sequence.notes,
        startOffset: 0,
        endOffset: sequence.length
      });
    }
    return segments;
  }

  private evenSplitMode(sequence: ArpeggioSequence, progressionLength: number): ChordProgressionSegment[] {
    const segments: ChordProgressionSegment[] = [];
    const notesParts = sequence.notes.split('-');
    const notesPerChord = Math.ceil(notesParts.length / progressionLength);

    for (let i = 0; i < progressionLength; i++) {
      const startIdx = i * notesPerChord;
      const endIdx = Math.min(startIdx + notesPerChord, notesParts.length);
      const segmentNotes = notesParts.slice(startIdx, endIdx).join('-');

      segments.push({
        chordIndex: i,
        notes: segmentNotes || notesParts[0],
        startOffset: startIdx,
        endOffset: endIdx
      });
    }
    return segments;
  }

  private groupedMode(sequence: ArpeggioSequence, progressionLength: number): ChordProgressionSegment[] {
    const segments: ChordProgressionSegment[] = [];
    const notesParts = sequence.notes.split('-');
    const halfLength = Math.floor(notesParts.length / 2);
    const group1 = notesParts.slice(0, halfLength).join('-');
    const group2 = notesParts.slice(halfLength).join('-');

    for (let i = 0; i < progressionLength; i++) {
      segments.push({
        chordIndex: i,
        notes: i % 2 === 0 ? group1 : group2,
        startOffset: i % 2 === 0 ? 0 : halfLength,
        endOffset: i % 2 === 0 ? halfLength : notesParts.length
      });
    }
    return segments;
  }

  private cascadeMode(sequence: ArpeggioSequence, progressionLength: number): ChordProgressionSegment[] {
    const segments: ChordProgressionSegment[] = [];
    const notesParts = sequence.notes.split('-');
    const window = 4;

    for (let i = 0; i < progressionLength; i++) {
      const startIdx = i % (notesParts.length - window + 1);
      const endIdx = startIdx + window;
      const segmentNotes = notesParts.slice(startIdx, endIdx).join('-');

      segments.push({
        chordIndex: i,
        notes: segmentNotes,
        startOffset: startIdx,
        endOffset: endIdx
      });
    }
    return segments;
  }

  private progressiveMode(sequence: ArpeggioSequence, progressionLength: number): ChordProgressionSegment[] {
    const segments: ChordProgressionSegment[] = [];
    const notesParts = sequence.notes.split('-');

    for (let i = 0; i < progressionLength; i++) {
      const progressRatio = (i + 1) / progressionLength;
      const notesCount = Math.max(2, Math.floor(notesParts.length * progressRatio));
      const segmentNotes = notesParts.slice(0, notesCount).join('-');

      segments.push({
        chordIndex: i,
        notes: segmentNotes,
        startOffset: 0,
        endOffset: notesCount
      });
    }
    return segments;
  }

  public getSuggestedDistributionMode(
    sequence: ArpeggioSequence,
    progressionLength: number
  ): DistributionMode {
    if (!sequence.isLong) return 'continuous';
    if (sequence.length === progressionLength) return 'even-split';
    if (sequence.length === progressionLength * 2) return 'grouped';
    return 'cascade';
  }

  public previewDistribution(
    sequence: ArpeggioSequence,
    progressionLength: number,
    config: DistributionConfig
  ): string[] {
    const segments = this.distributeSequence(sequence, progressionLength, config);
    return segments.map(seg => 'Chord ' + (seg.chordIndex + 1) + ': ' + seg.notes);
  }
}

export const globalSequenceDistributor = new SequenceDistributor();
