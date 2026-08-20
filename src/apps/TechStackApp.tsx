import { useState } from "react";
import { Cpu } from "lucide-react";
import { skills } from "@/data/portfolio";
import { Panel } from "@/os/ui";
import { cn } from "@/lib/utils";

export default function TechStackApp() {
  const [active, setActive] = useState(skills[0]?.category ?? "");
  const current = skills.find((s) => s.category === active);

  return (
    <div className="flex h-full">
      <nav
        aria-label="Categories"
        className="scroll-thin w-48 shrink-0 overflow-y-auto border-r border-border bg-secondary/50 p-2"
      >
        {skills.map((s) => (
          <button
            key={s.category}
            onClick={() => setActive(s.category)}
            className={cn(
              "mb-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
              active === s.category
                ? "bg-accent font-medium text-accent-foreground"
                : "hover:bg-accent/60",
            )}
          >
            <span
              className={cn(
                "h-4 w-0.5 rounded-full",
                active === s.category ? "bg-primary" : "bg-transparent",
              )}
            />
            {s.category}
          </button>
        ))}
      </nav>
      <div className="scroll-thin min-w-0 flex-1 overflow-y-auto p-5">
        <h2 className="mb-4 text-lg font-semibold">{current?.category}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {current?.items.map((i) => (
            <Panel key={i.name}>
              <div className="flex items-start gap-3">
                <Cpu className="mt-0.5 h-4.5 w-4.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{current.category}</p>
                  <p className="mt-1.5 text-xs leading-relaxed">{i.note}</p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
