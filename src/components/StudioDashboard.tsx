import React, { useState, useEffect } from 'react';
import { Music, Mic, Download, Book, Play, ChevronRight, Settings, Clock, TrendingUp, CreditCard as Edit } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import '../styles/studioTheme.css';

interface RecentProject {
  id: string;
  title: string;
  scripture_reference: string;
  duration: string;
  created_at: string;
  audio_url?: string;
}

interface StudioDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function StudioDashboard({ onNavigate }: StudioDashboardProps) {
  const { user } = useAuth();
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentProjects();
  }, [user]);

  const loadRecentProjects = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('dual_track_recordings')
        .select('id, title, scripture_reference, duration, created_at, combined_audio_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      setRecentProjects(data?.map(p => ({
        id: p.id,
        title: p.title || p.scripture_reference,
        scripture_reference: p.scripture_reference,
        duration: p.duration || '0:00',
        created_at: p.created_at,
        audio_url: p.combined_audio_url
      })) || []);
    } catch (error) {
      console.error('Error loading recent projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickStartTemplates = [
    {
      id: 'simple',
      title: 'Voice + Piano',
      description: 'Perfect for beginners',
      icon: Music,
      config: {
        instrument: 'acoustic_grand_piano',
        tempo: 72,
        key: 'D',
        pattern: 'simple'
      }
    },
    {
      id: 'guitar',
      title: 'Acoustic Guitar',
      description: 'Warm, intimate setting',
      icon: Music,
      config: {
        instrument: 'acoustic_guitar_nylon',
        tempo: 80,
        key: 'G',
        pattern: 'strum'
      }
    },
    {
      id: 'strings',
      title: 'String Ensemble',
      description: 'Rich, full sound',
      icon: Music,
      config: {
        instrument: 'string_ensemble_1',
        tempo: 68,
        key: 'C',
        pattern: 'block'
      }
    }
  ];

  const handleQuickStart = (template: typeof quickStartTemplates[0]) => {
    onNavigate('unified-studio', { template: template.config });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="studio-theme min-h-screen">
      <div className="studio-container">
        <header className="mb-8 studio-fade-in">
          <h1 className="studio-heading-1 mb-2">Scripture Recording Studio</h1>
          <p className="studio-text-secondary text-base">
            Create professional recordings of scripture with music
          </p>
        </header>

        <div className="space-y-8">
          <section className="studio-card studio-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="studio-card-subheader mb-4">How to Create a Song</h2>

            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
              <div className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-studio-accent-gold flex items-center justify-center text-studio-black font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="studio-heading-3 mb-2">Choose Scripture</h3>
                    <p className="studio-text-secondary text-sm mb-3">
                      Select from our library or add your own text
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => onNavigate('scripture')}
                    className="studio-button-secondary w-full"
                  >
                    <Book className="inline w-4 h-4 mr-2" />
                    Browse Library
                  </button>
                  <button
                    onClick={() => onNavigate('custom-text-creator')}
                    className="studio-button-secondary w-full"
                  >
                    <Edit className="inline w-4 h-4 mr-2" />
                    Create Custom Text
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-studio-accent-gold flex items-center justify-center text-studio-black font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="studio-heading-3 mb-2">Configure Music</h3>
                    <p className="studio-text-secondary text-sm mb-3">
                      Set key, tempo, and instrument style
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('music-machine')}
                  className="studio-button-secondary w-full"
                >
                  <Settings className="inline w-4 h-4 mr-2" />
                  Music Settings
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-studio-accent-gold flex items-center justify-center text-studio-black font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="studio-heading-3 mb-2">Record & Export</h3>
                    <p className="studio-text-secondary text-sm mb-3">
                      Record your voice with music and download
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('unified-studio')}
                  className="studio-button-primary w-full"
                >
                  <Mic className="inline w-4 h-4 mr-2" />
                  Open Studio
                </button>
              </div>
            </div>
          </section>

          <section className="studio-card studio-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="studio-card-subheader mb-4">Quick Start Templates</h2>
            <p className="studio-text-secondary text-sm mb-4">
              Choose a pre-configured setup to start recording immediately
            </p>

            <div className="studio-grid-3">
              {quickStartTemplates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => handleQuickStart(template)}
                  className="studio-card p-4 text-left hover:border-studio-accent-gold transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <template.icon className="w-8 h-8 text-studio-accent-gold" />
                    <ChevronRight className="w-5 h-5 text-studio-text-dim group-hover:text-studio-accent-gold transition-colors" />
                  </div>
                  <h3 className="studio-heading-3 text-base mb-1">{template.title}</h3>
                  <p className="studio-text-secondary text-sm">{template.description}</p>
                </button>
              ))}
            </div>
          </section>

          {user && !loading && recentProjects.length > 0 && (
            <section className="studio-card studio-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="studio-card-subheader mb-0">Recent Projects</h2>
                <button
                  onClick={() => onNavigate('share')}
                  className="studio-button-ghost text-xs"
                >
                  View All
                </button>
              </div>

              <div className="studio-grid-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="studio-card p-4 hover:border-studio-accent-gold transition-all cursor-pointer group"
                    onClick={() => {
                      if (project.audio_url) {
                        const audio = new Audio(project.audio_url);
                        audio.play();
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="studio-heading-3 text-base mb-1 truncate">
                          {project.title}
                        </h3>
                        <p className="studio-text-dim text-xs truncate">
                          {project.scripture_reference}
                        </p>
                      </div>
                      {project.audio_url && (
                        <Play className="w-5 h-5 text-studio-text-dim group-hover:text-studio-accent-gold transition-colors flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="studio-text-dim flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.duration}
                      </span>
                      <span className="studio-text-dim">
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!user && (
            <section className="studio-card studio-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-studio-accent-gold mx-auto mb-4" />
                <h3 className="studio-heading-2 mb-2">Sign In to Save Projects</h3>
                <p className="studio-text-secondary mb-6 max-w-md mx-auto">
                  Create an account to save your recordings, track your progress, and access your work from any device.
                </p>
                <button
                  onClick={() => onNavigate('home')}
                  className="studio-button-primary"
                >
                  Sign In / Register
                </button>
              </div>
            </section>
          )}

          <section className="studio-card studio-fade-in bg-studio-gray-900 border-studio-border-light" style={{ animationDelay: '0.4s' }}>
            <h2 className="studio-card-subheader mb-3">New to Recording?</h2>
            <p className="studio-text-secondary text-sm mb-4">
              Check out our interactive lessons and tutorials to learn music theory, chord progressions, and recording techniques.
            </p>
            <button
              onClick={() => onNavigate('lessons')}
              className="studio-button-secondary"
            >
              Explore Lessons
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
