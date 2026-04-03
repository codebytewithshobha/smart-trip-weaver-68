import { TransportOption } from "@/types/travel";
import { Clock, Star, Leaf, Users, MapPin } from "lucide-react";

const typeConfig = {
  train: { icon: "🚆", label: "Train", accent: "border-l-success" },
  flight: { icon: "✈️", label: "Flight", accent: "border-l-primary" },
  bus: { icon: "🚌", label: "Bus", accent: "border-l-warning" },
};

interface TransportCardProps {
  option: TransportOption;
  onSelect: (option: TransportOption) => void;
}

export default function TransportCard({ option, onSelect }: TransportCardProps) {
  const config = typeConfig[option.type];

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

        {/* Right: Price & stats */}
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
        </div>
      </div>
    </div>
  );
}
