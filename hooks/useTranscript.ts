'use client';

import { useState, useCallback } from 'react';

interface TranscriptSegment {
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export function useTranscript() {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [interim, setInterim] = useState('');

  const addSegment = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setSegments((prev) => [...prev, { text, timestamp: Date.now(), isFinal: true }]);
      setInterim('');
    } else {
      setInterim(text);
    }
  }, []);

  const reset = useCallback(() => {
    setSegments([]);
    setInterim('');
  }, []);

  const fullTranscript = segments.map((s) => s.text).join(' ');

  return { segments, interim, fullTranscript, addSegment, reset };
}
