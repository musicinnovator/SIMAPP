import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, RefreshCw } from 'lucide-react';

interface MemorizationQuizProps {
  scripture: any;
  onComplete: (score: number, timeSpent: number) => void;
  onBack: () => void;
}

export function MemorizationQuiz({ scripture, onComplete, onBack }: MemorizationQuizProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [correctWords, setCorrectWords] = useState<boolean[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const defaultScripture = {
    text: 'The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures.',
    reference: 'Psalm 23:1-2'
  };

  const currentScripture = scripture || defaultScripture;
  const words = currentScripture.text.split(' ');

  // Initialize start time
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (currentWordIndex >= words.length) {
      const finalScore = Math.round((correctWords.filter(Boolean).length / words.length) * 100);
      const finalTimeSpent = Math.round((Date.now() - startTime) / 1000);
      setScore(finalScore);
      setTimeSpent(finalTimeSpent);
      setIsComplete(true);
      onComplete(finalScore, finalTimeSpent);
    }
  }, [currentWordIndex, words.length, correctWords, onComplete, startTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentWord = words[currentWordIndex];
    const isCorrect = userInput.toLowerCase().trim() === currentWord.toLowerCase().replace(/[.,;:!?]/, '');
    
    setCorrectWords(prev => [...prev, isCorrect]);
    setUserInput('');
    setCurrentWordIndex(prev => prev + 1);
  };

  const restart = () => {
    setCurrentWordIndex(0);
    setUserInput('');
    setCorrectWords([]);
    setIsComplete(false);
    setScore(0);
    setStartTime(Date.now());
    setTimeSpent(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <h2 className="text-2xl font-bold text-white">{currentScripture.reference}</h2>
          
          <div className="text-blue-200">
            {currentWordIndex}/{words.length} words
          </div>
        </div>

        {!isComplete ? (
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-success-50 h-full transition-all duration-500"
                style={{ width: `${(currentWordIndex / words.length) * 100}%` }}
              />
            </div>

            {/* Text Display with Blanks */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-xl leading-relaxed text-center">
                {words.map((word, index) => {
                  if (index < currentWordIndex) {
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center mx-1 px-2 py-1 rounded ${
                          correctWords[index] ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'
                        }`}
                      >
                        {word}
                        {correctWords[index] ? (
                          <Check className="w-4 h-4 ml-1" />
                        ) : (
                          <X className="w-4 h-4 ml-1" />
                        )}
                      </span>
                    );
                  } else if (index === currentWordIndex) {
                    return (
                      <span key={index} className="bg-yellow-500/30 text-yellow-100 px-3 py-1 rounded mx-1 font-bold">
                        ___
                      </span>
                    );
                  } else {
                    return (
                      <span key={index} className="text-blue-300 mx-1">
                        {word}
                      </span>
                    );
                  }
                })}
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type the next word..."
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="bg-accent-50 text-yellow-900 px-8 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-8 border border-green-500/30">
              <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
              <div className="text-6xl font-bold text-green-400 mb-2">{score}%</div>
              <p className="text-xl text-green-100">
                You got {correctWords.filter(Boolean).length} out of {words.length} words correct
              </p>
              <p className="text-green-200 text-sm mt-2">
                Completed in {Math.round(timeSpent / 60)} minutes and {timeSpent % 60} seconds
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restart}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Choose Another Scripture
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}