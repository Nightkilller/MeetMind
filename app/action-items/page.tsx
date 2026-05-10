'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import Spinner from '@/components/ui/Spinner';
import { useMeetings } from '@/hooks/useMeetings';
import ActionItemsList from '@/components/meeting/ActionItemsList';
import { CheckSquare } from 'lucide-react';

export default function ActionItemsPage() {
  const { meetings, isLoading, mutate } = useMeetings();

  const meetingsWithActions = meetings.filter(m => m.actionItems && m.actionItems.length > 0);

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto pt-[48px] pb-[72px]">
        <div className="mb-8">
          <h1 className="text-h2 text-[#17253D]">All Action Items</h1>
          <p className="text-body text-[#262626] mt-1">Track and manage tasks across all your meetings</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : meetingsWithActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center bg-[#F4FAFD] rounded-[24px]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <CheckSquare size={32} color="#0078D4" />
            </div>
            <div>
              <h3 className="text-h3 text-[#17253D] mb-2">No action items yet</h3>
              <p className="text-body text-[#262626] max-w-sm mx-auto">
                Once you record a meeting, AI will automatically extract action items here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {meetingsWithActions.map((meeting) => (
              <div key={meeting._id} className="bg-white p-6 rounded-[16px] shadow-sm border border-[#E6E6E6]">
                <h3 className="text-h4 text-[#17253D] mb-4">{meeting.title}</h3>
                <ActionItemsList 
                  items={meeting.actionItems || []} 
                  meetingId={meeting._id} 
                  onUpdate={() => mutate()} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
