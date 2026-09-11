import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { APPS, DESKTOP_ORDER, type AppId } from "./apps";
import { useWindows } from "./store";
import { projects, skills, achievements } from "@/data/portfolio";
import AppIcon from "./AppIcon";

type Result = { label: string; sub: string; app: AppId; payload?: unknown; title?: string };

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { openApp } = useWindows();
  const [q, setQ] = useState("");

  const index = useMemo<Result[]>(() => {
    const items: Result[] = DESKTOP_ORDER.map((id) => ({
      label: APPS[id].title,
      sub: "Application",
      app: id,
    }));
    projects.forEach((p) =>
      items.push({
        label: p.name,
        sub: `Project · ${p.tech.join(", ")}`,
        app: "projects",
        payload: p.id,
        title: p.name,
      }),
    );
    skills.forEach((c) =>
      c.items.forEach((i) =>
        items.push({ label: i.name, sub: `Technology · ${c.category}`, app: "techstack" }),
      ),
    );
    achievements.forEach((a) =>
      items.push({ label: a.title, sub: `Achievement · ${a.org}`, app: "achievements" }),
    );
    return items;
  }, []);

  const results = q
    ? index
        .filter((r) => (r.label + r.sub).toLowerCase().includes(q.toLowerCase()))
        .slice(0, 12)
    : index.slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-9998"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Search"
        style={{ bottom: "calc(var(--taskbar-height, 56px) + 8px)" }}
        className="animate-flyout absolute left-1/2 w-[min(620px,92vw)] -translate-x-1/2 overflow-hidden rounded-xl mica-strong shadow-flyout"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, skills, achievements, apps…"
            aria-label="Search portfolio"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <ul className="scroll-thin max-h-80 overflow-y-auto p-2">
          {results.map((r, i) => (
            <li key={`${r.label}-${i}`}>
              <button
                onClick={() => {
                  openApp(r.app, r.payload, r.title);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
              >
                <AppIcon appId={r.app} className="h-5 w-5 shrink-0" alt="" />
                <span className="min-w-0">
                  <span className="block truncate text-sm">{r.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.sub}</span>
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results</li>
          )}
        </ul>
      </div>
    </div>
  );
}
