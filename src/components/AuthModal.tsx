import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, UserPlus, LogIn, X, Users } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  onContinueAsGuest: () => void;
}

export function AuthModal({ isVisible, onClose, onSignIn, onSignUp, onContinueAsGuest }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setDisplayName('');
    setError(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        if (!displayName.trim()) {
          throw new Error('Display name is required');
        }
        await onSignUp(email, password, username.trim(), displayName.trim());
      } else {
        await onSignIn(email, password);
      }
      resetForm();
      onClose();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    onContinueAsGuest();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-8 border border-white/20 max-w-md w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-blue-200">
                  {mode === 'signup' ? 'Optional online sync for your local practice' : 'Optional online sync'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-white font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Username (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-white font-medium mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Display Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-white font-medium mb-2 block">Display Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-white font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-blue-300 text-sm mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Supabase Configuration Warning */}
            {!isSupabaseConfigured && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-sm">
                  ⚠️ Supabase not configured. Account features will be limited to guest mode.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {mode === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                </div>
              )}
            </button>
            
            {!isSupabaseConfigured && (
              <p className="text-yellow-200 text-xs text-center">
                Account creation requires Supabase configuration
              </p>
            )}
          </form>

          {/* Guest Option */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900 px-4 text-blue-200">or</span>
            </div>
          </div>

          <button
            onClick={handleContinueAsGuest}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue as Guest
          </button>

          {/* Benefits */}
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
            <h4 className="text-yellow-300 font-bold mb-2">Account Benefits</h4>
            <ul className="text-yellow-100 text-sm space-y-1">
              <li>• Keep local practice data on this device</li>
              <li>• Track progress and memorization milestones</li>
              <li>• Use the complete offline scripture library</li>
              <li>• Export recordings when you choose</li>
              <li>• Enable optional sync only when desired</li>
            </ul>
          </div>

          {/* Guest Limitations */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-blue-300 font-bold mb-2">Guest Mode</h4>
            <ul className="text-blue-100 text-sm space-y-1">
              <li>• Progress saved locally on this device only</li>
              <li>• Limited achievement tracking</li>
              <li>• No cloud backup or sync</li>
              <li>• Can upgrade to full account anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
