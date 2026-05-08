import Link from 'next/link';
import { Calendar, Clock, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatDate, formatDuration } from '@/lib/utils';
import type { Meeting } from '@/types';

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const pendingActions = meeting.actionItems?.filter((a) => !a.completed).length || 0;
  const completedActions = meeting.actionItems?.filter((a) => a.completed).length || 0;
  const totalActions = (meeting.actionItems?.length || 0);

  return (
    <Link
      href={`/meeting/${meeting._id}`}
      className="card-elevated p-6 flex flex-col group transition-all duration-300 hover:shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1"
      style={{ textDecoration: 'none' }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-h6 text-[#17253D] line-clamp-1 pr-4">{meeting.title}</h3>
        <Badge variant={meeting.status} dot>{meeting.status}</Badge>
      </div>

      <p className="text-body text-[#262626] line-clamp-2 mb-6 flex-1">
        {meeting.summary || 'No summary available yet. Click to view transcript.'}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F2F2F2]">
        <div className="flex items-center gap-4 text-small text-[#262626]">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} color="#0078D4" />
            {formatDate(meeting.date || meeting.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} color="#0078D4" />
            {formatDuration(meeting.duration)}
          </span>
        </div>

        {totalActions > 0 && (
          <div className="flex items-center gap-2 text-small">
            <span className="flex items-center gap-1 text-[#008013]" title="Completed actions">
              <CheckCircle2 size={14} /> {completedActions}
            </span>
            {pendingActions > 0 && (
              <span className="flex items-center gap-1 text-[#795C00]" title="Pending actions">
                <Circle size={14} /> {pendingActions}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover arrow indicator */}
      <div className="absolute bottom-6 right-6 opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight size={18} color="#0078D4" />
      </div>
    </Link>
  );
}
