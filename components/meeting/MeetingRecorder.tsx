'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Loader2, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDuration } from '@/lib/utils';

export default function MeetingRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      toast.error('Microphone access denied. Please allow microphone permissions.');
    }
  }, []);

  const stopAndProcess = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());

    await new Promise((r) => setTimeout(r, 500));
    setIsProcessing(true);

    try {
      // Step 1: Create meeting record
      setProcessingStep('Creating meeting record…');
      const createRes = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meetingTitle || 'Untitled Meeting',
          status: 'processing',
          duration,
        }),
      });
      const { meeting, error: createErr } = await createRes.json();
      if (createErr) throw new Error(createErr);

      // Step 2: Transcribe
      setProcessingStep('Transcribing audio with Azure Speech…');
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'meeting.webm');

      const transcribeRes = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const { transcript, error: transcribeErr } = await transcribeRes.json();
      if (transcribeErr) throw new Error(transcribeErr);

      // Step 3: Analyze with GPT-4o
      setProcessingStep('Analyzing with Azure OpenAI GPT-4o…');
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, meetingTitle: meeting.title }),
      });
      const analysis = await analyzeRes.json();

      // Step 4: Save results
      setProcessingStep('Saving results…');
      await fetch(`/api/meetings/${meeting._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, ...analysis, status: 'completed' }),
      });

      toast.success('Meeting analyzed successfully!');
      router.push(`/meeting/${meeting._id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Processing failed';
      toast.error(message);
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [meetingTitle, duration, router]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      {/* Title input */}
      <input
        id="meeting-title-input"
        type="text"
        placeholder="Meeting title (optional)"
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
        className="mm-input text-center text-lg"
        disabled={isRecording || isProcessing}
      />

      {/* Waveform / status */}
      {isRecording && (
        <div className="flex flex-col items-center gap-4">
          {/* Waveform animation */}
          <div className="flex items-center gap-1.5 h-12">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full bg-red-400 wave-bar-${(i % 5) + 1}`}
                style={{ minHeight: '8px' }}
              />
            ))}
          </div>
          {/* Timer */}
          <div className="text-5xl font-mono font-bold text-red-400 tabular-nums">
            {formatDuration(duration)}
          </div>
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 recording-pulse" />
            Recording…
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-[24px] bg-white border border-[#F2F2F2] flex items-center justify-center animate-pulse shadow-sm">
            <Brain size={32} color="#0078D4" />
          </div>
          <div>
            <p className="text-h6 text-[#17253D] mb-1">Processing your meeting</p>
            <p className="text-small text-[#0078D4] flex items-center gap-2 justify-center">
              <Loader2 size={14} className="animate-spin" />
              {processingStep}
            </p>
          </div>
          <div className="w-64 h-1.5 bg-[#F2F2F2] rounded-full overflow-hidden">
            <div className="h-full bg-[#0078D4] rounded-full shimmer" />
          </div>
        </div>
      )}

      {/* Buttons */}
      {!isRecording && !isProcessing && (
        <button
          id="start-recording-btn"
          onClick={startRecording}
          className="w-24 h-24 rounded-[24px] bg-[#D13438] hover:bg-[#A4262C] flex items-center justify-center shadow-[0_4px_8px_rgba(209,52,56,0.3)] hover:shadow-[0_8px_16px_rgba(209,52,56,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Mic size={36} className="text-white" />
        </button>
      )}

      {isRecording && (
        <button
          id="stop-recording-btn"
          onClick={stopAndProcess}
          className="w-24 h-24 rounded-[24px] bg-white border-2 border-[#D13438] hover:bg-[#FDF3F4] flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Square size={28} color="#D13438" />
        </button>
      )}

      <p className="text-small text-[#262626] text-center">
        {!isRecording && !isProcessing
          ? 'Click the microphone to start recording your meeting'
          : isRecording
          ? 'Click stop when your meeting ends to generate AI insights'
          : 'Please wait while MeetMind analyzes your meeting…'}
      </p>
    </div>
  );
}
