import React, { useState, useEffect } from 'react';
import { Save, Trash2, Play, Music2, Clock } from 'lucide-react';
import { SessionBank as SessionBankManager, SongData } from '../utils/sessionBank';

interface SessionBankProps {
  onLoadSong: (song: SongData) => void;
  currentSongData: Omit<SongData, 'id' | 'timestamp'>;
}

export function SessionBank({ onLoadSong, currentSongData }: SessionBankProps) {
  const [sessionBank] = useState(() => new SessionBankManager());
  const [songs, setSongs] = useState<Map<number, SongData>>(new Map());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [saveSlot, setSaveSlot] = useState<number | null>(null);
  const [songTitle, setSongTitle] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    refreshSongs();
  }, []);

  const refreshSongs = () => {
    setSongs(new Map(sessionBank.getAllSongs()));
  };

  const handleSave = () => {
    const slot = saveSlot || sessionBank.getNextAvailableSlot();
    if (!slot) {
      alert('Session bank is full! Delete a song to make space.');
      return;
    }

    const title = songTitle.trim() || `Song ${slot}`;
    const success = sessionBank.saveSong(slot, {
      ...currentSongData,
      title
    });

    if (success) {
      refreshSongs();
      setShowSaveDialog(false);
      setSongTitle('');
      setSaveSlot(null);
    }
  };

  const handleLoad = (slot: number) => {
    const song = sessionBank.getSong(slot);
    if (song) {
      onLoadSong(song);
      setSelectedSlot(slot);
    }
  };

  const handleDelete = (slot: number) => {
    if (confirm(`Delete this song from slot ${slot}?`)) {
      sessionBank.deleteSong(slot);
      refreshSongs();
      if (selectedSlot === slot) {
        setSelectedSlot(null);
      }
    }
  };

  const handleReplace = (slot: number) => {
    setSaveSlot(slot);
    const existingSong = sessionBank.getSong(slot);
    setSongTitle(existingSong?.title || '');
    setShowSaveDialog(true);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openSaveDialog = () => {
    const nextSlot = sessionBank.getNextAvailableSlot();
    if (!nextSlot) {
      alert('Session bank is full! Delete a song to make space.');
      return;
    }
    setSaveSlot(nextSlot);
    setSongTitle(`Song ${nextSlot}`);
    setShowSaveDialog(true);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 mt-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Session Song Bank</h3>
              <p className="text-purple-200 text-sm">
                Store up to 7 songs • {songs.size}/7 slots used
              </p>
            </div>
          </div>

          <button
            onClick={openSaveDialog}
            disabled={sessionBank.isFull()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              sessionBank.isFull()
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-success-50 text-white hover:from-green-400 hover:to-green-500 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Current</span>
          </button>
        </div>

        {/* Song Slots */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((slot) => {
            const song = songs.get(slot);
            const isEmpty = !song;
            const isSelected = selectedSlot === slot;

            return (
              <div
                key={slot}
                className={`bg-white/5 rounded-lg p-4 border transition-all duration-200 ${
                  isEmpty
                    ? 'border-white/10'
                    : isSelected
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-purple-500/30 hover:border-purple-500/50'
                }`}
              >
                {/* Slot Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isEmpty
                        ? 'bg-white/10 text-white/50'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {slot}
                    </div>
                    {isSelected && (
                      <div className="text-purple-300 text-xs font-medium">LOADED</div>
                    )}
                  </div>

                  {!isEmpty && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleLoad(slot)}
                        className="p-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-white transition-all"
                        title="Load this song"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slot)}
                        className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-white transition-all"
                        title="Delete this song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Slot Content */}
                {isEmpty ? (
                  <div className="text-center py-6">
                    <p className="text-white/40 text-sm">Empty Slot</p>
                    <button
                      onClick={() => handleReplace(slot)}
                      className="mt-2 text-purple-400 text-xs hover:text-purple-300 transition-colors"
                    >
                      Save here
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-white font-bold truncate" title={song.title}>
                      {song.title}
                    </h4>
                    <div className="space-y-1 text-xs text-purple-200">
                      <div className="flex items-center justify-between">
                        <span>Key:</span>
                        <span className="font-medium">{song.key}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tempo:</span>
                        <span className="font-medium">{song.tempo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Instrument:</span>
                        <span className="font-medium truncate ml-2">{song.instrument}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{formatTime(song.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReplace(slot)}
                      className="w-full mt-2 text-purple-400 text-xs hover:text-purple-300 transition-colors"
                    >
                      Replace
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
          <h4 className="text-purple-300 font-bold mb-2">Session Bank Info</h4>
          <ul className="text-purple-100 text-sm space-y-1">
            <li>• Songs are stored in your browser session (temporary)</li>
            <li>• All songs are deleted when you close this tab or window</li>
            <li>• Maximum 7 songs can be stored at once</li>
            <li>• Use "Save Current" to store your current Music Machine settings</li>
            <li>• Click "Load" to restore a saved song's settings</li>
          </ul>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Save to Slot {saveSlot}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-purple-300 text-sm font-medium block mb-2">
                  Song Title
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder={`Song ${saveSlot}`}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={50}
                />
              </div>

              <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between text-purple-200">
                  <span>Key:</span>
                  <span className="font-medium text-white">{currentSongData.key}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Tempo:</span>
                  <span className="font-medium text-white">{currentSongData.tempo}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Progression:</span>
                  <span className="font-medium text-white">{currentSongData.progression}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Instrument:</span>
                  <span className="font-medium text-white">{currentSongData.instrument}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-success-50 text-white px-4 py-2 rounded-lg font-medium hover:from-green-400 hover:to-green-500 transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSongTitle('');
                    setSaveSlot(null);
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
