import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, DollarSign, Users, Sparkles, Plane, Train, Bus } from "lucide-react";

const popularRoutes = [
  { from: "Delhi", to: "Goa", emoji: "🏖️" },
  { from: "Mumbai", to: "Jaipur", emoji: "🏰" },
  { from: "Bangalore", to: "Manali", emoji: "🏔️" },
  { from: "Chennai", to: "Kerala", emoji: "🌴" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("1");

  const handleSearch = () => {
    if (!from || !to) return;
    const params = new URLSearchParams({ from, to, date: date || "2026-04-15", budget: budget || "10000", travelers });
    navigate(`/results?${params}`);
  };

  const handleQuickRoute = (route: typeof popularRoutes[0]) => {
    setFrom(route.from);
    setTo(route.to);
  };

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <div className="glow-overlay absolute inset-0 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-xl text-foreground">AI Travel</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Plane className="h-4 w-4" /> Flights</span>
          <span className="flex items-center gap-1"><Train className="h-4 w-4" /> Trains</span>
          <span className="flex items-center gap-1"><Bus className="h-4 w-4" /> Buses</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Smart Travel
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Your Journey, <span className="text-gradient">Reimagined</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
          AI compares trains, flights & buses to find your perfect trip — optimized for budget, time, and sustainability.
        </p>
      </div>

      {/* Search Card */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> From</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Delhi"
                className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> To</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Goa"
                className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" /> Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Travelers</label>
              <input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                min="1"
                max="10"
                className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full mt-5 py-3.5 rounded-xl gradient-primary font-display font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-glow"
          >
            <Sparkles className="h-5 w-5" />
            Generate Smart Trip
          </button>
        </div>

        {/* Quick routes */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-12">
          {popularRoutes.map((r) => (
            <button
              key={r.to}
              onClick={() => handleQuickRoute(r)}
              className="px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-secondary-foreground hover:bg-secondary transition-colors"
            >
              {r.emoji} {r.from} → {r.to}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { value: "50K+", label: "Routes Analyzed" },
            { value: "98%", label: "Accuracy Rate" },
            { value: "3s", label: "Avg. Response" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-display font-bold text-gradient">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
