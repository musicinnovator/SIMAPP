import React, { useState, useRef, useEffect } from 'react';
import { Music, Book, BarChart3, Home, Target, BookOpen, Lightbulb, Scroll, Share2, User, Users, Settings, TrendingUp, Menu, FileText, Mic, Info, ChevronDown } from 'lucide-react';
import { MobileNavigationDrawer } from './mobile/MobileNavigationDrawer';
import { OfflineStatus } from './OfflineStatus';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: any) => void;
  user?: any;
  isGuest?: boolean;
  onOpenPreferences?: () => void;
}

export function Header({ currentView, onViewChange, user, isGuest, onOpenPreferences }: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ADDITIVE: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
    };

    if (showMoreDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreDropdown]);

  // ADDITIVE: Primary navigation items (always visible)
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'studio-dashboard', label: 'Studio', icon: Mic },
    { id: 'library', label: 'Scripture Library', icon: Book },
    { id: 'composer', label: 'Composer', icon: Music },
    { id: 'customTexts', label: 'My Texts', icon: FileText },
    { id: 'lessons', label: 'Lessons', icon: Target },
  ];

  // ADDITIVE: Secondary navigation items (in dropdown)
  const secondaryNavItems = [
    { id: 'gospels', label: 'Gospels', icon: BookOpen },
    { id: 'proverbs', label: 'Proverbs', icon: Lightbulb },
    { id: 'torah', label: 'Torah', icon: Scroll },
    { id: 'prophets', label: 'Prophets', icon: BookOpen },
    { id: 'prophecy', label: 'Prophecy', icon: BookOpen },
    { id: 'epistles', label: 'Epistles', icon: BookOpen },
    { id: 'creation', label: 'Creation', icon: BookOpen },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'progressPage', label: 'Progress', icon: TrendingUp },
  ];

  // ADDITIVE: Combined list for mobile
  const navItems = [...primaryNavItems, ...secondaryNavItems];

  const isSecondaryItemActive = secondaryNavItems.some(item => item.id === currentView);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-30 dark:bg-neutral-900/95 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-3 rounded-lg shadow-lg">
                <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-neutral-900 dark:text-white">Scripture in Music</h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm hidden sm:block">Learn God's Word through song</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-2">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-primary-400 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}

            {/* ADDITIVE: More dropdown for secondary items */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isSecondaryItemActive
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-primary-400 dark:hover:bg-neutral-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium text-sm">More</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMoreDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showMoreDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-2xl border border-neutral-200 dark:border-neutral-700 py-2 max-h-96 overflow-y-auto z-50">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onViewChange(item.id as any);
                          setShowMoreDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-colors ${
                          currentView === item.id
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            {onOpenPreferences && (
              <button
                onClick={onOpenPreferences}
                className="hidden sm:flex p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                title="Preferences"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg ${
              user
                ? 'bg-success-500/20 text-success-700 border border-success-500/30 dark:text-success-400'
                : isGuest
                  ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30 dark:text-primary-400'
                  : 'bg-neutral-500/20 text-neutral-700 border border-neutral-500/30 dark:text-neutral-400'
            }`}>
              {user ? (
                <>
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:block">
                    {user.user_metadata?.display_name || 'User'}
                  </span>
                </>
              ) : isGuest ? (
                <>
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:block">Guest</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:block">Not Signed In</span>
                </>
              )}
            </div>
            <OfflineStatus />
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <MobileNavigationDrawer
      isOpen={showMobileMenu}
      onClose={() => setShowMobileMenu(false)}
      currentView={currentView}
      onViewChange={onViewChange}
      onOpenPreferences={onOpenPreferences || (() => {})}
    />
  </>
  );
}
