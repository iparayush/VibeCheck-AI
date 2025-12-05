import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VibeCheck Logo"
    >
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" /> {/* Purple-500 */}
          <stop offset="100%" stopColor="#ec4899" /> {/* Pink-500 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Circle Ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke="url(#brandGradient)" 
        strokeWidth="4" 
        strokeOpacity="0.3" 
      />

      {/* Animated Checkmark / Waveform */}
      {/* Left bar of checkmark */}
      <rect 
        x="28" y="45" width="8" height="15" rx="4" 
        fill="url(#brandGradient)" 
        className="animate-[pulse_1.5s_ease-in-out_infinite]" 
        style={{ animationDelay: '0s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      
      {/* Middle bar (bottom of check) */}
      <rect 
        x="40" y="55" width="8" height="15" rx="4" 
        fill="url(#brandGradient)" 
        className="animate-[pulse_1.5s_ease-in-out_infinite]" 
        style={{ animationDelay: '0.2s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />

      {/* Right bar (top of check) */}
      <rect 
        x="52" y="35" width="8" height="30" rx="4" 
        fill="url(#brandGradient)" 
        className="animate-[pulse_1.5s_ease-in-out_infinite]" 
        style={{ animationDelay: '0.4s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      
      {/* Far right accent */}
      <rect 
        x="64" y="25" width="8" height="15" rx="4" 
        fill="url(#brandGradient)" 
        fillOpacity="0.6"
        className="animate-[pulse_1.5s_ease-in-out_infinite]" 
        style={{ animationDelay: '0.6s', transformBox: 'fill-box', transformOrigin: 'center' }}
      />

    </svg>
  );
};
