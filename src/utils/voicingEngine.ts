import {
  BlockPattern,
  ArpeggiatedPattern,
  BrokenPattern,
  ScheduledNote,
  VoicingEngineConfig,
  TimingTelemetry,
  TimeSignatureType
} from '../types/voicingPatterns';
import {
  validateBlockPattern,
  validateArpeggiatedPattern,
  validateBrokenPattern,
  getMeasureConstraints,
  getSubdivisionDuration,
  SeededRandom,
  createSafeBlockPatternFallback,
  createSafeArpeggiatedPatternFallback,
  createSafeBrokenPatternFallback
} from './patternValidator';

export class VoicingEngine {
  private config: VoicingEngineConfig;
  private telemetry: TimingTelemetry[] = [];

  constructor(config: Partial<VoicingEngineConfig> = {}) {
    this.config = {
      deterministic: config.deterministic ?? true,
      randomSeed: config.randomSeed ?? 12345,
      enableLogging: config.enableLogging ?? true,
      enableTelemetry: config.enableTelemetry ?? true
    };
  }

  private log(message: string, data?: any): void {
    if (this.config.enableLogging) {
      console.log(`[VoicingEngine] ${message}`, data || '');
    }
  }

  private recordTelemetry(scheduledNotes: number, totalDuration: number, expectedDuration: number): void {
    if (this.config.enableTelemetry) {
      const drift = Math.abs(totalDuration - expectedDuration);
      this.telemetry.push({
        scheduledNotes,
        totalDuration,
        expectedDuration,
        drift,
        timestamp: Date.now()
      });

      if (drift > 0.01) {
        this.log(`⚠️ Timing drift detected: ${(drift * 1000).toFixed(2)}ms`, {
          totalDuration,
          expectedDuration
        });
      }
    }
  }

  public getTelemetry(): TimingTelemetry[] {
    return [...this.telemetry];
  }

  public clearTelemetry(): void {
    this.telemetry = [];
  }

  public scheduleBlockPattern(
    pattern: BlockPattern,
    notes: string[],
    startTime: number,
    bpm: number,
    velocity: number
  ): ScheduledNote[] {
    const validation = validateBlockPattern(pattern);

    if (!validation.isValid) {
      this.log(`⚠️ Invalid block pattern, using fallback`, validation.errors);
      pattern = createSafeBlockPatternFallback(pattern.timeSignature);
    }

    if (validation.warnings.length > 0) {
      this.log(`⚠️ Block pattern warnings`, validation.warnings);
    }

    const scheduledNotes: ScheduledNote[] = [];
    const constraints = getMeasureConstraints(pattern.timeSignature);
    const secondsPerBeat = 60 / bpm;
    const measureDuration = constraints.beatsPerMeasure * secondsPerBeat;

    pattern.durations.forEach((duration) => {
      const noteStartTime = startTime + (duration.relativePosition * measureDuration);
      const noteDuration = duration.beats * secondsPerBeat * 0.95;

      notes.forEach((note) => {
        scheduledNotes.push({
          note,
          startTime: noteStartTime,
          duration: noteDuration,
          velocity
        });
      });
    });

    this.recordTelemetry(scheduledNotes.length, measureDuration, measureDuration);
    return scheduledNotes;
  }

  public scheduleArpeggiatedPattern(
    pattern: ArpeggiatedPattern,
    notes: string[],
    startTime: number,
    bpm: number,
    velocity: number
  ): ScheduledNote[] {
    const validation = validateArpeggiatedPattern(pattern);

    if (!validation.isValid) {
      this.log(`⚠️ Invalid arpeggiated pattern, using fallback`, validation.errors);
      pattern = createSafeArpeggiatedPatternFallback();
    }

    if (validation.warnings.length > 0) {
      this.log(`⚠️ Arpeggiated pattern warnings`, validation.warnings);
    }

    const scheduledNotes: ScheduledNote[] = [];
    const sequenceParts = pattern.sequence.split('-');
    const noteDuration = getSubdivisionDuration(pattern.subdivision, bpm);

    const swingAmount = pattern.swingAmount || 0;

    sequenceParts.forEach((value, index) => {
      const noteIndex = this.getNoteIndexFromPattern(value, notes.length);

      if (noteIndex < 0 || noteIndex >= notes.length) {
        this.log(`⚠️ Invalid note index ${noteIndex} for pattern value ${value}, skipping`);
        return;
      }

      const note = notes[noteIndex];
      let noteStartTime = startTime + (index * noteDuration);

      if (swingAmount > 0 && index % 2 === 1) {
        noteStartTime += noteDuration * (swingAmount - 0.5);
      }

      let noteVelocity = velocity;
      if (pattern.velocityVariation) {
        const variationFactor = 0.8 + (index / sequenceParts.length) * 0.4;
        noteVelocity = velocity * variationFactor;
      }

      scheduledNotes.push({
        note,
        startTime: noteStartTime,
        duration: noteDuration * 0.9,
        velocity: noteVelocity
      });
    });

    const totalDuration = sequenceParts.length * noteDuration;
    this.recordTelemetry(scheduledNotes.length, totalDuration, totalDuration);
    return scheduledNotes;
  }

  public scheduleBrokenPattern(
    pattern: BrokenPattern,
    notes: string[],
    startTime: number,
    bpm: number,
    velocity: number
  ): ScheduledNote[] {
    const validation = validateBrokenPattern(pattern);

    if (!validation.isValid) {
      this.log(`⚠️ Invalid broken pattern, using fallback`, validation.errors);
      pattern = createSafeBrokenPatternFallback();
    }

    if (validation.warnings.length > 0) {
      this.log(`⚠️ Broken pattern warnings`, validation.warnings);
    }

    const scheduledNotes: ScheduledNote[] = [];
    const secondsPerBeat = 60 / bpm;

    let random: SeededRandom | undefined;
    if (pattern.dropProbability && pattern.dropProbability > 0) {
      if (pattern.randomSeed !== undefined) {
        random = new SeededRandom(pattern.randomSeed);
      } else {
        random = new SeededRandom(Date.now());
        this.log(`⚠️ Using non-deterministic random for note dropping`);
      }
    }

    pattern.rhythmTemplate.forEach((rhythm, rhythmIndex) => {
      if (random && pattern.dropProbability && random.nextBoolean(pattern.dropProbability)) {
        this.log(`Note dropped at rhythm index ${rhythmIndex} (random drop)`);
        return;
      }

      const baseStartTime = startTime + (rhythm.relativePosition * secondsPerBeat * 4);
      const noteDuration = rhythm.beats * secondsPerBeat * 0.9;

      const microOffset = pattern.microTimingOffset || 0;
      const accent = pattern.accentPlacement[rhythmIndex] || 1.0;

      notes.forEach((note, noteIndex) => {
        const noteDelay = (noteIndex / notes.length) * noteDuration * 0.3;
        const noteStartTime = baseStartTime + noteDelay + (microOffset * rhythmIndex);

        scheduledNotes.push({
          note,
          startTime: noteStartTime,
          duration: noteDuration * 0.8,
          velocity: velocity * accent
        });
      });
    });

    const totalDuration = Math.max(...pattern.rhythmTemplate.map(r => r.relativePosition + r.beats)) * secondsPerBeat;
    this.recordTelemetry(scheduledNotes.length, totalDuration, totalDuration);
    return scheduledNotes;
  }

  private getNoteIndexFromPattern(value: string, noteCount: number): number {
    const numValue = parseInt(value);

    switch (numValue) {
      case 1:
        return 0;
      case 3:
        return Math.min(1, noteCount - 1);
      case 5:
        return Math.min(2, noteCount - 1);
      case 7:
        return Math.min(3, noteCount - 1);
      case 8:
        return noteCount - 1;
      case 9:
        return Math.min(4, noteCount - 1);
      case 11:
        return Math.min(5, noteCount - 1);
      case 13:
        return Math.min(6, noteCount - 1);
      default:
        return 0;
    }
  }

  public schedulePartialVoicing(
    notes: string[],
    partialMode: string,
    startTime: number,
    duration: number,
    velocity: number
  ): ScheduledNote[] {
    const scheduledNotes: ScheduledNote[] = [];
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
        case 'upper-structure':
          if (notes.length >= 4) {
            partialNotes = notes.slice(2);
          } else {
            partialNotes = [notes[notes.length - 1]];
          }
          break;
        case 'rootless':
          partialNotes = notes.slice(1);
          break;
        default:
          partialNotes = [notes[0], notes[1]];
      }
    } else {
      partialNotes = [...notes];
    }

    partialNotes.forEach((note) => {
      scheduledNotes.push({
        note,
        startTime,
        duration: duration * 0.95,
        velocity: velocity * 1.1
      });
    });

    return scheduledNotes;
  }

  public validateAndSchedule(
    patternType: 'block' | 'arpeggiated' | 'broken',
    pattern: BlockPattern | ArpeggiatedPattern | BrokenPattern,
    notes: string[],
    startTime: number,
    bpm: number,
    velocity: number
  ): ScheduledNote[] {
    try {
      switch (patternType) {
        case 'block':
          return this.scheduleBlockPattern(pattern as BlockPattern, notes, startTime, bpm, velocity);
        case 'arpeggiated':
          return this.scheduleArpeggiatedPattern(pattern as ArpeggiatedPattern, notes, startTime, bpm, velocity);
        case 'broken':
          return this.scheduleBrokenPattern(pattern as BrokenPattern, notes, startTime, bpm, velocity);
        default:
          this.log(`⚠️ Unknown pattern type: ${patternType}, using block fallback`);
          const fallback = createSafeBlockPatternFallback('4/4');
          return this.scheduleBlockPattern(fallback, notes, startTime, bpm, velocity);
      }
    } catch (error) {
      this.log(`❌ Error scheduling pattern`, error);
      const fallback = createSafeBlockPatternFallback('4/4');
      return this.scheduleBlockPattern(fallback, notes, startTime, bpm, velocity);
    }
  }
}

export const globalVoicingEngine = new VoicingEngine({
  deterministic: true,
  enableLogging: true,
  enableTelemetry: true
});
