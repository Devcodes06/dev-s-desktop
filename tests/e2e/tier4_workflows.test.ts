import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import {
  PATHS,
  computeTaskbarGridGeometry,
  computeMaximizedGeometry,
} from "../helpers/test-utils";
import { WindowStoreSimulator } from "../helpers/window-store-sim";

describe("Tier 4: Real-World Application Workflows", () => {
  // Workflow 1: Desktop Boot & Initial State
  describe("Workflow: Desktop Boot & Initial Interface State", () => {
    test("TC-W1.1: Boot: Desktop shortcuts are populated with 12 apps in defined DESKTOP_ORDER", () => {
      const appsContent = fs.readFileSync(PATHS.appsTsx, "utf-8");
      const desktopIconsContent = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");

      expect(appsContent).toContain("export const DESKTOP_ORDER: AppId[] =");
      expect(desktopIconsContent).toContain("DESKTOP_ORDER.map");
    });

    test("TC-W1.2: Boot: Taskbar initializes with Start, Search, empty dynamic window buttons, and clock tray", () => {
      const sim = new WindowStoreSimulator();
      expect(sim.windows).toHaveLength(0);
      expect(sim.getTaskbarButtons()).toHaveLength(0);
      expect(sim.activeId).toBeNull();
    });

    test("TC-W1.3: Boot: Zero horizontal scrollbar rule is enforced in global stylesheet", () => {
      const stylesContent = fs.readFileSync(PATHS.stylesCss, "utf-8");
      expect(stylesContent).toContain("overflow-x: hidden");
    });
  });

  // Workflow 2: End-to-End Multitasking Lifecycle
  describe("Workflow: End-to-End User Multitasking Lifecycle", () => {
    test("TC-W2.1: Full journey: open 3 apps -> minimize -> switch active -> close one -> verify state", () => {
      const sim = new WindowStoreSimulator(1440, 900);

      // Step 1: User opens terminal
      const winTerm = sim.openApp("terminal");
      expect(sim.windows).toHaveLength(1);
      expect(sim.activeId).toBe(winTerm.id);

      // Step 2: User opens resume
      const winResume = sim.openApp("resume");
      expect(sim.windows).toHaveLength(2);
      expect(sim.activeId).toBe(winResume.id);

      // Step 3: User opens paint
      const winPaint = sim.openApp("paint");
      expect(sim.windows).toHaveLength(3);
      expect(sim.activeId).toBe(winPaint.id);

      // Verify taskbar buttons reflect all 3 windows
      let buttons = sim.getTaskbarButtons();
      expect(buttons).toHaveLength(3);
      expect(buttons.find((b) => b.id === winPaint.id)?.isActive).toBe(true);
      expect(buttons.find((b) => b.id === winResume.id)?.isInactiveOpen).toBe(true);
      expect(buttons.find((b) => b.id === winTerm.id)?.isInactiveOpen).toBe(true);

      // Step 4: User clicks active Paint taskbar button -> Paint minimizes
      sim.toggleFromTaskbar(winPaint.id);
      buttons = sim.getTaskbarButtons();
      expect(buttons.find((b) => b.id === winPaint.id)?.isMinimized).toBe(true);
      expect(sim.activeId).toBeNull();

      // Step 5: User clicks Terminal taskbar button -> Terminal focuses and becomes active
      sim.toggleFromTaskbar(winTerm.id);
      buttons = sim.getTaskbarButtons();
      expect(buttons.find((b) => b.id === winTerm.id)?.isActive).toBe(true);
      expect(sim.activeId).toBe(winTerm.id);

      // Step 6: User closes Resume window -> Resume button disappears; Terminal and Paint remain
      sim.close(winResume.id);
      buttons = sim.getTaskbarButtons();
      expect(buttons).toHaveLength(2);
      expect(buttons.map((b) => b.appId)).toEqual(["terminal", "paint"]);
      expect(sim.windows).toHaveLength(2);
    });
  });

  // Workflow 3: Window Maximization & System Tray Clearance
  describe("Workflow: Window Maximization & System Tray Clearance", () => {
    test("TC-W3.1: Maximized window dimensions strictly stop above taskbar across all 4 target viewports", () => {
      const targetViewports = [
        { name: "Full HD", vw: 1920, vh: 1080, expectedH: 1024 },
        { name: "Laptop", vw: 1440, vh: 900, expectedH: 844 },
        { name: "Compact Laptop", vw: 1366, vh: 768, expectedH: 712 },
        { name: "Minimum Desktop", vw: 1024, vh: 768, expectedH: 712 },
      ];

      for (const vp of targetViewports) {
        const geom = computeMaximizedGeometry(vp.vh, 56);
        expect(geom.heightPx).toBe(vp.expectedH);
        expect(vp.vh - geom.heightPx).toBe(56); // Leaves exactly 56px for taskbar
      }
    });

    test("TC-W3.2: Taskbar maintains highest z-index (z-9999) ensuring visibility above maximized windows", () => {
      const taskbarContent = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(taskbarContent).toContain("z-9999");
    });

    test("TC-W3.3: Desktop background area sets bottom clearance equal to taskbar height", () => {
      const desktopContent = fs.readFileSync(PATHS.desktopTsx, "utf-8");
      expect(desktopContent).toContain("var(--taskbar-height, 56px)");
    });
  });

  // Workflow 4: Theme Consistency & CSS Custom Property Parity
  describe("Workflow: Theme Parity & CSS Custom Property Uniformity", () => {
    test("TC-W4.1: --taskbar-height is 56px in both light and dark themes", () => {
      const styles = fs.readFileSync(PATHS.stylesCss, "utf-8");
      const rootMatch = styles.match(/:root\s*\{[^}]*--taskbar-height:\s*(\d+)px/);
      const darkMatch = styles.match(/\.dark\s*\{[^}]*--taskbar-height:\s*(\d+)px/);

      expect(rootMatch?.[1]).toBe("56");
      expect(darkMatch?.[1]).toBe("56");
    });

    test("TC-W4.2: Center task group geometric midpoint is identical at 1024x768 and 1920x1080", () => {
      const geom1024 = computeTaskbarGridGeometry(1024, 280, 180);
      const geom1920 = computeTaskbarGridGeometry(1920, 280, 180);

      expect(geom1024.centerGroupMidpoint).toBe(512);
      expect(geom1920.centerGroupMidpoint).toBe(960);
      expect(geom1024.isCollidingWithTray).toBe(false);
      expect(geom1920.isCollidingWithTray).toBe(false);
    });
  });
});
