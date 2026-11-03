import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DualTrackRecording {
  id: string;
  user_id: string;
  project_name: string;
  vocal_blob_url?: string;
  music_blob_url?: string;
  combined_blob_url?: string;
  vocal_volume: number;
  music_volume: number;
  duration: number;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export function useDualTrackRecordings() {
  const [recordings, setRecordings] = useState<DualTrackRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setRecordings([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('dual_track_recordings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecordings(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching recordings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRecording = async (projectData: {
    project_name: string;
    vocal_volume: number;
    music_volume: number;
    duration: number;
    metadata?: any;
  }): Promise<DualTrackRecording | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('dual_track_recordings')
        .insert({
          user_id: user.id,
          ...projectData
        })
        .select()
        .single();

      if (error) throw error;

      setRecordings(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error saving recording:', err);
      setError(err.message);
      return null;
    }
  };

  const updateRecording = async (
    id: string,
    updates: Partial<DualTrackRecording>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('dual_track_recordings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRecordings(prev =>
        prev.map(rec => (rec.id === id ? { ...rec, ...updates } : rec))
      );
      return true;
    } catch (err: any) {
      console.error('Error updating recording:', err);
      setError(err.message);
      return false;
    }
  };

  const deleteRecording = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('dual_track_recordings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecordings(prev => prev.filter(rec => rec.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting recording:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    recordings,
    loading,
    error,
    fetchRecordings,
    saveRecording,
    updateRecording,
    deleteRecording
  };
}
