import React from 'react';

export function InstrumentGraphics() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Piano Keys */}
      <div className="absolute bottom-0 right-0 opacity-10 transform rotate-12 hidden xl:block">
        <div className="flex">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-8 h-24 bg-white border border-gray-300" />
          ))}
        </div>
      </div>

      {/* Guitar Silhouette */}
      <div className="absolute top-20 left-0 opacity-5 transform -rotate-12 hidden lg:block">
        <svg width="80" height="200" viewBox="0 0 80 200" className="text-white">
          <ellipse cx="40" cy="60" rx="30" ry="40" fill="currentColor" />
          <rect x="35" y="100" width="10" height="80" fill="currentColor" />
          <circle cx="40" cy="30" r="8" fill="currentColor" />
        </svg>
      </div>

      {/* Harp Strings */}
      <div className="absolute top-1/2 right-1/4 opacity-5 hidden lg:block">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-32 bg-white"
            style={{ 
              left: `${i * 4}px`,
              transform: `rotate(${15 + i * 2}deg)`,
              transformOrigin: 'bottom'
            }}
          />
        ))}
      </div>
    </div>
  );
}