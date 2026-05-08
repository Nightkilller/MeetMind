'use client';

import React from 'react';
import type { MeetingStatus, Priority } from '@/types';

type BadgeVariant = MeetingStatus | Priority | 'default' | 'blue' | 'purple' | 'cyan';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  // Status
  completed: 'badge-success',
  recording: 'badge-danger',
  processing: 'badge-warning',
  failed: 'badge-danger',
  // Priority
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
  // Generic
  default: 'badge-neutral',
  blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
};

const dotColors: Record<BadgeVariant, string> = {
  completed: 'bg-emerald-400',
  recording: 'bg-red-400 animate-pulse',
  processing: 'bg-amber-400 animate-pulse',
  failed: 'bg-red-400',
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
  default: 'bg-slate-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  cyan: 'bg-cyan-400',
};

export default function Badge({
  variant = 'default',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
