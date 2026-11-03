import React, { useState, useRef } from 'react';
import { Music, BookOpen, Play, Target, TrendingUp, Share2 } from 'lucide-react';
import MusicNotesBackground from './components/MusicNotesBackground';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ScriptureLibrary } from './components/ScriptureLibrary';
import { ScripturePlayer } from './components/ScripturePlayer';
import { MemorizationQuiz } from './components/MemorizationQuiz';
import { ProgressDashboard } from './components/ProgressDashboard';
import { ContentStrategy } from './components/ContentStrategy';
import { LessonsPageNew } from './components/LessonsPageNew';
import { InteractiveLessonsPage } from './components/InteractiveLessonsPage';
import { DonationLinks } from './components/DonationLinks';
import { Footer } from './components/Footer';
import { SharePage } from './components/SharePage';
import { ProgressPage } from './components/ProgressPage';
import { AdvancedLessonsPage } from './components/AdvancedLessonsPage';
import { CompleteMusicLessonsHub } from './components/CompleteMusicLessonsHub';
import { GospelPassagesPage } from './components/GospelPassagesPage';
import { ProverbsCollectionPage } from './components/ProverbsCollectionPage';
import { TorahPage } from './components/TorahPage';
import { ProphetsPage } from './components/ProphetsPage';
import { ProphecyPage } from './components/ProphecyPage';
import { EpistlesPage } from './components/EpistlesPage';
import { CreationPage } from './components/CreationPage';
import { StoriesPage } from './components/StoriesPage';
import { MusicMachine } from './components/MusicMachine';
import { SocialMediaIntegration } from './components/SocialMediaIntegration';
import PreferencesPanel from './components/PreferencesPanel';
import { MobileBottomNavigation } from './components/mobile/MobileBottomNavigation';
import { MobileUserProfile } from './components/mobile/MobileUserProfile';
import { CustomTextsLibrary } from './components/CustomTextsLibrary';
import StudioDashboard from './components/StudioDashboard';
import StudioCustomTextCreator from './components/StudioCustomTextCreator';
import UnifiedStudioPage from './components/UnifiedStudioPage';
import { AboutPage } from './components/AboutPage';
import { ScriptureComposer } from './components/ScriptureComposer';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { allScriptures } from './data/scriptures';

type ViewType = 'home' | 'library' | 'composer' | 'player' | 'quiz' | 'progress' | 'strategy' | 'lessons' | 'gospels' | 'proverbs' | 'torah' | 'social' | 'interactiveLessons' | 'share' | 'progressPage' | 'advancedLessons' | 'customTexts' | 'prophets' | 'prophecy' | 'epistles' | 'creation' | 'stories' | 'studio-dashboard' | 'unified-studio' | 'music-machine' | 'scripture' | 'about' | 'custom-text-creator';

function App() {
  const { user, loading: authLoading, isGuest, signIn, signUp, continueAsGuest } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedScripture, setSelectedScripture] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const { updateProgress, progress } = useProgress();

  const musicMachineRef = useRef<any>(null);
  const [musicMachineState, setMusicMachineState] = useState<{
    isPlaying: boolean;
    getMusicDestination: () => AudioNode | null;
    stopMusic: () => void;
  }>({
    isPlaying: false,
    getMusicDestination: () => null,
    stopMusic: () => {}
  });

  // Show auth modal if user is not authenticated and not guest
  React.useEffect(() => {
    if (!authLoading && !user && !isGuest) {
      setShowAuthModal(true);
    }
  }, [authLoading, user, isGuest]);

  const handleSelectScripture = (scripture: any) => {
    setSelectedScripture(scripture);
    setCurrentView('player');
  };

  const handleSelectCustomText = (customText: any) => {
    const formattedText = {
      id: customText.id,
      title: customText.title,
      text: customText.text_content,
      key: customText.key_signature,
      tempo: customText.tempo,
      timeSignature: customText.time_signature,
      category: customText.label || 'Custom',
    };
    setSelectedScripture(formattedText);
    setCurrentView('player');
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleQuizComplete = async (score: number) => {
    if (selectedScripture) {
      await updateProgress(selectedScripture.id, score, 300, 'quiz'); // Assume 5 minutes for quiz
    }
    setCurrentView('progress');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedScripture(null);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    if (!user && !isGuest) {
      // If user closes modal without signing in or choosing guest, default to guest
      continueAsGuest();
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-white text-lg">Loading Scripture in Music...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'library':
        return <ScriptureLibrary onSelectScripture={handleSelectScripture} />;

      case 'composer':
        return <ScriptureComposer />;
      
      case 'player':
        return selectedScripture ? (
          <div className="space-y-6">
            <ScripturePlayer
              scripture={selectedScripture}
              onStartQuiz={handleStartQuiz}
              musicDestination={musicMachineState.getMusicDestination}
              isMusicPlaying={musicMachineState.isPlaying}
              stopMusic={musicMachineState.stopMusic}
            />
            <MusicMachine
              keySignature={selectedScripture.key}
              tempo={selectedScripture.tempo}
              isVisible={true}
              scriptureText={selectedScripture.text}
              ref={musicMachineRef}
              onStateChange={setMusicMachineState}
            />
          </div>
        ) : (
          <ScriptureLibrary onSelectScripture={handleSelectScripture} />
        );
      
      case 'quiz':
        return selectedScripture ? (
          <MemorizationQuiz
            scripture={selectedScripture}
            onComplete={handleQuizComplete}
            onBack={handleBackToLibrary}
          />
        ) : (
          <ScriptureLibrary onSelectScripture={handleSelectScripture} />
        );
      
      case 'progress':
        return <ProgressDashboard progress={progress} />;

      case 'progressPage':
        return <ProgressPage />;
      
      case 'strategy':
        return <ContentStrategy />;
      
      case 'lessons':
        return <CompleteMusicLessonsHub />;

      case 'interactiveLessons':
        return <InteractiveLessonsPage />;

      case 'advancedLessons':
        return <AdvancedLessonsPage scripture={selectedScripture || undefined} />;

      case 'gospels':
        return <GospelPassagesPage />;

      case 'proverbs':
        return <ProverbsCollectionPage />;

      case 'torah':
        return <TorahPage />;

      case 'prophets':
        return <ProphetsPage />;

      case 'prophecy':
        return <ProphecyPage />;

      case 'epistles':
        return <EpistlesPage />;

      case 'creation':
        return <CreationPage />;

      case 'stories':
        return <StoriesPage />;

      case 'customTexts':
        return <CustomTextsLibrary onSelectText={handleSelectCustomText} />;

      case 'social':
        return <SocialMediaIntegration isVisible={true} />;

      case 'share':
        return <SharePage />;

      case 'studio-dashboard':
        return <StudioDashboard onNavigate={setCurrentView} />;

      case 'custom-text-creator':
        return <StudioCustomTextCreator onNavigate={(page, data) => {
          if (data?.customText) {
            setSelectedScripture(data.customText);
          }
          setCurrentView(page as ViewType);
        }} />;

      case 'unified-studio':
        return <UnifiedStudioPage onNavigate={setCurrentView} initialScripture={selectedScripture} />;

      case 'music-machine':
        return (
          <MusicMachine
            keySignature={selectedScripture?.key || 'C'}
            tempo={selectedScripture?.tempo || 72}
            isVisible={true}
            scriptureText={selectedScripture?.text || ''}
            ref={musicMachineRef}
            onStateChange={setMusicMachineState}
          />
        );

      case 'scripture':
        return <ScriptureLibrary onSelectScripture={handleSelectScripture} />;

      case 'about':
        return <AboutPage />;

      default:
        return (
          <div className="max-w-6xl mx-auto text-center space-y-12 pb-24 lg:pb-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="bg-primary-600 p-4 rounded-lg shadow-lg">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white gradient-text">
                  Scripture in Music
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-silver-300 max-w-3xl mx-auto leading-relaxed px-4">
                Learn and memorize God's Word through the power of music.
                Combine biblical study with musical engagement for deeper spiritual growth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              <div
                onClick={() => setCurrentView('library')}
                className="bg-white p-6 border-l-4 border-primary-600 hover:border-primary-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Scripture Library
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Explore Psalms, Gospels, and hymns with music
                  </p>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('interactiveLessons')}
                className="bg-white p-6 border-l-4 border-success-600 hover:border-success-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-success-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Interactive Lessons
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Musical activities and memorization games
                  </p>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('advancedLessons')}
                className="bg-white p-6 border-l-4 border-accent-600 hover:border-accent-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-accent-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Advanced Activities
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Master Scripture with advanced challenges
                  </p>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('progressPage')}
                className="bg-white p-6 border-l-4 border-primary-600 hover:border-primary-700 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Track Progress
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Monitor your learning and achievements
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="simapp-depth-shell min-h-screen bg-slate-950 relative">
      <MusicNotesBackground />
      
      <AuthModal
        isVisible={showAuthModal}
        onClose={handleAuthModalClose}
        onSignIn={signIn}
        onSignUp={signUp}
        onContinueAsGuest={continueAsGuest}
      />
      
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        isGuest={isGuest}
        onOpenPreferences={() => setShowPreferences(true)}
      />

      {showPreferences && (
        <PreferencesPanel onClose={() => setShowPreferences(false)} />
      )}

      <MobileUserProfile
        isOpen={showMobileProfile}
        onClose={() => setShowMobileProfile(false)}
        user={user}
        isGuest={isGuest}
        onOpenPreferences={() => {
          setShowMobileProfile(false);
          setShowPreferences(true);
        }}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {renderContent()}
      </main>

      <MobileBottomNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenProfile={() => setShowMobileProfile(true)}
      />

      <Footer />
    </div>
  );
}

export default App;
