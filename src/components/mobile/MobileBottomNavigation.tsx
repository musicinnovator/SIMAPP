import React from 'react';
import { Home, Book, Target, TrendingUp, Share2, User, FileText } from 'lucide-react';

interface MobileBottomNavigationProps {
  currentView: string;
  onViewChange: (view: any) => void;
  onOpenProfile: () => void;
}

export function MobileBottomNavigation({
  currentView,
  onViewChange,
  onOpenProfile,
}: MobileBottomNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: Book },
    { id: 'customTexts', label: 'My Texts', icon: FileText },
    { id: 'lessons', label: 'Lessons', icon: Target },
    { id: 'share', label: 'Share', icon: Share2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-black/90 backdrop-blur-md border-t border-white/20">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px] ${
                isActive
                  ? 'text-blue-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 text-white/70 hover:text-white min-w-[64px]"
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
}
