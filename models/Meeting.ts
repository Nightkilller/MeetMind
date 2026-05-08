import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItem {
  id: string;
  text: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface IMeeting extends Document {
  userId: string;
  title: string;
  date: Date;
  duration: number;
  status: 'recording' | 'processing' | 'completed' | 'failed';
  transcript: string;
  summary: string;
  keyDecisions: string[];
  actionItems: IActionItem[];
  emailDraft: string;
  participants: string[];
  tags: string[];
  audioUrl: string;
  meetingType: string;
  sentiment: string;
  followUpRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActionItemSchema = new Schema<IActionItem>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  owner: { type: String, default: 'Unassigned' },
  dueDate: { type: String, default: 'Not specified' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
});

const MeetingSchema = new Schema<IMeeting>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'Untitled Meeting' },
    date: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['recording', 'processing', 'completed', 'failed'],
      default: 'recording',
    },
    transcript: { type: String, default: '' },
    summary: { type: String, default: '' },
    keyDecisions: [{ type: String }],
    actionItems: [ActionItemSchema],
    emailDraft: { type: String, default: '' },
    participants: [{ type: String }],
    tags: [{ type: String }],
    audioUrl: { type: String, default: '' },
    meetingType: { type: String, default: 'other' },
    sentiment: { type: String, default: 'neutral' },
    followUpRequired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text search index
MeetingSchema.index({ title: 'text', summary: 'text', transcript: 'text' });

export default mongoose.models.Meeting ||
  mongoose.model<IMeeting>('Meeting', MeetingSchema);
