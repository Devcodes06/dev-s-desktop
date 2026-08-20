import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppScroll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("scroll-thin h-full overflow-y-auto px-6 py-5", className)}>{children}</div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  );
}

export function Panel({
  children,
  className,
  onClick,
  role,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
}) {
  return (
    <div
      role={role}
      onClick={onClick}
      className={cn(
        "rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm",
        onClick && "cursor-pointer transition-colors hover:bg-accent",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
      {children}
    </span>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
