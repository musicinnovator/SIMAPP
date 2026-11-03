import React, { useState, useEffect } from 'react';
import { Music, Check, X, RefreshCw, ArrowLeft, BookOpen } from 'lucide-react';

interface LyricMatchingGameProps {
  lesson: any;
  scriptures: any[];
}

export function LyricMatchingGame({ lesson, scriptures }: LyricMatchingGameProps) {
  const [selectedLyric, setSelectedLyric] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Sample lyric-to-verse pairs based on lesson scriptures
  const lyricVersePairs = [
    {
      lyric: "Amazing grace! How sweet the sound that saved a wretch like me!",
      verse: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God",
      reference: "Ephesians 2:8",
      theme: "Grace"
    },
    {
      lyric: "The Lord is my shepherd; I shall not want",
      verse: "The Lord is my shepherd; I shall not want",
      reference: "Psalm 23:1",
      theme: "Trust"
    },
    {
      lyric: "How great thou art! How great thou art!",
      verse: "O Lord our Lord, how excellent is thy name in all the earth!",
      reference: "Psalm 8:1",
      theme: "Praise"
    },
    {
      lyric: "Be thou my vision, O Lord of my heart",
      verse: "Set your minds on things above, not on earthly things",
      reference: "Colossians 3:2",
      theme: "Devotion"
    },
    {
      lyric: "When I survey the wondrous cross on which the Prince of glory died",
      verse: "But God forbid that I should glory, save in the cross of our Lord Jesus Christ",
      reference: "Galatians 6:14",
      theme: "Sacrifice"
    }
  ];

  const shuffledLyrics = [...lyricVersePairs].sort(() => Math.random() - 0.5);
  const shuffledVerses = [...lyricVersePairs].sort(() => Math.random() - 0.5);

  const handleMatch = () => {
    if (!selectedLyric || !selectedVerse) return;

    const lyricPair = lyricVersePairs.find(p => p.lyric === selectedLyric);
    const versePair = lyricVersePairs.find(p => p.verse === selectedVerse);
    
    setAttempts(prev => prev + 1);

    if (lyricPair && versePair && lyricPair.reference === versePair.reference) {
      setMatches(prev => ({ ...prev, [selectedLyric]: selectedVerse }));
      setScore(prev => prev + 1);
      setSelectedLyric(null);
      setSelectedVerse(null);
      
      if (Object.keys(matches).length + 1 === lyricVersePairs.length) {
        setGameComplete(true);
      }
    } else {
      // Show incorrect match briefly
      setTimeout(() => {
        setSelectedLyric(null);
        setSelectedVerse(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setMatches({});
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
    setSelectedLyric(null);
    setSelectedVerse(null);
  };

  useEffect(() => {
    if (selectedLyric && selectedVerse) {
      handleMatch();
    }
  }, [selectedLyric, selectedVerse]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Lyric to Verse Matching</h2>
        <p className="text-blue-100">Match hymn lyrics with their corresponding Scripture verses</p>
        
        <div className="flex justify-center space-x-6 text-sm">
          <span className="text-green-300">Score: {score}/{lyricVersePairs.length}</span>
          <span className="text-blue-300">Attempts: {attempts}</span>
          <span className="text-yellow-300">Accuracy: {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</span>
        </div>
      </div>

      {!gameComplete ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lyrics Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Music className="w-5 h-5 text-yellow-500" />
              <span>Hymn Lyrics</span>
            </h3>
            <div className="space-y-3">
              {shuffledLyrics.map((pair, index) => {
                const isMatched = matches[pair.lyric];
                const isSelected = selectedLyric === pair.lyric;
                
                if (isMatched) return null;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedLyric(pair.lyric)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-yellow-500/30 border-2 border-yellow-500 text-white'
                        : 'bg-white/5 border border-white/20 text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <p className="font-medium">{pair.lyric}</p>
                    <p className="text-sm opacity-75 mt-1">Theme: {pair.theme}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verses Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Scripture Verses</span>
            </h3>
            <div className="space-y-3">
              {shuffledVerses.map((pair, index) => {
                const isMatched = Object.values(matches).includes(pair.verse);
                const isSelected = selectedVerse === pair.verse;
                
                if (isMatched) return null;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedVerse(pair.verse)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500/30 border-2 border-blue-500 text-white'
                        : 'bg-white/5 border border-white/20 text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <p className="font-medium">{pair.verse}</p>
                    <p className="text-sm opacity-75 mt-1">{pair.reference}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-white/10 backdrop-blur-md border-l-4 border-green-500 p-8 border border-green-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">Excellent Work!</h3>
            <div className="text-6xl font-bold text-green-400 mb-2">{Math.round((score / attempts) * 100)}%</div>
            <p className="text-xl text-green-100">
              You matched {score} out of {lyricVersePairs.length} pairs correctly
            </p>
          </div>

          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
        </div>
      )}

      {/* Matched Pairs Display */}
      {Object.keys(matches).length > 0 && !gameComplete && (
        <div className="mt-8 bg-green-500/10 rounded-xl p-6 border border-green-500/30">
          <h3 className="text-lg font-bold text-green-300 mb-4">Correct Matches</h3>
          <div className="space-y-2">
            {Object.entries(matches).map(([lyric, verse]) => {
              const pair = lyricVersePairs.find(p => p.lyric === lyric && p.verse === verse);
              return (
                <div key={lyric} className="flex items-center space-x-3 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-100">
                    "{lyric.substring(0, 30)}..." ↔ {pair?.reference}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}