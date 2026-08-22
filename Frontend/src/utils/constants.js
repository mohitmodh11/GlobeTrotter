export const APP_NAME = 'GlobeTrotter';
export const APP_TAGLINE = 'Smart Travel Planning & Itinerary Builder';

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$) - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$) - Australian Dollar' },
];

export const TRIP_CATEGORIES = [
  { id: 'leisure', label: 'Leisure & Vacation', icon: 'Sun' },
  { id: 'adventure', label: 'Adventure & Nature', icon: 'Compass' },
  { id: 'cultural', label: 'Culture & Heritage', icon: 'Landmark' },
  { id: 'solo', label: 'Solo Backpacking', icon: 'User' },
  { id: 'family', label: 'Family Trip', icon: 'Users' },
  { id: 'business', label: 'Business & Bleisure', icon: 'Briefcase' },
  { id: 'honeymoon', label: 'Romantic / Honeymoon', icon: 'Heart' },
];

export const ACTIVITY_CATEGORIES = [
  { id: 'sightseeing', label: 'Sightseeing', color: 'green' },
  { id: 'food', label: 'Food & Dining', color: 'gray' },
  { id: 'adventure', label: 'Adventure & Sports', color: 'green' },
  { id: 'culture', label: 'Art & Culture', color: 'gray' },
  { id: 'relaxation', label: 'Relaxation & Spa', color: 'green' },
  { id: 'shopping', label: 'Shopping', color: 'gray' },
  { id: 'nightlife', label: 'Nightlife', color: 'gray' },
];

export const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (08:00 - 12:00)' },
  { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
  { id: 'evening', label: 'Evening (17:00 - 21:00)' },
  { id: 'night', label: 'Night (21:00 onwards)' },
];

export const TRANSPORT_MODES = [
  { id: 'flight', label: 'Flight', icon: 'Plane' },
  { id: 'train', label: 'Train', icon: 'Train' },
  { id: 'car', label: 'Rental / Drive', icon: 'Car' },
  { id: 'bus', label: 'Bus / Coach', icon: 'Bus' },
  { id: 'ferry', label: 'Ferry / Boat', icon: 'Ship' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'stay', label: 'Accommodation', color: '#15803D' },
  { id: 'transport', label: 'Transport & Flights', color: '#16A34A' },
  { id: 'activities', label: 'Activities & Tours', color: '#22C55E' },
  { id: 'food', label: 'Food & Dining', color: '#475569' },
  { id: 'shopping', label: 'Shopping & Souvenirs', color: '#64748b' },
  { id: 'misc', label: 'Miscellaneous', color: '#94a3b8' },
];

export const TRIP_STATUS = {
  UPCOMING: 'Upcoming',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
};
