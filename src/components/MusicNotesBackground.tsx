import React from 'react';

const MusicNotesBackground: React.FC = () => {
  // Generate random positions for floating notes
  const floatingNotes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() * 0.5 + 0.5,
    color: ['#c0c0c0', '#a8a8a8', '#888888'][Math.floor(Math.random() * 3)]
  }));

  // Generate static translucent notes
  const staticNotes = Array.from({ length: 15 }, (_, i) => ({
    id: i + 20,
    left: Math.random() * 100,
    top: Math.random() * 100,
    rotation: Math.random() * 360,
    size: Math.random() * 0.4 + 0.3,
    color: ['#c0c0c0', '#a8a8a8', '#888888'][Math.floor(Math.random() * 3)]
  }));

  // Generate blinking notes
  const blinkingNotes = Array.from({ length: 12 }, (_, i) => ({
    id: i + 35,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 0.3 + 0.2,
    color: ['#c0c0c0', '#a8a8a8', '#888888'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Musical staff lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={`staff-${i}`}
            className="absolute w-full h-px bg-silver-400 opacity-10"
            style={{ top: `${20 + i * 15}%` }}
          />
        ))}
      </div>

      {/* Floating notes */}
      {floatingNotes.map((note) => (
        <div
          key={`floating-${note.id}`}
          className="absolute animate-float opacity-20"
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            animationDelay: `${note.delay}s`,
            transform: `scale(${note.size})`,
            color: note.color
          }}
        >
          ♪
        </div>
      ))}

      {/* Static translucent notes */}
      {staticNotes.map((note) => (
        <div
          key={`static-${note.id}`}
          className="absolute opacity-20"
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            transform: `scale(${note.size}) rotate(${note.rotation}deg)`,
            color: note.color
          }}
        >
          ♫
        </div>
      ))}

      {/* Blinking notes */}
      {blinkingNotes.map((note) => (
        <div
          key={`blinking-${note.id}`}
          className="absolute animate-ping opacity-30"
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            transform: `scale(${note.size})`,
            color: note.color
          }}
        >
          ♬
        </div>
      ))}

      {/* Large treble clef */}
      <div className="absolute top-1/4 right-1/4 text-6xl opacity-10 text-silver-400 animate-pulse">
        𝄞
      </div>
    </div>
  );
};

export default MusicNotesBackground;