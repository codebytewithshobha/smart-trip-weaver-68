import { useState } from "react";
import AIFeaturePanel, { AILoadingInline, useAILoading } from "./AIFeaturePanel";
import {
  generateCarbonData, generateBuddyMatches, generateHiddenGems,
  generatePackingList, generatePricePrediction, generateWeatherData,
  generateSafetyScore, generateHiddenCosts,
} from "@/data/mockData";

const features = [
  { id: "carbon", icon: "🌱", title: "Carbon Footprint" },
  { id: "buddy", icon: "👥", title: "Travel Buddy Match" },
  { id: "gems", icon: "💎", title: "Hidden Gems" },
  { id: "packing", icon: "🎒", title: "Smart Packing" },
  { id: "price", icon: "📈", title: "Price Predictor" },
  { id: "weather", icon: "🌤️", title: "Weather Compare" },
  { id: "safety", icon: "🛡️", title: "Safety Score" },
  { id: "costs", icon: "💸", title: "Hidden Costs" },
];

interface AIFeaturesGridProps {
  destination: string;
  budget: number;
}

export default function AIFeaturesGrid({ destination, budget }: AIFeaturesGridProps) {
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const { loading, loaded, trigger } = useAILoading(1200);

  const handleOpen = (id: string) => {
    setOpenFeature(id);
    trigger();
  };

  const renderContent = (id: string) => {
    if (loading) return <AILoadingInline text="AI processing..." />;
    if (!loaded) return null;

    switch (id) {
      case "carbon": {
        const data = generateCarbonData();
        const maxCo2 = Math.max(...data.map(d => d.co2));
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">CO₂ emissions per passenger (kg)</p>
            {data.map((d) => (
              <div key={d.mode} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{d.mode}</span>
                  <span className="font-semibold text-foreground">{d.co2} kg</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.co2 / maxCo2) * 100}%`, background: d.color }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-success mt-4">🌿 Choosing train saves up to 84% CO₂ vs flying!</p>
          </div>
        );
      }
      case "buddy": {
        const buddies = generateBuddyMatches();
        return (
          <div className="space-y-3">
            {buddies.map((b) => (
              <div key={b.name} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <span className="text-3xl">{b.avatar}</span>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{b.name}, {b.age}</div>
                  <div className="text-xs text-muted-foreground">{b.interests.join(", ")}</div>
                </div>
                <div className="text-sm font-bold text-primary">{b.matchPercent}%</div>
              </div>
            ))}
          </div>
        );
      }
      case "gems": {
        const gems = generateHiddenGems(destination);
        return (
          <div className="space-y-3">
            {gems.map((g) => (
              <div key={g.name} className="p-3 rounded-lg bg-secondary/50 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{g.image}</span>
                  <div>
                    <div className="font-semibold text-foreground">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{g.category} • ⭐ {g.rating}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </div>
            ))}
          </div>
        );
      }
      case "packing": {
        const list = generatePackingList();
        return (
          <div className="space-y-4">
            {list.map((cat) => (
              <div key={cat.category}>
                <h4 className="font-semibold text-foreground text-sm mb-2">{cat.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span key={item} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">✓ {item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }
      case "price": {
        const data = generatePricePrediction();
        const maxP = Math.max(...data.map(d => d.price));
        const minP = Math.min(...data.map(d => d.price));
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Price trend (next 10 days)</p>
            <div className="flex items-end gap-1 h-40">
              {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">₹{(d.price / 1000).toFixed(1)}k</span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${((d.price - minP) / (maxP - minP)) * 100 + 15}%`,
                      background: d.price === minP ? 'hsl(var(--success))' : d.price === maxP ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-success">💡 Best day to book: {data.find(d => d.price === minP)?.day} (₹{minP.toLocaleString()})</p>
          </div>
        );
      }
      case "weather": {
        const weather = generateWeatherData(destination);
        return (
          <div className="grid grid-cols-2 gap-3">
            {weather.map((w) => (
              <div key={w.city} className="p-4 rounded-lg bg-secondary/50 text-center space-y-2">
                <span className="text-4xl">{w.icon}</span>
                <div className="font-semibold text-foreground">{w.city}</div>
                <div className="text-3xl font-display font-bold text-foreground">{w.temp}°C</div>
                <div className="text-xs text-muted-foreground">{w.condition}</div>
                <div className="text-xs text-muted-foreground">💧 {w.humidity}%</div>
              </div>
            ))}
          </div>
        );
      }
      case "safety": {
        const safety = generateSafetyScore();
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-foreground">{safety.overall}<span className="text-lg text-muted-foreground">/10</span></div>
              <p className="text-sm text-success mt-1">✅ Safe for tourists</p>
            </div>
            {safety.categories.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="font-semibold text-foreground">{c.score}/10</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full gradient-primary transition-all duration-700" style={{ width: `${c.score * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        );
      }
      case "costs": {
        const costs = generateHiddenCosts(budget);
        const total = costs.reduce((s, c) => s + c.cost, 0);
        return (
          <div className="space-y-3">
            {costs.map((c) => (
              <div key={c.item} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <span className="flex items-center gap-2 text-sm">
                  <span>{c.icon}</span>
                  <span className="text-foreground">{c.item}</span>
                </span>
                <span className="font-semibold text-foreground">₹{c.cost.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-border font-bold">
              <span className="text-foreground">Total Hidden Costs</span>
              <span className="text-destructive">₹{total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-warning">⚠️ Your actual trip may cost ~₹{(budget + total).toLocaleString()}</p>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className="text-xl font-display font-bold text-foreground mb-4">🤖 AI Features</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => handleOpen(f.id)}
            className="glass-card p-4 text-center hover:scale-105 transition-transform duration-200 cursor-pointer group"
          >
            <span className="text-2xl block mb-1 group-hover:animate-float">{f.icon}</span>
            <span className="text-xs font-medium text-foreground">{f.title}</span>
          </button>
        ))}
      </div>

      {features.map((f) => (
        <AIFeaturePanel
          key={f.id}
          title={f.title}
          icon={f.icon}
          isOpen={openFeature === f.id}
          onClose={() => setOpenFeature(null)}
        >
          {openFeature === f.id && renderContent(f.id)}
        </AIFeaturePanel>
      ))}
    </div>
  );
}
