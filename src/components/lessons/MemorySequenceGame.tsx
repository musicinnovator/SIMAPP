import React, { useState, useEffect } from 'react';
import { Zap, Play, CheckCircle, XCircle } from 'lucide-react';
import * as Tone from 'tone';

interface MemorySequenceGameProps {
  scripture: {
    text: string;
  };
  onComplete: (score: number) => void;
}

export function MemorySequenceGame({ scripture, onComplete }: MemorySequenceGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [activePhrase, setActivePhrase] = useState<number | null>(null);
  const [synths, setSynths] = useState<Tone.Synth[]>([]);
  const [phrases, setPhrases] = useState<string[]>([]);

  const colors = [
    { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', active: 'bg-blue-300', note: 'C4' },
    { bg: 'bg-green-500', hover: 'hover:bg-green-600', active: 'bg-green-300', note: 'E4' },
    { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', active: 'bg-yellow-300', note: 'G4' },
    { bg: 'bg-red-500', hover: 'hover:bg-red-600', active: 'bg-red-300', note: 'C5' }
  ];

  useEffect(() => {
    const newSynths = colors.map(() => {
      return new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
      }).toDestination();
    });
    setSynths(newSynths);

    const lines = scripture.text.split('\n').filter(line => line.trim());
    setPhrases(lines.slice(0, 4));

    return () => {
      newSynths.forEach(synth => synth.dispose());
    };
  }, [scripture]);

  const startGame = () => {
    setGameOver(false);
    setLevel(1);
    setScore(0);
    addToSequence([]);
  };

  const addToSequence = (currentSeq: number[]) => {
    const newNumber = Math.floor(Math.random() * 4);
    const newSequence = [...currentSeq, newNumber];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    setIsUserTurn(false);
    await Tone.start();

    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      playPhrase(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setIsPlaying(false);
    setIsUserTurn(true);
  };

  const playPhrase = (index: number) => {
    setActivePhrase(index);
    if (synths[index]) {
      synths[index].triggerAttackRelease(colors[index].note, '8n');
    }
    setTimeout(() => setActivePhrase(null), 300);
  };

  const handlePhraseClick = (index: number) => {
    if (!isUserTurn || isPlaying) return;

    playPhrase(index);
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      endGame(false);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      const newLevel = level + 1;
      const newScore = score + level * 10;
      setLevel(newLevel);
      setScore(newScore);

      if (newLevel > 8) {
        endGame(true);
        return;
      }

      setTimeout(() => {
        addToSequence(sequence);
      }, 1000);
    }
  };

  const endGame = (won: boolean) => {
    setGameOver(true);
    setIsUserTurn(false);
    const finalScore = won ? 100 : Math.min((score / 80) * 100, 95);
    setTimeout(() => {
      onComplete(finalScore);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Memory Sequence Game</h2>
        </div>
        <p className="text-blue-100 text-lg">
          Watch the phrase sequence, then repeat it back!
        </p>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center gap-8">
        <div className="bg-white/10 rounded-xl px-6 py-3 border border-white/20">
          <div className="text-blue-200 text-sm">Level</div>
          <div className="text-white text-2xl font-bold">{level}</div>
        </div>
        <div className="bg-white/10 rounded-xl px-6 py-3 border border-white/20">
          <div className="text-blue-200 text-sm">Score</div>
          <div className="text-white text-2xl font-bold">{score}</div>
        </div>
        <div className="bg-white/10 rounded-xl px-6 py-3 border border-white/20">
          <div className="text-blue-200 text-sm">Sequence Length</div>
          <div className="text-white text-2xl font-bold">{sequence.length}</div>
        </div>
      </div>

      {/* Status Message */}
      {!gameOver && sequence.length > 0 && (
        <div className={`text-center p-4 rounded-xl ${
          isPlaying
            ? 'bg-blue-500/20 border border-blue-500'
            : isUserTurn
            ? 'bg-green-500/20 border border-green-500'
            : 'bg-gray-500/20 border border-gray-500'
        }`}>
          <p className="text-white font-semibold text-lg">
            {isPlaying
              ? '👀 Watch the sequence...'
              : isUserTurn
              ? '🎯 Your turn! Repeat the sequence'
              : 'Get ready...'}
          </p>
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {phrases.map((phrase, index) => (
          <button
            key={index}
            onClick={() => handlePhraseClick(index)}
            disabled={!isUserTurn || isPlaying}
            className={`relative p-8 rounded-lg border-4 transition-all transform ${
              activePhrase === index
                ? `${colors[index].active} border-white scale-95 shadow-2xl`
                : `${colors[index].bg} ${colors[index].hover} border-white/30`
            } ${
              !isUserTurn || isPlaying
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 cursor-pointer'
            }`}
          >
            <div className="text-white text-center">
              <div className="text-4xl font-bold mb-2">{index + 1}</div>
              <div className="text-sm leading-tight">{phrase.substring(0, 30)}...</div>
            </div>
          </button>
        ))}
      </div>

      {/* Start/Play Again Button */}
      {(sequence.length === 0 || gameOver) && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6" />
              <span>{sequence.length === 0 ? 'Start Game' : 'Play Again'}</span>
            </div>
          </button>
        </div>
      )}

      {/* Game Over Message */}
      {gameOver && (
        <div className={`text-center p-8 rounded-lg border-2 ${
          level > 8
            ? 'bg-green-500/20 border-green-500'
            : 'bg-red-500/20 border-red-500'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            {level > 8 ? (
              <>
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span className="text-green-300 text-3xl font-bold">You Win!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400" />
                <span className="text-red-300 text-3xl font-bold">Game Over</span>
              </>
            )}
          </div>
          <p className="text-white text-xl mb-2">
            {level > 8
              ? 'Perfect memory! You completed all levels! 🏆'
              : `You reached level ${level} with ${score} points!`}
          </p>
          <p className="text-blue-200">
            You successfully remembered sequences up to {sequence.length} phrases!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-white font-bold mb-3">How to Play:</h3>
        <ol className="space-y-2 text-blue-100">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">1.</span>
            <span>Watch as the game highlights a sequence of Scripture phrases</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">2.</span>
            <span>Repeat the sequence by clicking the phrases in the same order</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">3.</span>
            <span>Each level adds one more phrase to remember</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">4.</span>
            <span>Complete level 8 to win!</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
