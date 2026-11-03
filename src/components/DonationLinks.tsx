import React from 'react';
import { BookOpen, Download, ShieldCheck } from 'lucide-react';

export function DonationLinks() {
  return (
    <section className="simapp-surface-raised flex flex-col items-center gap-4 p-6 text-center">
      <div className="flex items-center gap-2 text-white">
        <ShieldCheck className="h-6 w-6 text-amber-300" />
        <h2 className="text-2xl font-bold">Free and local-first</h2>
      </div>
      <p className="max-w-md leading-relaxed text-slate-200">
        Scripture in Music is free, non-commercial educational software for scripture study,
        memorization, musical practice, and worship.
      </p>
      <div className="grid gap-3 text-left text-sm text-slate-300 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <BookOpen className="mt-0.5 h-4 w-4 text-amber-300" />
          <span>Scripture and practice tools work offline.</span>
        </div>
        <div className="flex items-start gap-2">
          <Download className="mt-0.5 h-4 w-4 text-amber-300" />
          <span>Export your arrangements and recordings when you choose.</span>
        </div>
      </div>
    </section>
  );
}
