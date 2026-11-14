import React from 'react';

interface IOSStatusBarProps {
  variant?: 'light' | 'dark'; // 'light' means white elements (for dark/teal background), 'dark' means navy elements
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ variant = 'dark' }) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#0B2E40]';
  const fillClass = isLight ? 'fill-white' : 'fill-[#0B2E40]';
  const strokeClass = isLight ? 'stroke-white' : 'stroke-[#0B2E40]';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-1 select-none text-xs font-semibold ${textColor}`}>
      {/* Time */}
      <span className="tracking-tight text-sm font-bold">9:41</span>

      {/* Status Icons */}
      <div className="flex items-center space-x-1.5">
        {/* Cellular Bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0.5" y="8" width="2.5" height="3" rx="0.5" className={fillClass} />
          <rect x="4.5" y="6" width="2.5" height="5" rx="0.5" className={fillClass} />
          <rect x="8.5" y="3.5" width="2.5" height="7.5" rx="0.5" className={fillClass} />
          <rect x="12.5" y="0.5" width="2.5" height="10.5" rx="0.5" className={fillClass} />
        </svg>

        {/* Wi-Fi Icon */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M0.5 2.5C4.5 -0.8 10.5 -0.8 14.5 2.5" className={strokeClass} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 5.5C5.8 3.2 9.2 3.2 12 5.5" className={strokeClass} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="7.5" cy="9.5" r="1.2" className={fillClass} />
        </svg>

        {/* Battery Icon */}
        <div className="flex items-center">
          <div className={`w-5 h-2.5 rounded-sm border ${isLight ? 'border-white' : 'border-[#0B2E40]'} p-0.5 flex items-center`}>
            <div className={`w-3 h-1.5 rounded-[1px] ${isLight ? 'bg-white' : 'bg-[#0B2E40]'}`}></div>
          </div>
          <div className={`w-0.5 h-1 rounded-r-sm ${isLight ? 'bg-white' : 'bg-[#0B2E40]'} ml-[1px]`}></div>
        </div>
      </div>
    </div>
  );
};
