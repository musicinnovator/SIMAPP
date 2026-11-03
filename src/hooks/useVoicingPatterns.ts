import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  BlockPattern,
  ArpeggiatedPattern,
  BrokenPattern,
  UserVoicingPattern
} from '../types/voicingPatterns';
import {
  BLOCK_PATTERNS,
  ARPEGGIATED_PATTERNS,
  BROKEN_PATTERNS,
  getPatternById
} from '../data/voicingPatternLibrary';

export function useVoicingPatterns() {
  const [blockPatterns, setBlockPatterns] = useState<BlockPattern[]>(BLOCK_PATTERNS);
  const [arpeggiatedPatterns, setArpeggiatedPatterns] = useState<ArpeggiatedPattern[]>(ARPEGGIATED_PATTERNS);
  const [brokenPatterns, setBrokenPatterns] = useState<BrokenPattern[]>(BROKEN_PATTERNS);
  const [userPatterns, setUserPatterns] = useState<UserVoicingPattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserPatterns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_voicing_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setUserPatterns(data as UserVoicingPattern[]);

        const userBlockPatterns = data
          .filter(p => p.pattern_type === 'block')
          .map(p => ({ ...p.pattern_data as BlockPattern, isCustom: true }));

        const userArpPatterns = data
          .filter(p => p.pattern_type === 'arpeggiated')
          .map(p => ({ ...p.pattern_data as ArpeggiatedPattern, isCustom: true }));

        const userBrokenPatterns = data
          .filter(p => p.pattern_type === 'broken')
          .map(p => ({ ...p.pattern_data as BrokenPattern, isCustom: true }));

        setBlockPatterns([...BLOCK_PATTERNS, ...userBlockPatterns]);
        setArpeggiatedPatterns([...ARPEGGIATED_PATTERNS, ...userArpPatterns]);
        setBrokenPatterns([...BROKEN_PATTERNS, ...userBrokenPatterns]);
      }
    } catch (err) {
      console.error('Error loading user patterns:', err);
      setError(err instanceof Error ? err.message : 'Failed to load patterns');
    } finally {
      setLoading(false);
    }
  }, []);

  const savePattern = useCallback(async (
    patternType: 'block' | 'arpeggiated' | 'broken',
    patternName: string,
    patternData: BlockPattern | ArpeggiatedPattern | BrokenPattern
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please sign in to save patterns' };
      }

      const { error: insertError } = await supabase
        .from('user_voicing_patterns')
        .insert({
          user_id: user.id,
          pattern_type: patternType,
          pattern_name: patternName,
          pattern_data: patternData
        });

      if (insertError) {
        throw insertError;
      }

      await loadUserPatterns();
      return { success: true };
    } catch (err) {
      console.error('Error saving pattern:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save pattern'
      };
    }
  }, [loadUserPatterns]);

  const updatePattern = useCallback(async (
    patternId: string,
    patternName: string,
    patternData: BlockPattern | ArpeggiatedPattern | BrokenPattern
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please sign in to update patterns' };
      }

      const { error: updateError } = await supabase
        .from('user_voicing_patterns')
        .update({
          pattern_name: patternName,
          pattern_data: patternData
        })
        .eq('id', patternId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      await loadUserPatterns();
      return { success: true };
    } catch (err) {
      console.error('Error updating pattern:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update pattern'
      };
    }
  }, [loadUserPatterns]);

  const deletePattern = useCallback(async (patternId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please sign in to delete patterns' };
      }

      const { error: deleteError } = await supabase
        .from('user_voicing_patterns')
        .delete()
        .eq('id', patternId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      await loadUserPatterns();
      return { success: true };
    } catch (err) {
      console.error('Error deleting pattern:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete pattern'
      };
    }
  }, [loadUserPatterns]);

  const toggleFavorite = useCallback(async (
    patternId: string,
    isFavorite: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please sign in' };
      }

      const { error: updateError } = await supabase
        .from('user_voicing_patterns')
        .update({ is_favorite: isFavorite })
        .eq('id', patternId)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      await loadUserPatterns();
      return { success: true };
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to toggle favorite'
      };
    }
  }, [loadUserPatterns]);

  useEffect(() => {
    loadUserPatterns();
  }, [loadUserPatterns]);

  return {
    blockPatterns,
    arpeggiatedPatterns,
    brokenPatterns,
    userPatterns,
    loading,
    error,
    savePattern,
    updatePattern,
    deletePattern,
    toggleFavorite,
    refreshPatterns: loadUserPatterns
  };
}
