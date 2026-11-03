import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-2 border-white/20 rounded-lg w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg shadow-purple-500/50">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Confirm Action</h3>
            <p className="text-gray-300">{message}</p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onCancel}
              className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 border border-white/20"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>

            <button
              onClick={onConfirm}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-500/50"
            >
              <Check className="w-5 h-5" />
              <span>Apply</span>
            </button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-center text-gray-400">
            You can always cancel or revert changes later
          </p>
        </div>
      </div>
    </div>
  );
}
