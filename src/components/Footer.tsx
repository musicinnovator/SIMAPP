import React from 'react';
import { Music } from 'lucide-react';

export function Footer() {
  return (
    <footer className="simapp-surface-workspace mt-12 border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Scripture in Music</h3>
              <p className="text-blue-200 text-sm">Offline scripture memorization and music practice</p>
            </div>
          </div>

          {/* Navigation Links (Professional & Subtle) */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
              About
            </a>
            <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
              Help
            </a>
            <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">
              Licenses
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-blue-200 text-sm">
            <p className="text-xs text-blue-300">
              Free, non-commercial educational software · © {new Date().getFullYear()} Scripture in Music
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
