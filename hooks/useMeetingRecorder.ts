'use client';

import { useState, useRef, useCallback } from 'react';

export interface RecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  error: string | null;
}

export function useMeetingRecorder() {
  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isProcessing: false,
    duration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      setState({ isRecording: true, isProcessing: false, duration: 0, error: null });

      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } catch {
      setState((prev) => ({ ...prev, error: 'Microphone access denied' }));
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(new Blob([], { type: 'audio/webm' }));
        return;
      }

      if (timerRef.current) clearInterval(timerRef.current);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setState((prev) => ({ ...prev, isRecording: false, isProcessing: true }));
    });
  }, []);

  const reset = useCallback(() => {
    setState({ isRecording: false, isProcessing: false, duration: 0, error: null });
  }, []);

  return { state, startRecording, stopRecording, reset };
}
