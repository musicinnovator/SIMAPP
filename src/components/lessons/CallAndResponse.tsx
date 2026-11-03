import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, Check, X, RefreshCw } from 'lucide-react';

interface CallAndResponseProps {
  lesson: any;
  scriptures: any[];
}

export function CallAndResponse({ lesson, scriptures }: CallAndResponseProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const recognitionRef = useRef<any>(null);

  // Call and response phrases from selected scriptures
  const phrases = [
    {
      call: "The Lord is my shepherd",
      response: "I shall not want",
      reference: "Psalm 23:1",
      theme: "Trust"
    },
    {
      call: "Blessed are the poor in spirit",
      response: "for theirs is the kingdom of heaven",
      reference: "Matthew 5:3",
      theme: "Blessing"
    },
    {
      call: "Trust in the Lord with all thine heart",
      response: "and lean not unto thine own understanding",
      reference: "Proverbs 3:5",
      theme: "Wisdom"
    },
    {
      call: "Amazing grace! How sweet the sound",
      response: "that saved a wretch like me",
      reference: "Amazing Grace (Ephesians 2:8)",
      theme: "Grace"
    },
    {
      call: "How great thou art",
      response: "How great thou art",
      reference: "How Great Thou Art (Psalm 8:1)",
      theme: "Praise"
    },
    {
      call: "Be thou my vision",
      response: "O Lord of my heart",
      reference: "Be Thou My Vision (Colossians 3:2)",
      theme: "Devotion"
    }
  ];

  const currentP = phrases[currentPhrase];

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setUserResponse(transcript);
        checkResponse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const playCall = () => {
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(currentP.call);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      setIsListening(true);
      setUserResponse('');
      setFeedback(null);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const checkResponse = (response: string) => {
    const expectedResponse = currentP.response.toLowerCase().replace(/[.,;:!?]/g, '');
    const userResponseClean = response.toLowerCase().replace(/[.,;:!?]/g, '');
    
    setAttempts(prev => prev + 1);
    
    // Check for substantial match (at least 70% of words correct)
    const expectedWords = expectedResponse.split(' ');
    const userWords = userResponseClean.split(' ');
    const matchingWords = expectedWords.filter(word => 
      userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
    );
    
    const accuracy = matchingWords.length / expectedWords.length;
    
    if (accuracy >= 0.7) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        if (currentPhrase < phrases.length - 1) {
          setCurrentPhrase(prev => prev + 1);
          setFeedback(null);
          setUserResponse('');
        }
      }, 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setUserResponse('');
      }, 3000);
    }
  };

  const nextPhrase = () => {
    if (currentPhrase < phrases.length - 1) {
      setCurrentPhrase(prev => prev + 1);
      setFeedback(null);
      setUserResponse('');
    }
  };

  const resetActivity = () => {
    setCurrentPhrase(0);
    setScore(0);
    setAttempts(0);
    setFeedback(null);
    setUserResponse('');
    stopListening();
    speechSynthesis.cancel();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Call and Response Learning</h2>
        <p className="text-blue-100">Listen to the call, then respond with the next phrase</p>
        
        <div className="flex justify-center space-x-6 text-sm">
          <span className="text-blue-300">Phrase {currentPhrase + 1} of {phrases.length}</span>
          <span className="text-green-300">Score: {score}/{attempts}</span>
          <span className="text-yellow-300">Accuracy: {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-8">
        <div 
          className="bg-success-50 h-full transition-all duration-500"
          style={{ width: `${((currentPhrase + 1) / phrases.length) * 100}%` }}
        />
      </div>

      <div className="space-y-8">
        {/* Current Phrase Display */}
        <div className="bg-white/10 backdrop-blur-md border-l-4 border-blue-500 p-6 border border-blue-500/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium ${
                currentP.theme === 'Trust' ? 'bg-blue-500/30 text-blue-100' :
                currentP.theme === 'Blessing' ? 'bg-green-500/30 text-green-100' :
                currentP.theme === 'Wisdom' ? 'bg-purple-500/30 text-purple-100' :
                currentP.theme === 'Grace' ? 'bg-yellow-500/30 text-yellow-100' :
                currentP.theme === 'Praise' ? 'bg-orange-500/30 text-orange-100' :
                'bg-pink-500/30 text-pink-100'
              }`}>
                {currentP.theme}
              </span>
              <span className="text-blue-300 text-sm">{currentP.reference}</span>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-lg font-bold text-yellow-300 mb-2">Call (Listen)</h4>
                <p className="text-2xl text-white font-medium">"{currentP.call}"</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-300 mb-2">Response (You Sing/Say)</h4>
                <p className="text-2xl text-white font-medium">"{currentP.response}"</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={isPlaying ? () => speechSynthesis.cancel() : playCall}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Stop' : 'Play'} Call</span>
              </button>

              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                    : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isListening ? 'Stop' : 'Start'} Response</span>
              </button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-200 font-medium">Listening for your response...</span>
                </div>
              </div>
            )}

            {/* User Response Display */}
            {userResponse && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-bold mb-2">You said:</h4>
                <p className="text-blue-100">"{userResponse}"</p>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`rounded-lg p-4 border ${
                feedback === 'correct'
                  ? 'bg-green-500/20 border-green-500/30'
                  : 'bg-red-500/20 border-red-500/30'
              }`}>
                <div className="flex items-center justify-center space-x-3">
                  {feedback === 'correct' ? (
                    <>
                      <Check className="w-6 h-6 text-green-400" />
                      <span className="text-green-300 font-bold text-lg">Excellent!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-6 h-6 text-red-400" />
                      <div className="text-center">
                        <span className="text-red-300 font-bold text-lg block">Try again!</span>
                        <span className="text-red-200 text-sm">Expected: "{currentP.response}"</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPhrase(Math.max(0, currentPhrase - 1))}
            disabled={currentPhrase === 0}
            className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={resetActivity}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-400 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Reset Activity
          </button>

          <button
            onClick={nextPhrase}
            disabled={currentPhrase === phrases.length - 1}
            className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
          <h4 className="text-yellow-300 font-bold mb-2">How to Play</h4>
          <ol className="text-yellow-100 text-sm space-y-1">
            <li>1. Click "Play Call" to hear the first part of the verse</li>
            <li>2. Click "Start Response" and speak or sing the response</li>
            <li>3. The system will listen and provide feedback</li>
            <li>4. Practice until you can respond confidently</li>
          </ol>
        </div>
      </div>
    </div>
  );
}