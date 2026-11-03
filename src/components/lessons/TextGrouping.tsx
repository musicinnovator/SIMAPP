import React, { useState } from 'react';
import { Target, Check, X, RefreshCw } from 'lucide-react';

interface TextGroupingProps {
  lesson: any;
  scriptures: any[];
}

export function TextGrouping({ lesson, scriptures }: TextGroupingProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [groups, setGroups] = useState<{[key: string]: string[]}>({
    praise: [],
    trust: [],
    comfort: [],
    wisdom: []
  });
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{[key: string]: 'correct' | 'incorrect'}>({});

  const scriptureFragments = [
    { text: "Praise ye the Lord", theme: "praise", reference: "Psalm 150:1" },
    { text: "The Lord is my shepherd", theme: "trust", reference: "Psalm 23:1" },
    { text: "He restoreth my soul", theme: "comfort", reference: "Psalm 23:3" },
    { text: "Trust in the Lord with all thine heart", theme: "trust", reference: "Proverbs 3:5" },
    { text: "Sing praises to the Lord", theme: "praise", reference: "Psalm 9:11" },
    { text: "He leadeth me beside still waters", theme: "comfort", reference: "Psalm 23:2" },
    { text: "The fear of the Lord is the beginning of wisdom", theme: "wisdom", reference: "Proverbs 9:10" },
    { text: "O Lord our Lord, how excellent is thy name", theme: "praise", reference: "Psalm 8:1" },
    { text: "In all thy ways acknowledge him", theme: "wisdom", reference: "Proverbs 3:6" },
    { text: "Thou preparest a table before me", theme: "comfort", reference: "Psalm 23:5" },
    { text: "I will not be afraid", theme: "trust", reference: "Psalm 3:6" },
    { text: "Let every thing that hath breath praise the Lord", theme: "praise", reference: "Psalm 150:6" }
  ];

  const groupThemes = {
    praise: { name: 'Praise & Worship', color: 'bg-yellow-500/20 border-yellow-500/30', textColor: 'text-yellow-300' },
    trust: { name: 'Trust & Faith', color: 'bg-blue-500/20 border-blue-500/30', textColor: 'text-blue-300' },
    comfort: { name: 'Comfort & Peace', color: 'bg-green-500/20 border-green-500/30', textColor: 'text-green-300' },
    wisdom: { name: 'Wisdom & Understanding', color: 'bg-purple-500/20 border-purple-500/30', textColor: 'text-purple-300' }
  };

  const handleDragStart = (text: string) => {
    setDraggedItem(text);
  };

  const handleDrop = (groupKey: string) => {
    if (!draggedItem) return;

    const fragment = scriptureFragments.find(f => f.text === draggedItem);
    if (!fragment) return;

    setAttempts(prev => prev + 1);
    
    if (fragment.theme === groupKey) {
      setGroups(prev => ({
        ...prev,
        [groupKey]: [...prev[groupKey], draggedItem]
      }));
      setScore(prev => prev + 1);
      setFeedback(prev => ({ ...prev, [draggedItem]: 'correct' }));
    } else {
      setFeedback(prev => ({ ...prev, [draggedItem]: 'incorrect' }));
      setTimeout(() => {
        setFeedback(prev => {
          const newFeedback = { ...prev };
          delete newFeedback[draggedItem!];
          return newFeedback;
        });
      }, 2000);
    }
    
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetGame = () => {
    setGroups({ praise: [], trust: [], comfort: [], wisdom: [] });
    setScore(0);
    setAttempts(0);
    setFeedback({});
    setDraggedItem(null);
  };

  const ungroupedFragments = scriptureFragments.filter(fragment => 
    !Object.values(groups).flat().includes(fragment.text) && 
    !feedback[fragment.text]
  );

  const isComplete = ungroupedFragments.length === 0 && Object.keys(feedback).length === 0;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Scripture Text Grouping</h2>
        <p className="text-blue-100">Drag Scripture fragments to their correct thematic groups</p>
        
        <div className="flex justify-center space-x-6 text-sm">
          <span className="text-green-300">Correct: {score}</span>
          <span className="text-red-300">Attempts: {attempts}</span>
          <span className="text-yellow-300">Accuracy: {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</span>
        </div>
      </div>

      {!isComplete ? (
        <div className="space-y-8">
          {/* Ungrouped Fragments */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Scripture Fragments</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ungroupedFragments.map((fragment, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(fragment.text)}
                  className={`p-3 rounded-lg cursor-move transition-all duration-200 border-2 ${
                    feedback[fragment.text] === 'incorrect'
                      ? 'bg-red-500/20 border-red-500 text-red-200 animate-pulse'
                      : draggedItem === fragment.text
                        ? 'bg-yellow-500/30 border-yellow-500 text-white scale-105'
                        : 'bg-white/10 border-white/20 text-blue-100 hover:bg-white/20 hover:text-white hover:scale-105'
                  }`}
                >
                  <p className="font-medium text-sm">{fragment.text}</p>
                  <p className="text-xs opacity-75 mt-1">{fragment.reference}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Groups */}
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(groupThemes).map(([key, theme]) => (
              <div
                key={key}
                onDrop={() => handleDrop(key)}
                onDragOver={handleDragOver}
                className={`rounded-xl p-6 border-2 border-dashed transition-all duration-200 min-h-48 ${theme.color} ${
                  draggedItem ? 'border-solid scale-105' : ''
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${theme.textColor}`}>{theme.name}</h3>
                <div className="space-y-2">
                  {groups[key].map((text, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <p className="text-white text-sm font-medium">{text}</p>
                      <Check className="w-4 h-4 text-green-400 mt-1" />
                    </div>
                  ))}
                  {groups[key].length === 0 && (
                    <p className="text-center text-white/50 py-8">Drop fragments here</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-white/10 backdrop-blur-md border-l-4 border-green-500 p-8 border border-green-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">Perfect Grouping!</h3>
            <div className="text-6xl font-bold text-green-400 mb-2">{Math.round((score / attempts) * 100)}%</div>
            <p className="text-xl text-green-100">
              You correctly grouped {score} out of {scriptureFragments.length} fragments
            </p>
          </div>

          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
        <h4 className="text-blue-300 font-bold mb-2">Instructions</h4>
        <p className="text-blue-100 text-sm">
          Drag each Scripture fragment to the group that best matches its theme. 
          Think about the main message and emotional tone of each passage.
        </p>
      </div>
    </div>
  );
}