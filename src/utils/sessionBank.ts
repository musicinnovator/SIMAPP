export interface SongData {
  id: string;
  title: string;
  key: string;
  tempo: string;
  progression: string;
  chordType: string;
  inversion: number;
  instrument: string;
  customProgression?: string[];
  isCustomMode: boolean;
  timestamp: number;
  duration?: number;
}

export class SessionBank {
  private static readonly MAX_SONGS = 7;
  private static readonly STORAGE_KEY = 'scripture_music_session_bank';
  private songs: Map<number, SongData>;

  constructor() {
    this.songs = new Map();
    this.loadFromSession();
  }

  private loadFromSession(): void {
    try {
      const stored = sessionStorage.getItem(SessionBank.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.songs = new Map(Object.entries(data).map(([k, v]) => [parseInt(k), v as SongData]));
      }
    } catch (error) {
      console.error('Error loading session bank:', error);
      this.songs = new Map();
    }
  }

  private saveToSession(): void {
    try {
      const data = Object.fromEntries(this.songs);
      sessionStorage.setItem(SessionBank.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving session bank:', error);
    }
  }

  saveSong(slot: number, song: Omit<SongData, 'id' | 'timestamp'>): boolean {
    if (slot < 1 || slot > SessionBank.MAX_SONGS) {
      return false;
    }

    const songData: SongData = {
      ...song,
      id: `song_${Date.now()}_${slot}`,
      timestamp: Date.now()
    };

    this.songs.set(slot, songData);
    this.saveToSession();
    return true;
  }

  loadSong(slot: number): SongData | null {
    if (slot < 1 || slot > SessionBank.MAX_SONGS) {
      return null;
    }
    return this.songs.get(slot) || null;
  }

  deleteSong(slot: number): boolean {
    if (slot < 1 || slot > SessionBank.MAX_SONGS) {
      return false;
    }
    const result = this.songs.delete(slot);
    this.saveToSession();
    return result;
  }

  getSong(slot: number): SongData | null {
    return this.songs.get(slot) || null;
  }

  getAllSongs(): Map<number, SongData> {
    return new Map(this.songs);
  }

  getNextAvailableSlot(): number | null {
    for (let i = 1; i <= SessionBank.MAX_SONGS; i++) {
      if (!this.songs.has(i)) {
        return i;
      }
    }
    return null;
  }

  isFull(): boolean {
    return this.songs.size >= SessionBank.MAX_SONGS;
  }

  isEmpty(): boolean {
    return this.songs.size === 0;
  }

  clearAll(): void {
    this.songs.clear();
    sessionStorage.removeItem(SessionBank.STORAGE_KEY);
  }

  getSlotCount(): number {
    return this.songs.size;
  }

  hasSlot(slot: number): boolean {
    return this.songs.has(slot);
  }
}
