import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, Sparkles, Download } from "lucide-react";
import AILoadingScreen from "@/components/AILoadingScreen";
import TransportCard from "@/components/TransportCard";
import ItineraryView from "@/components/ItineraryView";
import AIFeaturesGrid from "@/components/AIFeaturesGrid";
import HotelRecommendations from "@/components/HotelRecommendations";
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

  const downloadItinerary = (format: "txt" | "json" = "txt") => {
    if (format === "json") {
      const data = {
        trip: { from, to, budget, date: new Date().toISOString() },
        itinerary,
        transport: selectedOption,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `itinerary-${from}-${to}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } else {
      const content = [`Trip Itinerary: ${from} → ${to}`, `Budget: ₹${budget.toLocaleString()}`, "", ...itinerary.flatMap((day) => [
        `Day ${day.day}: ${day.title}`,
        ...day.activities.map((act) => `  - ${act.time} | ${act.activity} | ₹${act.cost.toLocaleString()} | ${act.notes || ""}`),
        "",
      ])];

      const blob = new Blob([content.join("\n")], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `itinerary-${from}-${to}.txt`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="glow-overlay absolute inset-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              {from} → {to}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Budget: ₹{budget.toLocaleString()} • {options.length} options found</p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-primary whitespace-nowrap">
            <Sparkles className="h-4 w-4" /> AI-Optimized Results
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-12 space-y-6 sm:space-y-8">
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
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
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
        <div className="flex flex-wrap items-center gap-2">
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
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs transition-all ${
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
          <div className="glass-card p-4 sm:p-5 border border-primary/30 animate-scale-in">
            <h3 className="font-display font-bold text-foreground mb-2 text-sm sm:text-base">✅ Selected: {selectedOption.provider}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">
              {selectedOption.type === 'bus' ? '🚌' : selectedOption.type === 'train' ? '🚆' : '✈️'}{' '}
              {selectedOption.departureTime} - {selectedOption.arrivalTime} • ₹{selectedOption.price.toLocaleString()} • {selectedOption.duration}
            </p>
          </div>
        )}

        {/* Hotel Recommendations */}
        <HotelRecommendations destination={to} budget={budget} />

        {/* AI Features */}
        <AIFeaturesGrid destination={to} budget={budget} />

        {/* Itinerary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Your AI itinerary</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => downloadItinerary("txt")}
              disabled={itinerary.length === 0}
              className="flex items-center gap-2 rounded-full bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" /> TXT
            </button>
            <button
              onClick={() => downloadItinerary("json")}
              disabled={itinerary.length === 0}
              className="flex items-center gap-2 rounded-full bg-secondary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:bg-secondary/40"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" /> JSON
            </button>
          </div>
        </div>
        <ItineraryView itinerary={itinerary} />
      </div>
    </div>
  );
}
