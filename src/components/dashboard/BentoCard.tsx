import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BentoSize = "s" | "m" | "l" | "xl" | "wide" | "tall";
type BentoCol = 1 | 2 | 3 | 4;

interface BentoCardProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  size?: BentoSize;
  col?: BentoCol;
  className?: string;
  actions?: React.ReactNode;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function BentoCard({
  title,
  icon,
  badge,
  children,
  size = "m",
  col = 1,
  className,
  actions,
  onSeeAll,
  showSeeAll = false,
}: BentoCardProps) {
  const sizeClass = `bento-${size}`;
  const colClass = `bento-col-${col}`;

  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-border p-4 flex flex-col overflow-hidden",
        sizeClass,
        colClass,
        className
      )}
    >
      {/* Header - Fixed 32px (4 * 8px) */}
      <div className="flex items-center justify-between h-8 flex-shrink-0 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge}
          {showSeeAll && onSeeAll && (
            <button
              onClick={onSeeAll}
              className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              See All
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 min-h-0 bento-scroll">{children}</div>

      {/* Actions - Fixed 40px (5 * 8px) when present */}
      {actions && (
        <div className="flex gap-2 pt-2 flex-shrink-0 border-t border-border mt-2">
          {actions}
        </div>
      )}
    </div>
  );
}
