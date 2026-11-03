import React, { useState } from 'react';
import { Info, HelpCircle, Sparkles, BookOpen, Music, Heart, Users } from 'lucide-react';

interface AboutPageProps {
  initialSection?: 'why-simm' | 'how-to-use' | 'features';
}

export function AboutPage({ initialSection = 'why-simm' }: AboutPageProps) {
  const [activeSection, setActiveSection] = useState(initialSection);

  return (
    <div className="pro-bg-page">
      <div className="pro-container py-8 px-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-neutral-200">
          <button
            onClick={() => setActiveSection('why-simm')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === 'why-simm'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Why SIMM
          </button>
          <button
            onClick={() => setActiveSection('how-to-use')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === 'how-to-use'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            How To Use
          </button>
          <button
            onClick={() => setActiveSection('features')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeSection === 'features'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Features
          </button>
        </div>

        {/* Why SIMM Section */}
        {activeSection === 'why-simm' && (
          <div className="space-y-8">
            <div>
              <h1 className="pro-heading-2 mb-3">
                Why Learn Scripture Through Music?
              </h1>
              <p className="pro-body-large">
                Discover how music transforms biblical learning into a powerful, memorable experience.
              </p>
            </div>

            <div className="pro-grid-2">
              {/* Enhanced Memory */}
              <div className="pro-card">
                <div className="bg-accent-100 p-3 rounded-lg w-fit mb-4">
                  <BookOpen className="w-6 h-6 text-accent-700" />
                </div>
                <h3 className="pro-heading-4 mb-2">
                  Enhanced Memory
                </h3>
                <p className="pro-body">
                  Music activates multiple areas of the brain, making Scripture memorization
                  more effective and long-lasting than traditional methods.
                </p>
              </div>

              {/* Deeper Connection */}
              <div className="pro-card">
                <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
                  <Heart className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="pro-heading-4 mb-2">
                  Deeper Connection
                </h3>
                <p className="pro-body">
                  Musical expression helps you connect emotionally with God's Word,
                  creating a more meaningful and personal spiritual experience.
                </p>
              </div>

              {/* Joyful Learning */}
              <div className="pro-card">
                <div className="bg-success-100 p-3 rounded-lg w-fit mb-4">
                  <Music className="w-6 h-6 text-success-700" />
                </div>
                <h3 className="pro-heading-4 mb-2">
                  Joyful Learning
                </h3>
                <p className="pro-body">
                  Transform Bible study from a duty into a delight through the
                  natural joy and beauty of musical worship.
                </p>
              </div>

              {/* Personal Practice */}
              <div className="pro-card">
                <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
                  <Users className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="pro-heading-4 mb-2">
                  Personal Practice
                </h3>
                <p className="pro-body">
                  Build a personal practice routine with local progress, musical repetition,
                  and exportable arrangements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How To Use Section */}
        {activeSection === 'how-to-use' && (
          <div className="space-y-8">
            <div>
              <h1 className="pro-heading-2 mb-3">
                How To Use Scripture in Music
              </h1>
              <p className="pro-body-large">
                A simple guide to getting the most out of your musical scripture learning.
              </p>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="pro-card">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="pro-heading-4 mb-2">
                      Choose Your Scripture
                    </h3>
                    <p className="pro-body">
                      Browse the Scripture Library to find passages that resonate with you.
                      Filter by category, difficulty, or theme.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="pro-card">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="pro-heading-4 mb-2">
                      Customize Your Music
                    </h3>
                    <p className="pro-body">
                      Adjust tempo, key signature, instruments, and voicing to match your
                      learning style and musical preferences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="pro-card">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="pro-heading-4 mb-2">
                      Practice & Memorize
                    </h3>
                    <p className="pro-body">
                      Use interactive lessons, quizzes, and recording tools to internalize
                      God's Word through repetition and musical expression.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="pro-card">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="pro-heading-4 mb-2">
                      Save & Export
                    </h3>
                    <p className="pro-body">
                      Monitor your progress, record your performances, and export your
                      arrangements and recordings whenever you choose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="space-y-8">
            <div>
              <h1 className="pro-heading-2 mb-3">
                Powerful Features
              </h1>
              <p className="pro-body-large">
                Everything you need to learn scripture through music.
              </p>
            </div>

            <div className="pro-grid-2">
              {/* Extensive Scripture Library */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Extensive Scripture Library
                </h3>
                <p className="pro-body">
                  Access Psalms, Gospels, Torah, Prophets, Epistles, and more with
                  professionally arranged musical settings.
                </p>
              </div>

              {/* Interactive Music Machine */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Interactive Music Machine
                </h3>
                <p className="pro-body">
                  Full control over tempo, key, instruments, voicing patterns, and
                  advanced chord progressions.
                </p>
              </div>

              {/* Professional Recording Studio */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Professional Recording Studio
                </h3>
                <p className="pro-body">
                  Record vocals with backing tracks, apply audio effects, and create
                  polished recordings to share.
                </p>
              </div>

              {/* Engaging Lessons & Quizzes */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Engaging Lessons & Quizzes
                </h3>
                <p className="pro-body">
                  Interactive activities including fill-in-the-blank, karaoke mode,
                  rhythm tapping, and more.
                </p>
              </div>

              {/* Progress Tracking */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Progress Tracking
                </h3>
                <p className="pro-body">
                  Monitor your learning journey with detailed statistics, achievements,
                  and memorization milestones.
                </p>
              </div>

              {/* Export and Sharing */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Export and Sharing
                </h3>
                <p className="pro-body">
                  Export recordings and arrangements locally, then share them using
                  the operating system's available sharing tools.
                </p>
              </div>

              {/* Custom Text Support */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Custom Text Support
                </h3>
                <p className="pro-body">
                  Create and save your own texts with custom musical arrangements
                  for personal memorization.
                </p>
              </div>

              {/* Audio Effects Suite */}
              <div className="pro-card">
                <h3 className="pro-heading-4 mb-2">
                  Audio Effects Suite
                </h3>
                <p className="pro-body">
                  Professional reverb, delay, compression, and EQ for studio-quality
                  recordings.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
