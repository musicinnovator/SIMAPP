/**
 * Unit Tests for Preferences Validation
 *
 * Comprehensive test suite for all preference validation functions
 */

import {
  validateColor,
  validateColorScheme,
  validateFinish,
  validateBackground,
  validateThemeMode,
  validateFontFamily,
  validateFontSize,
  validateFontWeight,
  validateTextScaling,
  validateDensity,
  validateIconStyle,
  validateButtonStyle,
  validateThemePreferences,
  validateFontPreferences,
  validateLayoutPreferences,
  validateAccessibilityPreferences,
  validateUserPreferences,
  safePreferenceOperation,
  getColorSchemeDescription,
  getPerformanceRating
} from './preferencesValidator';

// Test suite runner
export function runPreferencesValidatorTests() {
  console.group('🧪 Preferences Validator Tests');

  try {
    testValidateColor();
    testValidateColorScheme();
    testValidateFinish();
    testValidateBackground();
    testValidateThemeMode();
    testValidateFontFamily();
    testValidateFontSize();
    testValidateFontWeight();
    testValidateTextScaling();
    testValidateDensity();
    testValidateIconStyle();
    testValidateButtonStyle();
    testValidateThemePreferences();
    testValidateFontPreferences();
    testValidateLayoutPreferences();
    testValidateAccessibilityPreferences();
    testSafePreferenceOperation();
    testGetColorSchemeDescription();
    testGetPerformanceRating();

    console.log('✅ All preferences validator tests passed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    console.groupEnd();
  }
}

// Test: validateColor
function testValidateColor() {
  console.group('Test: validateColor');

  // Valid colors
  assert(validateColor('#ffffff').isValid === true, 'Valid hex (6 digits)');
  assert(validateColor('#000').isValid === true, 'Valid hex (3 digits)');
  assert(validateColor('#00ffff').isValid === true, 'Valid cyan');

  // Invalid colors
  assert(validateColor('').isValid === false, 'Empty string');
  assert(validateColor('ffffff').isValid === false, 'Missing #');
  assert(validateColor('#gggggg').isValid === false, 'Invalid hex chars');
  assert(validateColor('#12').isValid === false, 'Too short');
  assert(validateColor('#1234567').isValid === false, 'Too long');
  assert(validateColor('rgb(255,255,255)').isValid === false, 'RGB format not supported');

  console.log('✓ validateColor tests passed');
  console.groupEnd();
}

// Test: validateColorScheme
function testValidateColorScheme() {
  console.group('Test: validateColorScheme');

  // Valid schemes
  assert(validateColorScheme('cyberpunk').isValid === true, 'Valid: cyberpunk');
  assert(validateColorScheme('nord').isValid === true, 'Valid: nord');
  assert(validateColorScheme('vaporwave').isValid === true, 'Valid: vaporwave');

  // Invalid schemes
  assert(validateColorScheme('invalid').isValid === false, 'Invalid scheme name');
  assert(validateColorScheme('').isValid === false, 'Empty string');
  assert(validateColorScheme(null).isValid === false, 'Null value');

  console.log('✓ validateColorScheme tests passed');
  console.groupEnd();
}

// Test: validateFinish
function testValidateFinish() {
  console.group('Test: validateFinish');

  // Valid finishes
  assert(validateFinish('glossy').isValid === true, 'Valid: glossy');
  assert(validateFinish('metallic').isValid === true, 'Valid: metallic');
  assert(validateFinish('frosted').isValid === true, 'Valid: frosted');

  // Check warnings for heavy finishes
  const holographicResult = validateFinish('holographic');
  assert(holographicResult.isValid === true, 'Holographic is valid');
  assert(holographicResult.warnings.length > 0, 'Holographic has performance warning');

  // Invalid finishes
  assert(validateFinish('invalid').isValid === false, 'Invalid finish');
  assert(validateFinish('').isValid === false, 'Empty string');

  console.log('✓ validateFinish tests passed');
  console.groupEnd();
}

// Test: validateBackground
function testValidateBackground() {
  console.group('Test: validateBackground');

  // Valid backgrounds
  assert(validateBackground('gradient').isValid === true, 'Valid: gradient');
  assert(validateBackground('space').isValid === true, 'Valid: space');

  // Check warnings for animated
  const animatedResult = validateBackground('animated');
  assert(animatedResult.isValid === true, 'Animated is valid');
  assert(animatedResult.warnings.length > 0, 'Animated has performance warning');

  // Invalid backgrounds
  assert(validateBackground('invalid').isValid === false, 'Invalid background');

  console.log('✓ validateBackground tests passed');
  console.groupEnd();
}

// Test: validateThemeMode
function testValidateThemeMode() {
  console.group('Test: validateThemeMode');

  // Valid modes
  assert(validateThemeMode('dark').isValid === true, 'Valid: dark');
  assert(validateThemeMode('light').isValid === true, 'Valid: light');
  assert(validateThemeMode('auto').isValid === true, 'Valid: auto');

  // Invalid modes
  assert(validateThemeMode('twilight').isValid === false, 'Invalid mode');
  assert(validateThemeMode('').isValid === false, 'Empty string');

  console.log('✓ validateThemeMode tests passed');
  console.groupEnd();
}

// Test: validateFontFamily
function testValidateFontFamily() {
  console.group('Test: validateFontFamily');

  // Valid fonts
  assert(validateFontFamily('system-ui').isValid === true, 'Valid: system-ui');
  assert(validateFontFamily('inter').isValid === true, 'Valid: inter');
  assert(validateFontFamily('roboto').isValid === true, 'Valid: roboto');

  // Invalid fonts
  assert(validateFontFamily('comic-sans').isValid === false, 'Invalid font');

  console.log('✓ validateFontFamily tests passed');
  console.groupEnd();
}

// Test: validateFontSize
function testValidateFontSize() {
  console.group('Test: validateFontSize');

  // Valid sizes
  assert(validateFontSize('small').isValid === true, 'Valid: small');
  assert(validateFontSize('medium').isValid === true, 'Valid: medium');
  assert(validateFontSize('large').isValid === true, 'Valid: large');
  assert(validateFontSize('extra-large').isValid === true, 'Valid: extra-large');

  // Invalid sizes
  assert(validateFontSize('tiny').isValid === false, 'Invalid size');
  assert(validateFontSize('huge').isValid === false, 'Invalid size');

  console.log('✓ validateFontSize tests passed');
  console.groupEnd();
}

// Test: validateFontWeight
function testValidateFontWeight() {
  console.group('Test: validateFontWeight');

  // Valid weights
  assert(validateFontWeight('light').isValid === true, 'Valid: light');
  assert(validateFontWeight('normal').isValid === true, 'Valid: normal');
  assert(validateFontWeight('bold').isValid === true, 'Valid: bold');

  // Invalid weights
  assert(validateFontWeight('extra-bold').isValid === false, 'Invalid weight');
  assert(validateFontWeight('100').isValid === false, 'Numeric weight not supported');

  console.log('✓ validateFontWeight tests passed');
  console.groupEnd();
}

// Test: validateTextScaling
function testValidateTextScaling() {
  console.group('Test: validateTextScaling');

  // Valid scaling
  assert(validateTextScaling(1.0).isValid === true, 'Valid: 1.0');
  assert(validateTextScaling(0.8).isValid === true, 'Valid: 0.8');
  assert(validateTextScaling(2.0).isValid === true, 'Valid: 2.0');
  assert(validateTextScaling('1.5').isValid === true, 'Valid: "1.5" string');

  // Check warnings
  const lowResult = validateTextScaling(0.7);
  assert(lowResult.isValid === true, 'Low scaling valid');
  assert(lowResult.warnings.length > 0, 'Low scaling has warning');

  const highResult = validateTextScaling(2.5);
  assert(highResult.isValid === true, 'High scaling valid');
  assert(highResult.warnings.length > 0, 'High scaling has warning');

  // Invalid scaling
  assert(validateTextScaling(0.3).isValid === false, 'Too low');
  assert(validateTextScaling(4.0).isValid === false, 'Too high');
  assert(validateTextScaling('abc').isValid === false, 'NaN');
  assert(validateTextScaling(null).isValid === false, 'Null');

  console.log('✓ validateTextScaling tests passed');
  console.groupEnd();
}

// Test: validateDensity
function testValidateDensity() {
  console.group('Test: validateDensity');

  // Valid densities
  assert(validateDensity('compact').isValid === true, 'Valid: compact');
  assert(validateDensity('comfortable').isValid === true, 'Valid: comfortable');
  assert(validateDensity('spacious').isValid === true, 'Valid: spacious');

  // Invalid densities
  assert(validateDensity('tight').isValid === false, 'Invalid density');

  console.log('✓ validateDensity tests passed');
  console.groupEnd();
}

// Test: validateIconStyle
function testValidateIconStyle() {
  console.group('Test: validateIconStyle');

  // Valid styles
  assert(validateIconStyle('modern').isValid === true, 'Valid: modern');
  assert(validateIconStyle('classic').isValid === true, 'Valid: classic');
  assert(validateIconStyle('minimal').isValid === true, 'Valid: minimal');

  // Invalid styles
  assert(validateIconStyle('retro').isValid === false, 'Invalid style');

  console.log('✓ validateIconStyle tests passed');
  console.groupEnd();
}

// Test: validateButtonStyle
function testValidateButtonStyle() {
  console.group('Test: validateButtonStyle');

  // Valid styles
  assert(validateButtonStyle('rounded').isValid === true, 'Valid: rounded');
  assert(validateButtonStyle('sharp').isValid === true, 'Valid: sharp');
  assert(validateButtonStyle('pill').isValid === true, 'Valid: pill');

  // Invalid styles
  assert(validateButtonStyle('square').isValid === false, 'Invalid style');

  console.log('✓ validateButtonStyle tests passed');
  console.groupEnd();
}

// Test: validateThemePreferences
function testValidateThemePreferences() {
  console.group('Test: validateThemePreferences');

  const validTheme = {
    colorScheme: 'cyberpunk',
    finish: 'glossy',
    background: 'gradient',
    mode: 'dark',
    accentColor: '#00ffff',
    textColor: '#ffffff'
  };

  const result = validateThemePreferences(validTheme);
  assert(result.isValid === true, 'Valid theme preferences');

  // Test with invalid color
  const invalidTheme = { ...validTheme, accentColor: 'invalid' };
  const invalidResult = validateThemePreferences(invalidTheme);
  assert(invalidResult.isValid === false, 'Invalid theme detected');
  assert(invalidResult.errors.length > 0, 'Has errors');

  console.log('✓ validateThemePreferences tests passed');
  console.groupEnd();
}

// Test: validateFontPreferences
function testValidateFontPreferences() {
  console.group('Test: validateFontPreferences');

  const validFonts = {
    family: 'inter',
    size: 'medium',
    weight: 'normal'
  };

  const result = validateFontPreferences(validFonts);
  assert(result.isValid === true, 'Valid font preferences');

  // Test with invalid family
  const invalidFonts = { ...validFonts, family: 'invalid' };
  const invalidResult = validateFontPreferences(invalidFonts);
  assert(invalidResult.isValid === false, 'Invalid fonts detected');

  console.log('✓ validateFontPreferences tests passed');
  console.groupEnd();
}

// Test: validateLayoutPreferences
function testValidateLayoutPreferences() {
  console.group('Test: validateLayoutPreferences');

  const validLayout = {
    density: 'comfortable',
    iconStyle: 'modern',
    buttonStyle: 'rounded'
  };

  const result = validateLayoutPreferences(validLayout);
  assert(result.isValid === true, 'Valid layout preferences');

  console.log('✓ validateLayoutPreferences tests passed');
  console.groupEnd();
}

// Test: validateAccessibilityPreferences
function testValidateAccessibilityPreferences() {
  console.group('Test: validateAccessibilityPreferences');

  const validAccessibility = {
    textScaling: 1.0,
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false
  };

  const result = validateAccessibilityPreferences(validAccessibility);
  assert(result.isValid === true, 'Valid accessibility preferences');

  // Test with invalid textScaling
  const invalidAccessibility = { ...validAccessibility, textScaling: 'invalid' };
  const invalidResult = validateAccessibilityPreferences(invalidAccessibility);
  assert(invalidResult.isValid === false, 'Invalid accessibility detected');

  // Test with non-boolean highContrast
  const invalidBoolean = { ...validAccessibility, highContrast: 'yes' };
  const booleanResult = validateAccessibilityPreferences(invalidBoolean);
  assert(booleanResult.isValid === false, 'Non-boolean detected');

  console.log('✓ validateAccessibilityPreferences tests passed');
  console.groupEnd();
}

// Test: safePreferenceOperation
function testSafePreferenceOperation() {
  console.group('Test: safePreferenceOperation');

  // Successful operation
  const result1 = safePreferenceOperation(() => 'success', 'fallback');
  assert(result1 === 'success', 'Returns operation result');

  // Failed operation
  const result2 = safePreferenceOperation(() => {
    throw new Error('Test error');
  }, 'fallback');
  assert(result2 === 'fallback', 'Returns fallback on error');

  // Error callback
  let errorCalled = false;
  safePreferenceOperation(
    () => {
      throw new Error('Test error');
    },
    'fallback',
    () => {
      errorCalled = true;
    }
  );
  assert(errorCalled === true, 'Error callback called');

  console.log('✓ safePreferenceOperation tests passed');
  console.groupEnd();
}

// Test: getColorSchemeDescription
function testGetColorSchemeDescription() {
  console.group('Test: getColorSchemeDescription');

  assert(getColorSchemeDescription('cyberpunk').length > 0, 'Has description for cyberpunk');
  assert(getColorSchemeDescription('nord').length > 0, 'Has description for nord');
  assert(getColorSchemeDescription('warm').length > 0, 'Has description for warm');

  console.log('✓ getColorSchemeDescription tests passed');
  console.groupEnd();
}

// Test: getPerformanceRating
function testGetPerformanceRating() {
  console.group('Test: getPerformanceRating');

  // High performance
  assert(getPerformanceRating('satin', 'gradient') === 'high', 'Simple combo is high performance');

  // Medium performance
  assert(getPerformanceRating('metallic', 'gradient') === 'medium', 'Heavy finish is medium');
  assert(getPerformanceRating('satin', 'animated') === 'medium', 'Heavy background is medium');

  // Low performance
  assert(getPerformanceRating('holographic', 'animated') === 'low', 'Both heavy is low');

  console.log('✓ getPerformanceRating tests passed');
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
  (window as any).runPreferencesValidatorTests = runPreferencesValidatorTests;
  console.log('💡 Run preferences tests in console: runPreferencesValidatorTests()');
}
