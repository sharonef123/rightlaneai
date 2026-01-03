
import React from 'react';

interface SheliAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isTalking?: boolean;
  className?: string;
}

const SheliAvatar: React.FC<SheliAvatarProps> = ({ size = 'md', isTalking = false, className = "" }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-xl ${isTalking ? 'animate-pulse scale-125' : ''}`}></div>
      
      {/* Character SVG */}
      <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="sheliBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Head/Body Capsule */}
        <rect x="25" y="20" width="50" height="60" rx="25" fill="url(#sheliBody)" className={isTalking ? 'animate-[bounce_2s_infinite]' : 'animate-[bounce_4s_infinite]'} />
        
        {/* Face Display */}
        <rect x="35" y="35" width="30" height="20" rx="5" fill="#0F172A" />
        
        {/* Eyes */}
        <g className="fill-blue-400">
          <circle cx="43" cy="45" r="2">
            <animate attributeName="opacity" values="1;1;0;1;1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="57" cy="45" r="2">
            <animate attributeName="opacity" values="1;1;0;1;1" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Mouth (Talk Animation) */}
        {isTalking ? (
          <path d="M45 50 Q50 55 55 50" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round">
            <animate attributeName="d" values="M45 50 Q50 55 55 50; M45 50 Q50 45 55 50; M45 50 Q50 55 55 50" dur="0.5s" repeatCount="indefinite" />
          </path>
        ) : (
          <path d="M45 51 Q50 52 55 51" stroke="#60A5FA" strokeWidth="1" fill="none" strokeLinecap="round" />
        )}

        {/* Floating Particles Around */}
        <circle cx="15" cy="40" r="3" fill="#60A5FA" className="animate-ping opacity-40" />
        <circle cx="85" cy="60" r="2" fill="#93C5FD" className="animate-bounce opacity-40" />
      </svg>
      
      {/* Thinking Indicator */}
      {isTalking && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};

export default SheliAvatar;
