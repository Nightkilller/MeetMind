'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
}: CardProps) {
  const padClass = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' }[padding];

  return (
    <div
      onClick={onClick}
      className={`glass rounded-xl ${padClass} ${
        hover
          ? 'cursor-pointer transition-all duration-200 hover:border-blue-500/30 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
