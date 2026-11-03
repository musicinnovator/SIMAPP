import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface SocialMediaIntegrationProps {
  isVisible: boolean;
}

export function SocialMediaIntegration({ isVisible }: SocialMediaIntegrationProps) {
  if (!isVisible) return null;

  return (
    <section className="simapp-surface-raised space-y-4 p-6">
      <div className="flex items-center gap-3">
        <Share2 className="h-6 w-6 text-amber-300" />
        <div>
          <h3 className="text-xl font-semibold text-white">Export and share</h3>
          <p className="text-sm text-slate-300">Create a local file and share it through your device.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="simapp-surface-panel p-4">
          <Download className="mb-2 h-5 w-5 text-amber-300" />
          <h4 className="font-medium text-white">Export a recording</h4>
          <p className="mt-1 text-sm text-slate-300">Save WAV or WebM audio locally without an account.</p>
        </div>
        <div className="simapp-surface-panel p-4">
          <Share2 className="mb-2 h-5 w-5 text-amber-300" />
          <h4 className="font-medium text-white">Share a file</h4>
          <p className="mt-1 text-sm text-slate-300">Use the operating system share surface when available.</p>
        </div>
      </div>
    </section>
  );
}

export default SocialMediaIntegration;
