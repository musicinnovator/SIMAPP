import React, { useState, useEffect } from 'react';
import { Save, X, Music, Tag, Clock, Hash, FileText, AlertCircle } from 'lucide-react';
import { useCustomTexts, CustomText } from '../hooks/useCustomTexts';

interface CustomTextManagerProps {
  onClose: () => void;
  onSaved?: (text: CustomText) => void;
  editingText?: CustomText | null;
}

const LABEL_OPTIONS = [
  'Prayer',
  'Meditation',
  'Personal Scripture',
  'Poem',
  'Song Lyrics',
  'Affirmation',
  'Memory Verse',
  'Other',
];

const KEY_OPTIONS = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];

const TIME_SIGNATURES = ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '9/8', '12/8'];

export function CustomTextManager({ onClose, onSaved, editingText }: CustomTextManagerProps) {
  const { createCustomText, updateCustomText } = useCustomTexts();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    text_content: '',
    label: '',
    key_signature: 'C',
    tempo: 90,
    time_signature: '4/4',
    is_public: false,
    tags: [] as string[],
    notes: '',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingText) {
      setFormData({
        title: editingText.title,
        text_content: editingText.text_content,
        label: editingText.label || '',
        key_signature: editingText.key_signature,
        tempo: editingText.tempo,
        time_signature: editingText.time_signature,
        is_public: editingText.is_public,
        tags: editingText.tags || [],
        notes: editingText.notes || '',
      });
    }
  }, [editingText]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.text_content.trim()) {
      setError('Text content is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingText) {
        const { data, error: updateError } = await updateCustomText(editingText.id, formData);
        if (updateError) throw new Error(updateError);
        if (data && onSaved) onSaved(data);
      } else {
        const { data, error: createError } = await createCustomText(formData);
        if (createError) throw new Error(createError);
        if (data && onSaved) onSaved(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 border-b border-white/20 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-full">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingText ? 'Edit Custom Text' : 'Add Custom Text'}
                </h2>
                <p className="text-blue-100 text-sm">Create your own content with musical settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="My Prayer, Meditation, etc."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Text Content *
              </label>
              <textarea
                value={formData.text_content}
                onChange={e => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
                placeholder="Enter your text here..."
                rows={8}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.text_content.length} characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Label/Category
                </label>
                <select
                  value={formData.label}
                  onChange={e => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a label...</option>
                  {LABEL_OPTIONS.map(label => (
                    <option key={label} value={label} className="bg-gray-900">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2 flex items-center space-x-2">
                  <Music className="w-4 h-4" />
                  <span>Key Signature</span>
                </label>
                <select
                  value={formData.key_signature}
                  onChange={e => setFormData(prev => ({ ...prev, key_signature: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {KEY_OPTIONS.map(key => (
                    <option key={key} value={key} className="bg-gray-900">
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Tempo (BPM)</span>
                </label>
                <input
                  type="number"
                  value={formData.tempo}
                  onChange={e => setFormData(prev => ({ ...prev, tempo: parseInt(e.target.value) || 90 }))}
                  min="40"
                  max="240"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2 flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <span>Time Signature</span>
                </label>
                <select
                  value={formData.time_signature}
                  onChange={e => setFormData(prev => ({ ...prev, time_signature: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TIME_SIGNATURES.map(sig => (
                    <option key={sig} value={sig} className="bg-gray-900">
                      {sig}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2 flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTag}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Personal Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes or reminders..."
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/20">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : editingText ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
