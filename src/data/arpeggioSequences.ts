import { ArpeggioSequence } from '../types/arpeggioSystem';

export const ARPEGGIO_SEQUENCES: ArpeggioSequence[] = [
  {
    id: 'seq-135',
    name: 'Ascending Triad (1-3-5)',
    description: 'Basic ascending triad',
    notes: '1-3-5',
    isLong: false,
    length: 3,
    category: 'short'
  },
  {
    id: 'seq-1353',
    name: 'Up and Back (1-3-5-3)',
    description: 'Root up to fifth and back to third',
    notes: '1-3-5-3',
    isLong: false,
    length: 4,
    category: 'medium'
  },
  {
    id: 'seq-1535',
    name: 'Alberti Bass (1-5-3-5)',
    description: 'Classic piano pattern',
    notes: '1-5-3-5',
    isLong: false,
    length: 4,
    category: 'medium'
  },
  {
    id: 'seq-13513513',
    name: 'Rolling Arpeggio (1-3-5-1-3-5-1-3)',
    description: 'Eight notes rolling pattern',
    notes: '1-3-5-1-3-5-1-3',
    isLong: true,
    length: 8,
    category: 'long'
  }
];

export function getSequencesByCategory(category: 'short' | 'medium' | 'long' | 'continuous'): ArpeggioSequence[] {
  return ARPEGGIO_SEQUENCES.filter(seq => seq.category === category);
}
