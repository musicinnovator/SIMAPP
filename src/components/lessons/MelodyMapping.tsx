import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Music, Play, Pause } from 'lucide-react';

interface MelodyMappingProps {
  lesson: any;
  scriptures: any[];
}

export function MelodyMapping({ lesson, scriptures }: MelodyMappingProps) {
  const [selectedExample, setSelectedExample] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const melodyExamples = [
    {
      title: "Ascending Joy - 'Rejoice and be exceeding glad'",
      scripture: "Matthew 5:12",
      text: "Rejoice, and be exceeding glad: for great is your reward in heaven",
      melodyDirection: "ascending",
      emotion: "Joy and Celebration",
      musicalPattern: "C - D - E - F - G - A - B - C",
      explanation: "The melody rises with each word, mirroring the upward emotion of joy and the promise of heavenly reward.",
      visualPattern: [20, 30, 40, 50, 60, 70, 80, 90]
    },
    {
      title: "Descending Humility - 'Blessed are the meek'",
      scripture: "Matthew 5:5",
      text: "Blessed are the meek: for they shall inherit the earth",
      melodyDirection: "descending",
      emotion: "Humility and Gentleness",
      musicalPattern: "G - F - E - D - C",
      explanation: "The descending melody reflects the humble, lowly nature of meekness, yet ends with the promise of inheritance.",
      visualPattern: [80, 70, 60, 50, 40]
    },
    {
      title: "Stable Trust - 'The Lord is my shepherd'",
      scripture: "Psalm 23:1",
      text: "The Lord is my shepherd; I shall not want",
      melodyDirection: "stable",
      emotion: "Security and Trust",
      musicalPattern: "C - C - D - C - C - D - C",
      explanation: "The melody remains centered around the tonic, reflecting the stability and security found in God's care.",
      visualPattern: [50, 50, 60, 50, 50, 60, 50]
    },
    {
      title: "Rising Hope - 'Mount up with wings as eagles'",
      scripture: "Isaiah 40:31",
      text: "They shall mount up with wings as eagles",
      melodyDirection: "ascending",
      emotion: "Hope and Strength",
      musicalPattern: "D - F - A - C - E - G",
      explanation: "The soaring melody mirrors the image of eagles rising, representing renewed strength and hope.",
      visualPattern: [30, 45, 60, 75, 85, 95]
    },
    {
      title: "Gentle Comfort - 'He leadeth me beside still waters'",
      scripture: "Psalm 23:2",
      text: "He leadeth me beside the still waters",
      melodyDirection: "gentle waves",
      emotion: "Peace and Comfort",
      musicalPattern: "E - D - E - F - E - D - C",
      explanation: "The gentle, flowing melody mimics still waters, creating a sense of peace and divine comfort.",
      visualPattern: [60, 50, 60, 70, 60, 50, 40]
    }
  ];

  const currentExample = melodyExamples[selectedExample];

  const playMelodyExample = () => {
    setIsPlaying(true);
    
    // Use speech synthesis to demonstrate the melodic pattern
    const utterance = new SpeechSynthesisUtterance(currentExample.text);
    utterance.rate = 0.6;
    utterance.pitch = 1.3;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const stopMelody = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const renderMelodyVisualization = () => {
    return (
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="text-white font-bold mb-4 text-center">Melody Visualization</h4>
        
        {/* Musical Staff Lines */}
        <div className="relative h-32 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-white/30"
              style={{ top: `${20 + i * 20}px` }}
            />
          ))}
          
          {/* Melody Points */}
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {currentExample.visualPattern.map((height, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center"
              >
                <div
                  className="w-4 h-4 bg-yellow-600 rounded-full shadow-lg transition-all duration-500"
                  style={{ 
                    transform: `translateY(-${height}px)`,
                    animationDelay: `${index * 0.2}s`
                  }}
                />
                <div className="text-xs text-blue-200 mt-2">
                  {currentExample.musicalPattern.split(' - ')[index]}
                </div>
              </div>
            ))}
          </div>
          
          {/* Connecting Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M ${currentExample.visualPattern.map((height, index) => 
                `${(index / (currentExample.visualPattern.length - 1)) * 100}% ${100 - height}%`
              ).join(' L ')}`}
              stroke="url(#melodyGradient)"
              strokeWidth="3"
              fill="none"
              className="opacity-70"
            />
            <defs>
              <linearGradient id="melodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Direction Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {currentExample.melodyDirection === 'ascending' && (
            <>
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-medium">Ascending Melody</span>
            </>
          )}
          {currentExample.melodyDirection === 'descending' && (
            <>
              <TrendingDown className="w-6 h-6 text-blue-400" />
              <span className="text-blue-300 font-medium">Descending Melody</span>
            </>
          )}
          {currentExample.melodyDirection === 'stable' && (
            <>
              <div className="w-6 h-1 bg-yellow-400 rounded" />
              <span className="text-yellow-300 font-medium">Stable Melody</span>
            </>
          )}
          {currentExample.melodyDirection === 'gentle waves' && (
            <>
              <div className="w-6 h-6 text-cyan-400">〜</div>
              <span className="text-cyan-300 font-medium">Gentle Waves</span>
            </>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={isPlaying ? stopMelody : playMelodyExample}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlaying ? 'Stop' : 'Play'} Example</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Melody Mapping</h2>
        <p className="text-blue-100">Discover how melody mirrors the emotional tones of Scripture</p>
      </div>

      {/* Example Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Choose an Example</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {melodyExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => setSelectedExample(index)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selectedExample === index
                  ? 'bg-yellow-500/30 border-2 border-yellow-500 text-white'
                  : 'bg-white/5 border border-white/20 text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <h4 className="font-bold mb-2">{example.title}</h4>
              <p className="text-sm opacity-75">{example.emotion}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Example Display */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">{currentExample.title}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-blue-300 mb-2">Scripture Text</h4>
              <p className="text-white text-lg leading-relaxed mb-4">"{currentExample.text}"</p>
              <p className="text-blue-200 text-sm">— {currentExample.scripture}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-purple-300 mb-2">Musical Analysis</h4>
              <p className="text-white mb-2"><strong>Emotion:</strong> {currentExample.emotion}</p>
              <p className="text-white mb-2"><strong>Pattern:</strong> {currentExample.musicalPattern}</p>
              <p className="text-purple-100 text-sm">{currentExample.explanation}</p>
            </div>
          </div>
        </div>

        {renderMelodyVisualization()}
      </div>
    </div>
  );
}