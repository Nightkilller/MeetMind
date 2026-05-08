import type { Meeting } from '@/types';

export default function SummaryPanel({ meeting }: { meeting: Meeting }) {
  if (!meeting.summary && !meeting.keyDecisions?.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <p className="text-body text-[#262626] max-w-[200px]">
          No summary available. Analysis is either pending or failed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      {meeting.summary && (
        <section>
          <h3 className="text-small font-bold text-[#0078D4] uppercase tracking-wider mb-3">Executive Summary</h3>
          <div className="text-body text-[#17253D] leading-relaxed whitespace-pre-wrap">
            {meeting.summary}
          </div>
        </section>
      )}

      {/* Key Decisions */}
      {meeting.keyDecisions && meeting.keyDecisions.length > 0 && (
        <section>
          <h3 className="text-small font-bold text-[#0078D4] uppercase tracking-wider mb-3">Key Decisions</h3>
          <ul className="space-y-3">
            {meeting.keyDecisions.map((decision, i) => (
              <li key={i} className="flex items-start gap-3 text-body text-[#17253D]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#0078D4] shrink-0 mt-2" />
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Metadata */}
      {meeting.sentiment && (
        <section className="pt-4 border-t border-[#F2F2F2]">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-small text-[#262626] mb-1">Overall Sentiment</p>
              <p className="text-body font-semibold text-[#17253D] capitalize">
                {meeting.sentiment}
              </p>
            </div>
            {meeting.meetingType && (
              <div>
                <p className="text-small text-[#262626] mb-1">Meeting Type</p>
                <p className="text-body font-semibold text-[#17253D] capitalize">
                  {meeting.meetingType}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
