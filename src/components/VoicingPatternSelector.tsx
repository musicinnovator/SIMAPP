import React, { useState } from 'react';
import { Music, Star, Plus, Play, Trash2 } from 'lucide-react';
import {
  BlockPattern,
  ArpeggiatedPattern,
  BrokenPattern,
  VoicingTechnique
} from '../types/voicingPatterns';
import { useVoicingPatterns } from '../hooks/useVoicingPatterns';

interface VoicingPatternSelectorProps {
  voicingTechnique: VoicingTechnique;
  selectedPatternId: string;
  onPatternSelect: (patternId: string) => void;
  onPreview?: (patternId: string) => void;
  onCreateCustom?: () => void;
}

export default function VoicingPatternSelector({
  voicingTechnique,
  selectedPatternId,
  onPatternSelect,
  onPreview,
  onCreateCustom
}: VoicingPatternSelectorProps) {
  const {
    blockPatterns,
    arpeggiatedPatterns,
    brokenPatterns,
    userPatterns,
    loading,
    deletePattern,
    toggleFavorite
  } = useVoicingPatterns();

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const getPatterns = (): (BlockPattern | ArpeggiatedPattern | BrokenPattern)[] => {
    switch (voicingTechnique) {
      case 'block':
        return blockPatterns;
      case 'arpeggiated':
        return arpeggiatedPatterns;
      case 'broken':
        return brokenPatterns;
      default:
        return [];
    }
  };

  const patterns = getPatterns();

  const filteredPatterns = showOnlyFavorites
    ? patterns.filter(p => {
        const userPattern = userPatterns.find(up => up.pattern_data.id === p.id);
        return userPattern?.is_favorite;
      })
    : patterns;

  const handleDelete = async (patternId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this custom pattern?')) {
      return;
    }

    const userPattern = userPatterns.find(up => up.pattern_data.id === patternId);
    if (userPattern) {
      const result = await deletePattern(userPattern.id!);
      if (!result.success) {
        alert(result.error || 'Failed to delete pattern');
      }
    }
  };

  const handleToggleFavorite = async (patternId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const userPattern = userPatterns.find(up => up.pattern_data.id === patternId);
    if (userPattern && userPattern.id) {
      await toggleFavorite(userPattern.id, !userPattern.is_favorite);
    }
  };

  const getUserPatternInfo = (patternId: string) => {
    return userPatterns.find(up => up.pattern_data.id === patternId);
  };

  const handlePreview = (patternId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(patternId);
    }
  };

  if (voicingTechnique === 'partial') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {voicingTechnique === 'block' && 'Block Voicing Patterns'}
            {voicingTechnique === 'arpeggiated' && 'Arpeggio Patterns'}
            {voicingTechnique === 'broken' && 'Broken Chord Patterns'}
          </h3>
          <span className="text-sm text-gray-500">
            ({filteredPatterns.length} patterns)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showOnlyFavorites
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className={`w-4 h-4 inline ${showOnlyFavorites ? 'fill-current' : ''}`} />
          </button>
          {onCreateCustom && (
            <button
              onClick={onCreateCustom}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create Custom</span>
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">Loading patterns...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredPatterns.map((pattern) => {
          const userPatternInfo = getUserPatternInfo(pattern.id);
          const isSelected = pattern.id === selectedPatternId;
          const isCustom = pattern.isCustom || false;

          return (
            <div
              key={pattern.id}
              onClick={() => onPatternSelect(pattern.id)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {pattern.name}
                  </h4>
                  {isCustom && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                      Custom
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {userPatternInfo && (
                    <button
                      onClick={(e) => handleToggleFavorite(pattern.id, e)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title={userPatternInfo.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          userPatternInfo.is_favorite
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  )}
                  {onPreview && (
                    <button
                      onClick={(e) => handlePreview(pattern.id, e)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Preview pattern"
                    >
                      <Play className="w-4 h-4 text-blue-600" />
                    </button>
                  )}
                  {isCustom && (
                    <button
                      onClick={(e) => handleDelete(pattern.id, e)}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Delete custom pattern"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {pattern.description}
              </p>
              {'sequence' in pattern && (
                <div className="mt-2 px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
                  {pattern.sequence}
                </div>
              )}
              {'subdivision' in pattern && (
                <div className="mt-2 text-xs text-gray-500">
                  Subdivision: {pattern.subdivision}
                </div>
              )}
              {'timeSignature' in pattern && (
                <div className="mt-2 text-xs text-gray-500">
                  Time: {pattern.timeSignature}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredPatterns.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {showOnlyFavorites
            ? 'No favorite patterns yet. Mark patterns as favorites to see them here.'
            : 'No patterns available'}
        </div>
      )}
    </div>
  );
}
