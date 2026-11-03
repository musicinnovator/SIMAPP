import React, { useState } from 'react';
import { Download, Share2, X, Check } from 'lucide-react';
import { SocialMediaShare } from './SocialMediaShare';

interface ExportManagerProps {
  combinedBlob: Blob;
  projectName: string;
  onClose: () => void;
}

export function ExportManager({ combinedBlob, projectName, onClose }: ExportManagerProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = () => {
    const url = URL.createObjectURL(combinedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'recording'}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadComplete(true);
    setTimeout(() => {
      setDownloadComplete(false);
    }, 2000);
  };

  const audioUrl = URL.createObjectURL(combinedBlob);
  const shareUrl = window.location.origin;
  const shareTitle = `${projectName || 'My Recording'} - Scripture & Music`;
  const shareText = 'Check out my recording from Scripture & Music!';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
        <div className="bg-gradient-to-r from-green-900 to-teal-900 p-6 border-b border-gray-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Export Complete!</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
            <p className="text-white text-center mb-2">Your recording is ready!</p>
            <audio controls className="w-full mt-2" src={audioUrl} />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              disabled={downloadComplete}
              className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
                downloadComplete
                  ? 'bg-green-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white'
              }`}
            >
              {downloadComplete ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowShareOptions(true)}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {showShareOptions && (
            <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold">Share Your Recording</h3>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SocialMediaShare
                url={shareUrl}
                title={shareTitle}
                description={shareText}
              />
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
