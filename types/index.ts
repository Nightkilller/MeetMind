// ── Meeting Types ──────────────────────────────────────────────

export type MeetingStatus = 'recording' | 'processing' | 'completed' | 'failed';
export type Priority = 'high' | 'medium' | 'low';
export type MeetingType = 'standup' | 'planning' | 'review' | 'brainstorm' | 'client' | 'other';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface ActionItem {
  id: string;
  text: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  priority: Priority;
}

export interface Meeting {
  _id: string;
  userId: string;
  title: string;
  date: string;
  duration: number;
  status: MeetingStatus;
  transcript: string;
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  emailDraft: string;
  participants: string[];
  tags: string[];
  audioUrl: string;
  meetingType: MeetingType;
  sentiment: Sentiment;
  followUpRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Analysis Response ──────────────────────────────────────────

export interface AnalysisResult {
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  participants: string[];
  meetingType: MeetingType;
  sentiment: Sentiment;
  followUpRequired: boolean;
  estimatedDuration: string;
}

// ── API Response Types ─────────────────────────────────────────

export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface MeetingsResponse {
  meetings: Meeting[];
}

export interface MeetingResponse {
  meeting: Meeting;
}

export interface TranscribeResponse {
  transcript: string;
}

export interface EmailDraftResponse {
  emailDraft: string;
}

// ── Dashboard Stats ────────────────────────────────────────────

export interface DashboardStats {
  totalMeetings: number;
  pendingActionItems: number;
  hoursSaved: string;
  meetingsThisWeek: number;
}

// ── User ──────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

// ── Recording State ───────────────────────────────────────────

export interface RecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
  error: string | null;
}
