import { useState } from "react";
import AIFeaturePanel, { AILoadingInline, useAILoading } from "./AIFeaturePanel";
import TravelBuddyPanel from "./TravelBuddyPanel";
import {
  generateCarbonData, generateHiddenGems,
  generatePackingList, generatePricePrediction, generateWeatherData,
  generateSafetyScore, generateHiddenCosts,
} from "@/data/mockData";
import { Leaf, Users, Gem, Backpack, TrendingUp, CloudSun, ShieldCheck, DollarSign } from "lucide-react";

const features = [
  { id: "carbon", icon: Leaf, title: "Carbon Footprint", desc: "See CO₂ emissions for each route. Choose eco-friendly options.", color: "text-green-400" },
  { id: "buddy", icon: Users, title: "Travel Buddy Match", desc: "Find verified co-travelers on the same route. Split costs!", color: "text-blue-400" },
  { id: "gems", icon: Gem, title: "Hidden Gems AI", desc: "Discover secret local spots tourists never find.", color: "text-purple-400" },
  { id: "packing", icon: Backpack, title: "Smart Packing List", desc: "AI generates packing list based on weather & activities.", color: "text-yellow-400" },
  { id: "price", icon: TrendingUp, title: "Price Predictor", desc: "AI predicts if prices will rise or fall. Book at best time.", color: "text-rose-400" },
  { id: "weather", icon: CloudSun, title: "Weather Compare", desc: "Live weather comparison between origin & destination.", color: "text-cyan-400" },
  { id: "safety", icon: ShieldCheck, title: "Safety Score", desc: "AI safety ratings for solo travelers, women travelers.", color: "text-teal-400" },
  { id: "costs", icon: DollarSign, title: "Hidden Costs AI", desc: "Predicts ALL expenses including food, local transport.", color: "text-orange-400" },
];

interface AIFeaturesGridProps {
  destination: string;
  budget: number;
}

export default function AIFeaturesGrid({ destination, budget }: AIFeaturesGridProps) {
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const [buddyOpen, setBuddyOpen] = useState(false);
  const { loading, loaded, trigger } = useAILoading(1200);

  const handleOpen = (id: string) => {
    if (id === "buddy") {
      setBuddyOpen(true);
      return;
    }
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
      <h3 className="text-2xl font-display font-bold text-foreground mb-2">AI Features You Won't Find Anywhere Else</h3>
      <p className="text-sm text-muted-foreground mb-6">Powered by AI to make your travel smarter</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => handleOpen(f.id)}
              className="glass-card p-5 text-left hover:scale-[1.03] transition-all duration-200 cursor-pointer group border border-border/50 hover:border-primary/40"
            >
              <Icon className={`h-7 w-7 mb-3 ${f.color} group-hover:scale-110 transition-transform`} />
              <h4 className="font-display font-bold text-foreground text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </button>
          );
        })}
      </div>

      {features.filter(f => f.id !== "buddy").map((f) => (
        <AIFeaturePanel
          key={f.id}
          title={f.title}
          icon={f.id}
          isOpen={openFeature === f.id}
          onClose={() => setOpenFeature(null)}
        >
          {openFeature === f.id && renderContent(f.id)}
        </AIFeaturePanel>
      ))}

      <TravelBuddyPanel isOpen={buddyOpen} onClose={() => setBuddyOpen(false)} />
    </div>
  );
}
