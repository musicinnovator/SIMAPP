import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface CustomText {
  id: string;
  user_id: string;
  title: string;
  text_content: string;
  label?: string;
  key_signature: string;
  tempo: number;
  time_signature: string;
  is_public: boolean;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomTextStats {
  id: string;
  user_id: string;
  custom_text_id: string;
  play_count: number;
  last_played_at?: string;
  total_practice_time: number;
  created_at: string;
}

export function useCustomTexts() {
  const [customTexts, setCustomTexts] = useState<CustomText[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomTexts();
  }, []);

  const fetchCustomTexts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setCustomTexts([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_custom_texts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCustomTexts(data || []);
    } catch (err: any) {
      console.error('Error fetching custom texts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCustomText = async (text: Omit<CustomText, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated to create custom texts');
      }

      const { data, error: insertError } = await supabase
        .from('user_custom_texts')
        .insert([{
          ...text,
          user_id: user.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setCustomTexts(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating custom text:', err);
      return { data: null, error: err.message };
    }
  };

  const updateCustomText = async (id: string, updates: Partial<CustomText>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error: updateError } = await supabase
        .from('user_custom_texts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCustomTexts(prev =>
        prev.map(text => text.id === id ? data : text)
      );
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating custom text:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteCustomText = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { error: deleteError } = await supabase
        .from('user_custom_texts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setCustomTexts(prev => prev.filter(text => text.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting custom text:', err);
      return { error: err.message };
    }
  };

  const updateStats = async (customTextId: string, practiceTime: number = 0) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data: existingStats } = await supabase
        .from('user_custom_texts_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('custom_text_id', customTextId)
        .maybeSingle();

      if (existingStats) {
        await supabase
          .from('user_custom_texts_stats')
          .update({
            play_count: existingStats.play_count + 1,
            last_played_at: new Date().toISOString(),
            total_practice_time: existingStats.total_practice_time + practiceTime,
          })
          .eq('id', existingStats.id);
      } else {
        await supabase
          .from('user_custom_texts_stats')
          .insert([{
            user_id: user.id,
            custom_text_id: customTextId,
            play_count: 1,
            last_played_at: new Date().toISOString(),
            total_practice_time: practiceTime,
          }]);
      }
    } catch (err) {
      console.error('Error updating stats:', err);
    }
  };

  return {
    customTexts,
    loading,
    error,
    createCustomText,
    updateCustomText,
    deleteCustomText,
    updateStats,
    refreshCustomTexts: fetchCustomTexts,
  };
}
