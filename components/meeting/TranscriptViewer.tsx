import React from 'react';
import { User } from 'lucide-react';
import type { Meeting } from '@/types';

export default function TranscriptViewer({
  transcript,
  participants = [],
}: {
  transcript?: string;
  participants?: string[];
}) {
  if (!transcript) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-body text-[#262626]">No transcript recorded for this meeting.</p>
      </div>
    );
  }

  // Very basic simulated speaker separation if transcript isn't pre-formatted
  // In a real scenario, Azure Speech SDK would provide speaker IDs
  const lines = transcript
    .split('\n')
    .filter((line) => line.trim().length > 0);

  const getSpeakerColor = (speakerName: string) => {
    const idx = participants.indexOf(speakerName);
    if (idx === -1) return 'speaker-0'; // Default
    return `speaker-${idx % 5}`;
  };

  return (
    <div className="space-y-6">
      {lines.map((line, i) => {
        // Attempt to parse "Speaker Name: Text" format
        const match = line.match(/^([^:]+):\s*(.+)$/);
        
        if (match) {
          const [, speaker, text] = match;
          const colorClass = getSpeakerColor(speaker);
          
          return (
            <div key={i} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#F4FAFD]`}>
                <User size={16} className={colorClass} />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-[14px] font-semibold ${colorClass}`}>{speaker}</span>
                  <span className="text-[11px] text-[#A0AAB2]">12:{15 + (i % 45)} PM</span>
                </div>
                <p className="text-body text-[#17253D] leading-relaxed">{text}</p>
              </div>
            </div>
          );
        }

        // Fallback for flat text
        return (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F4FAFD] flex items-center justify-center shrink-0">
              <User size={16} className="text-[#0078D4]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[14px] font-semibold text-[#0078D4]">Speaker</span>
              </div>
              <p className="text-body text-[#17253D] leading-relaxed">{line}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
