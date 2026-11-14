import React from 'react';

interface KidneyIconProps {
  className?: string;
  color?: string;
  size?: number;
}

export const KidneyIcon: React.FC<KidneyIconProps> = ({ 
  className = '', 
  color = '#12617A',
  size = 64 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central Arterial & Venous Vasculature */}
      <path 
        d="M48 28V72" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      <path 
        d="M52 28V72" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      
      {/* Left Kidney Bean Contour */}
      <path 
        d="M48 38C48 38 41 33 32 35C22 37 19 46 19 55C19 66 25 73 34 72C42 71 47 62 48 58C48 54 44 49 44 46C44 42 48 38 48 38Z" 
        stroke={color} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Left Kidney Hilum Notch & Vascular Branch */}
      <path 
        d="M26 44C24 48 24 53 25 57" 
        stroke={color} 
        strokeWidth="2.8" 
        strokeLinecap="round" 
      />
      <path 
        d="M40 48C36 49 33 53 34 57" 
        stroke={color} 
        strokeWidth="2.8" 
        strokeLinecap="round" 
      />

      {/* Right Kidney Bean Contour */}
      <path 
        d="M52 38C52 38 59 33 68 35C78 37 81 46 81 55C81 66 75 73 66 72C58 71 53 62 52 58C52 54 56 49 56 46C56 42 52 38 52 38Z" 
        stroke={color} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Right Kidney Hilum Notch & Branch */}
      <path 
        d="M74 44C76 48 76 53 75 57" 
        stroke={color} 
        strokeWidth="2.8" 
        strokeLinecap="round" 
      />
      <path 
        d="M60 48C64 49 67 53 66 57" 
        stroke={color} 
        strokeWidth="2.8" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
