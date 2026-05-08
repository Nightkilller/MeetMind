'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import StatsBar from '@/components/dashboard/StatsBar';
import SearchBar from '@/components/dashboard/SearchBar';
import MeetingCard from '@/components/meeting/MeetingCard';
import Spinner from '@/components/ui/Spinner';
import { useMeetings } from '@/hooks/useMeetings';
import { calcHoursSaved } from '@/lib/utils';
import { Plus, Video, Brain } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [search, setSearch] = useState('');
  const { meetings, isLoading } = useMeetings(search);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-container flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
          <Brain size={32} color="#0078D4" />
        </div>
        <h1 className="text-h2 text-[#17253D]">Sign in to access your dashboard</h1>
        <p className="text-body text-[#262626] max-w-md">
          MeetMind uses Clerk to keep your meetings private and secure.
        </p>
        <SignInButton mode="modal">
          <button className="mm-btn mm-btn-primary px-8">Sign in to continue</button>
        </SignInButton>
      </div>
    );
  }

  // Compute stats
  const pendingActionItems = meetings.reduce(
    (acc, m) => acc + (m.actionItems?.filter((a) => !a.completed).length ?? 0),
    0
  );

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const meetingsThisWeek = meetings.filter((m) => new Date(m.createdAt) > weekAgo).length;

  const stats = {
    totalMeetings: meetings.length,
    pendingActionItems,
    hoursSaved: calcHoursSaved(meetings.length),
    meetingsThisWeek,
  };

  const firstName = user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'there';

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto pt-[48px] pb-[72px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 text-[#17253D]">
              Welcome back, {firstName}
            </h1>
            <p className="text-body text-[#262626] mt-1">Here&apos;s your meeting intelligence overview</p>
          </div>
          <Link
            href="/meeting/new"
            className="mm-btn mm-btn-primary"
          >
            <Plus size={16} />
            New Meeting
          </Link>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Search */}
        <div className="mb-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search meetings, summaries…" />
        </div>

        {/* Meeting grid */}
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
              <h3 className="text-h3 text-[#17253D] mb-2">
                {search ? 'No meetings found' : 'No meetings yet'}
              </h3>
              <p className="text-body text-[#262626] max-w-sm mx-auto">
                {search
                  ? `No results for "${search}". Try a different search.`
                  : 'Start your first meeting to see AI-powered insights here.'}
              </p>
            </div>
            {!search && (
              <Link href="/meeting/new" className="mm-btn mm-btn-primary mt-2">
                <Plus size={16} className="mr-1.5" />
                Start your first meeting
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 text-[#17253D]">
                {search ? `Results for "${search}"` : 'Recent Meetings'}
                <span className="ml-3 text-[18px] text-[#262626] font-normal">({meetings.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meetings.map((m) => (
                <MeetingCard key={m._id} meeting={m} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
