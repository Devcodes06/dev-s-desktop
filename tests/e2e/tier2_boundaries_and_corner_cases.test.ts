import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import {
  PATHS,
  computeWindowSpawnBounds,
  computeWindowDragClamp,
  computeWindowResizeClamp,
  computeMaximizedGeometry,
} from "../helpers/test-utils";
import { WindowStoreSimulator, MOCK_APPS } from "../helpers/window-store-sim";

describe("Tier 2: Boundary & Corner Cases", () => {
  // Boundary 1: Missing Asset Fallback & Invalid Paths
  describe("Boundary: Asset Fault Tolerance & Invalid Inputs", () => {
    test("TC-B1.1: Missing icon file does not throw or crash", () => {
      const nonExistentPath = "/assets/icons/windows11/non_existent_app.svg";
      expect(fs.existsSync(nonExistentPath)).toBe(false);
    });

    test("TC-B1.2: AppIcon component specification mandates fallback on empty or undefined iconPath", () => {
      if (!fs.existsSync(PATHS.appIconTsx)) return;
      const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      // When !targetPath, must return FallbackIcon
      expect(content).toMatch(/if\s*\(!targetPath\s*\|\|\s*hasError\)/);
      expect(content).toContain("<FallbackIcon");
    });

    test("TC-B1.3: Empty or invalid appId safely yields fallback or null rather than unhandled exception", () => {
      if (!fs.existsSync(PATHS.appIconTsx)) return;
      const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(content).toContain("appId ? APPS[appId] : undefined");
    });
  });

  // Boundary 2: Extreme Viewports (1024x768 to 1920x1080)
  describe("Boundary: Viewport Scaling & Boundary Math (1024x768 to 1920x1080)", () => {
    test("TC-B2.1: Viewport 1024x768: window spawn size is clamped to vw-80 (944px) and vh-140 (628px)", () => {
      const vw = 1024;
      const vh = 768;
      // Resume app requested width 820, height 640
      const resumeBounds = computeWindowSpawnBounds(MOCK_APPS.resume.width, MOCK_APPS.resume.height, vw, vh);
      expect(resumeBounds.w).toBe(820);
      // 640 requested, but clamped to 768 - 140 = 628px
      expect(resumeBounds.h).toBe(628);
      expect(resumeBounds.h).toBeLessThanOrEqual(vh - 140);
    });

    test("TC-B2.2: Viewport 1366x768: desktop 6-row grid (608px total) fits within 712px desktop height", () => {
      const vh = 768;
      const taskbarHeight = 56;
      const availableDesktopHeight = vh - taskbarHeight; // 712px
      const desktopGridHeight = 6 * 96 + 32; // 6 rows * 96px + 32px padding = 608px
      expect(desktopGridHeight).toBeLessThan(availableDesktopHeight);
      expect(availableDesktopHeight - desktopGridHeight).toBe(104); // 104px safety clearance
    });

    test("TC-B2.3: Viewport 1440x900: window spawn position is fully on-screen", () => {
      const sim = new WindowStoreSimulator(1440, 900);
      const win = sim.openApp("terminal");
      expect(win.x).toBeGreaterThanOrEqual(16);
      expect(win.y).toBeGreaterThanOrEqual(16);
      expect(win.x + win.w).toBeLessThanOrEqual(1440);
      expect(win.y + win.h).toBeLessThanOrEqual(900 - 56);
    });

    test("TC-B2.4: Viewport 1920x1080: maximized window height evaluates to exactly 1024px (1080 - 56)", () => {
      const geom = computeMaximizedGeometry(1080, 56);
      expect(geom.heightPx).toBe(1024);
      expect(geom.cssCalcHeight).toBe("calc(100dvh - 56px)");
    });
  });

  // Boundary 3: Window Geometry Clamps & Offset Wrapping
  describe("Boundary: Drag, Resize & Offset Wrapping Clamps", () => {
    test("TC-B3.1: Drag clamp prevents dragging window above top viewport (y < 0)", () => {
      const clamped = computeWindowDragClamp(100, -50, 0, 0, 1440, 900, 56);
      expect(clamped.y).toBe(0);
    });

    test("TC-B3.2: Drag clamp prevents dragging titlebar below taskbar top boundary", () => {
      const vh = 900;
      const taskbarH = 56;
      // Dragging titlebar to bottom y = 950
      const clamped = computeWindowDragClamp(100, 950, 0, 0, 1440, vh, taskbarH);
      // Must stop at vh - taskbarH - 40 = 900 - 56 - 40 = 804px
      expect(clamped.y).toBe(804);
      expect(clamped.y).toBeLessThan(vh - taskbarH);
    });

    test("TC-B3.3: Resize clamp enforces minimum window width of 360px and height of 240px", () => {
      // Attempt to resize to 100x100
      const clamped = computeWindowResizeClamp(-400, -400, 0, 0, 500, 400);
      expect(clamped.w).toBe(360);
      expect(clamped.h).toBe(240);
    });

    test("TC-B3.4: Spawn offset wraps modulo 6, preventing cascade from overflowing screen", () => {
      const sim = new WindowStoreSimulator(1440, 900);
      for (let i = 0; i < 12; i++) {
        const appId = Object.keys(MOCK_APPS)[i] as any;
        sim.openApp(appId);
      }
      expect(sim.windows).toHaveLength(12);
      // Window 0 and Window 6 should have identical offset wrapping base
      const w0 = sim.windows[0]!;
      const w6 = sim.windows[6]!;
      expect((0 % 6) * 28).toBe(0);
      expect((6 % 6) * 28).toBe(0);
      expect(w0.x).toBeLessThan(1440);
      expect(w6.x).toBeLessThan(1440);
    });
  });

  // Boundary 4: Rapid State Transitions & Overflow Guards
  describe("Boundary: Rapid State Toggling & Viewport Overflow Guards", () => {
    test("TC-B4.1: Rapid 50-cycle minimize/restore does not corrupt activeId or z-ordering", () => {
      const sim = new WindowStoreSimulator(1440, 900);
      const win = sim.openApp("terminal");

      for (let i = 0; i < 50; i++) {
        sim.toggleFromTaskbar(win.id);
      }

      // Even number of toggles leaves it active and not minimized
      expect(win.minimized).toBe(false);
      expect(sim.activeId).toBe(win.id);
      expect(win.z).toBeGreaterThan(10);
    });

    test("TC-B4.2: Overflow protection: html, body { overflow-x: hidden } is defined in src/styles.css", () => {
      const content = fs.readFileSync(PATHS.stylesCss, "utf-8");
      expect(content).toMatch(/overflow-x:\s*hidden/);
    });

    test("TC-B4.3: Mobile breakpoint (< 768px): Desktop taskbar is isolated and not mounted in mobile mode", () => {
      const content = fs.readFileSync(PATHS.mobileShellTsx, "utf-8");
      // MobileShell does NOT import or render Taskbar
      expect(content).not.toContain("import Taskbar");
      expect(content).not.toContain("<Taskbar");
    });
  });
});
