import React from 'react';

const UserIcon = ({ size = 150, color = "#666" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 600 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        minWidth: size,
        minHeight: size
      }}
    >
      <path
        d="M300 0C134.4 0 0 134.4 0 300C0 465.6 134.4 600 300 600C465.6 600 600 465.6 600 300C600 134.4 465.6 0 300 0ZM300 90C364.8 90 420 145.2 420 210C420 274.8 364.8 330 300 330C235.2 330 180 274.8 180 210C180 145.2 235.2 90 300 90ZM300 540C225 540 157.5 507 111 456C111.9 378 267 334.5 300 334.5C332.7 334.5 488.1 378 489 456C442.5 507 375 540 300 540Z"
        fill={color}
      />
      <defs>
        <linearGradient
          id="userIconGradient"
          x1="0"
          y1="0"
          x2="600"
          y2="600"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default UserIcon; 