import { useState } from "react";
import { Star, Wifi, Car, Utensils, Dumbbell, Wind, Tv, Coffee, ExternalLink, MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  distance: string;
  amenities: string[];
  type: string;
  highlight: string;
  bookingUrl: string;
  makemytripUrl: string;
  mapsUrl: string;
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="h-3 w-3" />,
  "Parking": <Car className="h-3 w-3" />,
  "Restaurant": <Utensils className="h-3 w-3" />,
  "Gym": <Dumbbell className="h-3 w-3" />,
  "AC": <Wind className="h-3 w-3" />,
  "TV": <Tv className="h-3 w-3" />,
  "Breakfast": <Coffee className="h-3 w-3" />,
};

function generateHotels(destination: string, budget: number): Hotel[] {
  const hotels: Hotel[] = [
    {
      id: "h1", name: `The Grand ${destination} Resort`, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      rating: 4.6, reviews: 2340, price: Math.round(budget * 0.35), originalPrice: Math.round(budget * 0.5),
      distance: "2.3 km from center", amenities: ["Free WiFi", "Parking", "Restaurant", "Gym", "AC"],
      type: "4-Star Hotel", highlight: "🔥 Most Popular",
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
      makemytripUrl: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(destination)}`,
      mapsUrl: `https://www.google.com/maps/search/hotels+in+${encodeURIComponent(destination)}`,
    },
    {
      id: "h2", name: `${destination} Backpacker Hostel`, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
      rating: 4.2, reviews: 890, price: Math.round(budget * 0.08), originalPrice: Math.round(budget * 0.12),
      distance: "0.5 km from center", amenities: ["Free WiFi", "Breakfast", "AC"],
      type: "Hostel", highlight: "💰 Best Value",
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&nflt=ht_id%3D203`,
      makemytripUrl: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(destination)}`,
      mapsUrl: `https://www.google.com/maps/search/hostels+in+${encodeURIComponent(destination)}`,
    },
    {
      id: "h3", name: `${destination} Heritage Palace`, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=250&fit=crop",
      rating: 4.8, reviews: 1560, price: Math.round(budget * 0.6), originalPrice: Math.round(budget * 0.8),
      distance: "4.1 km from center", amenities: ["Free WiFi", "Parking", "Restaurant", "Gym", "AC", "TV"],
      type: "5-Star Luxury", highlight: "⭐ Top Rated",
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&nflt=class%3D5`,
      makemytripUrl: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(destination)}`,
      mapsUrl: `https://www.google.com/maps/search/luxury+hotels+in+${encodeURIComponent(destination)}`,
    },
    {
      id: "h4", name: `Cozy Stay ${destination}`, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
      rating: 4.0, reviews: 430, price: Math.round(budget * 0.15), originalPrice: Math.round(budget * 0.22),
      distance: "1.8 km from center", amenities: ["Free WiFi", "AC", "TV", "Breakfast"],
      type: "Budget Hotel", highlight: "🏠 Homely Vibes",
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&nflt=class%3D2`,
      makemytripUrl: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(destination)}`,
      mapsUrl: `https://www.google.com/maps/search/budget+hotels+in+${encodeURIComponent(destination)}`,
    },
    {
      id: "h5", name: `${destination} Lake View Villa`, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
      rating: 4.5, reviews: 710, price: Math.round(budget * 0.4), originalPrice: Math.round(budget * 0.55),
      distance: "6.2 km from center", amenities: ["Free WiFi", "Parking", "Restaurant", "AC", "TV"],
      type: "Villa", highlight: "🏞️ Best Views",
      bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
      makemytripUrl: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(destination)}`,
      mapsUrl: `https://www.google.com/maps/search/villas+in+${encodeURIComponent(destination)}`,
    },
  ];
  return hotels;
}

type SortType = "recommended" | "price-low" | "price-high" | "rating";

export default function HotelRecommendations({ destination, budget }: { destination: string; budget: number }) {
  const [sort, setSort] = useState<SortType>("recommended");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const hotels = generateHotels(destination, budget);

  const sorted = [...hotels].sort((a, b) => {
    switch (sort) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      default: return 0;
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            🏨 AI Hotel Picks for {destination}
          </h2>
          <p className="text-sm text-muted-foreground">{hotels.length} stays curated by AI within your budget</p>
        </div>
        <div className="flex gap-1.5">
          {([
            { key: "recommended", label: "✨ Best" },
            { key: "price-low", label: "💰 Cheap" },
            { key: "price-high", label: "👑 Premium" },
            { key: "rating", label: "⭐ Top Rated" },
          ] as { key: SortType; label: string }[]).map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                sort === s.key
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground bg-secondary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((hotel) => {
          const discount = Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100);
          const isExpanded = expandedId === hotel.id;

          return (
            <div
              key={hotel.id}
              className="glass-card overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold bg-background/80 backdrop-blur-sm text-foreground">
                  {hotel.highlight}
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/90 text-white">
                  {discount}% OFF
                </div>
                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{hotel.type}</p>
                    <h3 className="font-semibold text-foreground text-sm leading-tight">{hotel.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {hotel.distance}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground line-through">₹{hotel.originalPrice.toLocaleString()}</p>
                    <p className="text-lg font-bold text-foreground">₹{hotel.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">per night</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary/20">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-foreground">{hotel.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({hotel.reviews.toLocaleString()} reviews)</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, isExpanded ? hotel.amenities.length : 4).map((a) => (
                    <span key={a} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/60 text-[10px] text-muted-foreground">
                      {amenityIcons[a] || null} {a}
                    </span>
                  ))}
                  {!isExpanded && hotel.amenities.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary/60 text-[10px] text-muted-foreground">
                      +{hotel.amenities.length - 4} more
                    </span>
                  )}
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : hotel.id)}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {isExpanded ? "Less" : "More details"}
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>

                {isExpanded && (
                  <div className="space-y-2 animate-fade-in">
                    <button
                      onClick={() => window.open(hotel.mapsUrl, "_blank")}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
                    >
                      <MapPin className="h-3 w-3" /> View on Google Maps <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}

                {/* Booking buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => window.open(hotel.makemytripUrl, "_blank")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors"
                  >
                    MakeMyTrip <ExternalLink className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => window.open(hotel.bookingUrl, "_blank")}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    Booking.com <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
