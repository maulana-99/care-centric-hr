import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  variant?: "default" | "highlight";
  subtitle?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = "default",
  subtitle 
}: MetricCardProps) {
  return (
    <div 
      className={cn(
        "p-5 rounded-2xl border transition-all duration-300 hover:border-muted-foreground/20 group",
        variant === "highlight" 
          ? "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30" 
          : "bg-card border-border"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className={cn(
            "p-2.5 rounded-xl transition-colors",
            variant === "highlight" 
              ? "bg-primary/20" 
              : "bg-muted group-hover:bg-muted/80"
          )}
        >
          <Icon 
            className={cn(
              "w-5 h-5",
              variant === "highlight" ? "text-primary" : "text-muted-foreground"
            )} 
          />
        </div>
        {change && (
          <div 
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              change.type === "increase" 
                ? "text-success bg-success/10" 
                : "text-destructive bg-destructive/10"
            )}
          >
            {change.type === "increase" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change.value}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p 
          className={cn(
            "text-3xl font-bold tracking-tight animate-count-up",
            variant === "highlight" ? "text-gradient" : "text-foreground"
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
