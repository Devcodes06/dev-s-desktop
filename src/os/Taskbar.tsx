import { useEffect, useState } from "react";
import { Search, Wifi, Volume2, BatteryMedium, LayoutGrid } from "lucide-react";
import { APPS } from "./apps";
import { useWindows } from "./store";
import { useSettings } from "./settings";
import { cn } from "@/lib/utils";

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
    <footer className="pointer-events-auto fixed inset-x-0 bottom-0 z-9999 flex h-14 items-center px-3 mica">
      <div className="mx-auto flex items-center gap-1">
        <button
          onClick={onStart}
          aria-label="Start"
          aria-expanded={startOpen}
          className={cn(btn, startOpen && "bg-accent")}
        >
          <LayoutGrid className="h-5 w-5 text-primary" />
        </button>
        <button onClick={onSearch} aria-label="Search (Ctrl + K)" className={btn}>
          <Search className="h-5 w-5" />
        </button>
        {windows.map((w) => {
          const app = APPS[w.appId];
          return (
            <button
              key={w.id}
              onClick={() => toggleFromTaskbar(w.id)}
              title={w.title}
              className={cn(
                "flex h-10 items-center gap-2 rounded-md px-2.5 text-xs transition-colors hover:bg-accent",
                activeId === w.id && !w.minimized
                  ? "bg-accent after:absolute after:bottom-1 after:h-0.5 after:w-4 after:rounded-full after:bg-primary"
                  : "",
              )}
            >
              <app.icon className="h-4.5 w-4.5 text-primary" />
              <span className="hidden max-w-28 truncate lg:inline">{w.title}</span>
            </button>
          );
        })}
      </div>

      <div className="absolute right-3 flex items-center gap-1 text-foreground">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent">
          <Wifi className="h-4 w-4" aria-label="Network" />
          <Volume2 className="h-4 w-4" aria-label="Volume" />
          <BatteryMedium className="h-4 w-4" aria-label="Battery" />
        </div>
        <Clock />
      </div>
    </footer>
  );
}
