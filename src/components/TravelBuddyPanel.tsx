import { useState } from "react";
import { X, Loader2, MessageCircle, CalendarPlus, Heart } from "lucide-react";

interface BuddyProfile {
  name: string;
  age: number;
  avatar: string;
  matchPercent: number;
  travelType: string;
  interests: string[];
  personality: string;
  budgetRange: string;
  bio: string;
}

const mockBuddies: BuddyProfile[] = [
  {
    name: "Arjun Mehta",
    age: 26,
    avatar: "🧑‍💻",
    matchPercent: 94,
    travelType: "Budget",
    interests: ["Trekking", "Photography", "Street Food"],
    personality: "Extrovert",
    budgetRange: "₹3,000 – ₹8,000",
    bio: "Love exploring offbeat trails and capturing golden-hour shots. Always up for spontaneous plans!",
  },
  {
    name: "Priya Sharma",
    age: 24,
    avatar: "👩‍🎨",
    matchPercent: 89,
    travelType: "Budget",
    interests: ["Beach", "Yoga", "Culture"],
    personality: "Ambivert",
    budgetRange: "₹4,000 – ₹10,000",
    bio: "Sunrise yoga on the beach is my happy place. I journal every trip and love deep conversations.",
  },
  {
    name: "Rahul Krishnan",
    age: 29,
    avatar: "🚴",
    matchPercent: 82,
    travelType: "Luxury",
    interests: ["Nightlife", "Adventure", "Cycling"],
    personality: "Extrovert",
    budgetRange: "₹8,000 – ₹20,000",
    bio: "Adrenaline junkie who cycles everywhere. If there's a cliff, I'm jumping off it (safely).",
  },
  {
    name: "Sneha Patel",
    age: 27,
    avatar: "🎶",
    matchPercent: 76,
    travelType: "Budget",
    interests: ["Music", "Trekking", "Food"],
    personality: "Introvert",
    budgetRange: "₹3,000 – ₹7,000",
    bio: "Quiet traveler who communicates through playlists. I find the best hidden cafés in every city.",
  },
];

const questions = [
  {
    question: "What's your travel style?",
    options: ["Budget", "Mid-range", "Luxury"],
  },
  {
    question: "What are you most interested in?",
    options: ["Beach", "Trekking", "Nightlife", "Culture", "Food"],
    multi: true,
  },
  {
    question: "How would you describe yourself?",
    options: ["Introvert", "Extrovert", "Ambivert"],
  },
  {
    question: "Your budget range for this trip?",
    options: ["₹1K – ₹5K", "₹5K – ₹15K", "₹15K+"],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TravelBuddyPanel({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<"questions" | "loading" | "results">("questions");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);

  if (!isOpen) return null;

  const reset = () => {
    setStep("questions");
    setCurrentQ(0);
    setAnswers([]);
    setMultiSelect([]);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const selectOption = (opt: string) => {
    const q = questions[currentQ];
    if (q.multi) {
      setMultiSelect(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
    } else {
      advanceWith([opt]);
    }
  };

  const advanceWith = (selected: string[]) => {
    const next = [...answers, selected];
    setAnswers(next);
    setMultiSelect([]);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("loading");
      setTimeout(() => setStep("results"), 2000);
    }
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 90) return "from-green-500 to-emerald-400";
    if (pct >= 80) return "from-blue-500 to-cyan-400";
    return "from-amber-500 to-yellow-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <h3 className="text-lg font-display font-bold text-foreground">AI Travel Buddy Match</h3>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {step === "questions" && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= currentQ ? 'gradient-primary' : 'bg-secondary'}`} />
              ))}
            </div>

            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground mb-2">Question {currentQ + 1} of {questions.length}</p>
              <h4 className="text-xl font-display font-bold text-foreground">{questions[currentQ].question}</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {questions[currentQ].options.map(opt => (
                <button
                  key={opt}
                  onClick={() => selectOption(opt)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    (questions[currentQ].multi ? multiSelect : []).includes(opt)
                      ? 'gradient-primary text-primary-foreground border-transparent shadow-glow'
                      : 'bg-secondary/50 text-foreground border-border/50 hover:border-primary/40 hover:bg-secondary'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {questions[currentQ].multi && multiSelect.length > 0 && (
              <button
                onClick={() => advanceWith(multiSelect)}
                className="w-full py-3 rounded-xl gradient-primary font-semibold text-primary-foreground shadow-glow"
              >
                Continue ({multiSelect.length} selected)
              </button>
            )}
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-foreground font-display font-semibold">Analyzing your travel personality…</p>
            <p className="text-sm text-muted-foreground">Finding your perfect travel companions</p>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">We found <strong className="text-foreground">{mockBuddies.length} matches</strong> based on your preferences</p>

            {mockBuddies.map((buddy) => (
              <div key={buddy.name} className="glass-card p-4 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{buddy.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h5 className="font-display font-bold text-foreground">{buddy.name}, {buddy.age}</h5>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getMatchColor(buddy.matchPercent)}`}>
                        {buddy.matchPercent}% Match
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{buddy.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {buddy.interests.map(interest => (
                        <span key={interest} className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {interest}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground mb-3">
                      <span>🎒 {buddy.travelType}</span>
                      <span>🧠 {buddy.personality}</span>
                      <span>💰 {buddy.budgetRange}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-xs font-semibold shadow-glow hover:opacity-90 transition-opacity">
                        <MessageCircle className="h-3.5 w-3.5" /> Chat
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border/50">
                        <CalendarPlus className="h-3.5 w-3.5" /> Plan Together
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={reset} className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors mt-2">
              🔄 Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
