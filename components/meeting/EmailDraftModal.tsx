import React from 'react';
import { X, Copy, Send } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  emailDraft: string;
  meetingId: string;
  onSave: (draft: string) => void;
}

export default function EmailDraftModal({ isOpen, onClose, emailDraft, meetingId, onSave }: Props) {
  const [draft, setDraft] = React.useState(emailDraft);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setDraft(emailDraft);
  }, [emailDraft]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(draft);
    if (ok) toast.success('Email copied to clipboard!');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailDraft: draft }),
      });
      if (!res.ok) throw new Error('Failed to save');
      onSave(draft);
      toast.success('Email draft saved');
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMailTo = () => {
    // Basic mailto generation
    const subject = encodeURIComponent('Meeting Follow-up');
    const body = encodeURIComponent(draft);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#17253D]/40 backdrop-blur-sm">
      <div 
        className="card-elevated w-full max-w-2xl bg-white border border-[#F2F2F2] flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F2F2F2]">
          <div>
            <h2 className="text-h3 text-[#17253D] leading-tight mb-1">Follow-up Email</h2>
            <p className="text-small text-[#262626]">Generated from meeting summary and action items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#262626] hover:bg-[#F2F2F2] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="mm-input h-full min-h-[400px] resize-none text-body"
            placeholder="Loading draft..."
            style={{ fontFamily: 'var(--font-sans)', height: '100%' }}
          />
        </div>
        
        <div className="p-6 border-t border-[#F2F2F2] bg-[#F9F8FC] flex items-center justify-between gap-4 rounded-b-[24px]">
          <button
            onClick={handleSave}
            disabled={isSaving || draft === emailDraft}
            className="mm-btn mm-btn-secondary"
            style={{ height: '44px' }}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 mm-btn mm-btn-secondary"
              style={{ height: '44px' }}
            >
              <Copy size={16} /> Copy
            </button>
            <button
              onClick={handleMailTo}
              className="flex items-center gap-2 mm-btn mm-btn-primary"
              style={{ height: '44px' }}
            >
              <Send size={16} /> Open in Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
