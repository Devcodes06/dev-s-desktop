import { EXPECTED_APP_IDS, computeWindowSpawnBounds } from "./test-utils";

export type AppId = (typeof EXPECTED_APP_IDS)[number];

export interface WindowState {
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
}

export interface AppMetadata {
  title: string;
  width: number;
  height: number;
  onDesktop?: boolean;
}

export const MOCK_APPS: Record<AppId, AppMetadata> = {
  mypc: { title: "My PC", width: 880, height: 560, onDesktop: true },
  resume: { title: "Resume", width: 820, height: 640, onDesktop: true },
  projects: { title: "Projects", width: 860, height: 580, onDesktop: true },
  about: { title: "About Me", width: 760, height: 580, onDesktop: true },
  techstack: { title: "Tech Stack", width: 820, height: 540, onDesktop: true },
  socials: { title: "Socials", width: 640, height: 440, onDesktop: true },
  achievements: { title: "Achievements", width: 700, height: 540, onDesktop: true },
  contact: { title: "Contact", width: 780, height: 560, onDesktop: true },
  paint: { title: "Paint", width: 760, height: 560, onDesktop: true },
  games: { title: "Games", width: 700, height: 520, onDesktop: true },
  recyclebin: { title: "Recycle Bin", width: 660, height: 440, onDesktop: true },
  terminal: { title: "Terminal", width: 720, height: 460, onDesktop: true },
  personalize: { title: "Settings", width: 640, height: 520 },
};

/**
 * Pure state machine simulator matching src/os/store.tsx logic verbatim
 */
export class WindowStoreSimulator {
  public windows: WindowState[] = [];
  public activeId: string | null = null;
  public topZ = 10;
  private seq = 0;
  public vw: number;
  public vh: number;

  constructor(viewportWidth = 1440, viewportHeight = 900) {
    this.vw = viewportWidth;
    this.vh = viewportHeight;
  }

  public setViewport(w: number, h: number) {
    this.vw = w;
    this.vh = h;
  }

  public openApp(appId: AppId, payload?: unknown, titleOverride?: string): WindowState {
    const app = MOCK_APPS[appId];
    const existing = this.windows.find((w) => w.appId === appId && payload === undefined);

    if (existing) {
      this.topZ += 1;
      existing.minimized = false;
      existing.z = this.topZ;
      this.activeId = existing.id;
      return existing;
    }

    const id = `w${++this.seq}`;
    const { w, h } = computeWindowSpawnBounds(app.width, app.height, this.vw, this.vh);
    const offset = (this.windows.length % 6) * 28;
    const nextZ = ++this.topZ;

    const newWindow: WindowState = {
      id,
      appId,
      title: titleOverride ?? app.title,
      payload,
      x: Math.max(16, Math.round((this.vw - w) / 2) + offset - 60),
      y: Math.max(16, Math.round((this.vh - h) / 2) - 40 + offset),
      w,
      h,
      z: nextZ,
      minimized: false,
      maximized: false,
    };

    this.windows.push(newWindow);
    this.activeId = id;
    return newWindow;
  }

  public close(id: string) {
    this.windows = this.windows.filter((w) => w.id !== id);
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  public minimize(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.minimized = true;
      if (this.activeId === id) {
        this.activeId = null;
      }
    }
  }

  public focus(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      this.topZ += 1;
      win.minimized = false;
      win.z = this.topZ;
      this.activeId = id;
    }
  }

  public toggleMax(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.maximized = !win.maximized;
    }
  }

  public toggleFromTaskbar(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;

    if (!win.minimized && this.activeId === id) {
      this.minimize(id);
    } else {
      this.focus(id);
    }
  }

  public move(id: string, x: number, y: number) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.x = x;
      win.y = y;
    }
  }

  public resize(id: string, w: number, h: number) {
    const win = this.windows.find((w) => w.id === id);
    if (win) {
      win.w = w;
      win.h = h;
    }
  }

  public closeAll() {
    this.windows = [];
    this.activeId = null;
  }

  /**
   * Helper to inspect dynamic taskbar buttons
   */
  public getTaskbarButtons() {
    return this.windows.map((w) => ({
      id: w.id,
      appId: w.appId,
      title: w.title,
      isActive: this.activeId === w.id && !w.minimized,
      isMinimized: w.minimized,
      isInactiveOpen: this.activeId !== w.id && !w.minimized,
    }));
  }
}
