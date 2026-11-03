import React, { useState } from 'react';
import { Book, Music, Target, Users, Clock, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { contentStrategy } from '../data/scriptures';

export function ContentStrategy() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['focus']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Content Strategy</h1>
        <p className="text-xl text-blue-100">Our roadmap for building a comprehensive Scripture learning platform</p>
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 inline-block">
          <span className="text-yellow-300 font-bold">Version {contentStrategy.version}</span>
        </div>
      </div>

      {/* Initial Content Focus */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('focus')}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">{contentStrategy.initialContentFocus.title}</h2>
          </div>
          {isExpanded('focus') ? 
            <ChevronDown className="w-6 h-6 text-blue-200" /> : 
            <ChevronRight className="w-6 h-6 text-blue-200" />
          }
        </button>
        
        {isExpanded('focus') && (
          <div className="px-6 pb-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                <h3 className="font-bold text-blue-300 mb-3 flex items-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span>Scriptures</span>
                </h3>
                <ul className="space-y-2 text-blue-100 text-sm">
                  {contentStrategy.initialContentFocus.scriptures.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                <h3 className="font-bold text-purple-300 mb-3 flex items-center space-x-2">
                  <Music className="w-5 h-5" />
                  <span>Songs</span>
                </h3>
                <ul className="space-y-2 text-purple-100 text-sm">
                  {contentStrategy.initialContentFocus.songs.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                <h3 className="font-bold text-green-300 mb-3 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Lessons</span>
                </h3>
                <ul className="space-y-2 text-green-100 text-sm">
                  {contentStrategy.initialContentFocus.lessons.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Lesson Ideas */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('lessons')}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Interactive Lesson Ideas</h2>
          </div>
          {isExpanded('lessons') ? 
            <ChevronDown className="w-6 h-6 text-blue-200" /> : 
            <ChevronRight className="w-6 h-6 text-blue-200" />
          }
        </button>
        
        {isExpanded('lessons') && (
          <div className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-4">
              {contentStrategy.interactiveLessonIdeas.map((lesson, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white">{lesson.name}</h3>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        lesson.difficulty === 'Beginner' ? 'bg-green-500/30 text-green-200' :
                        lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/30 text-yellow-200' :
                        'bg-red-500/30 text-red-200'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-2">{lesson.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-blue-300">
                    <Clock className="w-3 h-3" />
                    <span>{lesson.estimatedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scripture Memorization Tools */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('tools')}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Scripture Memorization Tools</h2>
          </div>
          {isExpanded('tools') ? 
            <ChevronDown className="w-6 h-6 text-blue-200" /> : 
            <ChevronRight className="w-6 h-6 text-blue-200" />
          }
        </button>
        
        {isExpanded('tools') && (
          <div className="px-6 pb-6">
            <div className="space-y-4">
              {contentStrategy.scriptureMemorizationTools.map((tool, i) => (
                <div key={i} className="bg-gradient-to-r from-white/5 to-white/10 rounded-lg p-6 border border-white/10">
                  <h3 className="font-bold text-white text-lg mb-2">{tool.name}</h3>
                  <p className="text-blue-100 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, j) => (
                      <span key={j} className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Implementation Status */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <span>Current Implementation Status</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-green-300 mb-2">✅ Completed Features</h4>
            <ul className="space-y-1 text-green-100">
              <li>• Scripture Library with Psalms 1-10, 23, 150</li>
              <li>• Interactive memorization quiz system</li>
              <li>• Progress tracking and dashboard</li>
              <li>• Audio player interface</li>
              <li>• Responsive design with musical theme</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-300 mb-2">🚧 Planned Features</h4>
            <ul className="space-y-1 text-yellow-100">
              <li>• Gospel passages (Matthew 5-7)</li>
              <li>• Proverbs collection</li>
              <li>• Audio recordings integration</li>
              <li>• Spaced repetition system</li>
              <li>• Advanced lesson types</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}