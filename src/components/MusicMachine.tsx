import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Play, Volume2, Music, Square, RotateCcw, SkipBack, SkipForward, Mic, MicOff, Download, Save, FolderOpen, Plus, Trash2, Sliders, Radio } from 'lucide-react';
import VoicingPatternSelector from './VoicingPatternSelector';
import CustomPatternEditor from './CustomPatternEditor';
import EnhancedVoicingControls from './EnhancedVoicingControls';
import { TieredArpeggioSelector } from './TieredArpeggioSelector';
import { AdvancedStrumControls } from './AdvancedStrumControls';
import { ARPEGGIATED_PATTERNS, STRUM_PATTERNS, BROKEN_CHORD_PATTERNS, getPatternById } from '../data/voicingPatternLibrary';
import { StrumPattern, BrokenChordPattern, ChordVoicePosition, AdvancedStrumControls as AdvancedStrumControlsType } from '../types/voicingPatterns';
import * as Tone from 'tone';
import VoiceRecorder from './VoiceRecorder';
import VoiceRecorderV2 from './VoiceRecorderV2';
import VoiceChordMixer from './VoiceChordMixer';
import UnifiedVoiceRecorder from './UnifiedVoiceRecorder';
import { SessionBank } from './SessionBank';
import { SimpleAudioEffects } from './SimpleAudioEffects';
import { TempoAutomation } from './TempoAutomation';
import { globalAudioEffects } from '../utils/globalAudioEffects';
import { voiceLeadingEngine } from '../utils/voiceLeading';
import { chordProgressions, progressionCategories } from '../data/chordProgressions';
import { chordVocabulary, chordCategories } from '../data/chordVocabulary';
import { SoundFontManager, INSTRUMENTS, instrumentCategories } from '../utils/soundFontManager';
import { extendedChordLibrary, progressionTemplates, suggestedTags } from '../data/extendedChordLibrary';
import type { SongData } from '../utils/sessionBank';
import { supabase } from '../lib/supabase';
import { validateTempo, clampTempo, TEMPO_CONSTANTS } from '../utils/tempoValidator';
import type { ArpeggioSystemConfig } from '../types/arpeggioSystem';
// ADDITIVE: Real-Time Parameter Change System
import { useMusicMachineRealtimeIntegration } from '../hooks/useMusicMachineRealtimeIntegration';
import { RealtimeChangeSettings } from './RealtimeChangeSettings';
import { QueuedChangeIndicator } from './QueuedChangeIndicator';
// ADDITIVE: Sticky Controls System
import { useIsMobile } from '../hooks/useMediaQuery';
import '../styles/sticky-controls.css';

// Natural speech rate constant (400ms per word = 150 words per minute)
const NATURAL_WORD_DURATION_MS = 400;

interface MusicMachineProps {
  keySignature: string;
  tempo: string;
  isVisible: boolean;
  scriptureText?: string;
  onStateChange?: (state: { isPlaying: boolean; getMusicDestination: () => AudioNode | null; stopMusic: () => void }) => void;
}

export const MusicMachine = React.forwardRef<any, MusicMachineProps>(
  ({ keySignature: propKeySignature, tempo: propTempo, isVisible, scriptureText, onStateChange }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChord, setCurrentChord] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [selectedProgression, setSelectedProgression] = useState('classic');
  const [musicVolume, setMusicVolume] = useState(75);
  const [voiceVolume, setVoiceVolume] = useState(75);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speechRate, setSpeechRate] = useState(0.8);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [syncVoiceToMusic, setSyncVoiceToMusic] = useState(false);
  const [customProgression, setCustomProgression] = useState<string[]>([]);
  const [progressionLength, setProgressionLength] = useState(4);
  const [availableChords, setAvailableChords] = useState<string[]>([]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedSound, setSelectedSound] = useState('piano');
  const [useSoundFont, setUseSoundFont] = useState(true);
  const [soundFontLoading, setSoundFontLoading] = useState(false);
  const [showSessionBank, setShowSessionBank] = useState(false);
  const [chordType, setChordType] = useState<'triad' | '7th' | '9th' | '11th' | 'sus2' | 'sus4'>('triad');
  const [inversion, setInversion] = useState<number>(0);
  // Enhanced chord system
  const [selectedChordTypes, setSelectedChordTypes] = useState<Set<string>>(new Set(['triad']));
  const [chordQualityMode, setChordQualityMode] = useState<'key-aware' | 'all-major' | 'all-minor' | 'all-dom7' | 'all-diminished' | 'all-augmented' | 'all-sus2' | 'all-sus4' | 'major-minor-mix' | 'sus2-major-dim-mix' | 'dim-minor-mix' | 'augmented-major-mix' | 'sus4-dom7-mix' | 'mixed'>('key-aware');
  const [timeSignature, setTimeSignature] = useState<'4/4' | '3/4' | '6/8' | '2/4' | '5/4' | '7/8' | '3/8' | '12/8'>('4/4');
  const [customKeySignature, setCustomKeySignature] = useState(propKeySignature);
  const [customTempo, setCustomTempo] = useState(propTempo);
  const [useManualBPM, setUseManualBPM] = useState(false);
  const [manualBPM, setManualBPM] = useState(80);
  const [realTimeBPM, setRealTimeBPM] = useState(80);
  const [showTempoAutomation, setShowTempoAutomation] = useState(false);
  const [voicingTechnique, setVoicingTechnique] = useState<'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial'>('block');
  const [arpeggioPattern, setArpeggioPattern] = useState<string>('1-3-5-3');
  const [partialMode, setPartialMode] = useState<string>('root-third');
  const [brokenStyle, setBrokenStyle] = useState<string>('syncopated');

  const [selectedBlockPatternId, setSelectedBlockPatternId] = useState<string>('block-4quarter');
  const [selectedArpPatternId, setSelectedArpPatternId] = useState<string>('arp-1353');
  const [selectedStrumPatternId, setSelectedStrumPatternId] = useState<string>('strum-down-quarter');
  const [selectedBrokenPatternId, setSelectedBrokenPatternId] = useState<string>('broken-standard');
  const [selectedBrokenChordPatternId, setSelectedBrokenChordPatternId] = useState<string>('broken-root-third-fifth');
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  const [showAdvancedPatterns, setShowAdvancedPatterns] = useState(false);
  const [savedProgressions, setSavedProgressions] = useState<any[]>([]);
  const [showProgressionManager, setShowProgressionManager] = useState(false);
  const [progressionName, setProgressionName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string>('');
  const [recordedMusicBlob, setRecordedMusicBlob] = useState<Blob | null>(null);
  const [showAudioEffects, setShowAudioEffects] = useState(false);
  const [useVoiceLeading, setUseVoiceLeading] = useState(true);
  const [showTieredArpeggio, setShowTieredArpeggio] = useState(false);
  const [tieredArpeggioConfig, setTieredArpeggioConfig] = useState<ArpeggioSystemConfig | null>(null);
  const [showAdvancedStrumControls, setShowAdvancedStrumControls] = useState(false);
  const [advancedStrumControls, setAdvancedStrumControls] = useState<AdvancedStrumControlsType>({
    densityMultiplier: 1.0,
    swingAmount: 0,
    syncopationShift: 0,
    ghostNoteIntensity: 0,
    accentPattern: 'none'
  });

  const synthRef = useRef<Tone.PolySynth | null>(null);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wordsRef = useRef<string[]>([]);
  const voiceTrackActiveRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const soundFontManagerRef = useRef<SoundFontManager | null>(null);

  // ADDITIVE: Expose playMusic method to parent components for auto-play on "Start Recording"
  useImperativeHandle(ref, () => ({
    playMusic: async () => {
      if (!isPlaying) {
        await playMusic();
      }
    },
    stopMusic: () => {
      if (isPlaying) {
        stopMusic();
      }
    },
    isPlaying: () => isPlaying,
    togglePlay
  }));

  // ADDITIVE: Keyboard shortcuts for MusicMachine
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if MusicMachine is visible and no input/textarea is focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement instanceof HTMLInputElement ||
                           activeElement instanceof HTMLTextAreaElement ||
                           activeElement instanceof HTMLSelectElement;

      if (isInputFocused) return;

      // Spacebar: Toggle play/pause
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isPlaying]);

  const tempoMap: { [key: string]: number } = {
    'Largo': 40,
    'Adagio': 60,
    'Andante': 80,
    'Andante con moto': 90,
    'Moderato': 100,
    'Allegro': 120,
    'Maestoso': 70
  };

  const keySignatures = [
    'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major', 'F Major', 'Bb Major', 'Eb Major', 'Ab Major', 'Db Major', 'Gb Major',
    'A Minor', 'E Minor', 'B Minor', 'F# Minor', 'C# Minor', 'G# Minor', 'D Minor', 'G Minor', 'C Minor', 'F Minor', 'Bb Minor', 'Eb Minor'
  ];

  const tempoOptions = ['Largo', 'Adagio', 'Andante', 'Andante con moto', 'Moderato', 'Allegro', 'Maestoso'];

  const [selectedCategory, setSelectedCategory] = useState<string>('Contemporary');

  // ========== PHASE 1: ENHANCED PROGRESSION FEATURES (ADDITIVE) ==========
  const [showAdvancedChords, setShowAdvancedChords] = useState(false);
  const [copiedChord, setCopiedChord] = useState<string | null>(null);
  const [draggedChordIndex, setDraggedChordIndex] = useState<number | null>(null);
  const [progressionTags, setProgressionTags] = useState<string[]>([]);
  const [progressionDescription, setProgressionDescription] = useState('');
  const [progressionStyle, setProgressionStyle] = useState('custom');
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'played'>('recent');
  // ========== END PHASE 1 FEATURES ==========

  // ========== REAL-TIME PARAMETER CHANGE SYSTEM (ADDITIVE) ==========
  // This system allows parameters to be changed during playback and applied at specific timing boundaries
  const realtimeIntegration = useMusicMachineRealtimeIntegration({
    isPlaying,
    currentSetters: {
      setVoicingTechnique,
      setSelectedArpPatternId,
      setSelectedBlockPatternId,
      setSelectedStrumPatternId,
      setSelectedBrokenChordPatternId,
      setManualBPM,
      setMusicVolume,
      setVoiceVolume,
      setSelectedSound,
      setInversion,
      setChordType,
      setPartialMode
    },
    getCurrentValues: () => ({
      voicingTechnique,
      selectedArpPatternId,
      selectedBlockPatternId,
      selectedStrumPatternId,
      selectedBrokenChordPatternId,
      manualBPM,
      musicVolume,
      voiceVolume,
      selectedSound,
      inversion,
      chordType,
      partialMode
    })
  });
  // ========== END REAL-TIME SYSTEM ==========

  // ========== ADDITIVE: STICKY CONTROLS DETECTION ==========
  const isMobile = useIsMobile();
  // ========== END STICKY CONTROLS ==========

  const soundPresets: any = {
    piano: {
      name: 'Piano',
      oscillator: { type: 'sine' as const, partials: [1, 0, 2, 0, 3] },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.4, release: 1.2 }
    },
    organ: {
      name: 'Organ',
      oscillator: { type: 'sine' as const, partials: [1, 1, 1, 0.7, 0.5, 0.3] },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.2 }
    },
    strings: {
      name: 'Strings',
      oscillator: { type: 'sawtooth' as const },
      envelope: { attack: 0.8, decay: 0.3, sustain: 0.8, release: 2 }
    },
    choir: {
      name: 'Choir',
      oscillator: { type: 'sine' as const, partials: [1, 0.5, 0.3, 0.2] },
      envelope: { attack: 0.4, decay: 0.2, sustain: 0.9, release: 1.5 }
    },
    brass: {
      name: 'Brass',
      oscillator: { type: 'sawtooth' as const },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.5 }
    },
    bell: {
      name: 'Bell',
      oscillator: { type: 'sine' as const, partials: [1, 0, 1.5, 0, 2] },
      envelope: { attack: 0.001, decay: 1.5, sustain: 0.05, release: 3 }
    },
    pad: {
      name: 'Pad',
      oscillator: { type: 'sine' as const, partials: [1, 0.5, 0.3, 0.2, 0.1] },
      envelope: { attack: 1.5, decay: 0.5, sustain: 0.9, release: 3 }
    },
    harp: {
      name: 'Harp',
      oscillator: { type: 'triangle' as const },
      envelope: { attack: 0.001, decay: 1.2, sustain: 0.05, release: 2 }
    }
  };

  // Report state changes to parent
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        isPlaying,
        getMusicDestination: () => {
          if (useSoundFont && soundFontManagerRef.current) {
            return soundFontManagerRef.current.getEffectsInputNode();
          }
          return volumeNodeRef.current;
        },
        stopMusic
      });
    }
  }, [isPlaying, onStateChange, useSoundFont]);

  useEffect(() => {
    soundFontManagerRef.current = new SoundFontManager();

    // Initialize global audio effects
    const initEffects = async () => {
      if (!globalAudioEffects.isInitialized()) {
        try {
          await globalAudioEffects.initialize();
          console.log('Audio effects initialized');

          // Connect SoundFont to effects chain
          if (soundFontManagerRef.current && globalAudioEffects.effectsChain) {
            const effectsInputNode = globalAudioEffects.effectsChain.input as unknown as AudioNode;
            soundFontManagerRef.current.connectToEffects(effectsInputNode);
            console.log('SoundFont connected to effects chain');
          }
        } catch (error) {
          console.error('Failed to initialize audio effects:', error);
        }
      }
    };
    initEffects();

    // Preload the default piano instrument
    if (useSoundFont && soundFontManagerRef.current) {
      loadSoundFontInstrument('piano');
    }

    return () => {
      if (soundFontManagerRef.current) {
        soundFontManagerRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Load instrument when SoundFont mode is enabled
    if (useSoundFont && soundFontManagerRef.current && selectedSound) {
      loadSoundFontInstrument(selectedSound);
    }
  }, [useSoundFont, selectedSound]);

  // Update volume in real-time when slider changes
  useEffect(() => {
    // Update Tone.js synth volume
    if (volumeNodeRef.current) {
      volumeNodeRef.current.volume.value = Tone.gainToDb(musicVolume / 100);
    }
    // Update SoundFont volume
    if (soundFontManagerRef.current) {
      soundFontManagerRef.current.setVolume(musicVolume / 100);
    }
  }, [musicVolume]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      const preferredVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      if (preferredVoice) {
        setSelectedVoice(preferredVoice.name);
      }
    };
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  useEffect(() => {
    if (scriptureText) {
      console.log('[Words] Scripture text received:', scriptureText.substring(0, 100) + '...');

      // Remove reference prefix if it exists (e.g., "Psalms:23:1: " or "Isa:40:31: ")
      let cleanText = scriptureText;
      const refPrefixMatch = cleanText.match(/^[A-Za-z]+:\d+[:\d-]*:\s*/);
      if (refPrefixMatch) {
        cleanText = cleanText.substring(refPrefixMatch[0].length);
        console.log('[Words] Removed reference prefix:', refPrefixMatch[0]);
      }

      const words = cleanText.split(/\s+/).map(word =>
        word.replace(/[.,;:!?"""'']/g, '')
      ).filter(word => word.length > 0);
      wordsRef.current = words;
      console.log('[Words] Split into', words.length, 'words. First 5:', words.slice(0, 5));
      console.log('[Words] wordsRef.current[0]:', wordsRef.current[0]);
    } else {
      console.log('[Words] No scripture text received');
    }
  }, [scriptureText]);

  // ADDITIVE: Manage body class for mobile fixed controls padding
  useEffect(() => {
    if (isMobile && isVisible) {
      document.body.classList.add('music-controls-active');
    } else {
      document.body.classList.remove('music-controls-active');
    }

    return () => {
      document.body.classList.remove('music-controls-active');
    };
  }, [isMobile, isVisible]);

  useEffect(() => {
    const setupSynth = async () => {
      try {
        if (synthRef.current) {
          synthRef.current.dispose();
        }
        if (volumeNodeRef.current) {
          volumeNodeRef.current.dispose();
        }

        // Ensure Tone context is ready
        if (Tone.context.state === 'suspended') {
          await Tone.start();
        }

        // Ensure effects are initialized before connecting
        if (!globalAudioEffects.isInitialized()) {
          try {
            await globalAudioEffects.initialize();
          } catch (error) {
            console.error('Could not initialize effects in setupSynth:', error);
            // Continue without effects
          }
        }

        const soundConfig = soundPresets[selectedSound];
        volumeNodeRef.current = new Tone.Volume(Tone.gainToDb(musicVolume / 100));

        // Connect to effects chain if initialized, otherwise to destination
        if (globalAudioEffects.isInitialized() && globalAudioEffects.effectsChain) {
          volumeNodeRef.current.connect(globalAudioEffects.effectsChain);
          console.log('Synth connected to effects chain');
        } else {
          volumeNodeRef.current.toDestination();
          console.log('Synth connected directly to destination');
        }

        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: soundConfig.oscillator,
          envelope: soundConfig.envelope
        }).connect(volumeNodeRef.current);
      } catch (error) {
        console.error('Error in setupSynth:', error);
      }
    };

    setupSynth().catch(err => console.error('Setup synth error:', err));

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
      if (volumeNodeRef.current) {
        volumeNodeRef.current.dispose();
        volumeNodeRef.current = null;
      }
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (voiceIntervalRef.current) {
        clearInterval(voiceIntervalRef.current);
      }
    };
  }, [selectedSound]);

  useEffect(() => {
    if (volumeNodeRef.current) {
      volumeNodeRef.current.volume.value = Tone.gainToDb(musicVolume / 100);
    }
  }, [musicVolume]);

  useEffect(() => {
    const isMinor = customKeySignature.includes('Minor') || customKeySignature.includes('m');
    const chordOptions = [];
    if (isMinor) {
      chordOptions.push('i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII', 'i7', 'ii°7', 'III7', 'iv7', 'v7', 'VI7', 'VII7', 'bII', 'bVI', 'bVII');
    } else {
      chordOptions.push('I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°', 'I7', 'ii7', 'iii7', 'IV7', 'V7', 'vi7', 'vii°7', 'bII', 'bIII', 'bVI', 'bVII');
    }
    setAvailableChords(chordOptions);

    if (customProgression.length === 0) {
      const defaultProg = isMinor ? ['i', 'VI', 'III', 'VII'] : ['I', 'vi', 'IV', 'V'];
      setCustomProgression(defaultProg.slice(0, progressionLength));
    }
  }, [customKeySignature, progressionLength]);

  // Debug: Log when voicing patterns change
  useEffect(() => {
    console.log('[Pattern State Changed]', {
      technique: voicingTechnique,
      blockPattern: selectedBlockPatternId,
      arpPattern: selectedArpPatternId,
      brokenPattern: selectedBrokenPatternId,
      partialMode: partialMode
    });
  }, [voicingTechnique, selectedBlockPatternId, selectedArpPatternId, selectedBrokenPatternId, partialMode]);

  const getMidiNote = (midiNumber: number): string => {
    return Tone.Frequency(midiNumber, 'midi').toNote();
  };

  const getNoteMidi = (noteName: string): number => {
    const noteMap: { [key: string]: number } = {
      'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
      'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
      'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
    };
    return noteMap[noteName] || 60;
  };

  // Helper function to determine chord quality based on mode and key
  const determineChordQuality = (romanNumeral: string, originalQuality: string, keyIsMinor: boolean): string => {
    // If user wants key-aware (diatonic), respect the key
    if (chordQualityMode === 'key-aware') {
      return originalQuality; // Use the quality determined by the scale degree
    }

    // Override with user-selected quality mode
    switch (chordQualityMode) {
      case 'all-major':
        return 'major';
      case 'all-minor':
        return 'minor';
      case 'all-dom7':
        return 'dominant7';
      case 'all-diminished':
        return 'diminished';
      case 'all-augmented':
        return 'augmented';
      case 'all-sus2':
        return 'sus2';
      case 'all-sus4':
        return 'sus4';
      case 'major-minor-mix':
        // Alternate between major and minor
        return Math.random() > 0.5 ? 'major' : 'minor';
      case 'sus2-major-dim-mix':
        // Cycle through sus2, major, and diminished
        const sus2MajDim = ['sus2', 'major', 'diminished'];
        return sus2MajDim[Math.floor(Math.random() * 3)];
      case 'dim-minor-mix':
        // Alternate between diminished and minor
        return Math.random() > 0.5 ? 'diminished' : 'minor';
      case 'augmented-major-mix':
        // Alternate between augmented and major
        return Math.random() > 0.5 ? 'augmented' : 'major';
      case 'sus4-dom7-mix':
        // Alternate between sus4 and dominant7
        return Math.random() > 0.5 ? 'sus4' : 'dominant7';
      case 'mixed':
        // Full random mix of all qualities
        const allQualities = ['major', 'minor', 'diminished', 'augmented', 'sus2', 'sus4', 'dominant7'];
        return allQualities[Math.floor(Math.random() * allQualities.length)];
      default:
        return originalQuality;
    }
  };

  // Helper function to get intervals based on quality and type
  const getChordIntervals = (quality: string, currentChordType: string): number[] => {
    const qualityLower = quality.toLowerCase();

    // Diminished chords
    if (qualityLower.includes('dim') || qualityLower.includes('°')) {
      if (currentChordType === '7th') return [0, 3, 6, 9]; // dim7
      return [0, 3, 6]; // dim triad
    }

    // Augmented chords
    if (qualityLower.includes('aug') || qualityLower.includes('+')) {
      if (currentChordType === '7th') return [0, 4, 8, 10]; // aug7
      return [0, 4, 8]; // aug triad
    }

    // Dominant 7th (always major triad + minor 7th)
    if (qualityLower.includes('dominant') || quality === 'dominant7') {
      if (currentChordType === '9th') return [0, 4, 7, 10, 14]; // dom9
      if (currentChordType === '11th') return [0, 4, 7, 10, 14, 17]; // dom11
      if (currentChordType === '7th') return [0, 4, 7, 10]; // dom7
      return [0, 4, 7]; // major triad as fallback
    }

    // Minor chords
    if (qualityLower.includes('min') || quality.includes('i') || quality.includes('iv') || quality.includes('v') || quality.includes('ii')) {
      if (currentChordType === '7th') return [0, 3, 7, 10]; // min7
      if (currentChordType === '9th') return [0, 3, 7, 10, 14]; // min9
      if (currentChordType === '11th') return [0, 3, 7, 10, 14, 17]; // min11
      return [0, 3, 7]; // min triad
    }

    // Major chords (default)
    if (currentChordType === '7th') return [0, 4, 7, 11]; // maj7
    if (currentChordType === '9th') return [0, 4, 7, 11, 14]; // maj9
    if (currentChordType === '11th') return [0, 4, 7, 11, 14, 17]; // maj11
    if (currentChordType === 'sus2') return [0, 2, 7];
    if (currentChordType === 'sus4') return [0, 5, 7];
    return [0, 4, 7]; // major triad
  };

  const buildChord = (rootNote: string, quality: string, currentChordType: string, inversionNum: number): string[] => {
    const rootMidi = getNoteMidi(rootNote);

    // Use the new interval helper function
    const intervals = getChordIntervals(quality, currentChordType);

    let notes = intervals.map(interval => getMidiNote(rootMidi + interval));

    for (let i = 0; i < inversionNum && i < notes.length; i++) {
      const note = notes.shift();
      if (note) {
        const noteName = note.replace(/\d+$/, '');
        const octave = parseInt(note.match(/\d+$/)?.[0] || '4');
        notes.push(noteName + (octave + 1));
      }
    }

    return notes;
  };

  const buildChordRootPosition = (rootNote: string, quality: string, currentChordType: string): string[] => {
    const rootMidi = getNoteMidi(rootNote);
    const intervals = getChordIntervals(quality, currentChordType);
    return intervals.map(interval => getMidiNote(rootMidi + interval));
  };

  const getScaleDegrees = (key: string): string[] => {
    const baseKey = key.replace(' Major', '').replace(' Minor', '').replace('m', '');
    const keyMap: { [key: string]: string[] } = {
      'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
      'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
      'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
      'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
      'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
      'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
      'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
      'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
      'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
      'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
      'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
    };
    return keyMap[baseKey] || keyMap['C'];
  };

  const generateChordProgression = (key: string, progressionType: string, customChords?: string[]) => {
    const isMinor = key.includes('Minor') || key.includes('m');
    const scale = getScaleDegrees(key);

    let romanNumerals: string[];
    if (customChords && isCustomMode && customChords.length > 0) {
      romanNumerals = customChords;
    } else {
      const progression = chordProgressions[progressionType];
      if (!progression) {
        romanNumerals = isMinor ? ['i', 'VI', 'III', 'VII'] : ['I', 'vi', 'IV', 'V'];
      } else {
        romanNumerals = isMinor ? progression.minor : progression.major;
      }
    }

    // Safety check - ensure we have roman numerals
    if (!romanNumerals || romanNumerals.length === 0) {
      romanNumerals = isMinor ? ['i', 'VI', 'III', 'VII'] : ['I', 'vi', 'IV', 'V'];
    }

    const chords = romanNumerals.map(romanNumeral => {
      let degree = 0;
      let quality = 'major';

      const cleanRoman = romanNumeral.replace(/[°7b#Δø]/g, '');
      if (cleanRoman.toLowerCase() === 'i') degree = 0;
      else if (cleanRoman.toLowerCase() === 'ii') degree = 1;
      else if (cleanRoman.toLowerCase() === 'iii') degree = 2;
      else if (cleanRoman.toLowerCase() === 'iv') degree = 3;
      else if (cleanRoman.toLowerCase() === 'v') degree = 4;
      else if (cleanRoman.toLowerCase() === 'vi') degree = 5;
      else if (cleanRoman.toLowerCase() === 'vii') degree = 6;

      if (romanNumeral.includes('b')) {
        const chordRoot = scale[Math.max(0, degree - 1)] || scale[degree];
        const chordNotes = buildChord(chordRoot, quality, chordType, inversion);
        const rootPositionNotes = buildChordRootPosition(chordRoot, quality, chordType);
        return { name: `${chordRoot} ${quality}`, notes: chordNotes, rootPositionNotes, romanNumeral, root: chordRoot };
      }

      if (cleanRoman === cleanRoman.toLowerCase()) {
        quality = 'minor';
      }
      if (romanNumeral.includes('°') || romanNumeral.includes('dim')) {
        quality = 'diminished';
      }

      // Apply quality mode override
      const finalQuality = determineChordQuality(romanNumeral, quality, isMinor);

      const chordRoot = scale[degree];

      // When voice leading is ON, ignore chord type/inversion settings and let voice leading optimize
      // When voice leading is OFF, use chord type and inversion settings
      const chordNotes = useVoiceLeading
        ? buildChordRootPosition(chordRoot, finalQuality, chordType)
        : buildChord(chordRoot, finalQuality, chordType, inversion);
      const rootPositionNotes = buildChordRootPosition(chordRoot, finalQuality, chordType);

      return { name: `${chordRoot} ${finalQuality}`, notes: chordNotes, rootPositionNotes, romanNumeral, root: chordRoot };
    });

    if (useVoiceLeading) {
      voiceLeadingEngine.reset();
      return voiceLeadingEngine.applyVoiceLeadingToProgression(chords);
    }

    return chords;
  };

  const updateProgressionLength = (newLength: number) => {
    setProgressionLength(newLength);
    const currentProg = [...customProgression];
    if (newLength > currentProg.length) {
      const isMinor = customKeySignature.includes('Minor');
      const defaultChord = isMinor ? 'i' : 'I';
      while (currentProg.length < newLength) {
        currentProg.push(defaultChord);
      }
    } else {
      currentProg.splice(newLength);
    }
    setCustomProgression(currentProg);
  };

  const updateChordAtPosition = (position: number, newChord: string) => {
    const newProgression = [...customProgression];
    newProgression[position] = newChord;
    setCustomProgression(newProgression);
  };

  // ========== PHASE 1: NEW PROGRESSION HANDLERS (ADDITIVE) ==========

  // Copy chord at position
  const copyChord = (index: number) => {
    setCopiedChord(customProgression[index]);
  };

  // Paste copied chord at position
  const pasteChord = (index: number) => {
    if (copiedChord) {
      const newProgression = [...customProgression];
      newProgression[index] = copiedChord;
      setCustomProgression(newProgression);
    }
  };

  // Duplicate chord (insert copy after current)
  const duplicateChord = (index: number) => {
    if (customProgression.length >= 24) {
      alert('Maximum progression length (24 chords) reached');
      return;
    }
    const newProgression = [...customProgression];
    newProgression.splice(index + 1, 0, customProgression[index]);
    setCustomProgression(newProgression);
    setProgressionLength(newProgression.length);
  };

  // Delete chord at position
  const deleteChord = (index: number) => {
    if (customProgression.length <= 2) {
      alert('Progression must have at least 2 chords');
      return;
    }
    const newProgression = [...customProgression];
    newProgression.splice(index, 1);
    setCustomProgression(newProgression);
    setProgressionLength(newProgression.length);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedChordIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedChordIndex === null || draggedChordIndex === targetIndex) return;

    const newProgression = [...customProgression];
    const draggedChord = newProgression[draggedChordIndex];
    newProgression.splice(draggedChordIndex, 1);
    newProgression.splice(targetIndex, 0, draggedChord);
    setCustomProgression(newProgression);
    setDraggedChordIndex(null);
  };

  // Load template progression
  const loadTemplate = (template: typeof progressionTemplates[0]) => {
    if (template.chords.length > 24) {
      alert('Template exceeds maximum progression length (24 chords)');
      return;
    }
    setCustomProgression(template.chords);
    setProgressionLength(template.chords.length);
    setProgressionStyle(template.style);
    setProgressionTags(template.tags);
    setProgressionDescription(template.description);
    setShowTemplates(false);
  };

  // Toggle tag in current progression
  const toggleTag = (tag: string) => {
    setProgressionTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Toggle filter tag for searching
  const toggleFilterTag = (tag: string) => {
    setFilterTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Get extended chords based on current key
  const getExtendedChords = () => {
    const isMinor = customKeySignature.includes('Minor');
    return extendedChordLibrary[isMinor ? 'minor' : 'major'];
  };

  // Filter saved progressions based on search/tags/favorites
  const getFilteredProgressions = () => {
    let filtered = [...savedProgressions];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prog =>
        prog.name.toLowerCase().includes(query) ||
        prog.description?.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (filterTags.length > 0) {
      filtered = filtered.filter(prog =>
        prog.tags && filterTags.some(tag => prog.tags.includes(tag))
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(prog => prog.is_favorite);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'played':
          return (b.times_played || 0) - (a.times_played || 0);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  };

  // Toggle favorite status
  const toggleFavorite = async (progressionId: string) => {
    try {
      const progression = savedProgressions.find(p => p.id === progressionId);
      if (!progression) return;

      const { error } = await supabase
        .from('chord_progressions')
        .update({ is_favorite: !progression.is_favorite })
        .eq('id', progressionId);

      if (error) throw error;
      loadSavedProgressions();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Increment play count when progression is loaded/played
  const incrementPlayCount = async (progressionId: string) => {
    try {
      await supabase.rpc('increment_progression_play_count', {
        progression_id: progressionId
      });
    } catch (error) {
      console.error('Error incrementing play count:', error);
    }
  };

  // ========== END PHASE 1 NEW HANDLERS ==========

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = () => {
    if (Tone.Transport.state === 'started') {
      setCurrentTime(Tone.Transport.seconds);
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(updateProgress, 100);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const calculateWordTiming = (totalDuration: number, wordCount: number) => {
    if (wordCount === 0) return { wordDuration: 0 };

    // If sync to music is enabled, calculate based on music duration (legacy behavior)
    if (syncVoiceToMusic) {
      return { wordDuration: (totalDuration * 1000) / wordCount };
    }

    // Otherwise, use natural speech rate for intelligibility (400ms per word)
    return { wordDuration: NATURAL_WORD_DURATION_MS };
  };

  const initializeVoiceTrack = async (totalDuration: number) => {
    if (!voiceEnabled || wordsRef.current.length === 0) {
      console.log('[Voice] Not initialized - voiceEnabled:', voiceEnabled, 'words:', wordsRef.current.length);
      return;
    }

    console.log('[Voice] Initializing voice track - words:', wordsRef.current.length, 'duration:', totalDuration);

    stopVoiceTrack();
    const { wordDuration } = calculateWordTiming(totalDuration, wordsRef.current.length);

    let currentWordIdx = 0;
    voiceTrackActiveRef.current = true;

    const speakNextWord = () => {
      if (!voiceTrackActiveRef.current) {
        console.log('[Voice] Skipping - voice track not active');
        return;
      }

      if (currentWordIdx < wordsRef.current.length) {
        const word = wordsRef.current[currentWordIdx];
        console.log('[Voice] Speaking word', currentWordIdx + 1, 'of', wordsRef.current.length, ':', word);

        // Don't cancel immediately - let words finish naturally
        // Only cancel if we're way behind (more than 2 words queued)
        if (speechSynthesis.pending) {
          console.log('[Voice] Speech queue has pending utterances');
        }

        const utterance = new SpeechSynthesisUtterance(word);
        const voice = availableVoices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;

        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        utterance.volume = voiceVolume / 100;

        utterance.onstart = () => {
          console.log('[Voice] Started speaking:', word);
        };

        utterance.onend = () => {
          console.log('[Voice] Finished speaking:', word);
        };

        utterance.onerror = (event) => {
          console.error('[Voice] Speech error:', event);
        };

        setCurrentWordIndex(currentWordIdx);
        speechSynthesis.speak(utterance);

        currentWordIdx++;
        if (currentWordIdx >= wordsRef.current.length) {
          console.log('[Voice] Reached end, looping back to start');
          currentWordIdx = 0;
        }
      }
    };

    speakNextWord();
    voiceIntervalRef.current = setInterval(speakNextWord, wordDuration);
    console.log('[Voice] Voice track initialized with', wordDuration, 'ms per word');
  };

  const stopVoiceTrack = () => {
    voiceTrackActiveRef.current = false;
    speechSynthesis.cancel();
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
      voiceIntervalRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const dest = Tone.context.createMediaStreamDestination();
      if (volumeNodeRef.current) {
        volumeNodeRef.current.connect(dest);
      }

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(dest.stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioURL(url);
        setRecordedMusicBlob(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const loadSoundFontInstrument = async (instrumentKey: string) => {
    if (!soundFontManagerRef.current) return false;

    setSoundFontLoading(true);
    const success = await soundFontManagerRef.current.loadInstrument(instrumentKey);
    setSoundFontLoading(false);

    if (!success) {
      console.warn('Failed to load SoundFont, falling back to synth');
      setUseSoundFont(false);
    }

    return success;
  };

  const handleInstrumentChange = async (newInstrument: string) => {
    setSelectedSound(newInstrument);

    if (useSoundFont && soundFontManagerRef.current) {
      await loadSoundFontInstrument(newInstrument);
    }
  };

  const arpeggioPatterns = [
    '1-3-5-3', '1-5-3-5', '1-3-5-1', '1-5-3-1',
    '3-1-5-3', '3-5-1-5', '5-3-1-3', '5-1-3-5',
    '1-3-5', '1-5-3', '3-1-5', '3-5-1', '5-1-3', '5-3-1',
    '1-3-5-8', '1-5-8-5', '8-5-3-1'
  ];

  const saveProgression = async () => {
    if (!progressionName.trim()) {
      alert('Please enter a name for your progression');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to save progressions');
        return;
      }

      const { error } = await supabase.from('chord_progressions').insert({
        user_id: user.id,
        name: progressionName,
        chords: customProgression,
        key_signature: customKeySignature,
        tempo: useManualBPM ? `${manualBPM} BPM` : customTempo,
        voicing_technique: voicingTechnique,
        arpeggio_pattern: arpeggioPattern,
        partial_mode: partialMode,
        broken_style: brokenStyle,
        inversion: inversion,
        chord_quality_mode: chordQualityMode,
        time_signature: timeSignature,
        chord_type: chordType,
        // Phase 1: New fields
        tags: progressionTags,
        description: progressionDescription,
        style: progressionStyle
      });

      if (error) throw error;

      alert('Progression saved successfully!');
      setProgressionName('');
      loadSavedProgressions();
    } catch (error) {
      console.error('Error saving progression:', error);
      alert('Failed to save progression');
    }
  };

  const loadSavedProgressions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chord_progressions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedProgressions(data || []);
    } catch (error) {
      console.error('Error loading progressions:', error);
    }
  };

  const loadProgression = (progression: any) => {
    setCustomProgression(progression.chords);
    setProgressionLength(progression.chords.length);
    setCustomKeySignature(progression.key_signature);
    setVoicingTechnique(progression.voicing_technique);
    setArpeggioPattern(progression.arpeggio_pattern);
    setInversion(progression.inversion);
    // Load new enhanced features if they exist
    if (progression.chord_quality_mode) {
      setChordQualityMode(progression.chord_quality_mode);
    }
    if (progression.time_signature) {
      setTimeSignature(progression.time_signature);
    }
    if (progression.chord_type) {
      setChordType(progression.chord_type);
    }
    if (progression.partial_mode) {
      setPartialMode(progression.partial_mode);
    }
    if (progression.broken_style) {
      setBrokenStyle(progression.broken_style);
    }
    // Phase 1: Load new fields
    if (progression.tags) {
      setProgressionTags(progression.tags);
    }
    if (progression.description) {
      setProgressionDescription(progression.description);
    }
    if (progression.style) {
      setProgressionStyle(progression.style);
    }
    // Increment play count
    if (progression.id) {
      incrementPlayCount(progression.id);
    }
    setShowProgressionManager(false);
  };

  const combineProgressions = (prog1: any, prog2: any) => {
    const combined = [...prog1.chords, ...prog2.chords];
    if (combined.length > 24) {
      alert('Combined progression exceeds 24 chords limit');
      return;
    }
    setCustomProgression(combined);
    setProgressionLength(combined.length);
  };

  const deleteProgression = async (id: string) => {
    if (!confirm('Are you sure you want to delete this progression?')) return;

    try {
      const { error } = await supabase
        .from('chord_progressions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSavedProgressions();
    } catch (error) {
      console.error('Error deleting progression:', error);
      alert('Failed to delete progression');
    }
  };

  React.useEffect(() => {
    loadSavedProgressions();
  }, []);

  const getOctaveNote = (note: string): string => {
    // Extract note name and octave number
    const match = note.match(/^([A-G][#b]?)(\d+)$/);
    if (match) {
      const noteName = match[1];
      const octave = parseInt(match[2]);
      return `${noteName}${octave + 1}`;
    }
    return note;
  };

  const getNoteFromPattern = (notes: string[], patternValue: string): string => {
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
        return getOctaveNote(notes[0]);
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
  };

  // Helper function to map ChordVoicePosition to actual note
  const getNoteFromVoicePosition = (notes: string[], position: ChordVoicePosition): string | null => {
    if (notes.length === 0) return null;

    switch (position) {
      case 'root': return notes[0] || null;
      case 'third': return notes[1] || null;
      case 'fifth': return notes[2] || null;
      case 'seventh': return notes[3] || null;
      case 'ninth': return notes[4] || null;
      case 'eleventh': return notes[5] || null;
      case 'thirteenth': return notes[6] || null;
      default: return notes[0] || null;
    }
  };

  const playToneVoicing = (
    notes: string[],
    time: number,
    technique: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial',
    pattern: string
  ) => {
    if (!synthRef.current) return;

    switch (technique) {
      case 'block':
        // Play all notes simultaneously
        synthRef.current.triggerAttackRelease(notes, '1n', time);
        break;

      case 'arpeggiated':
        // Play notes in sequence according to pattern
        const patternValues = pattern.split('-');
        const noteDelay = Tone.Time('1n').toSeconds() / patternValues.length;

        patternValues.forEach((value, i) => {
          const note = getNoteFromPattern(notes, value);
          synthRef.current!.triggerAttackRelease(note, noteDelay * 1.2, time + (i * noteDelay));
        });
        break;

      case 'strum':
        // STRUM: Play notes ONE AT A TIME in sequence (guitar strum effect)
        {
          const strumPatternData = STRUM_PATTERNS.find(p => p.id === selectedStrumPatternId);

          if (strumPatternData) {
            // Use the specific pattern from Advanced Options
            let { rhythmTemplate, direction, velocityCurve, articulation } = strumPatternData;

            // Apply density multiplier (affects number of strums)
            let modifiedTemplate = [...rhythmTemplate];
            if (advancedStrumControls.densityMultiplier !== 1.0) {
              if (advancedStrumControls.densityMultiplier < 1.0) {
                // Reduce density - keep only some strums
                const keepRatio = advancedStrumControls.densityMultiplier;
                modifiedTemplate = rhythmTemplate.filter((_, idx) =>
                  idx % Math.ceil(1 / keepRatio) === 0
                );
              } else {
                // Increase density - add more strums
                const multiplier = Math.floor(advancedStrumControls.densityMultiplier);
                const newTemplate = [];
                const spacing = 1.0 / (rhythmTemplate.length * multiplier);
                for (let i = 0; i < rhythmTemplate.length * multiplier; i++) {
                  newTemplate.push({
                    ...rhythmTemplate[i % rhythmTemplate.length],
                    relativePosition: i * spacing
                  });
                }
                modifiedTemplate = newTemplate;
              }
            }

            // Each beat in rhythmTemplate = ONE complete strum through all notes
            modifiedTemplate.forEach((beat, idx) => {
              // Apply syncopation shift
              let adjustedPosition = beat.relativePosition + advancedStrumControls.syncopationShift;
              adjustedPosition = Math.max(0, Math.min(0.99, adjustedPosition)); // Keep in bounds

              // Apply swing
              if (advancedStrumControls.swingAmount > 0 && idx % 2 === 1) {
                const swingDelay = advancedStrumControls.swingAmount * 0.1;
                adjustedPosition += swingDelay;
              }

              const strumStartTime = time + (adjustedPosition * Tone.Time('1m').toSeconds());

              // Determine note order based on direction
              let notesToPlay = [...notes];
              if (direction === 'up') {
                notesToPlay.reverse();
              } else if (direction === 'alternating') {
                if (idx % 2 === 1) notesToPlay.reverse();
              } else if (direction === 'mixed') {
                if (idx % 2 === 1) notesToPlay.reverse();
              }

              // Strum spread: time between each individual note in the strum
              const strumSpread = articulation === 'staccato' ? 0.01 :
                                  articulation === 'muted' ? 0.008 :
                                  articulation === 'legato' ? 0.02 : 0.015;

              const noteDuration = articulation === 'staccato' ? '32n' :
                                   articulation === 'muted' ? '16n' :
                                   articulation === 'legato' ? '4n' : '8n';

              // Apply advanced accent patterns
              let baseVelocity = velocityCurve[idx % velocityCurve.length] *
                              (articulation === 'muted' ? 0.6 : 1.0);

              if (advancedStrumControls.accentPattern === 'downbeats' && idx % 4 === 0) {
                baseVelocity *= 1.3;
              } else if (advancedStrumControls.accentPattern === 'offbeats' && idx % 2 === 1) {
                baseVelocity *= 1.2;
              } else if (advancedStrumControls.accentPattern === 'alternating') {
                baseVelocity *= idx % 2 === 0 ? 1.2 : 0.8;
              }

              // Apply ghost notes
              const isGhostNote = advancedStrumControls.ghostNoteIntensity > 0 && idx % 3 === 2;
              const ghostMultiplier = isGhostNote ? (1.0 - advancedStrumControls.ghostNoteIntensity * 0.5) : 1.0;

              const finalVelocity = baseVelocity * ghostMultiplier;

              // Play each note ONE AT A TIME with slight delay between them
              notesToPlay.forEach((note, noteIdx) => {
                const noteTime = strumStartTime + (noteIdx * strumSpread);
                synthRef.current!.triggerAttackRelease(
                  note,
                  noteDuration,
                  noteTime,
                  finalVelocity
                );
              });
            });
          } else {
            // Fallback: Simple downward strum (one note at a time)
            const strumSpread = 0.015;
            notes.forEach((note, i) => {
              const noteTime = time + (i * strumSpread);
              synthRef.current!.triggerAttackRelease(note, '8n', noteTime);
            });
          }
        }
        break;

      case 'broken':
        // Broken chord pattern playback (NEW SYSTEM)
        {
          const brokenPattern = BROKEN_CHORD_PATTERNS.find(p => p.id === selectedBrokenChordPatternId);
          if (!brokenPattern) {
            // Fallback to old broken style
            const irregularPattern = [0, 0.3, 0.5, 0.7, 0.9];
            const measureDuration = Tone.Time('1n').toSeconds();
            notes.forEach((note, i) => {
              const delay = irregularPattern[i % irregularPattern.length] * measureDuration;
              synthRef.current!.triggerAttackRelease(note, measureDuration / 3, time + delay);
            });
            break;
          }

          const measureDuration = Tone.Time('1n').toSeconds();
          const { rhythmTemplate, firstNote, secondNotePair, accentPattern } = brokenPattern;

          // Get the actual notes to play
          const firstNoteActual = getNoteFromVoicePosition(notes, firstNote);
          const secondNote1 = getNoteFromVoicePosition(notes, secondNotePair[0]);
          const secondNote2 = getNoteFromVoicePosition(notes, secondNotePair[1]);

          if (!firstNoteActual || !secondNote1 || !secondNote2) {
            // Fallback if notes not available
            synthRef.current.triggerAttackRelease(notes, '1n', time);
            break;
          }

          // Play the pattern: First note on beat 1, two notes together on beat 2, repeat...
          rhythmTemplate.forEach((beat, i) => {
            const delay = beat * measureDuration;
            const accent = accentPattern[i % accentPattern.length];
            const velocity = accent ? 1.0 : 0.7;
            const duration = '8n';

            if (i % 3 === 0) {
              // First note alone
              synthRef.current!.triggerAttackRelease(firstNoteActual, duration, time + delay, velocity);
            } else {
              // Two notes together
              synthRef.current!.triggerAttackRelease(secondNote1, duration, time + delay, velocity);
              synthRef.current!.triggerAttackRelease(secondNote2, duration, time + delay, velocity);
            }
          });
        }
        break;

      case 'partial':
        // Play subset of notes
        const partialNotes: string[] = [];
        if (notes.length >= 3) {
          const useThird = Math.random() > 0.5;
          partialNotes.push(notes[0]); // root
          if (useThird && notes.length >= 2) {
            partialNotes.push(notes[1]); // 3rd
          } else if (notes.length >= 3) {
            partialNotes.push(notes[2]); // 5th
          }
        } else {
          partialNotes.push(...notes);
        }
        synthRef.current.triggerAttackRelease(partialNotes, '1n', time);
        break;

      default:
        synthRef.current.triggerAttackRelease(notes, '1n', time);
    }
  };

  const handleLoadSong = (song: SongData) => {
    setCustomKeySignature(song.key);
    setCustomTempo(song.tempo);
    setSelectedProgression(song.progression);
    setChordType(song.chordType as any);
    setInversion(song.inversion);
    setSelectedSound(song.instrument);
    setIsCustomMode(song.isCustomMode);

    if (song.customProgression) {
      setCustomProgression(song.customProgression);
      setProgressionLength(song.customProgression.length);
    }

    if (useSoundFont) {
      loadSoundFontInstrument(song.instrument);
    }
  };

  const getCurrentSongData = (): Omit<SongData, 'id' | 'timestamp'> => {
    return {
      title: 'Untitled',
      key: customKeySignature,
      tempo: customTempo,
      progression: selectedProgression,
      chordType: chordType,
      inversion: inversion,
      instrument: selectedSound,
      customProgression: isCustomMode ? customProgression : undefined,
      isCustomMode: isCustomMode
    };
  };

  const playMusic = async () => {
    setIsLoading(true);

    try {
      const activeKey = isCustomMode ? customKeySignature : propKeySignature;
      const activeTempo = isCustomMode ? customTempo : propTempo;

      // Use manual BPM if enabled, otherwise use tempo map
      const bpm = (isCustomMode && useManualBPM) ? manualBPM : (tempoMap[activeTempo] || 80);
      setRealTimeBPM(bpm);

      const chords = generateChordProgression(activeKey, selectedProgression, customProgression);

      // Calculate chord duration based on BPM and time signature
      const getBeatsPerMeasure = (timeSig: string): number => {
        switch (timeSig) {
          case '3/4': return 3;
          case '6/8': return 6; // 6 eighth notes = 3 quarter note beats felt as 2 dotted quarters
          case '2/4': return 2;
          case '5/4': return 5;
          case '7/8': return 7; // 7 eighth notes
          case '4/4':
          default: return 4;
        }
      };

      const getBeatValue = (timeSig: string): number => {
        // Returns the note value that gets one beat
        // For x/4 time: quarter note gets the beat
        // For x/8 time: eighth note gets the beat
        if (timeSig.includes('/8')) return 8;
        return 4;
      };

      const beatsPerMeasure = getBeatsPerMeasure(timeSignature);
      const beatValue = getBeatValue(timeSignature);
      const secondsPerBeat = 60 / bpm;

      // Adjust for beat value (eighth notes are twice as fast)
      const adjustedSecondsPerBeat = beatValue === 8 ? secondsPerBeat / 2 : secondsPerBeat;
      const chordDuration = adjustedSecondsPerBeat * beatsPerMeasure;
      const totalDuration = chords.length * chordDuration;

      setTotalDuration(totalDuration);

      // Load SoundFont instrument if enabled
      if (useSoundFont && soundFontManagerRef.current) {
        const loaded = await loadSoundFontInstrument(selectedSound);
        if (!loaded) {
          // Fallback to Tone.js
          setUseSoundFont(false);
        }
      }

      if (useSoundFont && soundFontManagerRef.current && soundFontManagerRef.current.getCurrentInstrument()) {
        // Use SoundFont playback with seamless looping (no gaps!)
        const scheduleNextLoop = (nextLoopStartTime?: number) => {
          // Get the actual sequence from selected arpeggio pattern
          const selectedArpPattern = ARPEGGIATED_PATTERNS.find(p => p.id === selectedArpPatternId);
          const actualArpSequence = selectedArpPattern ? selectedArpPattern.sequence : arpeggioPattern;

          console.log('[Playback] Using arpeggio pattern:', {
            patternId: selectedArpPatternId,
            pattern: selectedArpPattern?.name,
            sequence: actualArpSequence
          });

          console.log('[Playback] Using block pattern:', selectedBlockPatternId);

          // NEW: Pass explicit start time, tiered arpeggio config, and BPM
          const result = soundFontManagerRef.current!.scheduleChordProgression(
            chords,
            voicingTechnique,
            chordDuration,
            musicVolume / 100,
            actualArpSequence,
            timeSignature,
            partialMode,
            useVoiceLeading,
            (chordName: string, index: number) => {
              setCurrentChord(chordName);
              // ADDITIVE: Trigger real-time parameter changes at chord boundary
              realtimeIntegration.triggerChordChange();
            },
            selectedBlockPatternId,
            selectedStrumPatternId,
            selectedBrokenChordPatternId,
            advancedStrumControls,
            nextLoopStartTime,  // Pass explicit start time for seamless looping
            tieredArpeggioConfig,  // Pass tiered arpeggio config for rhythm patterns
            bpm  // NEW: Pass actual BPM for accurate rhythm timing
          );

          // Store timeout IDs for cleanup
          if (!(window as any).__musicTimeouts) {
            (window as any).__musicTimeouts = [];
          }
          (window as any).__musicTimeouts.push(...result.timeoutIds);

          // SEAMLESS LOOPING FIX: Calculate EXACT end time and schedule next loop
          // The next loop should start EXACTLY when this one ends (no gap, no overlap)
          const loopEndTime = result.endTime;
          const currentTime = soundFontManagerRef.current!.getAudioContext()?.currentTime || 0;
          const timeUntilEnd = (loopEndTime - currentTime) * 1000; // Convert to milliseconds

          // Schedule the next loop to prepare slightly before this one ends
          // We schedule the CALL early, but the AUDIO starts at the exact end time
          const scheduleAdvance = 50; // Schedule the call 50ms before end
          const nextLoopScheduleDelay = Math.max(0, timeUntilEnd - scheduleAdvance);

          console.log('[Loop Fix] Scheduling next loop:', {
            currentTime,
            loopEndTime,
            timeUntilEnd: timeUntilEnd.toFixed(2) + 'ms',
            scheduleDelay: nextLoopScheduleDelay.toFixed(2) + 'ms'
          });

          const loopTimeoutId = window.setTimeout(() => {
            // ADDITIVE: Trigger real-time parameter changes at loop boundary
            realtimeIntegration.triggerLoopBoundary();

            // Pass the EXACT end time as the start time for the next loop
            scheduleNextLoop(loopEndTime); // Loop continuously with ZERO gap
          }, nextLoopScheduleDelay);
          (window as any).__musicTimeouts.push(loopTimeoutId);
        };

        // Start the first loop (no explicit start time, uses current time)
        scheduleNextLoop();

      } else {
        // Fallback to Tone.js
        if (!synthRef.current) {
          setIsLoading(false);
          return;
        }

        // Get the actual sequence from selected arpeggio pattern
        const selectedArpPattern = ARPEGGIATED_PATTERNS.find(p => p.id === selectedArpPatternId);
        const actualArpSequence = selectedArpPattern ? selectedArpPattern.sequence : arpeggioPattern;

        await Tone.start();
        Tone.Transport.bpm.value = bpm;
        Tone.Transport.loop = true;
        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = `${chords.length}m`;

        if (sequenceRef.current) {
          sequenceRef.current.dispose();
        }

        sequenceRef.current = new Tone.Sequence((time, chord) => {
          if (synthRef.current && chord.notes.length > 0) {
            // For arpeggiated patterns, ALWAYS use root position notes to ensure badge labels match played notes
            // For other techniques, use voice-led voicing if available, otherwise use original notes
            let notesToPlay: string[];
            if (voicingTechnique === 'arpeggiated') {
              notesToPlay = chord.rootPositionNotes || chord.notes;
            } else {
              notesToPlay = (useVoiceLeading && chord.voicing) ? chord.voicing : chord.notes;
            }

            // Apply voicing technique with Tone.js using actual selected pattern
            playToneVoicing(notesToPlay, time, voicingTechnique, actualArpSequence);
            Tone.Draw.schedule(() => {
              setCurrentChord(chord.name);
            }, time);
          }
        }, chords, '1m');

        sequenceRef.current.start(0);
        Tone.Transport.start();
      }

      // Common post-playback setup
      console.log('[Voice] Checking voice initialization - voiceEnabled:', voiceEnabled, 'words:', wordsRef.current.length, 'duration:', totalDuration);
      if (voiceEnabled && wordsRef.current.length > 0) {
        console.log('[Voice] Calling initializeVoiceTrack');
        await initializeVoiceTrack(totalDuration);
      } else {
        console.log('[Voice] NOT initializing - voiceEnabled:', voiceEnabled, 'words length:', wordsRef.current.length);
      }

      if (isRecording) {
        startRecording();
      }

      setIsPlaying(true);
      setIsLoading(false);
      startProgressTracking();
    } catch (error) {
      console.error('Error starting audio:', error);
      setIsLoading(false);
    }
  };

  const handleRealTimeTempoChange = (newBPM: number, smooth: boolean = true) => {
    try {
      const validatedBPM = clampTempo(newBPM);

      if (!validateTempo(validatedBPM)) {
        console.error(`Invalid tempo: ${newBPM}, clamped to: ${validatedBPM}`);
      }

      setRealTimeBPM(validatedBPM);

      if (isPlaying) {
        // Check if using SoundFont or Tone.js
        if (useSoundFont && soundFontManagerRef.current && soundFontManagerRef.current.getIsPlaying()) {
          // SoundFont playback - reschedule with new tempo
          soundFontManagerRef.current.rescheduleWithNewTempo(validatedBPM);
        } else if (Tone.Transport.state === 'started') {
          // Tone.js playback - update Transport BPM
          if (smooth) {
            Tone.Transport.bpm.rampTo(validatedBPM, 2);
          } else {
            Tone.Transport.bpm.value = validatedBPM;
          }
        } else {
          // Not playing or unknown state
          Tone.Transport.bpm.value = validatedBPM;
        }

        if (soundFontManagerRef.current) {
          soundFontManagerRef.current.setTempo(validatedBPM);
        }
      } else {
        // Not playing - just set the BPM for next playback
        Tone.Transport.bpm.value = validatedBPM;
        if (soundFontManagerRef.current) {
          soundFontManagerRef.current.setTempo(validatedBPM);
        }
      }
    } catch (error) {
      console.error('Error changing tempo:', error);
    }
  };

  const stopMusic = () => {
    stopVoiceTrack();

    // Stop SoundFont playback
    if ((window as any).__musicInterval) {
      clearInterval((window as any).__musicInterval);
      (window as any).__musicInterval = null;
    }
    // Clear scheduled timeouts (new pre-scheduling system)
    if ((window as any).__musicTimeouts) {
      (window as any).__musicTimeouts.forEach((timeoutId: number) => {
        clearTimeout(timeoutId);
      });
      (window as any).__musicTimeouts = null;
    }
    if (soundFontManagerRef.current) {
      soundFontManagerRef.current.stopAllNotes();
      soundFontManagerRef.current.stopPlayback();
    }

    // Stop Tone.js playback
    if (sequenceRef.current) {
      sequenceRef.current.stop();
    }
    Tone.Transport.stop();
    Tone.Transport.position = 0;

    setIsPlaying(false);
    setCurrentChord('');
    setCurrentWordIndex(0);
    setCurrentTime(0);
    stopProgressTracking();

    if (isRecording) {
      stopRecording();
    }
  };

  const rewind = () => {
    Tone.Transport.position = 0;
    setCurrentTime(0);
    setCurrentWordIndex(0);
  };

  const skipBackward = () => {
    if (isPlaying) {
      const newTime = Math.max(0, Tone.Transport.seconds - 4);
      Tone.Transport.seconds = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipForward = () => {
    if (isPlaying) {
      const newTime = Math.min(totalDuration, Tone.Transport.seconds + 4);
      Tone.Transport.seconds = newTime;
      setCurrentTime(newTime);
    }
  };

  const seekTo = (position: number) => {
    const newPosition = (position / 100) * totalDuration;
    Tone.Transport.seconds = newPosition;
    setCurrentTime(newPosition);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  };

  const downloadRecording = () => {
    if (recordedAudioURL) {
      const a = document.createElement('a');
      a.href = recordedAudioURL;
      a.download = 'scripture-music.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const renderAudioVisualizer = () => {
    if (!isPlaying) {
      return (
        <div className="flex items-end justify-center space-x-1 h-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gradient-to-t from-blue-500/30 to-green-400/30 w-2 rounded-full h-3" />
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-end justify-center space-x-1 h-12">
        {Array.from({ length: 12 }).map((_, i) => {
          const timeOffset = currentTime + (i * 0.1);
          const baseHeight = 20 + Math.sin(timeOffset * 2) * 15;
          const variation = Math.sin(timeOffset * 3 + i) * 10;
          const height = Math.max(10, baseHeight + variation);

          return (
            <div
              key={i}
              className="bg-gradient-to-t from-blue-500 to-green-400 w-2 rounded-full transition-all duration-100"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <>
    <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30 mt-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Music Machine</h3>
              <p className="text-blue-50 text-sm">
                {(soundPresets[selectedSound]?.name || INSTRUMENTS[selectedSound]?.name || 'Unknown')} • {isCustomMode ? customKeySignature : propKeySignature} • {isCustomMode ? customTempo : propTempo}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-full transition-all duration-200 ${
                voiceEnabled
                  ? 'bg-success-600 text-white shadow-lg'
                  : 'bg-neutral-700 text-white hover:bg-neutral-600'
              }`}
              title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
            >
              {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ADDITIVE: Primary Play Controls - Immediately Visible */}
        <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20 rounded-xl p-6 border border-blue-400/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Play/Stop Button - Prominent */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 ${
                isLoading
                  ? 'bg-gray-500 text-white cursor-not-allowed'
                  : isPlaying
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                    : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Square className="w-6 h-6" />
                  <span>Stop Music</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>Start Music</span>
                </>
              )}
            </button>

            {/* Quick Info Display */}
            <div className="flex-1 flex items-center justify-around gap-4 text-sm">
              {currentChord && (
                <div className="bg-neutral-100/90 backdrop-blur-sm border border-neutral-300 rounded-lg px-4 py-2 dark:bg-neutral-800/90 dark:border-neutral-600">
                  <div className="text-neutral-600 dark:text-white text-xs font-medium">Current Chord</div>
                  <div className="text-primary-700 dark:text-primary-400 text-lg font-bold">{currentChord}</div>
                </div>
              )}

              <div className="bg-neutral-100/90 backdrop-blur-sm border border-neutral-300 rounded-lg px-4 py-2 dark:bg-neutral-800/90 dark:border-neutral-600">
                <div className="text-neutral-600 dark:text-white text-xs font-medium">Time</div>
                <div className="text-neutral-900 dark:text-white text-lg font-bold">{formatTime(currentTime)} / {formatTime(totalDuration)}</div>
              </div>

              <div className="hidden lg:flex bg-neutral-100/90 backdrop-blur-sm border border-neutral-300 rounded-lg px-4 py-2 dark:bg-neutral-800/90 dark:border-neutral-600">
                <div className="text-neutral-600 dark:text-white text-xs font-medium">Status</div>
                <div className="text-neutral-900 dark:text-white text-lg font-bold">{isPlaying ? '▶ Playing' : '⏸ Ready'}</div>
              </div>
            </div>
          </div>

          {/* Progress Bar - Always Visible */}
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max="100"
              value={totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-full appearance-none slider progress-bar cursor-pointer"
              disabled={!isPlaying && totalDuration === 0}
            />
          </div>
        </div>

        {isCustomMode && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3">Custom Settings</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">Key Signature</label>
                <select
                  value={customKeySignature}
                  onChange={(e) => setCustomKeySignature(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {keySignatures.map((key) => (
                    <option key={key} value={key} className="bg-gray-800">{key}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-blue-100 text-sm font-medium flex items-center space-x-2">
                    <Music className="w-4 h-4" />
                    <span>Tempo</span>
                  </label>
                  <button
                    onClick={() => setUseManualBPM(!useManualBPM)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                      useManualBPM
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                    title={useManualBPM ? 'Switch to preset tempos' : 'Switch to manual BPM input'}
                  >
                    {useManualBPM ? '🎹 Manual' : '📋 Preset'}
                  </button>
                </div>
                {useManualBPM ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="number"
                        min={TEMPO_CONSTANTS.MIN_BPM}
                        max={TEMPO_CONSTANTS.MAX_BPM}
                        value={manualBPM}
                        onChange={(e) => {
                          const validation = validateTempo(e.target.value);

                          if (validation.isValid) {
                            setManualBPM(validation.value);
                            // Log warnings if any
                            validation.warnings.forEach(warning => {
                              console.warn('[Tempo]', warning);
                            });
                          } else {
                            // Use clamped value for invalid input
                            const clamped = clampTempo(e.target.value);
                            setManualBPM(clamped);
                            // Log errors
                            validation.errors.forEach(error => {
                              console.error('[Tempo]', error);
                            });
                          }
                        }}
                        onBlur={(e) => {
                          // Ensure valid value on blur using validator
                          const validation = validateTempo(e.target.value);
                          if (!validation.isValid) {
                            setManualBPM(validation.value);
                          }
                        }}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder={`Enter BPM (${TEMPO_CONSTANTS.MIN_BPM}-${TEMPO_CONSTANTS.MAX_BPM})`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-100 text-xs font-bold pointer-events-none">
                        BPM
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-100">
                      <span className="cursor-pointer hover:text-blue-100 transition-colors" onClick={() => setManualBPM(40)}>
                        🐌 Slow (40)
                      </span>
                      <span className="cursor-pointer hover:text-blue-100 transition-colors" onClick={() => setManualBPM(100)}>
                        🚶 Moderate (100)
                      </span>
                      <span className="cursor-pointer hover:text-blue-100 transition-colors" onClick={() => setManualBPM(160)}>
                        🏃 Fast (160)
                      </span>
                    </div>
                    {/* Current BPM Display */}
                    <div className="bg-primary-500/20 border border-primary-500/40 rounded-lg p-2 text-center">
                      <div className="text-primary-100 text-xs font-medium">Current Tempo</div>
                      <div className="text-white text-lg font-bold">{manualBPM} BPM</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={customTempo}
                      onChange={(e) => setCustomTempo(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {tempoOptions.map((t) => (
                        <option key={t} value={t} className="bg-gray-800">{t} ({tempoMap[t]} BPM)</option>
                      ))}
                    </select>
                    {/* Current Preset Display */}
                    <div className="bg-primary-500/20 border border-primary-500/40 rounded-lg p-2 text-center">
                      <div className="text-primary-100 text-xs font-medium">Current Tempo</div>
                      <div className="text-white text-lg font-bold">{customTempo} ({tempoMap[customTempo] || 80} BPM)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-bold">Instrument Sound</h4>
            <div className="flex items-center space-x-2">
              <label className="text-blue-100 text-sm">SoundFont Quality:</label>
              <button
                onClick={() => setUseSoundFont(!useSoundFont)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  useSoundFont
                    ? 'bg-success-600 text-white shadow-lg'
                    : 'bg-neutral-700 text-white'
                }`}
              >
                {useSoundFont ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {useSoundFont ? (
            <div className="space-y-3">
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">Instrument</label>
                <select
                  value={selectedSound}
                  onChange={(e) => handleInstrumentChange(e.target.value)}
                  disabled={soundFontLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {Object.entries(instrumentCategories).map(([category, instruments]) => (
                    <optgroup key={category} label={category} className="bg-gray-800">
                      {instruments.map((key) => {
                        const config = INSTRUMENTS[key];
                        return (
                          <option key={key} value={key} className="bg-gray-800">
                            {config.name}
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
                {selectedSound && INSTRUMENTS[selectedSound] && (
                  <p className="text-blue-50 text-xs mt-2 italic">
                    {INSTRUMENTS[selectedSound].description}
                  </p>
                )}
              </div>

              {soundFontLoading && (
                <div className="text-center text-blue-100 text-sm">
                  Loading instrument...
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(soundPresets).map(([key, preset]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSound(key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSound === key
                      ? 'bg-yellow-500 text-yellow-900 shadow-lg'
                      : 'bg-neutral-700 text-white hover:bg-neutral-600'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}

          {/* Audio Effects Suite Access */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setShowAudioEffects(true)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sliders className="w-5 h-5" />
              <span>Open Audio Effects Suite</span>
            </button>
            <p className="text-blue-50 text-xs mt-2 text-center">
              Apply studio-grade effects to your SoundFont instruments
            </p>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-bold mb-3">Volume Controls</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-100 text-sm font-medium flex items-center space-x-2">
                  <Music className="w-4 h-4" />
                  <span>Music Volume</span>
                </label>
                <span className="text-white text-sm font-bold">{musicVolume}%</span>
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-100 text-sm font-medium flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Voice Volume</span>
                </label>
                <span className="text-white text-sm font-bold">{voiceVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
                disabled={!voiceEnabled}
              />
            </div>
          </div>
        </div>

        {voiceEnabled && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3">Voice Settings</h4>

            {/* Voice Timing Mode Toggle */}
            <div className="mb-4 bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-blue-100 text-sm font-medium block mb-1">Voice Timing</label>
                  <p className="text-xs text-blue-50/70">
                    {syncVoiceToMusic
                      ? 'Voice synced to music duration (may be fast)'
                      : 'Natural speech pace (400ms/word, ~150 words/min)'}
                  </p>
                </div>
                <button
                  onClick={() => setSyncVoiceToMusic(!syncVoiceToMusic)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    syncVoiceToMusic
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-success-600 text-white shadow-lg'
                  }`}
                  title={syncVoiceToMusic ? 'Click for natural pace (recommended)' : 'Click to sync with music'}
                >
                  {syncVoiceToMusic ? '🎵 Synced' : '🗣️ Natural'}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name} className="bg-gray-800">
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">
                  Speech Rate: {speechRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
                />
              </div>
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">
                  Pitch: {speechPitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none slider"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="text-blue-100 text-sm font-medium mb-1">Current Chord</div>
              <div className="text-white font-bold text-2xl">
                {currentChord || 'Ready to play'}
              </div>
            </div>
          </div>

          {voiceEnabled && scriptureText && (
            <div className="text-center">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="text-blue-100 text-sm font-medium mb-1">Current Word</div>
                <div className="text-white font-bold text-2xl">
                  {(() => {
                    const word = wordsRef.current[currentWordIndex] || 'Ready to sing';
                    console.log('[Render] Current Word Display - index:', currentWordIndex, 'word:', word, 'total words:', wordsRef.current.length);
                    return word;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {voiceEnabled && scriptureText && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-bold mb-3">Scripture Text</h4>
            <p className="text-lg leading-relaxed">
              {wordsRef.current.map((word, index) => (
                <span
                  key={index}
                  className={`transition-all duration-300 ${
                    index === currentWordIndex
                      ? 'bg-yellow-500/50 text-yellow-100 px-1 rounded font-bold'
                      : index < currentWordIndex
                        ? 'text-green-100'
                        : 'text-blue-50'
                  }`}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        )}

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          {renderAudioVisualizer()}
        </div>

        {/* ADDITIVE: Sticky/Fixed Controls Container - Always visible while viewing scripture */}
        <div className={isMobile ? 'music-controls-fixed' : 'music-controls-sticky'}>
          {/* Current Chord Indicator (floating above controls in sticky mode) */}
          {currentChord && !isMobile && (
            <div className="sticky-current-chord">
              {currentChord}
            </div>
          )}

          <div className={isMobile ? 'music-controls-compact' : 'space-y-2'}>
            {/* Progress Bar */}
            <div className={isMobile ? 'progress-container' : 'space-y-2'}>
              <div className="flex justify-between text-sm text-blue-50">
                <span>{formatTime(currentTime)}</span>
                {isMobile && currentChord && (
                  <span className="text-yellow-100 font-semibold">{currentChord}</span>
                )}
                <span>{formatTime(totalDuration)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none slider progress-bar"
                disabled={!isPlaying && totalDuration === 0}
              />
            </div>

            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={rewind}
                disabled={!isPlaying && totalDuration === 0}
                className="control-button p-3 rounded-full bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={skipBackward}
                disabled={!isPlaying}
                className="control-button p-3 rounded-full bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`control-button flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isLoading
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                    : isPlaying
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                      : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Square className="w-5 h-5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                onClick={skipForward}
                disabled={!isPlaying}
                className="control-button p-3 rounded-full bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {recordedAudioURL && (
                <button
                  onClick={downloadRecording}
                  className="control-button p-3 rounded-full bg-success-600 text-white hover:bg-success-700 transition-all duration-200"
                  title="Download recording"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-bold mb-3">Chord Voicing</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-blue-100 text-sm font-medium block mb-2">Chord Type</label>
              <select
                value={chordType}
                onChange={(e) => setChordType(e.target.value as any)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="triad" className="bg-gray-800">Triad (3 notes)</option>
                <option value="7th" className="bg-gray-800">7th Chords (4 notes)</option>
                <option value="9th" className="bg-gray-800">9th Chords (5 notes)</option>
                <option value="11th" className="bg-gray-800">11th Chords (6 notes)</option>
                <option value="sus2" className="bg-gray-800">Sus2 (suspended 2nd)</option>
                <option value="sus4" className="bg-gray-800">Sus4 (suspended 4th)</option>
              </select>
            </div>
            <div>
              <label className="text-blue-100 text-sm font-medium block mb-2">Inversion</label>
              <select
                value={inversion}
                onChange={(e) => setInversion(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={useVoiceLeading}
              >
                <option value={0} className="bg-gray-800">Root Position</option>
                <option value={1} className="bg-gray-800">1st Inversion</option>
                <option value={2} className="bg-gray-800">2nd Inversion</option>
                <option value={3} className="bg-gray-800">3rd Inversion</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium block">Smooth Voice-Leading</label>
                <p className="text-blue-50 text-xs mt-1">
                  Automatically optimizes chord voicings for smooth transitions
                </p>
              </div>
              <button
                onClick={() => setUseVoiceLeading(!useVoiceLeading)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  useVoiceLeading
                    ? 'bg-success-600 text-white shadow-lg'
                    : 'bg-neutral-700 text-white'
                }`}
              >
                {useVoiceLeading ? 'ON' : 'OFF'}
              </button>
            </div>
            {useVoiceLeading && (
              <div className="mt-2 bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
                <p className="text-primary-100 text-xs">
                  ✓ Common tones preserved • ✓ Minimal voice motion • ✓ Manual inversion disabled
                </p>
              </div>
            )}
          </div>

          {/* NEW: Chord Quality Mode */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <label className="text-white font-medium block mb-2">Chord Quality Mode</label>
            <select
              value={chordQualityMode}
              onChange={(e) => setChordQualityMode(e.target.value as any)}
              className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-blue-400 focus:outline-none"
            >
              <optgroup label="Diatonic" className="bg-gray-800 text-white">
                <option value="key-aware" className="bg-gray-800 text-white">Key-Aware (Diatonic)</option>
              </optgroup>
              <optgroup label="Single Quality" className="bg-gray-800 text-white">
                <option value="all-major" className="bg-gray-800 text-white">All Major</option>
                <option value="all-minor" className="bg-gray-800 text-white">All Minor</option>
                <option value="all-dom7" className="bg-gray-800 text-white">All Dominant 7th</option>
                <option value="all-diminished" className="bg-gray-800 text-white">All Diminished</option>
                <option value="all-augmented" className="bg-gray-800 text-white">All Augmented</option>
                <option value="all-sus2" className="bg-gray-800 text-white">All Sus2</option>
                <option value="all-sus4" className="bg-gray-800 text-white">All Sus4</option>
              </optgroup>
              <optgroup label="Mixed Qualities" className="bg-gray-800 text-white">
                <option value="major-minor-mix" className="bg-gray-800 text-white">Major + Minor Mix</option>
                <option value="sus2-major-dim-mix" className="bg-gray-800 text-white">Sus2 + Major + Dim Mix</option>
                <option value="dim-minor-mix" className="bg-gray-800 text-white">Diminished + Minor Mix</option>
                <option value="augmented-major-mix" className="bg-gray-800 text-white">Augmented + Major Mix</option>
                <option value="sus4-dom7-mix" className="bg-gray-800 text-white">Sus4 + Dom7 Mix</option>
                <option value="mixed" className="bg-gray-800 text-white">Full Random Mix</option>
              </optgroup>
            </select>
            <p className="text-blue-50 text-xs mt-2">
              {chordQualityMode === 'key-aware' && '✓ Respects key signature (diatonic harmony)'}
              {chordQualityMode === 'all-major' && '→ Forces all chords to major quality'}
              {chordQualityMode === 'all-minor' && '→ Forces all chords to minor quality'}
              {chordQualityMode === 'all-dom7' && '→ Forces all chords to dominant 7th (major + ♭7)'}
              {chordQualityMode === 'all-diminished' && '→ Forces all chords to diminished (1-♭3-♭5)'}
              {chordQualityMode === 'all-augmented' && '→ Forces all chords to augmented (1-3-#5)'}
              {chordQualityMode === 'all-sus2' && '→ Forces all chords to sus2 (1-2-5)'}
              {chordQualityMode === 'all-sus4' && '→ Forces all chords to sus4 (1-4-5)'}
              {chordQualityMode === 'major-minor-mix' && '→ Alternates between major and minor'}
              {chordQualityMode === 'sus2-major-dim-mix' && '→ Cycles through sus2, major, and diminished'}
              {chordQualityMode === 'dim-minor-mix' && '→ Alternates between diminished and minor'}
              {chordQualityMode === 'augmented-major-mix' && '→ Alternates between augmented and major'}
              {chordQualityMode === 'sus4-dom7-mix' && '→ Alternates between sus4 and dominant 7th'}
              {chordQualityMode === 'mixed' && '→ Full random mix of all qualities'}
            </p>
          </div>

          {/* NEW: Time Signature */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <label className="text-white font-medium block mb-3">Time Signature</label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {(['4/4', '3/4', '6/8', '2/4', '5/4', '7/8', '3/8', '12/8'] as const).map((timeSig) => (
                <button
                  key={timeSig}
                  onClick={() => setTimeSignature(timeSig)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeSignature === timeSig
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-neutral-700 text-white hover:bg-neutral-600'
                  }`}
                >
                  {timeSig}
                </button>
              ))}
            </div>
            <p className="text-blue-50 text-xs mt-2">
              {timeSignature === '4/4' && '♩ Common time - 4 quarter note beats per measure'}
              {timeSignature === '3/4' && '♩ Waltz time - 3 quarter note beats per measure'}
              {timeSignature === '6/8' && '♪ Compound time - 6 eighth notes (felt as 2 dotted quarter beats)'}
              {timeSignature === '2/4' && '♩ March time - 2 quarter note beats per measure'}
              {timeSignature === '5/4' && '♩ Unusual - 5 quarter note beats per measure'}
              {timeSignature === '7/8' && '♪ Complex - 7 eighth note beats per measure'}
              {timeSignature === '3/8' && '♪ Quick compound - 3 eighth note beats per measure'}
              {timeSignature === '12/8' && '♪ Extended compound - 12 eighth notes (felt as 4 dotted quarter beats)'}
            </p>
          </div>

          {/* Real-Time Tempo Automation */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <TempoAutomation
              currentTempo={realTimeBPM}
              onTempoChange={handleRealTimeTempoChange}
              isPlaying={isPlaying}
            />
          </div>

          {/* ADDITIVE: Real-Time Parameter Change Settings */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <RealtimeChangeSettings
              settings={realtimeIntegration.queueSystem.settings}
              onSettingsChange={realtimeIntegration.queueSystem.saveSettings}
              isPlaying={isPlaying}
            />
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-bold mb-3">
            {isCustomMode ? 'Custom' : 'Preset'} Chord Progression
          </h4>

          <div className="flex items-center space-x-4 mb-4">
            <label className="text-blue-100 text-sm font-medium">Mode:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isCustomMode
                    ? 'bg-yellow-500 text-yellow-900 shadow-lg'
                    : 'bg-white/10 text-blue-50 hover:bg-white/20 hover:text-white'
                }`}
              >
                Preset
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isCustomMode
                    ? 'bg-yellow-500 text-yellow-900 shadow-lg'
                    : 'bg-white/10 text-blue-50 hover:bg-white/20 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {!isCustomMode ? (
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.keys(progressionCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-neutral-700 text-white hover:bg-neutral-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-blue-100 text-sm font-medium block mb-2">Progression</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {progressionCategories[selectedCategory as keyof typeof progressionCategories]?.map((progKey) => {
                    const prog = chordProgressions[progKey];
                    return (
                      <button
                        key={progKey}
                        onClick={() => setSelectedProgression(progKey)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedProgression === progKey
                            ? 'bg-yellow-500 text-yellow-900 shadow-lg'
                            : 'bg-neutral-700 text-white hover:bg-neutral-600'
                        }`}
                        title={prog.description}
                      >
                        {prog.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-4">
              <div className="flex items-center space-x-4">
                <label className="text-blue-100 text-sm font-medium">Progression Length (max 24):</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateProgressionLength(Math.max(2, progressionLength - 1))}
                    className="bg-neutral-700 text-white hover:bg-neutral-600 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  >
                    -
                  </button>
                  <span className="text-white font-bold w-8 text-center">{progressionLength}</span>
                  <button
                    onClick={() => updateProgressionLength(Math.min(24, progressionLength + 1))}
                    className="bg-neutral-700 text-white hover:bg-neutral-600 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-blue-100 text-sm font-medium">Select Chords:</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-medium transition-all shadow-lg"
                    >
                      📚 Templates
                    </button>
                    <button
                      onClick={() => setShowAdvancedChords(!showAdvancedChords)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        showAdvancedChords
                          ? 'bg-yellow-500 text-yellow-900'
                          : 'bg-white/20 text-blue-50 hover:bg-white/30'
                      }`}
                    >
                      🎸 Advanced Chords
                    </button>
                  </div>
                </div>

                {/* Template Selector */}
                {showTemplates && (
                  <div className="mb-4 p-4 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
                    <h5 className="text-purple-100 font-medium mb-3">Load Template Progression</h5>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {progressionTemplates.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => loadTemplate(template)}
                          className="text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-purple-400 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-sm">{template.name}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/30 text-purple-100">
                              {template.style}
                            </span>
                          </div>
                          <div className="text-xs text-blue-50 mt-1">{template.chords.join(' → ')}</div>
                          <div className="text-xs text-white/80 mt-1">{template.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  {customProgression.map((chord, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                        draggedChordIndex === index
                          ? 'bg-yellow-500/20 border-2 border-yellow-500'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span className="text-blue-100 text-sm w-8 cursor-move">☰ {index + 1}</span>
                      <select
                        value={chord}
                        onChange={(e) => updateChordAtPosition(index, e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <optgroup label="Diatonic" className="bg-gray-800">
                          {availableChords.map((chordOption) => (
                            <option key={chordOption} value={chordOption} className="bg-gray-800">
                              {chordOption}
                            </option>
                          ))}
                        </optgroup>
                        {showAdvancedChords && getExtendedChords().map((category) => (
                          <optgroup key={category.name} label={category.name} className="bg-gray-800">
                            {category.chords.map((advChord) => (
                              <option key={advChord} value={advChord} className="bg-gray-800">
                                {advChord} ({category.description})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => copyChord(index)}
                          className="p-1.5 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-100 text-xs transition-all"
                          title="Copy"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => pasteChord(index)}
                          disabled={!copiedChord}
                          className={`p-1.5 rounded text-xs transition-all ${
                            copiedChord
                              ? 'bg-green-500/20 hover:bg-green-500/40 text-green-100'
                              : 'bg-gray-500/20 text-white/60 cursor-not-allowed'
                          }`}
                          title="Paste"
                        >
                          📄
                        </button>
                        <button
                          onClick={() => duplicateChord(index)}
                          className="p-1.5 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-100 text-xs transition-all"
                          title="Duplicate"
                        >
                          ➕
                        </button>
                        <button
                          onClick={() => deleteChord(index)}
                          className="p-1.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-100 text-xs transition-all"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {copiedChord && (
                  <div className="text-xs text-green-100 mt-2">
                    ✓ Copied: {copiedChord} (click paste button to insert)
                  </div>
                )}
              </div>

              {/* Progression Management */}
              <div className="space-y-3 mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-purple-100 text-sm font-medium">Save & Load Progressions</label>
                  <button
                    onClick={() => setShowProgressionManager(!showProgressionManager)}
                    className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-all"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                </div>

                {/* PHASE 1: Tags and Description */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={progressionDescription}
                    onChange={(e) => setProgressionDescription(e.target.value)}
                    placeholder="Description (optional)..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div>
                    <label className="text-xs text-purple-100 mb-1 block">Tags (click to add):</label>
                    <div className="flex flex-wrap gap-1">
                      {suggestedTags.slice(0, 12).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                            progressionTags.includes(tag)
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    {progressionTags.length > 0 && (
                      <div className="text-xs text-purple-100 mt-1">
                        Selected: {progressionTags.join(', ')}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-purple-100 mb-1 block">Style:</label>
                    <select
                      value={progressionStyle}
                      onChange={(e) => setProgressionStyle(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="custom" className="bg-gray-800">Custom</option>
                      <option value="pop" className="bg-gray-800">Pop</option>
                      <option value="gospel" className="bg-gray-800">Gospel</option>
                      <option value="worship" className="bg-gray-800">Worship</option>
                      <option value="jazz" className="bg-gray-800">Jazz</option>
                      <option value="blues" className="bg-gray-800">Blues</option>
                      <option value="rock" className="bg-gray-800">Rock</option>
                      <option value="classical" className="bg-gray-800">Classical</option>
                      <option value="latin" className="bg-gray-800">Latin</option>
                      <option value="ambient" className="bg-gray-800">Ambient</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={progressionName}
                    onChange={(e) => setProgressionName(e.target.value)}
                    placeholder="Progression name..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={saveProgression}
                    className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white flex items-center space-x-2 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voicing Techniques */}
          <div className="space-y-3 mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <label className="text-primary-100 text-sm font-medium block">Voicing Technique</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(['block', 'arpeggiated', 'strum', 'broken', 'partial'] as const).map((technique) => (
                <button
                  key={technique}
                  onClick={() => setVoicingTechnique(technique)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    voicingTechnique === technique
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {technique.charAt(0).toUpperCase() + technique.slice(1)}
                </button>
              ))}
            </div>

            {/* Voicing-specific options */}
            {voicingTechnique === 'arpeggiated' && (
              <div>
                <label className="text-primary-100 text-sm font-medium block mb-2">Arpeggio Pattern</label>
                <select
                  value={arpeggioPattern}
                  onChange={(e) => setArpeggioPattern(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {arpeggioPatterns.map((pattern) => (
                    <option key={pattern} value={pattern} className="bg-gray-800">
                      {pattern}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-blue-50 mt-1">Pattern notation: 1=root, 3=3rd, 5=5th, 8=octave</p>
              </div>
            )}

            {voicingTechnique === 'partial' && (
              <div>
                <label className="text-purple-100 text-sm font-medium block mb-2">Partial Voicing Mode</label>
                <select
                  value={partialMode}
                  onChange={(e) => setPartialMode(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="root-third" className="bg-gray-800">Root + 3rd (standard dyad)</option>
                  <option value="root-fifth" className="bg-gray-800">Root + 5th (power chord)</option>
                  <option value="third-fifth" className="bg-gray-800">3rd + 5th (rootless)</option>
                  <option value="root-only" className="bg-gray-800">Root Only (bass note)</option>
                  <option value="shell" className="bg-gray-800">Shell Voicing (R-3-7, jazz)</option>
                </select>
                <p className="text-xs text-blue-50 mt-1">
                  {partialMode === 'root-third' && '→ Plays root and third (defines major/minor quality)'}
                  {partialMode === 'root-fifth' && '→ Plays root and fifth (power chord, no 3rd)'}
                  {partialMode === 'third-fifth' && '→ Plays 3rd and 5th (rootless, jazzy)'}
                  {partialMode === 'root-only' && '→ Plays only root note (bass line)'}
                  {partialMode === 'shell' && '→ Plays root, 3rd, 7th (omits 5th, jazz standard)'}
                </p>
              </div>
            )}

            {voicingTechnique === 'broken' && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-100 text-xs">
                  <strong>Broken Chord:</strong> Notes played with highly irregular, syncopated timing creating a "stumbling" or "broken" rhythmic effect. Each note has random velocity (60-100%) and staccato articulation.
                </p>
              </div>
            )}

            {voicingTechnique === 'block' && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-50 text-xs">
                  <strong>Block Chords:</strong> All notes played simultaneously with even emphasis. The classic, traditional voicing technique.
                </p>
              </div>
            )}

            {(voicingTechnique === 'block' || voicingTechnique === 'arpeggiated' || voicingTechnique === 'broken') && (
              <div className="mt-3">
                <button
                  onClick={() => setShowAdvancedPatterns(!showAdvancedPatterns)}
                  className="w-full px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-100 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  {showAdvancedPatterns ? 'Hide' : 'Show'} Advanced Pattern Options
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Voicing Pattern Controls - Conditionally Visible */}
          {showAdvancedPatterns && (
            <div className="relative">
              <button
                onClick={() => setShowAdvancedPatterns(false)}
                className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors shadow-lg"
                title="Close Advanced Options"
              >
                ×
              </button>
              <EnhancedVoicingControls
                voicingTechnique={voicingTechnique}
                selectedBlockPatternId={selectedBlockPatternId}
                selectedArpPatternId={selectedArpPatternId}
                selectedStrumPatternId={selectedStrumPatternId}
                selectedBrokenPatternId={selectedBrokenPatternId}
                selectedBrokenChordPatternId={selectedBrokenChordPatternId}
                partialMode={partialMode}
                onBlockPatternChange={setSelectedBlockPatternId}
                onArpPatternChange={setSelectedArpPatternId}
                onStrumPatternChange={setSelectedStrumPatternId}
                onBrokenPatternChange={setSelectedBrokenPatternId}
                onBrokenChordPatternChange={setSelectedBrokenChordPatternId}
                onPartialModeChange={setPartialMode}
              />
            </div>
          )}

          {/* Toggle Button for Tiered Arpeggio System */}
          <div className="mt-4">
            <button
              onClick={() => setShowTieredArpeggio(!showTieredArpeggio)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showTieredArpeggio
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Music className="w-5 h-5" />
              {showTieredArpeggio ? 'Hide' : 'Show'} Tiered Arpeggio System
            </button>
          </div>

          {/* Tiered Arpeggio System */}
          {showTieredArpeggio && (
            <div className="mt-4">
              <TieredArpeggioSelector
                onConfigChange={setTieredArpeggioConfig}
                progressionLength={isCustomMode ? customProgression.length : progressionLength}
              />
            </div>
          )}

          {/* Advanced Strum Controls */}
          {voicingTechnique === 'strum' && (
            <div className="mt-4">
              <AdvancedStrumControls
                controls={advancedStrumControls}
                onChange={setAdvancedStrumControls}
                isExpanded={showAdvancedStrumControls}
                onToggle={() => setShowAdvancedStrumControls(!showAdvancedStrumControls)}
              />
            </div>
          )}

          {showPatternEditor && (
            <CustomPatternEditor
              isOpen={showPatternEditor}
              onClose={() => setShowPatternEditor(false)}
              patternType={voicingTechnique}
            />
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {generateChordProgression(
              isCustomMode ? customKeySignature : propKeySignature,
              selectedProgression,
              customProgression
            ).filter(chord => chord && chord.name).map((chord, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentChord === chord.name
                    ? 'bg-yellow-500 text-yellow-900 shadow-lg scale-110'
                    : 'bg-neutral-700 text-white'
                }`}
              >
                <div className="font-bold">{chord.romanNumeral}</div>
                <div className="text-xs">{chord.root}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progression Manager Modal */}
      {showProgressionManager && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-white/20 rounded-lg w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Saved Progressions</h3>
              <button
                onClick={() => setShowProgressionManager(false)}
                className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* PHASE 1: Search and Filter Controls */}
            <div className="p-4 border-b border-white/10 space-y-3 bg-white/5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search by name or description..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-wrap gap-1">
                  {['gospel', 'worship', 'jazz', 'pop', 'blues'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleFilterTag(tag)}
                      className={`px-2 py-1 rounded-full text-xs transition-all ${
                        filterTags.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      showFavoritesOnly
                        ? 'bg-yellow-500 text-yellow-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    ⭐ Favorites
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                  >
                    <option value="recent" className="bg-gray-800">Recent</option>
                    <option value="name" className="bg-gray-800">Name</option>
                    <option value="played" className="bg-gray-800">Most Played</option>
                  </select>
                </div>
              </div>
              {(filterTags.length > 0 || searchQuery.trim()) && (
                <div className="text-xs text-blue-100">
                  {getFilteredProgressions().length} progression(s) found
                  {filterTags.length > 0 && ` with tags: ${filterTags.join(', ')}`}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {getFilteredProgressions().length === 0 ? (
                <p className="text-white/80 text-center py-8">
                  {savedProgressions.length === 0 ? 'No saved progressions yet' : 'No progressions match your filters'}
                </p>
              ) : (
                getFilteredProgressions().map((prog) => (
                  <div key={prog.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(prog.id)}
                            className="text-lg transition-all hover:scale-110"
                          >
                            {prog.is_favorite ? '⭐' : '☆'}
                          </button>
                          <h4 className="text-white font-bold">{prog.name}</h4>
                          {prog.style && prog.style !== 'custom' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-100 text-xs">
                              {prog.style}
                            </span>
                          )}
                        </div>
                        {prog.description && (
                          <p className="text-xs text-white/80 mt-1">{prog.description}</p>
                        )}
                        {prog.tags && prog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prog.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadProgression(prog)}
                          className="px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-sm transition-all"
                        >
                          Load
                        </button>
                        {savedProgressions.length > 1 && (
                          <button
                            onClick={() => {
                              const other = savedProgressions.find(p => p.id !== prog.id);
                              if (other && confirm(`Combine "${prog.name}" with "${other.name}"?`)) {
                                combineProgressions(prog, other);
                                setShowProgressionManager(false);
                              }
                            }}
                            className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm transition-all"
                            title="Combine with another progression"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteProgression(prog.id)}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-white space-y-1">
                      <p className="font-mono text-xs">{prog.chords.join(' → ')}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Key: {prog.key_signature} | Tempo: {prog.tempo}</span>
                        {prog.times_played > 0 && (
                          <span className="text-blue-100">▶ Played {prog.times_played}x</span>
                        )}
                      </div>
                      <p className="text-xs">Voicing: {prog.voicing_technique} | Pattern: {prog.arpeggio_pattern}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #10b981);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #10b981);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>

    {/* Recording Studios - REMOVED: Now integrated into CompactRecordingStudio in ScripturePlayer badge area */}

    {/* UNIFIED VOICE RECORDER - New main recording interface */}
    <UnifiedVoiceRecorder
      isVisible={isVisible}
      scriptureText={scriptureText}
      musicRecordingBlob={recordedMusicBlob}
      musicAudioContext={Tone.context.rawContext as AudioContext}
      musicAudioNode={volumeNodeRef.current}
      currentChord={currentChord}
      isPlaying={isPlaying}
      bpm={realTimeBPM}
      instrument={selectedSound}
    />

    {/* LEGACY RECORDERS - Preserved for backward compatibility (hidden by default) */}
    {/* These components are kept intact and can be shown via a toggle if needed */}
    <div style={{ display: 'none' }} data-legacy-recorders="preserved">
      <VoiceRecorder
        isVisible={isVisible}
        scriptureText={scriptureText}
        musicRecordingBlob={recordedMusicBlob}
        musicAudioContext={Tone.context.rawContext as AudioContext}
        musicAudioNode={volumeNodeRef.current}
      />

      <VoiceRecorderV2
        scriptureText={scriptureText}
        musicAudioContext={Tone.context.rawContext as AudioContext}
        musicAudioNode={volumeNodeRef.current}
      />

      <VoiceChordMixer
        currentChord={currentChord}
        isPlaying={isPlaying}
        bpm={realTimeBPM}
        instrument={selectedSound}
      />
    </div>

    {showSessionBank && (
      <SessionBank
        onLoadSong={handleLoadSong}
        currentSongData={getCurrentSongData()}
      />
    )}

    {isVisible && (
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowSessionBank(!showSessionBank)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Music className="w-5 h-5" />
          <span>{showSessionBank ? 'Hide' : 'Show'} Session Bank</span>
        </button>
      </div>
    )}

    {/* Audio Effects Suite Modal */}
    {showAudioEffects && (
      <SimpleAudioEffects
        isVisible={showAudioEffects}
        onClose={() => setShowAudioEffects(false)}
      />
    )}

    {/* ADDITIVE: Real-Time Queued Changes Indicator */}
    {isVisible && (
      <QueuedChangeIndicator
        queue={realtimeIntegration.queueSystem.queue}
        onClearParameter={realtimeIntegration.queueSystem.clearQueuedParameter}
        onClearAll={realtimeIntegration.queueSystem.clearQueue}
        showNotifications={realtimeIntegration.queueSystem.settings.showNotifications}
      />
    )}
    </>
  );
});

// Add display name for dev tools
MusicMachine.displayName = 'MusicMachine';
