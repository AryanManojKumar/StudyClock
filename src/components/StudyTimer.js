import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import SessionModal from './SessionModal';
import { formatTime } from '../utils/time';
import { MIN_SESSION_DURATION } from '../constants';

const StudyTimer = ({ onSessionComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - startTime - pausedTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, startTime, pausedTime]);

  const handleStart = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      setIsRunning(true);
    } else {
      // Start new session
      const now = Date.now();
      setStartTime(now);
      setPausedTime(0);
      setElapsedTime(0);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
    setPausedTime(prev => prev + (Date.now() - startTime - prev));
  };

  const handleStop = () => {
    if (!startTime) return;
    
    const totalTime = elapsedTime;
    const minutes = Math.floor(totalTime / 60000);
    
    if (totalTime < MIN_SESSION_DURATION) {
      alert('Session too short! Minimum 1 minute required.');
      handleReset();
      return;
    }

    setSessionData({
      duration: totalTime,
      startTime: new Date(startTime),
      endTime: new Date()
    });
    setShowModal(true);
    handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setStartTime(null);
    setPausedTime(0);
    setElapsedTime(0);
  };

  const handleSessionSave = (notes) => {
    if (sessionData && onSessionComplete) {
      onSessionComplete({
        ...sessionData,
        notes: notes || 'No notes added'
      });
    }
    setShowModal(false);
    setSessionData(null);
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">Study Session</h2>
        
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-light text-white mb-4">
            {formatTime(elapsedTime)}
          </div>
          
          <div className="flex justify-center gap-4">
            {!isRunning && !isPaused ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                Start
              </button>
            ) : (
              <>
                {isRunning ? (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </button>
                )}
                
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <SessionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSessionSave}
        sessionData={sessionData}
      />
    </>
  );
};

export default StudyTimer;