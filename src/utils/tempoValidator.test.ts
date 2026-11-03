/**
 * Unit Tests for Tempo Validation
 *
 * Run with: npm test (if you have a test runner configured)
 * Or manually verify by importing and running these test functions
 */

import {
  validateTempo,
  clampTempo,
  getTempoDescription,
  validateTempoTransition,
  safeTempoOperation,
  TEMPO_CONSTANTS,
  TEMPO_PRESETS,
} from './tempoValidator';

// Test suite runner
export function runTempoValidatorTests() {
  console.group('🧪 Tempo Validator Tests');

  try {
    testValidateTempo();
    testClampTempo();
    testGetTempoDescription();
    testValidateTempoTransition();
    testSafeTempoOperation();
    testTempoConstants();
    testTempoPresets();

    console.log('✅ All tempo validator tests passed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    console.groupEnd();
  }
}

// Test: validateTempo function
function testValidateTempo() {
  console.group('Test: validateTempo');

  // Valid tempo
  const result1 = validateTempo(80);
  assert(result1.isValid === true, 'Valid tempo should pass');
  assert(result1.value === 80, 'Value should be preserved');
  assert(result1.errors.length === 0, 'No errors for valid tempo');

  // Null/undefined
  const result2 = validateTempo(null);
  assert(result2.isValid === false, 'Null should be invalid');
  assert(result2.value === TEMPO_CONSTANTS.DEFAULT_BPM, 'Should return default');

  // NaN
  const result3 = validateTempo('abc');
  assert(result3.isValid === false, 'NaN should be invalid');
  assert(result3.errors.length > 0, 'Should have errors');

  // Below minimum
  const result4 = validateTempo(10);
  assert(result4.isValid === false, 'Below minimum should be invalid');
  assert(result4.value === TEMPO_CONSTANTS.MIN_BPM, 'Should clamp to minimum');

  // Above maximum
  const result5 = validateTempo(300);
  assert(result5.isValid === false, 'Above maximum should be invalid');
  assert(result5.value === TEMPO_CONSTANTS.MAX_BPM, 'Should clamp to maximum');

  // Warning zone (low)
  const result6 = validateTempo(30);
  assert(result6.isValid === true, 'Low but valid tempo should pass');
  assert(result6.warnings.length > 0, 'Should have warnings');

  // Warning zone (high)
  const result7 = validateTempo(200);
  assert(result7.isValid === true, 'High but valid tempo should pass');
  assert(result7.warnings.length > 0, 'Should have warnings');

  console.log('✓ validateTempo tests passed');
  console.groupEnd();
}

// Test: clampTempo function
function testClampTempo() {
  console.group('Test: clampTempo');

  assert(clampTempo(80) === 80, 'Valid tempo should not change');
  assert(clampTempo(10) === TEMPO_CONSTANTS.MIN_BPM, 'Should clamp to minimum');
  assert(clampTempo(300) === TEMPO_CONSTANTS.MAX_BPM, 'Should clamp to maximum');
  assert(clampTempo('100') === 100, 'String numbers should work');
  assert(clampTempo('abc') === TEMPO_CONSTANTS.DEFAULT_BPM, 'Invalid should return default');
  assert(clampTempo(null) === TEMPO_CONSTANTS.DEFAULT_BPM, 'Null should return default');
  assert(clampTempo(undefined) === TEMPO_CONSTANTS.DEFAULT_BPM, 'Undefined should return default');
  assert(clampTempo(Infinity) === TEMPO_CONSTANTS.DEFAULT_BPM, 'Infinity should return default');

  console.log('✓ clampTempo tests passed');
  console.groupEnd();
}

// Test: getTempoDescription function
function testGetTempoDescription() {
  console.group('Test: getTempoDescription');

  assert(getTempoDescription(35) === 'Grave (Very Slow)', 'Grave tempo');
  assert(getTempoDescription(50) === 'Largo (Slow)', 'Largo tempo');
  assert(getTempoDescription(68) === 'Adagio (Slow)', 'Adagio tempo');
  assert(getTempoDescription(84) === 'Andante (Walking Pace)', 'Andante tempo');
  assert(getTempoDescription(108) === 'Moderato (Moderate)', 'Moderato tempo');
  assert(getTempoDescription(132) === 'Allegro (Fast)', 'Allegro tempo');
  assert(getTempoDescription(156) === 'Vivace (Lively)', 'Vivace tempo');
  assert(getTempoDescription(180) === 'Presto (Very Fast)', 'Presto tempo');
  assert(getTempoDescription(220) === 'Prestissimo (Extremely Fast)', 'Prestissimo tempo');

  console.log('✓ getTempoDescription tests passed');
  console.groupEnd();
}

// Test: validateTempoTransition function
function testValidateTempoTransition() {
  console.group('Test: validateTempoTransition');

  // Small change (valid)
  const result1 = validateTempoTransition(100, 110);
  assert(result1.isValid === true, 'Small change should be valid');
  assert(!result1.warning, 'No warning for small change');

  // Large change (invalid)
  const result2 = validateTempoTransition(100, 150);
  assert(result2.isValid === false, 'Large change should be invalid');
  assert(result2.warning !== undefined, 'Should have warning');

  // Same tempo
  const result3 = validateTempoTransition(100, 100);
  assert(result3.isValid === true, 'Same tempo should be valid');

  // Custom threshold
  const result4 = validateTempoTransition(100, 120, 10);
  assert(result4.isValid === false, 'Should respect custom threshold');

  console.log('✓ validateTempoTransition tests passed');
  console.groupEnd();
}

// Test: safeTempoOperation function
function testSafeTempoOperation() {
  console.group('Test: safeTempoOperation');

  // Successful operation
  const result1 = safeTempoOperation(() => 100, 80);
  assert(result1 === 100, 'Should return operation result');

  // Failed operation
  const result2 = safeTempoOperation(() => {
    throw new Error('Test error');
  }, 80);
  assert(result2 === 80, 'Should return fallback on error');

  // Error callback
  let errorCalled = false;
  safeTempoOperation(
    () => {
      throw new Error('Test error');
    },
    80,
    () => {
      errorCalled = true;
    }
  );
  assert(errorCalled === true, 'Error callback should be called');

  console.log('✓ safeTempoOperation tests passed');
  console.groupEnd();
}

// Test: TEMPO_CONSTANTS
function testTempoConstants() {
  console.group('Test: TEMPO_CONSTANTS');

  assert(TEMPO_CONSTANTS.MIN_BPM === 20, 'MIN_BPM should be 20');
  assert(TEMPO_CONSTANTS.MAX_BPM === 240, 'MAX_BPM should be 240');
  assert(TEMPO_CONSTANTS.DEFAULT_BPM === 80, 'DEFAULT_BPM should be 80');
  assert(TEMPO_CONSTANTS.SAFE_MIN_BPM === 40, 'SAFE_MIN_BPM should be 40');
  assert(TEMPO_CONSTANTS.SAFE_MAX_BPM === 180, 'SAFE_MAX_BPM should be 180');

  console.log('✓ TEMPO_CONSTANTS tests passed');
  console.groupEnd();
}

// Test: TEMPO_PRESETS
function testTempoPresets() {
  console.group('Test: TEMPO_PRESETS');

  assert(TEMPO_PRESETS['Largo'] === 50, 'Largo preset');
  assert(TEMPO_PRESETS['Adagio'] === 68, 'Adagio preset');
  assert(TEMPO_PRESETS['Andante'] === 84, 'Andante preset');
  assert(TEMPO_PRESETS['Moderato'] === 108, 'Moderato preset');
  assert(TEMPO_PRESETS['Allegro'] === 132, 'Allegro preset');
  assert(TEMPO_PRESETS['Presto'] === 180, 'Presto preset');

  console.log('✓ TEMPO_PRESETS tests passed');
  console.groupEnd();
}

// Assertion helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).runTempoValidatorTests = runTempoValidatorTests;
  console.log('💡 Run tempo tests in console: runTempoValidatorTests()');
}
