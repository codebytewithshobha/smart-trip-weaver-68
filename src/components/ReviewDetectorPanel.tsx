import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, AlertTriangle, ThumbsUp, ThumbsDown, Star, User, Calendar, TrendingUp, Eye, MessageSquare, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  platform: string;
  verdict: "real" | "fake" | "suspicious";
  confidence: number;
  flags: string[];
  sentimentScore: number;
  helpfulVotes: number;
  verifiedPurchase: boolean;
}

const mockReviews: Review[] = [
  {
    id: "r1", author: "Rahul M.", avatar: "👨‍💼", rating: 5, date: "2 days ago",
    text: "Amazing place! The view from the hilltop was breathtaking. Staff was very helpful and rooms were clean. Definitely coming back next season with family.",
    platform: "Google", verdict: "real", confidence: 94,
    flags: [], sentimentScore: 92, helpfulVotes: 47, verifiedPurchase: true,
  },
  {
    id: "r2", author: "TravelKing99", avatar: "🤖", rating: 5, date: "1 day ago",
    text: "Best hotel ever!!!! Everything perfect perfect perfect. 5 stars definitely best place in whole country. Everyone must visit. Best best best!!!",
    platform: "TripAdvisor", verdict: "fake", confidence: 89,
    flags: ["Repetitive language", "No specific details", "Generic username", "Excessive superlatives"],
    sentimentScore: 99, helpfulVotes: 2, verifiedPurchase: false,
  },
  {
    id: "r3", author: "Priya S.", avatar: "👩", rating: 4, date: "1 week ago",
    text: "Good experience overall. The breakfast buffet had great variety. Only issue was the WiFi which was slow on the 3rd floor. Location is convenient, 10 min walk to the main market.",
    platform: "Booking.com", verdict: "real", confidence: 97,
    flags: [], sentimentScore: 72, helpfulVotes: 31, verifiedPurchase: true,
  },
  {
    id: "r4", author: "John D.", avatar: "🕵️", rating: 1, date: "3 days ago",
    text: "Terrible! Worst hotel. Dirty rooms. Bad food. Rude staff. Don't go here. Waste of money. Horrible experience. Never again.",
    platform: "Google", verdict: "suspicious", confidence: 72,
    flags: ["Very short sentences", "No constructive feedback", "Pattern matches negative bot"],
    sentimentScore: 5, helpfulVotes: 8, verifiedPurchase: false,
  },
  {
    id: "r5", author: "Ananya K.", avatar: "👩‍🎓", rating: 3, date: "2 weeks ago",
    text: "Decent stay for the price. The room was small but clean. AC worked fine. Hot water was available only in the morning. Restaurant food was average but the nearby dhaba had excellent thali for ₹150.",
    platform: "MakeMyTrip", verdict: "real", confidence: 96,
    flags: [], sentimentScore: 55, helpfulVotes: 22, verifiedPurchase: true,
  },
  {
    id: "r6", author: "xyz_user_2024", avatar: "🤖", rating: 5, date: "5 hours ago",
    text: "I am very happy with this hotel service. The hotel is very good and very nice. I recommend this hotel to everyone. Very good hotel. Thank you hotel.",
    platform: "Google", verdict: "fake", confidence: 91,
    flags: ["Generic username", "Repetitive structure", "No specifics", "Suspicious timing", "Broken grammar pattern"],
    sentimentScore: 95, helpfulVotes: 0, verifiedPurchase: false,
  },
];

const verdictConfig = {
  real: { icon: ShieldCheck, label: "Verified Real", color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
  fake: { icon: ShieldAlert, label: "Likely Fake", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
  suspicious: { icon: AlertTriangle, label: "Suspicious", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
};

export default function ReviewDetectorPanel({ destination }: { destination: string }) {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [customReview, setCustomReview] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [customResult, setCustomResult] = useState<Review | null>(null);
  const [filterVerdict, setFilterVerdict] = useState<"all" | "real" | "fake" | "suspicious">("all");

  const realCount = mockReviews.filter(r => r.verdict === "real").length;
  const fakeCount = mockReviews.filter(r => r.verdict === "fake").length;
  const suspiciousCount = mockReviews.filter(r => r.verdict === "suspicious").length;
  const trustScore = Math.round((realCount / mockReviews.length) * 100);

  const filtered = filterVerdict === "all" ? mockReviews : mockReviews.filter(r => r.verdict === filterVerdict);

  const analyzeCustom = () => {
    if (!customReview.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const hasRedFlags = customReview.length < 50 || /best|perfect|amazing|worst|terrible/gi.test(customReview);
      const isGeneric = !/\d/.test(customReview) && customReview.split(" ").length < 15;
      const verdict: "real" | "fake" | "suspicious" = isGeneric && hasRedFlags ? "fake" : hasRedFlags ? "suspicious" : "real";
      setCustomResult({
        id: "custom", author: "You", avatar: "✍️", rating: 0, date: "Just now",
        text: customReview, platform: "Custom Input", verdict,
        confidence: verdict === "real" ? 88 : verdict === "fake" ? 85 : 70,
        flags: [
          ...(customReview.length < 50 ? ["Very short review"] : []),
          ...(isGeneric ? ["Lacks specific details"] : []),
          ...(/best|perfect|amazing/gi.test(customReview) ? ["Excessive superlatives"] : []),
          ...(/worst|terrible|horrible/gi.test(customReview) ? ["Extreme negative without details"] : []),
          ...(customReview.split(" ").length < 10 ? ["Too few words for credible review"] : []),
        ],
        sentimentScore: verdict === "real" ? 65 : verdict === "fake" ? 98 : 15,
        helpfulVotes: 0, verifiedPurchase: false,
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Trust Score Hero */}
      <div className="relative p-5 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 border border-blue-500/20 text-center">
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-blue-400 animate-pulse" />
        <p className="text-xs text-muted-foreground mb-1">Overall Trust Score for {destination}</p>
        <div className={`text-5xl font-bold mb-1 ${trustScore >= 60 ? "text-green-400" : trustScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
          {trustScore}%
        </div>
        <p className="text-sm text-muted-foreground">Based on {mockReviews.length} analyzed reviews</p>
        <div className="flex justify-center gap-4 mt-3">
          <span className="flex items-center gap-1 text-xs text-green-400"><ShieldCheck className="h-3 w-3" />{realCount} Real</span>
          <span className="flex items-center gap-1 text-xs text-red-400"><ShieldAlert className="h-3 w-3" />{fakeCount} Fake</span>
          <span className="flex items-center gap-1 text-xs text-yellow-400"><AlertTriangle className="h-3 w-3" />{suspiciousCount} Suspicious</span>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
          <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
          <TabsTrigger value="analyze" className="text-xs">Analyze</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-3 mt-3">
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "real", "fake", "suspicious"] as const).map(v => (
              <button key={v} onClick={() => setFilterVerdict(v)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${filterVerdict === v ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground bg-secondary/50 hover:text-foreground"}`}>
                {v === "all" ? `All (${mockReviews.length})` : `${v.charAt(0).toUpperCase() + v.slice(1)} (${mockReviews.filter(r => r.verdict === v).length})`}
              </button>
            ))}
          </div>

          {filtered.map((review) => {
            const config = verdictConfig[review.verdict];
            const VerdictIcon = config.icon;
            const isExpanded = selectedReview === review.id;
            return (
              <div key={review.id}
                onClick={() => setSelectedReview(isExpanded ? null : review.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${isExpanded ? `bg-secondary/80 ${config.border}` : "bg-secondary/30 border-transparent hover:bg-secondary/50"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{review.avatar}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.author}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{review.platform}</span>
                        <span>•</span>
                        <span>{review.date}</span>
                        {review.verifiedPurchase && <span className="text-green-400">✓ Verified</span>}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bg} ${config.color}`}>
                    <VerdictIcon className="h-3 w-3" /> {config.label}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{review.confidence}% confidence</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{review.text}</p>

                {isExpanded && (
                  <div className="mt-3 space-y-3 animate-fade-in">
                    <p className="text-xs text-foreground">{review.text}</p>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded-lg bg-background/40">
                        <Eye className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                        <p className="text-xs font-bold">{review.confidence}%</p>
                        <p className="text-[10px] text-muted-foreground">AI Confidence</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/40">
                        <TrendingUp className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                        <p className="text-xs font-bold">{review.sentimentScore}%</p>
                        <p className="text-[10px] text-muted-foreground">Sentiment</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-background/40">
                        <ThumbsUp className="h-4 w-4 mx-auto mb-1 text-green-400" />
                        <p className="text-xs font-bold">{review.helpfulVotes}</p>
                        <p className="text-[10px] text-muted-foreground">Helpful votes</p>
                      </div>
                    </div>

                    {review.flags.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold text-red-400 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Red Flags Detected</p>
                        {review.flags.map((flag, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground bg-red-500/5 rounded px-2 py-1">
                            <span className="text-red-400">⚠</span> {flag}
                          </div>
                        ))}
                      </div>
                    )}

                    {review.verdict === "real" && (
                      <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-[10px] text-green-300 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> This review appears genuine — contains specific details, balanced sentiment, and natural language patterns.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-3 mt-3">
          <p className="text-xs text-muted-foreground">Paste any review to check if it's real or fake</p>
          <textarea
            value={customReview}
            onChange={(e) => { setCustomReview(e.target.value); setCustomResult(null); }}
            placeholder="Paste a hotel/place review here to analyze..."
            className="w-full h-28 p-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={analyzeCustom}
            disabled={analyzing || !customReview.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors disabled:opacity-50"
          >
            {analyzing ? (
              <><span className="animate-spin">⚙️</span> AI Analyzing Review...</>
            ) : (
              <><Search className="h-4 w-4" /> Detect Fake or Real</>
            )}
          </button>

          {customResult && (
            <div className="animate-fade-in space-y-3">
              <div className={`p-4 rounded-xl ${verdictConfig[customResult.verdict].bg} border ${verdictConfig[customResult.verdict].border} text-center`}>
                {(() => { const Icon = verdictConfig[customResult.verdict].icon; return <Icon className={`h-8 w-8 mx-auto mb-2 ${verdictConfig[customResult.verdict].color}`} />; })()}
                <p className={`text-lg font-bold ${verdictConfig[customResult.verdict].color}`}>{verdictConfig[customResult.verdict].label}</p>
                <p className="text-xs text-muted-foreground mt-1">{customResult.confidence}% confidence</p>
              </div>

              {customResult.flags.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-foreground">Issues Found:</p>
                  {customResult.flags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-red-500/10 rounded-lg px-3 py-1.5">
                      <span className="text-red-400">⚠</span> {flag}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <Progress value={customResult.sentimentScore} className="h-1.5 mt-1.5" />
                  <p className="text-xs font-bold mt-1">{customResult.sentimentScore}%</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">Word Count</p>
                  <p className="text-lg font-bold">{customReview.split(" ").length}</p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4 mt-3">
          <p className="text-xs text-muted-foreground">AI-powered review analytics for {destination}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/30 text-center">
              <p className="text-2xl font-bold text-foreground">{mockReviews.length}</p>
              <p className="text-[10px] text-muted-foreground">Total Analyzed</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 text-center">
              <p className="text-2xl font-bold text-green-400">{trustScore}%</p>
              <p className="text-[10px] text-muted-foreground">Trust Rate</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 text-center">
              <p className="text-2xl font-bold text-foreground">{(mockReviews.reduce((a, r) => a + r.rating, 0) / mockReviews.length).toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">Avg Real Rating</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 text-center">
              <p className="text-2xl font-bold text-red-400">{fakeCount}</p>
              <p className="text-[10px] text-muted-foreground">Fakes Caught</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">🔍 Common Fake Review Patterns</p>
            {[
              { pattern: "Excessive superlatives (best, perfect, amazing)", pct: 78 },
              { pattern: "No specific details about the place", pct: 85 },
              { pattern: "Suspiciously short or robotic language", pct: 67 },
              { pattern: "Posted within hours of each other", pct: 54 },
              { pattern: "Unverified / no booking history", pct: 91 },
            ].map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{p.pattern}</span>
                  <span className="font-semibold text-foreground">{p.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-background/50 overflow-hidden">
                  <div className="h-full rounded-full bg-red-400/70 transition-all duration-700" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Pro Tip: Always cross-check reviews across multiple platforms. Real travelers mention specific room numbers, food items, and local details.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
