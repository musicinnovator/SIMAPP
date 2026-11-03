import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Check, X, RefreshCw, Music } from 'lucide-react';

interface FillInBlankQuizProps {
  lesson: any;
  scriptures: any[];
}

export function FillInBlankQuiz({ lesson, scriptures }: FillInBlankQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  // Sample fill-in-the-blank questions with audio cues
  const questions = [
    {
      text: "Amazing ___! How sweet the sound that saved a wretch like me!",
      answer: "grace",
      audioText: "Amazing grace! How sweet the sound",
      reference: "Based on Ephesians 2:8",
      theme: "Grace"
    },
    {
      text: "The Lord is my ___; I shall not want.",
      answer: "shepherd",
      audioText: "The Lord is my shepherd",
      reference: "Psalm 23:1",
      theme: "Trust"
    },
    {
      text: "Blessed are the ___ in spirit: for theirs is the kingdom of heaven.",
      answer: "poor",
      audioText: "Blessed are the poor in spirit",
      reference: "Matthew 5:3",
      theme: "Blessing"
    },
    {
      text: "Trust in the Lord with all thine ___; and lean not unto thine own understanding.",
      answer: "heart",
      audioText: "Trust in the Lord with all thine heart",
      reference: "Proverbs 3:5",
      theme: "Trust"
    },
    {
      text: "How ___ thou art! How ___ thou art!",
      answer: "great",
      audioText: "How great thou art! How great thou art!",
      reference: "Based on Psalm 8:1",
      theme: "Praise"
    }
  ];

  const currentQ = questions[currentQuestion];

  // Simulate audio playback with speech synthesis
  const playAudio = () => {
    if (!currentQ) return;

    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(currentQ.audioText);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const checkAnswer = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase();
    setAnswers(prev => [...prev, isCorrect]);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setGameComplete(false);
    stopAudio();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim()) {
      checkAnswer();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Fill in the Blank Audio Quiz</h2>
        <p className="text-blue-100">Listen to the sung Scripture and fill in the missing words</p>
        
        <div className="flex justify-center space-x-6 text-sm">
          <span className="text-blue-300">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-green-300">Score: {score}/{questions.length}</span>
        </div>
      </div>

      {!gameComplete ? (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-success-50 h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Audio Player */}
          <div className="bg-white/10 backdrop-blur-md border-l-4 border-purple-500 p-6 border border-purple-500/30">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Listen to the Audio</h3>
              <p className="text-purple-200">"{currentQ.audioText}"</p>
              
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isPlaying ? stopAudio : playAudio}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isPlaying
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                      : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isPlaying ? 'Stop' : 'Play Audio'}</span>
                </button>
              </div>

              {/* Audio Visualizer */}
              {isPlaying && (
                <div className="flex items-end justify-center space-x-1 h-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-purple-500 to-pink-400 w-2 rounded-full audio-bar"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium ${
                  currentQ.theme === 'Grace' ? 'bg-yellow-500/30 text-yellow-100' :
                  currentQ.theme === 'Trust' ? 'bg-blue-500/30 text-blue-100' :
                  currentQ.theme === 'Praise' ? 'bg-green-500/30 text-green-100' :
                  currentQ.theme === 'Devotion' ? 'bg-purple-500/30 text-purple-100' :
                  'bg-red-500/30 text-red-100'
                }`}>
                  {currentQ.theme}
                </span>
                <span className="text-blue-300 text-sm">{currentQ.reference}</span>
              </div>
              
              <p className="text-2xl text-white font-medium leading-relaxed">
                {currentQ.text}
              </p>
              
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  autoFocus
                  disabled={showResult}
                />
                <button
                  type="submit"
                  disabled={!userAnswer.trim() || showResult}
                  className="bg-accent-50 text-yellow-900 px-6 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* Result Display */}
          {showResult && (
            <div className={`rounded-xl p-6 border ${
              answers[answers.length - 1]
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-red-500/20 border-red-500/30'
            }`}>
              <div className="flex items-center space-x-3">
                {answers[answers.length - 1] ? (
                  <Check className="w-6 h-6 text-green-400" />
                ) : (
                  <X className="w-6 h-6 text-red-400" />
                )}
                <div>
                  <p className={`font-bold ${
                    answers[answers.length - 1] ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {answers[answers.length - 1] ? 'Correct!' : 'Incorrect'}
                  </p>
                  {!answers[answers.length - 1] && (
                    <p className="text-white">The correct answer is: <strong>{currentQ.answer}</strong></p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-8 border border-green-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
            <div className="text-6xl font-bold text-green-400 mb-2">{Math.round((score / questions.length) * 100)}%</div>
            <p className="text-xl text-green-100">
              You got {score} out of {questions.length} questions correct
            </p>
          </div>

          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}