import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
        <div className="text-white font-bold text-lg tracking-wider">
          <div className="text-center">THE</div>
          <div className="text-center">GENIUS</div>
        </div>
      </div>
    </div>
  );
};

export default Logo;