import { TransportOption, ItineraryDay, BuddyMatch, HiddenGem } from "@/types/travel";

const providers = {
  train: ["Rajdhani Express", "Shatabdi Express", "Duronto Express", "Vande Bharat", "Garib Rath"],
  flight: ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoFirst"],
  bus: ["RedBus Premium", "VRL Travels", "SRS Travels", "Neeta Travels", "Orange Tours"],
};

const boardingPoints = ["Central Bus Stand", "Railway Station", "Airport Road", "City Center", "Highway Junction"];

const nearbyHubs: Record<string, { hub: string; distance: string; duration: string }[]> = {
  default: [
    { hub: "Ranchi Junction", distance: "12 km", duration: "25 min" },
    { hub: "Birsa Munda Airport", distance: "8 km", duration: "20 min" },
    { hub: "Central Bus Stand", distance: "5 km", duration: "15 min" },
  ],
};

const connectionModes: ('train' | 'bus' | 'auto' | 'cab')[] = ['auto', 'cab', 'bus', 'train'];
const connectionTips = [
  "Auto-rickshaws available right outside the station",
  "Pre-book an Ola/Uber for best rates",
  "Local buses run every 15 minutes from this stop",
  "Shared jeeps available at the main stand",
  "E-rickshaws are cheapest for short distances",
];

export function generateTransportOptions(from: string, to: string, budget: number): TransportOption[] {
  const options: TransportOption[] = [];
  const types: ('train' | 'flight' | 'bus')[] = ['train', 'flight', 'bus'];

  types.forEach((type) => {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const provList = providers[type];
      const basePrice = type === 'flight' ? 3000 + Math.random() * 8000 : type === 'train' ? 500 + Math.random() * 3000 : 300 + Math.random() * 2000;
      const baseDuration = type === 'flight' ? 60 + Math.random() * 180 : type === 'train' ? 180 + Math.random() * 600 : 240 + Math.random() * 720;
      const depHour = 4 + Math.floor(Math.random() * 18);
      const depMin = Math.floor(Math.random() * 60);
      const arrMin = depHour * 60 + depMin + baseDuration;
      const arrHour = Math.floor(arrMin / 60) % 24;

      options.push({
        id: `${type}-${i}-${Date.now()}`,
        type,
        provider: provList[Math.floor(Math.random() * provList.length)],
        price: Math.round(basePrice),
        duration: `${Math.floor(baseDuration / 60)}h ${Math.round(baseDuration % 60)}m`,
        durationMinutes: Math.round(baseDuration),
        rating: +(3.5 + Math.random() * 1.5).toFixed(1),
        departureTime: `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
        arrivalTime: `${String(arrHour).padStart(2, '0')}:${String(Math.round(arrMin % 60)).padStart(2, '0')}`,
        co2: Math.round(type === 'flight' ? 150 + Math.random() * 200 : type === 'bus' ? 30 + Math.random() * 50 : 20 + Math.random() * 40),
        availability: Math.floor(5 + Math.random() * 50),
        stops: type === 'flight' ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 4),
        seatType: type === 'bus' ? ['Sleeper', 'Semi-Sleeper', 'Seater', 'AC Sleeper'][Math.floor(Math.random() * 4)] : undefined,
        boardingPoint: type === 'bus' ? boardingPoints[Math.floor(Math.random() * boardingPoints.length)] : undefined,
        isDirect: Math.random() > 0.4,
        connections: Math.random() > 0.4 ? undefined : (() => {
          const numConnections = 1 + Math.floor(Math.random() * 2);
          const conns = [];
          for (let c = 0; c < numConnections; c++) {
            const mode = connectionModes[Math.floor(Math.random() * connectionModes.length)];
            const hubInfo = nearbyHubs.default[Math.floor(Math.random() * nearbyHubs.default.length)];
            conns.push({
              from: c === 0 ? from : hubInfo.hub,
              to: c === numConnections - 1 ? `${to} ${type === 'bus' ? 'Bus Stand' : type === 'train' ? 'Station' : 'Airport'}` : hubInfo.hub,
              mode,
              duration: hubInfo.duration,
              distance: hubInfo.distance,
              tip: connectionTips[Math.floor(Math.random() * connectionTips.length)],
            });
          }
          return conns;
        })(),
      });
    }
  });

  return options;
}

export function generateItinerary(to: string, days: number): ItineraryDay[] {
  const activities = [
    { time: "08:00", activity: `Breakfast at local café in ${to}`, cost: 300, icon: "🍳" },
    { time: "09:30", activity: `Visit famous temple/monument`, cost: 200, icon: "🏛️" },
    { time: "11:00", activity: `Local market exploration`, cost: 500, icon: "🛍️" },
    { time: "13:00", activity: `Lunch at popular restaurant`, cost: 600, icon: "🍽️" },
    { time: "14:30", activity: `Museum / Gallery visit`, cost: 300, icon: "🎨" },
    { time: "16:00", activity: `Street food tour`, cost: 400, icon: "🥘" },
    { time: "17:30", activity: `Sunset viewpoint`, cost: 0, icon: "🌅" },
    { time: "19:00", activity: `Dinner & nightlife`, cost: 800, icon: "🌙" },
    { time: "10:00", activity: `Nature trek / Park walk`, cost: 150, icon: "🌿" },
    { time: "12:00", activity: `Photography at scenic spots`, cost: 0, icon: "📸" },
    { time: "15:00", activity: `Adventure activity`, cost: 1500, icon: "🎢" },
    { time: "18:00", activity: `Spa & relaxation`, cost: 1200, icon: "💆" },
  ];

  const result: ItineraryDay[] = [];
  for (let d = 1; d <= Math.min(days, 5); d++) {
    const dayActivities = [];
    const used = new Set<number>();
    for (let a = 0; a < 4 + Math.floor(Math.random() * 2); a++) {
      let idx;
      do { idx = Math.floor(Math.random() * activities.length); } while (used.has(idx));
      used.add(idx);
      dayActivities.push(activities[idx]);
    }
    dayActivities.sort((a, b) => a.time.localeCompare(b.time));
    result.push({
      day: d,
      title: d === 1 ? `Arrival & Exploration` : d === days ? `Departure Day` : `Day ${d} - Deep Dive`,
      activities: dayActivities,
    });
  }
  return result;
}

export function generateBuddyMatches(): BuddyMatch[] {
  return [
    { name: "Arjun M.", age: 26, interests: ["Photography", "Hiking", "Food"], matchPercent: 92, avatar: "🧑‍💻" },
    { name: "Priya S.", age: 24, interests: ["Culture", "Art", "Yoga"], matchPercent: 87, avatar: "👩‍🎨" },
    { name: "Rahul K.", age: 29, interests: ["Adventure", "Cycling", "Music"], matchPercent: 78, avatar: "🚴" },
  ];
}

export function generateHiddenGems(to: string): HiddenGem[] {
  return [
    { name: `Secret Garden of ${to}`, description: "A hidden botanical paradise known only to locals", rating: 4.8, category: "Nature", image: "🌺" },
    { name: `Underground Café District`, description: "Artisan coffee shops in converted heritage buildings", rating: 4.6, category: "Food", image: "☕" },
    { name: `Moonlight Lake Viewpoint`, description: "Stunning panoramic views, best visited at dawn", rating: 4.9, category: "Views", image: "🏔️" },
  ];
}

export function generatePackingList(): { category: string; items: string[] }[] {
  return [
    { category: "Essentials", items: ["Passport/ID", "Phone charger", "Power bank", "Cash + Cards", "Medications"] },
    { category: "Clothing", items: ["Comfortable shoes", "Light jacket", "Rain poncho", "Sunglasses", "Hat/Cap"] },
    { category: "Tech", items: ["Camera", "Earphones", "Travel adapter", "Portable WiFi"] },
    { category: "Toiletries", items: ["Sunscreen SPF50", "Insect repellent", "Hand sanitizer", "Wet wipes"] },
  ];
}

export function generateCarbonData(): { mode: string; co2: number; color: string }[] {
  return [
    { mode: "✈️ Flight", co2: 255, color: "hsl(0, 70%, 55%)" },
    { mode: "🚆 Train", co2: 41, color: "hsl(150, 70%, 45%)" },
    { mode: "🚌 Bus", co2: 68, color: "hsl(40, 90%, 55%)" },
    { mode: "🚗 Car", co2: 171, color: "hsl(25, 80%, 55%)" },
  ];
}

export function generateWeatherData(to: string): { city: string; temp: number; condition: string; humidity: number; icon: string }[] {
  return [
    { city: to, temp: 28 + Math.floor(Math.random() * 10), condition: "Partly Cloudy", humidity: 55 + Math.floor(Math.random() * 30), icon: "⛅" },
    { city: "Current City", temp: 22 + Math.floor(Math.random() * 10), condition: "Sunny", humidity: 40 + Math.floor(Math.random() * 20), icon: "☀️" },
  ];
}

export interface SafetyData {
  overall: number;
  verdict: string;
  categories: { name: string; score: number; icon: string }[];
  emergencyContacts: { service: string; number: string; icon: string }[];
  womenSafety: { metric: string; rating: string; icon: string }[];
  travelAdvisories: { level: string; message: string; color: string }[];
  soloTravelerTips: string[];
  nightSafetyScore: number;
  scamAlerts: { scam: string; risk: string; tip: string }[];
}

export function generateSafetyScore(destination?: string): SafetyData {
  const dest = destination || "this destination";
  const overall = +(7 + Math.random() * 2.5).toFixed(1);
  const nightScore = +(5.5 + Math.random() * 3.5).toFixed(1);

  return {
    overall,
    verdict: overall >= 8.5 ? "Very Safe" : overall >= 7 ? "Safe for tourists" : "Moderate – Stay alert",
    categories: [
      { name: "Crime Rate", score: +(7 + Math.random() * 3).toFixed(1), icon: "🔒" },
      { name: "Health Infrastructure", score: +(6 + Math.random() * 3).toFixed(1), icon: "🏥" },
      { name: "Transport Safety", score: +(7 + Math.random() * 2.5).toFixed(1), icon: "🚗" },
      { name: "Tourist Friendliness", score: +(8 + Math.random() * 2).toFixed(1), icon: "🤝" },
      { name: "Emergency Response", score: +(6.5 + Math.random() * 3).toFixed(1), icon: "🚨" },
      { name: "Food & Water Safety", score: +(6.5 + Math.random() * 3).toFixed(1), icon: "💧" },
      { name: "Cyber Safety", score: +(7 + Math.random() * 2).toFixed(1), icon: "🛡️" },
    ],
    emergencyContacts: [
      { service: "Police", number: "100", icon: "🚔" },
      { service: "Ambulance", number: "108", icon: "🚑" },
      { service: "Fire", number: "101", icon: "🚒" },
      { service: "Women Helpline", number: "1091", icon: "👩" },
      { service: "Tourist Helpline", number: "1363", icon: "📞" },
      { service: "Disaster Mgmt", number: "1078", icon: "⚠️" },
    ],
    womenSafety: [
      { metric: "Solo Women Safety", rating: overall >= 8 ? "High" : overall >= 6.5 ? "Moderate" : "Low", icon: "👩‍💼" },
      { metric: "Night Mobility", rating: nightScore >= 7.5 ? "Good" : nightScore >= 5.5 ? "Moderate" : "Poor", icon: "🌙" },
      { metric: "Public Transport Safety", rating: "Moderate-Good", icon: "🚌" },
      { metric: "Harassment Index", rating: overall >= 8 ? "Very Low" : "Low-Moderate", icon: "📊" },
    ],
    travelAdvisories: [
      { level: "Level 1", message: `${dest}: Exercise normal precautions`, color: "hsl(var(--success))" },
      { level: "Health", message: "Carry basic medical kit, drink bottled water", color: "hsl(var(--warning))" },
      { level: "Scam Risk", message: "Beware of overcharging at tourist spots", color: "hsl(var(--warning))" },
    ],
    soloTravelerTips: [
      "Share your live location with family/friends",
      "Avoid isolated areas after 10 PM",
      "Use verified ride-hailing apps (Uber/Ola)",
      "Keep digital copies of all documents",
      "Register with local tourist police on arrival",
      "Download offline maps before traveling",
    ],
    nightSafetyScore: nightScore,
    scamAlerts: [
      { scam: "Taxi Overcharging", risk: "High", tip: "Always use meter or pre-negotiate fare" },
      { scam: "Fake Tour Guides", risk: "Medium", tip: "Book only through verified platforms" },
      { scam: "Street Vendor Scams", risk: "Medium", tip: "Compare prices before purchasing" },
      { scam: "ATM Skimming", risk: "Low", tip: "Use ATMs inside banks only" },
    ],
  };
}

export function generateHiddenCosts(budget: number): { item: string; cost: number; icon: string }[] {
  return [
    { item: "Airport/Station Transfer", cost: Math.round(budget * 0.05), icon: "🚕" },
    { item: "Meals & Snacks", cost: Math.round(budget * 0.2), icon: "🍽️" },
    { item: "Entry Tickets & Activities", cost: Math.round(budget * 0.1), icon: "🎟️" },
    { item: "Tips & Gratuities", cost: Math.round(budget * 0.03), icon: "💰" },
    { item: "Emergency Fund", cost: Math.round(budget * 0.07), icon: "🏥" },
    { item: "Souvenirs & Shopping", cost: Math.round(budget * 0.08), icon: "🛍️" },
    { item: "SIM/WiFi", cost: Math.round(budget * 0.02), icon: "📶" },
  ];
}

export function generatePricePrediction(): { day: string; price: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon+1", "Tue+1", "Wed+1"];
  let price = 3000 + Math.random() * 2000;
  return days.map((day) => {
    price += (Math.random() - 0.5) * 800;
    price = Math.max(2000, Math.min(8000, price));
    return { day, price: Math.round(price) };
  });
}
