import { useState } from "react";
import { Leaf, TreePine, Droplets, Wind, TrendingDown, Award, ExternalLink, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CarbonMode {
  mode: string;
  co2: number;
  color: string;
  treesNeeded: number;
  equivalentDriving: string;
  waterUsed: number;
  energyKwh: number;
}

const carbonData: CarbonMode[] = [
  { mode: "✈️ Flight", co2: 255, color: "hsl(0, 70%, 55%)", treesNeeded: 12, equivalentDriving: "1,020 km", waterUsed: 380, energyKwh: 520 },
  { mode: "🚗 Car", co2: 171, color: "hsl(25, 80%, 55%)", treesNeeded: 8, equivalentDriving: "684 km", waterUsed: 210, energyKwh: 340 },
  { mode: "🚌 Bus", co2: 68, color: "hsl(40, 90%, 55%)", treesNeeded: 3, equivalentDriving: "272 km", waterUsed: 95, energyKwh: 140 },
  { mode: "🚆 Train", co2: 41, color: "hsl(150, 70%, 45%)", treesNeeded: 2, equivalentDriving: "164 km", waterUsed: 55, energyKwh: 85 },
];

const offsetProjects = [
  { name: "Plant Trees in Western Ghats", cost: 120, trees: 5, co2Offset: 50, url: "https://www.grow-trees.com/", icon: "🌳" },
  { name: "Solar Energy for Rural India", cost: 200, co2Offset: 100, trees: 0, url: "https://www.suzlon.com/", icon: "☀️" },
  { name: "Clean Cookstoves Project", cost: 80, co2Offset: 35, trees: 0, url: "https://myclimate.org/", icon: "🍳" },
  { name: "Wind Farm Support", cost: 150, co2Offset: 75, trees: 0, url: "https://www.greenpeace.org/india/", icon: "💨" },
];

const ecoTips = [
  { tip: "Take a direct train instead of a connecting flight", savings: "84%", icon: "🚆" },
  { tip: "Travel during off-peak hours for lower energy usage", savings: "15%", icon: "⏰" },
  { tip: "Pack lighter — every kg adds to fuel consumption", savings: "5%", icon: "🎒" },
  { tip: "Share a ride or use public transit at destination", savings: "60%", icon: "🚌" },
  { tip: "Choose airlines with newer fuel-efficient aircraft", savings: "20%", icon: "✈️" },
  { tip: "Stay at eco-certified hotels at your destination", savings: "30%", icon: "🏨" },
];

export default function CarbonFootprintPanel() {
  const [selectedMode, setSelectedMode] = useState<CarbonMode | null>(null);
  const [expandedTips, setExpandedTips] = useState(false);
  const maxCo2 = Math.max(...carbonData.map(d => d.co2));
  const bestMode = carbonData.reduce((a, b) => a.co2 < b.co2 ? a : b);
  const worstMode = carbonData.reduce((a, b) => a.co2 > b.co2 ? a : b);
  const savingsPercent = Math.round(((worstMode.co2 - bestMode.co2) / worstMode.co2) * 100);

  const ecoScore = selectedMode
    ? Math.round(100 - (selectedMode.co2 / maxCo2) * 100)
    : Math.round(100 - (bestMode.co2 / maxCo2) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Excellent";
    if (score >= 40) return "Moderate";
    return "High Impact";
  };

  return (
    <div className="space-y-4">
      {/* Eco Score Hero */}
      <div className="relative p-5 rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border border-green-500/20 text-center">
        <div className="absolute top-3 right-3">
          <Award className="h-5 w-5 text-green-400 animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground mb-1">Your Eco Score</p>
        <div className={`text-5xl font-bold ${getScoreColor(ecoScore)} mb-1`}>
          {ecoScore}
        </div>
        <p className={`text-sm font-medium ${getScoreColor(ecoScore)}`}>{getScoreLabel(ecoScore)}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {selectedMode ? `Based on ${selectedMode.mode}` : `Based on best option: ${bestMode.mode}`}
        </p>
      </div>

      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="compare" className="text-xs">Compare</TabsTrigger>
          <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
          <TabsTrigger value="offset" className="text-xs">Offset</TabsTrigger>
          <TabsTrigger value="tips" className="text-xs">Eco Tips</TabsTrigger>
        </TabsList>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-3 mt-3">
          <p className="text-xs text-muted-foreground">Click a transport mode to see detailed impact</p>
          {carbonData.map((d) => (
            <div
              key={d.mode}
              onClick={() => setSelectedMode(selectedMode?.mode === d.mode ? null : d)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${
                selectedMode?.mode === d.mode
                  ? "bg-secondary/80 border-primary/40 scale-[1.02]"
                  : "bg-secondary/30 border-transparent hover:bg-secondary/50 hover:scale-[1.01]"
              }`}
            >
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium">{d.mode}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: d.color }}>{d.co2} kg</span>
                  {d.mode === bestMode.mode && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">BEST</span>
                  )}
                  {d.mode === worstMode.mode && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">HIGHEST</span>
                  )}
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-background/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(d.co2 / maxCo2) * 100}%`, background: d.color }}
                />
              </div>
              {selectedMode?.mode === d.mode && (
                <div className="mt-3 grid grid-cols-3 gap-2 animate-fade-in">
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <TreePine className="h-4 w-4 mx-auto mb-1 text-green-400" />
                    <p className="text-xs font-bold">{d.treesNeeded}</p>
                    <p className="text-[10px] text-muted-foreground">Trees to offset</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                    <p className="text-xs font-bold">{d.waterUsed}L</p>
                    <p className="text-[10px] text-muted-foreground">Water footprint</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/40">
                    <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
                    <p className="text-xs font-bold">{d.energyKwh}</p>
                    <p className="text-[10px] text-muted-foreground">kWh energy</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <TrendingDown className="h-4 w-4 text-green-400 shrink-0" />
            <p className="text-xs text-green-300">
              Choosing <strong>{bestMode.mode}</strong> saves up to <strong>{savingsPercent}%</strong> CO₂ vs {worstMode.mode}!
            </p>
          </div>
        </TabsContent>

        {/* Impact Visualization Tab */}
        <TabsContent value="impact" className="space-y-4 mt-3">
          <p className="text-xs text-muted-foreground">Real-world equivalents of your travel carbon</p>
          {carbonData.map((d) => (
            <div key={d.mode} className="p-3 rounded-lg bg-secondary/30 space-y-3">
              <p className="text-sm font-medium">{d.mode} — {d.co2} kg CO₂</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded bg-background/30">
                  <span className="text-lg">🌳</span>
                  <div>
                    <p className="text-xs font-semibold">{d.treesNeeded} trees</p>
                    <p className="text-[10px] text-muted-foreground">needed to absorb (1 year)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-background/30">
                  <span className="text-lg">🚗</span>
                  <div>
                    <p className="text-xs font-semibold">{d.equivalentDriving}</p>
                    <p className="text-[10px] text-muted-foreground">equivalent driving</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-background/30">
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="text-xs font-semibold">{Math.round(d.co2 * 122)} charges</p>
                    <p className="text-[10px] text-muted-foreground">smartphone charges</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-background/30">
                  <span className="text-lg">🍔</span>
                  <div>
                    <p className="text-xs font-semibold">{Math.round(d.co2 / 2.5)} burgers</p>
                    <p className="text-[10px] text-muted-foreground">equivalent beef burgers</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Offset Tab */}
        <TabsContent value="offset" className="space-y-3 mt-3">
          <p className="text-xs text-muted-foreground">Offset your carbon footprint by supporting real projects</p>
          {offsetProjects.map((p) => (
            <div key={p.name} className="p-3 rounded-lg bg-secondary/30 border border-secondary/50 hover:border-green-500/30 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">Offsets {p.co2Offset} kg CO₂</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-400">₹{p.cost}</span>
              </div>
              <Progress value={(p.co2Offset / 255) * 100} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">
                  {p.trees > 0 ? `🌳 Plants ${p.trees} trees` : `⚡ Clean energy project`}
                </p>
                <button
                  onClick={() => window.open(p.url, "_blank")}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  Support <ExternalLink className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          ))}
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
            <Wind className="h-5 w-5 mx-auto text-green-400 mb-1" />
            <p className="text-xs text-green-300">Every small action counts toward a greener planet 🌍</p>
          </div>
        </TabsContent>

        {/* Eco Tips Tab */}
        <TabsContent value="tips" className="space-y-3 mt-3">
          <p className="text-xs text-muted-foreground">Smart ways to reduce your travel carbon</p>
          {(expandedTips ? ecoTips : ecoTips.slice(0, 3)).map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <span className="text-xl mt-0.5">{t.icon}</span>
              <div className="flex-1">
                <p className="text-sm">{t.tip}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Leaf className="h-3 w-3 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">Save up to {t.savings} CO₂</span>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setExpandedTips(!expandedTips)}
            className="flex items-center gap-1 text-xs text-primary mx-auto hover:underline"
          >
            {expandedTips ? "Show less" : "Show more tips"}
            {expandedTips ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
