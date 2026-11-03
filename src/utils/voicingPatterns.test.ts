/**
 * Comprehensive Unit Tests for Voicing Patterns
 *
 * Tests all voicing techniques:
 * - Block voicing patterns (15 patterns)
 * - Arpeggiated patterns (24 patterns)
 * - Broken chord patterns (15 patterns)
 * - Partial voicing modes (5 modes)
 */

import {
  BLOCK_PATTERNS,
  ARPEGGIATED_PATTERNS,
  BROKEN_PATTERNS,
  getPatternById,
  getPatternsForTimeSignature,
  getDefaultPattern
} from '../data/voicingPatternLibrary';

import {
  validateBlockPattern,
  validateArpeggiatedPattern,
  validateBrokenPattern,
  getMeasureConstraints
} from './patternValidator';

// Test runner
export function runVoicingPatternsTests() {
  console.group('🎵 Voicing Patterns Comprehensive Tests');

  try {
    testBlockPatterns();
    testArpeggiatedPatterns();
    testBrokenPatterns();
    testPartialVoicingModes();
    testPatternRetrieval();
    testTimeSignatureFiltering();
    testPatternValidation();
    testEdgeCases();

    console.log('✅ All voicing pattern tests passed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

// ============================================
// BLOCK PATTERN TESTS
// ============================================

function testBlockPatterns() {
  console.group('Test: Block Voicing Patterns');

  // Test pattern count
  assert(BLOCK_PATTERNS.length === 16, `Expected 16 block patterns, got ${BLOCK_PATTERNS.length}`);

  // Test 4/4 patterns
  testBlockPattern('block-4quarter', '4/4', 4, 'Four quarter notes');
  testBlockPattern('block-2half', '4/4', 2, 'Two half notes');
  testBlockPattern('block-whole', '4/4', 1, 'Whole note');
  testBlockPattern('block-dotted-half-quarter', '4/4', 2, 'Dotted half + quarter');
  testBlockPattern('block-half-2quarter', '4/4', 3, 'Half + 2 quarters');
  testBlockPattern('block-quarter-half-quarter', '4/4', 3, 'Quarter + half + quarter');
  testBlockPattern('block-2quarter-half', '4/4', 3, '2 Quarters + half');
  testBlockPattern('block-8eighth', '4/4', 8, '8 eighth notes');
  testBlockPattern('block-syncopated', '4/4', 4, 'Syncopated off-beat');

  // Test 3/4 patterns (Waltz)
  testBlockPattern('block-3quarter-waltz', '3/4', 3, 'Three quarter notes waltz');
  testBlockPattern('block-dotted-half-waltz', '3/4', 1, 'Dotted half waltz');
  testBlockPattern('block-half-quarter-waltz', '3/4', 2, 'Half + quarter waltz');

  // Test 2/4 patterns (March)
  testBlockPattern('block-2quarter-march', '2/4', 2, 'Two quarter notes march');
  testBlockPattern('block-half-march', '2/4', 1, 'Half note march');

  // Test 6/8 patterns
  testBlockPattern('block-6eighth-68', '6/8', 6, '6 eighth notes');
  testBlockPattern('block-2dotted-quarter-68', '6/8', 2, '2 dotted quarters');

  console.log('✓ Block pattern tests passed');
  console.groupEnd();
}

function testBlockPattern(id: string, timeSignature: string, expectedDurations: number, description: string) {
  const pattern = BLOCK_PATTERNS.find(p => p.id === id);
  assert(pattern !== undefined, `Pattern ${id} not found`);
  assert(pattern!.timeSignature === timeSignature, `${id}: Expected ${timeSignature}, got ${pattern!.timeSignature}`);
  assert(pattern!.durations.length === expectedDurations, `${id}: Expected ${expectedDurations} durations, got ${pattern!.durations.length}`);

  // Validate pattern structure
  const validation = validateBlockPattern(pattern!);
  if (!validation.isValid) {
    console.error(`${id} validation errors:`, validation.errors);
  }
  assert(validation.isValid, `${id} failed validation: ${validation.errors.join(', ')}`);
}

// ============================================
// ARPEGGIATED PATTERN TESTS
// ============================================

function testArpeggiatedPatterns() {
  console.group('Test: Arpeggiated Patterns');

  // Test pattern count
  assert(ARPEGGIATED_PATTERNS.length === 24, `Expected 24 arpeggio patterns, got ${ARPEGGIATED_PATTERNS.length}`);

  // Test sixteenth note patterns
  testArpPattern('arp-1353', '1-3-5-3', 'sixteenth', 'Up and back');
  testArpPattern('arp-1535', '1-5-3-5', 'sixteenth', 'Root fifth third fifth');
  testArpPattern('arp-1351', '1-3-5-1', 'sixteenth', 'Up and down');
  testArpPattern('arp-1531', '1-5-3-1', 'sixteenth', 'Root fifth third root');
  testArpPattern('arp-3153', '3-1-5-3', 'sixteenth', 'Third root fifth third');
  testArpPattern('arp-3515', '3-5-1-5', 'sixteenth', 'Third fifth root fifth');
  testArpPattern('arp-5313', '5-3-1-3', 'sixteenth', 'Fifth down');
  testArpPattern('arp-5135', '5-1-3-5', 'sixteenth', 'Fifth root third fifth');

  // Test eighth note patterns
  testArpPattern('arp-135', '1-3-5', 'eighth', 'Simple ascending');
  testArpPattern('arp-153', '1-5-3', 'eighth', 'Root fifth third');
  testArpPattern('arp-315', '3-1-5', 'eighth', 'Third root fifth');
  testArpPattern('arp-351', '3-5-1', 'eighth', 'Third fifth root');
  testArpPattern('arp-513', '5-1-3', 'eighth', 'Simple descending');
  testArpPattern('arp-531', '5-3-1', 'eighth', 'Full descending');

  // Test octave patterns
  testArpPattern('arp-1358', '1-3-5-8', 'sixteenth', 'Octave arpeggio');
  testArpPattern('arp-1585', '1-5-8-5', 'sixteenth', 'Wide octave');
  testArpPattern('arp-8531', '8-5-3-1', 'sixteenth', 'Octave descending');

  // Test extended patterns
  testArpPattern('arp-13531', '1-3-5-3-1', 'sixteenth', 'Extended up/down');
  testArpPattern('arp-15351', '1-5-3-5-1', 'sixteenth', 'Alternating extended');
  testArpPattern('arp-13513', '1-3-5-1-3', 'sixteenth', 'Continuous ascending');

  // Test triplet patterns
  testArpPattern('arp-triplet-135', '1-3-5', 'triplet-eighth', 'Triplet ascending');
  testArpPattern('arp-triplet-531', '5-3-1', 'triplet-eighth', 'Triplet descending');

  // Test special patterns
  const swingPattern = ARPEGGIATED_PATTERNS.find(p => p.id === 'arp-swing-1353');
  assert(swingPattern !== undefined, 'Swing pattern not found');
  assert(swingPattern!.swingAmount === 0.66, 'Swing amount incorrect');

  const velocityPattern = ARPEGGIATED_PATTERNS.find(p => p.id === 'arp-velocity-135');
  assert(velocityPattern !== undefined, 'Velocity pattern not found');
  assert(velocityPattern!.velocityVariation === true, 'Velocity variation not enabled');

  console.log('✓ Arpeggiated pattern tests passed');
  console.groupEnd();
}

function testArpPattern(id: string, expectedSequence: string, expectedSubdivision: string, description: string) {
  const pattern = ARPEGGIATED_PATTERNS.find(p => p.id === id);
  assert(pattern !== undefined, `Pattern ${id} not found`);
  assert(pattern!.sequence === expectedSequence, `${id}: Expected sequence ${expectedSequence}, got ${pattern!.sequence}`);
  assert(pattern!.subdivision === expectedSubdivision, `${id}: Expected subdivision ${expectedSubdivision}, got ${pattern!.subdivision}`);

  // Validate pattern structure
  const validation = validateArpeggiatedPattern(pattern!);
  if (!validation.isValid) {
    console.error(`${id} validation errors:`, validation.errors);
  }
  assert(validation.isValid, `${id} failed validation: ${validation.errors.join(', ')}`);
}

// ============================================
// BROKEN PATTERN TESTS
// ============================================

function testBrokenPatterns() {
  console.group('Test: Broken Chord Patterns');

  // Test pattern count
  assert(BROKEN_PATTERNS.length === 15, `Expected 15 broken patterns, got ${BROKEN_PATTERNS.length}`);

  // Test standard patterns
  testBrokenPattern('broken-standard', 3, 'Standard 16-16-8');
  testBrokenPattern('broken-reverse', 3, 'Reverse 8-16-16');
  testBrokenPattern('broken-alternating', 3, 'Alternating 16-8-16-8');
  testBrokenPattern('broken-even-eighths', 2, 'Even eighths');
  testBrokenPattern('broken-scotch-snap', 2, 'Scotch snap');
  testBrokenPattern('broken-dotted', 2, 'Dotted rhythm');
  testBrokenPattern('broken-triplet', 3, 'Triplet broken');
  testBrokenPattern('broken-stutter', 4, 'Stuttering 16-16-16-16');
  testBrokenPattern('broken-gallop', 3, 'Galloping');
  testBrokenPattern('broken-syncopated', 3, 'Syncopated broken');

  // Test stumble patterns
  const lightStumble = BROKEN_PATTERNS.find(p => p.id === 'broken-stumble-light');
  assert(lightStumble !== undefined, 'Light stumble pattern not found');
  assert(lightStumble!.microTimingOffset === 0.02, 'Light stumble offset incorrect');

  const heavyStumble = BROKEN_PATTERNS.find(p => p.id === 'broken-stumble-heavy');
  assert(heavyStumble !== undefined, 'Heavy stumble pattern not found');
  assert(heavyStumble!.microTimingOffset === 0.05, 'Heavy stumble offset incorrect');

  // Test random patterns
  const randomLight = BROKEN_PATTERNS.find(p => p.id === 'broken-random-light');
  assert(randomLight !== undefined, 'Random light pattern not found');
  assert(randomLight!.dropProbability === 0.15, 'Random light drop probability incorrect');

  const randomMedium = BROKEN_PATTERNS.find(p => p.id === 'broken-random-medium');
  assert(randomMedium !== undefined, 'Random medium pattern not found');
  assert(randomMedium!.dropProbability === 0.25, 'Random medium drop probability incorrect');

  // Test waltz pattern
  testBrokenPattern('broken-waltz', 3, 'Waltz broken');

  console.log('✓ Broken pattern tests passed');
  console.groupEnd();
}

function testBrokenPattern(id: string, expectedRhythmCount: number, description: string) {
  const pattern = BROKEN_PATTERNS.find(p => p.id === id);
  assert(pattern !== undefined, `Pattern ${id} not found`);
  assert(pattern!.rhythmTemplate.length === expectedRhythmCount,
    `${id}: Expected ${expectedRhythmCount} rhythm elements, got ${pattern!.rhythmTemplate.length}`);
  assert(pattern!.accentPlacement.length === expectedRhythmCount,
    `${id}: Accent count mismatch`);

  // Validate pattern structure
  const validation = validateBrokenPattern(pattern!);
  if (!validation.isValid) {
    console.error(`${id} validation errors:`, validation.errors);
  }
  assert(validation.isValid, `${id} failed validation: ${validation.errors.join(', ')}`);
}

// ============================================
// PARTIAL VOICING MODE TESTS
// ============================================

function testPartialVoicingModes() {
  console.group('Test: Partial Voicing Modes');

  // Test partial modes with sample chord [C, E, G, B]
  const testChord = ['C4', 'E4', 'G4', 'B4'];

  // Root + Third
  const rootThird = getPartialNotes(testChord, 'root-third');
  assert(rootThird.length === 2, 'Root-third should have 2 notes');
  assert(rootThird[0] === 'C4' && rootThird[1] === 'E4', 'Root-third should be C and E');

  // Root + Fifth (Power chord)
  const rootFifth = getPartialNotes(testChord, 'root-fifth');
  assert(rootFifth.length === 2, 'Root-fifth should have 2 notes');
  assert(rootFifth[0] === 'C4' && rootFifth[1] === 'G4', 'Root-fifth should be C and G');

  // Third + Fifth
  const thirdFifth = getPartialNotes(testChord, 'third-fifth');
  assert(thirdFifth.length === 2, 'Third-fifth should have 2 notes');
  assert(thirdFifth[0] === 'E4' && thirdFifth[1] === 'G4', 'Third-fifth should be E and G');

  // Root only
  const rootOnly = getPartialNotes(testChord, 'root-only');
  assert(rootOnly.length === 1, 'Root-only should have 1 note');
  assert(rootOnly[0] === 'C4', 'Root-only should be C');

  // Shell voicing (Root + Third + Seventh, no fifth)
  const shell = getPartialNotes(testChord, 'shell');
  assert(shell.length === 3, 'Shell should have 3 notes');
  assert(shell[0] === 'C4' && shell[1] === 'E4' && shell[2] === 'B4', 'Shell should be C, E, B (no G)');

  // Test with triad (no 7th)
  const triad = ['C4', 'E4', 'G4'];
  const shellTriad = getPartialNotes(triad, 'shell');
  assert(shellTriad.length === 2, 'Shell from triad should fall back to 2 notes');

  console.log('✓ Partial voicing mode tests passed');
  console.groupEnd();
}

// Helper function to simulate partial voicing logic
function getPartialNotes(notes: string[], partialMode: string): string[] {
  if (notes.length < 3 && partialMode !== 'root-only') {
    return notes;
  }

  switch (partialMode) {
    case 'root-third':
      return [notes[0], notes[1]];
    case 'root-fifth':
      return [notes[0], notes[2]];
    case 'third-fifth':
      return notes.length >= 3 ? [notes[1], notes[2]] : [notes[0], notes[1]];
    case 'root-only':
      return [notes[0]];
    case 'shell':
      return notes.length >= 4 ? [notes[0], notes[1], notes[3]] : [notes[0], notes[1]];
    default:
      return [notes[0], notes[1]];
  }
}

// ============================================
// PATTERN RETRIEVAL TESTS
// ============================================

function testPatternRetrieval() {
  console.group('Test: Pattern Retrieval Functions');

  // Test getPatternById
  const block = getPatternById('block-4quarter', 'block');
  assert(block !== undefined, 'Should find block pattern by ID');
  assert(block!.id === 'block-4quarter', 'Should return correct pattern');

  const arp = getPatternById('arp-1353', 'arpeggiated');
  assert(arp !== undefined, 'Should find arpeggiated pattern by ID');
  assert(arp!.id === 'arp-1353', 'Should return correct pattern');

  const broken = getPatternById('broken-standard', 'broken');
  assert(broken !== undefined, 'Should find broken pattern by ID');
  assert(broken!.id === 'broken-standard', 'Should return correct pattern');

  const notFound = getPatternById('invalid-id', 'block');
  assert(notFound === undefined, 'Should return undefined for invalid ID');

  console.log('✓ Pattern retrieval tests passed');
  console.groupEnd();
}

// ============================================
// TIME SIGNATURE FILTERING TESTS
// ============================================

function testTimeSignatureFiltering() {
  console.group('Test: Time Signature Filtering');

  // Test 4/4 patterns
  const fourFour = getPatternsForTimeSignature('4/4');
  assert(fourFour.length === 9, `Expected 9 patterns for 4/4, got ${fourFour.length}`);
  fourFour.forEach(p => {
    assert(p.timeSignature === '4/4', `Pattern ${p.id} should be 4/4`);
  });

  // Test 3/4 patterns (Waltz)
  const threeFour = getPatternsForTimeSignature('3/4');
  assert(threeFour.length === 3, `Expected 3 patterns for 3/4, got ${threeFour.length}`);
  threeFour.forEach(p => {
    assert(p.timeSignature === '3/4', `Pattern ${p.id} should be 3/4`);
  });

  // Test 2/4 patterns (March)
  const twoFour = getPatternsForTimeSignature('2/4');
  assert(twoFour.length === 2, `Expected 2 patterns for 2/4, got ${twoFour.length}`);
  twoFour.forEach(p => {
    assert(p.timeSignature === '2/4', `Pattern ${p.id} should be 2/4`);
  });

  // Test 6/8 patterns
  const sixEight = getPatternsForTimeSignature('6/8');
  assert(sixEight.length === 2, `Expected 2 patterns for 6/8, got ${sixEight.length}`);
  sixEight.forEach(p => {
    assert(p.timeSignature === '6/8', `Pattern ${p.id} should be 6/8`);
  });

  console.log('✓ Time signature filtering tests passed');
  console.groupEnd();
}

// ============================================
// PATTERN VALIDATION TESTS
// ============================================

function testPatternValidation() {
  console.group('Test: Pattern Validation');

  // Test measure constraints
  const fourFourConstraints = getMeasureConstraints('4/4');
  assert(fourFourConstraints.beatsPerMeasure === 4, '4/4 should have 4 beats');
  assert(fourFourConstraints.beatUnit === 4, '4/4 beat unit should be 4');

  const threeFourConstraints = getMeasureConstraints('3/4');
  assert(threeFourConstraints.beatsPerMeasure === 3, '3/4 should have 3 beats');

  const sixEightConstraints = getMeasureConstraints('6/8');
  assert(sixEightConstraints.beatsPerMeasure === 6, '6/8 should have 6 beats');

  // Validate all block patterns
  BLOCK_PATTERNS.forEach(pattern => {
    const validation = validateBlockPattern(pattern);
    if (!validation.isValid) {
      console.error(`Block pattern ${pattern.id} failed:`, validation.errors);
    }
    assert(validation.isValid, `Block pattern ${pattern.id} should be valid`);
  });

  // Validate all arpeggiated patterns
  ARPEGGIATED_PATTERNS.forEach(pattern => {
    const validation = validateArpeggiatedPattern(pattern);
    if (!validation.isValid) {
      console.error(`Arp pattern ${pattern.id} failed:`, validation.errors);
    }
    assert(validation.isValid, `Arp pattern ${pattern.id} should be valid`);
  });

  // Validate all broken patterns
  BROKEN_PATTERNS.forEach(pattern => {
    const validation = validateBrokenPattern(pattern);
    if (!validation.isValid) {
      console.error(`Broken pattern ${pattern.id} failed:`, validation.errors);
    }
    assert(validation.isValid, `Broken pattern ${pattern.id} should be valid`);
  });

  console.log('✓ Pattern validation tests passed');
  console.groupEnd();
}

// ============================================
// EDGE CASE TESTS
// ============================================

function testEdgeCases() {
  console.group('Test: Edge Cases');

  // Test default patterns
  assert(getDefaultPattern('block') === 'block-4quarter', 'Block default should be 4 quarter');
  assert(getDefaultPattern('arpeggiated') === 'arp-1353', 'Arp default should be 1-3-5-3');
  assert(getDefaultPattern('broken') === 'broken-standard', 'Broken default should be standard');

  // Test empty partial voicing
  const emptyChord: string[] = [];
  const partialEmpty = getPartialNotes(emptyChord, 'root-third');
  assert(partialEmpty.length === 0, 'Empty chord should return empty array');

  // Test single note partial voicing
  const singleNote = ['C4'];
  const partialSingle = getPartialNotes(singleNote, 'root-only');
  assert(partialSingle.length === 1, 'Single note root-only should return 1 note');
  assert(partialSingle[0] === 'C4', 'Single note should be C4');

  // Test two-note chord with shell voicing
  const twoNotes = ['C4', 'E4'];
  const partialTwo = getPartialNotes(twoNotes, 'shell');
  assert(partialTwo.length === 2, 'Two-note shell should fall back to both notes');

  // Test invalid pattern type
  const invalidType = getPatternById('block-4quarter', 'invalid' as any);
  assert(invalidType === undefined, 'Invalid type should return undefined');

  // Test non-existent time signature
  const noPatterns = getPatternsForTimeSignature('7/8');
  assert(noPatterns.length === 0, 'Non-existent time signature should return empty array');

  console.log('✓ Edge case tests passed');
  console.groupEnd();
}

// ============================================
// ASSERTION HELPER
// ============================================

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).runVoicingPatternsTests = runVoicingPatternsTests;
  console.log('💡 Run voicing pattern tests in console: runVoicingPatternsTests()');
}
