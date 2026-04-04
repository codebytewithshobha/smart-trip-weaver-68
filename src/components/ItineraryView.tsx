import { useState } from "react";
import { ItineraryDay } from "@/types/travel";
import { ExternalLink, MapPin, Camera, Ticket, UtensilsCrossed, ChevronDown, ChevronUp } from "lucide-react";

interface ItineraryViewProps {
  itinerary: ItineraryDay[];
}

const linkConfig = {
  maps: {
    label: "View on Maps",
    icon: MapPin,
    getUrl: (term: string) => `https://www.google.com/maps/search/${encodeURIComponent(term)}`,
    color: "text-blue-400 bg-blue-500/20 hover:bg-blue-500/30",
  },
  zomato: {
    label: "Find on Zomato",
    icon: UtensilsCrossed,
    getUrl: (term: string) => `https://www.zomato.com/search?q=${encodeURIComponent(term)}`,
    color: "text-red-400 bg-red-500/20 hover:bg-red-500/30",
  },
  images: {
    label: "See Photos",
    icon: Camera,
    getUrl: (term: string) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`,
    color: "text-purple-400 bg-purple-500/20 hover:bg-purple-500/30",
  },
  book: {
    label: "Book Activity",
    icon: Ticket,
    getUrl: (term: string) => `https://www.thrillophilia.com/search?q=${encodeURIComponent(term)}`,
    color: "text-green-400 bg-green-500/20 hover:bg-green-500/30",
  },
};

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const handleClick = (dayIdx: number, actIdx: number) => {
    const key = `${dayIdx}-${actIdx}`;
    setExpandedActivity(expandedActivity === key ? null : key);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-bold text-foreground text-gradient">🗓️ AI-Generated Itinerary</h3>
      {itinerary.map((day) => (
        <div key={day.day} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${day.day * 100}ms` }}>
          <h4 className="font-display font-semibold text-foreground mb-3">
            Day {day.day}: {day.title}
          </h4>
          <div className="space-y-2">
            {day.activities.map((act, i) => {
              const key = `${day.day}-${i}`;
              const isExpanded = expandedActivity === key;
              const linkType = act.linkType || "maps";
              const config = linkConfig[linkType];
              const LinkIcon = config.icon;
              const searchTerm = act.searchTerm || act.activity;

              return (
                <div key={i} className="group">
                  <div
                    onClick={() => handleClick(day.day, i)}
                    className={`flex items-start gap-3 pl-2 border-l-2 p-2 rounded-r-lg cursor-pointer transition-all duration-200 ${
                      isExpanded
                        ? "border-primary bg-secondary/60"
                        : "border-primary/30 hover:border-primary/60 hover:bg-secondary/30"
                    }`}
                  >
                    <span className="text-lg">{act.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{act.activity}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">₹{act.cost.toLocaleString()}</span>
                          {isExpanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{act.time}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="ml-8 mt-1 mb-2 p-3 rounded-lg bg-secondary/40 animate-fade-in space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {/* Primary action */}
                        <button
                          onClick={(e) => { e.stopPropagation(); window.open(config.getUrl(searchTerm), "_blank"); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${config.color}`}
                        >
                          <LinkIcon className="h-3 w-3" /> {config.label} <ExternalLink className="h-2.5 w-2.5" />
                        </button>

                        {/* Always show Maps if not already the primary */}
                        {linkType !== "maps" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); window.open(linkConfig.maps.getUrl(searchTerm), "_blank"); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
                          >
                            <MapPin className="h-3 w-3" /> View on Maps <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        )}

                        {/* Always show Photos if not already primary */}
                        {linkType !== "images" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); window.open(linkConfig.images.getUrl(searchTerm), "_blank"); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                          >
                            <Camera className="h-3 w-3" /> See Photos <ExternalLink className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-muted-foreground">
                        💡 Tip: {
                          linkType === "zomato" ? "Check reviews and pre-book a table for the best experience." :
                          linkType === "book" ? "Book in advance to get early-bird discounts up to 20% off." :
                          linkType === "images" ? "Save offline maps — not all scenic spots have network coverage." :
                          "Download the area for offline use in Google Maps before heading out."
                        }
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border/50 text-right text-sm text-muted-foreground">
            Day Total: ₹{day.activities.reduce((s, a) => s + a.cost, 0).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
