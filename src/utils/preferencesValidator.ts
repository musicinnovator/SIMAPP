/**
 * Preferences Validation Utility
 *
 * Provides validation and error handling for all user preference settings
 */

import {
  ColorSchemeType,
  FinishType,
  BackgroundType,
  FontFamily,
  FontSize,
  FontWeight,
  UserPreferences,
  COLOR_PALETTES
} from '../types/preferences';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Valid values arrays
const VALID_COLOR_SCHEMES: ColorSchemeType[] = Object.keys(COLOR_PALETTES) as ColorSchemeType[];

const VALID_FINISHES: FinishType[] = [
  'glossy', 'satin', 'metallic', 'brushed-metal', 'iridescent',
  'holographic', 'textured', 'soft-touch', 'velvet', 'pearlescent',
  'frosted', 'polished', 'grainy', 'translucent', 'diffused'
];

const VALID_BACKGROUNDS: BackgroundType[] = [
  'solid', 'gradient', 'abstract', 'city-lights', 'space',
  'ocean', 'mountains', 'forest', 'animated'
];

const VALID_FONT_FAMILIES: FontFamily[] = [
  'system-ui', 'inter', 'roboto', 'open-sans', 'lato',
  'poppins', 'montserrat', 'source-sans-pro', 'raleway', 'nunito'
];

const VALID_FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'extra-large'];

const VALID_FONT_WEIGHTS: FontWeight[] = ['light', 'normal', 'medium', 'semibold', 'bold'];

const VALID_THEME_MODES = ['dark', 'light', 'auto'] as const;

const VALID_DENSITIES = ['compact', 'comfortable', 'spacious'] as const;

const VALID_ICON_STYLES = ['modern', 'classic', 'minimal'] as const;

const VALID_BUTTON_STYLES = ['rounded', 'sharp', 'pill'] as const;

const VALID_NOTIFICATION_FREQUENCIES = ['all', 'normal', 'minimal'] as const;

const VALID_NOTIFICATION_STYLES = ['banner', 'toast', 'subtle'] as const;

/**
 * Validates a hex color string
 */
export function validateColor(color: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!color) {
    errors.push('Color is required');
    return { isValid: false, errors, warnings };
  }

  // Check hex format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(color)) {
    errors.push(`Invalid color format: ${color}. Must be hex format (e.g., #00ffff)`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates color scheme
 */
export function validateColorScheme(scheme: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_COLOR_SCHEMES.includes(scheme)) {
    errors.push(`Invalid color scheme: ${scheme}. Must be one of: ${VALID_COLOR_SCHEMES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates surface finish
 */
export function validateFinish(finish: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_FINISHES.includes(finish)) {
    errors.push(`Invalid finish: ${finish}. Must be one of: ${VALID_FINISHES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  // Performance warnings for complex finishes
  const heavyFinishes = ['holographic', 'iridescent', 'metallic', 'animated'];
  if (heavyFinishes.includes(finish)) {
    warnings.push(`Finish "${finish}" may impact performance on lower-end devices`);
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates background type
 */
export function validateBackground(background: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_BACKGROUNDS.includes(background)) {
    errors.push(`Invalid background: ${background}. Must be one of: ${VALID_BACKGROUNDS.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  if (background === 'animated') {
    warnings.push('Animated backgrounds may impact performance and battery life');
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates theme mode
 */
export function validateThemeMode(mode: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_THEME_MODES.includes(mode)) {
    errors.push(`Invalid theme mode: ${mode}. Must be one of: ${VALID_THEME_MODES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates font family
 */
export function validateFontFamily(family: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_FONT_FAMILIES.includes(family)) {
    errors.push(`Invalid font family: ${family}. Must be one of: ${VALID_FONT_FAMILIES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates font size
 */
export function validateFontSize(size: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_FONT_SIZES.includes(size)) {
    errors.push(`Invalid font size: ${size}. Must be one of: ${VALID_FONT_SIZES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates font weight
 */
export function validateFontWeight(weight: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_FONT_WEIGHTS.includes(weight)) {
    errors.push(`Invalid font weight: ${weight}. Must be one of: ${VALID_FONT_WEIGHTS.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates text scaling
 */
export function validateTextScaling(scaling: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const numScaling = typeof scaling === 'string' ? parseFloat(scaling) : Number(scaling);

  if (isNaN(numScaling) || !isFinite(numScaling)) {
    errors.push('Text scaling must be a valid number');
    return { isValid: false, errors, warnings };
  }

  if (numScaling < 0.5 || numScaling > 3.0) {
    errors.push('Text scaling must be between 0.5 and 3.0');
    return { isValid: false, errors, warnings };
  }

  if (numScaling < 0.8) {
    warnings.push('Text scaling below 0.8 may be difficult to read');
  }

  if (numScaling > 2.0) {
    warnings.push('Text scaling above 2.0 may cause layout issues');
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates layout density
 */
export function validateDensity(density: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_DENSITIES.includes(density)) {
    errors.push(`Invalid density: ${density}. Must be one of: ${VALID_DENSITIES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates icon style
 */
export function validateIconStyle(style: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_ICON_STYLES.includes(style)) {
    errors.push(`Invalid icon style: ${style}. Must be one of: ${VALID_ICON_STYLES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates button style
 */
export function validateButtonStyle(style: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!VALID_BUTTON_STYLES.includes(style)) {
    errors.push(`Invalid button style: ${style}. Must be one of: ${VALID_BUTTON_STYLES.join(', ')}`);
    return { isValid: false, errors, warnings };
  }

  return { isValid: true, errors, warnings };
}

/**
 * Validates complete theme preferences
 */
export function validateThemePreferences(theme: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate all theme properties
  const colorSchemeResult = validateColorScheme(theme.colorScheme);
  const finishResult = validateFinish(theme.finish);
  const backgroundResult = validateBackground(theme.background);
  const modeResult = validateThemeMode(theme.mode);
  const accentColorResult = validateColor(theme.accentColor);
  const textColorResult = validateColor(theme.textColor);

  errors.push(...colorSchemeResult.errors, ...finishResult.errors, ...backgroundResult.errors, ...modeResult.errors, ...accentColorResult.errors, ...textColorResult.errors);
  warnings.push(...colorSchemeResult.warnings, ...finishResult.warnings, ...backgroundResult.warnings, ...modeResult.warnings, ...accentColorResult.warnings, ...textColorResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates complete font preferences
 */
export function validateFontPreferences(fonts: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const familyResult = validateFontFamily(fonts.family);
  const sizeResult = validateFontSize(fonts.size);
  const weightResult = validateFontWeight(fonts.weight);

  errors.push(...familyResult.errors, ...sizeResult.errors, ...weightResult.errors);
  warnings.push(...familyResult.warnings, ...sizeResult.warnings, ...weightResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates complete layout preferences
 */
export function validateLayoutPreferences(layout: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const densityResult = validateDensity(layout.density);
  const iconStyleResult = validateIconStyle(layout.iconStyle);
  const buttonStyleResult = validateButtonStyle(layout.buttonStyle);

  errors.push(...densityResult.errors, ...iconStyleResult.errors, ...buttonStyleResult.errors);
  warnings.push(...densityResult.warnings, ...iconStyleResult.warnings, ...buttonStyleResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates complete accessibility preferences
 */
export function validateAccessibilityPreferences(accessibility: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const textScalingResult = validateTextScaling(accessibility.textScaling);
  errors.push(...textScalingResult.errors);
  warnings.push(...textScalingResult.warnings);

  if (typeof accessibility.highContrast !== 'boolean') {
    errors.push('highContrast must be a boolean');
  }

  if (typeof accessibility.reducedMotion !== 'boolean') {
    errors.push('reducedMotion must be a boolean');
  }

  if (typeof accessibility.screenReaderOptimized !== 'boolean') {
    errors.push('screenReaderOptimized must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates all user preferences
 */
export function validateUserPreferences(prefs: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!prefs) {
    errors.push('Preferences object is required');
    return { isValid: false, errors, warnings };
  }

  const themeResult = validateThemePreferences(prefs.theme);
  const fontsResult = validateFontPreferences(prefs.fonts);
  const layoutResult = validateLayoutPreferences(prefs.layout);
  const accessibilityResult = validateAccessibilityPreferences(prefs.accessibility);

  errors.push(...themeResult.errors, ...fontsResult.errors, ...layoutResult.errors, ...accessibilityResult.errors);
  warnings.push(...themeResult.warnings, ...fontsResult.warnings, ...layoutResult.warnings, ...accessibilityResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Safe operation wrapper for preference updates
 */
export function safePreferenceOperation<T>(
  operation: () => T,
  fallbackValue: T,
  errorCallback?: (error: Error) => void
): T {
  try {
    return operation();
  } catch (error) {
    console.error('[Preferences] Operation failed:', error);
    if (errorCallback && error instanceof Error) {
      errorCallback(error);
    }
    return fallbackValue;
  }
}

/**
 * Get user-friendly description of a color scheme
 */
export function getColorSchemeDescription(scheme: ColorSchemeType): string {
  const descriptions: Record<ColorSchemeType, string> = {
    monochrome: 'Classic black and white',
    warm: 'Orange and red tones',
    cool: 'Blue and purple hues',
    earth: 'Natural brown tones',
    jewel: 'Rich emerald and ruby',
    neutral: 'Balanced grays',
    pastel: 'Soft, light colors',
    neon: 'Vibrant electric colors',
    cyberpunk: 'Futuristic neon mix',
    vaporwave: 'Retro 80s aesthetic',
    'retro-80s': 'Pink and cyan vibes',
    nature: 'Green forest tones',
    'ocean-breeze': 'Calm blue waters',
    'golden-hour': 'Warm sunset glow',
    'black-gold': 'Elegant and luxurious',
    'navy-silver': 'Professional and sleek',
    'material-design': 'Google Material Design',
    'fluent-design': 'Microsoft Fluent Design',
    nord: 'Nordic color palette',
    solarized: 'Precision colors for programmers'
  };

  return descriptions[scheme] || scheme;
}

/**
 * Get performance rating for finish/background combo
 */
export function getPerformanceRating(finish: FinishType, background: BackgroundType): 'high' | 'medium' | 'low' {
  const heavyFinishes = ['holographic', 'iridescent', 'metallic'];
  const heavyBackgrounds = ['animated', 'abstract'];

  if (heavyFinishes.includes(finish) && heavyBackgrounds.includes(background)) {
    return 'low';
  }

  if (heavyFinishes.includes(finish) || heavyBackgrounds.includes(background)) {
    return 'medium';
  }

  return 'high';
}
