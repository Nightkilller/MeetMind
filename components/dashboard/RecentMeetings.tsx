'use client';

import MeetingCard from '@/components/meeting/MeetingCard';
import type { Meeting } from '@/types';

interface RecentMeetingsProps {
  meetings: Meeting[];
}

export default function RecentMeetings({ meetings }: RecentMeetingsProps) {
  if (!meetings.length) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Recent Meetings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetings.slice(0, 4).map((m) => (
          <MeetingCard key={m._id} meeting={m} />
        ))}
      </div>
    </div>
  );
}
