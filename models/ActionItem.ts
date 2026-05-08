import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItem extends Document {
  meetingId: string;
  userId: string;
  text: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

const ActionItemSchema = new Schema<IActionItem>(
  {
    meetingId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    owner: { type: String, default: 'Unassigned' },
    dueDate: { type: String, default: 'Not specified' },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  },
  { timestamps: true }
);

export default mongoose.models.ActionItem ||
  mongoose.model<IActionItem>('ActionItem', ActionItemSchema);
