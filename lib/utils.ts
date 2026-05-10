import { format, formatDistanceToNow, parseISO } from 'date-fns';

/** Format seconds → MM:SS */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** Format seconds → "X min Y sec" */
export function formatDurationLong(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

/** Format date → "May 8, 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

/** Format date → "2 hours ago" */
export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/** Truncate text with ellipsis */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

/** Generate a unique ID */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Calculate hours saved (estimate: 45 min saved per meeting on average) */
export function calcHoursSaved(meetingCount: number): string {
  const minutes = meetingCount * 45;
  const hours = (minutes / 60).toFixed(1);
  return hours;
}

/** Get initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/** Speaker color by index */
export function getSpeakerColor(index: number): string {
  const colors = ['#60a5fa', '#a78bfa', '#34d399', '#fb923c', '#f472b6', '#facc15'];
  return colors[index % colors.length];
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
}

/** Calculate Meeting Health Score */
export function calculateHealthScore(meeting: any): number {
  let score = 50;
  if (meeting.sentiment === 'positive') score += 20;
  if (meeting.sentiment === 'negative') score -= 15;
  if (meeting.actionItems?.length > 0) score += 15;
  if (meeting.keyDecisions?.length > 0) score += 10;
  if (meeting.duration < 1800) score += 5; // under 30 min
  return Math.min(100, Math.max(0, score));
}
