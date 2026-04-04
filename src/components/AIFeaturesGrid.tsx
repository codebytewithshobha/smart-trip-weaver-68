import { useState } from "react";
import AIFeaturePanel, { AILoadingInline, useAILoading } from "./AIFeaturePanel";
import TravelBuddyPanel from "./TravelBuddyPanel";
import SmartPackingPanel from "./SmartPackingPanel";
import {
  generateCarbonData, generateHiddenGems,
  generatePackingList, generatePricePrediction, generateWeatherData,
  generateSafetyScore, generateHiddenCosts, SafetyData,
} from "@/data/mockData";
import { Leaf, Users, Gem, Backpack, TrendingUp, CloudSun, ShieldCheck, DollarSign, ExternalLink, MapPin, Phone, AlertTriangle, Moon, Lightbulb } from "lucide-react";

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

  const openInMaps = (name: string) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(name + " " + destination)}`, "_blank", "noopener,noreferrer");
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
              <div
                key={g.name}
                className="p-3 rounded-lg bg-secondary/50 space-y-2 hover:bg-secondary/70 transition-colors cursor-pointer group"
                onClick={() => openInMaps(g.name)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{g.image}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{g.name}</div>
                    <div className="text-xs text-muted-foreground">{g.category} • ⭐ {g.rating}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <MapPin className="h-3 w-3" /> View on Map <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </div>
            ))}
          </div>
        );
      }
      case "packing": {
        return <SmartPackingPanel destination={destination} />;
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
        const safety = generateSafetyScore(destination);
        return <SafetyScoreContent safety={safety} destination={destination} />;
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

/* ─── Enhanced Safety Score Component ─── */
function SafetyScoreContent({ safety, destination }: { safety: SafetyData; destination: string }) {
  const [activeTab, setActiveTab] = useState<"overview" | "women" | "emergency" | "scams" | "tips">("overview");

  const overallColor = safety.overall >= 8.5 ? "text-success" : safety.overall >= 7 ? "text-primary" : "text-warning";

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: "📊" },
    { key: "women" as const, label: "Women Safety", icon: "👩" },
    { key: "emergency" as const, label: "Emergency", icon: "🚨" },
    { key: "scams" as const, label: "Scam Alerts", icon: "⚠️" },
    { key: "tips" as const, label: "Solo Tips", icon: "💡" },
  ];

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="text-center p-4 rounded-xl bg-secondary/30">
        <div className={`text-5xl font-display font-bold ${overallColor}`}>
          {safety.overall}<span className="text-lg text-muted-foreground">/10</span>
        </div>
        <p className={`text-sm mt-1 ${overallColor}`}>✅ {safety.verdict}</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="text-center">
            <Moon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <div className="text-sm font-bold text-foreground">{safety.nightSafetyScore}/10</div>
            <div className="text-[10px] text-muted-foreground">Night Safety</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <AlertTriangle className="h-4 w-4 mx-auto text-warning mb-1" />
            <div className="text-sm font-bold text-foreground">{safety.travelAdvisories.length}</div>
            <div className="text-[10px] text-muted-foreground">Advisories</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <Phone className="h-4 w-4 mx-auto text-primary mb-1" />
            <div className="text-sm font-bold text-foreground">{safety.emergencyContacts.length}</div>
            <div className="text-[10px] text-muted-foreground">Helplines</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
              activeTab === t.key
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-3">
          {safety.categories.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{c.icon} {c.name}</span>
                <span className="font-semibold text-foreground">{c.score}/10</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${c.score * 10}%`,
                    background: c.score >= 8 ? 'hsl(var(--success))' : c.score >= 6 ? 'hsl(var(--primary))' : 'hsl(var(--warning))',
                  }}
                />
              </div>
            </div>
          ))}
          {/* Travel Advisories */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-warning" /> Travel Advisories
            </h4>
            {safety.travelAdvisories.map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30 text-xs">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: a.color, color: 'hsl(var(--background))' }}>
                  {a.level}
                </span>
                <span className="text-muted-foreground">{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "women" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">AI-analyzed safety metrics for women travelers in {destination}</p>
          {safety.womenSafety.map((w) => (
            <div key={w.metric} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <span className="flex items-center gap-2 text-sm">
                <span>{w.icon}</span>
                <span className="text-foreground">{w.metric}</span>
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                w.rating.includes("High") || w.rating.includes("Good") || w.rating.includes("Very Low")
                  ? "bg-success/20 text-success"
                  : w.rating.includes("Moderate")
                  ? "bg-warning/20 text-warning"
                  : "bg-destructive/20 text-destructive"
              }`}>
                {w.rating}
              </span>
            </div>
          ))}
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">🛡️ Women Safety Quick Tips:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Save Women Helpline: <span className="text-primary font-semibold">1091</span></li>
              <li>Prefer well-lit public transport after dark</li>
              <li>Share live location with trusted contacts</li>
              <li>Use she-taxi / women-friendly ride services when available</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "emergency" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Emergency contacts for {destination}</p>
          <div className="grid grid-cols-2 gap-2">
            {safety.emergencyContacts.map((e) => (
              <a
                key={e.service}
                href={`tel:${e.number}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <span className="text-xl">{e.icon}</span>
                <div>
                  <div className="text-xs text-muted-foreground">{e.service}</div>
                  <div className="text-sm font-bold text-primary">{e.number}</div>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center">Tap to call • Available 24/7</p>
        </div>
      )}

      {activeTab === "scams" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Common tourist scams in {destination}</p>
          {safety.scamAlerts.map((s) => (
            <div key={s.scam} className="p-3 rounded-lg bg-secondary/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">⚠️ {s.scam}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.risk === "High" ? "bg-destructive/20 text-destructive" : s.risk === "Medium" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
                }`}>
                  {s.risk} Risk
                </span>
              </div>
              <p className="text-xs text-muted-foreground">💡 {s.tip}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "tips" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">AI-curated safety tips for solo travelers</p>
          {safety.soloTravelerTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
              <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-primary-foreground font-bold">{i + 1}</span>
              <span className="text-sm text-foreground">{tip}</span>
            </div>
          ))}
          <div className="p-3 rounded-lg border border-success/20 bg-success/5 text-xs text-muted-foreground">
            <p className="font-semibold text-success mb-1">🌟 Pro Tip</p>
            <p>Join local travel Facebook/WhatsApp groups for {destination} to get real-time safety updates from fellow travelers.</p>
          </div>
        </div>
      )}
    </div>
  );
}
