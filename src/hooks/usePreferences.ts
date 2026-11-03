import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPreferences, DEFAULT_PREFERENCES } from '../types/preferences';
import { localStorageProvider } from '../services/storage';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        const stored = await localStorageProvider?.get<UserPreferences>('preferences', 'current');
        if (stored) setPreferences(stored);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Load from localStorage for non-authenticated users
        const stored = await localStorageProvider?.get<UserPreferences>('preferences', 'current');
        if (stored) setPreferences(stored);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          theme: data.theme,
          fonts: data.fonts,
          layout: data.layout,
          accessibility: data.accessibility,
          notifications: data.notifications,
          keyboardShortcuts: data.keyboard_shortcuts || {}
        });
      } else {
        // Create default preferences for new user
        await savePreferences(DEFAULT_PREFERENCES);
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      if (!supabase) {
        await localStorageProvider?.set('preferences', 'current', newPreferences);
        setPreferences(newPreferences);
        applyTheme(newPreferences);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Save to localStorage for non-authenticated users
        await localStorageProvider?.set('preferences', 'current', newPreferences);
        setPreferences(newPreferences);
        applyTheme(newPreferences);
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: newPreferences.theme,
          fonts: newPreferences.fonts,
          layout: newPreferences.layout,
          accessibility: newPreferences.accessibility,
          notifications: newPreferences.notifications,
          keyboard_shortcuts: newPreferences.keyboardShortcuts
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setPreferences(newPreferences);
      applyTheme(newPreferences);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    }
  };

  const updateTheme = (theme: Partial<UserPreferences['theme']>) => {
    const updated = { ...preferences, theme: { ...preferences.theme, ...theme } };
    savePreferences(updated);
  };

  const updateFonts = (fonts: Partial<UserPreferences['fonts']>) => {
    const updated = { ...preferences, fonts: { ...preferences.fonts, ...fonts } };
    savePreferences(updated);
  };

  const updateLayout = (layout: Partial<UserPreferences['layout']>) => {
    const updated = { ...preferences, layout: { ...preferences.layout, ...layout } };
    savePreferences(updated);
  };

  const updateAccessibility = (accessibility: Partial<UserPreferences['accessibility']>) => {
    const updated = { ...preferences, accessibility: { ...preferences.accessibility, ...accessibility } };
    savePreferences(updated);
  };

  const updateNotifications = (notifications: Partial<UserPreferences['notifications']>) => {
    const updated = { ...preferences, notifications: { ...preferences.notifications, ...notifications } };
    savePreferences(updated);
  };

  const resetToDefaults = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  const applyTheme = (prefs: UserPreferences) => {
    try {
      const root = document.documentElement;
      const body = document.body;

      // Apply CSS variables
      root.style.setProperty('--accent-color', prefs.theme.accentColor);
      root.style.setProperty('--text-color', prefs.theme.textColor);
      root.style.setProperty('--font-family', prefs.fonts.family);
      root.style.setProperty('--text-scale', prefs.accessibility.textScaling.toString());

      // Apply font settings
      body.style.fontFamily = prefs.fonts.family;

      const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '20px'
      };
      body.style.fontSize = `calc(${fontSizeMap[prefs.fonts.size]} * ${prefs.accessibility.textScaling})`;

      const fontWeightMap = {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      };
      body.style.fontWeight = fontWeightMap[prefs.fonts.weight];

      // Apply theme mode (enhanced with auto mode support)
      if (prefs.theme.mode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        console.log('[Preferences] Dark mode applied');
      } else if (prefs.theme.mode === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        console.log('[Preferences] Light mode applied');
      } else if (prefs.theme.mode === 'auto') {
        // Remove both classes to let CSS media queries handle it
        root.classList.remove('dark', 'light');
        // Detect system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('[Preferences] Auto mode applied - System prefers:', systemPrefersDark ? 'dark' : 'light');
      }

      // Apply motion preference
      if (prefs.accessibility.reducedMotion) {
        root.classList.add('reduce-motion');
        console.log('[Preferences] Reduced motion enabled');
      } else {
        root.classList.remove('reduce-motion');
      }

      // Apply high contrast
      if (prefs.accessibility.highContrast) {
        root.classList.add('high-contrast');
        console.log('[Preferences] High contrast mode enabled');
      } else {
        root.classList.remove('high-contrast');
      }

      // Apply finish effect
      root.setAttribute('data-finish', prefs.theme.finish);

      // Apply background style
      root.setAttribute('data-background', prefs.theme.background);

      // Apply color scheme
      root.setAttribute('data-color-scheme', prefs.theme.colorScheme);

      // Apply layout density
      root.setAttribute('data-density', prefs.layout.density);

      // Apply button style
      root.setAttribute('data-button-style', prefs.layout.buttonStyle);

      console.log('[Preferences] ✅ Theme applied successfully:', {
        colorScheme: prefs.theme.colorScheme,
        finish: prefs.theme.finish,
        background: prefs.theme.background,
        mode: prefs.theme.mode,
        font: prefs.fonts.family,
        size: prefs.fonts.size,
        weight: prefs.fonts.weight,
        density: prefs.layout.density,
        buttonStyle: prefs.layout.buttonStyle
      });
    } catch (err) {
      console.error('[Preferences] Error applying theme:', err);
      setError(err instanceof Error ? err.message : 'Failed to apply theme');
    }
  };

  // Apply theme on mount and when preferences change
  useEffect(() => {
    if (!loading) {
      applyTheme(preferences);
    }
  }, [preferences, loading]);

  // Listen for system theme preference changes (for auto mode)
  useEffect(() => {
    if (preferences.theme.mode !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      console.log('[Preferences] System theme changed to:', e.matches ? 'dark' : 'light');
      // Re-apply theme to pick up the change
      applyTheme(preferences);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [preferences.theme.mode]);

  return {
    preferences,
    loading,
    error,
    updateTheme,
    updateFonts,
    updateLayout,
    updateAccessibility,
    updateNotifications,
    savePreferences,
    resetToDefaults
  };
}
