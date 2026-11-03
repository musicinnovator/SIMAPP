import React, { useState } from 'react';
import { Mail, MessageCircle, Share2, Copy, CheckCircle, Facebook, Twitter, Linkedin, Send } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon
} from 'react-share';

export function SharePage() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState(false);

  const shareUrl = window.location.origin;
  const shareTitle = 'Scripture in Music - Learn God\'s Word Through Song';
  const shareDescription = 'Join me in learning and memorizing Scripture through the power of music! This amazing platform combines biblical study with musical engagement for deeper spiritual growth.';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const subject = encodeURIComponent(shareTitle);
      const body = encodeURIComponent(
        `${customMessage}\n\n` +
        `${shareDescription}\n\n` +
        `Check it out here: ${shareUrl}\n\n` +
        `Features:\n` +
        `- Learn Scripture through music\n` +
        `- Interactive lessons and activities\n` +
        `- Track your progress\n` +
        `- Share your journey with others\n\n` +
        `Blessings!`
      );

      window.location.href = `mailto:${customEmail}?subject=${subject}&body=${body}`;

      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setCustomEmail('');
        setCustomMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Sharing Guide Section (Moved from Homepage) */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Share Your Musical Scripture Journey
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Record & Share
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Record yourself singing or reciting Scripture, then share your recordings
              on social media to inspire others and build community.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Multiple Platforms
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Share to Facebook, Instagram, Twitter, WhatsApp, and more. Each platform
              optimized for the best sharing experience.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Share2 className="w-12 h-12 text-blue-400" />
          <h1 className="text-4xl font-bold text-white">Share Your Journey</h1>
        </div>
        <p className="text-xl text-blue-100">
          Inspire others by sharing your Scripture learning experience
        </p>
      </div>

      {/* Quick Share Section */}
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Share2 className="w-6 h-6 text-blue-400" />
          Share on Social Media
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag="#ScriptureInMusic"
            className="w-full"
          >
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all transform hover:scale-105 cursor-pointer">
              <FacebookIcon size={48} round className="mx-auto mb-3" />
              <p className="text-white font-semibold text-center">Facebook</p>
            </div>
          </FacebookShareButton>

          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            hashtags={['ScriptureInMusic', 'BibleStudy', 'Worship']}
            className="w-full"
          >
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all transform hover:scale-105 cursor-pointer">
              <TwitterIcon size={48} round className="mx-auto mb-3" />
              <p className="text-white font-semibold text-center">Twitter</p>
            </div>
          </TwitterShareButton>

          <WhatsappShareButton
            url={shareUrl}
            title={shareTitle}
            separator=" - "
            className="w-full"
          >
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all transform hover:scale-105 cursor-pointer">
              <WhatsappIcon size={48} round className="mx-auto mb-3" />
              <p className="text-white font-semibold text-center">WhatsApp</p>
            </div>
          </WhatsappShareButton>

          <LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={shareDescription}
            source="Scripture in Music"
            className="w-full"
          >
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/20 transition-all transform hover:scale-105 cursor-pointer">
              <LinkedinIcon size={48} round className="mx-auto mb-3" />
              <p className="text-white font-semibold text-center">LinkedIn</p>
            </div>
          </LinkedinShareButton>
        </div>
      </div>

      {/* Email Share Section */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Mail className="w-6 h-6 text-green-400" />
          Share via Email
        </h2>

        <div className="space-y-6">
          {/* Quick Email Button */}
          <div>
            <EmailShareButton
              url={shareUrl}
              subject={shareTitle}
              body={shareDescription}
              className="w-full"
            >
              <div className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer">
                <EmailIcon size={32} round />
                <span>Open Email Client</span>
              </div>
            </EmailShareButton>
          </div>

          {/* Custom Email Form */}
          <div className="bg-white/10 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Send Custom Email</h3>
            <form onSubmit={handleCustomEmail} className="space-y-4">
              <div>
                <label className="block text-blue-100 mb-2 font-medium">Recipient Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="friend@example.com"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-blue-100 mb-2 font-medium">Personal Message (optional)</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal message to your friend..."
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full font-bold py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  emailSent
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400'
                }`}
              >
                {emailSent ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Email Opened!</span>
                  </>
                ) : sending ? (
                  <span>Opening email client...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copy Link Section */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Copy className="w-6 h-6 text-yellow-400" />
          Copy Link to Share
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${
              copiedLink
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400'
            }`}
          >
            {copiedLink ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Your Songs Section */}
      <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-pink-400" />
          Share Your Musical Creations
        </h2>

        <p className="text-blue-100 mb-6 leading-relaxed">
          Created a beautiful Scripture song? Share it with the world! Use the buttons above to post your musical journey to social media and inspire others.
        </p>

        <div className="bg-white/10 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Suggested Hashtags</h3>
          <div className="flex flex-wrap gap-2">
            {['#ScriptureInMusic', '#BibleStudy', '#Worship', '#ChristianMusic', '#ScriptureMemorization', '#WorshipThroughMusic', '#BiblicalWorship', '#LearnScripture'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-sm font-medium border border-pink-500/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Sharing Tips</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-300">Why Share?</h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Encourage others in their faith journey</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Build a community of Scripture learners</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Spread God's Word through music</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-300">What to Share?</h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Your favorite Scripture songs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Milestones and achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>How the platform has helped you</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
