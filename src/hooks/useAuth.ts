import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // If Supabase is not configured, default to guest mode
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setIsGuest(false);
          // Create or update user profile
          const { error } = await supabase
            .from('user_profiles')
            .upsert({
              id: session.user.id,
              username: session.user.user_metadata?.username,
              display_name: session.user.user_metadata?.display_name,
              updated_at: new Date().toISOString()
            });
          
          if (error) console.error('Error updating profile:', error);
        }
        
        if (event === 'SIGNED_OUT') {
          setIsGuest(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string, username: string, displayName: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Authentication requires Supabase configuration. Please set up your Supabase project.');
    }
    
    setLoading(true);
    try {
      await signUp(email, password, username, displayName);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Authentication requires Supabase configuration. Please set up your Supabase project.');
    }
    
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsGuest(true);
      return;
    }
    
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setLoading(false);
  };

  return {
    user,
    loading,
    isGuest,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    continueAsGuest
  };
}