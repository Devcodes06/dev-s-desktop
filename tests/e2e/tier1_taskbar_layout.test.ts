import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import {
  PATHS,
  computeTaskbarGridGeometry,
} from "../helpers/test-utils";

describe("Tier 1C: Taskbar 3-Column Grid, Dynamic Buttons, Clock & System Tray", () => {
  // Feature 1: 3-Column CSS Grid Architecture
  describe("Feature: Taskbar 3-Column CSS Grid & Geometric Centering", () => {
    test("TC-1.1: Taskbar footer uses 3-column CSS Grid (grid-cols-[1fr_auto_1fr])", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("grid-cols-[1fr_auto_1fr]");
    });

    test("TC-1.2: Column 1: Left spacer exists for geometric balance with justify-self-start", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toMatch(/justify-self-start/);
    });

    test("TC-1.3: Column 2: Center group houses Start, Search, and dynamic buttons with justify-self-center", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toMatch(/justify-self-center/);
    });

    test("TC-1.4: Column 3: System tray is right-aligned with justify-self-end and shrink-0", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toMatch(/justify-self-end/);
      expect(content).toMatch(/shrink-0/);
    });

    test("TC-1.5: System tray does NOT use absolute positioning (absolute right-3 removed)", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).not.toContain("absolute right-3");
    });

    test("TC-1.6: Mathematical proof: 3-column grid midpoint strictly matches viewport midpoint", () => {
      const viewports = [1920, 1440, 1366, 1024];
      const centerWidths = [120, 240, 360, 480];
      const trayWidth = 180;

      for (const vw of viewports) {
        for (const cw of centerWidths) {
          const geom = computeTaskbarGridGeometry(vw, cw, trayWidth);
          expect(geom.isCentered).toBe(true);
          expect(geom.centerGroupMidpoint).toBe(vw / 2);
          expect(geom.isCollidingWithTray).toBe(false);
        }
      }
    });
  });

  // Feature 2: Unified --taskbar-height Custom Property
  describe("Feature: --taskbar-height Consolidation", () => {
    test("TC-2.1: --taskbar-height: 56px is defined in :root in src/styles.css", () => {
      const content = fs.readFileSync(PATHS.stylesCss, "utf-8");
      expect(content).toMatch(/--taskbar-height:\s*56px;/);
    });

    test("TC-2.2: --taskbar-height: 56px is defined in .dark in src/styles.css", () => {
      const content = fs.readFileSync(PATHS.stylesCss, "utf-8");
      const darkBlock = content.slice(content.indexOf(".dark {"));
      expect(darkBlock).toMatch(/--taskbar-height:\s*56px;/);
    });

    test("TC-2.3: Taskbar.tsx consumes var(--taskbar-height, 56px)", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("var(--taskbar-height, 56px)");
    });

    test("TC-2.4: Desktop.tsx sets bottom clearance using var(--taskbar-height, 56px)", () => {
      const content = fs.readFileSync(PATHS.desktopTsx, "utf-8");
      expect(content).toContain("var(--taskbar-height, 56px)");
    });

    test("TC-2.5: Window.tsx caps maximized height using var(--taskbar-height, 56px)", () => {
      const content = fs.readFileSync(PATHS.windowTsx, "utf-8");
      expect(content).toContain("var(--taskbar-height, 56px)");
    });
  });

  // Feature 3: Dynamic App Button States & Indicators
  describe("Feature: Dynamic Taskbar Button States & Indicators", () => {
    test("TC-3.1: Dynamic button tag has relative positioning for absolute pseudo-indicators", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      // Specification: button must include 'relative' class
      expect(content).toMatch(/<button[\s\S]*?relative[\s\S]*?toggleFromTaskbar/);
    });

    test("TC-3.2: Active window button has centered bottom indicator pill", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      // Centered underline pill with left-1/2 -translate-x-1/2
      expect(content).toContain("after:left-1/2");
      expect(content).toContain("after:-translate-x-1/2");
      expect(content).toContain("after:w-4");
      expect(content).toContain("after:bg-primary");
    });

    test("TC-3.3: Inactive open button has running indicator dot", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      // Running dot indicator for open but non-active windows
      expect(content).toContain("after:w-1.5");
    });

    test("TC-3.4: Minimized window button has distinct dimmed visual state (opacity-60)", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("opacity-60");
    });

    test("TC-3.5: Taskbar Start and Search buttons render Fluent icons", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("/assets/icons/windows11/start.svg");
      expect(content).toContain("/assets/icons/windows11/search.svg");
    });
  });

  // Feature 4: Clock & System Tray Retained Icons
  describe("Feature: Clock Formatting & System Tray Invariants", () => {
    test("TC-4.1: Clock supports 12h/24h toggle via clock24 setting", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("useSettings()");
      expect(content).toContain("clock24");
      expect(content).toContain("hour12: !clock24");
    });

    test("TC-4.2: Clock date format uses en-GB with hyphens replacing slashes", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain('replaceAll("/", "-")');
    });

    test("TC-4.3: System tray retains operational Lucide icons (Wifi, Volume2, BatteryMedium)", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("<Wifi");
      expect(content).toContain("<Volume2");
      expect(content).toContain("<BatteryMedium");
    });

    test("TC-4.4: System tray icons include accessible aria-labels", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain('aria-label="Network"');
      expect(content).toContain('aria-label="Volume"');
      expect(content).toContain('aria-label="Battery"');
    });

    test("TC-4.5: Clock refreshes at a 20-second interval", () => {
      const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(content).toContain("1000 * 20");
    });
  });
});
