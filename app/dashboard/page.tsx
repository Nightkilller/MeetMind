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
import { Plus, Video, Brain, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const { meetings: allMeetings, isLoading } = useMeetings(search);

  const meetings = allMeetings.filter((m) => {
    if (!dateFilter) return true;
    const meetingDate = new Date(m.date || m.createdAt).toISOString().split('T')[0];
    return meetingDate === dateFilter;
  });

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

  const overdueActionItems = allMeetings.flatMap(m => m.actionItems || [])
    .filter(a => {
      if (a.completed || !a.dueDate || a.dueDate === 'Not specified') return false;
      const dueDate = new Date(a.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate <= today;
    });

  const overdueCount = overdueActionItems.length;

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

        {/* Action Items Alert Banner */}
        {overdueCount > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-[#FDF3F4] border border-[#D13438] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#D13438]/10 flex items-center justify-center shrink-0">
              <AlertCircle size={20} color="#D13438" />
            </div>
            <div className="flex-1">
              <h3 className="text-small font-bold text-[#D13438]">Action Items Require Attention</h3>
              <p className="text-[13px] text-[#A4262C] mt-0.5">
                You have {overdueCount} pending action item{overdueCount !== 1 && 's'} that {overdueCount === 1 ? 'is' : 'are'} overdue or due today.
              </p>
            </div>
            <Link 
              href="/action-items" 
              className="ml-auto mm-btn bg-white text-[#D13438] hover:bg-[#FDF3F4] border border-[#D13438]/30 transition-all shrink-0"
              style={{ height: '36px', padding: '0 16px', fontSize: '13px' }}
            >
              View Actions
            </Link>
          </div>
        )}

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search meetings, summaries…" />
          </div>
          <div className="w-full md:w-[200px]">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mm-input w-full h-[48px] bg-white text-[#262626]"
            />
          </div>
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
