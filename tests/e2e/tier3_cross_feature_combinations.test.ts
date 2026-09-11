import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import {
  PATHS,
  computeTaskbarGridGeometry,
} from "../helpers/test-utils";
import { WindowStoreSimulator } from "../helpers/window-store-sim";

describe("Tier 3: Cross-Feature Combinations & Pairwise Interactions", () => {
  // Pairwise 1: Multi-Window Scalability & Taskbar Centering Math
  describe("Pairwise: Multi-Window Stacking + Taskbar Centering", () => {
    test("TC-C1.1: 1 open window: taskbar center group midpoint remains strictly at viewportWidth / 2", () => {
      const vw = 1440;
      const trayWidth = 180;
      // Start (40px) + Search (40px) + 1 app with title (160px) + gaps (12px) = 252px
      const centerWidth = 252;
      const geom = computeTaskbarGridGeometry(vw, centerWidth, trayWidth);
      expect(geom.isCentered).toBe(true);
      expect(geom.centerGroupMidpoint).toBe(720);
      expect(geom.isCollidingWithTray).toBe(false);
    });

    test("TC-C1.2: 3 open windows (Terminal, Paint, Resume): center group remains strictly centered", () => {
      const vw = 1440;
      const trayWidth = 180;
      // Start (40) + Search (40) + 3 apps (3 * 160 = 480) + gaps (16px) = 576px
      const centerWidth = 576;
      const geom = computeTaskbarGridGeometry(vw, centerWidth, trayWidth);
      expect(geom.isCentered).toBe(true);
      expect(geom.centerGroupMidpoint).toBe(720);
      expect(geom.isCollidingWithTray).toBe(false);
      expect(geom.rightMarginRemaining).toBeGreaterThan(trayWidth);
    });

    test("TC-C1.3: Compact viewport 1024x768 with 5 open windows: title truncation prevents tray collision", () => {
      const vw = 1024;
      const trayWidth = 180;
      // On small screens (<lg), titles are hidden (hidden lg:inline). Each app is 40px square icon button
      // Start (40) + Search (40) + 5 apps (5 * 40 = 200) + 6 gaps (24px) = 304px
      const centerWidth = 304;
      const geom = computeTaskbarGridGeometry(vw, centerWidth, trayWidth);
      expect(geom.isCentered).toBe(true);
      expect(geom.centerGroupMidpoint).toBe(512);
      expect(geom.rightMarginRemaining).toBe((1024 - 304) / 2); // 360px
      expect(geom.rightMarginRemaining).toBeGreaterThan(trayWidth); // 360px > 180px
      expect(geom.isCollidingWithTray).toBe(false);
    });
  });

  // Pairwise 2: Multi-Window Taskbar Button State Synchronizations
  describe("Pairwise: Active/Inactive/Minimized State Synchronization Across Multiple Windows", () => {
    test("TC-C2.1: Opening Window A then Window B sets Window B as active and Window A as inactive open", () => {
      const sim = new WindowStoreSimulator();
      const winA = sim.openApp("terminal");
      const winB = sim.openApp("resume");

      const buttons = sim.getTaskbarButtons();
      expect(buttons).toHaveLength(2);

      const btnA = buttons.find((b) => b.id === winA.id)!;
      const btnB = buttons.find((b) => b.id === winB.id)!;

      expect(btnB.isActive).toBe(true);
      expect(btnB.isMinimized).toBe(false);
      expect(btnA.isActive).toBe(false);
      expect(btnA.isInactiveOpen).toBe(true);
      expect(btnA.isMinimized).toBe(false);
    });

    test("TC-C2.2: Minimizing active Window B clears activeId and sets Window B to minimized", () => {
      const sim = new WindowStoreSimulator();
      const winA = sim.openApp("terminal");
      const winB = sim.openApp("resume");

      // Click active Window B from taskbar -> minimizes
      sim.toggleFromTaskbar(winB.id);

      const buttons = sim.getTaskbarButtons();
      const btnA = buttons.find((b) => b.id === winA.id)!;
      const btnB = buttons.find((b) => b.id === winB.id)!;

      expect(btnB.isMinimized).toBe(true);
      expect(btnB.isActive).toBe(false);
      expect(sim.activeId).toBeNull();
      // Window A remains inactive open
      expect(btnA.isInactiveOpen).toBe(true);
    });

    test("TC-C2.3: Restoring minimized Window B raises its z-index above Window A and sets it active", () => {
      const sim = new WindowStoreSimulator();
      const winA = sim.openApp("terminal");
      const winB = sim.openApp("resume");

      sim.toggleFromTaskbar(winB.id); // minimize
      const zBefore = winB.z;

      sim.toggleFromTaskbar(winB.id); // restore
      expect(winB.minimized).toBe(false);
      expect(sim.activeId).toBe(winB.id);
      expect(winB.z).toBeGreaterThan(zBefore);
      expect(winB.z).toBeGreaterThan(winA.z);
    });

    test("TC-C2.4: Closing Window B removes its taskbar button while preserving Window A button", () => {
      const sim = new WindowStoreSimulator();
      const winA = sim.openApp("terminal");
      const winB = sim.openApp("resume");

      sim.close(winB.id);
      const buttons = sim.getTaskbarButtons();
      expect(buttons).toHaveLength(1);
      expect(buttons[0]!.id).toBe(winA.id);
      expect(sim.activeId).toBeNull();
    });
  });

  // Pairwise 3: Desktop Shortcuts & Deduplicated Launch
  describe("Pairwise: Desktop Shortcut Double-Click & Single Instance Launching", () => {
    test("TC-C3.1: Double-clicking an already-open desktop shortcut unminimizes and focuses it", () => {
      const sim = new WindowStoreSimulator();
      const win1 = sim.openApp("projects");
      sim.minimize(win1.id);
      expect(win1.minimized).toBe(true);

      // Re-trigger openApp (equivalent to double clicking shortcut again)
      const win2 = sim.openApp("projects");
      expect(win2.id).toBe(win1.id);
      expect(sim.windows).toHaveLength(1); // No duplicate window
      expect(win2.minimized).toBe(false);
      expect(sim.activeId).toBe(win1.id);
    });
  });

  // Pairwise 4: Flyouts (StartMenu & SearchOverlay) + Maximized Window
  describe("Pairwise: Start Menu / Search Flyouts Above Maximized Windows", () => {
    test("TC-C4.1: StartMenu.tsx positions flyout above taskbar using calc(var(--taskbar-height, 56px) + 8px)", () => {
      const content = fs.readFileSync(PATHS.startMenuTsx, "utf-8");
      expect(content).toContain("var(--taskbar-height, 56px)");
      expect(content).toMatch(/calc\(var\(--taskbar-height,\s*56px\)\s*\+\s*8px\)/);
    });

    test("TC-C4.2: SearchOverlay.tsx positions flyout above taskbar using calc(var(--taskbar-height, 56px) + 8px)", () => {
      const content = fs.readFileSync(PATHS.searchOverlayTsx, "utf-8");
      expect(content).toContain("var(--taskbar-height, 56px)");
      expect(content).toMatch(/calc\(var\(--taskbar-height,\s*56px\)\s*\+\s*8px\)/);
    });
  });
});
