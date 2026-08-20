import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";
import { APPS } from "./apps";
import { useWindows, type WindowState } from "./store";
import { cn } from "@/lib/utils";

const TASKBAR = 56;

export default function Win({ win }: { win: WindowState }) {
  const { focus, close, minimize, toggleMax, move, resize, activeId } = useWindows();
  const app = APPS[win.appId];
  const Body = app.component;
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (dragRef.current) {
        move(
          win.id,
          Math.max(0, Math.min(window.innerWidth - 120, e.clientX - dragRef.current.dx)),
          Math.max(0, Math.min(window.innerHeight - TASKBAR - 40, e.clientY - dragRef.current.dy)),
        );
      } else if (resizeRef.current) {
        const r = resizeRef.current;
        resize(
          win.id,
          Math.max(360, r.w + (e.clientX - r.x)),
          Math.max(240, r.h + (e.clientY - r.y)),
        );
      }
    },
    [move, resize, win.id],
  );

  const stop = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [onPointerMove, stop]);

  if (win.minimized) return null;
  const active = activeId === win.id;

  const geom = win.maximized
    ? { left: 0, top: 0, width: "100%", height: `calc(100dvh - ${TASKBAR}px)` }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  const ctrl =
    "grid h-8 w-11 place-items-center transition-colors hover:bg-accent";

  return (
    <section
      role="dialog"
      aria-label={win.title}
      onPointerDown={() => focus(win.id)}
      style={{ ...geom, zIndex: win.z }}
      className={cn(
        "animate-win-open absolute flex flex-col overflow-hidden rounded-xl mica-strong shadow-window",
        win.maximized && "rounded-none",
        !active && "opacity-[0.99] saturate-[0.98]",
        dragging && "select-none",
      )}
    >
      <header
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          if (win.maximized) return;
          dragRef.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
          setDragging(true);
        }}
        onDoubleClick={() => toggleMax(win.id)}
        className="flex h-9 shrink-0 items-center gap-2 border-b border-border bg-chrome pl-3 pr-0"
      >
        <app.icon className="h-4 w-4 text-primary" />
        <span className="truncate text-xs font-medium">{win.title}</span>
        <div className="ml-auto flex">
          <button className={ctrl} onClick={() => minimize(win.id)} aria-label="Minimize">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            className={ctrl}
            onClick={() => toggleMax(win.id)}
            aria-label={win.maximized ? "Restore" : "Maximize"}
          >
            {win.maximized ? <Copy className="h-3 w-3" /> : <Square className="h-3 w-3" />}
          </button>
          <button
            className="grid h-8 w-11 place-items-center transition-colors hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => close(win.id)}
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 bg-background/80">
        <Body payload={win.payload} />
      </div>

      {!win.maximized && (
        <div
          onPointerDown={(e) => {
            resizeRef.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h };
          }}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
          aria-hidden
        />
      )}
    </section>
  );
}
