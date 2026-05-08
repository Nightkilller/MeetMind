import React, { useState } from 'react';
import { User, Calendar, Check, AlertCircle } from 'lucide-react';
import type { ActionItem } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
  items: ActionItem[];
  meetingId: string;
  onUpdate: (items: ActionItem[]) => void;
}

export default function ActionItemsList({ items, meetingId, onUpdate }: Props) {
  const [updating, setUpdating] = useState<string | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <p className="text-body text-[#262626]">No action items extracted from this meeting.</p>
      </div>
    );
  }

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    setUpdating(itemId);
    
    // Optimistic update
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: !currentStatus } : item
    );
    onUpdate(updatedItems);

    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionItems: updatedItems }),
      });

      if (!res.ok) throw new Error('Failed to update action item');
    } catch (error) {
      toast.error('Failed to save status');
      // Revert optimistic update
      onUpdate(items);
    } finally {
      setUpdating(null);
    }
  };

  const getPriorityColors = (priority: string, completed: boolean) => {
    if (completed) return { text: '#008013', bg: 'rgba(0, 255, 38, 0.15)', border: 'rgba(0, 255, 38, 0.3)' };
    switch (priority.toLowerCase()) {
      case 'high': return { text: '#D13438', bg: '#FDF3F4', border: '#D13438' };
      case 'medium': return { text: '#795C00', bg: '#FFF4CE', border: '#F2C811' };
      case 'low': return { text: '#008272', bg: '#E6F3F1', border: '#008272' };
      default: return { text: '#262626', bg: '#F2F2F2', border: '#A0AAB2' };
    }
  };

  // Sort by incomplete first, then priority (high > medium > low)
  const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
  
  const sortedItems = [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const weightA = priorityWeight[a.priority?.toLowerCase()] || 0;
    const weightB = priorityWeight[b.priority?.toLowerCase()] || 0;
    return weightB - weightA;
  });

  return (
    <div className="space-y-4">
      {sortedItems.map((item) => {
        const pColors = getPriorityColors(item.priority, !!item.completed);
        
        return (
          <div 
            key={item.id} 
            className={`p-4 rounded-lg border transition-all ${
              item.completed 
                ? 'bg-[#F9F8FC] border-[#F2F2F2] opacity-75' 
                : 'bg-white border-[#E6E6E6] hover:border-[#0078D4]'
            }`}
          >
            <div className="flex gap-4">
              <button
                onClick={() => handleToggle(item.id, !!item.completed)}
                disabled={updating === item.id}
                className={`w-[20px] h-[20px] rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  item.completed 
                    ? 'bg-[#0078D4] border-[#0078D4]' 
                    : 'border-[#262626] hover:border-[#0078D4]'
                }`}
              >
                {item.completed && <Check size={14} className="text-white" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-body leading-snug mb-3 ${
                  item.completed ? 'text-[#262626] line-through' : 'text-[#17253D] font-medium'
                }`}>
                  {item.text}
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span 
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] uppercase tracking-wider"
                    style={{ color: pColors.text, backgroundColor: pColors.bg, border: `1px solid ${pColors.border}` }}
                  >
                    {item.completed ? 'Done' : item.priority}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-small text-[#262626]">
                    <User size={14} className="text-[#0078D4]" />
                    <span className="truncate max-w-[120px]">{item.owner}</span>
                  </div>
                  
                  {item.dueDate && item.dueDate !== 'Not specified' && (
                    <div className="flex items-center gap-1.5 text-small text-[#262626]">
                      <Calendar size={14} className="text-[#0078D4]" />
                      <span>{item.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
