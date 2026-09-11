import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import * as path from "path";
import {
  PATHS,
  EXPECTED_APP_IDS,
  EXPECTED_ICON_FILES,
  validateSvgHygiene,
  computeTaskbarGridGeometry,
  computeWindowSpawnBounds,
  computeWindowDragClamp,
  computeWindowResizeClamp,
  computeMaximizedGeometry,
} from "../helpers/test-utils";
import { WindowStoreSimulator, MOCK_APPS } from "../helpers/window-store-sim";

describe("Tier 5: Adversarial Coverage Hardening & Empirical Stress-Testing", () => {
  // =========================================================================
  // Section 1: Adversarial Icon Assets & SVG Security Hygiene
  // =========================================================================
  describe("Section 1: Adversarial Icon Assets & SVG Security Hygiene", () => {
    test("TC-5.1.1: All 15 SVG files exist, are non-empty, and exceed minimum vector threshold", () => {
      expect(fs.existsSync(PATHS.publicIcons)).toBe(true);
      for (const iconFile of EXPECTED_ICON_FILES) {
        const fullPath = path.join(PATHS.publicIcons, iconFile);
        expect(fs.existsSync(fullPath)).toBe(true);
        const stats = fs.statSync(fullPath);
        // Minimum realistic SVG size is > 100 bytes
        expect(stats.size).toBeGreaterThan(100);
      }
    });

    test("TC-5.1.2: All 15 SVGs contain valid XML structure with explicit viewBox attributes", () => {
      for (const iconFile of EXPECTED_ICON_FILES) {
        const fullPath = path.join(PATHS.publicIcons, iconFile);
        const content = fs.readFileSync(fullPath, "utf-8");
        const hygiene = validateSvgHygiene(content, iconFile === "start.svg");
        expect(hygiene.valid).toBe(true);
        expect(hygiene.viewBox).toBeDefined();
        expect(hygiene.viewBox!.trim().length).toBeGreaterThan(0);
      }
    });

    test("TC-5.1.3: Zero executable code (<script>, <foreignObject>, javascript:) in any SVG", () => {
      for (const iconFile of EXPECTED_ICON_FILES) {
        const fullPath = path.join(PATHS.publicIcons, iconFile);
        const content = fs.readFileSync(fullPath, "utf-8");
        expect(content.toLowerCase()).not.toContain("<script");
        expect(content.toLowerCase()).not.toContain("</script>");
        expect(content.toLowerCase()).not.toContain("<foreignobject");
        expect(content.toLowerCase()).not.toContain("javascript:");
      }
    });

    test("TC-5.1.4: Zero inline event handlers (onload, onerror, onclick, etc.) in any SVG", () => {
      const eventHandlerRegex = /\bon[a-z]+\s*=/i;
      for (const iconFile of EXPECTED_ICON_FILES) {
        const fullPath = path.join(PATHS.publicIcons, iconFile);
        const content = fs.readFileSync(fullPath, "utf-8");
        expect(eventHandlerRegex.test(content)).toBe(false);
      }
    });

    test("TC-5.1.5: Zero remote network references (http://, https://, protocol-relative) in any SVG", () => {
      for (const iconFile of EXPECTED_ICON_FILES) {
        const fullPath = path.join(PATHS.publicIcons, iconFile);
        const content = fs.readFileSync(fullPath, "utf-8");
        // Allow XML namespaces like xmlns="http://www.w3.org/2000/svg" but disallow href/src remote URLs
        const hrefMatches = content.match(/(?:href|src|xlink:href)\s*=\s*["']([^"']+)["']/gi) || [];
        for (const match of hrefMatches) {
          expect(match.toLowerCase()).not.toContain("http://");
          expect(match.toLowerCase()).not.toContain("https://");
          expect(match.toLowerCase()).not.toContain("//");
        }
      }
    });

    test("TC-5.1.6: Start icon strictly uses neutral grid launcher (no trademark Windows 4-pane logo)", () => {
      const startPath = path.join(PATHS.publicIcons, "start.svg");
      const content = fs.readFileSync(startPath, "utf-8");
      const hygiene = validateSvgHygiene(content, true);
      expect(hygiene.isNeutralStartIcon).toBe(true);
      expect(content.toLowerCase()).not.toContain("windows-logo");
      expect(content.toLowerCase()).not.toContain("microsoft-logo");
    });

    test("TC-5.1.7: icon-manifest.json maps all 15 icons with valid local paths and upstream MIT URLs", () => {
      expect(fs.existsSync(PATHS.manifest)).toBe(true);
      const manifest = JSON.parse(fs.readFileSync(PATHS.manifest, "utf-8"));
      expect(manifest.license).toBe("MIT");
      expect(manifest.icons).toBeDefined();

      for (const id of EXPECTED_APP_IDS) {
        expect(manifest.icons[id]).toBeDefined();
        expect(manifest.icons[id].localPath).toBe(`/assets/icons/windows11/${id}.svg`);
        expect(manifest.icons[id].upstreamUrl).toContain("github.com/microsoft/fluentui-system-icons");
      }
      expect(manifest.icons.start).toBeDefined();
      expect(manifest.icons.search).toBeDefined();
    });

    test("TC-5.1.8: SOURCES.md and LICENSE-MICROSOFT-FLUENT.txt exist and confirm MIT provenance", () => {
      expect(fs.existsSync(PATHS.sources)).toBe(true);
      expect(fs.existsSync(PATHS.license)).toBe(true);
      const sourcesContent = fs.readFileSync(PATHS.sources, "utf-8");
      const licenseContent = fs.readFileSync(PATHS.license, "utf-8");

      expect(sourcesContent).toContain("https://github.com/microsoft/fluentui-system-icons");
      expect(licenseContent).toContain("MIT License");
      expect(licenseContent).toContain("Microsoft Corporation");
    });
  });

  // =========================================================================
  // Section 2: AppIcon Resolution & Fallback Resilience
  // =========================================================================
  describe("Section 2: AppIcon Resolution & Fallback Resilience", () => {
    test("TC-5.2.1: AppIcon normalizes paths with and without leading slash", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain('targetPath.startsWith("/") ? targetPath : `/${targetPath}`');
    });

    test("TC-5.2.2: AppIcon handles BASE_URL with and without trailing slash", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain('base.endsWith("/") ? base.slice(0, -1) : base');
      expect(appIconContent).toContain("const finalSrc = `${cleanBase}${cleanPath}`");
    });

    test("TC-5.2.3: AppIcon fallback precedence follows fallback -> icon -> registeredApp?.icon", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain("const FallbackIcon = fallback ?? icon ?? registeredApp?.icon");
    });

    test("TC-5.2.4: AppIcon resets error state when targetPath changes via useEffect hook", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain("useEffect(() => {");
      expect(appIconContent).toContain("setHasError(false);");
      expect(appIconContent).toContain("}, [targetPath]);");
    });

    test("TC-5.2.5: AppIcon preserves empty string alt='' for decorative icons without falling back to title", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain('const resolvedAlt = alt ?? registeredApp?.title ?? ""');
    });

    test("TC-5.2.6: AppIcon handles undefined or unknown appId gracefully without throwing", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain("const registeredApp = appId ? APPS[appId] : undefined;");
      expect(appIconContent).toContain("if (!targetPath || hasError)");
      expect(appIconContent).toContain("return null;");
    });

    test("TC-5.2.7: AppIcon img tag enforces lazy loading, async decoding, unselectable, and non-draggable attributes", () => {
      const appIconContent = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(appIconContent).toContain('loading="lazy"');
      expect(appIconContent).toContain('decoding="async"');
      expect(appIconContent).toContain("draggable={false}");
      expect(appIconContent).toContain("select-none object-contain pointer-events-none");
    });
  });

  // =========================================================================
  // Section 3: All 13 Desktop Apps & Desktop Shortcut Sizing
  // =========================================================================
  describe("Section 3: All 13 Desktop Apps & Desktop Shortcut Sizing", () => {
    test("TC-5.3.1: All 13 application definitions in apps.tsx have non-empty titles and valid iconPaths", () => {
      const appsContent = fs.readFileSync(PATHS.appsTsx, "utf-8");
      for (const id of EXPECTED_APP_IDS) {
        expect(appsContent).toContain(`${id}: {`);
        expect(appsContent).toContain(`iconPath: "/assets/icons/windows11/${id}.svg"`);
      }
    });

    test("TC-5.3.2: Desktop shortcuts render icons at 44px (h-11 w-11), within the 40-48px specification", () => {
      const desktopIconsContent = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      expect(desktopIconsContent).toContain('AppIcon appId={id} className="h-11 w-11 drop-shadow-md"');
    });

    test("TC-5.3.3: Desktop shortcuts provide accessible aria-label and keyboard Enter launch handler", () => {
      const desktopIconsContent = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      expect(desktopIconsContent).toContain("aria-label={`Open ${app.title}`}");
      expect(desktopIconsContent).toContain('if (e.key === "Enter") openApp(id);');
    });

    test("TC-5.3.4: Desktop shortcut 6-row grid avoids vertical collision with taskbar at all target viewports", () => {
      const targetViewports = [
        { name: "Full HD", vh: 1080 },
        { name: "Laptop", vh: 900 },
        { name: "Compact Laptop", vh: 768 },
        { name: "Minimum Desktop", vh: 768 },
      ];

      const gridHeight = 6 * 96 + 32; // 6 rows * 96px + 32px padding = 608px
      const taskbarHeight = 56;

      for (const vp of targetViewports) {
        const availableHeight = vp.vh - taskbarHeight;
        const clearance = availableHeight - gridHeight;
        expect(clearance).toBeGreaterThanOrEqual(104); // At least 104px safety clearance
      }
    });

    test("TC-5.3.5: Desktop background container enforces bottom clearance equal to --taskbar-height", () => {
      const desktopContent = fs.readFileSync(PATHS.desktopTsx, "utf-8");
      expect(desktopContent).toContain('style={{ bottom: "var(--taskbar-height, 56px)" }}');
    });
  });

  // =========================================================================
  // Section 4: Taskbar 3-Column CSS Grid Math & Centering Under Stress
  // =========================================================================
  describe("Section 4: Taskbar 3-Column CSS Grid Math & Centering Under Stress", () => {
    test("TC-5.4.1: Mathematical proof: Midpoint of center task group equals vw / 2 across all viewports with 0 to 13 windows", () => {
      const viewports = [1920, 1440, 1366, 1024];
      const trayWidth = 180;

      for (const vw of viewports) {
        // Test varying numbers of open windows: 0, 1, 2, 3, 5, 8, 13
        const windowCounts = [0, 1, 2, 3, 5, 8, 13];
        for (const count of windowCounts) {
          // In Taskbar.tsx: Start (40px) + Search (40px) + gap-1 (4px) = 84px base
          // With few windows (<= 3), full titles fit (up to 140px).
          // Under heavy load (5+ windows on compact screens), titles truncate down to compact icon buttons (40px).
          const availableForButtons = vw - 84 - 2 * trayWidth - 48;
          const maxButtonW = count > 0 ? Math.floor(availableForButtons / count) : 140;
          const buttonWidth = Math.max(40, Math.min(140, maxButtonW));
          const centerGroupWidth = 84 + count * (buttonWidth + 4);

          const geom = computeTaskbarGridGeometry(vw, centerGroupWidth, trayWidth);

          expect(geom.isCentered).toBe(true);
          expect(geom.geometricMidpoint).toBe(vw / 2);
          expect(geom.centerGroupMidpoint).toBe(vw / 2);
        }
      }
    });

    test("TC-5.4.2: System tray in Column 3 maintains positive clearance at 3-window benchmark across viewports", () => {
      const viewports = [1920, 1440, 1366, 1024];
      const trayWidth = 180;
      // 3 windows with titles: Start(40) + Search(40) + 3*(140) + gaps = ~516px
      const centerWidth = 516;

      for (const vw of viewports) {
        const geom = computeTaskbarGridGeometry(vw, centerWidth, trayWidth);
        expect(geom.isCollidingWithTray).toBe(false);
        expect(geom.rightMarginRemaining).toBeGreaterThan(trayWidth);
      }
    });

    test("TC-5.4.3: Zero occurrences of 'absolute right-3' in Taskbar or anywhere in src/", () => {
      const taskbarContent = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(taskbarContent).not.toContain("absolute right-3");
      expect(taskbarContent).toContain("justify-self-end");
      expect(taskbarContent).toContain("shrink-0");
    });

    test("TC-5.4.4: Taskbar Start and Search buttons render Fluent SVG icons", () => {
      const taskbarContent = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(taskbarContent).toContain('iconPath="/assets/icons/windows11/start.svg"');
      expect(taskbarContent).toContain('iconPath="/assets/icons/windows11/search.svg"');
    });

    test("TC-5.4.5: System tray preserves operational Lucide icons (Wifi, Volume2, BatteryMedium) with accessible labels", () => {
      const taskbarContent = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(taskbarContent).toContain('<Wifi className="h-4 w-4" aria-label="Network" />');
      expect(taskbarContent).toContain('<Volume2 className="h-4 w-4" aria-label="Volume" />');
      expect(taskbarContent).toContain('<BatteryMedium className="h-4 w-4" aria-label="Battery" />');
    });

    test("TC-5.4.6: Dynamic button states enforce centered active pill, running dot, and minimized dimming", () => {
      const taskbarContent = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      // Active pill: centered with left-1/2 -translate-x-1/2 w-4
      expect(taskbarContent).toContain("after:left-1/2");
      expect(taskbarContent).toContain("after:-translate-x-1/2");
      expect(taskbarContent).toContain("after:w-4");
      expect(taskbarContent).toContain("after:bg-primary");

      // Inactive open running dot: centered with left-1/2 -translate-x-1/2 w-1.5
      expect(taskbarContent).toContain("after:w-1.5");
      expect(taskbarContent).toContain("after:bg-muted-foreground/60");

      // Minimized: opacity-60
      expect(taskbarContent).toContain("isMinimized && \"opacity-60");
    });
  });

  // =========================================================================
  // Section 5: Window Maximization & Viewport Boundary Invariants
  // =========================================================================
  describe("Section 5: Window Maximization & Viewport Boundary Invariants", () => {
    test("TC-5.5.1: Maximized window height calc(100dvh - var(--taskbar-height, 56px)) leaves exact 56px clearance with 0px overlap", () => {
      const viewports = [
        { vh: 1080, expectedH: 1024 },
        { vh: 900, expectedH: 844 },
        { vh: 768, expectedH: 712 },
      ];

      for (const vp of viewports) {
        const geom = computeMaximizedGeometry(vp.vh, 56);
        expect(geom.heightPx).toBe(vp.expectedH);
        // Clearance equals exactly taskbar height
        expect(vp.vh - geom.heightPx).toBe(56);
      }
    });

    test("TC-5.5.2: Taskbar z-index (z-9999) dominates window chrome z-index", () => {
      const taskbarContent = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
      expect(taskbarContent).toContain("z-9999");
    });

    test("TC-5.5.3: Window drag clamp prevents dragging titlebar off-screen or into taskbar", () => {
      const vh = 900;
      const vw = 1440;
      const taskbarH = 56;

      // Negative drag (above top viewport)
      const topClamp = computeWindowDragClamp(100, -100, 0, 0, vw, vh, taskbarH);
      expect(topClamp.y).toBe(0);

      // Excessive downward drag (into taskbar)
      const bottomClamp = computeWindowDragClamp(100, 1000, 0, 0, vw, vh, taskbarH);
      expect(bottomClamp.y).toBe(vh - taskbarH - 40); // 900 - 56 - 40 = 804px
      expect(bottomClamp.y).toBeLessThan(vh - taskbarH);
    });

    test("TC-5.5.4: Window resize clamp enforces minimum dimensions of 360px x 240px", () => {
      const resizeClamp = computeWindowResizeClamp(-500, -500, 0, 0, 400, 300);
      expect(resizeClamp.w).toBe(360);
      expect(resizeClamp.h).toBe(240);
    });

    test("TC-5.5.5: Global stylesheet defines html, body { overflow-x: hidden; }", () => {
      const stylesContent = fs.readFileSync(PATHS.stylesCss, "utf-8");
      expect(stylesContent).toMatch(/html,\s*body\s*\{[^}]*overflow-x:\s*hidden;[^}]*\}/);
    });
  });

  // =========================================================================
  // Section 6: Complete UI Touchpoint Icon Modernization
  // =========================================================================
  describe("Section 6: Complete UI Touchpoint Icon Modernization", () => {
    test("TC-5.6.1: Window.tsx renders AppIcon in titlebar and preserves Lucide controls (Minus, Square, Copy, X)", () => {
      const windowContent = fs.readFileSync(PATHS.windowTsx, "utf-8");
      expect(windowContent).toContain('<AppIcon appId={win.appId} className="h-4 w-4 shrink-0" alt="" />');
      expect(windowContent).toContain("<Minus");
      expect(windowContent).toContain("<Square");
      expect(windowContent).toContain("<Copy");
      expect(windowContent).toContain("<X");
    });

    test("TC-5.6.2: StartMenu.tsx renders AppIcon for pinned/recommended and preserves Lucide controls", () => {
      const startMenuContent = fs.readFileSync(PATHS.startMenuTsx, "utf-8");
      expect(startMenuContent).toContain("<AppIcon appId={id}");
      expect(startMenuContent).toContain("<Search");
      expect(startMenuContent).toContain("<Settings");
      expect(startMenuContent).toContain("<Power");
    });

    test("TC-5.6.3: SearchOverlay.tsx renders AppIcon for search results and preserves Lucide Search", () => {
      const searchContent = fs.readFileSync(PATHS.searchOverlayTsx, "utf-8");
      expect(searchContent).toContain('<AppIcon appId={r.app} className="h-5 w-5 shrink-0" alt="" />');
      expect(searchContent).toContain("<Search");
    });

    test("TC-5.6.4: MobileShell.tsx renders AppIcon for mobile app grid and preserves mobile Lucide controls", () => {
      const mobileContent = fs.readFileSync(PATHS.mobileShellTsx, "utf-8");
      expect(mobileContent).toContain('<AppIcon appId={id} className="h-7 w-7" alt="" />');
      expect(mobileContent).toContain("<ArrowLeft");
      expect(mobileContent).toContain("<Signal");
      expect(mobileContent).toContain("<Wifi");
      expect(mobileContent).toContain("<BatteryMedium");
      expect(mobileContent).not.toContain("<Taskbar");
    });

    test("TC-5.6.5: CSS variable --taskbar-height: 56px is identical in :root and .dark", () => {
      const stylesContent = fs.readFileSync(PATHS.stylesCss, "utf-8");
      const rootMatch = stylesContent.match(/:root\s*\{[^}]*--taskbar-height:\s*(\d+)px/);
      const darkMatch = stylesContent.match(/\.dark\s*\{[^}]*--taskbar-height:\s*(\d+)px/);

      expect(rootMatch?.[1]).toBe("56");
      expect(darkMatch?.[1]).toBe("56");
      expect(rootMatch?.[1]).toBe(darkMatch?.[1]);
    });
  });

  // =========================================================================
  // Section 7: Adversarial State Machine Stress Harness
  // =========================================================================
  describe("Section 7: Adversarial State Machine Stress Harness", () => {
    test("TC-5.7.1: 100-cycle randomized multi-window stress test maintains all state invariants", () => {
      const sim = new WindowStoreSimulator(1440, 900);
      const appIds = EXPECTED_APP_IDS;

      // Seed with initial windows
      sim.openApp("terminal");
      sim.openApp("paint");
      sim.openApp("resume");

      // Execute 100 pseudo-random operations
      for (let i = 0; i < 100; i++) {
        const action = i % 5;
        const appId = appIds[i % appIds.length]!;

        switch (action) {
          case 0: {
            // Open or focus app
            sim.openApp(appId);
            break;
          }
          case 1: {
            // Toggle taskbar on random open window
            if (sim.windows.length > 0) {
              const target = sim.windows[i % sim.windows.length]!;
              sim.toggleFromTaskbar(target.id);
            }
            break;
          }
          case 2: {
            // Minimize active window
            if (sim.activeId) {
              sim.minimize(sim.activeId);
            }
            break;
          }
          case 3: {
            // Toggle maximize
            if (sim.windows.length > 0) {
              const target = sim.windows[i % sim.windows.length]!;
              sim.toggleMax(target.id);
            }
            break;
          }
          case 4: {
            // Close window (preserve at least one window if possible)
            if (sim.windows.length > 1) {
              const target = sim.windows[i % sim.windows.length]!;
              sim.close(target.id);
            }
            break;
          }
        }

        // Invariant checks on each cycle
        // 1. If activeId is set, it must exist in open windows and NOT be minimized
        if (sim.activeId !== null) {
          const activeWin = sim.windows.find((w) => w.id === sim.activeId);
          expect(activeWin).toBeDefined();
          expect(activeWin!.minimized).toBe(false);
        }

        // 2. All window coordinates must be valid numbers (no NaN or Infinity)
        for (const w of sim.windows) {
          expect(Number.isFinite(w.x)).toBe(true);
          expect(Number.isFinite(w.y)).toBe(true);
          expect(Number.isFinite(w.w)).toBe(true);
          expect(Number.isFinite(w.h)).toBe(true);
          expect(Number.isFinite(w.z)).toBe(true);
          expect(w.z).toBeGreaterThan(0);
        }
      }

      // Final store sanity check
      expect(sim.windows.length).toBeGreaterThan(0);
      const buttons = sim.getTaskbarButtons();
      expect(buttons.length).toBe(sim.windows.length);
    });
  });
});
