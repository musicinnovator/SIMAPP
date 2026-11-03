import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Play, Music, Tag, Clock, FileText, AlertCircle, Lock } from 'lucide-react';
import { useCustomTexts, CustomText } from '../hooks/useCustomTexts';
import { CustomTextManager } from './CustomTextManager';
import { useAuth } from '../hooks/useAuth';

interface CustomTextsLibraryProps {
  onSelectText?: (text: CustomText) => void;
}

export function CustomTextsLibrary({ onSelectText }: CustomTextsLibraryProps) {
  const { user, isGuest } = useAuth();
  const { customTexts, loading, error, deleteCustomText } = useCustomTexts();
  const [showManager, setShowManager] = useState(false);
  const [editingText, setEditingText] = useState<CustomText | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (text: CustomText) => {
    setEditingText(text);
    setShowManager(true);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await deleteCustomText(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleCloseManager = () => {
    setShowManager(false);
    setEditingText(null);
  };

  const filteredTexts = customTexts.filter(text => {
    const matchesSearch =
      text.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      text.text_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      text.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLabel = !filterLabel || text.label === filterLabel;

    return matchesSearch && matchesLabel;
  });

  const uniqueLabels = Array.from(new Set(customTexts.map(t => t.label).filter(Boolean)));

  if (!user || isGuest) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-yellow-500/20 rounded-full">
              <Lock className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
          <p className="text-yellow-100 leading-relaxed max-w-2xl mx-auto">
            Custom Texts is a premium feature for registered users. Sign in to create, save, and manage your own personalized content with musical settings.
          </p>
          <div className="pt-4">
            <p className="text-sm text-yellow-200">
              Already have an account? Click the menu to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 lg:pb-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 border border-blue-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Custom Texts</h1>
              <p className="text-blue-100">Create and manage your personal content</p>
            </div>
          </div>
          <button
            onClick={() => setShowManager(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Text</span>
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search texts, tags..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterLabel}
            onChange={e => setFilterLabel(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="bg-gray-900">All Labels</option>
            {uniqueLabels.map(label => (
              <option key={label} value={label} className="bg-gray-900">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-white">Loading your texts...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      ) : filteredTexts.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <FileText className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {searchQuery || filterLabel ? 'No matching texts' : 'No custom texts yet'}
          </h3>
          <p className="text-gray-300 mb-6">
            {searchQuery || filterLabel
              ? 'Try adjusting your search or filter'
              : 'Create your first custom text to get started!'}
          </p>
          {!searchQuery && !filterLabel && (
            <button
              onClick={() => setShowManager(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Text</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTexts.map(text => (
            <div
              key={text.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 hover:shadow-2xl group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {text.title}
                    </h3>
                    {text.label && (
                      <div className="inline-flex items-center space-x-1 mt-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                        <Tag className="w-3 h-3 text-blue-300" />
                        <span className="text-xs text-blue-200 font-medium">{text.label}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {text.text_content}
                </p>

                <div className="flex flex-wrap gap-2">
                  {text.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {text.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                      +{text.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Music className="w-4 h-4" />
                    <span>{text.key_signature}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{text.tempo} BPM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                  {onSelectText && (
                    <button
                      onClick={() => onSelectText(text)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-success-50 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(text)}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(text.id)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                      deleteConfirm === text.id
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-white/10 hover:bg-red-600'
                    } text-white`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {deleteConfirm === text.id && (
                  <p className="text-xs text-red-300 text-center">Click again to confirm deletion</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showManager && (
        <CustomTextManager
          onClose={handleCloseManager}
          editingText={editingText}
        />
      )}
    </div>
  );
}
