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
  isDirect: boolean;
  connections?: {
    from: string;
    to: string;
    mode: 'train' | 'bus' | 'auto' | 'cab';
    duration: string;
    distance: string;
    tip: string;
  }[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: { time: string; activity: string; cost: number; icon: string; searchTerm?: string; linkType?: 'maps' | 'zomato' | 'images' | 'book' }[];
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
