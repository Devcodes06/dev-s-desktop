import { useEffect, useState } from "react";
import { Search, Wifi, Volume2, BatteryMedium, LayoutGrid } from "lucide-react";
import { useWindows } from "./store";
import { useSettings } from "./settings";
import { cn } from "@/lib/utils";
import AppIcon from "./AppIcon";

function Clock() {
  const { clock24 } = useSettings();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(t);
  }, []);

  if (!now) return <div className="w-20" />;
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !clock24,
  });
  const date = now.toLocaleDateString("en-GB").replaceAll("/", "-");

  return (
    <div className="px-2 text-right text-[11px] leading-tight">
      <div>{time}</div>
      <div>{date}</div>
    </div>
  );
}

export default function Taskbar({
  onStart,
  onSearch,
  startOpen,
}: {
  onStart: () => void;
  onSearch: () => void;
  startOpen: boolean;
}) {
  const { windows, activeId, toggleFromTaskbar } = useWindows();

  const btn =
    "grid h-10 w-10 place-items-center rounded-md transition-colors hover:bg-accent";

  return (
    <footer
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-9999 grid grid-cols-[1fr_auto_1fr] items-center px-3 mica select-none"
      style={{ height: "var(--taskbar-height, 56px)" }}
    >
      {/* Column 1: Left spacer for geometric symmetry */}
      <div className="flex items-center justify-self-start" aria-hidden />

      {/* Column 2: Centered task group */}
      <div className="flex items-center justify-center gap-1 justify-self-center min-w-0">
        <button
          onClick={onStart}
          aria-label="Start"
          aria-expanded={startOpen}
          className={cn(btn, startOpen && "bg-accent")}
        >
          <AppIcon
            iconPath="/assets/icons/windows11/start.svg"
            fallback={LayoutGrid}
            className="h-6 w-6 text-primary"
            alt="Start"
          />
        </button>
        <button onClick={onSearch} aria-label="Search (Ctrl + K)" className={btn}>
          <AppIcon
            iconPath="/assets/icons/windows11/search.svg"
            fallback={Search}
            className="h-6 w-6"
            alt="Search"
          />
        </button>
        {windows.map((w) => {
          const isActive = activeId === w.id && !w.minimized;
          const isMinimized = w.minimized;

          return (
            <button
              key={w.id}
              className={cn(
                "relative flex h-10 items-center gap-2 rounded-md px-2.5 text-xs transition-colors hover:bg-accent",
                isActive &&
                  "bg-accent after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-4 after:rounded-full after:bg-primary",
                !isActive &&
                  !isMinimized &&
                  "hover:bg-accent/70 after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-1.5 after:rounded-full after:bg-muted-foreground/60",
                isMinimized && "opacity-60 hover:opacity-100 hover:bg-accent/40",
              )}
              onClick={() => toggleFromTaskbar(w.id)}
              title={w.title}
              aria-label={w.title}
              aria-pressed={isActive}
            >
              <AppIcon appId={w.appId} className="h-5 w-5 shrink-0" alt="" />
              <span className="hidden max-w-28 truncate lg:inline">{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* Column 3: Right-aligned system tray */}
      <div className="flex items-center justify-self-end gap-1 text-foreground shrink-0">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent cursor-default">
          <Wifi className="h-4 w-4" aria-label="Network" />
          <Volume2 className="h-4 w-4" aria-label="Volume" />
          <BatteryMedium className="h-4 w-4" aria-label="Battery" />
        </div>
        <Clock />
      </div>
    </footer>
  );
}
