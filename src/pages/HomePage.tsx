import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, MessageCircle, Plane, Sparkles, Train, Bus, MapPin, Send, Users, X } from "lucide-react";

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
  const [budgetError, setBudgetError] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! I’m your travel assistant. Ask me about routes, budgets, or destination tips." },
  ]);
  const [typing, setTyping] = useState(false);
  const MIN_BUDGET = 10000;

  const getBudgetWarning = (value: string) => {
    const amount = Number(value);
    if (!value.trim()) return "";
    if (Number.isNaN(amount) || amount <= 0) return "Enter a valid budget amount greater than ₹0.";
    if (amount < MIN_BUDGET) {
      return `Budget is too low for most trips. We recommend at least ₹${MIN_BUDGET.toLocaleString()} for better options.`;
    }
    return "";
  };

  const handleSearch = () => {
    if (!from || !to) return;
    const warning = getBudgetWarning(budget);
    if (warning) {
      setBudgetError(warning);
      if (!Number.isNaN(Number(budget)) && Number(budget) > 0) {
        setBudget(String(MIN_BUDGET));
      }
      return;
    }

    const params = new URLSearchParams({ from, to, date: date || "2026-04-15", budget: budget || String(MIN_BUDGET), travelers });
    navigate(`/results?${params}`);
  };

  const handleQuickRoute = (route: typeof popularRoutes[0]) => {
    setFrom(route.from);
    setTo(route.to);
  };

  const addMessage = (role: "user" | "assistant", text: string) => {
    setChatMessages((prev) => [...prev, { role, text }]);
  };

  const getAssistantReply = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes("budget")) {
      return "Try a budget of ₹10,000 for short domestic trips and ₹20,000+ for longer vacations. I can help optimize it.";
    }
    if (lower.includes("train")) {
      return "Trains are great for comfort and scenery. I can suggest the best routes and travel times.";
    }
    if (lower.includes("flight")) {
      return "For flights, booking earlier usually gives better prices, and I can compare direct versus connecting options.";
    }
    if (lower.includes("bus")) {
      return "Buses are a budget-friendly way to travel. I can help find good routes and predicted travel durations.";
    }
    if (lower.includes("date")) {
      return "If your dates are flexible, try shifting by a few days to find better prices and availability.";
    }
    if (lower.includes("beach") || lower.includes("goa") || lower.includes("kerala")) {
      return "Coastal destinations are amazing right now — great for food, relaxation, and scenic routes.";
    }
    return "I’m here to help with trip planning. Ask me about your route, budget, travel mode, or destination ideas.";
  };

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    addMessage("user", trimmed);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      addMessage("assistant", getAssistantReply(trimmed));
      setTyping(false);
    }, 600);
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
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Plane className="h-4 w-4" /> Flights</span>
          <span className="flex items-center gap-1"><Train className="h-4 w-4" /> Trains</span>
          <span className="flex items-center gap-1"><Bus className="h-4 w-4" /> Buses</span>
          <button
            type="button"
            onClick={() => setChatOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-3 py-2 text-sm text-foreground transition hover:bg-primary/10"
          >
            <MessageCircle className="h-4 w-4" />
            Assistant
          </button>
        </div>
      </nav>

      {chatOpen && (
        <div className="fixed right-6 top-24 z-50 w-[340px] max-w-full rounded-[28px] border border-border bg-background/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3 pb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Travel Assistant</p>
              <p className="text-xs text-muted-foreground">Ask anything about your trip, routes, or budget.</p>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted/10 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                  message.role === "assistant"
                    ? "bg-slate-100 text-slate-900"
                    : "bg-primary/15 text-primary"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900">...</div>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 rounded-2xl border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-3 text-primary-foreground transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Smart Travel
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Smart Travel <span className="text-gradient">From Anywhere to Everywhere</span>
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
                onChange={(e) => {
                  setBudget(e.target.value);
                  setBudgetError(getBudgetWarning(e.target.value));
                }}
                placeholder="10000"
                className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {budgetError && (
                <p className="text-xs text-warning mt-1">{budgetError}</p>
              )}
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
