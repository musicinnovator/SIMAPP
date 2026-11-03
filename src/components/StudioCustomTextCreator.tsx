import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Play, Music, Type, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCustomTexts } from '../hooks/useCustomTexts';
import { supabase } from '../lib/supabase';
import '../styles/studioTheme.css';

interface StudioCustomTextCreatorProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Scripture {
  id: string;
  category: string;
  reference: string;
  text: string;
  verses?: Array<{ verse: number; text: string }>;
}

interface ScriptureCategory {
  name: string;
  scriptures: Scripture[];
}

export default function StudioCustomTextCreator({ onNavigate }: StudioCustomTextCreatorProps) {
  const { user } = useAuth();
  const { createCustomText } = useCustomTexts();

  const [mode, setMode] = useState<'create' | 'from-scripture'>('create');
  const [customText, setCustomText] = useState('');
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('custom');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedScripture, setSelectedScripture] = useState<Scripture | null>(null);
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);

  const [key, setKey] = useState('C');
  const [tempo, setTempo] = useState(72);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [instrument, setInstrument] = useState('acoustic_grand_piano');

  const [saving, setSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  const timeSignatures = ['3/4', '4/4', '6/8', '12/8'];
  const instruments = [
    { value: 'acoustic_grand_piano', label: 'Piano' },
    { value: 'acoustic_guitar_nylon', label: 'Acoustic Guitar' },
    { value: 'acoustic_guitar_steel', label: 'Steel Guitar' },
    { value: 'string_ensemble_1', label: 'Strings' },
    { value: 'choir_aahs', label: 'Choir' },
    { value: 'pad_2_warm', label: 'Warm Pad' }
  ];

  const [scriptureCategories, setScriptureCategories] = useState<ScriptureCategory[]>([]);
  const [loadingScriptures, setLoadingScriptures] = useState(false);

  useEffect(() => {
    loadScriptureCategories();
  }, []);

  const loadScriptureCategories = async () => {
    setLoadingScriptures(true);
    try {
      const { data, error } = await supabase
        .from('scriptures')
        .select('*')
        .order('category')
        .order('reference');

      if (error) throw error;

      const grouped = (data || []).reduce((acc: Record<string, Scripture[]>, scripture: any) => {
        if (!acc[scripture.category]) {
          acc[scripture.category] = [];
        }
        acc[scripture.category].push({
          id: scripture.id,
          category: scripture.category,
          reference: scripture.reference,
          text: scripture.text,
          verses: scripture.verses || []
        });
        return acc;
      }, {});

      setScriptureCategories(
        Object.entries(grouped).map(([name, scriptures]) => ({
          name,
          scriptures
        }))
      );
    } catch (error) {
      console.error('Error loading scriptures:', error);
    } finally {
      setLoadingScriptures(false);
    }
  };

  useEffect(() => {
    if (selectedScripture) {
      if (selectedVerses.length > 0 && selectedScripture.verses) {
        const selectedText = selectedScripture.verses
          .filter(v => selectedVerses.includes(v.verse))
          .map(v => v.text)
          .join(' ');
        setCustomText(selectedText);
      } else {
        setCustomText(selectedScripture.text);
      }
      if (!title) {
        setTitle(selectedScripture.reference);
      }
    }
  }, [selectedScripture, selectedVerses]);

  const handleToggleVerse = (verseNumber: number) => {
    setSelectedVerses(prev =>
      prev.includes(verseNumber)
        ? prev.filter(v => v !== verseNumber)
        : [...prev, verseNumber].sort((a, b) => a - b)
    );
  };

  const handleSaveAndContinue = async () => {
    if (!customText.trim()) {
      alert('Please enter some text first');
      return;
    }

    if (!user) {
      proceedToMusicMachine();
      return;
    }

    setSaving(true);
    try {
      await createCustomText({
        title: title || 'Untitled Text',
        text: customText,
        label,
        musical_settings: {
          key,
          tempo,
          timeSignature,
          instrument
        }
      });

      setShowSuccessMessage(true);
      setTimeout(() => {
        proceedToMusicMachine();
      }, 1500);
    } catch (error) {
      console.error('Error saving custom text:', error);
      alert('Failed to save text. You can still use it without saving.');
      proceedToMusicMachine();
    } finally {
      setSaving(false);
    }
  };

  const proceedToMusicMachine = () => {
    onNavigate('music-machine', {
      customText: {
        title: title || 'Custom Text',
        text: customText,
        reference: title || 'Custom Text',
        key,
        tempo,
        timeSignature,
        instrument
      }
    });
  };

  const handleUseWithoutSaving = () => {
    if (!customText.trim()) {
      alert('Please enter some text first');
      return;
    }
    proceedToMusicMachine();
  };

  return (
    <div className="studio-theme min-h-screen">
      <div className="studio-container max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('studio-dashboard')}
            className="studio-button-ghost flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio
          </button>

          {showSuccessMessage && (
            <div className="flex items-center gap-2 text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-medium">Saved successfully!</span>
            </div>
          )}
        </div>

        <header className="mb-8 studio-fade-in">
          <h1 className="studio-heading-1 mb-2">Create Custom Text</h1>
          <p className="studio-text-secondary text-base">
            Type your own text or select portions from existing scriptures
          </p>
        </header>

        <div className="space-y-6">
          <div className="studio-card">
            <h2 className="studio-card-subheader mb-4">Creation Mode</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('create')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === 'create'
                    ? 'border-studio-accent-gold bg-studio-accent-gold/10'
                    : 'border-studio-border hover:border-studio-border-light'
                }`}
              >
                <Type className="w-6 h-6 text-studio-accent-gold mx-auto mb-2" />
                <div className="text-sm font-medium text-studio-text-primary">Type Your Own</div>
                <div className="text-xs text-studio-text-dim mt-1">Start from scratch</div>
              </button>

              <button
                onClick={() => setMode('from-scripture')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === 'from-scripture'
                    ? 'border-studio-accent-gold bg-studio-accent-gold/10'
                    : 'border-studio-border hover:border-studio-border-light'
                }`}
              >
                <Music className="w-6 h-6 text-studio-accent-gold mx-auto mb-2" />
                <div className="text-sm font-medium text-studio-text-primary">From Scripture</div>
                <div className="text-xs text-studio-text-dim mt-1">Select & customize</div>
              </button>
            </div>
          </div>

          {mode === 'from-scripture' && (
            <div className="studio-card space-y-4">
              <h2 className="studio-card-subheader">Select Scripture</h2>

              <div className="space-y-3">
                <div>
                  <label className="block studio-text-secondary text-sm mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedScripture(null);
                      setSelectedVerses([]);
                    }}
                    className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
                  >
                    <option value="">Choose a category...</option>
                    {scriptureCategories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div>
                    <label className="block studio-text-secondary text-sm mb-2">Scripture</label>
                    <select
                      value={selectedScripture?.id || ''}
                      onChange={(e) => {
                        const scripture = scriptureCategories
                          .find(c => c.name === selectedCategory)
                          ?.scriptures.find(s => s.id === e.target.value);
                        setSelectedScripture(scripture || null);
                        setSelectedVerses([]);
                      }}
                      className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
                    >
                      <option value="">Choose a scripture...</option>
                      {scriptureCategories
                        .find(c => c.name === selectedCategory)
                        ?.scriptures.map((scripture) => (
                          <option key={scripture.id} value={scripture.id}>
                            {scripture.reference}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {selectedScripture && selectedScripture.verses && selectedScripture.verses.length > 0 && (
                  <div>
                    <label className="block studio-text-secondary text-sm mb-2">
                      Select Verses (optional - leave empty for all)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {selectedScripture.verses.map((verse) => (
                        <button
                          key={verse.verse}
                          onClick={() => handleToggleVerse(verse.verse)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedVerses.includes(verse.verse)
                              ? 'bg-studio-accent-gold text-studio-black'
                              : 'bg-studio-gray-900 text-studio-text-dim hover:bg-studio-gray-800'
                          }`}
                        >
                          {verse.verse}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="studio-card space-y-4">
            <h2 className="studio-card-subheader">Text Content</h2>

            <div>
              <label className="block studio-text-secondary text-sm mb-2">Title (optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your text..."
                className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary placeholder-studio-text-dim focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
              />
            </div>

            <div>
              <label className="block studio-text-secondary text-sm mb-2">
                Text {mode === 'from-scripture' ? '(you can edit this)' : ''}
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={8}
                className="w-full px-4 py-3 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary placeholder-studio-text-dim focus:outline-none focus:ring-2 focus:ring-studio-accent-gold resize-none"
              />
              <div className="text-xs text-studio-text-dim mt-1">
                {customText.length} characters
              </div>
            </div>

            <div>
              <label className="block studio-text-secondary text-sm mb-2">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., worship, prayer, meditation"
                className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary placeholder-studio-text-dim focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
              />
            </div>
          </div>

          <div className="studio-card space-y-4">
            <h2 className="studio-card-subheader">Musical Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block studio-text-secondary text-sm mb-2">Key</label>
                <select
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
                >
                  {keys.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block studio-text-secondary text-sm mb-2">Time Signature</label>
                <select
                  value={timeSignature}
                  onChange={(e) => setTimeSignature(e.target.value)}
                  className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
                >
                  {timeSignatures.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block studio-text-secondary text-sm mb-2">
                  Tempo: {tempo} BPM
                </label>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={tempo}
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block studio-text-secondary text-sm mb-2">Instrument</label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full px-4 py-2 bg-studio-gray-900 border border-studio-border rounded-lg text-studio-text-primary focus:outline-none focus:ring-2 focus:ring-studio-accent-gold"
                >
                  {instruments.map((inst) => (
                    <option key={inst.value} value={inst.value}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="studio-card bg-studio-gray-900 border-studio-border-light">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUseWithoutSaving}
                disabled={!customText.trim() || saving}
                className="flex-1 studio-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="inline w-4 h-4 mr-2" />
                Use Without Saving
              </button>

              {user && (
                <button
                  onClick={handleSaveAndContinue}
                  disabled={!customText.trim() || saving}
                  className="flex-1 studio-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="inline w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save & Continue to Music Machine'}
                </button>
              )}

              {!user && (
                <div className="flex-1 p-4 bg-studio-accent-gold/10 border border-studio-accent-gold/30 rounded-lg">
                  <p className="text-sm text-studio-text-secondary">
                    Sign in to save your custom texts for future use
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => onNavigate('studio-dashboard')}
                className="studio-button-ghost text-sm"
              >
                Cancel & Return to Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
