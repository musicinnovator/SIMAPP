import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RecordingEffectsSettings } from '../components/RecordingAudioEffects';

export interface RecordingHistoryEntry {
  id: string;
  user_id: string;
  name: string;
  mode: 'voice-only' | 'live-mix' | 'post-mix';
  duration: number;
  voice_storage_path: string | null;
  music_storage_path: string | null;
  chord_snapshots: any[] | null;
  voice_volume: number;
  music_volume: number;
  effects_settings: RecordingEffectsSettings | null;
  waveform_data: any | null;
  file_size: number;
  mime_type: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRecordingInput {
  name: string;
  mode: 'voice-only' | 'live-mix' | 'post-mix';
  duration: number;
  voiceBlob: Blob;
  musicBlob?: Blob | null;
  chordSnapshots?: any[] | null;
  voiceVolume?: number;
  musicVolume?: number;
  effectsSettings?: RecordingEffectsSettings | null;
  waveformData?: any | null;
  tags?: string[];
}

export function useRecordingHistory() {
  const [recordings, setRecordings] = useState<RecordingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch recordings from Supabase
  const fetchRecordings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRecordings([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('recording_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setRecordings(data || []);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recordings');
    } finally {
      setLoading(false);
    }
  };

  // Create new recording entry
  const createRecording = async (input: CreateRecordingInput): Promise<RecordingHistoryEntry | null> => {
    try {
      setUploading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload voice blob to storage
      const voiceFileName = `${user.id}/${Date.now()}-voice.${input.mode === 'voice-only' ? 'webm' : 'wav'}`;
      const { error: voiceUploadError } = await supabase.storage
        .from('recordings')
        .upload(voiceFileName, input.voiceBlob, {
          contentType: input.voiceBlob.type,
          upsert: false
        });

      if (voiceUploadError) throw voiceUploadError;

      // Upload music blob if provided
      let musicFileName: string | null = null;
      if (input.musicBlob) {
        musicFileName = `${user.id}/${Date.now()}-music.wav`;
        const { error: musicUploadError } = await supabase.storage
          .from('recordings')
          .upload(musicFileName, input.musicBlob, {
            contentType: 'audio/wav',
            upsert: false
          });

        if (musicUploadError) throw musicUploadError;
      }

      // Create database entry
      const { data, error: insertError } = await supabase
        .from('recording_history')
        .insert({
          user_id: user.id,
          name: input.name,
          mode: input.mode,
          duration: input.duration,
          voice_storage_path: voiceFileName,
          music_storage_path: musicFileName,
          chord_snapshots: input.chordSnapshots || null,
          voice_volume: input.voiceVolume || 80,
          music_volume: input.musicVolume || 50,
          effects_settings: input.effectsSettings || null,
          waveform_data: input.waveformData || null,
          file_size: input.voiceBlob.size,
          mime_type: input.voiceBlob.type,
          tags: input.tags || []
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchRecordings();
      return data;
    } catch (err) {
      console.error('Error creating recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to create recording');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Get download URL for a recording
  const getRecordingUrl = async (storagePath: string): Promise<string | null> => {
    try {
      const { data } = await supabase.storage
        .from('recordings')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (err) {
      console.error('Error getting recording URL:', err);
      return null;
    }
  };

  // Update recording metadata
  const updateRecording = async (
    id: string,
    updates: Partial<Omit<RecordingHistoryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('recording_history')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchRecordings();
      return true;
    } catch (err) {
      console.error('Error updating recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to update recording');
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (id: string, currentStatus: boolean): Promise<boolean> => {
    return updateRecording(id, { is_favorite: !currentStatus });
  };

  // Delete recording
  const deleteRecording = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const recording = recordings.find(r => r.id === id);
      if (!recording) throw new Error('Recording not found');

      // Delete from storage
      if (recording.voice_storage_path) {
        await supabase.storage
          .from('recordings')
          .remove([recording.voice_storage_path]);
      }

      if (recording.music_storage_path) {
        await supabase.storage
          .from('recordings')
          .remove([recording.music_storage_path]);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('recording_history')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchRecordings();
      return true;
    } catch (err) {
      console.error('Error deleting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete recording');
      return false;
    }
  };

  // Add tag to recording
  const addTag = async (id: string, tag: string): Promise<boolean> => {
    const recording = recordings.find(r => r.id === id);
    if (!recording) return false;

    const newTags = [...new Set([...recording.tags, tag])];
    return updateRecording(id, { tags: newTags });
  };

  // Remove tag from recording
  const removeTag = async (id: string, tag: string): Promise<boolean> => {
    const recording = recordings.find(r => r.id === id);
    if (!recording) return false;

    const newTags = recording.tags.filter(t => t !== tag);
    return updateRecording(id, { tags: newTags });
  };

  // Get recordings by mode
  const getRecordingsByMode = (mode: 'voice-only' | 'live-mix' | 'post-mix') => {
    return recordings.filter(r => r.mode === mode);
  };

  // Get favorite recordings
  const getFavoriteRecordings = () => {
    return recordings.filter(r => r.is_favorite);
  };

  // Get recordings by tag
  const getRecordingsByTag = (tag: string) => {
    return recordings.filter(r => r.tags.includes(tag));
  };

  // Get total storage used (in bytes)
  const getTotalStorageUsed = () => {
    return recordings.reduce((total, r) => total + r.file_size, 0);
  };

  // Get all unique tags
  const getAllTags = () => {
    const tagSet = new Set<string>();
    recordings.forEach(r => r.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  };

  // Load recordings on mount
  useEffect(() => {
    fetchRecordings();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchRecordings();
      } else if (event === 'SIGNED_OUT') {
        setRecordings([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    recordings,
    loading,
    error,
    uploading,
    createRecording,
    getRecordingUrl,
    updateRecording,
    toggleFavorite,
    deleteRecording,
    addTag,
    removeTag,
    getRecordingsByMode,
    getFavoriteRecordings,
    getRecordingsByTag,
    getTotalStorageUsed,
    getAllTags,
    refreshRecordings: fetchRecordings
  };
}
