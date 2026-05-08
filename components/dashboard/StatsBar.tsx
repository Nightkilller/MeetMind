import { BarChart, CheckSquare, Clock, Users } from 'lucide-react';

interface StatsProps {
  stats: {
    totalMeetings: number;
    pendingActionItems: number;
    hoursSaved: string | number;
    meetingsThisWeek: number;
  };
}

export default function StatsBar({ stats }: StatsProps) {
  const statItems = [
    { label: 'Total Meetings', value: stats.totalMeetings, icon: BarChart },
    { label: 'Action Items', value: stats.pendingActionItems, icon: CheckSquare },
    { label: 'Hours Saved', value: stats.hoursSaved, icon: Clock },
    { label: 'This Week', value: stats.meetingsThisWeek, icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="card-elevated p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E6F2FB] flex items-center justify-center shrink-0">
              <Icon size={20} color="#0078D4" />
            </div>
            <div>
              <p className="text-h3 text-[#17253D] leading-tight mb-1">{item.value}</p>
              <p className="text-small text-[#262626]">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
