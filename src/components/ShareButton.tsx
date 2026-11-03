import React, { useState } from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import SocialMediaShare from './SocialMediaShare';

interface ShareButtonProps {
  audioUrl?: string | null;
  scriptureReference?: string;
  scriptureText?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
}

export function ShareButton({ 
  audioUrl, 
  scriptureReference, 
  scriptureText, 
  className = '',
  variant = 'primary'
}: ShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500';
      case 'minimal':
        return 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white border border-white/20';
      default:
        return 'bg-success-50 text-white hover:from-green-400 hover:to-green-500';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${getButtonStyles()} ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
        <ExternalLink className="w-3 h-3 opacity-75" />
      </button>

      <SocialMediaShare
        audioUrl={audioUrl}
        scriptureReference={scriptureReference}
        scriptureText={scriptureText}
        isVisible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}

export default ShareButton;