import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { formatDuration } from '../utils/time';
import { DEFAULT_DAILY_GOAL } from '../constants';

const DailyGoal = ({ data, onUpdateGoal }) => {

  const goalMs = (data?.dailyGoal || DEFAULT_DAILY_GOAL) * 60 * 60 * 1000;
  const studiedMs = data?.totalStudiedToday || 0;
  const progress = Math.min((studiedMs / goalMs) * 100, 100);
  const isCompleted = progress >= 100;

  const handleGoalChange = (e) => {
    const newGoal = parseFloat(e.target.value);
    if (newGoal > 0 && onUpdateGoal) {
      onUpdateGoal(newGoal);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-white" />
        <h2 className="text-xl font-semibold text-white">Daily Goal</h2>
      </div>

      {/* Goal Setting */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-white font-medium">Goal:</label>
        <input
          type="number"
          min="0.5"
          max="24"
          step="0.5"
          value={data?.dailyGoal || DEFAULT_DAILY_GOAL}
          onChange={handleGoalChange}
          className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white w-20 text-center"
        />
        <span className="text-white">hours</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/80 mb-2">
          <span>{formatDuration(studiedMs)}</span>
          <span>{formatDuration(goalMs)}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${isCompleted
              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
              : 'bg-gradient-to-r from-blue-400 to-purple-500'
              }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-white/80 text-sm">{progress.toFixed(1)}% complete</span>
        </div>
      </div>

      {/* Status */}
      <div className={`text-center p-3 rounded-lg ${isCompleted
        ? 'bg-green-500/20 border border-green-400/30'
        : 'bg-blue-500/20 border border-blue-400/30'
        }`}>
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Goal Reached! 🎉</span>
          </div>
        ) : (
          <div className="text-blue-400 font-medium">
            {formatDuration(goalMs - studiedMs)} to go! 💪
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {formatDuration(studiedMs)}
          </div>
          <div className="text-white/70 text-sm">Studied Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {data?.todaySessions?.length || 0}
          </div>
          <div className="text-white/70 text-sm">Today's Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {data?.streak || 0}
          </div>
          <div className="text-white/70 text-sm">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default DailyGoal;