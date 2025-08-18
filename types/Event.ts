export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  organizer: string;
  price: number;
  category: string;
  attendees: number;
  maxAttendees: number;
  isVirtual: boolean;
  isPrivate?: boolean;
  reminderId?: number;
  vendors?: Vendor[];
  packages?: string[];
  timeline?: EventTimelineItem[];
  guestList?: GuestListItem[];
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  priceRange: string;
  contact: string;
  isBooked: boolean;
}

export interface EventTimelineItem {
  id: number;
  time: string;
  description: string;
  isCompleted: boolean;
}

export interface GuestListItem {
  id: number;
  name: string;
  email: string;
  isAttending: boolean;
  plusOne: boolean;
}