import React, { useState } from 'react';
import { BookOpen, Search, Music, Clock, Star, ChevronRight, Scroll } from 'lucide-react';
import { torahPassages, torahBooks } from '../data/torahPassages';
import ScripturePlayer from './ScripturePlayer';
import { MusicMachine } from './MusicMachine';

export function TorahPage() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getBookColor = (book: string) => {
    const colors = {
      genesis: 'from-green-500/20 to-green-600/20 border-green-500/30',
      exodus: 'from-red-500/20 to-red-600/20 border-red-500/30',
      leviticus: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      numbers: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      deuteronomy: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
    };
    return colors[book as keyof typeof colors] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  };

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
      'Divine Power and Order': 'bg-purple-500/30 text-purple-100',
      'Paradise and Innocence': 'bg-green-500/30 text-green-100',
      'Faith and Promise': 'bg-blue-500/30 text-blue-100',
      'Divine Calling and Holiness': 'bg-yellow-500/30 text-yellow-100',
      'Divine Law and Morality': 'bg-red-500/30 text-red-100',
      'Redemption and Deliverance': 'bg-orange-500/30 text-orange-100',
      'Atonement and Forgiveness': 'bg-pink-500/30 text-pink-100',
      'Holy Living': 'bg-indigo-500/30 text-indigo-100',
      'Divine Blessing': 'bg-cyan-500/30 text-cyan-100',
      'Healing and Faith': 'bg-emerald-500/30 text-emerald-100',
      'Love and Devotion': 'bg-rose-500/30 text-rose-100',
      'Choice and Blessing': 'bg-violet-500/30 text-violet-100',
      'God\'s Faithfulness': 'bg-amber-500/30 text-amber-100'
    };
    return colors[theme as keyof typeof colors] || 'bg-gray-500/30 text-gray-100';
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedPassage(null);
  };

  const handleBackToPassages = () => {
    setSelectedPassage(null);
  };

  // Render individual passage player
  if (selectedPassage) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button
          onClick={handleBackToPassages}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to {torahPassages[selectedBook as keyof typeof torahPassages]?.title}</span>
        </button>
        
        <ScripturePlayer 
          scripture={selectedPassage} 
          onStartQuiz={() => {}}
        />
        
        <MusicMachine
          keySignature={selectedPassage.key}
          tempo={selectedPassage.tempo}
          isVisible={true}
          scriptureText={selectedPassage.text}
        />
      </div>
    );
  }

  // Render passages within a book
  if (selectedBook) {
    const bookData = torahPassages[selectedBook as keyof typeof torahPassages];
    
    const filteredPassages = bookData.passages.filter(passage =>
      passage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passage.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passage.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={handleBackToBooks}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to Torah Books</span>
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">{bookData.title}</h1>
          <p className="text-xl text-blue-100">{bookData.description}</p>
        </div>

        {/* Search */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search passages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Passages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPassages.map((passage) => (
            <div
              key={passage.id}
              onClick={() => setSelectedPassage(passage)}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                      {passage.title}
                    </h3>
                    <p className="text-blue-200 font-medium">{passage.reference}</p>
                  </div>
                  <Scroll className="w-6 h-6 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm ${getThemeColor(passage.theme)}`}>
                    {passage.theme}
                  </span>
                  <span className="bg-blue-500/30 text-blue-100 px-3 py-1 text-sm">
                    {passage.key}
                  </span>
                  <span className={`px-3 py-1 text-sm ${getDifficultyColor(passage.difficulty)}`}>
                    {passage.difficulty}
                  </span>
                </div>

                <p className="text-blue-100 text-sm leading-relaxed">
                  {passage.text.substring(0, 120)}...
                </p>

                <div className="flex items-center justify-between text-sm text-blue-200">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{passage.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{passage.theme}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPassages.length === 0 && (
          <div className="text-center py-12">
            <Scroll className="w-10 h-10 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No passages found</h3>
            <p className="text-blue-200">Try adjusting your search term</p>
          </div>
        )}
      </div>
    );
  }

  // Render main books selection
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Torah - The Five Books of Moses</h1>
        <p className="text-xl text-blue-100">Explore the foundational books of Scripture through music</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {torahBooks.map((book) => {
          const bookData = torahPassages[book as keyof typeof torahPassages];
          const passageCount = bookData.passages.length;

          return (
            <div
              key={book}
              onClick={() => setSelectedBook(book)}
              className={`bg-gradient-to-br ${getBookColor(book)} rounded-lg p-8 border hover:scale-105 transition-all duration-300 cursor-pointer group hover:shadow-2xl`}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-4">
                    <Scroll className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {bookData.title}
                  </h2>
                  <p className="text-blue-100 text-lg mt-2">{bookData.description}</p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {passageCount} passages
                  </span>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Music className="w-4 h-4" />
                    <span>Musical</span>
                  </span>
                </div>

                <div className="text-center">
                  <ChevronRight className="w-8 h-8 text-white/50 group-hover:text-white transition-colors mx-auto" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Torah Learning Features */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-8 border border-blue-500/30">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Torah Learning Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto">
              <Scroll className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-300">Ancient Wisdom</h3>
            <p className="text-blue-100 text-sm">
              Learn the foundational stories and laws that shaped God's people
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-300">Musical Heritage</h3>
            <p className="text-blue-100 text-sm">
              Experience Torah passages through traditional and contemporary musical settings
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-300">Deep Study</h3>
            <p className="text-blue-100 text-sm">
              Engage with the rich historical and theological context of each passage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}