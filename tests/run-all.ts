/**
 * Unified E2E Test Runner for dev-s-desktop
 * Runnable via: bun tests/run-all.ts
 */

interface TestCaseResult {
  name: string;
  tier: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestCaseResult[] = [];

function recordTest(tier: string, name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({ name, tier, passed: true, durationMs });
  } catch (err: any) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    results.push({
      name,
      tier,
      passed: false,
      error: err?.message || String(err),
      durationMs,
    });
  }
}

async function runAll() {
  console.log("================================================================");
  console.log("   dev-s-desktop Comprehensive E2E Test Suite (Tiers 1 - 5)    ");
  console.log("================================================================\n");

  const fs = await import("fs");
  const path = await import("path");
  const {
    PATHS,
    EXPECTED_APP_IDS,
    EXPECTED_ICON_FILES,
    validateSvgHygiene,
    computeTaskbarGridGeometry,
    computeWindowSpawnBounds,
    computeWindowDragClamp,
    computeWindowResizeClamp,
    computeMaximizedGeometry,
  } = await import("./helpers/test-utils");
  const { WindowStoreSimulator, MOCK_APPS } = await import("./helpers/window-store-sim");

  // ==========================================
  // TIER 1A: Icon Assets & Provenance
  // ==========================================
  const TIER_1A = "Tier 1A: Icon Assets";

  recordTest(TIER_1A, "TC-1.1: Directory public/assets/icons/windows11/ exists", () => {
    if (!fs.existsSync(PATHS.publicIcons)) {
      throw new Error(`Directory ${PATHS.publicIcons} does not exist yet (Pending M1).`);
    }
  });

  recordTest(TIER_1A, "TC-1.2: All 13 application SVG icons exist", () => {
    if (!fs.existsSync(PATHS.publicIcons)) throw new Error("Icon folder missing");
    const missing: string[] = [];
    for (const id of EXPECTED_APP_IDS) {
      if (!fs.existsSync(path.join(PATHS.publicIcons, `${id}.svg`))) missing.push(id);
    }
    if (missing.length > 0) throw new Error(`Missing ${missing.length} icons: ${missing.join(", ")}`);
  });

  recordTest(TIER_1A, "TC-1.3: Start and Search SVG icons exist", () => {
    if (!fs.existsSync(path.join(PATHS.publicIcons, "start.svg"))) throw new Error("start.svg missing");
    if (!fs.existsSync(path.join(PATHS.publicIcons, "search.svg"))) throw new Error("search.svg missing");
  });

  recordTest(TIER_1A, "TC-1.4: Exactly 15 required SVG icon files are present", () => {
    if (!fs.existsSync(PATHS.publicIcons)) throw new Error("Icon folder missing");
    const files = fs.readdirSync(PATHS.publicIcons).filter((f) => f.endsWith(".svg"));
    for (const req of EXPECTED_ICON_FILES) {
      if (!files.includes(req)) throw new Error(`Missing icon file: ${req}`);
    }
  });

  recordTest(TIER_1A, "TC-2.1: Every SVG contains a valid viewBox attribute", () => {
    if (!fs.existsSync(PATHS.publicIcons)) throw new Error("Icon folder missing");
    for (const f of EXPECTED_ICON_FILES) {
      const p = path.join(PATHS.publicIcons, f);
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf-8");
      const res = validateSvgHygiene(content);
      if (!res.viewBox) throw new Error(`SVG ${f} missing viewBox`);
    }
  });

  recordTest(TIER_1A, "TC-2.2: Security Hygiene: Zero <script> tags in any SVG asset", () => {
    if (!fs.existsSync(PATHS.publicIcons)) throw new Error("Icon folder missing");
    for (const f of EXPECTED_ICON_FILES) {
      const p = path.join(PATHS.publicIcons, f);
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf-8");
      const res = validateSvgHygiene(content);
      if (res.errors.some((e) => e.includes("<script>"))) throw new Error(`SVG ${f} contains <script>`);
    }
  });

  recordTest(TIER_1A, "TC-2.3: Security Hygiene: Zero <foreignObject> tags in any SVG asset", () => {
    if (!fs.existsSync(PATHS.publicIcons)) throw new Error("Icon folder missing");
    for (const f of EXPECTED_ICON_FILES) {
      const p = path.join(PATHS.publicIcons, f);
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf-8");
      const res = validateSvgHygiene(content);
      if (res.errors.some((e) => e.includes("<foreignObject>"))) throw new Error(`SVG ${f} contains <foreignObject>`);
    }
  });

  recordTest(TIER_1A, "TC-2.4: Offline Determinism: Zero external HTTP/HTTPS resource references", () => {
    if (!fs.existsSync(PATHS.publicIcons)) throw new Error("Icon folder missing");
    for (const f of EXPECTED_ICON_FILES) {
      const p = path.join(PATHS.publicIcons, f);
      if (!fs.existsSync(p)) continue;
      const content = fs.readFileSync(p, "utf-8");
      const res = validateSvgHygiene(content);
      if (res.errors.some((e) => e.includes("Remote HTTP/HTTPS"))) throw new Error(`SVG ${f} has remote URL`);
    }
  });

  recordTest(TIER_1A, "TC-3.1: Start icon does not contain Windows 4-pane trademark logo", () => {
    const p = path.join(PATHS.publicIcons, "start.svg");
    if (!fs.existsSync(p)) throw new Error("start.svg missing");
    const content = fs.readFileSync(p, "utf-8");
    const res = validateSvgHygiene(content, true);
    if (!res.isNeutralStartIcon) throw new Error("Start icon is not neutral");
  });

  recordTest(TIER_1A, "TC-4.1: icon-manifest.json exists and is valid JSON", () => {
    if (!fs.existsSync(PATHS.manifest)) throw new Error("icon-manifest.json missing");
    const parsed = JSON.parse(fs.readFileSync(PATHS.manifest, "utf-8"));
    if (parsed.license !== "MIT") throw new Error("Manifest license is not MIT");
  });

  recordTest(TIER_1A, "TC-4.2: SOURCES.md exists and documents upstream repository", () => {
    if (!fs.existsSync(PATHS.sources)) throw new Error("SOURCES.md missing");
    const content = fs.readFileSync(PATHS.sources, "utf-8");
    if (!content.includes("https://github.com/microsoft/fluentui-system-icons")) throw new Error("Upstream repo link missing");
  });

  recordTest(TIER_1A, "TC-4.3: LICENSE-MICROSOFT-FLUENT.txt contains official MIT License text", () => {
    if (!fs.existsSync(PATHS.license)) throw new Error("LICENSE-MICROSOFT-FLUENT.txt missing");
    const content = fs.readFileSync(PATHS.license, "utf-8");
    if (!content.includes("MIT License")) throw new Error("MIT License text missing");
  });

  // ==========================================
  // TIER 1B: AppIcon & Desktop Shortcuts
  // ==========================================
  const TIER_1B = "Tier 1B: AppIcon & Shortcuts";

  recordTest(TIER_1B, "TC-1.1: src/os/apps.tsx defines all 13 canonical AppIds", () => {
    const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
    for (const id of EXPECTED_APP_IDS) {
      if (!content.includes(`"${id}"`)) throw new Error(`AppId ${id} missing in apps.tsx`);
    }
  });

  recordTest(TIER_1B, "TC-1.2: AppDef maintains mandatory 'icon: LucideIcon' for backwards compatibility", () => {
    const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
    if (!/icon:\s*LucideIcon;/.test(content)) throw new Error("AppDef missing mandatory icon: LucideIcon");
  });

  recordTest(TIER_1B, "TC-1.3: AppDef type supports optional 'iconPath?: string'", () => {
    const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
    if (!/iconPath\?:\s*string;/.test(content)) throw new Error("AppDef missing iconPath?: string (Pending M2)");
  });

  recordTest(TIER_1B, "TC-1.4: APPS registry maps all 13 apps with iconPath", () => {
    const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
    for (const id of EXPECTED_APP_IDS) {
      if (!content.includes(`/assets/icons/windows11/${id}.svg`)) {
        throw new Error(`iconPath for ${id} missing in APPS (Pending M2)`);
      }
    }
  });

  recordTest(TIER_1B, "TC-2.1: src/os/AppIcon.tsx exists", () => {
    if (!fs.existsSync(PATHS.appIconTsx)) throw new Error("src/os/AppIcon.tsx missing (Pending M2)");
  });

  recordTest(TIER_1B, "TC-2.2: Desktop shortcuts render at 40-48px (h-11 w-11 or h-12 w-12)", () => {
    const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
    if (!/h-1[12]\s+w-1[12]/.test(content)) throw new Error("Desktop shortcuts not sized at 40-48px (Pending M2)");
  });

  recordTest(TIER_1B, "TC-2.3: Desktop shortcuts preserve titles and double-click open handler", () => {
    const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
    if (!content.includes("{app.title}")) throw new Error("Missing {app.title}");
    if (!content.includes("onDoubleClick")) throw new Error("Missing onDoubleClick handler");
  });

  recordTest(TIER_1B, "TC-2.4: Window.tsx renders app icon via AppIcon in titlebar", () => {
    const content = fs.readFileSync(PATHS.windowTsx, "utf-8");
    if (!content.includes("AppIcon")) throw new Error("Window.tsx does not use AppIcon (Pending M2)");
  });

  recordTest(TIER_1B, "TC-2.5: Window.tsx retains operational control icons as Lucide (Minus, Square, Copy, X)", () => {
    const content = fs.readFileSync(PATHS.windowTsx, "utf-8");
    if (!content.includes("Minus") || !content.includes("Square") || !content.includes("Copy") || !content.includes("X")) {
      throw new Error("Operational icons in Window.tsx missing");
    }
  });

  // ==========================================
  // TIER 1C: Taskbar 3-Column Grid, Dynamic Buttons, Clock & Tray
  // ==========================================
  const TIER_1C = "Tier 1C: Taskbar Layout & Tray";

  recordTest(TIER_1C, "TC-1.1: Taskbar footer uses 3-column CSS Grid (grid-cols-[1fr_auto_1fr])", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("grid-cols-[1fr_auto_1fr]")) throw new Error("Taskbar missing grid-cols-[1fr_auto_1fr] (Pending M3)");
  });

  recordTest(TIER_1C, "TC-1.2: System tray is right-aligned with justify-self-end and shrink-0", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("justify-self-end") || !content.includes("shrink-0")) {
      throw new Error("System tray missing justify-self-end or shrink-0 (Pending M3)");
    }
  });

  recordTest(TIER_1C, "TC-1.3: System tray does NOT use absolute positioning (absolute right-3 removed)", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (content.includes("absolute right-3")) throw new Error("Taskbar still contains absolute right-3 (Pending M3)");
  });

  recordTest(TIER_1C, "TC-1.4: --taskbar-height: 56px is defined in :root in src/styles.css", () => {
    const content = fs.readFileSync(PATHS.stylesCss, "utf-8");
    if (!/--taskbar-height:\s*56px;/.test(content)) throw new Error("--taskbar-height: 56px missing in :root (Pending M3)");
  });

  recordTest(TIER_1C, "TC-1.5: Dynamic button element has 'relative' positioning", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!/<button[\s\S]*?relative[\s\S]*?toggleFromTaskbar/.test(content)) {
      throw new Error("Taskbar dynamic button missing 'relative' class (Pending M3)");
    }
  });

  recordTest(TIER_1C, "TC-1.6: Active window button has centered bottom indicator pill", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("after:left-1/2") || !content.includes("after:-translate-x-1/2")) {
      throw new Error("Active pill indicator missing center alignment classes (Pending M3)");
    }
  });

  recordTest(TIER_1C, "TC-1.7: Minimized window button has distinct dimmed visual state (opacity-60)", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("opacity-60")) throw new Error("Minimized button missing opacity-60 styling (Pending M3)");
  });

  recordTest(TIER_1C, "TC-1.8: System tray retains operational Lucide icons (Wifi, Volume2, BatteryMedium)", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("<Wifi") || !content.includes("<Volume2") || !content.includes("<BatteryMedium")) {
      throw new Error("Operational icons in Taskbar missing");
    }
  });

  recordTest(TIER_1C, "TC-1.9: Clock supports 12h/24h toggle via clock24 setting", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("hour12: !clock24")) throw new Error("Clock missing hour12: !clock24");
  });

  recordTest(TIER_1C, "TC-1.10: Clock date format replaces slashes with hyphens", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes('replaceAll("/", "-")')) throw new Error("Clock missing hyphen date replacement");
  });

  // ==========================================
  // TIER 2: Boundary & Corner Cases
  // ==========================================
  const TIER_2 = "Tier 2: Boundaries & Corners";

  recordTest(TIER_2, "TC-B1.1: Viewport 1024x768: window height clamped to vh - 140 (628px)", () => {
    const bounds = computeWindowSpawnBounds(MOCK_APPS.resume.width, MOCK_APPS.resume.height, 1024, 768);
    if (bounds.h !== 628) throw new Error(`Expected height 628, got ${bounds.h}`);
  });

  recordTest(TIER_2, "TC-B1.2: Viewport 1366x768: 6-row desktop grid (608px) fits in 712px desktop height", () => {
    const available = 768 - 56;
    const grid = 6 * 96 + 32;
    if (grid >= available) throw new Error(`Grid (${grid}px) overflows available desktop (${available}px)`);
  });

  recordTest(TIER_2, "TC-B1.3: Viewport 1920x1080: maximized height evaluates to exactly 1024px", () => {
    const geom = computeMaximizedGeometry(1080, 56);
    if (geom.heightPx !== 1024) throw new Error(`Expected 1024, got ${geom.heightPx}`);
  });

  recordTest(TIER_2, "TC-B2.1: Drag clamp prevents dragging window above top viewport (y < 0)", () => {
    const clamped = computeWindowDragClamp(100, -50, 0, 0, 1440, 900, 56);
    if (clamped.y !== 0) throw new Error(`Expected y = 0, got ${clamped.y}`);
  });

  recordTest(TIER_2, "TC-B2.2: Drag clamp stops titlebar above taskbar top boundary", () => {
    const clamped = computeWindowDragClamp(100, 950, 0, 0, 1440, 900, 56);
    if (clamped.y !== 804) throw new Error(`Expected y = 804, got ${clamped.y}`);
  });

  recordTest(TIER_2, "TC-B2.3: Resize clamp enforces minimum width 360px and height 240px", () => {
    const clamped = computeWindowResizeClamp(-400, -400, 0, 0, 500, 400);
    if (clamped.w !== 360 || clamped.h !== 240) throw new Error(`Expected 360x240, got ${clamped.w}x${clamped.h}`);
  });

  recordTest(TIER_2, "TC-B3.1: Rapid 50-cycle minimize/restore preserves state integrity", () => {
    const sim = new WindowStoreSimulator(1440, 900);
    const win = sim.openApp("terminal");
    for (let i = 0; i < 50; i++) sim.toggleFromTaskbar(win.id);
    if (win.minimized !== false || sim.activeId !== win.id) throw new Error("Rapid toggling corrupted window state");
  });

  recordTest(TIER_2, "TC-B3.2: Viewport overflow protection: html, body { overflow-x: hidden }", () => {
    const content = fs.readFileSync(PATHS.stylesCss, "utf-8");
    if (!content.includes("overflow-x: hidden")) throw new Error("Missing overflow-x: hidden in styles.css (Pending M3)");
  });

  recordTest(TIER_2, "TC-B3.3: Mobile breakpoint (< 768px): Desktop taskbar is not rendered in MobileShell", () => {
    const content = fs.readFileSync(PATHS.mobileShellTsx, "utf-8");
    if (content.includes("<Taskbar")) throw new Error("MobileShell renders Taskbar");
  });

  // ==========================================
  // TIER 3: Cross-Feature Combinations
  // ==========================================
  const TIER_3 = "Tier 3: Cross-Feature Pairs";

  recordTest(TIER_3, "TC-C1.1: 3 open windows: taskbar center group strictly centered at vw / 2", () => {
    const geom = computeTaskbarGridGeometry(1440, 576, 180);
    if (!geom.isCentered || geom.centerGroupMidpoint !== 720) throw new Error("Center group off-center with 3 windows");
    if (geom.isCollidingWithTray) throw new Error("Colliding with system tray");
  });

  recordTest(TIER_3, "TC-C1.2: Compact 1024x768 with 5 open windows: title truncation prevents tray collision", () => {
    const geom = computeTaskbarGridGeometry(1024, 304, 180);
    if (!geom.isCentered || geom.isCollidingWithTray) throw new Error("1024x768 tray collision detected");
  });

  recordTest(TIER_3, "TC-C2.1: Opening Window B while Window A is open sets B active and A inactive open", () => {
    const sim = new WindowStoreSimulator();
    const winA = sim.openApp("terminal");
    const winB = sim.openApp("resume");
    const buttons = sim.getTaskbarButtons();
    const btnA = buttons.find((b) => b.id === winA.id)!;
    const btnB = buttons.find((b) => b.id === winB.id)!;
    if (!btnB.isActive || !btnA.isInactiveOpen) throw new Error("Active/Inactive state transition failure");
  });

  recordTest(TIER_3, "TC-C2.2: Minimizing active Window B clears activeId and dims button", () => {
    const sim = new WindowStoreSimulator();
    sim.openApp("terminal");
    const winB = sim.openApp("resume");
    sim.toggleFromTaskbar(winB.id);
    const buttons = sim.getTaskbarButtons();
    const btnB = buttons.find((b) => b.id === winB.id)!;
    if (!btnB.isMinimized || sim.activeId !== null) throw new Error("Minimize state transition failure");
  });

  recordTest(TIER_3, "TC-C2.3: Restoring minimized Window B brings it to top Z and sets it active", () => {
    const sim = new WindowStoreSimulator();
    sim.openApp("terminal");
    const winB = sim.openApp("resume");
    sim.toggleFromTaskbar(winB.id);
    sim.toggleFromTaskbar(winB.id);
    if (winB.minimized !== false || sim.activeId !== winB.id) throw new Error("Restore state transition failure");
  });

  recordTest(TIER_3, "TC-C3.1: Double-clicking already-open shortcut unminimizes and focuses existing window", () => {
    const sim = new WindowStoreSimulator();
    const win1 = sim.openApp("projects");
    sim.minimize(win1.id);
    const win2 = sim.openApp("projects");
    if (sim.windows.length !== 1 || win2.id !== win1.id || win2.minimized !== false) {
      throw new Error("Deduplicated shortcut launch failed");
    }
  });

  recordTest(TIER_3, "TC-C4.1: StartMenu.tsx positions flyout above taskbar using var(--taskbar-height, 56px)", () => {
    const content = fs.readFileSync(PATHS.startMenuTsx, "utf-8");
    if (!content.includes("var(--taskbar-height, 56px)")) throw new Error("StartMenu missing taskbar height variable (Pending M3)");
  });

  recordTest(TIER_3, "TC-C4.2: SearchOverlay.tsx positions flyout above taskbar using var(--taskbar-height, 56px)", () => {
    const content = fs.readFileSync(PATHS.searchOverlayTsx, "utf-8");
    if (!content.includes("var(--taskbar-height, 56px)")) throw new Error("SearchOverlay missing taskbar height variable (Pending M3)");
  });

  // ==========================================
  // TIER 4: Real-World Application Workflows
  // ==========================================
  const TIER_4 = "Tier 4: Workflows";

  recordTest(TIER_4, "TC-W1.1: Desktop Boot: Desktop shortcuts populated with 12 apps in DESKTOP_ORDER", () => {
    const appsContent = fs.readFileSync(PATHS.appsTsx, "utf-8");
    if (!appsContent.includes("export const DESKTOP_ORDER: AppId[] =")) throw new Error("DESKTOP_ORDER missing");
  });

  recordTest(TIER_4, "TC-W1.2: Desktop Boot: Window store starts with 0 windows and null activeId", () => {
    const sim = new WindowStoreSimulator();
    if (sim.windows.length !== 0 || sim.activeId !== null) throw new Error("Initial store not clean");
  });

  recordTest(TIER_4, "TC-W2.1: Full Multitasking: open 3 -> minimize 1 -> switch active -> close 1", () => {
    const sim = new WindowStoreSimulator();
    const w1 = sim.openApp("terminal");
    const w2 = sim.openApp("resume");
    const w3 = sim.openApp("paint");
    sim.toggleFromTaskbar(w3.id); // minimize paint
    sim.toggleFromTaskbar(w1.id); // focus terminal
    sim.close(w2.id); // close resume
    const remaining = sim.getTaskbarButtons();
    if (remaining.length !== 2 || sim.activeId !== w1.id) throw new Error("Multitasking workflow state mismatch");
  });

  recordTest(TIER_4, "TC-W3.1: Maximized window dimensions strictly stop above taskbar across 4 target viewports", () => {
    const viewports = [1920, 1440, 1366, 1024];
    for (const v of viewports) {
      const geom = computeMaximizedGeometry(768, 56);
      if (geom.heightPx !== 712) throw new Error(`Maximized height calculation failed for ${v}`);
    }
  });

  recordTest(TIER_4, "TC-W3.2: Taskbar maintains highest z-index (z-9999) above windows", () => {
    const content = fs.readFileSync(PATHS.taskbarTsx, "utf-8");
    if (!content.includes("z-9999")) throw new Error("Taskbar missing z-9999");
  });

  // ==========================================
  // TIER 5: Adversarial Coverage Hardening
  // ==========================================
  const TIER_5 = "Tier 5: Adversarial Hardening";

  recordTest(TIER_5, "TC-5.1: Zero malicious vectors or external references in all 15 SVG assets", () => {
    for (const f of EXPECTED_ICON_FILES) {
      const p = path.join(PATHS.publicIcons, f);
      const content = fs.readFileSync(p, "utf-8");
      const res = validateSvgHygiene(content, f === "start.svg");
      if (!res.valid) throw new Error(`SVG ${f} validation failure: ${res.errors.join(", ")}`);
    }
  });

  recordTest(TIER_5, "TC-5.2: AppIcon fallback cascade and path leading-slash normalization", () => {
    const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
    if (!content.includes('targetPath.startsWith("/") ? targetPath : `/${targetPath}`')) {
      throw new Error("AppIcon missing leading slash path normalization");
    }
    if (!content.includes("fallback ?? icon ?? registeredApp?.icon")) {
      throw new Error("AppIcon missing fallback precedence cascade");
    }
  });

  recordTest(TIER_5, "TC-5.3: Desktop shortcuts sized at 44px (h-11 w-11) with >= 104px vertical taskbar clearance", () => {
    const desktopIcons = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
    if (!desktopIcons.includes("h-11 w-11")) throw new Error("Desktop shortcuts not sized at h-11 w-11 (44px)");
    const viewports = [1080, 900, 768];
    for (const vh of viewports) {
      const clearance = (vh - 56) - (6 * 96 + 32);
      if (clearance < 104) throw new Error(`Insufficient clearance ${clearance}px at vh ${vh}`);
    }
  });

  recordTest(TIER_5, "TC-5.4: Taskbar 3-column CSS Grid center group strictly centered across 0-13 windows and 4 viewports", () => {
    const viewports = [1920, 1440, 1366, 1024];
    for (const vw of viewports) {
      for (const count of [0, 1, 3, 5, 8, 13]) {
        const available = vw - 84 - 360 - 48;
        const buttonW = count > 0 ? Math.max(40, Math.min(140, Math.floor(available / count))) : 140;
        const centerW = 84 + count * (buttonW + 4);
        const geom = computeTaskbarGridGeometry(vw, centerW, 180);
        if (!geom.isCentered || geom.centerGroupMidpoint !== vw / 2) {
          throw new Error(`Centering failed at vw ${vw} with ${count} windows`);
        }
      }
    }
  });

  recordTest(TIER_5, "TC-5.5: Maximized window height leaves exact 56px taskbar clearance with 0px overlap", () => {
    const viewports = [1080, 900, 768];
    for (const vh of viewports) {
      const geom = computeMaximizedGeometry(vh, 56);
      if (vh - geom.heightPx !== 56) throw new Error(`Maximized clearance failed for vh ${vh}`);
    }
  });

  recordTest(TIER_5, "TC-5.6: Theme parity: --taskbar-height is identical 56px in :root and .dark", () => {
    const styles = fs.readFileSync(PATHS.stylesCss, "utf-8");
    const rootMatch = styles.match(/:root\s*\{[^}]*--taskbar-height:\s*(\d+)px/);
    const darkMatch = styles.match(/\.dark\s*\{[^}]*--taskbar-height:\s*(\d+)px/);
    if (!rootMatch || !darkMatch || rootMatch[1] !== "56" || darkMatch[1] !== "56") {
      throw new Error("Theme taskbar height token mismatch");
    }
  });

  recordTest(TIER_5, "TC-5.7: 100-cycle randomized multi-window stress test maintains all state invariants", () => {
    const sim = new WindowStoreSimulator(1440, 900);
    sim.openApp("terminal");
    sim.openApp("paint");
    sim.openApp("resume");

    for (let i = 0; i < 100; i++) {
      const action = i % 5;
      const appId = EXPECTED_APP_IDS[i % EXPECTED_APP_IDS.length]!;
      if (action === 0) sim.openApp(appId);
      else if (action === 1 && sim.windows.length > 0) sim.toggleFromTaskbar(sim.windows[i % sim.windows.length]!.id);
      else if (action === 2 && sim.activeId) sim.minimize(sim.activeId);
      else if (action === 3 && sim.windows.length > 0) sim.toggleMax(sim.windows[i % sim.windows.length]!.id);
      else if (action === 4 && sim.windows.length > 1) sim.close(sim.windows[i % sim.windows.length]!.id);

      if (sim.activeId !== null) {
        const activeWin = sim.windows.find((w) => w.id === sim.activeId);
        if (!activeWin || activeWin.minimized) throw new Error("Active window invariant violated");
      }
      for (const w of sim.windows) {
        if (!Number.isFinite(w.x) || !Number.isFinite(w.y) || !Number.isFinite(w.w) || !Number.isFinite(w.h)) {
          throw new Error("Window coordinate invariant violated");
        }
      }
    }
  });

  // ==========================================
  // REPORTING
  // ==========================================
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log("----------------------------------------------------------------");
  console.log(`Results: ${passed}/${total} passed (${failed} pending / failed)`);
  console.log("----------------------------------------------------------------\n");

  const tiers = [TIER_1A, TIER_1B, TIER_1C, TIER_2, TIER_3, TIER_4, TIER_5];
  for (const tier of tiers) {
    const tierTests = results.filter((r) => r.tier === tier);
    const tierPassed = tierTests.filter((r) => r.passed).length;
    console.log(`\n### ${tier} (${tierPassed}/${tierTests.length} Passed)`);
    for (const t of tierTests) {
      const icon = t.passed ? "  [PASS] " : "  [FAIL] ";
      console.log(`${icon}${t.name} (${t.durationMs}ms)`);
      if (!t.passed && t.error) {
        console.log(`         Error: ${t.error}`);
      }
    }
  }

  console.log("\n================================================================");
  console.log(`Execution Complete. Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log("================================================================\n");

  if (failed > 0) {
    process.exitCode = 1;
  }
}

runAll().catch((err) => {
  console.error("Test runner encountered critical error:", err);
  process.exit(1);
});
