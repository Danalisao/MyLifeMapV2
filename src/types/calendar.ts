export type CalendarView = 'day' | 'week' | 'month';

export type EventType = 'memory' | 'note' | 'reminder';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: EventType;
  color?: string;
  reminderTime?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const EVENT_COLORS = {
  memory: 'bg-primary-500',
  note: 'bg-yellow-500',
  reminder: 'bg-purple-500',
};