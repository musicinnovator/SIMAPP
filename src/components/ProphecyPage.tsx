import React, { useState } from 'react';
import { BookOpen, Search, Music, ChevronRight } from 'lucide-react';
import { prophecyPassages } from '../data/prophecyPassages';
import ScripturePlayer from './ScripturePlayer';
import { MusicMachine } from './MusicMachine';

export function ProphecyPage() {
  const [selectedPassage, setSelectedPassage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPassages = prophecyPassages.filter(passage =>
    passage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passage.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPassage) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedPassage(null)}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to Prophecy</span>
        </button>

        <ScripturePlayer
          scripture={selectedPassage}
          onStartQuiz={() => {}}
        />

        <MusicMachine
          keySignature={selectedPassage.key}
          tempo={`${selectedPassage.tempo} BPM`}
          isVisible={true}
          scriptureText={selectedPassage.text}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-purple-500/20 to-red-600/20 border border-purple-500/30 rounded-xl p-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Prophecy</h1>
        </div>
        <p className="text-gray-300">End-time prophecies from Daniel and Revelation</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search passages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPassages.map(passage => (
          <button
            key={passage.id}
            onClick={() => setSelectedPassage(passage)}
            className="bg-white/5 border border-white/10 rounded-lg p-6 text-left hover:bg-white/10 transition-all hover:border-purple-500/50 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {passage.title}
                </h3>
                <p className="text-purple-400 text-sm font-medium">{passage.reference}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors mt-1" />
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <Music className="w-4 h-4" />
                <span>{passage.key} • {passage.timeSignature}</span>
              </span>
              <span>•</span>
              <span>{passage.theme}</span>
            </div>
          </button>
        ))}
      </div>

      {filteredPassages.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No passages found matching your search.
        </div>
      )}
    </div>
  );
}
