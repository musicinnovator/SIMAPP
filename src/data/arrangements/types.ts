export type ArrangementSectionKind = 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'custom';

export interface ScriptureReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  startWord?: number;
  endWord?: number;
}

export interface ArrangementSection {
  id: string;
  label: string;
  kind: ArrangementSectionKind;
  references: ScriptureReference[];
  repeatCount: number;
  tempo?: number;
  key?: string;
  timeSignature?: string;
  technique?: 'block' | 'arpeggiated' | 'strum' | 'broken' | 'partial';
  transitionGapSeconds?: number;
}

export interface ScriptureArrangement {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sections: ArrangementSection[];
  defaultTempo: number;
  defaultKey: string;
  notes?: string;
}
