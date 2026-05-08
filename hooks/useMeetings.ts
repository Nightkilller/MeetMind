'use client';

import useSWR from 'swr';
import type { Meeting } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMeetings(search?: string) {
  const url = search ? `/api/meetings?search=${encodeURIComponent(search)}` : '/api/meetings';
  const { data, error, isLoading, mutate } = useSWR<{ meetings: Meeting[] }>(url, fetcher, {
    refreshInterval: 30000,
  });

  return {
    meetings: data?.meetings ?? [],
    isLoading,
    error,
    mutate,
  };
}

export function useMeeting(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ meeting: Meeting }>(
    id ? `/api/meetings/${id}` : null,
    fetcher
  );

  return {
    meeting: data?.meeting,
    isLoading,
    error,
    mutate,
  };
}
