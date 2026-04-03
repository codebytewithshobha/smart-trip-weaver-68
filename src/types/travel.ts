export interface TripSearch {
  from: string;
  to: string;
  date: string;
  budget: number;
  travelers: number;
}

export interface TransportOption {
  id: string;
  type: 'train' | 'flight' | 'bus';
  provider: string;
  price: number;
  duration: string;
  durationMinutes: number;
  rating: number;
  departureTime: string;
  arrivalTime: string;
  co2: number;
  availability: number;
  stops: number;
  seatType?: string;
  boardingPoint?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: { time: string; activity: string; cost: number; icon: string }[];
}

export interface BuddyMatch {
  name: string;
  age: number;
  interests: string[];
  matchPercent: number;
  avatar: string;
}

export interface HiddenGem {
  name: string;
  description: string;
  rating: number;
  category: string;
  image: string;
}
