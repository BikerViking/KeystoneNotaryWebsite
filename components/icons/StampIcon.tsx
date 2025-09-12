import React from 'react';

const StampIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M5 5v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15 11h.01M14 14h.01M11 14h.01M10 11h.01M7 11h.01M7 14h.01" 
        />
         <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9 3v2m6-2v2" 
        />
    </svg>
);

export default StampIcon;
