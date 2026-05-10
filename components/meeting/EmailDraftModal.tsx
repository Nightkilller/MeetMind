import React, { useState } from 'react';
import { X, Copy, Send } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  emailDraft: string;
  meetingId: string;
  onSave: (draft: string) => void;
  meetingTitle?: string;
}

export default function EmailDraftModal({ isOpen, onClose, emailDraft, meetingId, onSave, meetingTitle = 'Meeting Follow-up' }: Props) {
  const [draft, setDraft] = useState(emailDraft);
  const [toEmail, setToEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const handleSend = async () => {
    if (!toEmail) {
      toast.error('Please enter a recipient email');
      return;
    }

    setIsSending(true);
    try {
      // Try to parse subject from draft, otherwise use meetingTitle
      const lines = draft.split('\n');
      const subjectLine = lines.find(l => l.startsWith('Subject:'));
      const subject = subjectLine
        ? subjectLine.replace('Subject:', '').trim()
        : `Meeting Follow-up: ${meetingTitle}`;

      const body = lines
        .filter(l => !l.startsWith('Subject:'))
        .join('\n')
        .trim();

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: toEmail,
          subject: subject,
          message: body,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSent(true);
      toast.success('Email sent successfully via EmailJS!');
      setTimeout(() => {
        onClose();
        setSent(false); // Reset state
      }, 2000);
    } catch (err: any) {
      toast.error('Failed to send email. Check EmailJS config.');
      console.error('EmailJS Error:', err);
    } finally {
      setIsSending(false);
    }
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
            <p className="text-small text-[#262626]">Send directly to participants via EmailJS</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#262626] hover:bg-[#F2F2F2] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="block text-small font-semibold text-[#17253D] mb-2">Recipient Email (To)</label>
            <input
              type="email"
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              placeholder="participant@example.com"
              className="mm-input w-full bg-white border border-[#E6E6E6] text-[#262626]"
            />
          </div>
          
          <div className="h-full min-h-[300px]">
            <label className="block text-small font-semibold text-[#17253D] mb-2">Email Draft</label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mm-input w-full h-[calc(100%-24px)] resize-none text-body bg-[#F9F8FC] border-[#E6E6E6]"
              placeholder="Loading draft..."
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-[#F2F2F2] bg-[#F9F8FC] flex items-center justify-between gap-4 rounded-b-[24px]">
          <button
            onClick={handleSave}
            disabled={isSaving || draft === emailDraft}
            className="mm-btn mm-btn-ghost"
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
              onClick={handleSend}
              disabled={isSending || sent || !toEmail}
              className="flex items-center gap-2 mm-btn mm-btn-primary"
              style={{ height: '44px' }}
            >
              {isSending ? (
                <>Sending...</>
              ) : sent ? (
                <>Sent!</>
              ) : (
                <><Send size={16} /> Send via EmailJS</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
