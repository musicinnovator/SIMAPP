import React, { useState } from 'react';
import { Shuffle, Play, Pause, Music, BookOpen, Check } from 'lucide-react';

interface CombinationSongsProps {
  lesson: any;
  scriptures: any[];
}

export function CombinationSongs({ lesson, scriptures }: CombinationSongsProps) {
  const [selectedSong, setSelectedSong] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedVerses, setCompletedVerses] = useState<boolean[]>([]);

  // Combination songs that weave together multiple Scripture passages
  const combinationSongs = [
    {
      title: "Medley of Trust",
      theme: "Trust and Faith",
      key: "D Major",
      tempo: "Andante",
      description: "A flowing medley combining passages about trusting in God",
      verses: [
        {
          text: "The Lord is my shepherd; I shall not want",
          reference: "Psalm 23:1",
          musicalNote: "Starts in D Major, gentle and reassuring"
        },
        {
          text: "Trust in the Lord with all thine heart",
          reference: "Proverbs 3:5",
          musicalNote: "Modulates to G Major, building confidence"
        },
        {
          text: "I will not be afraid of ten thousands of people",
          reference: "Psalm 3:6",
          musicalNote: "Strong rhythm in A Major, declaring boldness"
        },
        {
          text: "For thou, Lord, only makest me dwell in safety",
          reference: "Psalm 4:8",
          musicalNote: "Returns to D Major, peaceful resolution"
        }
      ]
    },
    {
      title: "Songs of Praise Compilation",
      theme: "Praise and Worship",
      key: "G Major",
      tempo: "Allegro",
      description: "An energetic compilation of praise passages from different books",
      verses: [
        {
          text: "O Lord our Lord, how excellent is thy name in all the earth!",
          reference: "Psalm 8:1",
          musicalNote: "Bright opening in G Major"
        },
        {
          text: "Praise ye the Lord. Praise God in his sanctuary",
          reference: "Psalm 150:1",
          musicalNote: "Building excitement in C Major"
        },
        {
          text: "Let every thing that hath breath praise the Lord",
          reference: "Psalm 150:6",
          musicalNote: "Climactic finish with full orchestration"
        },
        {
          text: "How great thou art! How great thou art!",
          reference: "How Great Thou Art",
          musicalNote: "Triumphant conclusion in G Major"
        }
      ]
    },
    {
      title: "Grace and Redemption Suite",
      theme: "Grace and Salvation",
      key: "F Major",
      tempo: "Moderato",
      description: "A contemplative suite exploring God's grace through multiple passages",
      verses: [
        {
          text: "Amazing grace! How sweet the sound that saved a wretch like me",
          reference: "Amazing Grace",
          musicalNote: "Gentle opening in F Major"
        },
        {
          text: "For God so loved the world, that he gave his only begotten Son",
          reference: "John 3:16",
          musicalNote: "Emotional peak in Bb Major"
        },
        {
          text: "When I survey the wondrous cross on which the Prince of glory died",
          reference: "When I Survey",
          musicalNote: "Reflective passage in D Minor"
        },
        {
          text: "I once was lost, but now am found; was blind, but now I see",
          reference: "Amazing Grace",
          musicalNote: "Joyful resolution back to F Major"
        }
      ]
    },
    {
      title: "Wisdom and Understanding Cycle",
      theme: "Wisdom",
      key: "E Major",
      tempo: "Andante",
      description: "A cyclical arrangement of wisdom passages that build upon each other",
      verses: [
        {
          text: "The fear of the Lord is the beginning of wisdom",
          reference: "Proverbs 9:10",
          musicalNote: "Reverent opening in E Major"
        },
        {
          text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend",
          reference: "Proverbs 27:17",
          musicalNote: "Rhythmic interplay in A Major"
        },
        {
          text: "In all thy ways acknowledge him, and he shall direct thy paths",
          reference: "Proverbs 3:6",
          musicalNote: "Flowing melody in B Major"
        },
        {
          text: "Be not wise in thine own eyes: fear the Lord, and depart from evil",
          reference: "Proverbs 3:7",
          musicalNote: "Returns to E Major with deeper understanding"
        }
      ]
    }
  ];

  const currentSong = combinationSongs[selectedSong];
  const currentSongVerse = currentSong.verses[currentVerse];

  const playVerse = () => {
    setIsPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(currentSongVerse.text);
    utterance.rate = 0.7;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const markVerseComplete = () => {
    const newCompleted = [...completedVerses];
    newCompleted[currentVerse] = true;
    setCompletedVerses(newCompleted);
    
    if (currentVerse < currentSong.verses.length - 1) {
      setTimeout(() => {
        setCurrentVerse(prev => prev + 1);
      }, 1000);
    }
  };

  const resetSong = () => {
    setCurrentVerse(0);
    setCompletedVerses([]);
    setIsPlaying(false);
    speechSynthesis.cancel();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-white">Combination Scripture Songs</h2>
        <p className="text-blue-100">Learn songs that weave together multiple Scripture passages</p>
      </div>

      {/* Song Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Choose a Combination Song</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {combinationSongs.map((song, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedSong(index);
                setCurrentVerse(0);
                setCompletedVerses([]);
                speechSynthesis.cancel();
                setIsPlaying(false);
              }}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selectedSong === index
                  ? 'bg-yellow-500/30 border-2 border-yellow-500 text-white'
                  : 'bg-white/5 border border-white/20 text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <h4 className="font-bold mb-2">{song.title}</h4>
              <p className="text-sm opacity-75 mb-2">{song.description}</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded">{song.key}</span>
                <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded">{song.tempo}</span>
                <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded">{song.verses.length} verses</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Song Display */}
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-md border-l-4 border-purple-500 p-6 border border-purple-500/30">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">{currentSong.title}</h3>
            <p className="text-purple-100">{currentSong.description}</p>
            
            <div className="flex items-center justify-center space-x-4">
              <span className="bg-blue-500/30 text-blue-100 px-3 py-1 text-sm">
                {currentSong.key}
              </span>
              <span className="bg-purple-500/30 text-purple-100 px-3 py-1 text-sm">
                {currentSong.tempo}
              </span>
              <span className="bg-green-500/30 text-green-100 px-3 py-1 text-sm">
                {currentSong.theme}
              </span>
            </div>
          </div>
        </div>

        {/* Verse Progress */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4">Song Structure</h4>
          <div className="space-y-3">
            {currentSong.verses.map((verse, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  index === currentVerse
                    ? 'bg-yellow-500/20 border-yellow-500/30 scale-105'
                    : completedVerses[index]
                      ? 'bg-green-500/20 border-green-500/30'
                      : 'bg-white/5 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium">"{verse.text}"</p>
                    <p className="text-blue-200 text-sm mt-1">{verse.reference}</p>
                    <p className="text-purple-200 text-xs mt-1 italic">{verse.musicalNote}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {completedVerses[index] && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                    {index === currentVerse && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Verse Player */}
        <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-6 border border-blue-500/30">
          <div className="text-center space-y-4">
            <h4 className="text-xl font-bold text-white">
              Verse {currentVerse + 1}: {currentSongVerse.reference}
            </h4>
            
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-2xl text-white font-medium leading-relaxed">
                "{currentSongVerse.text}"
              </p>
            </div>
            
            <p className="text-blue-200 italic">{currentSongVerse.musicalNote}</p>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={isPlaying ? () => speechSynthesis.cancel() : playVerse}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
                    : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Stop' : 'Play'} Verse</span>
              </button>

              <button
                onClick={markVerseComplete}
                disabled={completedVerses[currentVerse]}
                className="bg-accent-50 text-yellow-900 px-6 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Learned
              </button>
            </div>
          </div>
        </div>

        {/* Navigation and Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentVerse(Math.max(0, currentVerse - 1))}
            disabled={currentVerse === 0}
            className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Verse
          </button>

          <div className="text-center">
            <p className="text-white font-medium">
              {completedVerses.filter(Boolean).length} of {currentSong.verses.length} verses learned
            </p>
            <div className="flex space-x-1 mt-2">
              {currentSong.verses.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    completedVerses[index] ? 'bg-green-500' : 
                    index === currentVerse ? 'bg-yellow-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentVerse(Math.min(currentSong.verses.length - 1, currentVerse + 1))}
            disabled={currentVerse === currentSong.verses.length - 1}
            className="bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Verse
          </button>
        </div>

        {/* Song Complete */}
        {completedVerses.filter(Boolean).length === currentSong.verses.length && (
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30 text-center">
            <Music className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-300 mb-2">Song Complete!</h3>
            <p className="text-green-100 mb-4">
              You've learned all verses of "{currentSong.title}"
            </p>
            
            <button
              onClick={resetSong}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Practice Again
            </button>
          </div>
        )}

        {/* Musical Concept Explanation */}
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
          <h4 className="text-blue-300 font-bold mb-2">Musical Concept: "Here a Little, There a Little"</h4>
          <p className="text-blue-100 text-sm">
            This principle from Isaiah 28:10 shows how combining related Scripture passages creates 
            a richer understanding. In music, this technique is called a "medley" - weaving together 
            different melodies that share a common theme to create a more complete musical experience.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
          <h4 className="text-yellow-300 font-bold mb-2">How to Learn Combination Songs</h4>
          <ol className="text-yellow-100 text-sm space-y-1">
            <li>1. Listen to each verse and notice how they connect thematically</li>
            <li>2. Pay attention to the musical transitions between passages</li>
            <li>3. Practice each verse until comfortable, then try singing them together</li>
            <li>4. Notice how the combined passages create a fuller picture of the theme</li>
          </ol>
        </div>
      </div>
    </div>
  );
}