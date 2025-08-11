import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LiveClock from './LiveClock';
import StudyTimer from './StudyTimer';
import DailyGoal from './DailyGoal';
import SessionHistory from './SessionHistory';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { LogOut, User } from 'lucide-react';

const Dashboard = ({ user }) => {
  const { data, addSession, updateGoal } = useFirebaseData(user);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold">
                {user.displayName || user.email}
              </h1>
              <p className="text-white/70 text-sm">Welcome back!</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <LiveClock />
            <StudyTimer onSessionComplete={addSession} />
            <DailyGoal 
              data={data} 
              onUpdateGoal={updateGoal}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SessionHistory sessions={data.sessions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;