import React from 'react';
import { X, Home, Book, Music, Target, BookOpen, Lightbulb, Scroll, Share2, TrendingUp, Settings, FileText } from 'lucide-react';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: any) => void;
  onOpenPreferences: () => void;
}

export function MobileNavigationDrawer({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  onOpenPreferences,
}: MobileNavigationDrawerProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Scripture Library', icon: Book },
    { id: 'composer', label: 'Composer', icon: Music },
    { id: 'customTexts', label: 'My Custom Texts', icon: FileText },
    { id: 'lessons', label: 'Lessons', icon: Target },
    { id: 'gospels', label: 'Gospels', icon: BookOpen },
    { id: 'proverbs', label: 'Proverbs', icon: Lightbulb },
    { id: 'torah', label: 'Torah', icon: Scroll },
    { id: 'prophets', label: 'Prophets', icon: BookOpen },
    { id: 'prophecy', label: 'Prophecy', icon: BookOpen },
    { id: 'epistles', label: 'Epistles (Paul)', icon: BookOpen },
    { id: 'creation', label: 'Creation', icon: BookOpen },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'progressPage', label: 'Progress', icon: TrendingUp },
  ];

  if (!isOpen) return null;

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[80vw] bg-gradient-to-b from-gray-900 to-black shadow-2xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <p className="text-sm text-gray-400">Scripture in Music</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300 shadow-lg border border-blue-500/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium text-lg">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/20">
            <button
              onClick={() => {
                onClose();
                onOpenPreferences();
              }}
              className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <Settings className="w-6 h-6" />
              <span className="font-medium text-lg">Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
