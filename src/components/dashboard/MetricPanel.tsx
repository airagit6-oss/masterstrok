import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MetricPanel({ title, children, className }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "dd-panel flex flex-col",
      expanded && "fixed inset-4 z-50",
      className
    )}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded hover:bg-accent text-muted-foreground"
        >
          {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </button>
      </div>
      <div className="flex-1 p-3 min-h-0">
        {children}
      </div>
    </div>
  );
}
