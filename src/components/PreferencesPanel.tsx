import { useState } from 'react';
import { X, Search, RotateCcw, Eye, Save, Palette, Type, LayoutGrid as Layout, Accessibility, Bell, Keyboard, ChevronDown, ChevronRight } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';
import { COLOR_PALETTES, ColorSchemeType, FinishType, BackgroundType, FontFamily, FontSize, FontWeight } from '../types/preferences';

interface PreferencesPanelProps {
  onClose: () => void;
}

export function PreferencesPanel({ onClose }: PreferencesPanelProps) {
  const { preferences, updateTheme, updateFonts, updateLayout, updateAccessibility, updateNotifications, resetToDefaults } = usePreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string>('visual');
  const [showPreview, setShowPreview] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const finishOptions: FinishType[] = ['glossy', 'satin', 'metallic', 'brushed-metal', 'iridescent', 'holographic', 'textured', 'soft-touch', 'velvet', 'pearlescent', 'frosted', 'polished', 'grainy', 'translucent', 'diffused'];

  const backgroundOptions: BackgroundType[] = ['solid', 'gradient', 'abstract', 'city-lights', 'space', 'ocean', 'mountains', 'forest', 'animated'];

  const colorSchemes: ColorSchemeType[] = Object.keys(COLOR_PALETTES) as ColorSchemeType[];

  const fontFamilies: FontFamily[] = ['system-ui', 'inter', 'roboto', 'open-sans', 'lato', 'poppins', 'montserrat', 'source-sans-pro', 'raleway', 'nunito'];

  const fontSizes: FontSize[] = ['small', 'medium', 'large', 'extra-large'];

  const fontWeights: FontWeight[] = ['light', 'normal', 'medium', 'semibold', 'bold'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-white/20 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Palette className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Preferences</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Toggle Preview"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={resetToDefaults}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Reset to Defaults"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search preferences..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Visual Settings */}
          <Section
            title="Visual Settings"
            icon={<Palette className="w-5 h-5" />}
            expanded={expandedSection === 'visual'}
            onToggle={() => toggleSection('visual')}
          >
            <div className="space-y-6">
              {/* Color Scheme */}
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Color Scheme & Palette</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {colorSchemes.map((scheme) => {
                    const palette = COLOR_PALETTES[scheme];
                    return (
                      <button
                        key={scheme}
                        onClick={() => updateTheme({ colorScheme: scheme })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferences.theme.colorScheme === scheme
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex space-x-1 mb-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: palette.primary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: palette.secondary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: palette.accent }} />
                        </div>
                        <p className="text-xs text-white capitalize">{scheme.replace('-', ' ')}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finish Style */}
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Surface Finish</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {finishOptions.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => updateTheme({ finish })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.theme.finish === finish
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {finish.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Type */}
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Background Style</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => updateTheme({ background: bg })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.theme.background === bg
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {bg.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Theme Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {['dark', 'light', 'auto'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateTheme({ mode: mode as 'dark' | 'light' | 'auto' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.theme.mode === mode
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-purple-300 text-sm font-medium block mb-2">Accent Color</label>
                  <input
                    type="color"
                    value={preferences.theme.accentColor}
                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-purple-300 text-sm font-medium block mb-2">Text Color</label>
                  <input
                    type="color"
                    value={preferences.theme.textColor}
                    onChange={(e) => updateTheme({ textColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Font Customization */}
          <Section
            title="Typography"
            icon={<Type className="w-5 h-5" />}
            expanded={expandedSection === 'fonts'}
            onToggle={() => toggleSection('fonts')}
          >
            <div className="space-y-6">
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Font Family</label>
                <select
                  value={preferences.fonts.family}
                  onChange={(e) => updateFonts({ family: e.target.value as FontFamily })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font} className="bg-gray-800">
                      {font.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Font Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateFonts({ size })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.fonts.size === size
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Font Weight</label>
                <div className="grid grid-cols-5 gap-2">
                  {fontWeights.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => updateFonts({ weight })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.fonts.weight === weight
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Layout Options */}
          <Section
            title="Layout & Interface"
            icon={<Layout className="w-5 h-5" />}
            expanded={expandedSection === 'layout'}
            onToggle={() => toggleSection('layout')}
          >
            <div className="space-y-6">
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Density</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => updateLayout({ density })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.layout.density === density
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Icon Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['modern', 'classic', 'minimal'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateLayout({ iconStyle: style })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.layout.iconStyle === style
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Button Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rounded', 'sharp', 'pill'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateLayout({ buttonStyle: style })}
                      className={`px-4 py-2 text-sm font-medium transition-all ${
                        style === 'rounded' ? 'rounded-lg' : style === 'sharp' ? 'rounded-none' : 'rounded-full'
                      } ${
                        preferences.layout.buttonStyle === style
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Accessibility */}
          <Section
            title="Accessibility"
            icon={<Accessibility className="w-5 h-5" />}
            expanded={expandedSection === 'accessibility'}
            onToggle={() => toggleSection('accessibility')}
          >
            <div className="space-y-6">
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">
                  Text Scaling: {preferences.accessibility.textScaling}x
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={preferences.accessibility.textScaling}
                  onChange={(e) => updateAccessibility({ textScaling: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <span className="text-white">High Contrast Mode</span>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.highContrast}
                    onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <span className="text-white">Reduced Motion</span>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.reducedMotion}
                    onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <span className="text-white">Screen Reader Optimized</span>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.screenReaderOptimized}
                    onChange={(e) => updateAccessibility({ screenReaderOptimized: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section
            title="Notifications"
            icon={<Bell className="w-5 h-5" />}
            expanded={expandedSection === 'notifications'}
            onToggle={() => toggleSection('notifications')}
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <span className="text-white">Enable Notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.enabled}
                    onChange={(e) => updateNotifications({ enabled: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <span className="text-white">Notification Sounds</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sound}
                    onChange={(e) => updateNotifications({ sound: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'normal', 'minimal'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => updateNotifications({ frequency: freq })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.notifications.frequency === freq
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-purple-300 text-sm font-medium block mb-3">Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['banner', 'toast', 'subtle'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateNotifications({ style })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        preferences.notifications.style === style
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            Done
          </button>
        </div>
      </div>

      {/* Preview Pane */}
      {showPreview && (
        <div className="fixed top-4 right-4 bg-gray-900 border border-white/20 rounded-lg p-4 w-80 shadow-2xl">
          <h3 className="text-white font-bold mb-3">Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-gray-400">Accent Color</p>
              <div className="w-full h-8 rounded mt-1" style={{ backgroundColor: preferences.theme.accentColor }} />
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-gray-400">Text Sample</p>
              <p className="mt-1" style={{ color: preferences.theme.textColor, fontFamily: preferences.fonts.family }}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, icon, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center space-x-3">
          <div className="text-purple-400">{icon}</div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>
      {expanded && <div className="p-4 border-t border-white/10">{children}</div>}
    </div>
  );
}

export default PreferencesPanel;
