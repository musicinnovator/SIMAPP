import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import {
  BlockPattern,
  ArpeggiatedPattern,
  BrokenPattern,
  VoicingTechnique,
  TimeSignatureType,
  Subdivision
} from '../types/voicingPatterns';
import { useVoicingPatterns } from '../hooks/useVoicingPatterns';
import {
  validateBlockPattern,
  validateArpeggiatedPattern,
  validateBrokenPattern
} from '../utils/patternValidator';

interface CustomPatternEditorProps {
  isOpen: boolean;
  onClose: () => void;
  patternType: VoicingTechnique;
}

export default function CustomPatternEditor({
  isOpen,
  onClose,
  patternType
}: CustomPatternEditorProps) {
  const { savePattern } = useVoicingPatterns();

  const [patternName, setPatternName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [arpeggioSequence, setArpeggioSequence] = useState('1-3-5-3');
  const [arpeggioSubdivision, setArpeggioSubdivision] = useState<Subdivision>('sixteenth');

  const [timeSignature, setTimeSignature] = useState<TimeSignatureType>('4/4');

  const resetForm = () => {
    setPatternName('');
    setDescription('');
    setArpeggioSequence('1-3-5-3');
    setArpeggioSubdivision('sixteenth');
    setTimeSignature('4/4');
    setValidationErrors([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setValidationErrors([]);
    setSaving(true);

    try {
      let patternData: BlockPattern | ArpeggiatedPattern | BrokenPattern;
      let validation;

      if (patternType === 'arpeggiated') {
        patternData = {
          id: `custom-arp-${Date.now()}`,
          name: patternName,
          description,
          sequence: arpeggioSequence,
          subdivision: arpeggioSubdivision,
          isCustom: true
        };
        validation = validateArpeggiatedPattern(patternData);
      } else if (patternType === 'block') {
        patternData = {
          id: `custom-block-${Date.now()}`,
          name: patternName,
          description,
          timeSignature,
          durations: [
            { subdivision: 'quarter', beats: 1, relativePosition: 0 },
            { subdivision: 'quarter', beats: 1, relativePosition: 0.25 },
            { subdivision: 'quarter', beats: 1, relativePosition: 0.5 },
            { subdivision: 'quarter', beats: 1, relativePosition: 0.75 }
          ],
          isCustom: true
        };
        validation = validateBlockPattern(patternData);
      } else {
        patternData = {
          id: `custom-broken-${Date.now()}`,
          name: patternName,
          description,
          rhythmTemplate: [
            { subdivision: 'eighth', beats: 0.5, relativePosition: 0 },
            { subdivision: 'eighth', beats: 0.5, relativePosition: 0.5 }
          ],
          accentPlacement: [1.0, 0.7],
          isCustom: true
        };
        validation = validateBrokenPattern(patternData);
      }

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setSaving(false);
        return;
      }

      const result = await savePattern(patternType, patternName, patternData);

      if (result.success) {
        handleClose();
      } else {
        setValidationErrors([result.error || 'Failed to save pattern']);
      }
    } catch (error) {
      console.error('Error saving pattern:', error);
      setValidationErrors(['An unexpected error occurred']);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Custom {patternType.charAt(0).toUpperCase() + patternType.slice(1)} Pattern
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Validation Errors</h4>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Name *
            </label>
            <input
              type="text"
              value={patternName}
              onChange={(e) => setPatternName(e.target.value)}
              placeholder="e.g., My Custom Pattern"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your pattern..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {patternType === 'arpeggiated' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arpeggio Sequence *
                </label>
                <input
                  type="text"
                  value={arpeggioSequence}
                  onChange={(e) => setArpeggioSequence(e.target.value)}
                  placeholder="e.g., 1-3-5-3 or 1-5-3-1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use numbers separated by dashes. Valid values: 1 (root), 3 (third), 5 (fifth), 7 (seventh), 8 (octave)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdivision
                </label>
                <select
                  value={arpeggioSubdivision}
                  onChange={(e) => setArpeggioSubdivision(e.target.value as Subdivision)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="whole">Whole Notes</option>
                  <option value="half">Half Notes</option>
                  <option value="quarter">Quarter Notes</option>
                  <option value="eighth">Eighth Notes</option>
                  <option value="sixteenth">Sixteenth Notes</option>
                  <option value="triplet-quarter">Quarter Triplets</option>
                  <option value="triplet-eighth">Eighth Triplets</option>
                </select>
              </div>
            </>
          )}

          {patternType === 'block' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Signature
              </label>
              <select
                value={timeSignature}
                onChange={(e) => setTimeSignature(e.target.value as TimeSignatureType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2/4">2/4</option>
                <option value="3/4">3/4</option>
                <option value="4/4">4/4</option>
                <option value="5/4">5/4</option>
                <option value="6/8">6/8</option>
                <option value="7/8">7/8</option>
                <option value="9/8">9/8</option>
                <option value="12/8">12/8</option>
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Note: Advanced rhythm customization coming soon. This will create a standard pattern for your selected time signature.
              </p>
            </div>
          )}

          {patternType === 'broken' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                This will create a standard broken chord pattern. Advanced customization (rhythm templates, accents, micro-timing) coming soon.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!patternName.trim() || saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Pattern'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
