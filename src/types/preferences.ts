export interface ThemePreferences {
  background: BackgroundType;
  finish: FinishType;
  colorScheme: ColorSchemeType;
  accentColor: string;
  textColor: string;
  mode: 'light' | 'dark' | 'auto';
  scheduledMode?: {
    enabled: boolean;
    lightStart: string;
    darkStart: string;
  };
}

export interface FontPreferences {
  family: FontFamily;
  size: FontSize;
  weight: FontWeight;
}

export interface LayoutPreferences {
  density: 'compact' | 'comfortable' | 'spacious';
  iconStyle: 'modern' | 'classic' | 'minimal';
  buttonStyle: 'rounded' | 'sharp' | 'pill';
}

export interface AccessibilityPreferences {
  textScaling: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  frequency: 'all' | 'normal' | 'minimal';
  style: 'banner' | 'toast' | 'subtle';
}

export interface UserPreferences {
  theme: ThemePreferences;
  fonts: FontPreferences;
  layout: LayoutPreferences;
  accessibility: AccessibilityPreferences;
  notifications: NotificationPreferences;
  keyboardShortcuts: Record<string, string>;
}

export type BackgroundType =
  | 'solid'
  | 'gradient'
  | 'abstract'
  | 'city-lights'
  | 'space'
  | 'ocean'
  | 'mountains'
  | 'forest'
  | 'animated';

export type FinishType =
  | 'glossy'
  | 'satin'
  | 'metallic'
  | 'brushed-metal'
  | 'iridescent'
  | 'holographic'
  | 'textured'
  | 'soft-touch'
  | 'velvet'
  | 'pearlescent'
  | 'frosted'
  | 'polished'
  | 'grainy'
  | 'translucent'
  | 'diffused';

export type ColorSchemeType =
  | 'monochrome'
  | 'warm'
  | 'cool'
  | 'earth'
  | 'jewel'
  | 'neutral'
  | 'pastel'
  | 'neon'
  | 'cyberpunk'
  | 'vaporwave'
  | 'retro-80s'
  | 'nature'
  | 'ocean-breeze'
  | 'golden-hour'
  | 'black-gold'
  | 'navy-silver'
  | 'material-design'
  | 'fluent-design'
  | 'nord'
  | 'solarized';

export type FontFamily =
  | 'system-ui'
  | 'inter'
  | 'roboto'
  | 'open-sans'
  | 'lato'
  | 'poppins'
  | 'montserrat'
  | 'source-sans-pro'
  | 'raleway'
  | 'nunito';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

export const COLOR_PALETTES: Record<ColorSchemeType, { primary: string; secondary: string; accent: string; background: string; text: string }> = {
  monochrome: { primary: '#ffffff', secondary: '#9ca3af', accent: '#6b7280', background: '#111827', text: '#f9fafb' },
  warm: { primary: '#f59e0b', secondary: '#dc2626', accent: '#fbbf24', background: '#1f2937', text: '#fef3c7' },
  cool: { primary: '#3b82f6', secondary: '#06b6d4', accent: '#8b5cf6', background: '#0f172a', text: '#dbeafe' },
  earth: { primary: '#78350f', secondary: '#92400e', accent: '#854d0e', background: '#1c1917', text: '#fef3c7' },
  jewel: { primary: '#059669', secondary: '#7c3aed', accent: '#dc2626', background: '#111827', text: '#ecfccb' },
  neutral: { primary: '#6b7280', secondary: '#9ca3af', accent: '#d1d5db', background: '#1f2937', text: '#f3f4f6' },
  pastel: { primary: '#fca5a5', secondary: '#bfdbfe', accent: '#d8b4fe', background: '#fef3c7', text: '#374151' },
  neon: { primary: '#ff00ff', secondary: '#00ffff', accent: '#ff00aa', background: '#000000', text: '#ffffff' },
  cyberpunk: { primary: '#ff00ff', secondary: '#00ffff', accent: '#ffff00', background: '#0a0a0a', text: '#00ff00' },
  vaporwave: { primary: '#ff71ce', secondary: '#01cdfe', accent: '#05ffa1', background: '#2e2157', text: '#fffb96' },
  'retro-80s': { primary: '#ff6b9d', secondary: '#00d9ff', accent: '#ffa500', background: '#1a1a2e', text: '#ffffff' },
  nature: { primary: '#84cc16', secondary: '#22c55e', accent: '#a3e635', background: '#14532d', text: '#f0fdf4' },
  'ocean-breeze': { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#67e8f9', background: '#0c4a6e', text: '#e0f2fe' },
  'golden-hour': { primary: '#fbbf24', secondary: '#fb923c', accent: '#f59e0b', background: '#78350f', text: '#fef3c7' },
  'black-gold': { primary: '#fbbf24', secondary: '#f59e0b', accent: '#eab308', background: '#000000', text: '#fef3c7' },
  'navy-silver': { primary: '#cbd5e1', secondary: '#94a3b8', accent: '#64748b', background: '#1e293b', text: '#f1f5f9' },
  'material-design': { primary: '#1976d2', secondary: '#388e3c', accent: '#f57c00', background: '#121212', text: '#ffffff' },
  'fluent-design': { primary: '#0078d4', secondary: '#8764b8', accent: '#00bcf2', background: '#1b1b1b', text: '#ffffff' },
  nord: { primary: '#88c0d0', secondary: '#81a1c1', accent: '#5e81ac', background: '#2e3440', text: '#eceff4' },
  solarized: { primary: '#268bd2', secondary: '#2aa198', accent: '#859900', background: '#002b36', text: '#fdf6e3' }
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: {
    background: 'gradient',
    finish: 'satin',
    colorScheme: 'cyberpunk',
    accentColor: '#00ffff',
    textColor: '#ffffff',
    mode: 'dark',
    scheduledMode: {
      enabled: false,
      lightStart: '06:00',
      darkStart: '18:00'
    }
  },
  fonts: {
    family: 'system-ui',
    size: 'medium',
    weight: 'normal'
  },
  layout: {
    density: 'comfortable',
    iconStyle: 'modern',
    buttonStyle: 'rounded'
  },
  accessibility: {
    textScaling: 1.0,
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false
  },
  notifications: {
    enabled: true,
    sound: true,
    frequency: 'normal',
    style: 'toast'
  },
  keyboardShortcuts: {}
};
