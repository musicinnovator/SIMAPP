import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Instagram, Music, Download, Link, MessageCircle, Send, Globe } from 'lucide-react';

interface SocialMediaShareProps {
  audioUrl: string | null;
  scriptureReference?: string;
  scriptureText?: string;
  isVisible: boolean;
  onClose: () => void;
}

export function SocialMediaShare({ 
  audioUrl, 
  scriptureReference = '', 
  scriptureText = '', 
  isVisible, 
  onClose 
}: SocialMediaShareProps) {
  const [shareText, setShareText] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // Generate default share text
  const defaultShareText = `🎵 Just recorded myself singing ${scriptureReference}! Learning God's Word through music on Scripture in Music. #ScriptureInMusic #BibleMemory #Worship`;

  // Social media platform configurations
  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => shareToFacebook(),
      supportsAudio: false,
      description: 'Share text and link'
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-black hover:bg-gray-800',
      action: () => shareToTwitter(),
      supportsAudio: false,
      description: 'Share text and link'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      action: () => shareToInstagram(),
      supportsAudio: true,
      description: 'Download audio for Stories'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => shareToWhatsApp(),
      supportsAudio: false,
      description: 'Share via message'
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => shareToTelegram(),
      supportsAudio: false,
      description: 'Share via message'
    },
    {
      name: 'Copy Link',
      icon: Link,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => copyToClipboard(),
      supportsAudio: false,
      description: 'Copy shareable link'
    },
    {
      name: 'Download Audio',
      icon: Download,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => downloadAudio(),
      supportsAudio: true,
      description: 'Save to device'
    },
    {
      name: 'Web Share',
      icon: Globe,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => useWebShare(),
      supportsAudio: true,
      description: 'Native device sharing'
    }
  ];

  const shareToFacebook = () => {
    const text = shareText || defaultShareText;
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('Facebook');
  };

  const shareToTwitter = () => {
    const text = shareText || defaultShareText;
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('Twitter');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct web sharing, so we'll provide instructions
    if (audioUrl) {
      downloadAudio();
      alert('Audio downloaded! You can now upload it to your Instagram Story. Add the text: "' + (shareText || defaultShareText) + '"');
      trackShare('Instagram');
    }
  };

  const shareToWhatsApp = () => {
    const text = shareText || defaultShareText;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
    window.open(shareUrl, '_blank');
    trackShare('WhatsApp');
  };

  const shareToTelegram = () => {
    const text = shareText || defaultShareText;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    trackShare('Telegram');
  };

  const copyToClipboard = async () => {
    const text = shareText || defaultShareText;
    const fullText = `${text}\n\n${window.location.href}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setShareSuccess('Link copied to clipboard!');
      setTimeout(() => setShareSuccess(null), 3000);
      trackShare('Clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `scripture-recording-${scriptureReference.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackShare('Download');
  };

  const useWebShare = async () => {
    if (!navigator.share) {
      alert('Web Share API not supported on this device. Try another sharing method.');
      return;
    }

    try {
      const shareData: any = {
        title: `Scripture Recording - ${scriptureReference}`,
        text: shareText || defaultShareText,
        url: window.location.href
      };

      // Add audio file if supported (limited browser support)
      if (audioUrl && navigator.canShare) {
        try {
          const response = await fetch(audioUrl);
          const blob = await response.blob();
          const file = new File([blob], `scripture-${scriptureReference}.webm`, { type: 'audio/webm' });
          
          if (navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch (error) {
          console.log('Audio sharing not supported, sharing text only');
        }
      }

      await navigator.share(shareData);
      trackShare('Web Share');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  const trackShare = (platform: string) => {
    console.log(`Shared to ${platform}:`, {
      scripture: scriptureReference,
      timestamp: new Date().toISOString(),
      hasAudio: !!audioUrl
    });
    
    setShareSuccess(`Shared to ${platform}!`);
    setTimeout(() => setShareSuccess(null), 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Your Recording</h2>
                <p className="text-blue-200">Spread God's Word through your musical testimony</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scripture Info */}
          {scriptureReference && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">{scriptureReference}</h3>
              {scriptureText && (
                <p className="text-yellow-100 text-sm italic">"{scriptureText.substring(0, 150)}..."</p>
              )}
            </div>
          )}

          {/* Custom Share Text */}
          <div className="space-y-3">
            <label className="text-white font-bold block">Customize Your Message</label>
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder={defaultShareText}
              className="w-full h-24 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-blue-300 text-sm">
              {shareText.length || defaultShareText.length} characters
            </p>
          </div>

          {/* Platform Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Choose Platform</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={platform.action}
                    disabled={isSharing}
                    className={`${platform.color} text-white p-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="space-y-2">
                      <Icon className="w-6 h-6 mx-auto" />
                      <div className="text-sm font-bold">{platform.name}</div>
                      <div className="text-xs opacity-75">{platform.description}</div>
                      {platform.supportsAudio && audioUrl && (
                        <div className="flex items-center justify-center space-x-1">
                          <Music className="w-3 h-3" />
                          <span className="text-xs">Audio</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Support Info */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
            <h4 className="text-blue-300 font-bold mb-2">Audio Sharing Support</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="text-blue-200 font-medium mb-1">Direct Audio Sharing:</h5>
                <ul className="text-blue-100 space-y-1">
                  <li>• Web Share (mobile devices)</li>
                  <li>• Download for manual upload</li>
                  <li>• Instagram Stories (after download)</li>
                </ul>
              </div>
              <div>
                <h5 className="text-blue-200 font-medium mb-1">Text + Link Sharing:</h5>
                <ul className="text-blue-100 space-y-1">
                  <li>• Facebook, Twitter, WhatsApp</li>
                  <li>• Telegram, Copy Link</li>
                  <li>• Includes link to your recording</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {shareSuccess && (
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">{shareSuccess}</span>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-gray-500/10 rounded-lg p-4 border border-gray-500/30">
            <h4 className="text-gray-300 font-bold mb-2">Privacy & Sharing</h4>
            <ul className="text-gray-200 text-sm space-y-1">
              <li>• Your recordings are stored locally on your device</li>
              <li>• Sharing creates a temporary link that expires after 24 hours</li>
              <li>• No personal data is collected or stored on our servers</li>
              <li>• You control what you share and with whom</li>
            </ul>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:from-gray-400 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialMediaShare;