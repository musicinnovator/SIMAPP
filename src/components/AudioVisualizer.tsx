import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  currentTime?: number;
  barCount?: number;
}

export function AudioVisualizer({ isPlaying, currentTime = 0, barCount = 8 }: AudioVisualizerProps) {
  if (!isPlaying) {
    return (
      <div className="flex items-end justify-center space-x-1 h-12">
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-yellow-500/30 to-yellow-300/30 w-2 rounded-full h-3"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center space-x-1 h-12">
      {Array.from({ length: barCount }).map((_, i) => {
        // Create dynamic heights based on time and bar index for rhythmic effect
        const timeOffset = currentTime + (i * 0.2);
        const baseHeight = 30 + Math.sin(timeOffset * 4) * 20; // Main rhythm
        const variation = Math.sin(timeOffset * 6 + i * 0.5) * 15; // Individual bar variation
        const accent = Math.sin(timeOffset * 1) * 10; // Slower accent wave
        const height = Math.max(15, baseHeight + variation + accent);
        
        return (
          <div
            key={i}
            className="bg-gradient-to-t from-yellow-500 to-yellow-300 w-2 rounded-full transition-all duration-75"
            style={{ 
              height: `${height}%`,
              opacity: 0.7 + Math.sin(timeOffset * 2) * 0.3
            }}
          />
        );
      })}
    </div>
  );
}

// Default export for backward compatibility
export default AudioVisualizer;