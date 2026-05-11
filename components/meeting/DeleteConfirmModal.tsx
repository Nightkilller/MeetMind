import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, isDeleting }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#17253D]/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="card-elevated w-full max-w-md bg-white border border-[#F2F2F2] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-h4 text-[#17253D] leading-tight mb-2">Delete Meeting?</h2>
          <p className="text-body text-[#262626]">
            Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone and will permanently remove all associated transcripts, summaries, and action items.
          </p>
        </div>
        
        <div className="p-4 sm:p-6 border-t border-[#F2F2F2] bg-[#F9F8FC] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="mm-btn mm-btn-ghost flex-1 sm:flex-none justify-center"
            style={{ height: '40px', padding: '0 20px' }}
          >
            No, Keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="mm-btn flex-1 sm:flex-none justify-center flex items-center gap-2 bg-[#D13438] hover:bg-[#A80000] text-white border-transparent transition-colors rounded-lg font-semibold"
            style={{ height: '40px', padding: '0 20px' }}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
