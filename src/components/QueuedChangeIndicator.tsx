import React, { useEffect, useState } from 'react';
import { Clock, Trash2, X } from 'lucide-react';
import { QueuedParameter } from '../types/realtimeChanges';

interface QueuedChangeIndicatorProps {
  queue: QueuedParameter[];
  onClearParameter: (id: string) => void;
  onClearAll: () => void;
  showNotifications: boolean;
}

/**
 * Visual feedback component for queued parameter changes.
 *
 * Shows a badge/notification when parameters are queued for application
 * at the next chord or next loop. Provides UI to cancel queued changes.
 *
 * ADDITIVE-ONLY: This component does not interfere with existing playback.
 * It only provides visual feedback for the new queue system.
 */
export function QueuedChangeIndicator({
  queue,
  onClearParameter,
  onClearAll,
  showNotifications
}: QueuedChangeIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [recentlyApplied, setRecentlyApplied] = useState<string[]>([]);

  // Group queue by timing
  const byTiming = {
    'next-chord': queue.filter(p => p.applyAt === 'next-chord'),
    'next-loop': queue.filter(p => p.applyAt === 'next-loop')
  };

  const totalQueued = queue.length;

  // Auto-collapse when queue is empty
  useEffect(() => {
    if (totalQueued === 0 && expanded) {
      const timer = setTimeout(() => setExpanded(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [totalQueued, expanded]);

  // Track when items are removed (likely applied)
  useEffect(() => {
    const prevIds = new Set(queue.map(p => p.id));

    return () => {
      const currentIds = new Set(queue.map(p => p.id));
      const applied = Array.from(prevIds).filter(id => !currentIds.has(id));
      if (applied.length > 0) {
        setRecentlyApplied(prev => [...prev, ...applied]);
        setTimeout(() => {
          setRecentlyApplied(prev => prev.filter(id => !applied.includes(id)));
        }, 3000);
      }
    };
  }, [queue]);

  if (!showNotifications && totalQueued === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {/* Compact Badge */}
      {!expanded && totalQueued > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-200 animate-pulse"
        >
          <Clock className="w-5 h-5" />
          <span className="font-medium">
            {totalQueued} Change{totalQueued !== 1 ? 's' : ''} Queued
          </span>
          <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
            {byTiming['next-loop'].length > 0 ? 'Next Loop' : 'Next Chord'}
          </div>
        </button>
      )}

      {/* Expanded Panel */}
      {expanded && totalQueued > 0 && (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 border border-purple-500/50 rounded-xl shadow-2xl p-4 space-y-3 animate-slideIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-bold">Queued Changes</h4>
            </div>
            <div className="flex space-x-2">
              {totalQueued > 1 && (
                <button
                  onClick={onClearAll}
                  className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setExpanded(false)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all"
                title="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Next Loop Changes */}
          {byTiming['next-loop'].length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-300 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Will apply on next loop</span>
              </div>
              {byTiming['next-loop'].map(param => (
                <div
                  key={param.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2"
                >
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      {param.displayName}
                    </div>
                    <div className="text-blue-200 text-xs">
                      {formatValue(param.value)}
                    </div>
                  </div>
                  <button
                    onClick={() => onClearParameter(param.id)}
                    className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Next Chord Changes */}
          {byTiming['next-chord'].length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-300 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Will apply on next chord</span>
              </div>
              {byTiming['next-chord'].map(param => (
                <div
                  key={param.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2"
                >
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      {param.displayName}
                    </div>
                    <div className="text-green-200 text-xs">
                      {formatValue(param.value)}
                    </div>
                  </div>
                  <button
                    onClick={() => onClearParameter(param.id)}
                    className="p-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recently Applied Notification */}
      {showNotifications && recentlyApplied.length > 0 && (
        <div className="mt-2 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-sm font-medium">
              {recentlyApplied.length} change{recentlyApplied.length !== 1 ? 's' : ''} applied
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function formatValue(value: any): string {
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 'ON' : 'OFF';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
