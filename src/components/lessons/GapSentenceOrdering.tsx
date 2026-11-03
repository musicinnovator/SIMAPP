import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle, RefreshCw, Shuffle } from 'lucide-react';

interface GapSentenceOrderingProps {
  scripture: {
    text: string;
    reference: string;
  };
  onComplete: (score: number) => void;
}

export function GapSentenceOrdering({ scripture, onComplete }: GapSentenceOrderingProps) {
  const [originalLines, setOriginalLines] = useState<string[]>([]);
  const [shuffledLines, setShuffledLines] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; score: number } | null>(null);

  useEffect(() => {
    const lines = scripture.text.split('\n').filter(line => line.trim());
    setOriginalLines(lines);
    shuffleLines(lines);
  }, [scripture]);

  const shuffleLines = (lines: string[]) => {
    const shuffled = [...lines].sort(() => Math.random() - 0.5);
    setShuffledLines(shuffled);
    setResult(null);
  };

  const moveLineUp = (index: number) => {
    if (index === 0) return;
    const newLines = [...shuffledLines];
    [newLines[index - 1], newLines[index]] = [newLines[index], newLines[index - 1]];
    setShuffledLines(newLines);
  };

  const moveLineDown = (index: number) => {
    if (index === shuffledLines.length - 1) return;
    const newLines = [...shuffledLines];
    [newLines[index], newLines[index + 1]] = [newLines[index + 1], newLines[index]];
    setShuffledLines(newLines);
  };

  const checkOrder = () => {
    setIsChecking(true);
    const isCorrect = shuffledLines.every((line, idx) => line === originalLines[idx]);
    const correctCount = shuffledLines.filter((line, idx) => line === originalLines[idx]).length;
    const score = (correctCount / originalLines.length) * 100;

    setResult({ correct: isCorrect, score });

    if (isCorrect) {
      setTimeout(() => onComplete(100), 2000);
    }

    setTimeout(() => setIsChecking(false), 500);
  };

  const isLineCorrect = (index: number): boolean => {
    return result !== null && shuffledLines[index] === originalLines[index];
  };

  const isLineIncorrect = (index: number): boolean => {
    return result !== null && shuffledLines[index] !== originalLines[index];
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shuffle className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Gap-Sentence Ordering</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Arrange the lines in the correct order to complete the verse
        </p>
        <div className="text-blue-200 font-semibold">
          {scripture.reference}
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {shuffledLines.map((line, index) => (
          <div
            key={index}
            className={`relative group transition-all ${
              isLineCorrect(index)
                ? 'bg-green-500/20 border-2 border-green-500'
                : isLineIncorrect(index)
                ? 'bg-red-500/20 border-2 border-red-500'
                : 'bg-white/10 border-2 border-white/20'
            } rounded-xl p-6`}
          >
            <div className="flex items-center gap-4">
              {/* Order Controls */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => moveLineUp(index)}
                  disabled={index === 0 || result !== null}
                  className={`p-2 rounded-lg transition-all ${
                    index === 0 || result !== null
                      ? 'bg-white/5 opacity-30 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 hover:scale-110'
                  }`}
                >
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => moveLineDown(index)}
                  disabled={index === shuffledLines.length - 1 || result !== null}
                  className={`p-2 rounded-lg transition-all ${
                    index === shuffledLines.length - 1 || result !== null
                      ? 'bg-white/5 opacity-30 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 hover:scale-110'
                  }`}
                >
                  <ArrowDown className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Line Number */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                {index + 1}
              </div>

              {/* Line Text */}
              <div className="flex-1">
                <p className="text-white leading-relaxed">{line}</p>
              </div>

              {/* Feedback Icon */}
              {isLineCorrect(index) && (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              )}
              {isLineIncorrect(index) && (
                <div className="text-red-400 text-sm font-semibold flex-shrink-0">
                  Should be #{originalLines.indexOf(line) + 1}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => shuffleLines(originalLines)}
          disabled={result?.correct === true}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all transform hover:scale-105"
        >
          <RefreshCw className="w-5 h-5" />
          Shuffle Again
        </button>

        <button
          onClick={checkOrder}
          disabled={isChecking || result?.correct === true}
          className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all transform hover:scale-105 ${
            result?.correct
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {result?.correct ? 'Perfect!' : 'Check Order'}
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div className={`text-center p-6 rounded-xl border-2 ${
          result.correct
            ? 'bg-green-500/20 border-green-500'
            : 'bg-yellow-500/20 border-yellow-500'
        }`}>
          {result.correct ? (
            <div className="space-y-2">
              <p className="text-green-300 text-2xl font-bold">Excellent! Perfect Order! 🎉</p>
              <p className="text-green-200">You've correctly arranged all the lines!</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-yellow-300 text-xl font-bold">
                Score: {Math.round(result.score)}%
              </p>
              <p className="text-yellow-200">
                {Math.round(result.score) >= 50 ? 'Good try! Keep adjusting.' : 'Review the order and try again!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
