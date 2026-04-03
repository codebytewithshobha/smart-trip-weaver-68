import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface AIFeaturePanelProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AIFeaturePanel({ title, icon, isOpen, onClose, children }: AIFeaturePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-card w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-display font-bold text-foreground">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AILoadingInline({ text = "AI processing..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export function useAILoading(delay = 1500) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const trigger = () => {
    setLoading(true);
    setLoaded(false);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, delay);
  };

  return { loading, loaded, trigger };
}
