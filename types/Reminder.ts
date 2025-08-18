export interface Reminder {
  id: number;
  title: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'meeting' | 'other';
  description: string;
  recipientName?: string;
  relationship?: string;
  notifyBefore: number[];
  giftIdeas?: string[];
  plannedSurprise?: boolean;
  plannedEventId?: number;
}