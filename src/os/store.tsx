import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { APPS, type AppId } from "./apps";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  payload?: unknown;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

type Ctx = {
  windows: WindowState[];
  activeId: string | null;
  openApp: (appId: AppId, payload?: unknown, title?: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
  toggleFromTaskbar: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  closeAll: () => void;
  cycle: () => void;
};

const WindowCtx = createContext<Ctx | null>(null);

let seq = 0;

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [topZ, setTopZ] = useState(10);
  const [activeId, setActiveId] = useState<string | null>(null);

  const focus = useCallback((id: string) => {
    setTopZ((z) => {
      const next = z + 1;
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, z: next, minimized: false } : w)),
      );
      return next;
    });
    setActiveId(id);
  }, []);

  const openApp = useCallback(
    (appId: AppId, payload?: unknown, title?: string) => {
      const app = APPS[appId];
      setWindows((ws) => {
        const existing = ws.find((w) => w.appId === appId && payload === undefined);
        if (existing) {
          setActiveId(existing.id);
          return ws.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, z: topZ + 1 } : w,
          );
        }
        const id = `w${++seq}`;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
        const vh = typeof window !== "undefined" ? window.innerHeight : 900;
        const w = Math.min(app.width, vw - 80);
        const h = Math.min(app.height, vh - 140);
        const offset = (ws.length % 6) * 28;
        setActiveId(id);
        return [
          ...ws,
          {
            id,
            appId,
            title: title ?? app.title,
            payload,
            x: Math.max(16, Math.round((vw - w) / 2) + offset - 60),
            y: Math.max(16, Math.round((vh - h) / 2) - 40 + offset),
            w,
            h,
            z: topZ + 1,
            minimized: false,
            maximized: false,
          },
        ];
      });
      setTopZ((z) => z + 1);
    },
    [topZ],
  );

  const close = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const toggleMax = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const toggleFromTaskbar = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (!win.minimized && activeId === id) minimize(id);
      else focus(id);
    },
    [windows, activeId, minimize, focus],
  );

  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: string, w: number, h: number) => {
    setWindows((ws) => ws.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  const closeAll = useCallback(() => {
    setWindows([]);
    setActiveId(null);
  }, []);

  const cycle = useCallback(() => {
    setWindows((ws) => {
      if (ws.length < 2) return ws;
      const next = [...ws].sort((a, b) => a.z - b.z)[0];
      if (!next) return ws;
      const nextId = next.id;
      setActiveId(nextId);
      setTopZ((z) => {
        const nz = z + 1;
        setWindows((cur) =>
          cur.map((w) => (w.id === nextId ? { ...w, z: nz, minimized: false } : w)),
        );
        return nz;
      });
      return ws;
    });
  }, []);

  const value = useMemo(
    () => ({
      windows,
      activeId,
      openApp,
      close,
      focus,
      minimize,
      toggleMax,
      toggleFromTaskbar,
      move,
      resize,
      closeAll,
      cycle,
    }),
    [
      windows,
      activeId,
      openApp,
      close,
      focus,
      minimize,
      toggleMax,
      toggleFromTaskbar,
      move,
      resize,
      closeAll,
      cycle,
    ],
  );

  return <WindowCtx.Provider value={value}>{children}</WindowCtx.Provider>;
}

export function useWindows() {
  const ctx = useContext(WindowCtx);
  if (!ctx) throw new Error("useWindows must be used inside WindowProvider");
  return ctx;
}
