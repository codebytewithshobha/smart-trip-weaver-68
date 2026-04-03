import { ItineraryDay } from "@/types/travel";

interface ItineraryViewProps {
  itinerary: ItineraryDay[];
}

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-bold text-foreground text-gradient">🗓️ AI-Generated Itinerary</h3>
      {itinerary.map((day) => (
        <div key={day.day} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${day.day * 100}ms` }}>
          <h4 className="font-display font-semibold text-foreground mb-3">
            Day {day.day}: {day.title}
          </h4>
          <div className="space-y-3">
            {day.activities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 pl-2 border-l-2 border-primary/30">
                <span className="text-lg">{act.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{act.activity}</span>
                    <span className="text-xs text-muted-foreground">₹{act.cost}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border/50 text-right text-sm text-muted-foreground">
            Day Total: ₹{day.activities.reduce((s, a) => s + a.cost, 0).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
