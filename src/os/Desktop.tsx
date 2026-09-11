import { useCallback, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { profile } from "@/data/portfolio";
import { useWindows } from "./store";
import DesktopIcons from "./DesktopIcons";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import SearchOverlay from "./SearchOverlay";
import ContextMenu from "./ContextMenu";
import Notifications from "./Notifications";
import Win from "./Window";
import TechJokeNotification from "@/os/TechJokeNotification";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function Desktop() {
  const { windows, activeId, close, closeAll, cycle } = useWindows();
  const [start, setStart] = useState(false);
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [restarting, setRestarting] = useState(false);
  const [egg, setEgg] = useState(false);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const restart = useCallback(() => {
    setRestarting(true);
    closeAll();
    setTimeout(() => {
      setRestarting(false);
      refresh();
    }, 1400);
  }, [closeAll, refresh]);

  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setStart(false);
        setSearch((s) => !s);
        return;
      }
      if (e.key === "Escape") {
        if (search) setSearch(false);
        else if (start) setStart(false);
        else if (menu) setMenu(null);
        else if (activeId) close(activeId);
        return;
      }
      if (e.key === "Tab" && e.altKey) {
        e.preventDefault();
        cycle();
        return;
      }
      buf = [...buf, e.key].slice(-KONAMI.length);
      if (buf.join(",") === KONAMI.join(",")) setEgg(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [search, start, menu, activeId, close, cycle]);

  return (
    <div
      className="relative h-dvh w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${profile.wallpaper})` }}
      onContextMenu={(e) => {
        if ((e.target as HTMLElement).closest("[role='dialog']")) return;
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          setStart(false);
          setSearch(false);
        }
      }}
    >
      {/* readability layer */}
      <div className="pointer-events-none absolute inset-0 bg-background/10" aria-hidden />

      <div
        key={refreshKey}
        className="animate-refresh absolute inset-0"
        style={{ bottom: "var(--taskbar-height, 56px)" }}
      >
        <DesktopIcons />
        {windows.map((w) => (
          <Win key={w.id} win={w} />
        ))}
      </div>

      {start && (
        <StartMenu
          onClose={() => setStart(false)}
          onSearch={() => setSearch(true)}
          onRestart={restart}
        />
      )}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      {menu && (
        <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} onRefresh={refresh} />
      )}

      <Notifications />
      <TechJokeNotification />

      <Taskbar
        startOpen={start}
        onStart={() => {
          setSearch(false);
          setStart((s) => !s);
        }}
        onSearch={() => {
          setStart(false);
          setSearch((s) => !s);
        }}
      />

      {restarting && (
        <div className="fixed inset-0 z-9999 grid place-items-center bg-background/95">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm text-muted-foreground">Restarting portfolio…</p>
          </div>
        </div>
      )}

      {egg && (
        <div
          role="alertdialog"
          aria-label="System notice"
          className="animate-win-open fixed left-1/2 top-1/2 z-9999 w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 mica-strong shadow-window"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-semibold">Cheat code accepted</p>
              <p className="mt-1 text-sm text-muted-foreground">
                +30 lives granted. Unfortunately this portfolio only has one.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEgg(false)}
            className="mt-5 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
