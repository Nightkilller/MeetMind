'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
import PageWrapper from '@/components/layout/PageWrapper';
import MeetingRecorder from '@/components/meeting/MeetingRecorder';
import Spinner from '@/components/ui/Spinner';
import { Brain, Mic, Database } from 'lucide-react';

export default function NewMeetingPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-container flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
          <Brain size={32} color="#0078D4" />
        </div>
        <h1 className="text-h2 text-[#17253D]">Sign in to record a meeting</h1>
        <SignInButton mode="modal">
          <button className="mm-btn mm-btn-primary px-8">Sign in to continue</button>
        </SignInButton>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto py-[48px] px-6">
        {/* Header */}
        <div className="text-center mb-[48px]">
          <h1 className="text-h2 text-[#17253D] mb-4">Start a New Meeting</h1>
          <p className="text-body text-[#262626] max-w-xl mx-auto">
            Click record, join your meeting, and MeetMind will automatically transcribe and analyze everything.
          </p>
        </div>

        {/* Recorder */}
        <div className="max-w-3xl mx-auto card-elevated p-8 mb-[48px]">
          <MeetingRecorder />
        </div>

        {/* Info cards */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Groq Whisper', desc: 'Real-time transcription', icon: Mic },
            { title: 'Llama 3.3 70B', desc: 'AI analysis & insights', icon: Brain },
            { title: 'Auto-saved', desc: 'Stored to MongoDB Atlas', icon: Database },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[#F2F2F2] rounded-lg p-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#F4FAFD] rounded-full flex items-center justify-center mb-3">
                <item.icon size={24} color="#0078D4" />
              </div>
              <p className="text-h6 text-[#17253D] mb-1">{item.title}</p>
              <p className="text-small text-[#262626]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
