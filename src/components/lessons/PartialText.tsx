import React, { useState } from 'react';
import { Eye, EyeOff, Check, RefreshCw, BookOpen, X } from 'lucide-react';

interface PartialTextProps {
  lesson: any;
  scriptures: any[];
}

export function PartialText({ lesson, scriptures }: PartialTextProps) {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [revealLevel, setRevealLevel] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const verses = [
    {
      text: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      reference: "Psalm 23:1-2",
      theme: "Trust",
      fragments: [
        "The Lord is my shepherd",
        "I shall not want",
        "He maketh me to lie down in green pastures",
        "he leadeth me beside the still waters"
      ]
    },
    {
      text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
      reference: "Proverbs 3:5-6",
      theme: "Wisdom",
      fragments: [
        "Trust in the Lord with all thine heart",
        "and lean not unto thine own understanding",
        "In all thy ways acknowledge him",
        "and he shall direct thy paths"
      ]
    },
    {
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      reference: "John 3:16",
      theme: "Love",
      fragments: [
        "For God so loved the world",
        "that he gave his only begotten Son",
        "that whosoever believeth in him should not perish",
        "but have everlasting life"
      ]
    },
    {
      text: "Amazing grace! How sweet the sound that saved a wretch like me! I once was lost, but now am found; was blind, but now I see.",
      reference: "Amazing Grace",
      theme: "Grace",
      fragments: [
        "Amazing grace! How sweet the sound",
        "that saved a wretch like me",
        "I once was lost, but now am found",
        "was blind, but now I see"
      ]
    }
  ];

  const currentV = verses[currentVerse];

  const getRevealedText = () => {
    const fragments = currentV.fragments.slice(0, revealLevel);
    return fragments.join('; ') + (revealLevel < currentV.fragments.length ? '...' : '');
  };

  const getHiddenText = () => {
    if (revealLevel >= currentV.fragments.length) return '';
    return currentV.fragments.slice(revealLevel).join('; ');
  };

  const checkAnswer = () => {
    const hiddenText = getHiddenText().toLowerCase().replace(/[.,;:!?]/g, '');
    const userText = userInput.toLowerCase().replace(/[.,;:!?]/g, '');
    
    setAttempts(prev => prev + 1);
    
    // Check for substantial match (at least 70% of words correct)
    const expectedWords = hiddenText.split(' ').filter(w => w.length > 0);
    const userWords = userText.split(' ').filter(w => w.length > 0);
    const matchingWords = expectedWords.filter(word => 
      userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
    );
    
    const accuracy = matchingWords.length / expectedWords.length;
    
    if (accuracy >= 0.7) {
      setScore(prev => prev + 1);
      setShowAnswer(true);
      
      setTimeout(() => {
        if (revealLevel < currentV.fragments.length) {
          setRevealLevel(prev => prev + 1);
          setUserInput('');
          setShowAnswer(false);
        }
      }, 2000);
    } else {
      setShowAnswer(true);
      setTimeout(() => {
        setShowAnswer(false);
        setUserInput('');
      }, 3000);
    }
  };

  const nextVerse = () => {
    if (currentVerse < verses.length - 1) {
      setCurrentVerse(prev => prev + 1);
      setRevealLevel(1);
      setUserInput('');
      setShowAnswer(false);
    }
  };

  const resetActivity = () => {
    setCurrentVerse(0);
    setRevealLevel(1);
    setUserInput('');
    setShowAnswer(false);
    setScore(0);
    setAttempts(0);
  };

  const isComplete = revealLevel >= currentV.fragments.length;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Partial Text Practice</h2>
        <p className="text-blue-100">Practice Scripture by revealing it piece by piece</p>
        
        <div className="flex justify-center space-x-6 text-sm">
          <span className="text-blue-300">Verse {currentVerse + 1} of {verses.length}</span>
          <span className="text-green-300">Score: {score}/{attempts}</span>
          <span className="text-purple-300">Fragment {revealLevel} of {currentV.fragments.length}</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Current Verse Info */}
        <div className="bg-white/10 backdrop-blur-md border-l-4 border-blue-500 p-6 border border-blue-500/30">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">{currentV.reference}</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium ${
                currentV.theme === 'Trust' ? 'bg-blue-500/30 text-blue-100' :
                currentV.theme === 'Wisdom' ? 'bg-purple-500/30 text-purple-100' :
                currentV.theme === 'Love' ? 'bg-pink-500/30 text-pink-100' :
                'bg-yellow-500/30 text-yellow-100'
              }`}>
                {currentV.theme}
              </span>
            </div>
          </div>
        </div>

        {/* Revealed Text */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-bold text-green-300">Revealed Text</h4>
          </div>
          <p className="text-xl text-white leading-relaxed font-light">
            {getRevealedText()}
          </p>
        </div>

        {!isComplete && (
          <>
            {/* Hidden Text Challenge */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <EyeOff className="w-5 h-5 text-yellow-400" />
                <h4 className="text-lg font-bold text-yellow-300">Complete the Rest</h4>
              </div>
              
              {!showAnswer ? (
                <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} className="space-y-4">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type the rest of the verse..."
                    className="w-full h-24 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!userInput.trim()}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className={`rounded-lg p-4 border ${
                    score > attempts - 1
                      ? 'bg-green-500/20 border-green-500/30'
                      : 'bg-red-500/20 border-red-500/30'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      {score > attempts - 1 ? (
                        <>
                          <Check className="w-8 h-8 text-green-400" />
                          <span className="text-green-300 font-bold">Excellent!</span>
                        </>
                      ) : (
                        <>
                          <X className="w-6 h-6 text-red-400" />
                          <span className="text-red-300 font-bold">Keep practicing!</span>
                        </>
                      )}
                    </div>
                    <p className="text-white font-medium">Correct continuation:</p>
                    <p className="text-blue-100 italic">"{getHiddenText()}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reveal Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setRevealLevel(Math.max(1, revealLevel - 1))}
                disabled={revealLevel <= 1}
                className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Show Less
              </button>
              
              <span className="text-white font-medium">
                Revealing {revealLevel} of {currentV.fragments.length} parts
              </span>
              
              <button
                onClick={() => setRevealLevel(Math.min(currentV.fragments.length, revealLevel + 1))}
                disabled={revealLevel >= currentV.fragments.length}
                className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reveal More
              </button>
            </div>
          </>
        )}

        {isComplete && (
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30 text-center">
            <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-300 mb-2">Verse Complete!</h3>
            <p className="text-green-100 mb-4">You've successfully practiced this entire passage.</p>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={nextVerse}
                disabled={currentVerse >= verses.length - 1}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Verse
              </button>
              
              <button
                onClick={resetActivity}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
          <h4 className="text-yellow-300 font-bold mb-2">How to Practice</h4>
          <ol className="text-yellow-100 text-sm space-y-1">
            <li>1. Read the revealed portion carefully</li>
            <li>2. Try to complete the rest from memory</li>
            <li>3. Use "Reveal More" if you need a hint</li>
            <li>4. Practice until you can recite the entire verse</li>
          </ol>
        </div>
      </div>
    </div>
  );
}