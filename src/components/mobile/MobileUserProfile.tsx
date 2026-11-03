import React from 'react';
import { User, X, Settings, LogOut } from 'lucide-react';

interface MobileUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isGuest: boolean;
  onOpenPreferences: () => void;
  onSignOut?: () => void;
}

export function MobileUserProfile({
  isOpen,
  onClose,
  user,
  isGuest,
  onOpenPreferences,
  onSignOut,
}: MobileUserProfileProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-black rounded-t-3xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="bg-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-full bg-primary-50">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {user?.user_metadata?.display_name || (isGuest ? 'Guest' : 'User')}
                </h3>
                <p className="text-blue-300 font-medium">
                  {isGuest ? 'Guest Account' : 'Free Tier'}
                </p>
              </div>
            </div>

            {user && !isGuest && (
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-white/80">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenPreferences();
              }}
              className="w-full flex items-center space-x-3 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <Settings className="w-6 h-6" />
              <span className="font-medium">Preferences</span>
            </button>

            {onSignOut && !isGuest && (
              <button
                onClick={onSignOut}
                className="w-full flex items-center space-x-3 p-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-300"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
