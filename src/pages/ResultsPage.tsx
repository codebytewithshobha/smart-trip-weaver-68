import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";
import AILoadingScreen from "@/components/AILoadingScreen";
import TransportCard from "@/components/TransportCard";
import ItineraryView from "@/components/ItineraryView";
import AIFeaturesGrid from "@/components/AIFeaturesGrid";
import { generateTransportOptions, generateItinerary } from "@/data/mockData";
import { TransportOption, ItineraryDay } from "@/types/travel";

type FilterType = "all" | "cheapest" | "fastest" | "eco";
type TransportType = "all" | "train" | "flight" | "bus";

export default function ResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get("from") || "Delhi";
  const to = params.get("to") || "Goa";
  const budget = Number(params.get("budget")) || 10000;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [typeFilter, setTypeFilter] = useState<TransportType>("all");
  const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOptions(generateTransportOptions(from, to, budget));
      setItinerary(generateItinerary(to, 3));
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [from, to, budget]);

  if (loading) return <AILoadingScreen message="AI analyzing your trip..." />;

  let filtered = [...options];
  if (typeFilter !== "all") filtered = filtered.filter((o) => o.type === typeFilter);

  switch (filter) {
    case "cheapest": filtered.sort((a, b) => a.price - b.price); break;
    case "fastest": filtered.sort((a, b) => a.durationMinutes - b.durationMinutes); break;
    case "eco": filtered.sort((a, b) => a.co2 - b.co2); break;
  }

  const trainCount = options.filter(o => o.type === 'train').length;
  const flightCount = options.filter(o => o.type === 'flight').length;
  const busCount = options.filter(o => o.type === 'bus').length;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="glow-overlay absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {from} → {to}
            </h1>
            <p className="text-sm text-muted-foreground">Budget: ₹{budget.toLocaleString()} • {options.length} options found</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary">
            <Sparkles className="h-4 w-4" /> AI-Optimized Results
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 space-y-8">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all" as TransportType, label: `All (${options.length})` },
            { key: "train" as TransportType, label: `🚆 Trains (${trainCount})` },
            { key: "flight" as TransportType, label: `✈️ Flights (${flightCount})` },
            { key: "bus" as TransportType, label: `🚌 Buses (${busCount})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                typeFilter === t.key
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          {[
            { key: "all" as FilterType, label: "All" },
            { key: "cheapest" as FilterType, label: "💰 Cheapest" },
            { key: "fastest" as FilterType, label: "⚡ Fastest" },
            { key: "eco" as FilterType, label: "🌿 Eco-Friendly" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                filter === f.key
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transport cards */}
        <div className="space-y-3">
          {filtered.map((opt) => (
            <TransportCard key={opt.id} option={opt} onSelect={setSelectedOption} />
          ))}
        </div>

        {/* Selected option confirmation */}
        {selectedOption && (
          <div className="glass-card p-5 border border-primary/30 animate-scale-in">
            <h3 className="font-display font-bold text-foreground mb-2">✅ Selected: {selectedOption.provider}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedOption.type === 'bus' ? '🚌' : selectedOption.type === 'train' ? '🚆' : '✈️'}{' '}
              {selectedOption.departureTime} - {selectedOption.arrivalTime} • ₹{selectedOption.price.toLocaleString()} • {selectedOption.duration}
            </p>
          </div>
        )}

        {/* AI Features */}
        <AIFeaturesGrid destination={to} budget={budget} />

        {/* Itinerary */}
        <ItineraryView itinerary={itinerary} />
      </div>
    </div>
  );
}
