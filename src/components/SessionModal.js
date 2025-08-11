import React, { useState } from 'react';
import { X, Save, SkipForward } from 'lucide-react';

const SessionModal = ({ isOpen, onClose, onSave, sessionData }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleSave = () => {
    onSave(notes.trim());
    setNotes('');
  };

  const handleSkip = () => {
    onSave('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Session Complete! 🎉</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            You studied for{' '}
            <span className="font-semibold text-blue-600">
              {sessionData ? formatDuration(sessionData.duration) : '0m'}
            </span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you study? (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Finished Chapter 4 of Physics - Thermodynamics"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Session
          </button>
          <button
            onClick={handleSkip}
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;