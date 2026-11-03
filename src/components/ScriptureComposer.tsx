import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, BookOpen, GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import { scriptures } from '../data/scriptures';
import type { ArrangementSection, ScriptureArrangement } from '../data/arrangements/types';
import { localStorageProvider } from '../services/storage';

function createSection(scripture: (typeof scriptures)[number], index: number): ArrangementSection {
  return {
    id: `${scripture.id}-${index}-${Date.now()}`,
    label: `Section ${index + 1}`,
    kind: index === 0 ? 'verse' : 'chorus',
    references: [{ book: scripture.reference.split(' ')[0] || 'Scripture', chapter: 1, verseStart: 1 }],
    repeatCount: 1,
    tempo: 72,
    key: scripture.key,
    timeSignature: '4/4',
    technique: 'block',
  };
}

export function ScriptureComposer() {
  const [query, setQuery] = useState('');
  const [sections, setSections] = useState<ArrangementSection[]>([]);
  const [title, setTitle] = useState('Untitled arrangement');
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return scriptures.slice(0, 8);
    return scriptures.filter((scripture) =>
      `${scripture.reference} ${scripture.title} ${scripture.text}`.toLowerCase().includes(normalized),
    ).slice(0, 8);
  }, [query]);

  const addScripture = (scripture: (typeof scriptures)[number]) => {
    setSections((current) => [...current, createSection(scripture, current.length)]);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    setSections((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const saveArrangement = async () => {
    if (!localStorageProvider) return;
    const now = new Date().toISOString();
    const arrangement: ScriptureArrangement = {
      id: 'draft',
      title: title.trim() || 'Untitled arrangement',
      createdAt: now,
      updatedAt: now,
      sections,
      defaultTempo: 72,
      defaultKey: 'C Major',
    };
    await localStorageProvider.set('arrangements', arrangement.id, arrangement);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="simapp-surface-panel p-5">
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-amber-300" />
          <div>
            <h1 className="text-2xl font-semibold text-white">Scripture Composer</h1>
            <p className="text-sm text-slate-300">Build an arrangement from any local passage.</p>
          </div>
        </div>
        <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="composer-search">
          Find a passage
        </label>
        <input
          id="composer-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reference, title, or text"
          className="mb-4 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-amber-300 focus:ring-2"
        />
        <div className="space-y-2">
          {matches.map((scripture) => (
            <button
              key={scripture.id}
              onClick={() => addScripture(scripture)}
              className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-amber-300/50 hover:bg-white/[0.07]"
            >
              <span>
                <span className="block font-medium text-white">{scripture.reference}</span>
                <span className="block text-sm text-slate-300">{scripture.title}</span>
              </span>
              <Plus className="h-5 w-5 text-amber-300" />
            </button>
          ))}
        </div>
      </section>

      <section className="simapp-surface-raised p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="min-w-0 flex-1 border-b border-white/20 bg-transparent px-1 py-2 text-xl font-semibold text-white outline-none focus:border-amber-300"
            aria-label="Arrangement title"
          />
          <button onClick={saveArrangement} className="flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-200">
            <Save className="h-4 w-4" /> Save locally
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 p-10 text-center text-slate-300">
            Add passages from the library to begin your arrangement.
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={section.id} className="simapp-surface-panel flex items-center gap-3 p-4">
                <GripVertical className="h-5 w-5 text-slate-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      value={section.label}
                      onChange={(event) => setSections((current) => current.map((item) => item.id === section.id ? { ...item, label: event.target.value } : item))}
                      className="w-32 border-b border-transparent bg-transparent font-medium text-white outline-none focus:border-amber-300"
                      aria-label={`Section ${index + 1} label`}
                    />
                    <span className="text-xs uppercase tracking-wide text-amber-300">{section.kind}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{section.references[0].book} · local scripture selection</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="rounded p-2 text-slate-300 hover:bg-white/10 disabled:opacity-30" aria-label="Move section up"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="rounded p-2 text-slate-300 hover:bg-white/10 disabled:opacity-30" aria-label="Move section down"><ArrowDown className="h-4 w-4" /></button>
                  <button onClick={() => setSections((current) => current.filter((item) => item.id !== section.id))} className="rounded p-2 text-rose-300 hover:bg-rose-500/10" aria-label="Remove section"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
