import { useState } from "react";
import { APPS, DESKTOP_ORDER, type AppId } from "./apps";
import { useWindows } from "./store";
import { cn } from "@/lib/utils";

export default function DesktopIcons() {
  const { openApp } = useWindows();
  const [selected, setSelected] = useState<AppId | null>(null);

  return (
    <div
      className="absolute inset-0 grid justify-start gap-1 p-4"
      style={{
        gridTemplateRows: "repeat(auto-fill, 96px)",
        gridAutoFlow: "column",
        gridAutoColumns: "96px",
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSelected(null);
      }}
    >
      {DESKTOP_ORDER.map((id) => {
        const app = APPS[id];
        return (
          <button
            key={id}
            draggable
            aria-label={`Open ${app.title}`}
            onClick={() => setSelected(id)}
            onDoubleClick={() => openApp(id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openApp(id);
            }}
            className={cn(
              "group flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-md border border-transparent px-1 transition-colors",
              selected === id
                ? "border-primary/40 bg-primary/20 backdrop-blur-sm"
                : "hover:bg-onwall/15",
            )}
          >
            <app.icon className="h-8 w-8 text-onwall drop-shadow-sm" strokeWidth={1.5} />
            <span className="line-clamp-2 text-center text-[11px] leading-tight text-onwall">
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
