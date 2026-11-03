import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SpotTheErrorProps {
  scripture: {
    text: string;
    reference: string;
  };
  onComplete: (score: number) => void;
}

export function SpotTheError({ scripture, onComplete }: SpotTheErrorProps) {
  const [originalText, setOriginalText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [errorIndex, setErrorIndex] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const lines = scripture.text.split('\n').filter(line => line.trim());
    const fullText = lines.join(' ');
    setOriginalText(fullText);
    createErrorVersion(fullText);
  }, [scripture]);

  const createErrorVersion = (text: string) => {
    const wordArray = text.split(/\s+/);
    const errorIdx = Math.floor(Math.random() * Math.min(wordArray.length, 20));
    setErrorIndex(errorIdx);

    const errorTypes = [
      () => wordArray[errorIdx].split('').reverse().join(''),
      () => wordArray[errorIdx].toUpperCase(),
      () => wordArray[errorIdx].substring(0, Math.ceil(wordArray[errorIdx].length / 2)),
      () => wordArray[errorIdx] + wordArray[errorIdx].slice(-2),
      () => {
        const word = wordArray[errorIdx];
        if (word.length > 3) {
          const mid = Math.floor(word.length / 2);
          return word.substring(0, mid) + word.substring(mid + 1);
        }
        return word + 'x';
      }
    ];

    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const modifiedWords = [...wordArray];
    modifiedWords[errorIdx] = errorType();

    setWords(modifiedWords);
    setErrorText(modifiedWords.join(' '));
  };

  const handleWordClick = (index: number) => {
    if (isCorrect !== null) return;

    setSelectedIndex(index);
    setAttempts(prev => prev + 1);

    if (index === errorIndex) {
      setIsCorrect(true);
      const score = attempts === 0 ? 100 : attempts === 1 ? 85 : attempts === 2 ? 70 : 60;
      setTimeout(() => {
        onComplete(score);
      }, 2000);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedIndex(null);
        if (attempts >= 2) {
          setShowHint(true);
        }
      }, 1000);
    }
  };

  const getWordClassName = (index: number): string => {
    const baseClass = 'inline-block px-2 py-1 m-1 rounded-lg transition-all cursor-pointer';

    if (selectedIndex === index) {
      if (isCorrect === true) {
        return `${baseClass} bg-green-500 text-white scale-110 shadow-lg`;
      } else if (isCorrect === false) {
        return `${baseClass} bg-red-500 text-white scale-110 shadow-lg`;
      }
    }

    if (showHint && Math.abs(index - errorIndex) <= 2) {
      return `${baseClass} bg-yellow-500/30 border-2 border-yellow-500 hover:bg-yellow-500/50`;
    }

    return `${baseClass} bg-white/10 hover:bg-white/20 text-white border border-white/20`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Search className="w-8 h-8 text-orange-400" />
          <h2 className="text-3xl font-bold text-white">Spot the Error</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Find and click on the incorrect word in the Scripture passage
        </p>
        <div className="text-blue-200 font-semibold">
          {scripture.reference}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8">
        <div className="bg-white/10 rounded-xl px-6 py-3 border border-white/20">
          <div className="text-blue-200 text-sm">Attempts</div>
          <div className="text-white text-2xl font-bold">{attempts}</div>
        </div>
        {showHint && (
          <div className="bg-yellow-500/20 rounded-xl px-6 py-3 border border-yellow-500">
            <div className="text-yellow-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Hint: Check highlighted area</span>
            </div>
          </div>
        )}
      </div>

      {/* Text Display */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <div className="text-lg leading-relaxed">
          {words.map((word, index) => (
            <span
              key={index}
              onClick={() => handleWordClick(index)}
              className={getWordClassName(index)}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {isCorrect === true && (
        <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-green-300 text-3xl font-bold">Excellent!</span>
          </div>
          <p className="text-white text-xl mb-2">
            You found the error in {attempts} {attempts === 1 ? 'try' : 'tries'}!
          </p>
          <div className="bg-white/10 rounded-xl p-4 mt-4">
            <p className="text-blue-200 text-sm mb-2">Correction:</p>
            <p className="text-white">
              <span className="line-through text-red-300">{words[errorIndex]}</span>
              {' → '}
              <span className="text-green-300 font-bold">
                {originalText.split(/\s+/)[errorIndex]}
              </span>
            </p>
          </div>
        </div>
      )}

      {isCorrect === false && (
        <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <span className="text-red-300 text-xl font-bold">Not quite! Try again.</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-bold mb-3">How to Play:</h3>
        <ul className="space-y-2 text-blue-100">
          <li className="flex items-start gap-2">
            <span className="text-orange-400">•</span>
            <span>Read through the Scripture passage carefully</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400">•</span>
            <span>One word has been intentionally changed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400">•</span>
            <span>Click on the word you think is incorrect</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400">•</span>
            <span>After 3 attempts, you'll get a hint!</span>
          </li>
        </ul>
      </div>

      {/* Difficulty Note */}
      <div className="text-center text-blue-300 text-sm">
        <p>💡 Tip: Look for spelling errors, reversed letters, or words that don't fit the context</p>
      </div>
    </div>
  );
}
