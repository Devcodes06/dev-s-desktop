import { useEffect } from "react";
import { FilePlus2, RefreshCw, MonitorCog, Palette, TerminalSquare } from "lucide-react";
import { useWindows } from "./store";

export default function ContextMenu({
  x,
  y,
  onClose,
  onRefresh,
}: {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const { openApp } = useWindows();

  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [onClose]);

  const items = [
    { label: "New", icon: FilePlus2, action: () => openApp("paint") },
    { label: "Refresh", icon: RefreshCw, action: onRefresh },
    { label: "Display settings", icon: MonitorCog, action: () => openApp("personalize") },
    { label: "Personalize", icon: Palette, action: () => openApp("personalize") },
    { label: "Open Terminal", icon: TerminalSquare, action: () => openApp("terminal") },
  ];

  const left = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 230);
  const top = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 800) - 250);

  return (
    <div
      role="menu"
      style={{ left, top }}
      className="animate-win-open fixed z-9998 w-56 rounded-lg p-1.5 mica-strong shadow-flyout"
    >
      {items.map((i) => (
        <button
          key={i.label}
          role="menuitem"
          onClick={() => {
            i.action();
            onClose();
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
        >
          <i.icon className="h-4 w-4 text-muted-foreground" />
          {i.label}
        </button>
      ))}
    </div>
  );
}
