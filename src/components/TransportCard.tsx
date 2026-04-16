import { TransportOption } from "@/types/travel";
import { Clock, Star, Leaf, Users, MapPin, ExternalLink, ArrowRight, Navigation } from "lucide-react";
import { useState } from "react";

const typeConfig = {
  train: { icon: "🚆", label: "Train", accent: "border-l-success", bookingUrl: "https://www.irctc.co.in", bookingLabel: "Book on IRCTC" },
  flight: { icon: "✈️", label: "Flight", accent: "border-l-primary", bookingUrl: "https://www.makemytrip.com/flights", bookingLabel: "Book on MakeMyTrip" },
  bus: { icon: "🚌", label: "Bus", accent: "border-l-warning", bookingUrl: "https://www.redbus.in", bookingLabel: "Book on RedBus" },
};

const modeIcons: Record<string, string> = { train: "🚆", bus: "🚌", auto: "🛺", cab: "🚕" };

interface TransportCardProps {
  option: TransportOption;
  onSelect: (option: TransportOption) => void;
}

export default function TransportCard({ option, onSelect }: TransportCardProps) {
  const config = typeConfig[option.type];
  const [showConnections, setShowConnections] = useState(false);

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(config.bookingUrl, "_blank", "noopener,noreferrer");
  };

  const hasConnections = !option.isDirect && option.connections && option.connections.length > 0;

  return (
    <div
      className={`glass-card p-5 border-l-4 ${config.accent} cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-fade-in`}
      onClick={() => onSelect(option)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Provider & times */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <span className="font-display font-semibold text-foreground">{option.provider}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{config.label}</span>
            {!option.isDirect && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning border border-warning/30">
                Connecting
              </span>
            )}
            {option.isDirect && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">
                Direct
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{option.departureTime}</span>
            <span className="flex-1 border-t border-dashed border-muted-foreground/30 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-card px-2">{option.duration}</span>
            </span>
            <span className="font-semibold text-foreground">{option.arrivalTime}</span>
          </div>
          {option.stops > 0 && <span className="text-xs text-muted-foreground">{option.stops} stop{option.stops > 1 ? 's' : ''}</span>}
        </div>

        {/* Right: Price, stats & booking */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
          <span className="text-2xl font-display font-bold text-foreground">₹{option.price.toLocaleString()}</span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" />{option.rating}</span>
            <span className="flex items-center gap-1"><Leaf className="h-3 w-3 text-success" />{option.co2}kg</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{option.availability} left</span>
          </div>
          {option.type === 'bus' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {option.seatType && <span className="px-2 py-0.5 rounded bg-secondary">{option.seatType}</span>}
              {option.boardingPoint && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{option.boardingPoint}</span>}
            </div>
          )}
          <button
            onClick={handleBooking}
            className="mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-glow"
          >
            <ExternalLink className="h-3 w-3" />
            {config.bookingLabel}
          </button>
        </div>
      </div>

      {/* Connection/Interchange Info */}
      {hasConnections && (
        <div className="mt-3 border-t border-muted-foreground/10 pt-3">
          <button
            onClick={(e) => { e.stopPropagation(); setShowConnections(!showConnections); }}
            className="flex items-center gap-2 text-xs font-medium text-warning hover:text-warning/80 transition-colors"
          >
            <Navigation className="h-3.5 w-3.5" />
            {showConnections ? "Hide" : "Show"} nearby interchange options ({option.connections!.length})
          </button>

          {showConnections && (
            <div className="mt-3 space-y-2 animate-fade-in">
              <p className="text-xs text-muted-foreground mb-2">
                🔄 No direct {config.label.toLowerCase()} available — here's how to reach the nearest {config.label.toLowerCase()} station:
              </p>
              {option.connections!.map((conn, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-muted-foreground/10 hover:bg-secondary/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/maps/dir/${encodeURIComponent(conn.from)}/${encodeURIComponent(conn.to)}`, "_blank");
                  }}
                >
                  <span className="text-lg">{modeIcons[conn.mode] || "🚗"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="font-medium text-foreground truncate">{conn.from}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-foreground truncate">{conn.to}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="capitalize">{conn.mode}</span>
                      <span>• {conn.distance}</span>
                      <span>• {conn.duration}</span>
                    </div>
                    <p className="text-xs text-primary/80 mt-1">💡 {conn.tip}</p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
