import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon } from 'lucide-react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isProductiveHour = () => {
    const hour = time.getHours();
    return hour >= 8 && hour <= 22; // 8 AM to 10 PM
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="text-center">
        <div className="text-5xl font-light text-white mb-2 font-mono">
          {formatTime(time)}
        </div>
        <div className="text-white/80 mb-4">
          {formatDate(time)}
        </div>
        
        <div className="flex items-center justify-center gap-2">
          {isProductiveHour() ? (
            <>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <Sun className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Productive Hours</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <Moon className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Rest Hours</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClock;