'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import MeetingCard from '@/components/meeting/MeetingCard';
import Spinner from '@/components/ui/Spinner';
import { useMeetings } from '@/hooks/useMeetings';
import { Video, Plus } from 'lucide-react';
import Link from 'next/link';

import { useState } from 'react';

export default function MeetingsPage() {
  const [dateFilter, setDateFilter] = useState('');
  const { meetings: allMeetings, isLoading } = useMeetings();

  const meetings = allMeetings.filter((m) => {
    if (!dateFilter) return true;
    const meetingDate = new Date(m.date || m.createdAt).toISOString().split('T')[0];
    return meetingDate === dateFilter;
  });

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto pt-[48px] pb-[72px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 text-[#17253D]">All Meetings</h1>
            <p className="text-body text-[#262626] mt-1">View and manage all your recorded meetings</p>
          </div>
          <Link href="/meeting/new" className="mm-btn mm-btn-primary">
            <Plus size={16} />
            New Meeting
          </Link>
        </div>

        <div className="mb-8">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mm-input w-full md:w-[200px] h-[48px] bg-white text-[#262626]"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center bg-[#F4FAFD] rounded-[24px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Video size={32} color="#0078D4" />
            </div>
            <div>
              <h3 className="text-h3 text-[#17253D] mb-2">No meetings yet</h3>
              <p className="text-body text-[#262626] max-w-sm mx-auto">
                Start your first meeting to see AI-powered insights here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map((m) => (
              <MeetingCard key={m._id} meeting={m} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
