'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import PageWrapper from '@/components/layout/PageWrapper';
import TranscriptViewer from '@/components/meeting/TranscriptViewer';
import SummaryPanel from '@/components/meeting/SummaryPanel';
import ActionItemsList from '@/components/meeting/ActionItemsList';
import EmailDraftModal from '@/components/meeting/EmailDraftModal';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useMeeting } from '@/hooks/useMeetings';
import { formatDate, formatDurationLong, copyToClipboard } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import {
  Mail,
  Copy,
  Printer,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ActionItem } from '@/types';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const id = params.id as string;

  const { meeting, isLoading, error, mutate } = useMeeting(id);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'actions'>('summary');

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-container">
        <p className="text-body text-[#262626]">Please sign in to view this meeting.</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center bg-container">
        <AlertCircle size={48} color="#D13438" />
        <h2 className="text-h3 text-[#17253D]">Meeting not found</h2>
        <button onClick={() => router.back()} className="mm-btn mm-btn-secondary px-6">
          <ArrowLeft size={16} className="mr-2" />
          Go back
        </button>
      </div>
    );
  }

  const handleGenerateEmail = async () => {
    setGeneratingEmail(true);
    try {
      const res = await fetch('/api/email-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: meeting.summary,
          actionItems: meeting.actionItems,
          participants: meeting.participants,
          meetingTitle: meeting.title,
        }),
      });
      const { emailDraft: draft, error: err } = await res.json();
      if (err) throw new Error(err);
      setEmailDraft(draft || meeting.emailDraft || '');
      setEmailModalOpen(true);
    } catch {
      toast.error('Failed to generate email draft');
    } finally {
      setGeneratingEmail(false);
    }
  };

  const handleCopySummary = async () => {
    const ok = await copyToClipboard(meeting.summary || 'No summary available');
    if (ok) toast.success('Summary copied!');
  };

  const handleExportPDF = () => window.print();

  const handleActionUpdate = (updated: ActionItem[]) => {
    mutate({ meeting: { ...meeting, actionItems: updated } }, false);
  };

  const tabs: { id: 'summary' | 'transcript' | 'actions'; label: string; count?: number }[] = [
    { id: 'summary', label: 'Summary', count: meeting.keyDecisions?.length },
    { id: 'transcript', label: 'Transcript' },
    { id: 'actions', label: 'Actions', count: meeting.actionItems?.filter((a) => !a.completed).length },
  ];

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto py-[32px] px-6">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-[#262626] hover:bg-[#F2F2F2] transition-all shrink-0 mt-1"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-h2 text-[#17253D] truncate leading-tight">{meeting.title}</h1>
                <Badge variant={meeting.status} dot>{meeting.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-small text-[#262626]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} color="#0078D4" />
                  {formatDate(meeting.date || meeting.createdAt)}
                </span>
                {meeting.duration > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} color="#0078D4" />
                    {formatDurationLong(meeting.duration)}
                  </span>
                )}
                {meeting.participants?.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} color="#0078D4" />
                    {meeting.participants.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-2 mm-btn mm-btn-ghost"
              style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}
            >
              <Copy size={16} />
              Copy
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 mm-btn mm-btn-secondary"
              style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}
            >
              <Printer size={16} />
              PDF
            </button>
            <button
              onClick={handleGenerateEmail}
              disabled={generatingEmail}
              className="flex items-center gap-2 mm-btn mm-btn-primary"
              style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}
            >
              {generatingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              Email Draft
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-2 p-1 bg-[#F9F8FC] rounded-lg border border-[#F2F2F2] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-[14px] font-semibold rounded-[4px] transition-all ${
                activeTab === tab.id ? 'bg-white text-[#0078D4] shadow-sm' : 'text-[#262626] hover:bg-[#F2F2F2]'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 text-[11px] bg-[#E6F2FB] text-[#0067B8] px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Desktop 3-panel */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          <div className="card-elevated flex flex-col overflow-hidden bg-white border border-[#F2F2F2] shadow-sm">
            <div className="px-6 py-4 border-b border-[#F2F2F2] shrink-0 bg-[#F9F8FC]">
              <h2 className="text-h6 text-[#17253D]">Full Transcript</h2>
              <p className="text-small text-[#262626] mt-1">
                {meeting.transcript
                  ? `~${Math.ceil(meeting.transcript.split(' ').length / 130)} min read`
                  : 'No transcript'}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <TranscriptViewer transcript={meeting.transcript} participants={meeting.participants} />
            </div>
          </div>

          <div className="card-elevated flex flex-col overflow-hidden bg-white border border-[#F2F2F2] shadow-sm">
            <div className="px-6 py-4 border-b border-[#F2F2F2] shrink-0 bg-[#F9F8FC]">
              <h2 className="text-h6 text-[#17253D]">AI Summary</h2>
              <p className="text-small text-[#262626] mt-1">Generated by Groq Llama 3.3 70B</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <SummaryPanel meeting={meeting} />
            </div>
          </div>

          <div className="card-elevated flex flex-col overflow-hidden bg-white border border-[#F2F2F2] shadow-sm">
            <div className="px-6 py-4 border-b border-[#F2F2F2] shrink-0 bg-[#F9F8FC]">
              <h2 className="text-h6 text-[#17253D]">Action Items</h2>
              <p className="text-small text-[#262626] mt-1">
                {meeting.actionItems?.filter((a) => !a.completed).length ?? 0} pending
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ActionItemsList
                items={meeting.actionItems ?? []}
                meetingId={meeting._id}
                onUpdate={handleActionUpdate}
              />
            </div>
          </div>
        </div>

        {/* Mobile single panel */}
        <div className="lg:hidden card-elevated p-6 min-h-[400px] bg-white border border-[#F2F2F2] shadow-sm">
          {activeTab === 'transcript' && (
            <TranscriptViewer transcript={meeting.transcript} participants={meeting.participants} />
          )}
          {activeTab === 'summary' && <SummaryPanel meeting={meeting} />}
          {activeTab === 'actions' && (
            <ActionItemsList
              items={meeting.actionItems ?? []}
              meetingId={meeting._id}
              onUpdate={handleActionUpdate}
            />
          )}
        </div>
      </div>

      <EmailDraftModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        emailDraft={emailDraft}
        meetingId={meeting._id}
        meetingTitle={meeting.title}
        onSave={(draft) => mutate({ meeting: { ...meeting, emailDraft: draft } }, false)}
      />
    </PageWrapper>
  );
}
