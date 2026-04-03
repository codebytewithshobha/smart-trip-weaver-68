import { useState } from "react";
import { Loader2, Plane, MapPin, Sparkles } from "lucide-react";

interface AILoadingScreenProps {
  message?: string;
}

const steps = [
  { icon: "🔍", text: "Scanning transport networks..." },
  { icon: "🧠", text: "AI analyzing best routes..." },
  { icon: "💰", text: "Optimizing for your budget..." },
  { icon: "🌿", text: "Calculating carbon footprint..." },
  { icon: "✨", text: "Generating smart itinerary..." },
];

export default function AILoadingScreen({ message = "AI analyzing your trip..." }: AILoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentStep((s) => (s + 1) % steps.length);
    }, 800);
    return () => clearInterval(interval);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-hero">
      <div className="glow-overlay absolute inset-0" />
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated orbiting icons */}
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary animate-pulse-glow" />
          </div>
          <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 h-6 w-6 text-accent animate-spin-slow" style={{ transformOrigin: '50% 80px' }} />
          <MapPin className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 text-primary animate-spin-slow" style={{ animationDirection: 'reverse', transformOrigin: '50% -48px' }} />
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-display font-bold text-foreground">{message}</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{steps[currentStep].icon} {steps[currentStep].text}</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= currentStep ? "w-8 gradient-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
