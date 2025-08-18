import { Event, Vendor } from '../types/Event';
import { Reminder } from '../types/Reminder';

// Sample mock data for events
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Summer Music Festival',
    description: 'Join us for three days of amazing music performances from top artists around the world.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    location: 'Central Park, New York',
    imageUrl: '',
    organizer: 'EventHub Productions',
    price: 89.99,
    category: 'Music',
    attendees: 256,
    maxAttendees: 1000,
    isVirtual: false,
    isPrivate: false,
    vendors: [
      { id: 1, name: 'Sound Master Audio', category: 'Equipment', rating: 4.8, priceRange: '$$$', contact: 'contact@soundmaster.com', isBooked: true },
      { id: 2, name: 'Urban Eats Catering', category: 'Food', rating: 4.5, priceRange: '$$', contact: 'orders@urbaneats.com', isBooked: true }
    ]
  },
  {
    id: 2,
    title: 'Tech Conference 2025',
    description: 'The biggest tech conference of the year featuring the latest innovations in AI, blockchain, and more.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    location: 'Convention Center, San Francisco',
    imageUrl: '',
    organizer: 'TechCon Inc.',
    price: 299.99,
    category: 'Business',
    attendees: 789,
    maxAttendees: 2000,
    isVirtual: false,
    isPrivate: false
  },
  {
    id: 3,
    title: 'Sarah\'s Surprise Birthday Party',
    description: 'A secret birthday celebration for Sarah\'s 30th with friends and family. Keep it a surprise!',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    location: 'Riverside Restaurant, Austin',
    imageUrl: '',
    organizer: 'John Smith',
    price: 0,
    category: 'Birthday',
    attendees: 28,
    maxAttendees: 40,
    isVirtual: false,
    isPrivate: true,
    reminderId: 1
  },
  {
    id: 4,
    title: 'Virtual Meditation Retreat',
    description: 'A weekend of relaxation and mindfulness with top yoga instructors from around the world.',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    location: 'Online',
    imageUrl: '',
    organizer: 'Mindful Living Co.',
    price: 49.99,
    category: 'Health',
    attendees: 85,
    maxAttendees: 500,
    isVirtual: true,
    isPrivate: false
  },
  {
    id: 5,
    title: 'Rodriguez 25th Anniversary',
    description: 'Celebrating 25 years of marriage for Maria and Carlos Rodriguez with family and close friends.',
    date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days from now
    location: 'Golden Gate Hotel, San Francisco',
    imageUrl: '',
    organizer: 'Party Planner Pro',
    price: 0,
    category: 'Anniversary',
    attendees: 65,
    maxAttendees: 100,
    isVirtual: false,
    isPrivate: true,
    reminderId: 2
  },
  {
    id: 6,
    title: 'Annual Charity Gala 2025',
    description: 'Our biggest fundraising event of the year with dinner, silent auction, and live entertainment.',
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    location: 'Grand Ballroom, Plaza Hotel',
    imageUrl: '',
    organizer: 'Community Foundation',
    price: 150,
    category: 'Charity',
    attendees: 210,
    maxAttendees: 500,
    isVirtual: false,
    isPrivate: false
  }
];

// Sample mock data for reminders
const mockReminders: Reminder[] = [
  {
    id: 1,
    title: 'Sarah\'s 30th Birthday',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    type: 'birthday',
    description: 'Sarah is turning 30!',
    recipientName: 'Sarah Johnson',
    relationship: 'Friend',
    notifyBefore: [1, 7, 30], // days
    giftIdeas: ['Spa gift card', 'Wine subscription', 'Jewelry'],
    plannedSurprise: true,
    plannedEventId: 3
  },
  {
    id: 2,
    title: 'Rodriguez 25th Anniversary',
    date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days from now
    type: 'anniversary',
    description: 'Maria and Carlos celebrating 25 years of marriage',
    recipientName: 'Maria & Carlos Rodriguez',
    relationship: 'Clients',
    notifyBefore: [7, 14, 30], // days
    giftIdeas: ['Photo album', 'Weekend getaway', 'Engraved gift'],
    plannedSurprise: true,
    plannedEventId: 5
  },
  {
    id: 3,
    title: 'Mom\'s Birthday',
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    type: 'birthday',
    description: 'Don\'t forget to call Mom and send a gift',
    recipientName: 'Elizabeth Smith',
    relationship: 'Mother',
    notifyBefore: [1, 7, 14], // days
    giftIdeas: ['Gardening tools', 'Cooking class', 'Kindle'],
    plannedSurprise: false
  }
];

// Sample mock data for vendors
const mockVendors: Vendor[] = [
  { id: 1, name: 'Sound Master Audio', category: 'Equipment', rating: 4.8, priceRange: '$$$', contact: 'contact@soundmaster.com', isBooked: false },
  { id: 2, name: 'Urban Eats Catering', category: 'Food', rating: 4.5, priceRange: '$$', contact: 'orders@urbaneats.com', isBooked: false },
  { id: 3, name: 'Floral Elegance', category: 'Decoration', rating: 4.9, priceRange: '$$$', contact: 'info@floralelegance.com', isBooked: false },
  { id: 4, name: 'SnapBooth Photos', category: 'Photography', rating: 4.7, priceRange: '$$', contact: 'book@snapbooth.com', isBooked: false },
  { id: 5, name: 'Premier Venues', category: 'Venue', rating: 4.6, priceRange: '$$$$', contact: 'reservations@premiervenues.com', isBooked: false },
  { id: 6, name: 'DJ Spectacular', category: 'Entertainment', rating: 4.8, priceRange: '$$$', contact: 'bookings@djspectacular.com', isBooked: false },
  { id: 7, name: 'Budget Decor', category: 'Decoration', rating: 4.2, priceRange: '$', contact: 'sales@budgetdecor.com', isBooked: false },
  { id: 8, name: 'Sweet Treats Bakery', category: 'Food', rating: 4.9, priceRange: '$$', contact: 'orders@sweettreats.com', isBooked: false }
];

export const fetchEvents = async (): Promise<Event[]> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEvents);
    }, 1000);
  });
};

export const fetchEventById = async (id: number): Promise<Event | undefined> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(e => e.id === id);
      resolve(event);
    }, 500);
  });
};

export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent = {
        ...eventData,
        id: mockEvents.length + 1,
      };
      mockEvents.push(newEvent);
      resolve(newEvent);
    }, 1000);
  });
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event | undefined> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEvents.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEvents[index] = { ...mockEvents[index], ...eventData };
        resolve(mockEvents[index]);
      } else {
        resolve(undefined);
      }
    }, 1000);
  });
};

export const deleteEvent = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEvents.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEvents.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};

export const registerForEvent = async (eventId: number, userId: string): Promise<boolean> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(e => e.id === eventId);
      if (event && event.attendees < event.maxAttendees) {
        event.attendees += 1;
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

// Reminder functions
export const fetchUpcomingReminders = async (): Promise<Reminder[]> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReminders);
    }, 800);
  });
};

export const fetchReminderById = async (id: number): Promise<Reminder | undefined> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const reminder = mockReminders.find(r => r.id === id);
      resolve(reminder);
    }, 500);
  });
};

export const createReminder = async (reminderData: Omit<Reminder, 'id'>): Promise<Reminder> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReminder = {
        ...reminderData,
        id: mockReminders.length + 1,
      };
      mockReminders.push(newReminder);
      resolve(newReminder);
    }, 1000);
  });
};

export const updateReminder = async (id: number, reminderData: Partial<Reminder>): Promise<Reminder | undefined> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockReminders.findIndex(r => r.id === id);
      if (index !== -1) {
        mockReminders[index] = { ...mockReminders[index], ...reminderData };
        resolve(mockReminders[index]);
      } else {
        resolve(undefined);
      }
    }, 1000);
  });
};

export const deleteReminder = async (id: number): Promise<boolean> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockReminders.findIndex(r => r.id === id);
      if (index !== -1) {
        mockReminders.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};

// Vendor functions
export const fetchVendors = async (): Promise<Vendor[]> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVendors);
    }, 800);
  });
};

export const fetchVendorsByCategory = async (category: string): Promise<Vendor[]> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredVendors = mockVendors.filter(v => v.category === category);
      resolve(filteredVendors);
    }, 800);
  });
};

export const bookVendor = async (eventId: number, vendorId: number): Promise<boolean> => {
  // Simulate API request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find(e => e.id === eventId);
      const vendor = mockVendors.find(v => v.id === vendorId);
      
      if (event && vendor) {
        vendor.isBooked = true;
        if (!event.vendors) event.vendors = [];
        event.vendors.push(vendor);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
};