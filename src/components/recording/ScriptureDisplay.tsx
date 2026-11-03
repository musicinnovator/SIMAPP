import React, { useEffect, useRef, useState } from 'react';
import { Type, ZoomIn, ZoomOut, Moon, Sun } from 'lucide-react';

interface ScriptureDisplayProps {
  text: string;
  autoScroll?: boolean;
  scrollSpeed?: number;
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
  highlightEnabled?: boolean;
  currentPosition?: number;
}

export function ScriptureDisplay({
  text,
  autoScroll = false,
  scrollSpeed = 1,
  fontSize = 'medium',
  highlightEnabled = false,
  currentPosition = 0
}: ScriptureDisplayProps) {
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [darkMode, setDarkMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);

  const fontSizeMap = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  useEffect(() => {
    if (isAutoScrolling && scrollRef.current) {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += scrollSpeed;
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAutoScrolling, scrollSpeed]);

  const increaseFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(localFontSize);
    if (currentIndex < sizes.length - 1) {
      setLocalFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(localFontSize);
    if (currentIndex > 0) {
      setLocalFontSize(sizes[currentIndex - 1]);
    }
  };

  const words = text.split(' ');
  const highlightIndex = Math.floor((currentPosition / 100) * words.length);

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between p-4 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Type className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Scripture Text
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={decreaseFontSize}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
            title="Decrease font size"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={increaseFontSize}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
            title="Increase font size"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
            title="Toggle dark/light mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAutoScrolling
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            {isAutoScrolling ? 'Stop Scroll' : 'Auto Scroll'}
          </button>
        </div>
      </div>

      {/* Text Content */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-8 ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className={`${fontSizeMap[localFontSize]} leading-relaxed ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {highlightEnabled ? (
            <p>
              {words.map((word, index) => (
                <span
                  key={index}
                  className={index === highlightIndex ? 'bg-yellow-400 text-gray-900 px-1 rounded' : ''}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          ) : (
            <p className="whitespace-pre-wrap">{text}</p>
          )}
        </div>
      </div>

      {/* Reading Progress Indicator */}
      {highlightEnabled && (
        <div className={`h-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${currentPosition}%` }}
          />
        </div>
      )}
    </div>
  );
}
