import React, { useState } from 'react';
import { BookOpen, Search, Music, Clock, Star, ChevronRight } from 'lucide-react';
import { gospelPassages } from '../data/gospelPassages';
import ScripturePlayer from './ScripturePlayer';
import { MusicMachine } from './MusicMachine';

export function GospelPassagesPage() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const books = Object.keys(gospelPassages);
  
  const getBookColor = (book: string) => {
    const colors = {
      matthew: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      mark: 'from-green-500/20 to-green-600/20 border-green-500/30',
      luke: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      john: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
    };
    return colors[book as keyof typeof colors] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      parables: 'bg-green-500/30 text-green-100',
      miracles: 'bg-blue-500/30 text-blue-100',
      healings: 'bg-purple-500/30 text-purple-100',
      resurrections: 'bg-yellow-500/30 text-yellow-100',
      glorified: 'bg-orange-500/30 text-orange-100',
      secondAdvent: 'bg-red-500/30 text-red-100',
      disciples: 'bg-indigo-500/30 text-indigo-100',
      sermons: 'bg-pink-500/30 text-pink-100',
      baptisms: 'bg-cyan-500/30 text-cyan-100',
      births: 'bg-emerald-500/30 text-emerald-100',
      promises: 'bg-violet-500/30 text-violet-100'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/30 text-gray-100';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500 text-green-100';
      case 'Intermediate': return 'bg-yellow-600 text-white';
      case 'Advanced': return 'bg-red-500 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedCategory(null);
    setSelectedPassage(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
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
          <span>Back to {selectedCategory}</span>
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

  // Render passages within a category
  if (selectedBook && selectedCategory) {
    const bookData = gospelPassages[selectedBook as keyof typeof gospelPassages];
    const categoryPassages = bookData[selectedCategory as keyof typeof bookData] as any[] || [];

    const filteredPassages = categoryPassages.filter(passage =>
      passage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passage.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passage.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={handleBackToCategories}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to {bookData.title}</span>
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            {bookData.title} - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h1>
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
                  <Music className="w-6 h-6 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm ${getCategoryColor(selectedCategory)}`}>
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
            <BookOpen className="w-10 h-10 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No passages found</h3>
            <p className="text-blue-200">Try adjusting your search term</p>
          </div>
        )}
      </div>
    );
  }

  // Render categories within a book
  if (selectedBook) {
    const bookData = gospelPassages[selectedBook as keyof typeof gospelPassages];
    const categories = Object.keys(bookData).filter(key => key !== 'title' && key !== 'description');

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={handleBackToBooks}
          className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Back to Gospel Books</span>
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">{bookData.title}</h1>
          <p className="text-xl text-blue-100">{bookData.description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryData = bookData[category as keyof typeof bookData] as any[];
            const passageCount = categoryData?.length || 0;
            
            if (passageCount === 0) return null;

            return (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <ChevronRight className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm ${getCategoryColor(category)}`}>
                      {passageCount} passages
                    </span>
                  </div>

                  <p className="text-blue-100 text-sm">
                    Explore {category} from the {bookData.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render main books selection
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Gospel Passages</h1>
        <p className="text-xl text-blue-100">Explore the life and teachings of Jesus through the four Gospels</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {books.map((book) => {
          const bookData = gospelPassages[book as keyof typeof gospelPassages];
          const totalPassages = Object.keys(bookData)
            .filter(key => key !== 'title' && key !== 'description')
            .reduce((total, category) => {
              const categoryData = bookData[category as keyof typeof bookData] as any[];
              return total + (categoryData?.length || 0);
            }, 0);

          return (
            <div
              key={book}
              onClick={() => setSelectedBook(book)}
              className={`bg-gradient-to-br ${getBookColor(book)} rounded-lg p-8 border hover:scale-105 transition-all duration-300 cursor-pointer group hover:shadow-2xl`}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                    {bookData.title}
                  </h2>
                  <p className="text-blue-100 text-lg mt-2">{bookData.description}</p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {totalPassages} passages
                  </span>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Music className="w-4 h-4" />
                    <span>Musical</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.keys(bookData)
                    .filter(key => key !== 'title' && key !== 'description')
                    .map((category) => {
                      const categoryData = bookData[category as keyof typeof bookData] as any[];
                      const count = categoryData?.length || 0;
                      if (count === 0) return null;
                      
                      return (
                        <div key={category} className="bg-white/10 rounded-lg p-2 text-center">
                          <span className="text-white font-medium">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </span>
                          <div className="text-blue-200 text-xs">{count} items</div>
                        </div>
                      );
                    })}
                </div>

                <div className="text-center">
                  <ChevronRight className="w-8 h-8 text-white/50 group-hover:text-white transition-colors mx-auto" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg p-8 border border-yellow-500/30">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Gospel Learning Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="bg-yellow-500 p-3 rounded-full w-fit mx-auto">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-yellow-300">Organized by Type</h3>
            <p className="text-yellow-100 text-sm">
              Parables, miracles, healings, and more - each with unique musical arrangements
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-yellow-500 p-3 rounded-full w-fit mx-auto">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-yellow-300">Musical Interpretation</h3>
            <p className="text-yellow-100 text-sm">
              Each passage paired with appropriate musical keys and tempos
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-yellow-500 p-3 rounded-full w-fit mx-auto">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-yellow-300">Interactive Learning</h3>
            <p className="text-yellow-100 text-sm">
              Voice recording, music generation, and memorization tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}