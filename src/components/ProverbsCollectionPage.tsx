import React, { useState } from 'react';
import { BookOpen, Search, Music, Clock, Lightbulb, ChevronRight, Target } from 'lucide-react';
import { proverbsCollection, proverbsCategories } from '../data/proverbsCollection';
import ScripturePlayer from './ScripturePlayer';
import { MusicMachine } from './MusicMachine';

export function ProverbsCollectionPage() {
  const [selectedProverb, setSelectedProverb] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProverbs = proverbsCollection.filter(proverb => {
    const matchesSearch = proverb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proverb.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proverb.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || proverb.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500 text-green-100';
      case 'Intermediate': return 'bg-yellow-600 text-white';
      case 'Advanced': return 'bg-red-500 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const getThemeColor = (theme: string) => {
    const colors = {
      'Wisdom Foundation': 'bg-purple-500/30 text-purple-100',
      'Trust and Obedience': 'bg-blue-500/30 text-blue-100',
      'Character and Virtue': 'bg-green-500/30 text-green-100',
      'Divine Sovereignty': 'bg-yellow-500/30 text-yellow-100',
      'Protection and Refuge': 'bg-indigo-500/30 text-indigo-100',
      'Parenting and Training': 'bg-pink-500/30 text-pink-100',
      'Humility and Time': 'bg-gray-500/30 text-gray-100',
      'Vision and Law': 'bg-red-500/30 text-red-100'
    };
    return colors[theme as keyof typeof colors] || 'bg-gray-500/30 text-gray-100';
  };

  // Determine musical mode based on text content
  const determineModeFromText = (text: string): { mode: string; reasoning: string } => {
    const lowerText = text.toLowerCase();
    
    // Analyze emotional content
    const joyWords = ['rejoice', 'glad', 'happy', 'blessed', 'praise', 'delight'];
    const sorrowWords = ['trouble', 'sorrow', 'mourn', 'weep', 'affliction', 'distress'];
    const peaceWords = ['peace', 'rest', 'calm', 'still', 'quiet', 'safety'];
    const strengthWords = ['strong', 'mighty', 'power', 'strength', 'victory'];
    
    const joyCount = joyWords.filter(word => lowerText.includes(word)).length;
    const sorrowCount = sorrowWords.filter(word => lowerText.includes(word)).length;
    const peaceCount = peaceWords.filter(word => lowerText.includes(word)).length;
    const strengthCount = strengthWords.filter(word => lowerText.includes(word)).length;
    
    if (joyCount > 0) {
      return { mode: 'Major (Joyful)', reasoning: 'Contains words of joy and blessing' };
    } else if (sorrowCount > 0) {
      return { mode: 'Minor (Reflective)', reasoning: 'Contains words of sorrow or trouble' };
    } else if (peaceCount > 0) {
      return { mode: 'Major (Peaceful)', reasoning: 'Contains words of peace and rest' };
    } else if (strengthCount > 0) {
      return { mode: 'Major (Strong)', reasoning: 'Contains words of strength and power' };
    } else if (lowerText.includes('fear') || lowerText.includes('reverence')) {
      return { mode: 'Minor (Reverent)', reasoning: 'Contains words of fear or reverence' };
    } else if (lowerText.includes('wisdom') || lowerText.includes('understanding')) {
      return { mode: 'Major (Contemplative)', reasoning: 'Contains wisdom and understanding themes' };
    } else {
      return { mode: 'Major (Balanced)', reasoning: 'Balanced content suggesting major tonality' };
    }
  };

  const handleBackToCollection = () => {
    setSelectedProverb(null);
  };

  // Render individual proverb player
  if (selectedProverb) {
    const modeAnalysis = determineModeFromText(selectedProverb.text);
    
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={handleBackToCollection}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to Proverbs Collection</span>
        </button>
        
        {/* Mode Analysis Display */}
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Target className="w-6 h-6 text-purple-400" />
            <span>AI Musical Mode Analysis</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-purple-300 font-bold mb-2">Determined Mode</h4>
              <p className="text-white text-lg font-medium">{modeAnalysis.mode}</p>
            </div>
            <div>
              <h4 className="text-purple-300 font-bold mb-2">Reasoning</h4>
              <p className="text-purple-100 text-sm">{modeAnalysis.reasoning}</p>
            </div>
          </div>
        </div>
        
        <ScripturePlayer 
          scripture={selectedProverb} 
          onStartQuiz={() => {}}
        />
        
        <MusicMachine
          keySignature={selectedProverb.key}
          tempo={selectedProverb.tempo}
          isVisible={true}
          scriptureText={selectedProverb.text}
        />
      </div>
    );
  }

  // Render main collection view
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Proverbs Collection</h1>
        <p className="text-xl text-blue-100">Learn wisdom and understanding through musical Scripture</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search proverbs, themes, or references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {proverbsCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-yellow-500 text-yellow-900 shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Mode Analysis Feature */}
      <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <span>AI Musical Mode Generator</span>
        </h3>
        <p className="text-purple-100 mb-4">
          Our AI analyzes each proverb's emotional content and themes to automatically determine 
          the most appropriate musical mode (major/minor) and suggest musical characteristics.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <h4 className="text-purple-300 font-bold mb-1">Text Analysis</h4>
            <p className="text-purple-100">Scans for emotional keywords and themes</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h4 className="text-purple-300 font-bold mb-1">Mode Selection</h4>
            <p className="text-purple-100">Determines major/minor based on content</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h4 className="text-purple-300 font-bold mb-1">Musical Pairing</h4>
            <p className="text-purple-100">Suggests tempo and key signatures</p>
          </div>
        </div>
      </div>

      {/* Proverbs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProverbs.map((proverb) => {
          const modeAnalysis = determineModeFromText(proverb.text);
          
          return (
            <div
              key={proverb.id}
              onClick={() => setSelectedProverb(proverb)}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                      {proverb.title}
                    </h3>
                    <p className="text-blue-200 font-medium">{proverb.reference}</p>
                  </div>
                  <Lightbulb className="w-6 h-6 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm ${getThemeColor(proverb.theme)}`}>
                    {proverb.theme}
                  </span>
                  <span className="bg-blue-500/30 text-blue-100 px-3 py-1 text-sm">
                    {proverb.key}
                  </span>
                  <span className={`px-3 py-1 text-sm ${getDifficultyColor(proverb.difficulty)}`}>
                    {proverb.difficulty}
                  </span>
                </div>

                {/* AI Mode Analysis Preview */}
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                  <h4 className="text-purple-300 font-bold text-sm mb-1">AI Mode Analysis</h4>
                  <p className="text-purple-100 text-sm">{modeAnalysis.mode}</p>
                  <p className="text-purple-200 text-xs mt-1">{modeAnalysis.reasoning}</p>
                </div>

                <p className="text-blue-100 text-sm leading-relaxed">
                  {proverb.text.substring(0, 120)}...
                </p>

                <div className="flex items-center justify-between text-sm text-blue-200">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{proverb.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Wisdom</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProverbs.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No proverbs found</h3>
          <p className="text-blue-200">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}